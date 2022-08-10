const { gql } = require('apollo-server');

const typeDefs = gql`

    type Query {
        """query to define"""
        players(leagueCode:String, teamName: String) : [Player]
        teams(name:String, players:Boolean!):Team
    }

    """
    Mutation to import a
    league, named importLeague, that takes a leagueCode as input.
    """
    type Mutation  {
        importLeague(leagueCode: String) : Competition!
    }

    "Competition or League"
    type Competition {
        code: ID
        "Name of competition"
        name: String
        "Area od competition"
        areaName: String
        "Squad playing a competition"
        Squads: [Team]
    }
    
    "Teams of a league"
    type Team {
        "Name of team"
        name: String
        "tla"
        tla: String
        "Shortname of league"
        shortName: String
        "AreaName "
        areaName: String
        "Address of Team"
        address: String
        "Player of team"
        players: [Player]
        "Coach of team"
        coach: Coach
    }

    "Player of a team"
    type Player {
        "Name of player"
        name: String
        "Position where play in a team"
        position: String
        "Date of birth"
        dateOfBirth: String
        "Nationality of a team"
        nationality: String
    }

    "Coach of a Team"
    type Coach {
        "First name of the coach"
        firstName: String
        "Last name of the coach"
        LastName: String
        "Full name of the coach"
        name: String
        "Date of birth of the coach"
        dateOfBirth: String
        "Nationality of the coach"
        nationality: String
    }
`;

module.exports = typeDefs;