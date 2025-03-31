--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-03-18 20:12:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 17491)
-- Name: Archive; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Archive" (
    "Arch_No" integer NOT NULL,
    "Date" date
);


ALTER TABLE public."Archive" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17490)
-- Name: Archive_Arch_No_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Archive_Arch_No_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Archive_Arch_No_seq" OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 227
-- Name: Archive_Arch_No_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Archive_Arch_No_seq" OWNED BY public."Archive"."Arch_No";


--
-- TOC entry 230 (class 1259 OID 17523)
-- Name: Book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Book" (
    "Arch_No" integer NOT NULL,
    "Hotel_Num" integer,
    "Room_Num" integer NOT NULL,
    "Customer_ID" character varying(20) NOT NULL,
    "Date" date
);


ALTER TABLE public."Book" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17497)
-- Name: CheckIn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CheckIn" (
    "Customer_ID" character varying(20) NOT NULL,
    "Arch_No" integer NOT NULL,
    "Employee_ID" character varying(20),
    "Hotel_Num" integer,
    "Room_Num" integer NOT NULL,
    "Date" date,
    CONSTRAINT "CheckIn_check" CHECK ((("Customer_ID")::text <> ("Employee_ID")::text))
);


ALTER TABLE public."CheckIn" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17420)
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    "ID" character varying(20) NOT NULL,
    "Register_Date" date DEFAULT CURRENT_DATE,
    CONSTRAINT "Customer_Register_Date_check" CHECK (("Register_Date" <= CURRENT_DATE))
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17458)
-- Name: Damage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Damage" (
    "Damage_ID" integer NOT NULL,
    "Description" text
);


ALTER TABLE public."Damage" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17457)
-- Name: Damage_Damage_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Damage_Damage_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Damage_Damage_ID_seq" OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 224
-- Name: Damage_Damage_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Damage_Damage_ID_seq" OWNED BY public."Damage"."Damage_ID";


--
-- TOC entry 222 (class 1259 OID 17432)
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employee" (
    "ID" character varying(20) NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Address" character varying(255) NOT NULL,
    "Role" character varying(100)
);


ALTER TABLE public."Employee" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17389)
-- Name: Hotel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Hotel" (
    "Hotel_Num" integer NOT NULL,
    "Email" text,
    "Phone" text,
    "Stars" integer,
    "Num_Rooms" integer,
    "Address" text,
    CONSTRAINT "Hotel_Num_Rooms_check" CHECK (("Num_Rooms" > 0)),
    CONSTRAINT "Hotel_Stars_check" CHECK ((("Stars" >= 1) AND ("Stars" <= 5)))
);


ALTER TABLE public."Hotel" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17380)
-- Name: Hotel_Chain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Hotel_Chain" (
    "Chain_Name" character varying(255) NOT NULL,
    "Num_Hotels" integer,
    "Emails" character varying(255) NOT NULL,
    "Address" text,
    "Phone" character varying(20) NOT NULL,
    CONSTRAINT "Hotel_Chain_Num_Hotels_check" CHECK (("Num_Hotels" > 0)),
    CONSTRAINT "Hotel_Chain_Phone_check" CHECK ((("Phone")::text ~ '^[0-9+-]+$'::text))
);


ALTER TABLE public."Hotel_Chain" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17442)
-- Name: Manager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Manager" (
    "ID" character varying(20) NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Address" character varying(255) NOT NULL,
    "Hotel_Num" integer
);


ALTER TABLE public."Manager" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17398)
-- Name: Owns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Owns" (
    "Chain_Name" character varying(255) NOT NULL,
    "Hotel_Num" integer NOT NULL
);


ALTER TABLE public."Owns" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17413)
-- Name: Person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Person" (
    "ID" character varying(20) NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Address" character varying(255) NOT NULL,
    "ID_Type" character varying(50),
    CONSTRAINT "Person_ID_Type_check" CHECK ((("ID_Type")::text = ANY ((ARRAY['SSN'::character varying, 'SIN'::character varying, 'Driving License'::character varying])::text[]))),
    CONSTRAINT "Person_ID_check" CHECK ((("ID")::text ~ '^[A-Z0-9-]+$'::text))
);


