# Offline inference asset provenance

Verified 2026-10-26 from primary upstream sources; exact pins and SHA256s are
in model.json. Potion's published vocabulary is byte-identical to Rig's.
Its published float32 weights reproduce every byte of embeddings.i8 using the
conversion below. The scale is calculated with Float64 arithmetic, written as
little-endian Float32; the unrounded Float64 scale is used for quantization.
JavaScript Math.round semantics are floor(x + 0.5), including negative ties.

The potion model card declares MIT and names BGE as its distillation source.
BGE's card declares MIT. Its vocabulary is byte-identical to the Apache-2.0
BERT vocabulary; potion keeps a subset. Both inherited licence texts ship.
This describes exact file provenance, not an assertion of relicensing BERT
vocabulary as MIT. No source weights are downloaded at runtime.

Reproduce after downloading the model.safetensors file from the pinned model
revision in model.json. This developer-only check uses the repository's numpy
installation; the shipped runtime needs only Node.

```python
from pathlib import Path
import hashlib, json, struct, sys
import numpy as np
raw = Path(sys.argv[1]).read_bytes()
assert hashlib.sha256(raw).hexdigest() == 'f95ffde02ad06f63ae38eb9d400038cd5ccaf8411ec3cb650c6025113f96cbb8'
n = struct.unpack('<Q', raw[:8])[0]
header = json.loads(raw[8:8+n])['embeddings']
v = np.frombuffer(raw[8+n:], dtype='<f4').reshape(header['shape']).astype('f8')
scales = np.max(np.abs(v), axis=1) / 127
scales = np.where(scales == 0, 1, scales)
quantized = np.clip(np.floor(v / scales[:, None] + .5), -127, 127) + 128
converted = scales.astype('<f4').tobytes() + quantized.astype('u1').tobytes()
assert hashlib.sha256(converted).hexdigest() == 'e08aab892fcc8684fb221ae2ee868a8d2abe513ccdbb3dcb0f9c65ce525a5f98'
```
