---
date: 2026-08-28
source: agent
topics: install-manifest-removal, trust-and-failure-boundaries, host-and-ci-coverage
decisions: D11
---

Independent review of the editable-journal CI fix found a remaining hole:
`isManagedAddition()` treated any journal `managed_line`, `managed_block`, or
`append_managed` label as enough to mutate a CI file. Because the install
journal is repository-local and editable, a forged `create_owned` record that
also named a user line as `managed_line` could strip that line on uninstall.
Requiring `append_managed` alone does not close the class: that field is equally
editable, as is `managed_block`.

The semantic boundary is unique attribution of the addition, not journal
metadata. For CI, uninstall may delete only the dedicated Rig-named GitHub
workflow as a whole file, and may strip only the exact pointer line the CI
adapter writes onto an existing GitHub workflow, and only when the record's
ownership class is the append-managed write that adapter actually performs.
A forged `managed_line`, `managed_block`, `append_managed`, digest, provider
path, or recognised filename cannot manufacture the right to mutate other CI
bytes. Ambiguous CI content is retained as named best-effort.
