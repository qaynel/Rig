'use strict';

const crypto = require('node:crypto');

function hash(text) { return crypto.createHash('sha256').update(text).digest('hex'); }
const CLAUDE_BLOCK_HASHES = new Set([
  '3050d47dc53cdfb1cc57943051acf20553f69bbe5418800af86f5b2728aa885e','993a5da4defff0a45d90b5ee6692c8c5962ca83471a570faf8c1df6358069017','9d23ef00e09a370909996b78b9635f8ad2c0604f4cf84d7c9ef9ba08d76f4f44','79057cd8dd66e1cea2279909023564a74a65b2ba56cc98991d665e028d3ffe1e','30dc662a368a672e759a27a3a66216da6ebc77b12aba150489c5fd5d1269e7b2','e3c32cb56b346bae39ec94b100f867a468b536030d99bebcd9a70a6f782b6115','d9d51d06d07f36c42e248ffbf95b03754dc1deaa3ff116579d5524a1218dcc86','3c6a91f143a35db585090da19d5478941d71e5de11aa688bd1d77d0c36ab77fa','5ceeab00680f8385dd6697e338391f42fb0e778cb52106d7ce29da9942d354e2','4465333d0f73b6fc54e33610c1d5d16fd001f7f45e1a7f9068ba096126699db4','c3b7663d06905e65f64d95652de9800a36fd99733e3532f7ab8b98fdad796689','e867780878f1c79d56fde25449db5a82adc0843c13f2cf5228e47018a08cbc23','938b1174c8cb153df096f32daa1968ffd786f477caff5dc447ee46770b5a4fb3','335437a467292f43e7085439eac1cb9817f79057b200c73896b2faa9be832418','046c247f4abf593cca9ab3264209bdb0ace39455b6c05dad057ede90af162b1c','b2c15eae280a147287b31abb59dd846c760236b1cafbed09cc8a658936f451e0','97e7d86d66cb5a54141b2aedd07945a95ade2bae423348b4e7ee94919e7938f7','702567b1498b5abb340e31ff4f2ca5a06fead8366d172fb920fc04f6d29ae7ea','35dd2f542452f29565e11e3127d5903d168ab77fd99b520410910c72864040ca','6b62e226c2edb4e3874e9496b60cf6014887feb5e89ea62554d4802ddad03d29','a7e56472b11bd3c838bc8199601f5a5527112a003c69fbf95b012bc13573a193','d43eb765e3c06f34e9f06377639bbf311283bdea2ccf3e73188a77ea65d7d7ec','daf8843bd183888b901ac5a115303d1ec6914b958d07614f61c083420e8f9e90','f64cbb03526becdee9f1e24901374e1cd6513262fa3ffaae6ce1f45b96cb8ac7','f73458c49ca895e747de167f5b19655307f8d32c12e9d484247398e90ee84f9a','fba210acc5ebdb396e3dc6792be55c4af7aa5b831a7ef6205634b7f17078e598','38218c95c98d22158390e40e8ae3c7672128bce35ca85e8d43f57a770ce1f78e',
]);

function claudeMdPointersOnly(text) {
  const lines = String(text).split(/\r?\n/);
  // rig: grandfather only exact signed paragraphs; new text in the north-star section is checked normally.
  const offending = [];
  const approvedLines = new Set();
  for (let i = 0; i < lines.length;) {
    if (!lines[i].trim()) { i++; continue; }
    let finish = i;
    while (finish < lines.length && lines[finish].trim()) finish++;
    if (CLAUDE_BLOCK_HASHES.has(hash(lines.slice(i, finish).join('\n')))) for (let n = i; n < finish; n++) approvedLines.add(n);
    i = finish;
  }
  lines.forEach((line, index) => {
    if (!approvedLines.has(index) && /\b(decided|must|never|always)\b/i.test(line) && !/wiki\//i.test(line)) offending.push({ line: index + 1, reason: 'decision language needs a wiki link on this line' });
  });
  for (let i = 0; i < lines.length;) {
    if (!lines[i].trim() || lines[i].startsWith('#') || lines[i].startsWith('>')) { i++; continue; }
    if (lines[i].startsWith('- ')) {
      while (i < lines.length && lines[i].trim()) i++;
      continue;
    }
    let finish = i;
    while (finish < lines.length && lines[finish].trim() && !lines[finish].startsWith('#')) finish++;
    const block = lines.slice(i, finish).join(' ');
    if (CLAUDE_BLOCK_HASHES.has(hash(lines.slice(i, finish).join('\n')))) { i = finish; continue; }
    const sentences = block.split(/[.!?](?:\s|$)/).filter(Boolean).length;
    if (sentences > 3 && !/\[[^\]]+\]\([^)]*wiki\//i.test(block)) offending.push({ line: i + 1, reason: 'long policy paragraph needs a wiki link' });
    i = finish;
  }
  return { ok: offending.length === 0, offending };
}

function decisionHasTrace(diffFiles, diffText = '', localTraces = []) {
  const touches = (diffFiles || []).some((file) => /^(rig\/corpus\/(rules|standards)\/|wiki\/specs\/)/.test(file));
  const hasTrace = (diffFiles || []).some((file) => /^wiki\/reasoning\/[^/]+\.md$/.test(file)) || /diff --git a\/wiki\/reasoning\//.test(diffText) || localTraces.some((file) => /^wiki\/reasoning\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(file));
  return { ok: !touches || hasTrace, missing: touches && !hasTrace ? ['add a dated wiki/reasoning trace in the same change'] : [] };
}

const WORDS = ['AT-PB-3', 'RB-LOCK-1', 'RB-PROF-1', '§', 'Gate 1', 'Gate 2', 'SHA-256', 'MCP'];
function plainQuestion(text, profile = {}) {
  const input = String(text);
  const allowed = new Set(profile.allowedAcronyms || []);
  const hits = WORDS.filter((word) => !allowed.has(word) && input.includes(word));
  for (const [pattern, label] of [[/\bD\d+[a-z]?\b/i, 'decision ID'], [/\b(?:AT|AC|RB)-[A-Z0-9-]+\b/i, 'acceptance ID'], [/\bPT-\d+\b/i, 'test ID'], [/wiki\/[\w./-]+/i, 'wiki path']]) {
    if (pattern.test(input)) hits.push(label);
  }
  for (const acronym of input.match(/\b[A-Z][A-Z0-9]{1,7}\b/g) || []) if (!allowed.has(acronym) && !['I', 'OK'].includes(acronym)) hits.push(acronym);
  if (/\b(can you confirm|please confirm|verify that|is this technically correct)\b/i.test(input)) hits.push('technical confirmation request');
  return { ok: hits.length === 0, hits: [...new Set(hits)] };
}

module.exports = { claudeMdPointersOnly, decisionHasTrace, plainQuestion };
