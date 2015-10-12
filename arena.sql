--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Data for Name: traits; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY traits (id, name, description) FROM stdin;
13	diciplined	Counter attacks do bonus damage. Blocking repeated initiations is more effective.
1	elven	\N
2	dwarven	\N
5	dark	\N
6	night	\N
7	demon	\N
8	goblin	\N
9	undead	\N
10	demon-hunter	\N
3	orcish	Orcish techniques will consume positioning rather than cardio when cardio is depleted
14	showman	All techniques have bonus entertainment value.
11	naga	Successful attacks against a poisoned target deal more damage
4	barbarian	Repeated initiations come faster
12	holy	A divine shield impoves blocking capacity and is charged by holy techniques
\.


--
-- Data for Name: fighters; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY fighters (id, name, art, body_art, trait, email, title, fame, num_wins, status, num_losses) FROM stdin;
18	Juba	6	17	12	zinroc1191@gmail.com	\N	1000	0	living	0
19	Flamma	10	13	11	zinroc1191@gmail.com	\N	1000	0	living	0
22	Castus	8	16	3	Verona Arena@arenas.rome	\N	1000	0	living	0
21	Caladus	6	17	4	Pompeii Spectacula@arenas.rome	\N	1000	0	living	0
20	Tigris	30	33	12	zinroc1191@gmail.com	\N	1000	0	living	0
23	Barca	9	15	13	Verona Arena@arenas.rome	\N	1000	0	living	0
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY players (id, email, money, num_fights, fame, name) FROM stdin;
13	dbkats@gmail.com	5000	0	1000	Daniel Kats
14	zinroc1191@gmail.com	6178	13	1000	Zinrohk1
15	Zinrohk1	5000	0	1000	zinroc1191@gmail.com
\.


--
-- Data for Name: arena_challenges; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY arena_challenges (id, arena, player, status, arena_fighter, player_fighter, entry_fee, winner_prize, winner, min_fame, timestep_scheduled) FROM stdin;
8	3	zinroc1191@gmail.com	pending	22	\N	38	\N	\N	800	36
9	3	zinroc1191@gmail.com	pending	23	\N	38	\N	\N	800	36
7	1	zinroc1191@gmail.com	accepted	21	19	30	\N	\N	800	36
\.


--
-- Name: arena_challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('arena_challenges_id_seq', 9, true);


--
-- Data for Name: arenas; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY arenas (id, name, capacity, ticket_price) FROM stdin;
1	Pompeii Spectacula	120	1
3	Verona Arena	150	1.5
2	Pula Arena	50	0.699999988
\.


--
-- Name: arenas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('arenas_id_seq', 3, true);


--
-- Data for Name: character_art; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY character_art (id, portrait, body) FROM stdin;
1	3	14
3	6	17
5	8	16
6	9	15
7	10	13
8	20	18
4	7	19
9	26	35
10	27	32
11	28	31
12	29	34
13	30	33
\.


--
-- Name: character_art_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('character_art_id_seq', 13, true);


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY skills (id, name) FROM stdin;
4	reflex
8	strength
9	recovery
10	chin
11	endurance
12	heart
13	accuracy
15	grappling
16	pocket
17	striking
7	evasion
5	speed
\.


--
-- Data for Name: character_skills; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY character_skills (id, "character", skill, value) FROM stdin;
73	18	4	21
74	18	5	79
75	18	7	54
76	18	8	17
77	18	9	15
78	18	10	54
79	18	11	53
80	18	12	73
81	18	13	35
82	18	15	39
83	22	7	7
84	22	4	20
85	22	5	9
86	22	8	39
87	22	9	59
88	22	10	75
89	22	11	76
90	22	12	100
91	22	13	74
92	22	15	80
93	18	16	58
94	18	17	71
95	19	4	33
96	19	5	58
97	19	7	20
98	19	8	23
99	22	16	38
100	22	17	73
101	21	4	65
102	19	9	74
103	19	10	17
104	19	11	71
105	19	12	66
106	21	5	10
107	21	7	56
108	21	8	28
109	21	9	16
110	21	10	89
111	21	11	57
112	21	12	50
113	19	13	27
114	19	15	36
115	19	16	68
116	19	17	20
117	20	4	2
118	20	5	54
119	21	13	45
120	21	15	23
121	21	16	21
122	20	7	53
123	20	8	21
124	20	9	97
125	20	10	64
126	21	17	77
127	23	4	21
128	23	5	82
129	23	7	83
130	23	8	71
131	23	9	87
132	23	10	23
133	20	11	67
134	20	12	35
135	20	13	73
136	20	15	7
137	23	11	57
138	20	16	31
139	20	17	68
140	23	12	26
141	23	13	39
142	23	15	99
143	23	16	21
144	23	17	82
\.


