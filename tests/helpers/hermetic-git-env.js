'use strict';

// Requiring this module keeps this machine's own global/system git config
// (e.g. a personal core.hooksPath) from leaking into git commands run
// against this file's throwaway fixture repos.
process.env.GIT_CONFIG_GLOBAL = '/dev/null';
process.env.GIT_CONFIG_SYSTEM = '/dev/null';
