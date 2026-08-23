---
date: 2026-08-20
source: intent owner
topics: catalogue-contract, authored-service-gate
decisions: GA-22
---

this split exactly

Manoj, here is a more formal specification you can use directly in Rig’s product or architecture documentation.

## Linting Harness Capability Model

Rig’s linting harness is organised into three ascending capability levels. Each level increases the amount of system context considered and the strength of the conclusion the harness can produce.

The model deliberately begins **above conventional syntax and style linting**. Syntax validation, formatting, type checking, and ordinary static-analysis diagnostics are treated as commodity capabilities provided by existing IDEs, compilers, and specialised linters.

The capability progression is:

$$
\boxed{
\text{Policy}
;\longrightarrow;
\text{Context}
;\longrightarrow;
\text{Evidence}
}
$$

Equivalently:

$$
\boxed{
\text{Govern the Change}
;\longrightarrow;
\text{Understand the Change}
;\longrightarrow;
\text{Prove the Change}
}
$$

---

### Level 1 — Change-Aware Policy Enforcement

**Objective:** Determine whether a proposed change is permitted under explicitly defined repository and organisational policy.

Rig evaluates the proposed change as a transition between two repository states rather than analysing files independently.

Formally:

$$
D_1 :
(S_{\text{before}}, \Delta, P)
\rightarrow
V
$$

where:

* (S_{\text{before}}) is the repository state before the change,
* (\Delta) is the proposed change,
* (P) is the applicable policy set,
* (V) is the resulting verdict.

Typical verdicts include:

[
V \in
{
\text{ALLOW},
\text{DENY},
\text{REQUIRE_APPROVAL},
\text{WARN}
}
]

#### Responsibilities

Level 1 may determine:

* whether protected resources were modified;
* whether a change crosses a defined security boundary;
* whether required approvals or signatures are present;
* whether a prohibited operation was introduced;
* whether a policy-controlled capability was expanded;
* whether the authorisation requirements for the change have been satisfied.

#### Example

A change adds production write access to an existing deployment role.

The configuration itself may be syntactically and structurally valid.

Rig instead evaluates:

```text
Change:
deployment-role gains production:write

Applicable policy:
production privilege expansion requires Gate 2 approval

Decision:
REQUIRE_APPROVAL
```

The defining property of Level 1 is therefore:

> **The unit of analysis is the change, not merely the file.**

---

### Level 2 — Contextual System Reasoning

**Objective:** Determine whether the proposed change remains consistent with the broader architecture, dependency structure, security model, and declared invariants of the repository.

Level 2 expands the analysis boundary from the modified artefact to the system surrounding it.

Formally:

$$
D_2 :
(S_{\text{before}}, \Delta, P, G, C)
\rightarrow
R
$$

where:

* (G) represents repository and dependency relationships;
* (C) represents additional contextual information;
* (R) represents discovered semantic risks or inconsistencies.

The repository can therefore be treated as a graph:

$$
G = (N,E)
$$

where nodes may represent:

* files,
* workflows,
* services,
* identities,
* permissions,
* APIs,
* infrastructure resources,
* policies,

and edges represent relationships between them.

#### Responsibilities

Level 2 may detect:

* indirect privilege escalation;
* policy contradictions across multiple files;
* unsafe dependency relationships;
* stale or invalid architectural assumptions;
* trust-boundary violations;
* dangerous interactions between otherwise valid configurations;
* permissions that become exploitable only through another component.

#### Example

Consider:

```text
IAM policy
    ↓
deployment role
    ↓
CI workflow
    ↓
pull_request_target
    ↓
untrusted contribution
```

None of these components may individually violate a local rule.

However, their composition may allow an untrusted pull request to reach a production-capable credential.

Rig can therefore report:

> The proposed IAM change creates an indirect path from an untrusted workflow trigger to a production-capable role.

The defining property of Level 2 is:

> **Rig reasons about the consequences of relationships, not merely the properties of individual changes.**

---

