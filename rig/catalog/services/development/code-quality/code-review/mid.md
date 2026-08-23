# development.code-quality.code-review - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `code-review-code-quality-context` evaluates `code-quality.code-review`. Given code-quality.code-review has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent code quality concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:development.code-quality.code-review:repository-context`, and adjacent code quality ownership stays outside the verdict.
