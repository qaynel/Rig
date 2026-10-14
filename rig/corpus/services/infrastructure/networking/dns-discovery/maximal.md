# infrastructure.networking.dns-discovery — maximal

Maximal adds a replayable evidence receipt for dns discovery. The evidence must preserve the service_records, ttl_seconds, hardcode_ephemeral_addresses inputs that determined the result.

Read a second run against unchanged dns discovery inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.dns-discovery:evidence-replay. Given the networking.dns-discovery binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
