# development.documentation.adrs - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `adrs-documentation-context` evaluates `documentation.adrs`. Given documentation.adrs has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent documentation concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:development.documentation.adrs:repository-context`, and adjacent documentation ownership stays outside the verdict.