--
-- Name: character_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('character_skills_id_seq', 144, true);


--
-- Name: crowd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('crowd_id_seq', 640, true);


--
-- Name: fighters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('fighters_id_seq', 23, true);


--
-- Data for Name: game_state; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY game_state (timestep, id) FROM stdin;
36	1
\.


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY levels (id, name, rank) FROM stdin;
1	novice	0
2	adept	1
3	master	2
\.


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('levels_id_seq', 3, true);


--
-- Data for Name: strategies; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY strategies (id, name, initiation_frequency, base_cardio_cost, initiation_cardio_cost, difficulty, range, art) FROM stdin;
8	strangler	1	0	0	2	0	\N
4	bezerker	2	2	2	1	1	\N
6	wrath	1	0	2	1	1	\N
7	stalker	1	1	1	1	0	\N
9	sniper	0	0	1	1	2	21
5	viper	0	2	0	2	2	22
3	defender	0	0	1	0	0	23
\.


--
-- Data for Name: strategy_experience; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY strategy_experience (id, "character", experience_as, experience_against, strategy, rank) FROM stdin;
43	18	77	16	5	1
44	18	58	25	8	2
45	18	55	68	3	3
46	22	95	27	4	1
47	22	86	88	5	2
48	22	81	92	6	3
49	18	52	30	6	\N
50	18	51	60	7	\N
51	18	19	33	4	\N
52	18	2	11	9	\N
53	19	93	75	3	1
54	19	89	56	7	2
55	19	88	57	4	3
56	19	79	86	9	\N
57	19	18	21	5	\N
58	22	80	49	9	\N
59	22	58	37	3	\N
60	22	52	97	8	\N
61	22	23	34	7	\N
62	21	93	80	6	1
63	21	88	40	8	2
64	21	53	92	7	3
65	19	17	85	6	\N
66	21	39	55	4	\N
67	21	30	32	5	\N
68	21	23	7	9	\N
69	19	4	7	8	\N
70	20	39	41	3	1
71	20	37	19	6	2
72	20	33	48	4	3
73	20	28	8	5	\N
74	20	18	58	9	\N
75	20	13	74	7	\N
76	20	11	47	8	\N
77	21	9	63	3	\N
78	23	100	60	8	1
79	23	49	61	6	2
80	23	25	70	9	3
81	23	19	25	5	\N
82	23	12	61	7	\N
83	23	10	99	4	\N
84	23	7	43	3	\N
\.


