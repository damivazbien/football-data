require('dotenv').config();
const ApolloError = require('apollo-server-errors');
const {MongoClient} = require('mongodb');
const {ApolloServer} = require('apollo-server');
const FootballAPI = require('./src/football-data-v4');
const typeDefs = require('./src/schema');
const MongoDbData = require("./src/mongodb/MongoDbData");


const client = new MongoClient(process.env.MONGO_URL+'/'+process.env.DB);
client.connect();

const resolvers = {
    
    Mutation: {
        importLeague: async(_, {leagueCode}, {dataSources}) => {
            result = await dataSources.footballAPI.getCompetition(leagueCode.toUpperCase());
            if(!result)
                throw new ApolloError.ApolloError(`League code exist in our database, please query using players or teams`, "PERSISTED_QUERY_NOT_FOUND");
            if(result.errorCode)
                throw new ApolloError.ApolloError(result.message, "INTERNAL_SERVER_ERROR");
                
            return result;
        }
    },
    Query: {
        players: async(_, {leagueCode, teamName=""}, {dataSources}) => {
            result = await dataSources.mongoDbConnection.getPlayer(leagueCode, teamName);
            if(leagueCode && teamName!="")
                throw new ApolloError.ApolloError("Team does't exist in our database, please import League", "PERSISTED_QUERY_NOT_FOUND");
            if (result.length< 1)
                throw new ApolloError.ApolloError("League code does't exist in our database, please import", "PERSISTED_QUERY_NOT_FOUND");
            return result;
        },
        teams: async(_, {name, players=false}, {dataSources}) => {
            result = await dataSources.mongoDbConnection.getTeam(name, players);
            return result;
        }
    }
  };


const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention:true,
    cache: 'bounded',
    dataSources: () => ({
        
            footballAPI : new FootballAPI(process.env.TOKEN, process.env.MONGO_URL, process.env.DB, process.env.COLLECTION),
            mongoDbConnection : new MongoDbData(client.db().collection(process.env.COLLECTION))
        
    })
});

server.listen().then(() => {
    console.log(`
      🚀  Server is running!
      🔉  Listening on port 4000
      📭  Query at http://localhost:4000
    `);
  });