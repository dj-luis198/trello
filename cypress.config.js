const { defineConfig } = require("cypress");
const dotenvPlugin =require('cypress-dotenv');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config= dotenvPlugin(config)
      return config
    },
    watchForFileChanges: false,
  },
});
