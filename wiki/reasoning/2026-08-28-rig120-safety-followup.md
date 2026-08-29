---
date: 2026-08-28
source: agent
topics: install-manifest-removal, trust-and-failure-boundaries, user-global-writes, host-and-ci-coverage
decisions:
---

The first safety-defect patch narrowed uninstall to Rig's install namespace, but
placed that namespace check before symlink-aware path resolution. A forged
journal path through an escaping ancestor symlink was therefore preserved as
best-effort instead of refused. Containment must run before the namespace check:
whether Rig may own a path is a separate question from whether the path is safe
to resolve at all.

The namespace list also omitted five CI-provider locations, which caused CI
files Rig created to survive uninstall. The provider registry is already the
authority for those paths, so removal derives its exact CI-file set from that
registry. A provider path is removable only when the journal says Rig created
the whole file. A namespaced merge into an existing user CI file remains
best-effort rather than risking deletion of the user's whole pipeline; exact
managed-block reversal is separate work.

OpenClaw removal derived the only permitted server name from the repository's
install identity, but used the identity allocator to do so. When the identity
was absent, uninstall created a new random identity. Removal now reads the
persisted identity without allocation and refuses when it is absent.

The same review established that a memory-watchdog process listing is usable
only when the command succeeds, produces at least one parsed process, and still
contains the guarded root process. Missing or partial evidence is an explicit
unavailable state, never zero memory usage.

No new product decision is introduced here. These changes enforce the existing
containment, exact-ownership, attributed-global-write, truthful-failure, and
generated-CI removal contracts.
