---
date: 2026-08-28
source: agent
topics: install-manifest-removal, trust-and-failure-boundaries, host-and-ci-coverage
decisions: D11
status: historical
---

A further review showed classification still used the lexical contained path, so
an install-tree directory symlink (`.pi` → `.`) plus a forged `.pi/Jenkinsfile`
record could admit and delete the resolved user pipeline. An extra hard link
from `.rig/owned` onto a Jenkinsfile could likewise strip user lines.

Uninstall now classifies against `realpath` of the mutation target and refuses
to mutate through a symlink or a file with nlink greater than 1. Journal
metadata still cannot manufacture CI ownership; the object of policy is the
real path being changed.
