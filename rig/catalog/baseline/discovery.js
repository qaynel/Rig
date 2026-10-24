'use strict';

// Owner-idea discovery: turns recorded owner words into a requirement draft,
// separated implementation suggestions, and open behaviour questions. Pure
// text work; the owner approves the draft, nothing here decides for them.

const fs = require('node:fs');
const path = require('node:path');

const OUTCOME = /\bI\s+want\b|\bmust\b|\bshould\b|\bwhen\b[\s\S]*\bthen\b|\bI\s+need\b/i;
// shortcut: a clause mixing an outcome with a tool mention is kept whole as a
// suggestion, so the owner must restate that outcome; upgrade if this loses real requirements.
const TOOLS = 'jq|sed|awk|grep|curl|wget|npm|pnpm|yarn|pip|docker|sqlite3?|redis|postgres|python|bash|lodash|axios|express';
const SUGGESTION = new RegExp([
  '\\bshell out\\b',
  '\\beasiest if you\\b',
  '\\bprobably\\b',
  '\\bjust\\b[^.]*\\bwith\\b',
  '\\b(?:use|using|with|via|through|pipe to)\\s+(?:the\\s+|a\\s+|an\\s+)?(?:' + TOOLS + ')\\b',
  '\\buse\\s+(?:a|an|the)?\\s*[\\w.-]+\\s+(?:library|tool|package|cli)\\b',
].join('|'), 'i');
const HEDGE = /\b(?:may|might)\s+(?:be|differ|vary|change)\w*|\bmaybe\b|\bnot sure\b|\bdepend(?:s|ing)?\b|\bpossibly\b/i;
const STOP = new Set(['a', 'an', 'the', 'is', 'are', 'be', 'do', 'does', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'it', 'that', 'this', 'if', 'then', 'when', 'i', 'want', 'should', 'may', 'might', 'than', 'what', 'which', 'who', 'by', 'with', 'at', 'as', 'from']);

/** Split text into clauses, each with its verbatim quote and start offset. */
function segments(text) {
  const out = [];
  const boundary = /(?<=[.!?])\s+|\n+|,?\s+and\s+(?=I\s+want\b)/gi;
  let start = 0;
  const push = (from, to) => {
    const raw = text.slice(from, to);
    const quote = raw.trim();
    if (quote) out.push({ quote, start: from + raw.length - raw.trimStart().length });
  };
  let m;
  while ((m = boundary.exec(text))) {
    push(start, m.index);
    start = m.index + m[0].length;
  }
  push(start, text.length);
  return out;
}

function readSource(repo, source) {
  return fs.readFileSync(path.join(repo, source), 'utf8');
}

function persist(repo, rel, data) {
  const abs = path.join(repo, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, `${JSON.stringify(data, null, 2)}\n`);
}

function tokens(text) {
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((t) => !STOP.has(t)));
}

/** A settled question is covered when most of its topic words appear in the candidate. */
function isSettled(candidateQuote, settled) {
  const cand = tokens(candidateQuote);
  return settled.some((d) => {
    const topic = [...tokens(d.question || '')];
    return topic.length >= 2 && topic.filter((t) => cand.has(t)).length / topic.length >= 0.6;
  });
}

function extract(repo, { source }) {
  const requirements = [];
  const suggestions = [];
  for (const seg of segments(readSource(repo, source))) {
    if (SUGGESTION.test(seg.quote)) {
      suggestions.push({ text: seg.quote, source: { file: source, quote: seg.quote }, approved: false });
    } else if (OUTCOME.test(seg.quote)) {
      const id = `DR-${String(requirements.length + 1).padStart(3, '0')}`;
      requirements.push({ id, statement: seg.quote.replace(/\s+/g, ' '), source: { file: source, quote: seg.quote } });
    }
  }
  const draft = { requirements, suggestions };
  persist(repo, '.rig/discovery/draft.json', draft);
  return draft;
}

function openQuestions(repo, { source }) {
  const decisionsFile = path.join(repo, '.rig', 'decisions.json');
  const settled = fs.existsSync(decisionsFile) ? JSON.parse(fs.readFileSync(decisionsFile, 'utf8')).settled || [] : [];
  const questions = [];
  const seen = new Set();
  for (const seg of segments(readSource(repo, source))) {
    if (SUGGESTION.test(seg.quote) || !HEDGE.test(seg.quote) || seen.has(seg.quote)) continue;
    seen.add(seg.quote);
    if (isSettled(seg.quote, settled)) continue;
    questions.push({
      question: `What should happen? The owner said: "${seg.quote}"`,
      affects_observable_behavior: true,
      source: { file: source, quote: seg.quote },
    });
  }
  persist(repo, '.rig/discovery/questions.json', questions);
  return questions;
}

module.exports = { extract, openQuestions };