ALTER TABLE public."Person" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17466)
-- Name: Room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room" (
    "Hotel_Num" integer NOT NULL,
    "Room_Num" integer NOT NULL,
    "Booked" boolean DEFAULT false,
    "Occupied" boolean DEFAULT false,
    "Price" numeric(10,2),
    "Amenities" text,
    "Capacity" integer,
    "View" text,
    "Extend" boolean DEFAULT true,
    "Damage" integer,
    CONSTRAINT "Room_Capacity_check" CHECK (("Capacity" > 0)),
    CONSTRAINT "Room_Price_check" CHECK (("Price" > (0)::numeric)),
    CONSTRAINT "Room_View_check" CHECK (("View" = ANY (ARRAY['sea'::text, 'mountain'::text, 'other'::text]))),
    CONSTRAINT "Room_check" CHECK ((NOT (("Booked" = false) AND ("Occupied" = true))))
);


ALTER TABLE public."Room" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17585)
-- Name: available_rooms_per_area; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.available_rooms_per_area AS
 SELECT h."Address",
    count(r."Room_Num") AS available_rooms
   FROM (public."Hotel" h
     JOIN public."Room" r ON ((h."Hotel_Num" = r."Hotel_Num")))
  WHERE (r."Booked" = false)
  GROUP BY h."Address";


ALTER VIEW public.available_rooms_per_area OWNER TO postgres;

--
-- TOC entry 4749 (class 2604 OID 17494)
-- Name: Archive Arch_No; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Archive" ALTER COLUMN "Arch_No" SET DEFAULT nextval('public."Archive_Arch_No_seq"'::regclass);


--
-- TOC entry 4745 (class 2604 OID 17461)
-- Name: Damage Damage_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Damage" ALTER COLUMN "Damage_ID" SET DEFAULT nextval('public."Damage_Damage_ID_seq"'::regclass);


--
-- TOC entry 4958 (class 0 OID 17491)
-- Dependencies: 228
-- Data for Name: Archive; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Archive" ("Arch_No", "Date") FROM stdin;
1	2024-03-10
2	2024-03-15
\.


--
-- TOC entry 4960 (class 0 OID 17523)
-- Dependencies: 230
-- Data for Name: Book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Book" ("Arch_No", "Hotel_Num", "Room_Num", "Customer_ID", "Date") FROM stdin;
1	101	2	CUST001	2024-03-10
2	103	1	CUST002	2024-03-15
\.


--
-- TOC entry 4959 (class 0 OID 17497)
-- Dependencies: 229
-- Data for Name: CheckIn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CheckIn" ("Customer_ID", "Arch_No", "Employee_ID", "Hotel_Num", "Room_Num", "Date") FROM stdin;
CUST001	1	EMP001	101	2	2024-03-10
CUST002	2	EMP002	103	1	2024-03-15
\.


--
-- TOC entry 4951 (class 0 OID 17420)
-- Dependencies: 221
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" ("ID", "Register_Date") FROM stdin;
CUST001	2024-02-01
CUST002	2024-02-15
\.


--
-- TOC entry 4955 (class 0 OID 17458)
-- Dependencies: 225
-- Data for Name: Damage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Damage" ("Damage_ID", "Description") FROM stdin;
1	Broken AC
2	Water Leakage
3	Damaged Furniture
\.


--
-- TOC entry 4952 (class 0 OID 17432)
-- Dependencies: 222
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Employee" ("ID", "Name", "Address", "Role") FROM stdin;
EMP001	Charles Brown	San Francisco, USA	Receptionist
EMP002	David Smith	Chicago, USA	Cleaner
MGR001	Edward Clark	Miami, USA	General Manager
\.


--
-- TOC entry 4948 (class 0 OID 17389)
-- Dependencies: 218
-- Data for Name: Hotel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Hotel" ("Hotel_Num", "Email", "Phone", "Stars", "Num_Rooms", "Address") FROM stdin;
101	ny1@luxury.com	+1-555-1011	5	5	New York, USA
102	ny2@luxury.com	+1-555-1012	4	5	New York, USA
103	la@budgetinn.com	+1-555-2021	3	5	Los Angeles, USA
104	sf@royalsuites.com	+1-555-3031	4	5	San Francisco, USA
105	chicago@global.com	+1-555-4041	4	5	Chicago, USA
\.


