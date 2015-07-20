CREATE TABLE "zin mmo".characters ( 
	char_name            char(20)  NOT NULL,
	owner_account        char(20)  NOT NULL,
	lastlogout_date      date  ,
	char_race            char(10)  NOT NULL,
	char_gender          bool  NOT NULL,
	char_region          char(50)  NOT NULL,
	char_shelter_id      bigserial  ,
	char_hp              integer DEFAULT 1000 NOT NULL,
	char_hpregen         integer  NOT NULL,
	char_mana            integer  NOT NULL,
	char_manaregen       integer  NOT NULL,
	char_fortitude       integer DEFAULT 1000 NOT NULL,
	"fortitude_regen "   integer  ,
	char_actionpoints    integer DEFAULT 1000 NOT NULL,
	actionpoint_regen    integer  NOT NULL,
	char_faction         char(50)  ,
	char_god             char(25)  ,
	char_divinity        integer  ,
	char_honour          integer  ,
	char_age             integer DEFAULT 0 NOT NULL,
	char_combat_skill    integer  NOT NULL,
	char_intrigue_skill  integer  NOT NULL,
	char_merchant_skill  integer  ,
	char_stealth_skill   integer  ,
	char_travel_skill    integer  ,
	char_magic_skill     integer  ,
	char_sailor_skill    integer  NOT NULL,
	char_mining_skill    integer  NOT NULL,
	char_lumberjack_skill integer  ,
	char_farming_skill   integer  ,
	char_hunting_skill   integer  NOT NULL,
	char_engineering_skill integer  ,
	char_construction_skill integer  NOT NULL,
	char_blacksmith_skill integer  ,
	char_armor_id        char(50)  ,
	char_weapon_id       char(50)  ,
	char_shard_id        integer  ,
	char_friendly_target char(50)  ,
	char_hostile_target  char(50)  ,
	char_travel_target   char(50)  ,
	char_stalked_target  char(50)  ,
	slave_owner_id       char(50)  ,
	char_inventory_size  integer  ,
	char_gold            integer  ,
	char_iron            integer  ,
	char_wood            integer  ,
	char_food            integer  ,
	CONSTRAINT pk_goblin_chars PRIMARY KEY ( char_name ),
	CONSTRAINT idx_characters UNIQUE ( owner_account ) ,
	CONSTRAINT idx_characters_0 UNIQUE ( char_friendly_target ) ,
	CONSTRAINT pk_characters UNIQUE ( char_region ) 
 );

CREATE INDEX idx_characters_1 ON "zin mmo".characters ( char_hostile_target );

COMMENT ON TABLE "zin mmo".characters IS 'List of all of the characters that are alive. ';

COMMENT ON COLUMN "zin mmo".characters.char_name IS 'Unique character string chosen by player during character creation.';

COMMENT ON COLUMN "zin mmo".characters.owner_account IS 'Account that owns this character';

COMMENT ON COLUMN "zin mmo".characters.char_race IS 'Goblin, Orc, Dwarf, Human, Blackelf, Highelf or Dragon ';

COMMENT ON COLUMN "zin mmo".characters.char_region IS 'The region the character is currently in. ';

COMMENT ON COLUMN "zin mmo".characters.char_shelter_id IS 'Unique ID of the attraction you are taking shelter in. ';

COMMENT ON COLUMN "zin mmo".characters.char_hp IS 'If this value is less than 1 the character dies. ';

COMMENT ON COLUMN "zin mmo".characters.char_hpregen IS 'Regeneration of hp per timestep. Function of race, skills, hunger. Max hp is 1000. ';

COMMENT ON COLUMN "zin mmo".characters.char_mana IS 'Mana points available to use towards an action. Max mana is 1000. ';

COMMENT ON COLUMN "zin mmo".characters.char_manaregen IS 'Mana regeneration per timestep. Function your god and divinity. ';

COMMENT ON COLUMN "zin mmo".characters.char_fortitude IS 'If a character fortitude is 0 then "domination" type actions can be performed like enslavement, robbery, etc. ';

COMMENT ON COLUMN "zin mmo".characters."fortitude_regen " IS 'Fortitude restored per timestep. function of race, skills and hunger. max fortitude is 1000. ';

COMMENT ON COLUMN "zin mmo".characters.char_actionpoints IS 'Actionpoints available to the character that can be invested into actions. ';

COMMENT ON COLUMN "zin mmo".characters.actionpoint_regen IS 'Regeneration rate of action points. Function of hunger and race. ';

COMMENT ON COLUMN "zin mmo".characters.char_faction IS 'Faction the character belongs to. ';

COMMENT ON COLUMN "zin mmo".characters.char_god IS 'God that the character is aligned to.';

COMMENT ON COLUMN "zin mmo".characters.char_divinity IS 'Standing with the god. ';

COMMENT ON COLUMN "zin mmo".characters.char_honour IS 'Standing with the faction the character belongs to. ';

