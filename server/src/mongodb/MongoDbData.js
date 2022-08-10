const {MongoDataSource} = require('apollo-datasource-mongodb');

class MongoDbData extends MongoDataSource {

  processPlayers = (element, players ) => {
    element.map((cplayers)=>{
      const {name, position, dateOfBirth, nationality} = cplayers;
      players.push(cplayers);
    });

    return players;
  }

  processDataPlayer = (squads) =>{
    let players = []
    
    squads.map((team)=>{
        if(team.squad)
          this.processPlayers(team.squad, players);
        else
          players.push( 
            {
              "name": team.coach.name, 
              "position": "Coach", 
              "dateOfBirth": team.coach.dateOfBirth, 
              "nationality": team.coach.nationality
            });
    });
    return players;
  }

  processDataPlayerByTeam = (competions, teamName) =>{
    let players = [];

    competions.map((competion)=>{
      competion.squads.map((team) => {
          if(team.name == teamName){
            if(team.squad)
            {
              this.processPlayers(team.squad, players);
            }
            else
            {
              //to avoid show same coach
              if(players.length < 1)
              {
                players.push( 
                  {
                    "name": team.coach.name, 
                    "position": "Coach", 
                    "dateOfBirth": team.coach.dateOfBirth, 
                    "nationality": team.coach.nationality
                  });
              }
            }
            
          }
      });
    });
    return players;
  }
  
  processDataTeam = (competions, needPlayers, teamName) => {
    let players = [];
    let coach = {};
    let result = {};
    competions.map((competion)=>{
      result = competion.squads.map((team) => {
        if(team.name == teamName){
          if(needPlayers)
          {
            if(team.squad)
              this.processPlayers(team.squad, players);
            else
              coach = team.coach
          }

          const {name, tla, shortName, areaName, address} = team;
          return { 
                    name,
                    tla,
                    shortName,
                    areaName,
                    address,
                    players,
                    coach
            }
        }
      })
    })
    return result.filter(element => element !== undefined).shift();
  }

  async getPlayer(leagueCode, teamName) {
    if(leagueCode)
    {
      const result = await this.findByFields({"code": leagueCode}).then((docs) => {
        if(docs.length===0)
          return [];
        return this.processDataPlayer(docs.shift().squads);
      });
      return  result;
    }
    
    if(teamName){
      const result = await this.findByFields({"squads.name": teamName}).then((docs) => {
        if(docs.length===0)
          return [];

        return this.processDataPlayerByTeam(docs, teamName);
      });

      return  result;
    }
  }

  async getTeam(teamName, players) {
    const result = await this.findByFields({"squads.name": teamName}).then((docs) => {
      return this.processDataTeam(docs, players, teamName);
    });
    return result;
  }
}


module.exports = MongoDbData;