CREATE TABLE region ( 
	region_name          varchar(100)  NOT NULL,
	region_type          varchar  ,
	governing_association varchar  ,
	region_farming_mod   integer  ,
	region_woodharvesting_mod integer  ,
	region_hunting_mod   integer  ,
	region_mining_mod    integer  ,
	region_faction       varchar  ,
	region_seiging_faction varchar  ,
	region_neighbor_n    varchar  ,
	region_neighbor_e    varchar  ,
	region_neighbor_s    varchar  ,
	region_neighbor_w    varchar  ,
	region_neighbor_v    varchar  ,
	region_population    integer  ,
	region_attraction_population integer  ,
	border_tax_regional  real  ,
	border_tax_federal   real  ,
	asset_tax_regional   real  ,
	asset_tax_federal    real  ,
	region_foresthealth  integer  ,
	CONSTRAINT pk_region PRIMARY KEY ( region_name )
 );

COMMENT ON TABLE region IS 'A list of all of the regions. The map is populated by data from this table. ';

COMMENT ON COLUMN region.region_name IS 'Unique region name. ';

COMMENT ON COLUMN region.region_type IS 'underground, mountain, surface, ocean, forest, etc. ';

COMMENT ON COLUMN region.governing_association IS 'Association responsible for setting and collecting taxes';

COMMENT ON COLUMN region.region_faction IS 'Controlling faction. Can be changed by seiges. Attractions can be stolen after region changes owner. ';

COMMENT ON COLUMN region.region_seiging_faction IS 'Faction laying seige. ';

COMMENT ON COLUMN region.region_neighbor_v IS 'Vertical neighbor';

COMMENT ON COLUMN region.border_tax_regional IS 'set by governing association. Takes % of raw resources and gold crossing border.';

COMMENT ON COLUMN region.border_tax_federal IS 'Takes % of raw resources and gold crossing border.';

COMMENT ON COLUMN region.asset_tax_regional IS 'governing association takes a % of player resource assets every timestep in that region.';

COMMENT ON COLUMN region.asset_tax_federal IS 'governing association takes a % of player resource assets every timestep in that region.';

COMMENT ON COLUMN region.region_foresthealth IS 'reduced by wood cutting actions. Improves the hunting modifier. ';

ALTER TABLE region ADD CONSTRAINT fk_region FOREIGN KEY ( region_name ) REFERENCES characters( char_region );

ALTER TABLE region ADD CONSTRAINT fk_region_0 FOREIGN KEY ( region_name ) REFERENCES attractions( attraction_region );

ALTER TABLE region ADD CONSTRAINT fk_region_1 FOREIGN KEY ( region_name ) REFERENCES bankandtradepost( tradepost_region );