COMMENT ON COLUMN "zin mmo".characters.char_age IS 'Age of the character. Mortal characters die after a certain age. ';

COMMENT ON COLUMN "zin mmo".characters.char_combat_skill IS 'Modifier that improves performance in combat actions. Initial value and improvement rate is a function of race. Improved by doing combat based actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_intrigue_skill IS 'Modifier that improves performance in intrigue actions.Initial value and improvement rate is a function of race. Improved by doing intrigue based actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_merchant_skill IS 'Modifier that improves performance in merchant actions. Initial value and improvement rate is a function of race. Improved by doing merchant based actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_stealth_skill IS 'Modifier that improves performance in stealth actions. Initial value and improvement rate is a function of race. Improved by doing stealth based actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_travel_skill IS 'Modifier that improves performance in travel actions. Initial value and improvement rate is a function of race. Improved by doing travel based actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_magic_skill IS 'This skill unlocks certain spell actions. Initial value and improvement rate is a function of race and gender. ';

COMMENT ON COLUMN "zin mmo".characters.char_sailor_skill IS 'Modifier improves combat and travel actions when on  a ship. Initial conditions and improvement rate are a function of race. ';

COMMENT ON COLUMN "zin mmo".characters.char_mining_skill IS 'Modifier improves ore harvesting actions. Initial conditions and improvement rate are a function of race. ';

COMMENT ON COLUMN "zin mmo".characters.char_lumberjack_skill IS 'Modifier improves lumber harvesting actions. Initial conditions and improvement rate are a function of race. ';

COMMENT ON COLUMN "zin mmo".characters.char_farming_skill IS 'Modifier improves farming actions. Initial conditions and improvement rate are a function of race. ';

COMMENT ON COLUMN "zin mmo".characters.char_hunting_skill IS 'Modifier improves food hunting actions. Initial conditions and improvement rate are a function of race. Food earned this way cannot be traded. ';

COMMENT ON COLUMN "zin mmo".characters.char_engineering_skill IS 'A higher skill level allows you create building sites for more complex attractions. A certain engineering skill is also required to initiate and contribute to the starting of a seige on a region of a different faction.';

COMMENT ON COLUMN "zin mmo".characters.char_construction_skill IS 'Improves the effectiveness of action points put towards a build site. IInitial condition and improvement rate is a function of race.  ';

COMMENT ON COLUMN "zin mmo".characters.char_blacksmith_skill IS 'unlocks recipes for armor and weapons';

COMMENT ON COLUMN "zin mmo".characters.char_armor_id IS 'Unique item ID of the armour the character has equip. Passive protection against combat actions targeting you. Modifies (positivly or negetivly) stealth, merchant, magic, travel, intrigue skills.';

COMMENT ON COLUMN "zin mmo".characters.char_weapon_id IS 'Unique item id of the weapon the character has equip. Passively improves combat actions done by character. Modifies (positivly or negetivly) stealth, merchant, magic, travel, intrigue skills.';

COMMENT ON COLUMN "zin mmo".characters.char_shard_id IS 'Shard item ID that the character has equip. This item can be drained of mana points as an alternative to a god. ';

COMMENT ON COLUMN "zin mmo".characters.char_friendly_target IS 'Unique Character Name or Attraction ID of Target you have aquired for hostile actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_hostile_target IS 'Unique Character Name or Attraction ID of Target you have aquired for hostile actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_travel_target IS 'Unique Region name of Target you have aquired for travel actions. ';

COMMENT ON COLUMN "zin mmo".characters.char_stalked_target IS 'Unique Character Name or Attraction ID of Target you have aquired for covert hostile actions. This target is aquired by successfully completing a "stalk" type action. ';

COMMENT ON COLUMN "zin mmo".characters.slave_owner_id IS 'character name of your slave owner (if you have been enslaved). ';

COMMENT ON COLUMN "zin mmo".characters.char_inventory_size IS 'Amount of items a character can carry';

COMMENT ON COLUMN "zin mmo".characters.char_gold IS 'Gold being carried by character';

COMMENT ON COLUMN "zin mmo".characters.char_iron IS 'Iron being carried by character';

COMMENT ON COLUMN "zin mmo".characters.char_wood IS 'Wood being carried by character';

COMMENT ON COLUMN "zin mmo".characters.char_food IS 'Food being carried by character';

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters FOREIGN KEY ( char_name ) REFERENCES "zin mmo".attractions( attraction_owner_id );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_0 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".inventory( owner_id );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_1 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".hostilelist( targeter_id );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_2 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".hostilelist( target_id );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_3 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".friendlist( friend_id );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_4 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".friendlist( friender_id );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_5 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".association_memberlist( member_name );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_6 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".actions( action_creator );

ALTER TABLE "zin mmo".characters ADD CONSTRAINT fk_characters_7 FOREIGN KEY ( char_name ) REFERENCES "zin mmo".action_contributors( action_contributor );

