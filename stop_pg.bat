@echo off
set PGDATA=%CD%\pg\data
set PGBIN=%CD%\pg\pgsql\bin
"%PGBIN%\pg_ctl.exe" stop
