--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_item_id character varying NOT NULL,
    cart_id integer,
    product_id integer,
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    subtotal numeric GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    customer_id integer,
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    uuid character varying(255) NOT NULL,
    name character varying(100),
    email character varying(100),
    phone character varying(15),
    address text,
    deleted_at timestamp with time zone,
    updated_at timestamp without time zone,
    created_at timestamp without time zone
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    uuid character varying(255) NOT NULL,
    name character varying(100),
    description text,
    price numeric(10,2),
    sku character varying(50),
    stock integer,
    created_at timestamp without time zone,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: sale_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale_items (
    id integer NOT NULL,
    uuid character varying(255) NOT NULL,
    sale_id integer,
    product_id integer,
    quantity integer,
    unit_price numeric(10,2),
    subtotal numeric(10,2),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


ALTER TABLE public.sale_items OWNER TO postgres;

--
-- Name: sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sale_items_id_seq OWNER TO postgres;

--
-- Name: sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_items_id_seq OWNED BY public.sale_items.id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    id integer NOT NULL,
    uuid character varying(255) NOT NULL,
    customer_id integer,
    date timestamp without time zone,
    total_amount numeric(10,2),
    created_at timestamp without time zone,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone,
    status character varying
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_id_seq OWNER TO postgres;

--
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: sale_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_items ALTER COLUMN id SET DEFAULT nextval('public.sale_items_id_seq'::regclass);


--
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (cart_item_id, cart_id, product_id, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, customer_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, uuid, name, email, phone, address, deleted_at, updated_at, created_at) FROM stdin;
1	cust-123e4567-e89b-12d3-a456-426614174000	Tony Taco	tony.taco@example.com	123-456-7890	123 Nacho Lane, Queso City	\N	2025-04-06 15:20:09.899448	2025-04-06 15:20:09.899448
2	cust-123e4567-e89b-12d3-a456-426614174001	Lisa Limezz	lisa.lime@example.com	987-654-3210	456 Guac Ave, Dip Town	\N	2025-04-06 15:38:35.919521	2025-04-06 15:20:09.899448
3	cust-b872bb79-4ff4-40dc-a7e3-2071e2f25e4e	Jane Doe	jane.doe@example.com	+1-555-123-4567	123 Maple Street, Springfield, IL	\N	2025-04-06 07:48:05.886	2025-04-06 07:48:05.885
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, uuid, name, description, price, sku, stock, created_at, deleted_at, updated_at) FROM stdin;
3	prod-123e4567-e89b-12d3-a456-426614174002	Sour Cream Salsa	Smooth salsa with a sour twist	2.79	SALSA-003	25	2025-04-06 15:20:09.899448	\N	2025-04-10 22:42:31.050094
1	prod-123e4567-e89b-12d3-a456-426614174000	Cheddar Crunch	Extra crunchy cheddar-flavored chips	2.99	CHED-001	39	2025-04-06 15:20:09.899448	\N	2025-04-11 00:40:10.525389
4	aef322f7-7a91-433b-9007-08c2605f0b51	Spicy Cream Cheese Dip	Creamy for the light-hearted	4.66	DIP-102	0	2025-04-06 17:31:54.688336	\N	2025-04-11 02:03:37.318295
2	prod-123e4567-e89b-12d3-a456-426614174001	Spicy Jalapeño Dip	Hot dip for the bold-hearted	3.49	DIP-002	18	2025-04-06 15:20:09.899448	\N	2025-04-11 02:04:37.554578
\.


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sale_items (id, uuid, sale_id, product_id, quantity, unit_price, subtotal, created_at, updated_at, deleted_at) FROM stdin;
19	0c82fcc2-342c-48eb-afee-d55d485f4509	9	3	3	2.79	8.37	2025-04-10 22:40:22.225145	\N	\N
20	c32f4c15-546f-4210-9939-07be3cb31744	10	3	2	2.79	5.58	2025-04-10 22:41:37.81064	\N	\N
21	b81ee2e1-f3f3-4991-ac94-e1c77586f3ee	11	3	2	2.79	5.58	2025-04-10 22:42:31.047027	\N	\N
22	8afd9b75-b4a6-416a-be74-6526febf7ba1	12	1	1	2.99	2.99	2025-04-11 00:40:10.523382	\N	\N
23	81d251d1-81e1-4db8-9a6d-b947ef49c590	13	4	1	4.66	4.66	2025-04-11 02:03:37.315564	\N	\N
24	ecb7125d-b544-4fe3-ade8-6f917b63a93c	10	2	1	3.49	3.49	2025-04-11 02:04:37.465397	\N	\N
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (id, uuid, customer_id, date, total_amount, created_at, deleted_at, updated_at, status) FROM stdin;
11	sale-e5dd735e-446d-42c0-8c26-23c3bf08c4ee	2	2025-04-10 22:42:31.035238	5.58	2025-04-10 22:42:31.035238	\N	2025-04-10 22:42:31.035238	\N
9	sale-bac931eb-c398-46e6-bb47-d0572e575d82	1	2025-04-10 22:41:37.80842	8.37	2025-04-10 22:40:22.045882	\N	2025-04-10 22:40:22.045882	\N
12	sale-fe7bf258-e5fc-4ed4-af21-b4bc4239701b	3	2025-04-11 00:40:10.007276	2.99	2025-04-11 00:40:10.007276	\N	2025-04-11 00:40:10.007276	\N
13	sale-b9f4d1dc-b181-4291-ab0e-9c33aa339f26	1	2025-04-11 02:03:37.198225	4.66	2025-04-11 02:03:37.198225	\N	2025-04-11 02:03:37.198225	\N
10	sale-9eff0fd4-219c-4716-a668-92ce2e026de5	1	2025-04-10 22:41:37.80842	9.07	2025-04-10 22:41:37.80842	\N	2025-04-11 02:04:37.544297	\N
\.


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- Name: sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_items_id_seq', 24, true);


--
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_id_seq', 13, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: sale_items sale_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: sale_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id);


--
-- Name: sales sales_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- PostgreSQL database dump complete
--

