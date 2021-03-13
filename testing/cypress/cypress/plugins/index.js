/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const micoocypress = require("micoocypress");

const micooption = {
  host: "http://localhost:8123/engine",
  apiKey: "AKb46a7904ad3e2de84c",
  pid: "PIDb534f90b22f946df9511846e73700e66",
  buildVersion: process.env.MICOO_BUILD_VERSION ? process.env.MICOO_BUILD_VERSION : "missing versioning",
}

const cypressOption = {
  triggerVisualTesting: true
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  micoocypress(on, micooption, cypressOption);
}
