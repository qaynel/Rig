'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const baseline = path.join(root, 'rig', 'catalog', 'baseline');
const embedding = require(path.join(baseline, 'embedding'));
const model = JSON.parse(fs.readFileSync(path.join(baseline, 'assets', 'potion-base-2m', 'model.json'), 'utf8'));

test('pinned static-model and WordPiece source seams retain exact pins and notices', () => {
  const inference = model.inference_source;
  assert.deepEqual(inference.model2vec, {
    repository: 'https://github.com/MinishLab/model2vec',
    commit: '40deb6bbb023f9bb1e9c2c9e6b089164ebafc0fd',
    file: 'model2vec/model.py',
    sha256: 'bcec77bda1c8f5e936310a99efcab202f58ea290d5de1b112996cdd49e22ec8e',
    symbols: ['StaticModel.tokenize', 'StaticModel._encode_batch'],
  });
  assert.deepEqual(inference.wordpiece, {
    repository: 'https://github.com/robrua/easy-bert',
    commit: 'c6b893090e13e6a86174b31323169fbb08ff5c89',
    files: {
      basic_tokenizer: 'src/main/java/com/robrua/nlp/bert/BasicTokenizer.java',
      wordpiece_tokenizer: 'src/main/java/com/robrua/nlp/bert/WordpieceTokenizer.java',
    },
    sha256: {
      basic_tokenizer: '5bfc790e4390661cf561c03756ba09e5e3ac5ec221dc9af2c7f279cd5c1b87e9',
      wordpiece_tokenizer: 'bb67e86059c95a2d9be930aa8092004b6c3906079cdd76cef0570ee4b71c9106',
    },
    symbols: ['BasicTokenizer.tokenize', 'WordpieceTokenizer.splitToken'],
  });

  const notices = fs.readFileSync(path.join(baseline, 'UPSTREAM-NOTICES.md'), 'utf8');
  assert.match(notices, /Copyright \(c\) 2024 Thomas van Dongen/);
  assert.match(notices, /Copyright \(c\) 2019 Rob Rua/);
  assert.match(notices, /StaticModel\._encode_batch/);
  assert.match(notices, /WordpieceTokenizer\.splitToken/);
});

test('ported tokenizer follows uncased BasicTokenizer and greedy WordPiece known IDs', () => {
  const vocab = new Map(fs.readFileSync(path.join(baseline, 'assets', 'potion-base-2m', 'vocab.txt'), 'utf8')
    .trimEnd().split('\n').map((token, id) => [token, id]));
  assert.deepEqual(embedding.tokenize(vocab, 'CAFÉ\u0000 rotating—中'), [
    vocab.get('cafe'), vocab.get('rotating'), vocab.get('—'), vocab.get('中'),
  ]);
  assert.deepEqual(embedding.tokenize(vocab, `${'x'.repeat(201)} rotating`), [
    vocab.get('rotating'),
  ], 'the model2vec seam filters the source tokenizer unknown token');
});

test('pinned model known vector remains the mean pooled, L2-normalized inference result', () => {
  const vector = embedding.embed('rotating credentials monthly');
  assert.ok(Math.abs(Math.hypot(...vector) - 1) < 1e-12);
  const digest = crypto.createHash('sha256').update(Buffer.from(vector.buffer)).digest('hex');
  assert.equal(digest, '9d9d74ceff433f382b4bc012a525eeaed64f91030c4f056e6711d010834711ba');
});
