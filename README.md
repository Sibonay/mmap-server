# Comp 20 Assignment 3: the Server for the Real Marauder's Map -- SIBONAY KOO

1) As per the project specs, web app has the following (successfully implemented) features:
	- POST /sendLocation API:
		- submits checkIns from any domain (login, lat, lng)
		- successful submission of these three pieces of data results in one entry into the collection locations in Mongo
		- if a submission is missing any one of the data fields, does not insert new record into the database and instead sends the following JSON as the response: {"error":"Whoops, something is wrong with your data!"}
		- upon successful insertion of record into database, returns a JSON string that is an array of objects
		- duplicate records for a login are not stored: if a login makes a number of successful POST requests, only the last entry is recorded and old entry is overwritten
	- GET /location.json API:
		- returns a JSON string, one object, of the last known location for a specified login
		- the mandatory parameter for this API is login. If login is empty or no results found, returns empty JSON object {}
	- /   Home, the root, the index in HTML
		- accessing this on a web browser shall display list of the check-ins for all logins sorted in descending order by timestamp --the last person who checked-in is displayed first

2) Discussed assignment with: Zoe Monosson and Khuyen Bui

3) Hours spent: somewhere between 10 and 15 hours

