package org.example;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.*;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;

@WebServlet("/database")
public class DatabaseServlet extends HttpServlet {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        try{
            String queryType = request.getParameter("queryType");

            Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");
            Statement st = db.createStatement();
            String sql = null;
            String ID = "";
            StringBuilder sqlBuilder = null;
            String hotelChain = "";
            String hotelNum = "";
            String maxPrice = "";
            String guests = "";
            String attraction = "";
            String roomNumber = "";
            String Price = "";
            String maxCap = "";
            String amenities = "";
            String damage = "";
            String roomNum = "";
            boolean extend = false;
            boolean occupied = false;
            boolean booked = false;


            //Case handling for SQL command building
            switch (queryType){
                case "GetChainNames":
                    sql = "SELECT \"Chain_Name\", \"Address\" FROM \"Hotel_Chain\"";
                    break;

                case "GetContacts":
                    sql = "SELECT \"Chain_Name\", \"Phone\" FROM \"Hotel_Chain\";";
                    break;

                case "getAllRooms":
                    hotelNum = request.getParameter("hotelNum");
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("SELECT r.\"Hotel_Num\", r.\"Room_Num\", r.\"Price\", r.\"Amenities\", r.\"Capacity\", r.\"View\" ");
                    sqlBuilder.append("FROM \"Room\" r ");
                    sqlBuilder.append("JOIN \"Hotel\" h ON r.\"Hotel_Num\" = h.\"Hotel_Num\" ");
                    sqlBuilder.append("JOIN \"Owns\" o ON h.\"Hotel_Num\" = o.\"Hotel_Num\" ");
                    sqlBuilder.append("WHERE o.\"Hotel_Num\" = '").append(hotelNum).append("' ");
                    sql = sqlBuilder.toString();
                    break;

                case "SearchRooms":
                    hotelChain = request.getParameter("hotelChain");
                    maxPrice = request.getParameter("maxPrice");
                    guests = request.getParameter("guests");
                    attraction = request.getParameter("attraction");
                    // Build the SQL query with parameters
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("SELECT r.\"Hotel_Num\", r.\"Room_Num\", r.\"Price\", r.\"Amenities\", r.\"Capacity\", r.\"View\" ");
                    sqlBuilder.append("FROM \"Room\" r ");
                    sqlBuilder.append("JOIN \"Hotel\" h ON r.\"Hotel_Num\" = h.\"Hotel_Num\" ");
                    sqlBuilder.append("JOIN \"Owns\" o ON h.\"Hotel_Num\" = o.\"Hotel_Num\" ");
                    sqlBuilder.append("WHERE o.\"Chain_Name\" = '").append(hotelChain).append("' ");
                    sqlBuilder.append("AND r.\"Booked\" = FALSE ");
                    // Add filter for price if provided
                    if (maxPrice != null && !maxPrice.isEmpty()) {
                        sqlBuilder.append("AND r.\"Price\" <= ").append(maxPrice).append(" ");
                    }
                    // Add filter for capacity if guests parameter is provided
                    if (guests != null && !guests.isEmpty()) {
                        sqlBuilder.append("AND r.\"Capacity\" >= ").append(guests).append(" ");
                    }
                    // Add filter for view/attraction if provided
                    if (attraction != null && !attraction.isEmpty()) {
                        if (attraction.equals("Mountains")) {
                            sqlBuilder.append("AND r.\"View\" = 'mountain' ");
                        } else if (attraction.equals("Beach")) {
                            sqlBuilder.append("AND r.\"View\" = 'sea' ");
                        } else {
                            sqlBuilder.append("AND r.\"View\" = 'other' ");
                        }
                    }
                    // Order by price
                    sqlBuilder.append("ORDER BY r.\"Price\" ASC");
                    sql = sqlBuilder.toString();
                    break;

                case "checkID":
                    ID = request.getParameter("ID");
                    sql = "SELECT EXISTS ( SELECT 1 FROM \"Person\" WHERE \"ID\" = '" + ID + "' );";
                    break;
                case "checkEmpID":
                    ID = request.getParameter("ID");
                    sql = "SELECT EXISTS ( SELECT 1 FROM \"Employee\" WHERE \"ID\" = '" + ID + "' );";
                    break;
                case "searchHotelNum":
                    sql = "SELECT \"Hotel_Num\" FROM \"Hotel\"";
                    break;
                case "add_update_rooms":
                    hotelNum = request.getParameter("hotelNum_Selection");
                    roomNumber = request.getParameter("roomNumInput");
                    Price = request.getParameter("priceInput");
                    maxCap = request.getParameter("capacityInput");
                    amenities = "'" + request.getParameter("amenitiesInput") + "'";
                    extend = Boolean.parseBoolean(request.getParameter("extendableInput"));
                    occupied = Boolean.parseBoolean(request.getParameter("occupiedInput"));
                    booked = Boolean.parseBoolean(request.getParameter("bookedInput"));
                    attraction = "'" + request.getParameter("viewInput") + "'";
                    damage = null;
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("INSERT INTO \"Room\" (\"Hotel_Num\", \"Room_Num\", \"Booked\", \"Occupied\", \"Price\", \"Amenities\", \"Capacity\", \"View\", \"Extend\", \"Damage\") ");
                    sqlBuilder.append("VALUES (").append(hotelNum).append(",");
                    sqlBuilder.append(roomNumber).append(",");
                    sqlBuilder.append(booked).append(",");
                    sqlBuilder.append(occupied).append(",");
                    sqlBuilder.append(Price).append(",");
                    sqlBuilder.append(amenities).append(",");
                    sqlBuilder.append(maxCap).append(",");
                    sqlBuilder.append(attraction).append(",");
                    sqlBuilder.append(extend).append(",");
                    sqlBuilder.append(damage).append(") ");
                    sqlBuilder.append("""
                            ON CONFLICT ("Hotel_Num", "Room_Num")\s
                            DO UPDATE SET\s
                              "Booked" = EXCLUDED."Booked",
                              "Occupied" = EXCLUDED."Occupied",
                              "Price" = EXCLUDED."Price",
                              "Amenities" = EXCLUDED."Amenities",
                              "Capacity" = EXCLUDED."Capacity",
                              "View" = EXCLUDED."View",
                              "Extend" = EXCLUDED."Extend",
                              "Damage" = EXCLUDED."Damage";""");

                    sql = sqlBuilder.toString();
                    break;

                case "deleteRoom":
                    hotelNum = request.getParameter("hotelNum_Selection");
                    roomNumber = request.getParameter("roomNumInput");
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("DELETE FROM \"Room\" WHERE \"Hotel_Num\" = ").append(hotelNum).append(" And \"Room_Num\" = ").append(roomNumber);
                    sql = sqlBuilder.toString();
                    break;

                case "deletePerson":
                    ID = request.getParameter("ID");
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("DELETE FROM \"Customer\" WHERE \"ID\" = '").append(ID).append("'; \n");
                    sqlBuilder.append("DELETE FROM \"Manager\" WHERE \"ID\" = '").append(ID).append("'; \n");
                    sqlBuilder.append("DELETE FROM \"Employee\" WHERE \"ID\" = '").append(ID).append("'; \n");
                    sqlBuilder.append("DELETE FROM \"Person\" WHERE \"ID\" = '").append(ID).append("'; \n");
                    sql = sqlBuilder.toString();
                    break;


                case "getPeople":
                    sql = """
                            SELECT
                                p."ID" AS Person_ID,
                                p."Name" AS Person_Name,
                                p."Address" AS Person_Address,
                                p."ID_Type",
                                c."Register_Date",
                                e."Role" AS Employee_Role,
                                m."Hotel_Num" AS Manager_HotelNum
                            FROM
                                "Person" p
                            LEFT OUTER JOIN
                                "Customer" c ON p."ID" = c."ID"
                            LEFT OUTER JOIN
                                "Employee" e ON p."ID" = e."ID"
                            LEFT OUTER JOIN
                                "Manager" m ON e."ID" = m."ID";
                            """;
                    break;

                case "book":
                    ID = "'" + request.getParameter("ID") + "'";
                    hotelNum = request.getParameter("HotelNum");
                    roomNum = request.getParameter("RoomNum");
                    String bookDate = "'" + request.getParameter("BookDate") + "'";
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("INSERT INTO \"Archive\" (\"Date\") VALUES (");
                    sqlBuilder.append(bookDate).append("); \n");
                    sqlBuilder.append("INSERT INTO \"Book\" (\"Arch_No\" ,\"Hotel_Num\", \"Room_Num\", \"Customer_ID\", \"Date\") VALUES (");
                    sqlBuilder.append("(SELECT \"Arch_No\" FROM \"Archive\" ORDER BY \"Arch_No\" DESC LIMIT 1), ");
                    sqlBuilder.append(hotelNum).append(",");
                    sqlBuilder.append(roomNum).append(",");
                    sqlBuilder.append(ID).append(",");
                    sqlBuilder.append(bookDate).append("); ");
                    sql = sqlBuilder.toString();
                    break;

                case "checkIn":
                    String Cust_ID = "'" + request.getParameter("Cust_ID") + "'";
                    String Emp_ID = "'" + request.getParameter("Emp_ID") + "'";
                    String archNo =  request.getParameter("ArchNo");
                    sqlBuilder = new StringBuilder();
                    sqlBuilder.append("INSERT INTO \"CheckIn\" (\"Customer_ID\" ,\"Arch_No\", \"Employee_ID\", \"Hotel_Num\", \"Room_Num\" ,\"Date\") VALUES (");
                    sqlBuilder.append(Cust_ID).append(",");
                    sqlBuilder.append("'").append(archNo).append("',");
                    sqlBuilder.append(Emp_ID).append(",");
                    sqlBuilder.append("(SELECT \"Hotel_Num\" FROM \"Book\" WHERE \"Arch_No\" = ").append(archNo).append("),");
                    sqlBuilder.append("(SELECT \"Room_Num\" FROM \"Book\" WHERE \"Arch_No\" = ").append(archNo).append("),");
                    sqlBuilder.append("(SELECT \"Date\" FROM \"Book\" WHERE \"Arch_No\" = ").append(archNo).append("));");
                    sql = sqlBuilder.toString();
                    break;
            }


