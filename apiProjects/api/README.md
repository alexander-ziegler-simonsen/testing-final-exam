# database_2025_finalProject

The main project is about a Hospital.

These are following database I have picked for this project:
- MSSQL (relationship db)
- MongoDB (document db)
- Neo4j (graph DB)

## how to start the MSSQL database?

First step is to setup a '.env' file with the right values (you can find those in '.env.template').

Then you need to run "docker compose up -d" from the root folder (you need docker desktop installed).
(by the way, the username is 'SA').

When you then connect to local database (I use dbgate) and open a new query, you need to add these files in order and excute each of them:
- 001_init.sql
- 002_addData.sql
- 003_views.sql
- 004_functions.sql
- 005_storedPro.sql
- 006_triggers.sql
- 007_indexing.sql
(these file can be found in "projectArtifacts->database->scripts)

# artifact handling (currenly under development)

Making diagrams on everything can take a lot of time away from the project (I feel like a lot of time is lost when using GUI tools for simple info-to-diagram problems), so I have choosen to use an code-to-diagram solution.

