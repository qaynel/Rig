# Upstream source notices

`embedding.js` contains small JavaScript adaptations of source distributed
under the MIT License. The full upstream file paths, commit pins, source SHA-256
digests, and adapted symbols are recorded in
`assets/potion-base-2m/model.json`.

## Model2Vec inference

Source: [MinishLab/model2vec](https://github.com/MinishLab/model2vec), pinned
at `40deb6bbb023f9bb1e9c2c9e6b089164ebafc0fd`, `model2vec/model.py`.
Adapted symbols: `StaticModel.tokenize` (filter unknown token IDs) and
`StaticModel._encode_batch` (mean-pool token vectors, then L2-normalize).
The source file SHA-256 is
`bcec77bda1c8f5e936310a99efcab202f58ea290d5de1b112996cdd49e22ec8e`.

Copyright (c) 2024 Thomas van Dongen

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## easy-bert WordPiece tokenizer

Source: [robrua/easy-bert](https://github.com/robrua/easy-bert), pinned at
`c6b893090e13e6a86174b31323169fbb08ff5c89`. Adapted symbols:
`BasicTokenizer.tokenize` and `WordpieceTokenizer.splitToken` from
`src/main/java/com/robrua/nlp/bert/BasicTokenizer.java` and
`src/main/java/com/robrua/nlp/bert/WordpieceTokenizer.java`. Their individual
source SHA-256 digests are recorded in the model metadata.

Copyright (c) 2019 Rob Rua

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Distilled weights and inherited vocabulary

The potion-base-2M publisher declares MIT at immutable revision
`389b9f64be5aa4ae7a6bc6fe95ef20ce485ae5da`. Its config names
`baai/bge-base-en-v1.5` as its tokenizer source; the BGE model card declares MIT.
The complete BGE MIT notice is retained beside the assets in `BGE-MIT.txt`.
The potion vocabulary is a subset of BGE's vocabulary, which is byte-identical
to google-bert/bert-base-uncased at revision
`86b5e0934494bd15c9632b12f734a8a67f723594`. Its Apache-2.0 terms are retained in
`BERT-Apache-2.0.txt`, alongside potion's MIT terms. `model.json` records
immutable source pins, source digests and this relationship; `PROVENANCE.md`
records byte-for-byte weight conversion verification. No BGE/BERT weight
runtime is bundled.

## Open-Code-Review finding continuity

Source: https://github.com/alibaba/open-code-review/blob/375f64cd6f67a48a135da83cfcf59c52669a09cb/internal/session/compare.go

Copyright 2026 alibaba/open-code-review Contributors
SPDX-License-Identifier: Apache-2.0

Rig's JavaScript finding-key adaptation in scripts/review-receipt.js changes
normalization and available finding fields, retaining continuity across line
movement. The complete upstream Apache-2.0 licence ships in
`licenses/open-code-review-Apache-2.0.txt`. The pinned upstream tree has no
root NOTICE file. Source SHA256:
`af0799ce805a9e3b7fd39baddd792db828330fc61df210d05b10ab0f36e548d2`.
