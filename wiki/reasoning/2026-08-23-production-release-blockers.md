---
date: 2026-08-23
source: intent owner
topics: install-manifest-removal, distribution-and-release, the-catalogue, authored-service-gate, host-and-ci-coverage, review-receipts
decisions:
---

Release-blocking findings:

Uninstall and remediation can follow repository symlinks and modify or delete files outside the target. This was reproduced across four write/delete paths.
The released installer ships skills and plumbing, but not the mandatory catalogue and safety runtime.
A bare stranger repository receives zero of the 55 skills.
Most catalogue service packs are repeated generic boilerplate, explicitly prohibited by the signed contract.
Five of six CI providers have no working adapter.
The shipping journal has no compatible uninstall path and cannot reconcile one crash window.
The release-review producer and validator use incompatible schemas; unresolved or incomplete reviews can validate.
The signed distribution test never executes install.sh or downloads a tagged archive.
The installer requires Bash despite promising a plain sh environment.

Fix all the issues from the above, which do not require my input and which do list them out as a questionnaire at the end once you've solved all the issues which do not require my input the over the last goal being to fix these issues so that we have a production go and deployment
