# Delivery SOP — spec, scope of work, task list, acceptance, then work

The standard operating procedure for any multi-step change. It sits on top of
the AI development standards (`ai-sdlc.md`) and the routing pipeline
(`routing.md`). It is guidance; its checks are named per step.

## The five artifacts, in order

1. **Specification sheet.** What the product must do and what evidence proves
   each behavior. Written and owner-approved before anyone builds.
2. **Statement of work (SOW).** Scope: one row per work package with its
   deliverable, completion evidence, delivery order, focused test command,
   exclusions and who owns what.
3. **Task list.** One checkbox per task, derived from the SOW scope table, one
   section per work package. Already-finished tasks are ticked `[x]`; everything
   else stays `[ ]`. Tasks only a human may do carry 🔒.
4. **Acceptance criteria.** Every task carries **Accept** (the observable pass
   condition) and **Prove** (the exact command that demonstrates it). A task
   with no runnable Prove is not ready to start; rewrite it first.
5. **Work.** Starts only when 1–4 exist and the owner has said go. Agents do
   the task list; they do not rewrite scope.

Task-list shape (copy this):

```
- [ ] T-<wp>.<n> <imperative title>.
  Accept: <observable condition>.
  Prove: `<exact command>`
```

## Rules for whoever executes the list

- **One task at a time, in order.** Red first (watch the Prove command fail for
  the missing behavior), smallest fix, green, then tick.
- **Tick rule.** A box is ticked only after the Prove command was run in this
  session and passed. The command and its result line go into the trace the
  same minute. Never tick from memory, from a transcript, or from "it should
  pass". If Prove cannot run, the box stays open and the blocker is written down.
- **Scope is fixed.** Do not add, drop, merge or reword tasks. If the work shows
  the list is wrong, stop, write the finding in a trace, and ask the owner. The
  spec, SOW and task list change together, by the owner or on the owner's word.
- **Protected files.** Never edit frozen tests, the signed manifest or anything
  the project marks as human-signed; never sign. File a candidate amendment and
  tick only "candidate filed".
- **Owner-only (🔒) tasks** are prepared, not performed. The agent writes the
  exact input (commands, bundle, evidence) and stops.
- **Trace cadence.** File a dated trace at least every three minutes of active
  work: done, in flight, next. Record failed approaches the moment they fail.
- **Fast loop, one gate.** Use the single focused test file while working. The
  full gate runs once, right before push, and must be green.
- **One commit per coherent task**, containing only that task's files. Never
  push, open a PR, close issues, or write to GitHub without the owner.
- **Stuck rule.** Two failed attempts at the same task: stop, record what was
  tried and what was seen, move to the next unblocked task, report at the end.

## Closing the list

The list is complete only when every box is `[x]` or is a 🔒 box with its input
prepared, `npm test` is green on the final bytes, and an independent reviewer
re-runs a sample of Prove commands (at least one per work package) and agrees
with the ticks. A reviewer who finds a false tick reopens the box and the
agent's other ticks in that work package are re-verified.

## Keeping the artifacts honest

Specification, SOW and task list live together (`wiki/specs/<effort>/`). When
one changes, the other two change in the same commit. The task list's progress
count is recomputed from the boxes, never edited by hand to a number.
