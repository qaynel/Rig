# 09 — User-facing docs and the vision page (D2)

Part of the [master plan](00-master-plan.md). Depends on 03, 04, and 07, so the
docs describe the shipped product.

## Scope

- **README:** what Rig is, the one install command, what happens next (your
  agent unpacks the corpus and you approve the proposal), and what you get.
  There is no per-host support matrix; host inventory is not product scope or
  a test frame.
- **Install guide:** a fresh repo, an existing repo with agent config, upgrade
  from v5, and uninstall.
- **Troubleshooting:** every named refusal or coverage-gap message the product
  can print, with the fix.
- **Vision page** (`docs/vision.md`): what Rig is as shipped in 6.0.0 (central
  corpus, agent-unpacked, signed oracle, finished services), who it is for, and
  what the redesign will change. One page.
- Translated README editions are regenerated or clearly marked as lagging. The
  AT-HD-5 version consistency check stays green.

## Acceptance

- The 08 coherence check (docs ↔ CLI ↔ version) is green.
- A reader following only the README, on a clean machine, completes the D1
  flow by hand once. That run is recorded in a trace.
