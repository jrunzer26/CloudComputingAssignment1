@echo off
heroku pg:psql < schema.sql
heroku pg:psql < testData.sql