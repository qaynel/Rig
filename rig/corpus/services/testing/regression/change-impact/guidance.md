# change-impact

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Owned scope: `regression.change-impact`. Input: `rig-services/testing.regression.change-impact.json`.

Coverage ceiling: Configuration validation only, so it confirms changed interfaces, affected suites and the filename-only flag are declared; it does not trace callers.

minimal: changed interfaces — ["order serializer"]. List the interfaces that changed. Impact starts from the change, so name each one.

mid: affected suites — ["order contract"]. List the suites affected by tracing callers and contracts. An incomplete list skips downstream behavior, so map each interface to suites.

maximal: select by filename only — false. Set selecting by filename only to false. Filename similarity misses downstream effects, so select by the dependency trace.
