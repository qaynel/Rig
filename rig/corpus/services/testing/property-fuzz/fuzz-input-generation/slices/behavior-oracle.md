# testing.property-fuzz.fuzz-input-generation — behavior-oracle slice

Generate adversarial inputs with a saved seed and bounded resource use. Retaining the seed is what makes a discovered failure a reproducible engineering result.

Policy grade slice `fuzz-input-generation-slice-behavior-oracle`: List the input seeds used. Without a corpus fuzzing starts blind, so name the seed inputs. Despite its name this slice is not a behavior oracle: it confirms input seeds, a reproduction seed and the unbounded-size flag are declared; it does not fuzz anything.
