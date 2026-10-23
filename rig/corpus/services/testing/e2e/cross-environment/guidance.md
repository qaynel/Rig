# cross-environment

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Owned scope: `e2e.cross-environment`. Input: `rig-services/testing.e2e.cross-environment.json`.

Coverage ceiling: Configuration validation only, so it confirms environments, shared cases and the platform-equivalence flag are declared; it does not run on any platform.

minimal: environments — ["linux","macos"]. List the environments the cases must run in. One passing platform says nothing about another, so name each OS or runtime.

mid: shared cases — ["install and run"]. List the cases shared across those environments. Different cases per platform cannot be compared, so name the common set.

maximal: assume platform equivalence — false. Set assuming platform equivalence to false. Filesystem and process semantics differ, so record each environment's result separately.
