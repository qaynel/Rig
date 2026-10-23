---
date: 2026-10-14
source: review
topics: the-overhaul, distribution-and-release
decisions:
status: current
summary: Independent four-axis review found a health workflow token failure, a secret-scan patch-file blind spot, and an incomplete clean-machine README install path.
---
# Findings

## High — Health workflow cannot pass its coherence gate

[`health.yml`](../../.github/workflows/health.yml) gives the `health` job only
`contents: read` and does not pass a token to `npm test`. In CI,
[`check-coherence.js`](../../scripts/check-coherence.js) exits immediately when
neither `GITHUB_TOKEN` nor `GH_TOKEN` is set. GitHub exposes its token through
the `secrets` context; it is not automatically placed in the process
environment. The full gate therefore fails at the coherence test. The
reusable caller [`release-eligibility.yml`](../../.github/workflows/release-eligibility.yml)
also grants only `contents: read`, which cannot be elevated by the called
workflow to the reporter's `issues: write` permission. Add `issues: read` and
an explicit read-token environment to the health test job, and grant the
reusable health job only the caller permissions it requires. GitHub's
[reusable-workflow permission rule](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)
supports the caller/callee limitation; the repository's own coherence code
confirms the missing-token failure.

## Medium — Publishable patch files are skipped by both secret scans

[`repo-secret-hygiene.test.js`](../../tests/repo-secret-hygiene.test.js) and
[`repo-secret-fixtures.test.js`](../../tests/repo-secret-fixtures.test.js)
skip every `.patch` file. A patch is itself published, so a real credential in
an added or removed hunk remains exposed even though it will not appear in the
resulting source file. The current patch's example values explain the
false-positive concern but do not bound the blanket exclusion. Scan patch
content with a narrow exception for the known public examples, or otherwise
prove secret-shaped content in patches cannot evade the repository guard.

## Medium — README install example assumes an unprovided Rig checkout

[`README.md`](../../README.md) says to start “From a Rig checkout” and then
runs `./install`, but does not tell a clean-machine reader how to obtain that
checkout. WP9 acceptance says the README alone should complete the install
flow. The exact documented command was attempted on an empty target; GitHub
returned 404 for the unpublished `v6.0.0` archive
([attempt trace](2026-10-14-closure-readme-install-404.md)). Add the checkout
acquisition step or a self-contained public installer path, then retry after
the release archive exists.

# Open questions

None. The release artifact availability remains an external dependency for the
install-flow proof.

# Summary

The spec and central-corpus scope are consistent, but the health automation,
secret guard, and clean-machine install documentation need the dispositions
above. The full repository suite was not run; T-10.6 reserves that gate.
