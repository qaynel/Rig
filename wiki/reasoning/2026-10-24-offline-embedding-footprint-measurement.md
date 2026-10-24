---
date: 2026-10-24
source: agent
topics: what-rig-is
decisions: NS-20, NS-23
status: current
supersedes: 
tags: measurement, open-source, semantic-search
summary: Measured the pinned offline embedding candidate end to end; the full Transformers.js install is 380 MB with an LGPL native dependency, while an onnxruntime-web WASM path gives byte-identical recall at 35 MB, MIT/Apache-2.0, no native binaries.
---

# Measured evidence for the offline embedding engine

The owner required offline meaning-based search and then opened the engine
choice to any suitable open-source candidate, judged on smallest complete
installed footprint rather than weight size. This trace records what was
actually measured, not what the plan assumed. All work happened in isolated
temporary directories; nothing was installed into the repository and no
dependency was added.

## What was run

`@huggingface/transformers@3.8.0` was installed from npm into an empty
directory. `Xenova/all-MiniLM-L6-v2` was downloaded at the pinned revision
`751bff37182d3f1213fa05d7196b954e230abad9`. Two probes then embedded text with
`globalThis.fetch`, `net.Socket.prototype.connect`, `http.request` and
`https.request` replaced by throwing counters, so any outbound attempt both
fails and is counted.

The recall case is the acceptance shape required by AC-052: the query
*"How do I cancel a recurring payment?"* against three candidate records, where
the correct record — *"Steps to stop an automatic subscription charge."* —
shares no content word with the query.

## Result of the full package route

| Measurement | Value |
|---|---|
| Installed `node_modules` | 380 MB |
| `onnxruntime-node` prebuilt binaries | 210 MB across darwin, linux and win32 |
| `onnxruntime-web` | 91 MB |
| `sharp` with `@img/sharp-libvips-darwin-arm64` | 16.9 MB, **LGPL-3.0-or-later** |
| Model assets (quantized ONNX, tokenizer, configs) | 23.7 MB |
| Load time / network calls | 58 ms / 0 |
| Top match and margin | correct, 0.5749 against 0.0750 and 0.0305 |
| Content words shared between query and top match | none |

The capability works offline. The footprint does not match the brief. Two
further findings close off the obvious reductions: `onnxruntime-web` is
imported unconditionally by `src/backends/onnx.js`, and `sharp` is imported
unconditionally by `src/utils/image.js`, so a text-only install cannot drop
either. Pruning optional packages and two of the three platform binary sets
still left 214 MB, and the pruned tree no longer runs. The LGPL native library
is therefore mandatory on this route, for a product that never processes an
image.

## Result of the minimal WASM route

The same model was run through `onnxruntime-web`'s WASM backend with the
tokenizer loaded from the Apache-2.0 Transformers.js source, bypassing both the
native runtime and `sharp`.

| Measurement | Value |
|---|---|
| `ort-wasm-simd-threaded.wasm` + `ort.wasm.min.mjs` + tokenizer source | 11.3 MB |
| Model assets | 23.7 MB |
| **Total shipped artifact** | **35.0 MB** |
| Licences | MIT (ONNX Runtime) and Apache-2.0 (tokenizer, model) |
| Native binaries / platform-specific packages | none |
| Session load | 135 ms |
| Per-embedding latency | 7.3 ms |
| Network calls | 0 |
| Top match and margin | correct, 0.5752 against 0.0749 and 0.0306 |

Scores agree with the native run to three decimal places, so this is the same
model behaviour at a tenth of the size. One WASM artifact covers every
supported operating system, which removes the per-platform binary matrix the
contract would otherwise have to prove, and removes the copyleft dependency
from the redistributed product.

## What this changes and what it does not

The engineering recommendation is the WASM route: pin the ONNX Runtime WASM
asset and the model revision, vendor or narrowly import the tokenizer with its
Apache-2.0 notice, and record asset digests for the integrity check. The naive
dependency route is rejected on size, on a mandatory LGPL native library with
no product purpose, and on a three-platform binary matrix.

This is measured evidence on one machine, Apple Silicon under Node v24.18.0. It
does not prove Linux or Windows behaviour, does not prove the threaded WASM
variant degrades correctly where threads are unavailable, and does not test
recall across a realistic memory corpus rather than three sentences. No
alternative model family has been measured yet; the owner named Chinese
open-weight ecosystems as in scope and those remain unevaluated. Nothing has
been selected, installed or committed, and no proving test asserts any of this.
