# development.code-quality.typecheck - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `typecheck-code-quality-context` evaluates `code-quality.typecheck`. Given code-quality.typecheck has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent code quality concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:development.code-quality.typecheck:repository-context`, and adjacent code quality ownership stays outside the verdict.
