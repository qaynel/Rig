---
date: 2026-10-18
source: agent
topics: the-overhaul, install-manifest-removal, testing-strategy
decisions:
status: current
supersedes:
tags: qa-closeout, migration, integration
summary: Integrated migration checks exposed stale cleanup expectations and projected-file protection; the protection fix passes its focused onboarding-state case.
---

After the temporary-file retention change, a full migration test run found six failures. Four were previous assertions that assumed the temporary pathname would be deleted; the successful transaction now retains it with an explicit recovery state. One was a restart fixture that deleted only the final record, leaving its retained temporary record as a safe collision; the fixture now removes both known fixture files before restarting. The remaining failure was substantive: onboarding's applied state records all installed projection files and modes, but migration's protected-path inventory omitted `applied.projection_files`, so migration retired files still covered by a live approved selection. Adding those paths to the protected set made the focused unchanged-onboarding-state case pass.

The two obsolete root/parent swap tests that injected at a Python temporary unlink have been removed because the unlink no longer exists; normal and resumed replacement tests now exercise the post-validation boundary and assert exact bytes and mode. The existing named interrupted-publication test still runs on macOS and now passes by validating matching bytes across clone and hard-link mechanisms. A full rerun and final-byte checks remain pending. No binding receipt, approval, commit, push, or merge has been attempted.
