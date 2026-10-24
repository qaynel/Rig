'use strict';

const os = require('node:os');

const SECRET_RE = /(?<![a-z0-9])sk-[a-z0-9-]{10,}|gh[opsur]_[a-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[a-z0-9-]{10,}|-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/gi;

function redact(text) {
  const home = os.homedir();
  return String(text)
    .replace(/-----BEGIN ((?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY)-----[\s\S]*?(?:-----END \1-----|$)/g, '[REDACTED]')
    .replace(SECRET_RE, '[REDACTED]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
    .replaceAll(home, '[HOME]')
    .replace(/(?:\/Users\/|\/home\/)[^\s/\\"']+/g, '[HOME]')
    .replace(/[A-Z]:\\Users\\[^\s\\"']+/gi, '[HOME]');
}

module.exports = { SECRET_RE, redact };