--
-- TOC entry 4947 (class 0 OID 17380)
-- Dependencies: 217
-- Data for Name: Hotel_Chain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Hotel_Chain" ("Chain_Name", "Num_Hotels", "Emails", "Address", "Phone") FROM stdin;
Luxury Stays	8	contact@luxury.com	New York, USA	+1-555-1010
Budget Inns	8	info@budgetinn.com	Los Angeles, USA	+1-555-2020
Royal Suites	8	hello@royalsuites.com	San Francisco, USA	+1-555-3030
Global Comfort	8	support@globalcomfort.com	Chicago, USA	+1-555-4040
Family Resorts	8	service@familyresorts.com	Miami, USA	+1-555-5050
\.


--
-- TOC entry 4953 (class 0 OID 17442)
-- Dependencies: 223
-- Data for Name: Manager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Manager" ("ID", "Name", "Address", "Hotel_Num") FROM stdin;
MGR001	Edward Clark	Miami, USA	105
\.


--
-- TOC entry 4949 (class 0 OID 17398)
-- Dependencies: 219
-- Data for Name: Owns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Owns" ("Chain_Name", "Hotel_Num") FROM stdin;
Luxury Stays	101
Luxury Stays	102
Budget Inns	103
Royal Suites	104
Global Comfort	105
\.


--
-- TOC entry 4950 (class 0 OID 17413)
-- Dependencies: 220
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Person" ("ID", "Name", "Address", "ID_Type") FROM stdin;
CUST001	Alice Johnson	New York, USA	SSN
CUST002	Bob Williams	Los Angeles, USA	SIN
EMP001	Charles Brown	San Francisco, USA	SSN
EMP002	David Smith	Chicago, USA	SIN
MGR001	Edward Clark	Miami, USA	SSN
\.


--
-- TOC entry 4956 (class 0 OID 17466)
-- Dependencies: 226
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Room" ("Hotel_Num", "Room_Num", "Booked", "Occupied", "Price", "Amenities", "Capacity", "View", "Extend", "Damage") FROM stdin;
101	1	f	f	200.00	TV, AC, Mini-Bar, double bed	2	sea	t	\N
101	2	t	f	250.00	TV, AC, Jacuzzi, double bed	2	mountain	t	1
102	1	f	f	120.00	TV, WiFi, double bed	2	other	t	\N
103	1	t	t	180.00	TV, AC, WiFi, double bed	3	sea	f	2
104	1	f	f	150.00	TV, AC, double bed	2	mountain	t	\N
105	1	t	f	300.00	TV, AC, Jacuzzi, WiFi, twin beds	4	sea	t	3
\.


--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 227
-- Name: Archive_Arch_No_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Archive_Arch_No_seq"', 6, true);


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 224
-- Name: Damage_Damage_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Damage_Damage_ID_seq"', 18, true);


--
-- TOC entry 4781 (class 2606 OID 17496)
-- Name: Archive Archive_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Archive"
    ADD CONSTRAINT "Archive_pkey" PRIMARY KEY ("Arch_No");


--
-- TOC entry 4785 (class 2606 OID 17527)
-- Name: Book Book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("Arch_No", "Room_Num", "Customer_ID");


--
-- TOC entry 4783 (class 2606 OID 17502)
-- Name: CheckIn CheckIn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("Customer_ID", "Room_Num", "Arch_No");


--
-- TOC entry 4771 (class 2606 OID 17426)
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4777 (class 2606 OID 17465)
-- Name: Damage Damage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Damage"
    ADD CONSTRAINT "Damage_pkey" PRIMARY KEY ("Damage_ID");


--
-- TOC entry 4773 (class 2606 OID 17436)
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4763 (class 2606 OID 17388)
-- Name: Hotel_Chain Hotel_Chain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Hotel_Chain"
    ADD CONSTRAINT "Hotel_Chain_pkey" PRIMARY KEY ("Chain_Name");


--
-- TOC entry 4765 (class 2606 OID 17397)
-- Name: Hotel Hotel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Hotel"
    ADD CONSTRAINT "Hotel_pkey" PRIMARY KEY ("Hotel_Num");


--
-- TOC entry 4775 (class 2606 OID 17446)
-- Name: Manager Manager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4767 (class 2606 OID 17402)
-- Name: Owns Owns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Owns"
    ADD CONSTRAINT "Owns_pkey" PRIMARY KEY ("Chain_Name", "Hotel_Num");


