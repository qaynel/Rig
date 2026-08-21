# Drift and secret controls

## What it is

Drift prevention combines byte-exact synchronization checks with an agent
semantic rule. Secret detection is deterministic and local by default; matched
secret content is redacted and does not reach the model unless the user
explicitly enables model-assisted triage. [Gate 1 D16](../gate1/business-spec.md)

## Why it is this way

The repository itself is the memory for installed doctrine, so drift needs no
separate database. Deterministic secret detection provides a reviewable floor,
and keeping matches local avoids making redaction correctness the only barrier
between live credentials and a third party. [Advanced grilling GA-9d–GA-9e](../sources/logs/advanced-grilling.md)

## What binds it

`GA-9d`, `GA-9e`, `D15`, `D16`, and `AD-12` define the controls and disclosure.
`AT-SECRET-*`, `AT-DRIFT-*`, and `AT-REPORT-1` test local-only, redacted,
truthful results. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

A mutable memory database, note-only scans, a naive history grep presented as a
security service, model-assisted triage by default, and redaction as the sole
guard were rejected. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen secret and finding rules: [Gate 1 §2](../gate1/business-spec.md)
- Control mechanisms: [Gate 2 §8.8](../gate2/technical-spec.md#88-drift-and-secret-controls)
- Captured taxonomy: [product-security reference](../sources/reference/product-security-taxonomy.raw.md)

## What is still open

Round 3 found no defined channel for explicitly enabled model-assisted triage,
so `AT-SECRET-1` is not currently executable. Gate 2 must describe that channel
without weakening the default-local rule. [Status](../status.md#the-blocker-round-3-failed)

For lint-format, redaction is broader than secrets (`GA-32`). Linter and
formatter output can quote source and surface secrets, personally identifying
information, or other host-rooted sensitive data; Rig strips all of it on the
producing host before any output leaves that machine, making the producing host
the redaction boundary. Matched secret content still reaches the agent only on
explicit opt-in.
[reasoning trace](../reasoning/2026-08-21-lint-format-output-privacy.md)
