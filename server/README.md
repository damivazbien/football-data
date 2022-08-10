# Santex home challenge

  

## Table of Contents

  

- [About](#about)

- [Getting Started](#getting_started)

- [Usage](#usage)

- [Observations](#observations)

  

## About <a name = "about"></a>

  

This repository contains a solution for the Santex Back-end Developer Hiring Test home challenge.

  

## Getting Started <a name = "getting_started"></a>

  

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

  

### Prerequisites

  

The dependencies that we are using are Apollo Js, MongoDB, and NodeJs. You need to run MongoDB and Nodejs on your computer but Docker compose file is provided in case you want to use containers.
  

### Installing

  

In root folder ./server execute 

```js
npm install && npm start or using 
```

using docker 
```js
docker-compose build && docker-up
```
  
  

## Usage <a name = "usage"></a>

  

To use ping your queries to http://localhost:4000

  

first import league using {LeagueCode} examples: PL, BSA, ELC, PD, SA, FL1

  

Execute the ImportLeague mutation using Postman to import a league

  

```Ruby
	mutation ImportLeague($leagueCode:String){
		importLeague(leagueCode: $leagueCode) {
			code
			name
			areaName
		}
	}
```

```Ruby
  {
    "leagueCode": "PD"
  }
```

then to run the queries players and team execute:

# player query

```Ruby
query players($leagueCode:String, $teamName: String!){
  players(leagueCode: $leagueCode, teamName: $teamName ) {
	  name
		position
		dateOfBirth
		nationality
	}
}
```

```Ruby
{
  "leagueCode": "PD",
	"teamName": ""  // optional parameter in case wish return players using teamName
}
```

# team query

```js
query  teams($name:String, $players: Boolean!){
  teams(name: $name, players: $players ) {
	  name,
		tla,
		shortName,
		areaName,
		address,
		players
		{name},
		coach{name}
	}
}
```

```js
{
  "name": "Olympique de Marseille",
  "players": true  // true return player or coaches / false only return teams
}
```

### Observations

 - I decided to use a NoSql database (MongoDB). The API provides data with missing teams/players/coaches that can be updated in the next request, I think a SQL database is possible to use here, but notice that data can be updated if data is changing continuously always is better NoSQL.
   
 -  In mutation ImportLeague, I'm importing the season to avoid duplicating two documents in DB. I didn't add validation for leagueCode and Season to avoid calling the API because is not requested in the challenge but I consider that will be a good validation to add.
   
 - In the players query, when a team doesn't have players (coming from API) I return the array Player but with the data of coaches adding a field position to inform that is a coach (I'm a little confused about the output that was wished).
