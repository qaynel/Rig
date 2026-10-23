# infrastructure.networking.load-balancer-ingress — maximal

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Maximal still provides Policy grade assurance. `load-balancer-ingress-evidence-receipt` checks `expose_admin_route`: administrative routes must not be exposed through public ingress. The checks enforce the health path, timeout, and admin-route fields but do not create or replay an evidence receipt.

The installed predicate does not produce a replayable evidence receipt. It checks the JSON at `rig-services/infrastructure.networking.load-balancer-ingress.json` only. The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.
