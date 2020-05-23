module.exports = {
  client: {
    includes: [
      "app/src/**/*.js*",
      "app/src/**/*.ts*"
    ],
    service: {
      name: "KlassLive",
      localSchemaFile: "api/src/schema.graphql"
    }
  }
};
