CREATE TABLE attractions ( 
	attraction_id        bigserial  NOT NULL,
	attraction_owner_id  char(50)  NOT NULL,
	attraction_name      varchar(100)  NOT NULL,
	attraction_faction   varchar  NOT NULL,
	attraction_type      varchar  ,
	attraction_hp        integer  ,
	attraction_security  integer  NOT NULL,
	attraction_base_travelspeed integer  NOT NULL,
	attraction_region    varchar  ,
	attraction_inventory_size integer  ,
	attraction_gold      integer  ,
	attraction_wood      integer  ,
	attraction_ore       integer  ,
	attraction_food      integer  ,
	CONSTRAINT pk_attractions PRIMARY KEY ( attraction_id ),
	CONSTRAINT pk_attractions_0 UNIQUE ( attraction_owner_id ) ,
	CONSTRAINT pk_attractions_1 UNIQUE ( attraction_region ) 
 );

COMMENT ON TABLE attractions IS 'List of all attractions in the game. ';

COMMENT ON COLUMN attractions.attraction_id IS 'Unique ID for each attraction. Created upon its creation. ';

COMMENT ON COLUMN attractions.attraction_owner_id IS 'Character name of the character that owns the attraction';

COMMENT ON COLUMN attractions.attraction_name IS 'The name of the attraction set by the creator upon building the attraction. ';

COMMENT ON COLUMN attractions.attraction_faction IS 'The attractions faction alliegence. (not always the same as the attraction owner`s faction). ';

COMMENT ON COLUMN attractions.attraction_type IS 'Type of attracion (barracks, ship, caravan, house etc.) ';

COMMENT ON COLUMN attractions.attraction_hp IS 'If hp is less than 0 the attraction is destroyed. hp can be repaired with wood and ore. ';

COMMENT ON COLUMN attractions.attraction_security IS 'When security is 0 robbery actions can be performed. Also it can no longer be used as shelter. ';

COMMENT ON COLUMN attractions.attraction_base_travelspeed IS 'Applicable to ships and caravans. ';

COMMENT ON COLUMN attractions.attraction_region IS 'The region the attraction is in. ';

COMMENT ON COLUMN attractions.attraction_inventory_size IS 'Amount of items the attraction can hold. ';

COMMENT ON COLUMN attractions.attraction_gold IS 'Gold being stored by attraction';

COMMENT ON COLUMN attractions.attraction_wood IS 'Wood being stored by attraction';

COMMENT ON COLUMN attractions.attraction_ore IS 'Ore being stored by attraction';

COMMENT ON COLUMN attractions.attraction_food IS 'Food  being stored by attraction';

ALTER TABLE attractions ADD CONSTRAINT fk_attractions FOREIGN KEY ( attraction_id ) REFERENCES inventory( attraction_id );

ALTER TABLE attractions ADD CONSTRAINT fk_attractions_0 FOREIGN KEY ( attraction_id ) REFERENCES association( headquarters );

