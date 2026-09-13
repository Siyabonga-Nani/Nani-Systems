@echo off
set PGDATA=%CD%\pg\data
set PGBIN=%CD%\pg\pgsql\bin
if not exist "%PGDATA%" (
    "%PGBIN%\initdb.exe" -U postgres -A trust
)
"%PGBIN%\pg_ctl.exe" -l "%CD%\pg\logfile" start
timeout /t 3
"%PGBIN%\createdb.exe" -U postgres nani_v1_stage