--
-- Data for Name: techniques; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY techniques (id, name, level, trait, strategy, effect_description, preconditions, range, brawl_value, ultimate, technical_value, cardio_cost) FROM stdin;
9	sewing_machine	1	13	3	Advance behind a shield while repeatedly stabbing for 3 attacks. All counterattacks have a higher chance to be blocked.	successfully block 3 subsequent initiations	0	1	t	1	1
10	suffication	1	11	8	Saps targets cardio. Effect increased by poison vulnerability	Target is pinned	0	1	f	0	1
21	divine_intervention	1	12	6	Two effects: 1) restores conscioussness to full and removes bloodied damage 2) smites the target dealing damage and converting all bloodied damage to consciousness damage	Use 10 holy techniques during the fight	3	0	t	1	2
2	shield_smash	1	3	4	Reduce targets cardio	target blocks an attack	1	1	f	0	1
6	turtle	1	13	3	Increase chance to block	While gassed	3	0	f	0	0
14	jumping_strike	1	4	9	Launch into the air diving down on the target stunning them.	Chance on any initiation	2	1	f	1	2
23	taunt	1	14	3	Taunt the target to attack increasing their initiation bar. Reflex bonus exists while taunting.	Chance to occur at any time	1	1	f	1	0
11	mezmorizing_gaze	1	11	7	Target cannot move to change range and has less evasion	Chance to succeed whenever initiating. Chance improved by targets poison vulnerability.	1	0	f	0	0
12	venom_spit	1	11	5	Adds poison vulnerability and poison damage	Chance to succeed whenever initiating	1	1	f	0	1
13	cobra_strike	1	11	5	Strike and enter close range wrapping around the target pinning them and injecting a poison catalyste. While the target is pinned poison damage has 3x the effect	Target is vulnerable (dazed, pinned, mezmorized, etc.)	2	2	t	0	2
15	evasive_strikes	1	4	4	Dodge any counter attacks	Subsequently initiate 2 or more times	1	1	f	1	1
16	blood_rage	1	4	6	Increase cardio regeneration based on amount of bloodied damage taken	take bloodied damage	3	1	f	0	0
17	overwhelm	1	4	4	Target is unable to block or dodge	Subsequently initiate 6 times	1	2	t	0	2
19	burning_strike	1	12	7	Burns into the targets wounds converting a portion of the targets existing bloodied damage to consciousness damage.	Chance on any initiation	1	0	f	1	0
22	flying	1	14	9	Launch into the air traveling through far, medium and close range. Chain into any damage technique that meets preconditions at those ranges and recieve a bonus to power score.	Chance on any initiation	2	2	f	2	2
24	embarrass	1	14	8	Gesture to the crowd while out grappling your opponent, increasing their chance to quit	Target is pinned and while are not	0	1	f	1	0
25	mezmorize	1	14	9	Target cannot move to change range while mezmorized	Convert 50% of the opponents fans	2	2	t	2	0
3	blood_lust	1	3	6	increases strength for the next initiation	effect renewed whenever bloodied damage is done to target	3	1	f	0	0
18	brilliant_aura	1	12	6	An aura the blinds the target reducing their accuracy and reflex	Chance when using any holy technique	3	0	f	0	0
20	prayer_of_fortitude	1	12	3	Heal consciousness damage	no initiations have occured in 3 turns	3	0	f	0	0
4	maul	1	3	7	bites into target dealing damage and increasing targets chance to quit	target is pinned	0	1	f	0	1
5	unstoppable_frenzy	1	3	6	Regenerate to full cardio, cannot quit, cannot be knocked unconscious. Loses all cardio when effect expires.	Deal a massive amount of bloodied damage while under Blood Lust or recieve a massive amount of bloodied damage while under Blood Rage	3	2	t	0	0
7	feint	1	13	5	fakes an initiation. If the target counters their counter becomes an initiation that is easier to counter	Chance before any initiation	3	0	f	1	0
8	advancing_wall	1	13	7	Move to closer range and attack targets positioning	Successfully block an initiation	1	0	f	1	0
\.


--
-- Data for Name: plan_techniques; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY plan_techniques (id, plan, slot_1, slot_2, slot_3, ultimate) FROM stdin;
19	43	\N	\N	\N	\N
20	44	\N	\N	\N	\N
21	46	\N	\N	\N	\N
22	47	\N	\N	\N	\N
23	45	\N	\N	\N	\N
24	53	\N	\N	\N	\N
25	54	\N	\N	\N	\N
26	55	\N	\N	\N	\N
27	70	\N	\N	\N	\N
28	71	\N	\N	\N	\N
29	72	\N	\N	\N	\N
30	48	\N	\N	\N	\N
31	62	\N	\N	\N	\N
32	63	\N	\N	\N	\N
33	64	\N	\N	\N	\N
34	78	\N	\N	\N	\N
35	80	\N	\N	\N	\N
36	79	\N	\N	\N	\N
\.


