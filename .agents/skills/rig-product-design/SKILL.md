---
name: rig-product-design
status: ready
description: Turn business intent into a thorough, bounded technical specification the code adapts to. Checked for presence at the gate, never frozen.
family: specification-and-planning
tool: host-agent
capability: specification-and-planning.executable-specification
guarantees:
  - Turns approved business intent into a bounded technical specification.
  - Leaves implementation freedom inside a stated boundary.
overlap_tags:
  - product-design
  - specification
  - technical-design
---

# Product And Technical Design

This phase owns **how**. It produces the technical specification the gate checks
for presence and the implementation adapts to. It may challenge feasibility or
return contradictions to grilling, but it never edits the oracle (intent,
acceptance, tests). The specification is a working design, not a second freeze:
the approach may change during implementation as long as the frozen tests stay
green.

For a spec-driven request, this is the technical-interrogation checkpoint of
the folded spec-driven flow: inspect the current code and documents before
asking questions, then return a concrete working design for draft review.

## Process

1. Restate the oracle and trace the current system end to end.
2. Identify the smallest existing seams that can carry the behavior.
3. Compare build, reuse, standard-library, native-platform, and installed-tool
   options before adding machinery.
4. Specify data flow, trust boundaries, failure handling, concurrency, rollout,
   observability, and compatibility only where the feature actually touches
   them.
5. Name rejected alternatives and the concrete reason each loses.
6. Break the design into tracer-bullet slices with a verification command for
   each slice.
7. Hand the specification to the gate as a present, checked artifact and to
   implementation as the working design. Do not lock it; the code adapts to it,
   and it adapts to what the code learns, as long as the frozen tests stay green.

## Standard

Planning is thorough; the resulting code is minimal. Do not hide uncertainty
inside abstractions or create extension points for imagined futures. Escalate an
oracle contradiction instead of designing around it silently.

## Decision Questions

When asking the user to choose, give concrete options plus a recommendation.
Keep one decision per question unless the user asks for a broader menu.

## Output

- Current-state trace
- Chosen approach and touched seams
- Data, safety, and failure boundaries
- Ordered slices and verification
- Rejected alternatives
- Risks or decisions requiring a return to grilling

Source: gstack product and engineering planning doctrine, extracted as markdown;
stateful gstack runtime features are intentionally excluded.
