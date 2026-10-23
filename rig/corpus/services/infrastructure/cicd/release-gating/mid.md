# infrastructure.cicd.release-gating — mid

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Grade: mid. Policy grade. Check: release-gating-cicd-context.

Mid adds the `release_revision` configuration check: it must be nonempty in `rig-services/infrastructure.cicd.release-gating.json`. The supplied good fixture names revision `a1b2c3d`.

This is a second static policy assertion. It does not establish a repository-specific release convention, identify a built artifact, or show that the revision passed CI.
