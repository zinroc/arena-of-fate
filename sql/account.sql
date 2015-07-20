CREATE TABLE account ( 
	account_name         char(20)  NOT NULL,
	account_creation_date date  NOT NULL,
	password             date  NOT NULL,
	email                varchar  NOT NULL,
	goblin_exp           integer DEFAULT 0 NOT NULL,
	orc_exp              integer DEFAULT 0 NOT NULL,
	dwarf_exp            integer DEFAULT 0 NOT NULL,
	human_exp            integer DEFAULT 0 NOT NULL,
	blackelf_exp         integer DEFAULT 0 NOT NULL,
	highelf_exp          integer DEFAULT 0 NOT NULL,
	dragon_exp           integer DEFAULT 0 NOT NULL,
	CONSTRAINT pk_account PRIMARY KEY ( account_name )
 );

COMMENT ON TABLE account IS 'list of player accounts';

COMMENT ON COLUMN account.account_name IS 'Unique character string chosen by player upon registration.';

COMMENT ON COLUMN account.password IS 'Secret letter number combination created by player upon registration.';

COMMENT ON COLUMN account.goblin_exp IS 'Racial slot experience points gained by playing goblin class. Used to bid on respawns as a goblin, humans, elves and dragons. ';

COMMENT ON COLUMN account.orc_exp IS 'Racial slot experience points gained by playing orc class. Used to bid on respawns as a orc, humans, black elf and dragons. ';

COMMENT ON COLUMN account.dwarf_exp IS 'Racial slot experience points gained by playing dwarf class. Used to bid on respawns as a dwarf, humans, high elf and dragons. ';

COMMENT ON COLUMN account.human_exp IS 'Racial slot experience points gained by playing human class. Used to bid on respawns as a human, elf and dragon. ';

COMMENT ON COLUMN account.blackelf_exp IS 'Racial slot experience points gained by playing blackelf class. Used to bid on respawns as a blackelf and dragons. ';

COMMENT ON COLUMN account.highelf_exp IS 'Racial slot experience points gained by playing goblin class. Used to bid on respawns as a highelf  and dragons. ';

COMMENT ON COLUMN account.dragon_exp IS 'Racial slot experience points gained by playing goblin class. Used to bid on respawns as a dragon. ';

ALTER TABLE account ADD CONSTRAINT fk_account FOREIGN KEY ( account_name ) REFERENCES characters( owner_account );