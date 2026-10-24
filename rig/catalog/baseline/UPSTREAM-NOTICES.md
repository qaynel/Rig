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
