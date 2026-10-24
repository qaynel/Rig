---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Source inheritance and retained owners

Actual source reuse is mandatory; a similar home-grown design does not count.
These ports are present locally, with immutable pins and runnable checks. Their
presence does not certify the uncommitted candidate or public release.

## Adopted source and assets

| Capability | Exact source and pin | Keep / adaptation / discard | Licence, integration and verification |
|---|---|---|---|
| Static inference | [Model2Vec model.py](https://github.com/MinishLab/model2vec/blob/40deb6bbb023f9bb1e9c2c9e6b089164ebafc0fd/model2vec/model.py), StaticModel.tokenize / _encode_batch | Port unknown-ID removal, token mean pooling and L2 normalization to JS and the shipped row-quantized table. Discard Python/numpy runtime, downloads and unrelated operations. | MIT, full notice in baseline UPSTREAM-NOTICES.md; exact source digest in model.json; known-vector and offline memory checks. |
| Tokenization | [easy-bert](https://github.com/robrua/easy-bert/tree/c6b893090e13e6a86174b31323169fbb08ff5c89), BasicTokenizer.tokenize / WordpieceTokenizer.splitToken | Port Unicode cleanup, punctuation/CJK boundaries, accent folding, greedy continuation and 200-character unknown-token ceiling. Java character APIs become Node Unicode categories; discard Java/TensorFlow runtime. | MIT, full notice and source file digests; known-token, unknown/overlong input and normalized-vector checks in tests/ai-sdlc-source-reuse.test.js. |
| Model and vocabulary | [potion-base-2M](https://huggingface.co/minishlab/potion-base-2M), model2vec static distillation of BGE | Adopt weights/vocabulary, per-row int8 form; 2,007,904-byte weights and 219,690-byte vocabulary; no first-run fetch. | MIT text beside assets. Every asset has size/digest; model revision content-addresses weights/tokenizer/runtime. Integrity, cache and installed-runtime checks. Asset adoption is distinct from source-code reuse above. |
| Child-context exclusion | [DeepAgents subagents.py](https://github.com/langchain-ai/deepagents/blob/0f7ddb463fc6a0164756a98eed9ccb6f590cf797/libs/deepagents/deepagents/middleware/subagents.py), _EXCLUDED_STATE_KEYS / non-fork state filtering | Port explicit/private state exclusion to scoped worker JSON; extend recursively. Discard LangGraph, parent messages, reducers, fork runtime and tools. | MIT full notice/pin in workers.js; nested-context, artifact/private-state and process-race checks. |
| Bounded execution | [Hermes iteration_budget.py](https://github.com/NousResearch/hermes-agent/blob/748c79a1c6873124d84071cdabb4062a75913e1f/agent/iteration_budget.py), IterationBudget.consume | Port locked check-and-consume before attempts to durable spend units. Keep failed/unknown charges; discard Python threads, refunds and agent runtime. | MIT full notice/pin in model-routing.js; actual attempts, exhaustion, escalation and contention. One unit means a bounded call, not an invented monetary price. |
| Review continuity | [Open-Code-Review compare.go](https://github.com/alibaba/open-code-review/blob/375f64cd6f67a48a135da83cfcf59c52669a09cb/internal/session/compare.go), finding key | Existing adaptation normalizes evidence without treating line drift as a new finding. Keep one Rig receipt owner; discard Go runtime. | Apache-2.0 attribution in scripts/review-receipt.js; existing continuity tests. Predates this expansion. |

Source SHA256s are shipped in model.json: Model2Vec
`bcec77bda1c8f5e936310a99efcab202f58ea290d5de1b112996cdd49e22ec8e`;
easy-bert BasicTokenizer
`5bfc790e4390661cf561c03756ba09e5e3ac5ec221dc9af2c7f279cd5c1b87e9`;
WordpieceTokenizer
`bb67e86059c95a2d9be930aa8092004b6c3906079cdd76cef0570ee4b71c9106`.
The source-reuse tests preserve pins/notices and exercise adapted behavior.
Upstream source was inspected, not executed as a repository.

## Explicitly discarded candidates

The technical source selection is editable; signed behavior remains mandatory.
The earlier table incorrectly described every candidate as a required port.
These are keep/discard decisions, not claims of reuse:

- Claude-Mem `dcb28a768c6be4b8e451843210558275caa8ec44` reduces character/provider/session context. Rig retains its existing UTF-8 byte cap, whole records and retrievable pointers: transplanting provider/session policy would change source retention. Its worker/search framework is unnecessary alongside the adopted local static engine and cited lexical fallback. No Claude-Mem source is claimed.
- Hermes `748c79a1c6873124d84071cdabb4062a75913e1f` memory fence/stream scrubber transforms provider output. Rig retains recalled text as inert cited data; rewriting source records damages provenance. The actual budget source port above replaces the earlier window-formula candidate with a real spending bound.
- DeepAgents summarization is a pattern only: its automatic model call conflicts with free local upkeep. Retain immutable traces, source maps and deterministic fidelity checks; no Python offload source claimed.
- Harness² `1cfe254e8d25b15f37048c3730134686abe60335` is a research pattern, not the selected executor. Its scalar selector/runner is unsuitable for the protected oracle, and third_party/wb_runner has separate terms. Actual local replay reuses Rig's journal, source digest and review evidence. No Harness² source or bundled runner is included.
- Agent Skills `69ef37e9424c0a7ea9dd2293b559e43ec8176379` supplies format conformance; Superpowers `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` supplies instruction provenance for existing Rig skills. Neither is described as a newly copied runtime.
- Transformers.js/MiniLM was rejected for complete installed footprint and native/transitive runtime cost. mem0, DSPy, meta-harness and OpenViking add provider, optimizer, authority or licensing scope absent from the requirement.

## Product and evidence boundary

The complete kit ships inert; the host agent chooses the graft. Bootstrap
projection, journalled removal, the trust-root verifier, wiki indexing, signing
and host-native execution remain their existing owners. Source ports replace
small algorithms, without a parallel agent loop, vector service, signer or
catalogue. Rig's MIT text, upstream notices and model licence ship with the
archive and its per-file digest manifest.

Local inclusion/inference checks are not hosted platform execution, a published
real download or human-presence authentication. Those remain release evidence.
Cited lexical fallback never proves the required semantic capability.
