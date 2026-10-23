# QA closeout — acceptance evidence per blocker

Prepared 2026-10-20 for the owner and the independent reviewer. This is the
evidence index for the blockers in
[the follow-up](qa-prod-closeout-followup.md) and the failed binding review. It
is not a receipt, a signature, or an approval. The owner signs the oracle and
authorizes any further review attempt; no agent did either.

How to read it: each blocker names the acceptance criterion, the maintained
test that exercises it at the real boundary, and the command that reproduces
the result. Logs live under `.context/` (ignored) and are bound to the exact
candidate commit by the final-byte runs listed at the end.

## The first two owner amendments (applied and signed)

Your earlier signature ratified the binding-review amendment
(`binding-review-owner.patch`); it is applied in the working tree and
`wiki/gate1/gate1.sig` carries your signature. A stale heading in the
business specification still read "owner ratification pending". The written
resolution is that **your verified signature ratifies the exact signed
amendment; the stale heading does not annul it**, and the heading is corrected
in the batch below rather than through a separate ceremony.

The failed October 20 review and your one-trust-root decision needed one more
frozen delta, [`one-trust-root-owner.patch`](candidate-amendments/one-trust-root-owner.patch).
You applied and signed it (the oracle verifies as 16 files and 95 cases). The
table below records what it changed; the review that followed produced the
[second amendment](#the-second-owner-amendment).

| Frozen change | Why |
| --- | --- |
| `AT-PRESENCE-2` and the policy/lint fixtures (`AT-PRESENCE-1`, `AT-SECRET-1`, `AT-LF-14`, `AT-LF-20`, `AT-LF-24`) | One trust root: fixtures write `.rig/trust/gate1.allowed-signers`; the recovery ceremony is withdrawn (D29) |
| `AT-LF-12` | Autofix needs a real signed plan approval bound to the exact fix and a required verifier; a Boolean is refused |
| `AT-BASE-2`, `AT-BASE-5` | Shipped default asserted valid; real actions denied then released by the switches; shell/web/MCP reported as available-not-integrated, git pre-commit as integrated |
| `AT-LF-8`, `AT-LF-12` acceptance text | Observable wording only; the private function signature moves to the design |
| Business specification | D29 revision note and bullets; host-scope note reconciling "emits for every host" with the locked host-axis decision; the D24 heading corrected |
| `AT-PB-1` | Catalogue pin after the semantic pass (1,042 files) |
| Duplicate assertion in the catalogue oracle case | Harmless redundancy removed while the file is open |
| Manifest | Recomputed digests for the above |

| Evidence | Result |
| --- | --- |
| Patch applies to the live frozen files | `git apply --check` passes |
| Amended oracle in an isolated mirror (`.context/trust-root-candidate`) | Whole `tests/` directory with the amended frozen files: 1,164 of 1,169 pass. The three failures are the one check that runs the unsigned verifier (green once you sign), the wiki-budget case (since fixed live) and a pandas case that needs the repository `.venv` on `PATH` (green in the live run) |
| Unsigned verifier on the amended bytes | 16 manifest files, 95 acceptance cases, technical approach verified |
| Mutation checks | Breaking leaf-disable fails `AT-BASE-2` and `AT-BASE-5`; letting `{verified:true}` through fails `AT-LF-12` and `AT-LF-12r` |
| Live gate before you apply it | Red on exactly the frozen cases above plus the two checks that call the unsigned verifier |

Rebuild and re-verify the mirror with `python3 .context/build-owner-batch.py`
(the script and mirror live in the ignored `.context/`).

## The second owner amendment

The authorized trust-root review failed (3 major, 6 minor; counter now 6,
preserved). Every finding below is fixed in shipped code or the design, with
editable regressions in `tests/trust-root-review-fixes.test.js` (14/14). Seven
signed case bodies must change because the shipped code no longer has the lever
or behavior they call, or because they were narrower than their trace rows.
One patch, [`trust-root-review-owner.patch`](candidate-amendments/trust-root-review-owner.patch),
changes `tests/advanced-oracle.test.js` and its manifest digest; no case title
changes, so the 95 acceptance cases are unchanged. It is not applied: agents
never edit frozen files or sign.

| Frozen case | Change |
| --- | --- |
| `AT-SHAPE-5` | Rejects `true`, `echo`, `sh -c true`, `process.exit(0)` and the empty command, and a bare "service-specific" reason |
| `AT-INSTALL-1` | The installer process is killed mid-write; policy status and the run report withhold protection while incomplete; resume finishes without clobbering unrelated data |
| `AT-LF-17` | A real write failure (a directory where `binding.json` must go) interrupts the install instead of the removed flag |
| `AT-PRESENCE-1` | A host-native approval is refused as unavailable even with a verifier that says yes, and writes nothing |
| `AT-LF-22` | The child records the error it saw; the case passes only on a denied connection, or on the named `network_isolation_unavailable` |
| `AT-CI-1` | All six providers: unrelated lines survive in order, the job is added, then uninstall removes it and restores the file byte-for-byte |
| `AT-UNINSTALL-1` | One real install across Rig files, grafted `AGENTS.md`, the pre-commit hook, a CI job and a user-global entry; uninstall restores every user byte; killed mid-run it never leaves a hook pointing at a removed file; deleting `.rig/` cannot produce a clean claim |

| Evidence | Result |
| --- | --- |
| Patch applies to the live frozen files | `git apply --check` passes |
| Amended oracle against live product code (isolated mirror `.context/binding-review-2-candidate`) | 74/74; titles identical to the signed file |
| Unsigned verifier on the live tree | 16 files, 95 cases |
| Live gate before you apply it | red only on `AT-INSTALL-1`, `AT-LF-17`, `AT-PRESENCE-1` (their old bodies call the deleted lever and host-native minting) |

Rebuild with `python3 .context/build-owner-batch-2.py` (ignored `.context/`).

## Trust-root review findings (October 20 re-review, nine items)

| # | Finding | Resolution | Evidence |
| --- | --- | --- | --- |
| 1 | Generic-success bindings accepted (major) | One detector in the shared runner (bare, `checks` and component bindings; wrappers, shell and interpreter one-liners); `validateDisposition`, the catalogue authorship gate and the installed runner all reject it; a convention reason needs real service content | `tests/trust-root-review-fixes.test.js`; mutation (detector off) fails 4 |
| 2 | Install interruption was a shipped lever (major) | `interrupt_after` deleted. A process kill and a permission-denied write interrupt the install; status, install and run report withhold protection; resume finishes without touching unrelated data | same file; mutation (lever back) fails the no-flag test; `tests/shipping-boundaries.test.js` |
| 3 | `AT-CI-1`, `AT-UNINSTALL-1` narrower than their rows (major) | Found real gaps and fixed them: the merged job was never removed for five of six providers; uninstall left an added trailing newline; a re-run after an interrupted uninstall called an already-removed global entry best-effort. Marked-region digests are journaled and stripped only on an exact match | regressions above; amendment cases |
| 4 | Design named a drift detector that is not shipped | Design now states the honest ceiling: the installed root is journaled but no check compares it afterwards | design §4 trust-root paragraph |
| 5 | Design required a sentence the gate rejects | Design now requires service-specific grade and evidence-limit wording; the stock disclaimer is the filler the gate rejects | design §5.6, AD-31 |
| 6 | Design named test files that do not exist | Every named path now exists; a guard test fails if a named path goes missing | `finding 6` test |
| 7 | Host-native receipt cannot be loaded | Refused as unavailable; no receipt the loader cannot verify is minted; no second trust root | regression; amended `AT-PRESENCE-1`; mutation fails |
| 8 | Isolation accepted without a denied connection | A wrapper counts only after a probe inside it sees the connection denied; otherwise `network_isolation_unavailable`. Observed: macOS `EPERM` vs `ECONNREFUSED` unwrapped; Linux `ENETUNREACH` vs `ECONNREFUSED` (container run) | regression; mutation fails |
| 9 | Reviewer could not run Bash | Not a product change; the reviewer must inspect the candidate with its own tools next time | handoff |

## Follow-up groups C1–C8

| Group | Acceptance | Maintained evidence |
| --- | --- | --- |
| C1 | Replacement after last validation survives; macOS and Linux resume | `tests/migrate-v5.test.js` 49/49, including both post-validation substitution cases and the interrupted-publication resume |
| C2 | Replay conflict handling | `migration replay refuses edits…` cases in the same file |
| C3 | Installed guidance resolves the installed helper; mode drift detected | `approved installed review guidance runs its installed helper and detects mode drift`, `tests/upstream-shelf.test.js` |
| C4 | Empty reselection freezes the binding-file preimage | `empty service reselection refuses a post-approval binding-file edit`, `tests/catalogue-installed.test.js` |
| C5 | Upstream receipt bound to applied evidence | `tests/upstream-onboarding.test.js` |
| C6 | Malformed global configuration refused | `tests/global-mcp-writes.test.js` |
| C7 | Reporter PATCHes a matching issue; no duplicate POST | `tests/health-workflow.test.js` |
| C8 | Current authorities match the signed oracle | `tests/catalogue-documentation-policy.test.js`, wiki checks |

## Binding-review findings (October 20 review, twelve items)

| # | Finding | Resolution | Evidence |
| --- | --- | --- | --- |
| 1 | Policy schema and enforcement disagree | One seam: `effectiveStatus` reads both schemas and the evaluator uses it; global, section and leaf switches change the action result and the status together; four protected categories; malformed and unknown input refused with named diagnostics | `tests/policy-active-bundle.test.js` 10/10 (mutation-checked); `AT-BASE-2/5` in the batch |
| 2 | Mechanical denial claimed without hooks | Resolved against North star 12. Git pre-commit is the integrated surface; `validate-commit` is integrated on invocation; shell, web and MCP are `available_not_integrated` with setup guidance and no protection claim; `rig policy evaluate` is the real hook entrypoint | `policy status` surfaces; `tests/policy-active-bundle.test.js` (real hook blocks a staged secret, entrypoint denies then permits after approval) |
| 3 | Renderer read the candidate policy | Every decision reads only the activated bundle and its Gate 1 receipt; named `policy_active_*` refusals, never a fallback; renderer output labelled advisory | activate A, edit candidate B, A stays authoritative until B is approved; corrupt candidate and corrupt or missing active evidence covered separately |
| 4 | Catalogue filler | Complete semantic pass over 115 identities; repeated frames removed (no sentence shared by more than three services); Policy-only limits kept | [Semantic-pass record](catalogue-semantic-pass.md); `authorshipReport()` 0 failures; installed matrix 115/115 |
| 5 | Autofix accepted a Boolean | Real SSHSIG plan approval against the Gate 1 key, bound to the exact fix and verify argv, network grant, limits and target; single use; verifier required before mutation, run after, real result reported; halts report `not_run`, never `skipped` | `tests/guarantee-coverage.test.js` 40/40 including `AT-LF-12r`; design §9.4 |
| 6 | "Ratification pending" heading | Written resolution above; heading corrected in the batch; live status and runbook no longer call the earlier amendment unsigned | this file; the runbook |
| 7 | Host acceptance versus business promise | Business-spec host-scope note in the batch: per-axis `emitted` / `not_integrated` / `unsupported`, no all-host hook requirement | `AT-HOST-1` landed-bytes proof over 19 writers; `tests/advanced-hosts.test.js`, `tests/host-contract-parity.test.js` |
| 8 | Baseline oracle did not exercise its behavior | Shipped and current documents accepted before rejection tests; real actions before and after switches; all four categories | batch `AT-BASE-2/5`; editable regressions first in `tests/policy-active-bundle.test.js` |
| 9 | Install, report and receipt cases missed shipping boundaries | Interrupted apply withholds protection claims in `policy status`, install output and run reports until the public resume finishes it; reports are never staged and no provider uploads them; a failing CI command keeps seeded detail out of the log; receipt contract rejects every stale or incomplete shape | `tests/shipping-boundaries.test.js` 4/4; `tests/release-blockers.test.js` receipt cases; `tests/advanced-apply.test.js` |
| 10 | `AT-LF-8` named an internal signature | Observable wording in the batch; the signature moves to design §9.4 | batch; design |
| 11 | Second (JSON) manifest in the uninstall fixture | Traced: `.rig/install-manifest.json` is a supported compatibility input read by `readManifest` only when no journal exists. Kept; bounded reader documented in the design; the journal is exercised through the public uninstall by `AT-UNINSTALL-2` | design §7.6 note; `tests/release-blockers.test.js` ancestor-symlink case |
| 12 | Duplicate assertion | Harmless redundancy; removed in the batch, no new test | batch |

Earlier binding-review findings stay closed (C1–C8 above, plus the authored
catalogue, host contracts, nonce-bound plan approval, Context-before-Evidence,
uninstall verification, and the real-flow stand-ins for `AT-P1`, `AT-P4`,
`AT-GATE-2`).

Defects found and fixed during this closeout, none of them bypassed:

- Migration dropped the new `pinned_adapter` projection, so a migrated tree
  lacked the Cursor and `.agents` rule files a fresh install writes.
- The uninstall verification overflowed the child-process buffer on a runtime
  install; it now reports counts plus only the paths that need attention.
- A literal security-key class name tripped the repository secret scan.
- An interrupted install still let `policy status` and run reports imply
  protection; reports could be staged by a blanket `git add`; a failing CI check
  printed raw command output (a seeded secret reached the log). All three fixed.
- Migrating an untouched v5 install kept the old network-policy default that
  lacked the protected categories; it is now refreshed, and a user-edited file
  is kept.

## Honest limits

- There is one trust root: the Gate 1 public key, shipped to every target as
  `.rig/trust/gate1.allowed-signers`. Losing that key is a deliberate dead end;
  Rig adds no rotation, recovery or trust-on-first-use path (D29). The file
  lives in the repository, so anyone who can write `.rig/trust/` can replace it;
  Rig stores no protected copy, and the owner's decision accepts that. A trust
  root row may carry only a `namespaces=` option; any other option is refused.
- A policy activation receipt is bound to its repository path when it is
  created, not when it is loaded, so a repository moved or cloned elsewhere
  keeps working. A receipt the owner signed for an older policy can therefore
  be restored by a repository writer; no protected high-water mark exists
  inside a repository.
- The catalogue `apply` command still accepts a plan approval whose
  `verified: true` is a plain Boolean: the signed test helper writes that shape,
  so closing it means changing the frozen helper and every case that uses it.
  Onboarding, lint-format plan approvals, autofix and policy activation all
  verify a Gate 1 signature. Recommended as its own change and review cycle.
- A merged CI file whose user text lacked a final newline gains one on install
  and keeps it on uninstall for the five merged providers; user lines are
  otherwise restored byte-for-byte. A jenkins stage block cannot be removed when
  the closing brace shares a line with other text (named best-effort).
- The Linux network probe was observed only in a local container with relaxed
  seccomp, not in remote CI. If a host's loopback stays up inside the wrapper,
  isolation is reported unavailable rather than assumed.
- Host-native policy approval is refused until a host ships an attestation Rig
  can re-verify.
- Shell, web and MCP network decisions are advisory until the user wires a host
  hook to `rig policy evaluate`; Rig reports that gap and claims no block.
- Local CI-command proof does not prove a remote provider run.
- Higher grades (Context, Evidence) for the 115 services still need separate
  observed review and replayable evidence; the catalogue claims Policy only.

## Final-byte runs (candidate code commit `2170cf87`)

| Run | Result |
| --- | --- |
| `npm run test:code` on the live tree | 1,158 of 1,169 pass; the 9 non-passes are the 8 frozen cases the batch changes (`AT-LF-12`, `AT-LF-14`, `AT-LF-20`, `AT-LF-24`, `AT-PB-1`, `AT-PRESENCE-1`, `AT-PRESENCE-2`, `AT-SECRET-1`) and the check that calls the unsigned verifier; secret scan, rule-copy and version checks 15/15 |
| Pi extension / MCP server suites | 15/15 and 6/6 |
| Amended oracle in the mirror (whole `tests/`) | see the amendment table above |
| `scripts/clean-install-e2e.js` on `git archive` of the exact commit, offline | pass, `provisional: false`; evidence `.context/e2e-2170cf87….json` |
| Migration suite (macOS) | `tests/migrate-v5.test.js` 50/50 inside the run above |

The archive was built locally from the commit; the remote exact-SHA download
needs the commit pushed, which is an owner step. Later commits on this branch
touch wiki text only.

## Owner-only steps

See the [owner runbook](owner-runbook.md): apply and sign the amendment,
renew the full gate, authorize one more binding review attempt (the failed-attempt counter is 6 and is preserved), push, make
`gate1-pin` required, merge, prove the QA commit, promote, tag and close.
