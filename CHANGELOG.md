# Changelog

## Unreleased

- Add explicit user sign-off selection and bind signed mode changes to key
  protection. Platform sign-off refuses approval until a verified adapter exists.
- Require current security and review readiness before public publication in
  every sign-off mode.
- Document these boundaries in `docs/install.md`, `docs/vision.md`, and
  `docs/architecture.md`.
- Align contributor PR guidance with the QA branch, and disclose the currently
  disabled private reporting channel in `CONTRIBUTING.md`, `SECURITY.md`,
  `CODE_OF_CONDUCT.md`, `SUPPORT.md`, and the GitHub issue templates.

## [6.0.1] - Unreleased

- Harden AI-SDLC phase transitions against escaping `.rig` symlinks and planted
  temporary-file symlinks by reusing the contained, exclusive atomic state writer.
- Prepare the self-contained public archive with its `rig-archive.json`
  manifest and pinned local inference assets for offline semantic search.
- Keep clean real-download verification as a required release check; the
  v6.0.0 GitHub source tarball is not a compatible public archive.

## [6.0.0] - 2026-10-24

- Deliver Rig's agent workflow, catalogue services, and standards from the
  central corpus with adaptive onboarding.
- Add service-specific catalogue guidance, grade limits, and named coverage
  checks for all 115 services.
- Add installed lint-format setup with separate approval and recoverable
  replacement.
- Keep local Context review current across generated Rig reports while still
  rejecting command writes to those reports; document the input boundary in
  `docs/advanced/operator.md`.
- Stop local lint grades on negative reviews or read-only mutations, preserve
  user-owned host adapter collisions, and report uninstall verification from
  saved preimages. Document the review outcome and removal evidence in
  `docs/advanced/operator.md`.
- Repair installed native-service dispatch, complete supported harness scanning,
  shared secret redaction, strict inventory journal validation, and Linux
  signal/child-process handling. Preserve actionable failure evidence through
  public source and installed commands; document it in `docs/advanced/operator.md`.
- Bind Path B consent to its clone and enforce enabled adopt sanitation before
  capability review. Preserve explicit autofix operand scope, replay failure
  records, and partial-install protection withholding. Update the technical
  design and `docs/advanced/operator.md` with these boundaries.
- Add exact-SHA clean-install E2E, weekly health checks, and release eligibility
  evidence.
- Update `README.md`, `README.es.md`, `README.ko.md`, `docs/install.md`,
  `docs/vision.md`, and `docs/architecture.md` with audience navigation, approved
  onboarding, scoped uninstall guidance, and source-release governance boundaries.
- Add the documentation-readiness step to
  `rig/corpus/standards/change-management.md`.
