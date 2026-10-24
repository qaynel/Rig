---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: historical
summary: Release eligibility now requires a changelog section and successful exact-SHA health, including clean-install E2E.
---
Done: T-8.5; added an Unreleased 6.0.0 entry and made release eligibility check the package-version section after its exact-SHA health dependency. Health requires the clean-install E2E; the eligibility artifact is created only after health succeeds. `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/release-eligibility.yml")'` — parsed; `version=6.0.0; grep -Eq '^## \[${version}\]([[:space:]]|$)' CHANGELOG.md` — matched. In flight: none. Next: T-8.6 wiki budget cleanup.
