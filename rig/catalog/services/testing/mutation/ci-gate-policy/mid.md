# testing.mutation.ci-gate-policy - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `ci-gate-policy-mutation-context` evaluates `mutation.ci-gate-policy`. Given mutation.ci-gate-policy has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent mutation concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:testing.mutation.ci-gate-policy:repository-context`, and adjacent mutation ownership stays outside the verdict.
