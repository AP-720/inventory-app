--
-- PostgreSQL database dump
--

-- Dumped from database version 18.1 (Postgres.app)
-- Dumped by pg_dump version 18.1 (Postgres.app)

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
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category character varying(255) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: coffee_varieties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coffee_varieties (
    coffee_id integer NOT NULL,
    variety_id integer NOT NULL
);


--
-- Name: coffees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coffees (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    roaster_id integer NOT NULL,
    origin_id integer NOT NULL,
    process_id integer NOT NULL,
    price numeric(8,2) NOT NULL,
    tasting_notes character varying(255) NOT NULL,
    roast_id integer NOT NULL
);


--
-- Name: coffees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.coffees ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.coffees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: origins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.origins (
    id integer NOT NULL,
    country character varying(255) NOT NULL
);


--
-- Name: origins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.origins ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.origins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: processes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.processes (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: processes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.processes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.processes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_categories (
    coffee_id integer NOT NULL,
    category_id integer NOT NULL
);


--
-- Name: roasters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roasters (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    country character varying(255)
);


--
-- Name: roasters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.roasters ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roasters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: roasts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roasts (
    id integer NOT NULL,
    style character varying(255) NOT NULL,
    type character varying(255) NOT NULL
);


--
-- Name: roasts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.roasts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roasts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: varieties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.varieties (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: varieties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.varieties ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.varieties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT category_name_key UNIQUE (category);


--
-- Name: coffee_varieties coffee_varieties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffee_varieties
    ADD CONSTRAINT coffee_varieties_pkey PRIMARY KEY (coffee_id, variety_id);


--
-- Name: coffees coffees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffees
    ADD CONSTRAINT coffees_pkey PRIMARY KEY (id);


--
-- Name: origins origin_country_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.origins
    ADD CONSTRAINT origin_country_unique UNIQUE (country);


--
-- Name: origins origins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.origins
    ADD CONSTRAINT origins_pkey PRIMARY KEY (id);


--
-- Name: processes processes_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT processes_name_unique UNIQUE (name);


--
-- Name: processes processes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processes
    ADD CONSTRAINT processes_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (coffee_id, category_id);


--
-- Name: roasters roasters_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roasters
    ADD CONSTRAINT roasters_name_unique UNIQUE (name);


--
-- Name: roasters roasters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roasters
    ADD CONSTRAINT roasters_pkey PRIMARY KEY (id);


--
-- Name: roasts roasts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roasts
    ADD CONSTRAINT roasts_pkey PRIMARY KEY (id);


--
-- Name: varieties varieties_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.varieties
    ADD CONSTRAINT varieties_name_unique UNIQUE (name);


--
-- Name: varieties varieties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.varieties
    ADD CONSTRAINT varieties_pkey PRIMARY KEY (id);


--
-- Name: coffee_varieties coffee_varieties_coffee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffee_varieties
    ADD CONSTRAINT coffee_varieties_coffee_id_fkey FOREIGN KEY (coffee_id) REFERENCES public.coffees(id) ON DELETE CASCADE;


--
-- Name: coffee_varieties coffee_varieties_variety_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffee_varieties
    ADD CONSTRAINT coffee_varieties_variety_id_fkey FOREIGN KEY (variety_id) REFERENCES public.varieties(id);


--
-- Name: coffees coffees_origin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffees
    ADD CONSTRAINT coffees_origin_id_fkey FOREIGN KEY (origin_id) REFERENCES public.origins(id);


--
-- Name: coffees coffees_process_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffees
    ADD CONSTRAINT coffees_process_id_fkey FOREIGN KEY (process_id) REFERENCES public.processes(id);


--
-- Name: coffees coffees_roast_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffees
    ADD CONSTRAINT coffees_roast_id_fkey FOREIGN KEY (roast_id) REFERENCES public.roasts(id);


--
-- Name: coffees coffees_roaster_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffees
    ADD CONSTRAINT coffees_roaster_id_fkey FOREIGN KEY (roaster_id) REFERENCES public.roasters(id);


--
-- Name: product_categories product_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: product_categories product_categories_coffee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_coffee_id_fkey FOREIGN KEY (coffee_id) REFERENCES public.coffees(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

