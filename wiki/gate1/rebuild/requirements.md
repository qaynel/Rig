# Rebuild requirements (unsigned draft)

One independently observable obligation per row. Each source points to its owning stage and relevant design decisions; acceptance and test IDs are bijective.

| Requirement | Source | Obligation | Criterion | Proving test |
|---|---|---|---|---|
| RB-BENCH-1 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | committed benchmark split has a seed, disjoint partitions, and all 89 tasks. | AC-RB-BENCH-1 | RB-BENCH-1 |
| RB-BENCH-2 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | planted hidden-test tampering is reported as tampered and failed. | AC-RB-BENCH-2 | RB-BENCH-2 |
| RB-BENCH-3 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | report applies every match condition to fixture session data. | AC-RB-BENCH-3 | RB-BENCH-3 |
| RB-BENCH-4 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | plain arm selects no Rig reference and writes no .rig directory. | AC-RB-BENCH-4 | RB-BENCH-4 |
| RB-BENCH-5 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | at least 30 vague-intent tasks keep grading tests outside agent-visible files. | AC-RB-BENCH-5 | RB-BENCH-5 |
| RB-BENCH-6 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | a filename-only gain fails the counterfactual robustness check. | AC-RB-BENCH-6 | RB-BENCH-6 |
| RB-BENCH-7 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | test split cannot run during tuning and final scoring is single-use. | AC-RB-BENCH-7 | RB-BENCH-7 |
| RB-BENCH-8 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | every tuning decision carries its floor candidate. | AC-RB-BENCH-8 | RB-BENCH-8 |
| RB-BENCH-9 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | benchmark arms contain all three model ladder comparisons. | AC-RB-BENCH-9 | RB-BENCH-9 |
| RB-BENCH-10 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | fit input tokens contribute to measured session cost. | AC-RB-BENCH-10 | RB-BENCH-10 |
| RB-BENCH-11 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | report includes tokens, tampering, source lines and human interventions. | AC-RB-BENCH-11 | RB-BENCH-11 |
| RB-BENCH-12 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | published result uses a passing ladder step or the closest measured step. | AC-RB-BENCH-12 | RB-BENCH-12 |
| RB-BENCH-13 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | untouched test split is scored once and SkillsBench remains held back. | AC-RB-BENCH-13 | RB-BENCH-13 |
| RB-BENCH-14 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | tuning stops after three non-improving rounds or the release date. | AC-RB-BENCH-14 | RB-BENCH-14 |
| RB-BENCH-15 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | benchmark runner completes three paired runs per task and arm. | AC-RB-BENCH-15 | RB-BENCH-15 |
| RB-BENCH-16 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | comparison raw sessions use pinned models and one common window. | AC-RB-BENCH-16 | RB-BENCH-16 |
| RB-BENCH-17 | wiki/specs/rebuild/buildout/stage-05-benchmark-and-baseline.md (design §4, §9) | Sonnet benchmark includes one ablation arm per mapped role. | AC-RB-BENCH-17 | RB-BENCH-17 |
| RB-CAT-1 | wiki/specs/rebuild/buildout/stage-08-catalogue-and-repo-tools.md (design §3, §9) | each mapped role has one complete plain-language catalogue entry. | AC-RB-CAT-1 | RB-CAT-1 |
| RB-CAT-2 | wiki/specs/rebuild/buildout/stage-08-catalogue-and-repo-tools.md (design §3, §9) | every catalogue piece path exists in the applied overlay output. | AC-RB-CAT-2 | RB-CAT-2 |
| RB-CAT-3 | wiki/specs/rebuild/buildout/stage-08-catalogue-and-repo-tools.md (design §3, §9) | inspect-repo reports dependency and existing harness facts without decisions. | AC-RB-CAT-3 | RB-CAT-3 |
| RB-CAT-4 | wiki/specs/rebuild/buildout/stage-08-catalogue-and-repo-tools.md (design §3, §9) | inspect-repo makes no outbound network request. | AC-RB-CAT-4 | RB-CAT-4 |
| RB-CAT-5 | wiki/specs/rebuild/buildout/stage-08-catalogue-and-repo-tools.md (design §3, §9) | first-session report has an outcome and recommendation for every role question. | AC-RB-CAT-5 | RB-CAT-5 |
| RB-COORD-1 | wiki/specs/rebuild/buildout/stage-09-coordinator.md (design §3, §8) | each active role trigger routes to one matching role. | AC-RB-COORD-1 | RB-COORD-1 |
| RB-COORD-2 | wiki/specs/rebuild/buildout/stage-09-coordinator.md (design §3, §8) | unmatched situations use general fallback and matched ones do not. | AC-RB-COORD-2 | RB-COORD-2 |
| RB-COORD-3 | wiki/specs/rebuild/buildout/stage-09-coordinator.md (design §3, §8) | lock safety wins a conflicting upstream trigger and is written first. | AC-RB-COORD-3 | RB-COORD-3 |
| RB-COORD-4 | wiki/specs/rebuild/buildout/stage-09-coordinator.md (design §3, §8) | profile cannot disable locked tests and the refusal is logged. | AC-RB-COORD-4 | RB-COORD-4 |
| RB-COORD-5 | wiki/specs/rebuild/buildout/stage-09-coordinator.md (design §3, §8) | startup returns one ordered instruction sequence despite multiple upstream hooks. | AC-RB-COORD-5 | RB-COORD-5 |
| RB-COORD-6 | wiki/specs/rebuild/buildout/stage-09-coordinator.md (design §3, §8) | bounded delegation selects the cheaper available model or stays inline when unsupported. | AC-RB-COORD-6 | RB-COORD-6 |
| RB-DOOR-1 | wiki/specs/rebuild/buildout/stage-14-front-door-and-launch.md (design §3, §9) | proposing a first-session fit writes nothing to host install targets. | AC-RB-DOOR-1 | RB-DOOR-1 |
| RB-DOOR-2 | wiki/specs/rebuild/buildout/stage-14-front-door-and-launch.md (design §3, §9) | generated first-session questions recommend outcomes and accept the proposed answer. | AC-RB-DOOR-2 | RB-DOOR-2 |
| RB-DOOR-3 | wiki/specs/rebuild/buildout/stage-14-front-door-and-launch.md (design §3, §9) | sign-off interview requires an explicit selection before install. | AC-RB-DOOR-3 | RB-DOOR-3 |
| RB-DOOR-4 | wiki/specs/rebuild/buildout/stage-14-front-door-and-launch.md (design §3, §9) | marketplace and shell routes produce the same installed tree for one fit. | AC-RB-DOOR-4 | RB-DOOR-4 |
| RB-FETCH-1 | wiki/specs/rebuild/buildout/stage-04-remove-fetch.md (design §3, §9) | fresh install succeeds while outbound sockets are blocked. | AC-RB-FETCH-1 | RB-FETCH-1 |
| RB-FETCH-2 | wiki/specs/rebuild/buildout/stage-04-remove-fetch.md (design §3, §9) | installed .rig contains no fetched-upstream state or metadata. | AC-RB-FETCH-2 | RB-FETCH-2 |
| RB-FETCH-3 | wiki/specs/rebuild/buildout/stage-04-remove-fetch.md (design §3, §9) | no payload module supports fetching upstreams during setup. | AC-RB-FETCH-3 | RB-FETCH-3 |
| RB-FETCH-4 | wiki/specs/rebuild/buildout/stage-04-remove-fetch.md (design §3, §9) | source, scripts, and tests contain no old fetch module references. | AC-RB-FETCH-4 | RB-FETCH-4 |
| RB-FIT-1 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | a fit above the byte budget is rejected with BUDGET. | AC-RB-FIT-1 | RB-FIT-1 |
| RB-FIT-2 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | active roles with a user-edited shared trigger fail and name both roles. | AC-RB-FIT-2 | RB-FIT-2 |
| RB-FIT-3 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | dormant roles are absent from host targets and their hooks do not run at startup. | AC-RB-FIT-3 | RB-FIT-3 |
| RB-FIT-4 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | an existing harness skill remains the sole discoverable copy. | AC-RB-FIT-4 | RB-FIT-4 |
| RB-FIT-5 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | repository growth proposes UI and browser roles, then approved fit matches fresh fit. | AC-RB-FIT-5 | RB-FIT-5 |
| RB-FIT-6 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | removing dormant files leaves a valid fit. | AC-RB-FIT-6 | RB-FIT-6 |
| RB-FIT-7 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | uninstalling one graft preserves other Rig roles and user files. | AC-RB-FIT-7 | RB-FIT-7 |
| RB-FIT-8 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | the web-UI refit benchmark task passes hidden tests at least as often as fresh fit. | AC-RB-FIT-8 | RB-FIT-8 |
| RB-FIT-9 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | an overlay-created trigger overlap is rejected with TRIGGER_OVERLAP. | AC-RB-FIT-9 | RB-FIT-9 |
| RB-FIT-10 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | locally edited installed skill bytes are retained and reported. | AC-RB-FIT-10 | RB-FIT-10 |
| RB-FIT-11 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | the fit validator reports missing active capability facts. | AC-RB-FIT-11 | RB-FIT-11 |
| RB-FIT-12 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | approved refit materializes the same active role tree as a fresh fit. | AC-RB-FIT-12 | RB-FIT-12 |
| RB-FIT-13 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | changed proposal digest refuses before altering installed files. | AC-RB-FIT-13 | RB-FIT-13 |
| RB-FIT-14 | wiki/specs/rebuild/buildout/stage-10-fit-and-refit.md (design §3, §8, §9) | existing harness reuse keeps a hand-edited installed role byte-for-byte. | AC-RB-FIT-14 | RB-FIT-14 |
| RB-LAUNCH-1 | wiki/specs/rebuild/buildout/stage-14-front-door-and-launch.md (design §3, §9) | results page includes every arm and agrees with the final report values. | AC-RB-LAUNCH-1 | RB-LAUNCH-1 |
| RB-LOCK-1 | wiki/specs/rebuild/buildout/stage-11-locked-tests-and-sudo.md (design §3, §8, §9) | an installed repository refuses edits to a locked test and names the path. | AC-RB-LOCK-1 | RB-LOCK-1 |
| RB-LOCK-2 | wiki/specs/rebuild/buildout/stage-11-locked-tests-and-sudo.md (design §3, §8, §9) | mutation score below 70 percent blocks locking. | AC-RB-LOCK-2 | RB-LOCK-2 |
| RB-LOCK-3 | wiki/specs/rebuild/buildout/stage-11-locked-tests-and-sudo.md (design §3, §8, §9) | missing mutation tooling is a named gap and fails closed. | AC-RB-LOCK-3 | RB-LOCK-3 |
| RB-LOCK-4 | wiki/specs/rebuild/buildout/stage-11-locked-tests-and-sudo.md (design §3, §8, §9) | passwordless sudo is detected but never counts as user approval. | AC-RB-LOCK-4 | RB-LOCK-4 |
| RB-LOCK-5 | wiki/specs/rebuild/buildout/stage-11-locked-tests-and-sudo.md (design §3, §8, §9) | sudo probe is non-interactive when a password is required. | AC-RB-LOCK-5 | RB-LOCK-5 |
| RB-MEM-1 | wiki/specs/rebuild/buildout/stage-13-memory.md (design §3, §8) | memory recall finds a meaning match with networking disabled and no model download. | AC-RB-MEM-1 | RB-MEM-1 |
| RB-MEM-2 | wiki/specs/rebuild/buildout/stage-13-memory.md (design §3, §8) | active view stays within 8 KB after 1,000 writes. | AC-RB-MEM-2 | RB-MEM-2 |
| RB-MEM-3 | wiki/specs/rebuild/buildout/stage-13-memory.md (design §3, §8) | memory benchmark report compares pass rate and solved-task cost with intervals. | AC-RB-MEM-3 | RB-MEM-3 |
| RB-MEM-4 | wiki/specs/rebuild/buildout/stage-13-memory.md (design §3, §8) | memory role changes only when its full result interval beats the incumbent. | AC-RB-MEM-4 | RB-MEM-4 |
| RB-OVL-1 | wiki/specs/rebuild/buildout/stage-07-overlays.md (design §3, §8) | all overlays apply cleanly and preserve pinned upstream bytes. | AC-RB-OVL-1 | RB-OVL-1 |
| RB-OVL-2 | wiki/specs/rebuild/buildout/stage-07-overlays.md (design §3, §8) | changed patched context names exactly the failing patch and source file. | AC-RB-OVL-2 | RB-OVL-2 |
| RB-OVL-3 | wiki/specs/rebuild/buildout/stage-07-overlays.md (design §3, §8) | every overlay carries a non-empty reason and a known ruling. | AC-RB-OVL-3 | RB-OVL-3 |
| RB-OVL-4 | wiki/specs/rebuild/buildout/stage-07-overlays.md (design §3, §8) | every pinned file matches its lock digest. | AC-RB-OVL-4 | RB-OVL-4 |
| RB-POL-1 | wiki/specs/rebuild/buildout/stage-12-profile-and-policy-checks.md (design §7, §8) | decision prose without a wiki pointer fails with a line number and current CLAUDE passes. | AC-RB-POL-1 | RB-POL-1 |
| RB-POL-2 | wiki/specs/rebuild/buildout/stage-12-profile-and-policy-checks.md (design §7, §8) | wiki specifications changed without a reasoning trace are rejected. | AC-RB-POL-2 | RB-POL-2 |
| RB-POL-3 | wiki/specs/rebuild/buildout/stage-12-profile-and-policy-checks.md (design §7, §8) | policy flags technical confirmation wording and accepts a plain recommendation. | AC-RB-POL-3 | RB-POL-3 |
| RB-PROF-1 | wiki/specs/rebuild/buildout/stage-12-profile-and-policy-checks.md (design §7, §8) | profile exports preferences from one repository and imports them into another. | AC-RB-PROF-1 | RB-PROF-1 |
| RB-PROF-2 | wiki/specs/rebuild/buildout/stage-12-profile-and-policy-checks.md (design §7, §8) | home profile contains no secret values or repository paths. | AC-RB-PROF-2 | RB-PROF-2 |
| RB-PROF-3 | wiki/specs/rebuild/buildout/stage-12-profile-and-policy-checks.md (design §7, §8) | uninstall removes repository tailoring and retains the portable profile. | AC-RB-PROF-3 | RB-PROF-3 |
| RB-REL-1 | wiki/specs/rebuild/buildout/stage-16-release.md (design §4, §8, §9) | archive snapshot bytes equal the selected S15 winner commit. | AC-RB-REL-1 | RB-REL-1 |
| RB-REL-2 | wiki/specs/rebuild/buildout/stage-16-release.md (design §4, §8, §9) | installing the published archive makes no outbound setup request. | AC-RB-REL-2 | RB-REL-2 |
| RB-REL-3 | wiki/specs/rebuild/buildout/stage-16-release.md (design §4, §8, §9) | published archive plus local search assets fits the cap or names its overrun. | AC-RB-REL-3 | RB-REL-3 |
| RB-REL-4 | wiki/specs/rebuild/buildout/stage-16-release.md (design §4, §8, §9) | release archive passes the executable and content safety scan. | AC-RB-REL-4 | RB-REL-4 |
| RB-REL-5 | wiki/specs/rebuild/buildout/stage-16-release.md (design §4, §8, §9) | release beats the same-window v6.0.0 baseline beyond the interval. | AC-RB-REL-5 | RB-REL-5 |
| RB-REL-6 | wiki/specs/rebuild/buildout/stage-16-release.md (design §4, §8, §9) | every rebuild requirement maps to one passing proving test. | AC-RB-REL-6 | RB-REL-6 |
| RB-SNAP-1 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | lock lists exactly every vendored file with matching byte count and SHA-256. | AC-RB-SNAP-1 | RB-SNAP-1 |
| RB-SNAP-2 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | lock validates allowed licences, inclusion flags, reasons, and excluded payload absence. | AC-RB-SNAP-2 | RB-SNAP-2 |
| RB-SNAP-3 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | valid locked fixture with network-bearing hook fails and names the hook path. | AC-RB-SNAP-3 | RB-SNAP-3 |
| RB-SNAP-4 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | valid locked fixture with an unapproved harmless executable fails the safety scan. | AC-RB-SNAP-4 | RB-SNAP-4 |
| RB-SNAP-5 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | size check reports measured payload plus local model bytes and cap overrun. | AC-RB-SNAP-5 | RB-SNAP-5 |
| RB-SNAP-6 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | inventory retains upstream identity and exact pinned commits. | AC-RB-SNAP-6 | RB-SNAP-6 |
| RB-SNAP-7 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | excluded upstreams have a reason and ship no payload. | AC-RB-SNAP-7 | RB-SNAP-7 |
| RB-SNAP-8 | wiki/specs/rebuild/buildout/stage-06-snapshot-and-supply-chain.md (design §8, §9) | included upstreams meet pin eligibility and owners carry source-grounded unique capability evidence. | AC-RB-SNAP-8 | RB-SNAP-8 |
