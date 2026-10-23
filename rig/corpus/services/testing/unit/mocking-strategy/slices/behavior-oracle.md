# testing.unit.mocking-strategy — behavior-oracle slice

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Policy grade slice `mocking-strategy-slice-behavior-oracle`: List the costly external boundaries that are mocked. Mocking everything proves nothing, so name only true boundaries. Despite its name this slice is not a behavior oracle: it confirms mocked boundaries, real components and the mock-subject flag are declared; it does not run the tests.
