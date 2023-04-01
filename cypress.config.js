require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.key= process.env.CYPRESS_KEY;
      config.env.token= process.env.CYPRESS_TOKEN;
      config.env.idboard= process.env.CYPRESS_IDBOARD;

      return config
    },
    baseUrl: 'https://api.trello.com/1',
    env:{
      cards:'cards',
      lists:'lists',
      boards:'boards',
      labels:'labels',
      memberships: 'memberships'

    },
    watchForFileChanges: false,
    video: false,
  },
});
