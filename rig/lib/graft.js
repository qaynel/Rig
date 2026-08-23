'use strict';

function ensureManagedBlock(source, name, content) {
  const start = `<!-- rig:${name}:start -->`;
  const end = `<!-- rig:${name}:end -->`;
  const block = `${start}\n${content}\n${end}\n`;
  const existing = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}\\n?`);
  if (existing.test(source)) {
    return source.replace(existing, block);
  }
  const separator = source.length === 0 || source.endsWith('\n') ? '' : '\n';
  return `${source}${separator}${block}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { ensureManagedBlock };
