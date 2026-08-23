# infrastructure.networking.dns-discovery - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `dns-discovery-networking-context` evaluates `networking.dns-discovery`. Given networking.dns-discovery has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent networking concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:infrastructure.networking.dns-discovery:repository-context`, and adjacent networking ownership stays outside the verdict.