            ResultSet rs = st.executeQuery(sql);
            ArrayNode jsonArray = convertResultSetToJson(rs);
            response.getWriter().write(objectMapper.writeValueAsString(jsonArray));


            rs.close();
            st.close();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Handle POST requests here
        response.setContentType("application/json;charset=UTF-8");
        Connection db = null;
        PreparedStatement pstmt = null;
        String ID = "";
        String Name = "";
        String Address = "";
        String ID_Type = "";
        String Role = "";
        String sql = "";
        Date sqlDate = null;
        try{
            String queryType = request.getParameter("queryType");

            db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");

            switch (queryType){
                case "RegEmployee":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");
                    Role = request.getParameter("Role");

                    sql = "INSERT INTO \"Person\" (\"ID\", \"Name\", \"Address\", \"ID_Type\") VALUES (?, ?, ?, ?);\n  INSERT INTO \"Employee\" (\"ID\", \"Name\", \"Address\", \"Role\") VALUES (?, ?, ?, ?);";

                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);
                    pstmt.setString(5, ID);
                    pstmt.setString(6, Name);
                    pstmt.setString(7, Address);
                    pstmt.setString(8, Role);
                    break;

                case "RegUser":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");

                    sql = "INSERT INTO \"Person\" (\"ID\", \"Name\", \"Address\", \"ID_Type\") VALUES (?, ?, ?, ?);\n  INSERT INTO \"Customer\" (\"ID\", \"Register_Date\") VALUES (?, ?);";

                    LocalDate currentDate = LocalDate.now();
                    String formattedDate = currentDate.format(DateTimeFormatter.ISO_DATE); // 'YYYY-MM-DD'
                    sqlDate = Date.valueOf(formattedDate);

                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);
                    pstmt.setString(5, ID);
                    pstmt.setDate(6, sqlDate);

