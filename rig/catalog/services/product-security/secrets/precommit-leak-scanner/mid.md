# product-security.secrets.precommit-leak-scanner - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `precommit-leak-scanner-secrets-context` evaluates `secrets.precommit-leak-scanner`. Given secrets.precommit-leak-scanner has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent secrets concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:product-security.secrets.precommit-leak-scanner:repository-context`, and adjacent secrets ownership stays outside the verdict.
