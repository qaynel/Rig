---
date: 2026-08-20
source: agent
topics: the-catalogue, delivery-plan, authored-service-gate
decisions:
status: historical
---

Reconciliation of questions 1–3 in the lint-format production grilling audit
against decisions the repository already records.

1. The release boundary is production, not preview. The intent-owner trace
   `2026-08-20-vertical-lint-format-production.md` already selects vertical
   production for `development.code-quality.lint-format`. The other 114 leaves
   continue to block their own support and the complete-catalogue claim, but do
   not block this leaf's production support. This is the existing `GA-15` /
   `AD-31` ruling. Frozen Gate 1 must still be amended before that ruling is
   authoritative because its current text makes all 115 leaves release-blocking.
2. The release is the normal Rig product, not a limited preview: the full
   default-on agent-tech-safety baseline plus lint-format as the only initially
   supported catalogue leaf. Existing user control remains intact: disabling a
   baseline control is allowed and must be reported truthfully.
3. The initial release retains the full 19-host and six-CI-provider commitment.
   Every emitted axis needs its complete contract and byte-landing proof. A
   genuinely unavailable vendor axis may emit nothing only under the existing
   explicit `unsupported` rule; incomplete implementation is not unsupported.

These are not three new decisions. They reconcile the audit with `GA-15`, the
frozen baseline and host commitments, and candidate `AD-24` / `AD-31`. The next
unresolved decision is the product promise for lint-format itself.
