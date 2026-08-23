# Always-on drift-prevention rule (agent-tech-safety baseline)

Keep tool contexts coherent as the repo evolves. The repository documents are
the durable memory — there is no hidden learning store.

## Required behavior

1. Update central context when product insight changes or long sessions expose
   stale context.
2. Point secondary contexts at central sources where possible.
3. Register unavoidable byte duplicates in `.rig/sync-map.json`.
4. Run exact-copy checks after relevant edits.
5. Inspect semantic references for stale/deprecated statements before declaring
   work complete.
6. Report semantic drift instead of silently rewriting uncertain intent.
