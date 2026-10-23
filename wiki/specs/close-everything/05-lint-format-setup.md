# 05 — Lint-format setup and replacement rule (RIG-113)

Part of the [master plan](00-master-plan.md). Depends on [03](03-central-corpus.md)
(the rule lives in the corpus as part of the lint-format service).

## Current state

The drafts exist: `wiki/specs/ecosystem-preferences.md` (five ranked
ecosystems, with end-of-life and coverage signals) and
`wiki/specs/setup-decision-rule.md` (three conditions for proposing a
replacement, exact write scope, and a distinct approval). No runnable case
exists. The draft's `.rig-backup` mechanism was marked as an assumption.

## Owner decisions (round 4)

- The ranked lists and signals are **approved as drafted**.
- On replacement, the old config stays **recoverable through Rig's existing
  undo record** (journal and preimage). No `.rig-backup` files. Existing
  uninstall does not restore arbitrary replaced configs, so implement this
  behavior explicitly; recording a preimage alone does not satisfy it.

## Approach

- Update `setup-decision-rule.md`: replace the backup section with the
  journal/preimage rule, and remove the "open item" section.
- Implement the rule inside the lint-format service in the corpus. A
  replacement proposal never lands without its own explicit approval, separate
  from selection and from plan approval (the RIG-115 consent model).

## Acceptance (four runnable cases, frozen at 10)

1. **Good existing tool:** it is preserved, no proposal is made, and nothing is
   written.
2. **End-of-life tool:** a proposal is surfaced. If the user declines, the repo
   stays byte-identical.
3. **No tool, setup approved:** exactly the declared config and ignore files
   land, and nothing else.
4. **Replacement accepted:** typed, approved replacement records retain the
   original preimage and restore it byte-identical on undo/uninstall. Scope
   shared manifests to approved sections; do not broaden generic uninstall
   deletion authority. Edited replacement files produce a conflict and retain
   the recoverable preimage. Interruption/retry never deletes the last backup
   before reversal succeeds. Cases cover JSON/config files and shared TOML.
