---
date: 2026-08-30
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags: interdependency
summary: The router now has a tested ten-step human-in-the-loop delivery SOP with a mandatory human key-signing exception.
---

# Routing SOP implementation checkpoint

The router's old six-phase pipeline was replaced by the requested ten-step
delivery SOP. The key-signing command remains an explicit human action, while
the other steps can be handed off or continued by the session according to the
between-step protocol. Lightweight single-step tasks remain outside that
protocol.

A focused regression test checks the step order, known skill and command
references, handoff choices, override contract, lightweight-path guard, and
discovery through the repository's npm test glob. The signed oracle and its
manifest were left unchanged.
