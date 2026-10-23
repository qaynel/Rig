#!/usr/bin/env node
'use strict';
const path = require('node:path');
const { setupMcp } = require('../lib/mcp-dependencies');
try { setupMcp(path.resolve(process.argv[2])); } catch (error) { console.error(error.message); process.exitCode = 1; }