                    break;

                case "Add_Mod_Manager":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");
                    Role = request.getParameter("Role");
                    int hotelNo = Integer.parseInt(request.getParameter("hotelNo"));

                    sql = """
                            INSERT INTO "Person" ("ID", "Name", "Address", "ID_Type")
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT ("ID") DO UPDATE SET
                                "Name" = EXCLUDED."Name",
                                "Address" = EXCLUDED."Address",
                                "ID_Type" = EXCLUDED."ID_Type";
                            
                            INSERT INTO "Employee" ("ID", "Name", "Address", "Role")
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT ("ID") DO UPDATE SET
                                "Name" = EXCLUDED."Name",
                                "Address" = EXCLUDED."Address",
                                "Role" = EXCLUDED."Role";
                                
                            INSERT INTO "Manager" ("ID", "Name", "Address", "Hotel_Num") 
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT ("ID") DO UPDATE SET
                                "Name" = EXCLUDED."Name",
                                "Address" = EXCLUDED."Address",
                                "Hotel_Num" = EXCLUDED."Hotel_Num"
                            """;

                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);
                    pstmt.setString(5, ID);
                    pstmt.setString(6, Name);
                    pstmt.setString(7, Address);
                    pstmt.setString(8, Role);
                    pstmt.setString(9, ID);
                    pstmt.setString(10, Name);
                    pstmt.setString(11, Address);
                    pstmt.setInt(12, hotelNo);
                    break;


