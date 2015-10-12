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
-- Name: arena_challenges; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE arena_challenges (
    id integer NOT NULL,
    arena integer NOT NULL,
    arena_fighter integer NOT NULL,
    player character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    player_fighter integer,
    entry_fee integer DEFAULT 0 NOT NULL,
    winner_prize integer DEFAULT 0,
    winner integer,
    min_fame integer DEFAULT 0 NOT NULL,
    timestep_scheduled integer
);


ALTER TABLE arena_challenges OWNER TO zinroc;

--
-- Name: arena_challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE arena_challenges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE arena_challenges_id_seq OWNER TO zinroc;

--
-- Name: arena_challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE arena_challenges_id_seq OWNED BY arena_challenges.id;


--
-- Name: arenas; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE arenas (
    id integer NOT NULL,
    name character varying NOT NULL,
    capacity integer NOT NULL,
    ticket_price real NOT NULL
);


ALTER TABLE arenas OWNER TO zinroc;

--
-- Name: arenas_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE arenas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE arenas_id_seq OWNER TO zinroc;

--
-- Name: arenas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE arenas_id_seq OWNED BY arenas.id;


--
-- Name: character_skills; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE character_skills (
    id integer NOT NULL,
    "character" integer,
    skill integer,
    value integer
);


ALTER TABLE character_skills OWNER TO zinroc;

--
-- Name: character_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE character_skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE character_skills_id_seq OWNER TO zinroc;

--
-- Name: character_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE character_skills_id_seq OWNED BY character_skills.id;






--
-- Name: characters; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE characters (
    id integer NOT NULL,
    name character varying(255),
    art integer,
    strategy integer,
    body_art integer,
    trait integer
);


ALTER TABLE characters OWNER TO zinroc;

--
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE characters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE characters_id_seq OWNER TO zinroc;

--
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE characters_id_seq OWNED BY characters.id;


--
-- Name: spectators; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE spectators (
    id integer NOT NULL,
    home_arena integer NOT NULL
);


ALTER TABLE spectators OWNER TO zinroc;

--
-- Name: crowd_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE crowd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE crowd_id_seq OWNER TO zinroc;

--
-- Name: crowd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE crowd_id_seq OWNED BY spectators.id;


--
-- Name: fighters; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE fighters (
    email character varying NOT NULL,
    name character varying NOT NULL,
    title character varying,
    skill real NOT NULL,
    fame real NOT NULL,
    num_wins integer DEFAULT 0 NOT NULL,
    id integer NOT NULL,
    status character varying DEFAULT 'alive'::character varying NOT NULL,
    num_losses integer DEFAULT 0 NOT NULL
);


ALTER TABLE fighters OWNER TO zinroc;

--
-- Name: fighters_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE fighters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fighters_id_seq OWNER TO zinroc;

--
-- Name: fighters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE fighters_id_seq OWNED BY fighters.id;


