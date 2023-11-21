const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const EtherDataSource = require("./datasource/ethDatasource");

// Load GraphQL schema definitions from schema.graphql file
const typeDefs = importSchema("./schema.graphql");

require("dotenv").config(); // Load environment variables if needed

// Define resolver functions for GraphQL queries
const resolvers = {
  Query: {
    // Resolver function to get Ether balance by address
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver function to get total supply of Ether
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver function to get the latest Ethereum price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver function to get the block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance with defined typeDefs, resolvers, and dataSources
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(), // Instantiate EtherDataSource
  }),
});

server.timeout = 10; // Set server timeout to 10 seconds

// Start the Apollo Server on port 9000 and log server URL once it's ready
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
