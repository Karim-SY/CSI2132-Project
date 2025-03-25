-- HOTEL DATABASE MODIFICATIONS
-- This file contains triggers, indexes, and views for the hotel management database

-- =============================
-- PART 1: TRIGGERS 
-- =============================

-- TRIGGER 1: Room Status Management
-- This trigger ensures that when a room is booked, its "Booked" status is automatically set to TRUE
-- It also prevents booking rooms that are already booked or damaged

CREATE OR REPLACE FUNCTION manage_room_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the room is already booked
    IF EXISTS (
        SELECT 1 FROM "Room" 
        WHERE "Hotel_Num" = NEW."Hotel_Num" 
        AND "Room_Num" = NEW."Room_Num" 
        AND "Booked" = TRUE
    ) THEN
        RAISE EXCEPTION 'Room % in Hotel % is already booked', NEW."Room_Num", NEW."Hotel_Num";
    END IF;
    
    -- Check if the room has damage that prevents booking
    IF EXISTS (
        SELECT 1 FROM "Room" 
        WHERE "Hotel_Num" = NEW."Hotel_Num" 
        AND "Room_Num" = NEW."Room_Num" 
        AND "Damage" IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Room % in Hotel % has reported damage and cannot be booked', NEW."Room_Num", NEW."Hotel_Num";
    END IF;
    
    -- Update the room status to booked
    UPDATE "Room"
    SET "Booked" = TRUE
    WHERE "Hotel_Num" = NEW."Hotel_Num" 
    AND "Room_Num" = NEW."Room_Num";
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that calls this function after inserting a new booking
CREATE OR REPLACE TRIGGER room_booking_status_trigger
AFTER INSERT ON "Book"
FOR EACH ROW
EXECUTE FUNCTION manage_room_status();

-- Create a complementary trigger function for when bookings are deleted
CREATE OR REPLACE FUNCTION reset_room_status()
RETURNS TRIGGER AS $$
BEGIN
    -- When a booking is deleted, set the room as not booked
    UPDATE "Room"
    SET "Booked" = FALSE,
        "Occupied" = FALSE  -- Also ensure it's not occupied
    WHERE "Hotel_Num" = OLD."Hotel_Num" 
    AND "Room_Num" = OLD."Room_Num";
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for when bookings are deleted
CREATE OR REPLACE TRIGGER room_booking_delete_trigger
AFTER DELETE ON "Book"
FOR EACH ROW
EXECUTE FUNCTION reset_room_status();

-- TRIGGER 2: Hotel Chain Statistics Management
-- This trigger keeps the "Num_Hotels" count in the "Hotel_Chain" table accurate
-- whenever hotels are added or removed from a chain

CREATE OR REPLACE FUNCTION update_hotel_chain_count()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT operations
    IF (TG_OP = 'INSERT') THEN
        -- Increment the hotel count for the chain
        UPDATE "Hotel_Chain"
        SET "Num_Hotels" = "Num_Hotels" + 1
        WHERE "Chain_Name" = NEW."Chain_Name";
        
        RETURN NEW;
    -- For DELETE operations
    ELSIF (TG_OP = 'DELETE') THEN
        -- Decrement the hotel count for the chain
        UPDATE "Hotel_Chain"
        SET "Num_Hotels" = "Num_Hotels" - 1
        WHERE "Chain_Name" = OLD."Chain_Name";
        
        RETURN OLD;
    -- For UPDATE operations (if chain ownership changes)
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Decrement count for old chain
        UPDATE "Hotel_Chain"
        SET "Num_Hotels" = "Num_Hotels" - 1
        WHERE "Chain_Name" = OLD."Chain_Name";
        
        -- Increment count for new chain
        UPDATE "Hotel_Chain"
        SET "Num_Hotels" = "Num_Hotels" + 1
        WHERE "Chain_Name" = NEW."Chain_Name";
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for insert, update, and delete operations on the Owns table
CREATE OR REPLACE TRIGGER hotel_chain_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Owns"
FOR EACH ROW
EXECUTE FUNCTION update_hotel_chain_count();

-- =============================
-- PART 2: DATABASE INDEXES
-- =============================

-- INDEX 1: Room Availability Index
-- Justification: The system frequently needs to find available rooms, so indexing on the Booked status
-- will significantly improve the performance of queries that search for available rooms.
CREATE INDEX idx_room_availability ON "Room" ("Hotel_Num", "Booked");

-- INDEX 2: Customer Search Index
-- Justification: Customer lookups by ID are common operations in the booking process,
-- so this index will speed up customer-related queries.
CREATE INDEX idx_customer_id ON "Customer" ("ID");

-- INDEX 3: Booking Date Range Index
-- Justification: Date-based searches are common in hotel systems (finding bookings for specific dates),
-- so this index will accelerate queries that filter by booking dates.
CREATE INDEX idx_booking_dates ON "Book" ("Date");

-- INDEX 4: Room Price Index
-- Justification: Searches for rooms within specific price ranges are frequent,
-- this index will improve performance of price-based filtering.
CREATE INDEX idx_room_price ON "Room" ("Price");

-- INDEX 5: Hotel Location Index
-- Justification: Users often search for hotels by location, so indexing on address
-- will improve performance for location-based queries.
CREATE INDEX idx_hotel_location ON "Hotel" ("Address");

-- =============================
-- PART 3: DATABASE VIEWS
-- =============================

-- VIEW 1: Number of Available Rooms Per Area
-- Note: This view is already in the database as shown in the dump, but recreating for completeness
DROP VIEW IF EXISTS available_rooms_per_area;
CREATE VIEW available_rooms_per_area AS
SELECT h."Address", count(r."Room_Num") AS available_rooms
FROM "Hotel" h
JOIN "Room" r ON h."Hotel_Num" = r."Hotel_Num"
WHERE r."Booked" = FALSE
GROUP BY h."Address";

-- VIEW 2: Aggregated Capacity of All Rooms in Each Hotel
CREATE VIEW hotel_capacity AS
SELECT h."Hotel_Num", h."Address", SUM(r."Capacity") AS total_capacity
FROM "Hotel" h
JOIN "Room" r ON h."Hotel_Num" = r."Hotel_Num"
GROUP BY h."Hotel_Num", h."Address";

-- ADDITIONAL VIEW 3: Hotel Revenue Potential
-- This view shows the potential revenue of each hotel if all rooms were booked
CREATE VIEW hotel_revenue_potential AS
SELECT h."Hotel_Num", h."Address", SUM(r."Price") AS potential_daily_revenue
FROM "Hotel" h
JOIN "Room" r ON h."Hotel_Num" = r."Hotel_Num"
GROUP BY h."Hotel_Num", h."Address";

-- ADDITIONAL VIEW 4: Rooms With Amenities
-- This view lists all rooms with their amenities for easier searching
CREATE VIEW rooms_with_amenities AS
SELECT h."Hotel_Num", h."Address", r."Room_Num", r."Price", r."Amenities", r."View", r."Capacity"
FROM "Hotel" h
JOIN "Room" r ON h."Hotel_Num" = r."Hotel_Num"
ORDER BY h."Address", r."Price" DESC;