create table action_contributors (
	id SERIAL PRIMARY KEY NOT NULL,
	action INT REFERENCES ongoing_actions (id) NOT NULL,
	contributor INT REFERENCES characters (id) NOT NULL,
	ap_contributed_last_timestep INT DEFAULT 0 NOT NULL,
	total_ap_contributed INT DEFAULT 0 NOT NULL
);