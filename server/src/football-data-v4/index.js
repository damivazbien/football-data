const {MongoClient, UnorderedBulkOperation, LEGAL_TCP_SOCKET_OPTIONS} = require('mongodb');

const { RESTDataSource } = require('apollo-datasource-rest');


class FootballAPI extends RESTDataSource {
   
    constructor(token, mongourl, db, competions) {
        super();
        this.baseURL="http://api.football-data.org/v4/";
        this.token = token;
        this.mongo_url = mongourl;
        this.db = db;
        this.competions = competions;
    }

    async getCompetition(leagueCode){
        const client = await MongoClient.connect(this.mongo_url);
        const database = client.db(this.db);
        const competionsCollection = database.collection(this.competions);
        let teams = [];
        
        const data = await this.get(`/competitions/${leagueCode}/teams`, {}, { headers : {'X-Auth-Token': this.token}});

        if(data.errorCode)
            return data;
        
        //check if exist in our db
        const exist = await competionsCollection.findOne({"_id":data.competition.id,"season":data.filters.season })

        if(exist)
            return undefined;
        
        data.teams.map((team)=> {
            const {name, tla, shortName, address, squad, coach} = team;
            
            if(team.squad.length > 0)
                teams.push({name, tla, shortName, areaName: team.area.name, address, squad, coach : null});
            else
                teams.push({name, tla, shortName, areaName: team.area.name, address, squad:null, coach});
            
        });
        
        //save competition in Mongodb
        const league = {
                _id: data.competition.id,
                season: data.filters.season,
                name: data.competition.name,
                code: data.competition.code,
                areaName: data.teams.shift().area.name,
                squads: teams
        };

        const result = await competionsCollection.insertOne(league);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);

        return league;
    }
}

module.exports = FootballAPI;