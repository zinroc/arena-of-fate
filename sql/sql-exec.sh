#!/bin/bash

cat "$1" | sed 's/"zin mmo".//g' | heroku pg:psql