--
-- Name: game_state; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE game_state (
    timestep integer DEFAULT 1 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE game_state OWNER TO zinroc;

--
-- Name: levels; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE levels (
    id integer NOT NULL,
    name character varying(255),
    rank integer
);


ALTER TABLE levels OWNER TO zinroc;

--
-- Name: levels_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE levels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE levels_id_seq OWNER TO zinroc;

--
-- Name: levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE levels_id_seq OWNED BY levels.id;


--
-- Name: plan_techniques; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE plan_techniques (
    id integer NOT NULL,
    plan integer,
    slot_1 integer,
    slot_2 integer,
    slot_3 integer,
    ultimate integer
);


ALTER TABLE plan_techniques OWNER TO zinroc;

--
-- Name: plan_techniques_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE plan_techniques_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE plan_techniques_id_seq OWNER TO zinroc;

--
-- Name: plan_techniques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE plan_techniques_id_seq OWNED BY plan_techniques.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE players (
    id integer NOT NULL,
    email character varying NOT NULL,
    money integer DEFAULT 0 NOT NULL,
    num_fights integer DEFAULT 0 NOT NULL,
    fame real DEFAULT 1000 NOT NULL,
    name character varying
);


ALTER TABLE players OWNER TO zinroc;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE players_id_seq OWNER TO zinroc;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE players_id_seq OWNED BY players.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE skills (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE skills OWNER TO zinroc;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE skills_id_seq OWNER TO zinroc;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE skills_id_seq OWNED BY skills.id;


--
-- Name: spectator_prefs; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE spectator_prefs (
    spectator_id integer NOT NULL,
    fighter_id integer NOT NULL,
    pref real NOT NULL,
    CONSTRAINT max_spectator_pref CHECK ((pref <= (100)::double precision)),
    CONSTRAINT min_spectator_pref CHECK ((pref >= ((-100))::double precision))
);


ALTER TABLE spectator_prefs OWNER TO zinroc;

--
-- Name: strategies; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE strategies (
    id integer NOT NULL,
    name character varying,
    initiation_frequency integer,
    base_cardio_cost integer,
    initiation_cardio_cost integer,
    difficulty integer,
    range integer,
    art integer
);


ALTER TABLE strategies OWNER TO zinroc;

--
-- Name: strategies_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE strategies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE strategies_id_seq OWNER TO zinroc;

--
-- Name: strategies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE strategies_id_seq OWNED BY strategies.id;


--
-- Name: strategy_bonuses; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE strategy_bonuses (
    id integer NOT NULL,
    strategy integer,
    skill integer,
    value integer
);


ALTER TABLE strategy_bonuses OWNER TO zinroc;

--
-- Name: strategy_bonuses_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE strategy_bonuses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE strategy_bonuses_id_seq OWNER TO zinroc;

--
-- Name: strategy_bonuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE strategy_bonuses_id_seq OWNED BY strategy_bonuses.id;


--
-- Name: strategy_experience; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE strategy_experience (
    id integer NOT NULL,
    "character" integer,
    experience_as integer,
    experience_against integer,
    strategy integer,
    rank integer
);


ALTER TABLE strategy_experience OWNER TO zinroc;

--
-- Name: strategy_experience_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE strategy_experience_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE strategy_experience_id_seq OWNER TO zinroc;

--
-- Name: strategy_experience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE strategy_experience_id_seq OWNED BY strategy_experience.id;


--
-- Name: technique_conditioning; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE technique_conditioning (
    id integer NOT NULL,
    "character" integer,
    technique integer,
    conditioning integer
);


ALTER TABLE technique_conditioning OWNER TO zinroc;

--
-- Name: technique_conditioning_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE technique_conditioning_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE technique_conditioning_id_seq OWNER TO zinroc;

--
-- Name: technique_conditioning_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE technique_conditioning_id_seq OWNED BY technique_conditioning.id;


--
-- Name: techniques; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE techniques (
    id integer NOT NULL,
    name character varying(255),
    level integer,
    trait integer,
    strategy integer,
    effect_description character varying(255),
    preconditions character varying(255),
    range integer,
    brawl_value integer,
    ultimate boolean,
    technical_value integer,
    cardio_cost integer
);


ALTER TABLE techniques OWNER TO zinroc;

--
-- Name: techniques_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE techniques_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE techniques_id_seq OWNER TO zinroc;

--
-- Name: techniques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE techniques_id_seq OWNED BY techniques.id;


--
-- Name: traits; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE traits (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255)
);


ALTER TABLE traits OWNER TO zinroc;

--
-- Name: traits_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE traits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE traits_id_seq OWNER TO zinroc;

--
-- Name: traits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE traits_id_seq OWNED BY traits.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: zinroc; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying,
    password character varying,
    salt character varying,
    teamname character varying,
    username character varying
);


ALTER TABLE users OWNER TO zinroc;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: zinroc
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO zinroc;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zinroc
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


