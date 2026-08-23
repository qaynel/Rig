# testing.flaky-reliability.intermittent-rca - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `intermittent-rca-flaky-reliability-context` evaluates `flaky-reliability.intermittent-rca`. Given flaky-reliability.intermittent-rca has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:testing.flaky-reliability.intermittent-rca:repository-context`, and adjacent flaky reliability ownership stays outside the verdict.
