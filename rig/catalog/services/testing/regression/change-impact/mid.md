# testing.regression.change-impact - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `change-impact-regression-context` evaluates `regression.change-impact`. Given regression.change-impact has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent regression concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:testing.regression.change-impact:repository-context`, and adjacent regression ownership stays outside the verdict.
