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
      hideCredentials: true, 
    hideCredentialsOptions: {
      body: ['token','key'],
      qs: ['token','key']
    },
      cards:'cards',
      lists:'lists',
      boards:'boards',
      labels:'labels',
      memberships: 'memberships',
      snapshotOnly: true,
      requestMode: true,
    },
    watchForFileChanges: false,
    video: false,
  },
});