--
-- Name: plan_techniques_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('plan_techniques_id_seq', 36, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('players_id_seq', 15, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('skills_id_seq', 17, true);


--
-- Data for Name: spectators; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY spectators (id, home_arena) FROM stdin;
321	1
322	1
323	1
324	1
325	1
326	1
327	1
328	1
329	1
330	1
331	1
332	1
333	1
334	1
335	1
336	1
337	1
338	1
339	1
340	1
341	1
342	1
343	1
344	1
345	1
346	1
347	1
348	1
349	1
350	1
351	1
352	1
353	1
354	1
355	1
356	1
357	1
358	1
359	1
360	1
361	1
362	1
363	1
364	1
365	1
366	1
367	1
368	1
369	1
370	1
371	1
372	1
373	1
374	1
375	1
376	1
377	1
378	1
379	1
380	1
381	1
382	1
383	1
384	1
385	1
386	1
387	1
388	1
389	1
390	1
391	1
392	1
393	1
394	1
395	1
396	1
397	1
398	1
399	1
400	1
401	1
402	1
403	1
404	1
405	1
406	1
407	1
408	1
409	1
410	1
411	1
412	1
413	1
414	1
415	1
416	1
417	1
418	1
419	1
420	1
421	1
422	1
423	1
424	1
425	1
426	1
427	1
428	1
429	1
430	1
431	1
432	1
433	1
434	1
435	1
436	1
437	1
438	1
439	1
440	1
441	2
442	2
443	2
444	2
445	2
446	2
447	2
448	2
449	2
450	2
451	2
452	2
453	2
454	2
455	2
456	2
457	2
458	2
459	2
460	2
461	2
462	2
463	2
464	2
465	2
466	2
467	2
468	2
469	2
470	2
471	2
472	2
473	2
474	2
475	2
476	2
477	2
478	2
479	2
480	2
481	2
482	2
483	2
484	2
485	2
486	2
487	2
488	2
489	2
490	2
491	3
492	3
493	3
494	3
495	3
496	3
497	3
498	3
499	3
500	3
501	3
502	3
503	3
504	3
505	3
506	3
507	3
508	3
509	3
510	3
511	3
512	3
513	3
514	3
515	3
516	3
517	3
518	3
519	3
520	3
521	3
522	3
523	3
524	3
525	3
526	3
527	3
528	3
529	3
530	3
531	3
532	3
533	3
534	3
535	3
536	3
537	3
538	3
539	3
540	3
541	3
542	3
543	3
544	3
545	3
546	3
547	3
548	3
549	3
550	3
551	3
552	3
553	3
554	3
555	3
556	3
557	3
558	3
559	3
560	3
561	3
562	3
563	3
564	3
565	3
566	3
567	3
568	3
569	3
570	3
571	3
572	3
573	3
574	3
575	3
576	3
577	3
578	3
579	3
580	3
581	3
582	3
583	3
584	3
585	3
586	3
587	3
588	3
589	3
590	3
591	3
592	3
593	3
594	3
595	3
596	3
597	3
598	3
599	3
600	3
601	3
602	3
603	3
604	3
605	3
606	3
607	3
608	3
609	3
610	3
611	3
612	3
613	3
614	3
615	3
616	3
617	3
618	3
619	3
620	3
621	3
622	3
623	3
624	3
625	3
626	3
627	3
628	3
629	3
630	3
631	3
632	3
633	3
634	3
635	3
636	3
637	3
638	3
639	3
640	3
\.


--
-- Data for Name: spectator_prefs; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY spectator_prefs (spectator_id, fighter_id, pref) FROM stdin;
\.


--
-- Name: strategies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('strategies_id_seq', 9, true);


--
-- Data for Name: strategy_bonuses; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY strategy_bonuses (id, strategy, skill, value) FROM stdin;
2	3	8	26
1	3	10	100
3	4	5	49
4	4	16	50
5	5	7	100
6	5	5	25
8	6	12	50
9	7	15	50
10	7	11	100
11	6	11	50
12	8	8	25
13	8	11	50
14	9	13	100
15	9	17	25
\.


--
-- Name: strategy_bonuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('strategy_bonuses_id_seq', 15, true);


--
-- Name: strategy_experience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('strategy_experience_id_seq', 84, true);


--
-- Data for Name: technique_conditioning; Type: TABLE DATA; Schema: public; Owner: zinroc
--

COPY technique_conditioning (id, "character", technique, conditioning) FROM stdin;
\.


--
-- Name: technique_conditioning_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('technique_conditioning_id_seq', 1, false);


--
-- Name: techniques_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('techniques_id_seq', 25, true);


--
-- Name: traits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zinroc
--

SELECT pg_catalog.setval('traits_id_seq', 14, true);


--
-- PostgreSQL database dump complete
--

