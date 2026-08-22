# Sanitation and remediation

## What it is

Sanitation reads existing harness files as bounded, untrusted bytes before any
profiling or recommendation. It never imports, sources, or executes them.
Remediation is a separate, read-only proposal until the user approves the exact
observed change through a valid presence path. [Gate 2 §8.7](../gate2/technical-spec.md#87-sanitation-and-bounded-remediation)

## Why it is this way

Repository instructions are an input to the agent and therefore a trust boundary,
not trusted context. Separating detection from mutation lets the user inspect a
specific fix and makes preimage CAS, no-op rejection, rollback, and fresh
post-change sanitation enforceable. [Advanced grilling GA-3 and GA-9c](../sources/logs/advanced-grilling.md)

## What binds it

`AD-7` fixes byte-safe inspection and redacted evidence; `AD-8` fixes bounded
remediation and approval. `AT-BASE-1`, sanitation, remediation, and secret cases
define externally visible ordering and failure behavior. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Automatic remediation, source/import during scanning, arbitrary shell plans,
note-only scans, no-op remediation, and unbounded matched evidence were rejected
as execution, consent, or false-success failures. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen sanitation-first rule: [Gate 1](../gate1/business-spec.md)
- Exact mechanics: [Gate 2 §8.7](../gate2/technical-spec.md#87-sanitation-and-bounded-remediation)
- Security reference: [agent harness security playbook](../sources/reference/agent-harness-security-playbook.raw.md)

## What is still open

The design is not implemented. v0.11 resolves the earlier transaction
contradiction: remediation uses the append-only mutation journal with its own
terminal states, retains successful owner-approved content edits outside
uninstall, and records restored digests after rollback so install resume cannot
mistake reverted work for a live artifact. Slice 6 must implement that contract.
[Gate 2 Slice 6](../gate2/technical-spec.md#slice-6---real-sanitation-remediation-and-policy-aware-transaction)
[v0.11 correction](../reasoning/2026-08-21-gate2-v0.11-carried-review-corrections.md)
