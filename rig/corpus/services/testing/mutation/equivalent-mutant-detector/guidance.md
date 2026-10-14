# equivalent mutant detector

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Owned scope: `mutation.equivalent-mutant-detector`.

Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

minimal: equivalence evidence — ["unreachable branch by domain proof"].

mid: review owners — ["parser maintainer"].

maximal: classify by survival only — false.

