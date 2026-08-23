# development.code-quality.correctness-static - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `correctness-static-code-quality-context` evaluates `correctness-static-analysis`, `complexity-static`. Given correctness-static-analysis has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes security-sast; it fails when the result infers local convention without an inspectable source. The target is `fixture:development.code-quality.correctness-static:repository-context`, and `security-sast`, `sast` stays outside the verdict.
