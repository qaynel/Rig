'use strict';

// Requiring this module keeps this machine's own global/system git config
// (e.g. a personal core.hooksPath) from leaking into git commands run
// against this file's throwaway fixture repos.
process.env.GIT_CONFIG_GLOBAL = '/dev/null';
process.env.GIT_CONFIG_SYSTEM = '/dev/null';
// Nulling global config also drops safe.directory, so a checkout owned by
// another uid (the CI container) is rejected; command-scope config is honoured.
process.env.GIT_CONFIG_COUNT = '1';
process.env.GIT_CONFIG_KEY_0 = 'safe.directory';
process.env.GIT_CONFIG_VALUE_0 = '*';