ALTER TABLE ONLY arena_challenges ALTER COLUMN id SET DEFAULT nextval('arena_challenges_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY arenas ALTER COLUMN id SET DEFAULT nextval('arenas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY character_skills ALTER COLUMN id SET DEFAULT nextval('character_skills_id_seq'::regclass);



--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY characters ALTER COLUMN id SET DEFAULT nextval('characters_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY fighters ALTER COLUMN id SET DEFAULT nextval('fighters_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY levels ALTER COLUMN id SET DEFAULT nextval('levels_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY plan_techniques ALTER COLUMN id SET DEFAULT nextval('plan_techniques_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY players ALTER COLUMN id SET DEFAULT nextval('players_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY skills ALTER COLUMN id SET DEFAULT nextval('skills_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY spectators ALTER COLUMN id SET DEFAULT nextval('crowd_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategies ALTER COLUMN id SET DEFAULT nextval('strategies_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategy_bonuses ALTER COLUMN id SET DEFAULT nextval('strategy_bonuses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategy_experience ALTER COLUMN id SET DEFAULT nextval('strategy_experience_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY technique_conditioning ALTER COLUMN id SET DEFAULT nextval('technique_conditioning_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY techniques ALTER COLUMN id SET DEFAULT nextval('techniques_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY traits ALTER COLUMN id SET DEFAULT nextval('traits_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: character_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY character_skills
    ADD CONSTRAINT character_skills_pkey PRIMARY KEY (id);



--
-- Name: characters_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: crowd_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY spectators
    ADD CONSTRAINT crowd_pkey PRIMARY KEY (id);


--
-- Name: fighters_p_key_id; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY fighters
    ADD CONSTRAINT fighters_p_key_id PRIMARY KEY (id);


--
-- Name: levels_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- Name: p_key_id; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY arenas
    ADD CONSTRAINT p_key_id PRIMARY KEY (id);


--
-- Name: plan_techniques_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY plan_techniques
    ADD CONSTRAINT plan_techniques_pkey PRIMARY KEY (id);


--
-- Name: players_email_key; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY players
    ADD CONSTRAINT players_email_key UNIQUE (email);


--
-- Name: skills_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: strategies_name_key; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY strategies
    ADD CONSTRAINT strategies_name_key UNIQUE (name);


--
-- Name: strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY strategies
    ADD CONSTRAINT strategies_pkey PRIMARY KEY (id);


--
-- Name: strategy_bonuses_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY strategy_bonuses
    ADD CONSTRAINT strategy_bonuses_pkey PRIMARY KEY (id);


--
-- Name: strategy_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY strategy_experience
    ADD CONSTRAINT strategy_experience_pkey PRIMARY KEY (id);


--
-- Name: technique_conditioning_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY technique_conditioning
    ADD CONSTRAINT technique_conditioning_pkey PRIMARY KEY (id);


--
-- Name: techniques_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY techniques
    ADD CONSTRAINT techniques_pkey PRIMARY KEY (id);


--
-- Name: traits_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY traits
    ADD CONSTRAINT traits_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: zinroc; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: arena_challenges_arena_fighter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY arena_challenges
    ADD CONSTRAINT arena_challenges_arena_fighter_fkey FOREIGN KEY (arena_fighter) REFERENCES fighters(id);


--
-- Name: arena_challenges_arena_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY arena_challenges
    ADD CONSTRAINT arena_challenges_arena_fkey FOREIGN KEY (arena) REFERENCES arenas(id);


--
-- Name: arena_challenges_player_fighter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY arena_challenges
    ADD CONSTRAINT arena_challenges_player_fighter_fkey FOREIGN KEY (player_fighter) REFERENCES fighters(id);


--
-- Name: arena_challenges_winner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY arena_challenges
    ADD CONSTRAINT arena_challenges_winner_fkey FOREIGN KEY (winner) REFERENCES fighters(id);


--
-- Name: character_skills_character_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY character_skills
    ADD CONSTRAINT character_skills_character_foreign FOREIGN KEY ("character") REFERENCES characters(id);


--
-- Name: character_skills_skill_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY character_skills
    ADD CONSTRAINT character_skills_skill_foreign FOREIGN KEY (skill) REFERENCES skills(id);



--
-- Name: characters_trait_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_trait_fkey FOREIGN KEY (trait) REFERENCES traits(id);


--
-- Name: crowd_home_arena_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY spectators
    ADD CONSTRAINT crowd_home_arena_fkey FOREIGN KEY (home_arena) REFERENCES arenas(id);


--
-- Name: spectator_prefs_fighter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY spectator_prefs
    ADD CONSTRAINT spectator_prefs_fighter_id_fkey FOREIGN KEY (fighter_id) REFERENCES fighters(id);


--
-- Name: spectator_prefs_spectator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY spectator_prefs
    ADD CONSTRAINT spectator_prefs_spectator_id_fkey FOREIGN KEY (spectator_id) REFERENCES spectators(id);


--
-- Name: strategy_bonuses_skill_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategy_bonuses
    ADD CONSTRAINT strategy_bonuses_skill_foreign FOREIGN KEY (skill) REFERENCES skills(id);


--
-- Name: strategy_bonuses_strategy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategy_bonuses
    ADD CONSTRAINT strategy_bonuses_strategy_foreign FOREIGN KEY (strategy) REFERENCES strategies(id);


--
-- Name: strategy_experience_character_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategy_experience
    ADD CONSTRAINT strategy_experience_character_foreign FOREIGN KEY ("character") REFERENCES characters(id);


--
-- Name: strategy_experience_strategy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY strategy_experience
    ADD CONSTRAINT strategy_experience_strategy_foreign FOREIGN KEY (strategy) REFERENCES strategies(id);


--
-- Name: technique_conditioning_character_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY technique_conditioning
    ADD CONSTRAINT technique_conditioning_character_foreign FOREIGN KEY ("character") REFERENCES characters(id);


--
-- Name: technique_conditioning_technique_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY technique_conditioning
    ADD CONSTRAINT technique_conditioning_technique_foreign FOREIGN KEY (technique) REFERENCES techniques(id);


--
-- Name: techniques_strategy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY techniques
    ADD CONSTRAINT techniques_strategy_foreign FOREIGN KEY (strategy) REFERENCES strategies(id);


--
-- Name: techniques_trait_foreign; Type: FK CONSTRAINT; Schema: public; Owner: zinroc
--

ALTER TABLE ONLY techniques
    ADD CONSTRAINT techniques_trait_foreign FOREIGN KEY (trait) REFERENCES traits(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: zinroc
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM zinroc;
GRANT ALL ON SCHEMA public TO zinroc;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