--
-- TOC entry 4769 (class 2606 OID 17419)
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4779 (class 2606 OID 17479)
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("Hotel_Num", "Room_Num");


--
-- TOC entry 4798 (class 2606 OID 17528)
-- Name: Book Book_Arch_No_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_Arch_No_fkey" FOREIGN KEY ("Arch_No") REFERENCES public."Archive"("Arch_No") ON DELETE CASCADE;


--
-- TOC entry 4799 (class 2606 OID 17533)
-- Name: Book Book_Customer_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_Customer_ID_fkey" FOREIGN KEY ("Customer_ID") REFERENCES public."Customer"("ID");


--
-- TOC entry 4800 (class 2606 OID 17538)
-- Name: Book Book_Hotel_Num_Room_Num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_Hotel_Num_Room_Num_fkey" FOREIGN KEY ("Hotel_Num", "Room_Num") REFERENCES public."Room"("Hotel_Num", "Room_Num");


--
-- TOC entry 4794 (class 2606 OID 17508)
-- Name: CheckIn CheckIn_Arch_No_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_Arch_No_fkey" FOREIGN KEY ("Arch_No") REFERENCES public."Archive"("Arch_No") ON DELETE CASCADE;


--
-- TOC entry 4795 (class 2606 OID 17503)
-- Name: CheckIn CheckIn_Customer_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_Customer_ID_fkey" FOREIGN KEY ("Customer_ID") REFERENCES public."Customer"("ID");


--
-- TOC entry 4796 (class 2606 OID 17513)
-- Name: CheckIn CheckIn_Employee_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_Employee_ID_fkey" FOREIGN KEY ("Employee_ID") REFERENCES public."Employee"("ID");


--
-- TOC entry 4797 (class 2606 OID 17518)
-- Name: CheckIn CheckIn_Hotel_Num_Room_Num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_Hotel_Num_Room_Num_fkey" FOREIGN KEY ("Hotel_Num", "Room_Num") REFERENCES public."Room"("Hotel_Num", "Room_Num");


--
-- TOC entry 4788 (class 2606 OID 17427)
-- Name: Customer Customer_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_ID_fkey" FOREIGN KEY ("ID") REFERENCES public."Person"("ID");


--
-- TOC entry 4789 (class 2606 OID 17437)
-- Name: Employee Employee_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_ID_fkey" FOREIGN KEY ("ID") REFERENCES public."Person"("ID");


--
-- TOC entry 4790 (class 2606 OID 17452)
-- Name: Manager Manager_Hotel_Num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_Hotel_Num_fkey" FOREIGN KEY ("Hotel_Num") REFERENCES public."Hotel"("Hotel_Num");


--
-- TOC entry 4791 (class 2606 OID 17447)
-- Name: Manager Manager_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_ID_fkey" FOREIGN KEY ("ID") REFERENCES public."Employee"("ID");


--
-- TOC entry 4786 (class 2606 OID 17403)
-- Name: Owns Owns_Chain_Name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Owns"
    ADD CONSTRAINT "Owns_Chain_Name_fkey" FOREIGN KEY ("Chain_Name") REFERENCES public."Hotel_Chain"("Chain_Name") ON DELETE CASCADE;


--
-- TOC entry 4787 (class 2606 OID 17408)
-- Name: Owns Owns_Hotel_Num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Owns"
    ADD CONSTRAINT "Owns_Hotel_Num_fkey" FOREIGN KEY ("Hotel_Num") REFERENCES public."Hotel"("Hotel_Num") ON DELETE CASCADE;


--
-- TOC entry 4792 (class 2606 OID 17480)
-- Name: Room Room_Damage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_Damage_fkey" FOREIGN KEY ("Damage") REFERENCES public."Damage"("Damage_ID");


--
-- TOC entry 4793 (class 2606 OID 17485)
-- Name: Room Room_Hotel_Num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_Hotel_Num_fkey" FOREIGN KEY ("Hotel_Num") REFERENCES public."Hotel"("Hotel_Num") ON DELETE CASCADE;


-- Completed on 2025-03-18 20:12:59

--
-- PostgreSQL database dump complete
--

