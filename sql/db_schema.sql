--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: action_contributors; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE action_contributors (
    id integer NOT NULL,
    action integer NOT NULL,
    contributor integer NOT NULL,
    ap_contributed_last_timestep integer DEFAULT 0 NOT NULL,
    total_ap_contributed integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.action_contributors OWNER TO gru;

--
-- Name: action_contributors_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE action_contributors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.action_contributors_id_seq OWNER TO gru;

--
-- Name: action_contributors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE action_contributors_id_seq OWNED BY action_contributors.id;


--
-- Name: action_history; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE action_history (
    name character varying NOT NULL,
    owner integer NOT NULL,
    regional_target character varying,
    timestep_evaluated integer NOT NULL,
    total_ap_contributed integer DEFAULT 0 NOT NULL,
    successful boolean DEFAULT false NOT NULL,
    id integer NOT NULL,
    ongoing_action_id integer NOT NULL
);


ALTER TABLE public.action_history OWNER TO gru;

--
-- Name: action_history_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE action_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.action_history_id_seq OWNER TO gru;

--
-- Name: action_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE action_history_id_seq OWNED BY action_history.id;


--
-- Name: action_type; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE action_type (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying
);


ALTER TABLE public.action_type OWNER TO gru;

--
-- Name: action_type_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE action_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.action_type_id_seq OWNER TO gru;

--
-- Name: action_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE action_type_id_seq OWNED BY action_type.id;


--
-- Name: actions; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE actions (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    primary_type character varying NOT NULL,
    secondary_type character varying,
    time_to_eval integer,
    min_eap_required integer DEFAULT 0 NOT NULL,
    timestep_eap_mod double precision DEFAULT 0 NOT NULL,
    total_eap_mod double precision DEFAULT 0 NOT NULL,
    delete_on_success boolean DEFAULT false NOT NULL,
    friendly_target boolean DEFAULT false NOT NULL,
    hostile_target boolean DEFAULT false NOT NULL,
    stalk_target boolean DEFAULT false NOT NULL,
    regional_target boolean DEFAULT false NOT NULL,
    optional_param_type character varying,
    min_contributors integer DEFAULT 1 NOT NULL,
    max_contributors integer
);


ALTER TABLE public.actions OWNER TO gru;

--
-- Name: TABLE actions; Type: COMMENT; Schema: public; Owner: gru
--

COMMENT ON TABLE actions IS 'list of all possible actions and their inherent properties';


--
-- Name: COLUMN actions.time_to_eval; Type: COMMENT; Schema: public; Owner: gru
--

COMMENT ON COLUMN actions.time_to_eval IS 'Number of timesteps until evaluation';


--
-- Name: actions_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actions_id_seq OWNER TO gru;

--
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE actions_id_seq OWNED BY actions.id;


--
-- Name: adjacency_type; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE adjacency_type (
    id integer NOT NULL,
    name character(20) NOT NULL
);


ALTER TABLE public.adjacency_type OWNER TO gru;

--
-- Name: adjacency_type_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE adjacency_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adjacency_type_id_seq OWNER TO gru;

--
-- Name: adjacency_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE adjacency_type_id_seq OWNED BY adjacency_type.id;


--
-- Name: attractions; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE attractions (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.attractions OWNER TO gru;

--
-- Name: TABLE attractions; Type: COMMENT; Schema: public; Owner: gru
--

COMMENT ON TABLE attractions IS 'list of all possible attractions';


--
-- Name: attractions_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE attractions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attractions_id_seq OWNER TO gru;

--
-- Name: attractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE attractions_id_seq OWNED BY attractions.id;


--
-- Name: char_art; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE char_art (
    id integer NOT NULL,
    race character varying NOT NULL,
    gender character varying NOT NULL,
    face_id_max integer NOT NULL
);


ALTER TABLE public.char_art OWNER TO gru;

--
-- Name: char_art_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE char_art_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.char_art_id_seq OWNER TO gru;

--
-- Name: char_art_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE char_art_id_seq OWNED BY char_art.id;


--
-- Name: characters; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE characters (
    id integer NOT NULL,
    name character(20) NOT NULL,
    owner integer NOT NULL,
    race character varying NOT NULL,
    gender character varying NOT NULL,
    hp integer DEFAULT 1000 NOT NULL,
    fortitude integer DEFAULT 1000 NOT NULL,
    max_hp integer DEFAULT 1000 NOT NULL,
    max_fortitude integer DEFAULT 1000 NOT NULL,
    ap integer DEFAULT 1000 NOT NULL,
    ap_max integer DEFAULT 1000 NOT NULL,
    energy integer DEFAULT 100 NOT NULL,
    regional_target character varying,
    location character varying NOT NULL,
    wood integer DEFAULT 0 NOT NULL,
    food integer DEFAULT 0 NOT NULL,
    friendly_target character varying,
    friendly_target_type character varying,
    friendly_target_id integer,
    intrigue integer DEFAULT 1 NOT NULL,
    stealth integer DEFAULT 1 NOT NULL,
    combat integer DEFAULT 1 NOT NULL,
    scavenging integer DEFAULT 1 NOT NULL,
    hunting integer DEFAULT 1 NOT NULL,
    engineering integer DEFAULT 1 NOT NULL,
    building integer DEFAULT 1 NOT NULL,
    crafting integer DEFAULT 1 NOT NULL,
    sailing integer DEFAULT 1 NOT NULL,
    travel integer DEFAULT 1 NOT NULL,
    teaching integer DEFAULT 1 NOT NULL,
    face_art integer,
    ore integer DEFAULT 0,
    gold integer DEFAULT 0,
    inventory_occupied integer DEFAULT 0,
    inventory_size integer DEFAULT 200,
    woodcutting integer DEFAULT 1,
    mining integer DEFAULT 1,
    farming integer DEFAULT 1,
    construction integer DEFAULT 1,
    exp integer DEFAULT 0,
    CONSTRAINT min_energy CHECK ((energy >= 15))
);


ALTER TABLE public.characters OWNER TO gru;

--
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE characters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.characters_id_seq OWNER TO gru;

--
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE characters_id_seq OWNED BY characters.id;


--
-- Name: existing_attractions; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE existing_attractions (
    id integer NOT NULL,
    name character varying NOT NULL,
    region character varying NOT NULL,
    owner integer NOT NULL,
    under_construction boolean DEFAULT false
);


ALTER TABLE public.existing_attractions OWNER TO gru;

--
-- Name: existing_attractions_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE existing_attractions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.existing_attractions_id_seq OWNER TO gru;

--
-- Name: existing_attractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE existing_attractions_id_seq OWNED BY existing_attractions.id;


--
-- Name: friends; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE friends (
    id integer NOT NULL,
    char1 integer NOT NULL,
    char2 integer NOT NULL,
    is_pending boolean NOT NULL
);


ALTER TABLE public.friends OWNER TO gru;

--
-- Name: friends_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE friends_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.friends_id_seq OWNER TO gru;

--
-- Name: friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE friends_id_seq OWNED BY friends.id;


--
-- Name: game_state; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE game_state (
    timestep integer DEFAULT 1 NOT NULL,
    id integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.game_state OWNER TO gru;

--
-- Name: gender; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE gender (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.gender OWNER TO gru;

--
-- Name: gender_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE gender_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gender_id_seq OWNER TO gru;

--
-- Name: gender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE gender_id_seq OWNED BY gender.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE inventory (
    id integer NOT NULL,
    final_item_name character varying NOT NULL,
    base_item_name character varying,
    owner character varying,
    location character varying,
    equipped character varying,
    equipping character varying,
    augmentation character varying,
    item_tier character varying,
    skillbonus1 character varying,
    skillbonus2 character varying,
    skillpenalty1 character varying,
    skillpenalty2 character varying,
    amp1 integer,
    amp2 integer,
    shift1 integer,
    shift2 integer,
    tight1 double precision,
    tight2 double precision,
    pen1 integer,
    pen2 integer
);


ALTER TABLE public.inventory OWNER TO gru;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE inventory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_id_seq OWNER TO gru;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE inventory_id_seq OWNED BY inventory.id;


--
-- Name: item_tier; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE item_tier (
    id integer NOT NULL,
    tier character varying,
    amp_min integer,
    amp_max integer,
    shift_min integer,
    shift_max integer,
    pen_min integer,
    pen_max integer,
    tight_min double precision,
    tight_max double precision
);


ALTER TABLE public.item_tier OWNER TO gru;

--
-- Name: item_tier_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE item_tier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_tier_id_seq OWNER TO gru;

--
-- Name: item_tier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE item_tier_id_seq OWNED BY item_tier.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE items (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    wood_cost character varying,
    ore_cost character varying,
    size integer,
    stealth_bonus double precision,
    intrigue_bonus double precision,
    combat_bonus double precision,
    crafting_bonus double precision,
    woodcutting_bonus double precision,
    mining_bonus double precision,
    farming_bonus double precision,
    travel_bonus double precision,
    sailing_bonus double precision,
    engineering_bonus double precision,
    construction_bonus double precision,
    hunting_bonus double precision
);


ALTER TABLE public.items OWNER TO gru;

--
-- Name: items_designed; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE items_designed (
    id integer NOT NULL,
    item_type character varying,
    num_designed integer
);


ALTER TABLE public.items_designed OWNER TO gru;

--
-- Name: items_designed_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE items_designed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.items_designed_id_seq OWNER TO gru;

--
-- Name: items_designed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE items_designed_id_seq OWNED BY items_designed.id;


--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.items_id_seq OWNER TO gru;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE items_id_seq OWNED BY items.id;


--
-- Name: ongoing_actions; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE ongoing_actions (
    id integer NOT NULL,
    name character varying NOT NULL,
    owner integer NOT NULL,
    regional_target character varying,
    time_to_eval integer,
    friendly_target character varying,
    hostile_target character varying,
    stalk_target character varying,
    optional_parameter character varying
);


ALTER TABLE public.ongoing_actions OWNER TO gru;

--
-- Name: ongoing_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE ongoing_actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ongoing_actions_id_seq OWNER TO gru;

--
-- Name: ongoing_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE ongoing_actions_id_seq OWNED BY ongoing_actions.id;


--
-- Name: race; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE race (
    id integer NOT NULL,
    name character varying NOT NULL,
    spawn_region character varying NOT NULL
);


ALTER TABLE public.race OWNER TO gru;

--
-- Name: race_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE race_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.race_id_seq OWNER TO gru;

--
-- Name: race_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE race_id_seq OWNED BY race.id;


--
-- Name: region_adjacency; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE region_adjacency (
    id integer NOT NULL,
    type character(20) NOT NULL,
    region1 character varying NOT NULL,
    region2 character varying NOT NULL,
    CONSTRAINT alpha_order CHECK (((region1)::bpchar > (region2)::bpchar))
);


ALTER TABLE public.region_adjacency OWNER TO gru;

--
-- Name: region_adjacency_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE region_adjacency_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.region_adjacency_id_seq OWNER TO gru;

--
-- Name: region_adjacency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE region_adjacency_id_seq OWNED BY region_adjacency.id;


--
-- Name: regions; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE regions (
    id integer NOT NULL,
    name character varying NOT NULL,
    has_wood boolean DEFAULT false NOT NULL,
    can_build boolean DEFAULT true NOT NULL,
    spawning character varying,
    spawn_dice integer DEFAULT 1,
    acres integer DEFAULT 100000,
    travel_mod double precision DEFAULT (1)::double precision,
    mining_mod double precision DEFAULT (0.0500000000000000028)::double precision,
    farming_mod double precision DEFAULT (0.0500000000000000028)::double precision,
    hunting_mod double precision DEFAULT (0.0500000000000000028)::double precision,
    woodcutting_mod double precision DEFAULT (0.0500000000000000028)::double precision,
    population integer DEFAULT 0,
    acres_occupied integer DEFAULT 0,
    weather integer DEFAULT 0,
    health integer DEFAULT 1000
);


ALTER TABLE public.regions OWNER TO gru;

--
-- Name: COLUMN regions.has_wood; Type: COMMENT; Schema: public; Owner: gru
--

COMMENT ON COLUMN regions.has_wood IS 'for checking woodcutting options';


--
-- Name: regions_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE regions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.regions_id_seq OWNER TO gru;

--
-- Name: regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE regions_id_seq OWNED BY regions.id;


--
-- Name: shared_actions; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE shared_actions (
    id integer NOT NULL,
    action integer NOT NULL,
    "character" integer NOT NULL,
    ignored boolean DEFAULT false NOT NULL
);


ALTER TABLE public.shared_actions OWNER TO gru;

--
-- Name: shared_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE shared_actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shared_actions_id_seq OWNER TO gru;

--
-- Name: shared_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE shared_actions_id_seq OWNED BY shared_actions.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE skills (
    id integer NOT NULL,
    name character(20) NOT NULL
);


ALTER TABLE public.skills OWNER TO gru;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.skills_id_seq OWNER TO gru;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE skills_id_seq OWNED BY skills.id;


--
-- Name: target_types; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE target_types (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.target_types OWNER TO gru;

--
-- Name: target_types_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE target_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.target_types_id_seq OWNER TO gru;

--
-- Name: target_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE target_types_id_seq OWNED BY target_types.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: gru; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    salt character varying NOT NULL,
    username character varying NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    goblin_exp integer DEFAULT 0 NOT NULL,
    orc_exp integer DEFAULT 0 NOT NULL,
    dwarf_exp integer DEFAULT 0 NOT NULL,
    human_exp integer DEFAULT 0 NOT NULL,
    elf_exp integer DEFAULT 0 NOT NULL,
    darkelf_exp integer DEFAULT 0 NOT NULL,
    dragon_exp integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO gru;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: gru
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO gru;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gru
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY action_contributors ALTER COLUMN id SET DEFAULT nextval('action_contributors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY action_history ALTER COLUMN id SET DEFAULT nextval('action_history_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY action_type ALTER COLUMN id SET DEFAULT nextval('action_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY actions ALTER COLUMN id SET DEFAULT nextval('actions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY adjacency_type ALTER COLUMN id SET DEFAULT nextval('adjacency_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY attractions ALTER COLUMN id SET DEFAULT nextval('attractions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY char_art ALTER COLUMN id SET DEFAULT nextval('char_art_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters ALTER COLUMN id SET DEFAULT nextval('characters_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY existing_attractions ALTER COLUMN id SET DEFAULT nextval('existing_attractions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY friends ALTER COLUMN id SET DEFAULT nextval('friends_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY gender ALTER COLUMN id SET DEFAULT nextval('gender_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory ALTER COLUMN id SET DEFAULT nextval('inventory_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY item_tier ALTER COLUMN id SET DEFAULT nextval('item_tier_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY items ALTER COLUMN id SET DEFAULT nextval('items_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY items_designed ALTER COLUMN id SET DEFAULT nextval('items_designed_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY ongoing_actions ALTER COLUMN id SET DEFAULT nextval('ongoing_actions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY race ALTER COLUMN id SET DEFAULT nextval('race_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY region_adjacency ALTER COLUMN id SET DEFAULT nextval('region_adjacency_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY regions ALTER COLUMN id SET DEFAULT nextval('regions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY shared_actions ALTER COLUMN id SET DEFAULT nextval('shared_actions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY skills ALTER COLUMN id SET DEFAULT nextval('skills_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY target_types ALTER COLUMN id SET DEFAULT nextval('target_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: gru
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: action_contributors_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY action_contributors
    ADD CONSTRAINT action_contributors_pkey PRIMARY KEY (id);


--
-- Name: action_history_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY action_history
    ADD CONSTRAINT action_history_pkey PRIMARY KEY (id);


--
-- Name: action_type_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY action_type
    ADD CONSTRAINT action_type_name_key UNIQUE (name);


--
-- Name: action_type_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY action_type
    ADD CONSTRAINT action_type_pkey PRIMARY KEY (id);


--
-- Name: actions_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT actions_name_key UNIQUE (name);


--
-- Name: actions_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: adjacency_type_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY adjacency_type
    ADD CONSTRAINT adjacency_type_name_key UNIQUE (name);


--
-- Name: adjacency_type_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY adjacency_type
    ADD CONSTRAINT adjacency_type_pkey PRIMARY KEY (id);


--
-- Name: attractions_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY attractions
    ADD CONSTRAINT attractions_name_key UNIQUE (name);


--
-- Name: attractions_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY attractions
    ADD CONSTRAINT attractions_pkey PRIMARY KEY (id);


--
-- Name: char_art_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY char_art
    ADD CONSTRAINT char_art_pkey PRIMARY KEY (id);


--
-- Name: characters_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_name_key UNIQUE (name);


--
-- Name: characters_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: existing_attractions_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY existing_attractions
    ADD CONSTRAINT existing_attractions_pkey PRIMARY KEY (id);


--
-- Name: friends_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (id);


--
-- Name: game_state_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY game_state
    ADD CONSTRAINT game_state_pkey PRIMARY KEY (timestep);


--
-- Name: gender_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (id);


--
-- Name: inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: item_tier_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY item_tier
    ADD CONSTRAINT item_tier_pkey PRIMARY KEY (id);


--
-- Name: item_tier_tier_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY item_tier
    ADD CONSTRAINT item_tier_tier_key UNIQUE (tier);


--
-- Name: items_designed_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY items_designed
    ADD CONSTRAINT items_designed_pkey PRIMARY KEY (id);


--
-- Name: items_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_name_key UNIQUE (name);


--
-- Name: items_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: ongoing_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY ongoing_actions
    ADD CONSTRAINT ongoing_actions_pkey PRIMARY KEY (id);


--
-- Name: pk_id; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT pk_id PRIMARY KEY (id);


--
-- Name: ra_uniqueness; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY region_adjacency
    ADD CONSTRAINT ra_uniqueness UNIQUE (region1, region2, type);


--
-- Name: race_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY race
    ADD CONSTRAINT race_name_key UNIQUE (name);


--
-- Name: race_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY race
    ADD CONSTRAINT race_pkey PRIMARY KEY (id);


--
-- Name: region_adjacency_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY region_adjacency
    ADD CONSTRAINT region_adjacency_pkey PRIMARY KEY (id);


--
-- Name: region_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY regions
    ADD CONSTRAINT region_name_key UNIQUE (name);


--
-- Name: region_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY regions
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: shared_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY shared_actions
    ADD CONSTRAINT shared_actions_pkey PRIMARY KEY (id);


--
-- Name: skills_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY skills
    ADD CONSTRAINT skills_name_key UNIQUE (name);


--
-- Name: skills_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: target_types_name_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY target_types
    ADD CONSTRAINT target_types_name_key UNIQUE (name);


--
-- Name: target_types_pkey; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY target_types
    ADD CONSTRAINT target_types_pkey PRIMARY KEY (id);


--
-- Name: unique_char1_char2; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY friends
    ADD CONSTRAINT unique_char1_char2 UNIQUE (char1, char2);


--
-- Name: unique_gender_and_race; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY char_art
    ADD CONSTRAINT unique_gender_and_race UNIQUE (gender, race);


--
-- Name: unique_name; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY gender
    ADD CONSTRAINT unique_name UNIQUE (name);


--
-- Name: unique_username; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: gru; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: action_contributors_action_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY action_contributors
    ADD CONSTRAINT action_contributors_action_fkey FOREIGN KEY (action) REFERENCES ongoing_actions(id);


--
-- Name: action_contributors_contributor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY action_contributors
    ADD CONSTRAINT action_contributors_contributor_fkey FOREIGN KEY (contributor) REFERENCES characters(id);


--
-- Name: actions_primary_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT actions_primary_type_fkey FOREIGN KEY (primary_type) REFERENCES action_type(name);


--
-- Name: actions_secondary_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT actions_secondary_type_fkey FOREIGN KEY (secondary_type) REFERENCES action_type(name);


--
-- Name: char_art_gender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY char_art
    ADD CONSTRAINT char_art_gender_fkey FOREIGN KEY (gender) REFERENCES gender(name);


--
-- Name: char_art_race_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY char_art
    ADD CONSTRAINT char_art_race_fkey FOREIGN KEY (race) REFERENCES race(name);


--
-- Name: characters_friendly_target_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_friendly_target_type_fkey FOREIGN KEY (friendly_target_type) REFERENCES target_types(name);


--
-- Name: characters_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_location_fkey FOREIGN KEY (location) REFERENCES regions(name);


--
-- Name: characters_regional_target_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_regional_target_fkey FOREIGN KEY (regional_target) REFERENCES regions(name);


--
-- Name: existing_attractions_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY existing_attractions
    ADD CONSTRAINT existing_attractions_name_fkey FOREIGN KEY (name) REFERENCES attractions(name);


--
-- Name: existing_attractions_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY existing_attractions
    ADD CONSTRAINT existing_attractions_owner_fkey FOREIGN KEY (owner) REFERENCES characters(id);


--
-- Name: existing_attractions_region_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY existing_attractions
    ADD CONSTRAINT existing_attractions_region_fkey FOREIGN KEY (region) REFERENCES regions(name);


--
-- Name: fk_gender; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT fk_gender FOREIGN KEY (gender) REFERENCES gender(name);


--
-- Name: fk_race; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT fk_race FOREIGN KEY (race) REFERENCES race(name);


--
-- Name: fk_username; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT fk_username FOREIGN KEY (owner) REFERENCES users(id);


--
-- Name: friends_char1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY friends
    ADD CONSTRAINT friends_char1_fkey FOREIGN KEY (char1) REFERENCES characters(id);


--
-- Name: friends_char2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY friends
    ADD CONSTRAINT friends_char2_fkey FOREIGN KEY (char2) REFERENCES characters(id);


--
-- Name: inventory_base_item_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_base_item_name_fkey FOREIGN KEY (base_item_name) REFERENCES items(name);


--
-- Name: inventory_item_tier_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_item_tier_fkey FOREIGN KEY (item_tier) REFERENCES item_tier(tier);


--
-- Name: inventory_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_owner_fkey FOREIGN KEY (owner) REFERENCES characters(name);


--
-- Name: inventory_skillbonus1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_skillbonus1_fkey FOREIGN KEY (skillbonus1) REFERENCES skills(name);


--
-- Name: inventory_skillbonus2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_skillbonus2_fkey FOREIGN KEY (skillbonus2) REFERENCES skills(name);


--
-- Name: inventory_skillpenalty1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_skillpenalty1_fkey FOREIGN KEY (skillpenalty1) REFERENCES skills(name);


--
-- Name: inventory_skillpenalty2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY inventory
    ADD CONSTRAINT inventory_skillpenalty2_fkey FOREIGN KEY (skillpenalty2) REFERENCES skills(name);


--
-- Name: ongoing_actions_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY ongoing_actions
    ADD CONSTRAINT ongoing_actions_name_fkey FOREIGN KEY (name) REFERENCES actions(name);


--
-- Name: ongoing_actions_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY ongoing_actions
    ADD CONSTRAINT ongoing_actions_owner_fkey FOREIGN KEY (owner) REFERENCES characters(id);


--
-- Name: ongoing_actions_regional_target_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY ongoing_actions
    ADD CONSTRAINT ongoing_actions_regional_target_fkey FOREIGN KEY (regional_target) REFERENCES regions(name);


--
-- Name: race_spawn_region_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY race
    ADD CONSTRAINT race_spawn_region_fkey FOREIGN KEY (spawn_region) REFERENCES regions(name);


--
-- Name: region_adjacency_region1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY region_adjacency
    ADD CONSTRAINT region_adjacency_region1_fkey FOREIGN KEY (region1) REFERENCES regions(name);


--
-- Name: region_adjacency_region2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY region_adjacency
    ADD CONSTRAINT region_adjacency_region2_fkey FOREIGN KEY (region2) REFERENCES regions(name);


--
-- Name: region_adjacency_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY region_adjacency
    ADD CONSTRAINT region_adjacency_type_fkey FOREIGN KEY (type) REFERENCES adjacency_type(name);


--
-- Name: regions_spawning_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY regions
    ADD CONSTRAINT regions_spawning_fkey FOREIGN KEY (spawning) REFERENCES race(name);


--
-- Name: shared_actions_action_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY shared_actions
    ADD CONSTRAINT shared_actions_action_fkey FOREIGN KEY (action) REFERENCES ongoing_actions(id);


--
-- Name: shared_actions_character_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gru
--

ALTER TABLE ONLY shared_actions
    ADD CONSTRAINT shared_actions_character_fkey FOREIGN KEY ("character") REFERENCES characters(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: gru
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM gru;
GRANT ALL ON SCHEMA public TO gru;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

