# mocking-strategy

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Owned scope: `unit.mocking-strategy`. Input: `rig-services/testing.unit.mocking-strategy.json`.

Coverage ceiling: Configuration validation only, so it confirms mocked boundaries, real components and the mock-subject flag are declared; it does not run the tests.

minimal: mocked boundaries — ["payment network"]. List the costly external boundaries that are mocked. Mocking everything proves nothing, so name only true boundaries.

mid: real components — ["order service"]. List the real components the unit uses. Without them the test checks a mock, so name the collaborators exercised.

maximal: mock unit under test — false. Set mocking the unit under test to false. A mocked unit proves only what the mock was told to return, so test the real one.
