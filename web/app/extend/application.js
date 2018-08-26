'use strict';

const PLUGINHOOK = Symbol('Application#pluginHook');
const PLUGINCONFIG = Symbol('Application#Config');

module.exports = {
  get pluginHook() {
    if (!this[PLUGINHOOK]) {
      return {};
    }
    return this[PLUGINHOOK];
  },

  set pluginHook(value) {
    this[PLUGINHOOK] = value;
  },

  get pluginConfig() {
    if (!this[PLUGINCONFIG]) {
      return {};
    }
    return this[PLUGINCONFIG];
  },

  set pluginConfig(value) {
    this[PLUGINCONFIG] = value;
  },

  getPluginConfig(name) {
    if (!this[PLUGINCONFIG] || !this[PLUGINCONFIG][name]) {
      return {};
    }

    return this[PLUGINCONFIG][name];
  },
};