                case "Add_Mod_Employee":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");
                    Role = request.getParameter("Role");

                    sql = """
                            INSERT INTO "Person" ("ID", "Name", "Address", "ID_Type")
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT ("ID") DO UPDATE SET
                                "Name" = EXCLUDED."Name",
                                "Address" = EXCLUDED."Address",
                                "ID_Type" = EXCLUDED."ID_Type";
                            
                            INSERT INTO "Employee" ("ID", "Name", "Address", "Role")
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT ("ID") DO UPDATE SET
                                "Name" = EXCLUDED."Name",
                                "Address" = EXCLUDED."Address",
                                "Role" = EXCLUDED."Role";""";

                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);
                    pstmt.setString(5, ID);
                    pstmt.setString(6, Name);
                    pstmt.setString(7, Address);
                    pstmt.setString(8, Role);
                    break;

                case "Add_Mod_User":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");
                    String date = request.getParameter("date");

                    sql = """
                            INSERT INTO "Person" ("ID", "Name", "Address", "ID_Type")
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT ("ID") DO UPDATE SET
                                "Name" = EXCLUDED."Name",
                                "Address" = EXCLUDED."Address",
                                "ID_Type" = EXCLUDED."ID_Type";
                            
                            INSERT INTO "Customer" ("ID", "Register_Date")
                            VALUES (?, ?)
                            ON CONFLICT ("ID")
                            DO UPDATE SET "Register_Date" = EXCLUDED."Register_Date";""";

                    sqlDate = Date.valueOf(date);
                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);
                    pstmt.setString(5, ID);
                    pstmt.setDate(6, sqlDate);
                    break;

                case "PostSomethingElse":
                    // Handle other query types with PreparedStatement as well
                    break;
            }

            if (pstmt != null) {
                pstmt.executeUpdate(); // Use executeUpdate for INSERT, UPDATE, DELETE
            }

        }
        catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            // Close resources in a finally block to ensure they are always closed
            try {
                if (pstmt != null) pstmt.close();
                if (db != null) db.close();
            } catch (SQLException ex) {
                ex.printStackTrace(); // Log any errors during closing
            }
        }
    }


    private ArrayNode convertResultSetToJson(ResultSet resultSet) throws SQLException {
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();
        ArrayNode jsonArray = objectMapper.createArrayNode();

        while (resultSet.next()) {
            ObjectNode jsonObject = objectMapper.createObjectNode();
            for (int i = 1; i <= columnCount; i++) {
                String columnName = metaData.getColumnName(i);
                Object columnValue = resultSet.getObject(i);
                jsonObject.putPOJO(columnName, columnValue); // Handles various data types
            }
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }
}