### Level 3 — Evidence-Based Behavioural Verification

**Objective:** Establish whether the predicted behaviour of a change is actually reachable or observable.

Level 3 moves from static judgement to empirical or mechanically derived evidence.

The harness converts a security or behavioural claim into a testable hypothesis.

Formally:

$$
H
\rightarrow
E
\rightarrow
O
\rightarrow
V
$$

where:

* (H) is the hypothesis,
* (E) is an experiment, simulation, or verification procedure,
* (O) is the observed result,
* (V) is the final verdict.

For example:

$$
H =
\text{``Production deployment requires explicit approval.''}
$$

Rig may then construct or execute a procedure attempting to violate that invariant.

#### Possible verification mechanisms

Level 3 may use:

* sandboxed execution;
* targeted integration tests;
* infrastructure-plan inspection;
* policy simulation;
* workflow execution;
* symbolic or static reachability analysis;
* generated adversarial test cases;
* permission-chain traversal;
* runtime instrumentation.

The use of an LLM or agent is **not itself sufficient** to constitute Level 3.

The distinguishing characteristic is the production of verifiable evidence.

#### Example

Declared invariant:

> A contributor cannot deploy to production without Gate 2 approval.

Rig determines an apparent attack path and tests it:

```text
Untrusted change
      ↓
workflow execution
      ↓
credential acquisition
      ↓
production deployment attempt
```

Observed result:

```text
FAIL

Invariant:
Production deployment requires Gate 2 approval.

Observed path:
pull_request_target
→ deploy workflow
→ assume deployment-role
→ production deployment

Evidence:
Deployment operation completed without Gate 2 authorisation.
```

The defining property of Level 3 is:

> **Rig does not merely predict unsafe behaviour; it attempts to establish evidence that the behaviour is or is not possible.**

---

## Capability Hierarchy

The levels are cumulative rather than independent.

$$
L_3 \supset L_2 \supset L_1
$$

A Level 3 harness should therefore normally retain the deterministic controls provided by the preceding levels.

| Level             | Primary input                                | Primary question                            | Output                  |
| ----------------- | -------------------------------------------- | ------------------------------------------- | ----------------------- |
| **L1 — Policy**   | Diff + explicit policy                       | Is this change authorised?                  | Policy verdict          |
| **L2 — Context**  | Diff + policy + system relationships         | What does this change imply elsewhere?      | Semantic risk           |
| **L3 — Evidence** | Hypothesis + system + verification mechanism | Can the predicted behaviour actually occur? | Evidence-backed verdict |

The confidence model strengthens accordingly:

$$
\text{Rule Match}
<
\text{Contextual Inference}
<
\text{Observed Evidence}
$$

This does **not** mean Level 1 is less trustworthy. In fact, deterministic policy enforcement may provide the strongest possible conclusion for questions that can be expressed as explicit rules. The hierarchy reflects **scope of capability**, not merely confidence.

---

## Design Principle

Rig should always use the **lowest capability level capable of reaching a definitive answer**.

For example:

```text
Can deterministic policy decide it?
        │
       yes ──→ L1
        │
        no
        ↓
Can repository context establish it?
        │
       yes ──→ L2
        │
        no
        ↓
Can behaviour be verified?
        │
       yes ──→ L3
        │
        no
        ↓
Human judgement required
```

This preserves determinism where possible while reserving more expensive reasoning and execution for cases that genuinely require them.

## Canonical formulation

I would make this the short definition used throughout Rig:

> **Rig's linting harness operates across three capability levels: Policy, Context, and Evidence.**
>
> **Level 1 governs the change** by applying explicit policy to the proposed repository transition.
> **Level 2 understands the change** by reasoning about its implications across the wider system.
> **Level 3 proves the change** by producing behavioural evidence that relevant security and system invariants hold or fail.

Or, in the shortest possible product language:

$$
\boxed{
\textbf{Govern the change. Understand the change. Prove the change.}
}
$$

That is strong enough to become the canonical capability model rather than merely a marketing ladder.
