# 04 — Finished catalogue services (115 original capabilities; D8, RIG-112)

Part of the [master plan](00-master-plan.md). Depends on [03](03-central-corpus.md).

**Owner (round 4):** "Freeze what's built and make sure all the services are
finished products, not half-ass nonsense." **Round 5:** they come from the
corpus.

## Current state

There are 115 services in 34 groups across four families (development,
infrastructure, product-security, testing), as 805 files. Each service is a
5–9 line templated `identity.md`, `minimal.md`, `mid.md`, and `maximal.md`, plus
`slices/`. They describe themselves as "Policy grade. This is generic baseline
practice, not a claim of repository-tailored Context or Evidence coverage." The
mechanical gate (`authorshipReport`, frozen `AT-SHAPE-6`) proves the files are
well-formed, not that they are useful.

## Definition of "finished" (per service)

1. **Guidance.** Written for that specific practice: what good looks like,
   common failure modes, and how to adopt it in an existing repo. No shared
   template sentences.
2. **Detector.** Discover existing files, config and repository commands,
   reporting evidence paths separately from the conformity verdict. A present
   but broken setup is discovered and repaired, not treated as absent.
3. **Check.** A runnable verification that **passes on a conforming fixture
   repo and fails on a violating one**, reusing the repo's own tools first
   (existing hardening: `check-runner`, network declaration, containment).
4. **Fixtures.** One conforming and one violating minimal repo per service,
   under `tests/fixtures/services/<id>/{good,bad}`.
5. **Onboarding hook.** The corpus onboarding instructions tell the agent when
   to offer the service and how to graft it.
6. **No filler.** The authored-service gate is extended to reject the current
   boilerplate sentences, and any body that shares more than a set fraction of
   its text with another service.

## Approach

- **Generate the structure, hand-author the substance.** One schema per
  service plus `guidance.md`. Preserve the built contract: stable IDs and
  owned scopes, cumulative minimal/mid/maximal check sets with strict growth,
  named slices, dependency edges, and explicit evidence targets. JSON can
  replace the fragment files without collapsing the three-grade dial or
  pulling whole services when a dependency names only one slice.
- **Work in batches by family,** in this order: development, then testing, then
  product-security, then infrastructure. Each batch is reviewed before the next
  starts.
- **External tools** (scanners, cloud CLIs): detect only. A missing tool is a
  named coverage gap with setup guidance (owner decision). No automatic
  external-tool installation; upstream skill-resource fetching is separate.
- **Merges (owner decision):** proven duplicates may merge with a written
  reason and old-ID compatibility. Preserve existing selections, grade
  ceilings, named dependencies and receipts; test old and mixed old/new IDs.
  Every original capability stays covered even if the count falls below 115.

## Acceptance

- For every service id, `check` passes on `good/` and fails on `bad/`. This
  runs through installed selection→proposal→approval→apply→check, not only
  source functions. Parameterize across the catalogue and assert approved
  binding IDs and nonzero executed checks on both good and bad fixtures.
- Test every grade, dependency-only slice resolution, and unchanged user
  selection/ceiling. Fixtures discriminate the promised domain behavior, not
  fixture names. Detectors report present-but-invalid configurations.
- Missing tools, unsupported inputs and runner errors are named non-passes,
  separate from a conforming result. Use available tools and report gaps,
  following the owner's settled external-tool policy.
  Live infrastructure assurance is never inferred from a config-only check.
- The extended authored-service gate is green, and the boilerplate phrases
  are replaced with specific guidance. Retain truthful coverage limits. The
  frozen authorship assertion that currently requires generic-baseline wording
  joins the explicit owner amendment bundle; deletion is not just path churn.
- Pin the delivered count as 115 minus individually documented duplicate
  merges. Each merge proves selection/dependency/receipt compatibility and
  preserves the finished coverage of every original capability.
- The catalogue contract artifacts are added to the signed set
  ([10](10-review-sign-ship.md)), which finishes RIG-112.

## Risks

- **Scale:** about 115 × (guidance, detector, check, 2 fixtures). Mitigated by
  the schema, shared fixture scaffolding, and batching. This is the largest
  subplan by volume.
- **Checks that need networks or cloud accounts** cannot pass in CI. Their
  check targets config correctness, not live infrastructure, and that is stated
  in the guidance.
