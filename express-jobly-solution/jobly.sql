-- This script is used to delete and recreate the jobly and jobly_test databases.

-- Prompt the user to confirm the deletion and recreation of the jobly database
\echo 'Delete and recreate jobly db?'
\prompt 'Press Enter for yes or Ctrl+C to cancel > ' confirmation

-- If the user confirms, drop the jobly database if it exists and create a new one
DROP DATABASE IF EXISTS jobly;
CREATE DATABASE jobly;

-- Connect to the newly created jobly database
\connect jobly

-- Execute the schema and seed SQL scripts to create the schema and populate initial data
\i jobly-schema.sql
\i jobly-seed.sql

-- Prompt the user to confirm the deletion and recreation of the jobly_test database
\echo 'Delete and recreate jobly_test db?'
\prompt 'Press Enter for yes or Ctrl+C to cancel > ' confirmation

-- If the user confirms, drop the jobly_test database if it exists and create a new one
DROP DATABASE IF EXISTS jobly_test;
CREATE DATABASE jobly_test;

-- Connect to the newly created jobly_test database
\connect jobly_test

-- Execute the schema and seed SQL scripts to create the schema and populate initial data
\i jobly-schema.sql
