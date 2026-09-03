---
date: 2026-08-28
source: agent
topics: install-manifest-removal, trust-and-failure-boundaries, host-and-ci-coverage
decisions: D11
status: historical
---

Independent re-review of the CI managed-line fix found remaining grants:

1. Unique-file admission (`create_owned` on the dedicated GitHub workflow) still
   let the journal pick the mutation operator. A forged `managed_line` on that
   path stripped user bytes without a digest check, including through an
   in-repo symlink whose lexical name was the unique workflow.
2. Classification used the journal's lexical path while I/O used the contained
   resolved path. A forged `.rig/../Jenkinsfile` admitted as an install-tree
   member and deleted the resolved user pipeline.

Fixes: classify uninstall against the contained relative path; never write
through a symlink; unique-file removal is digest-checked whole-file delete only;
CI line-strip remains the exact GitHub adapter pointer under append-managed.
Graft and hook journal trust remain separate from this CI boundary.
