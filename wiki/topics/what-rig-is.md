# What Rig is

## What it is

Rig is a packaged, forward-deployed, host-agnostic agentic harness for an
existing repository. It reads the current repo and project context, chooses how
best to install the harness with the tools Rig ships, and helps the user set it
up while respecting existing infrastructure instead of replacing it. Tier 1 is
a markdown-only bootstrap; the beta delivery focuses on the user-selected
engineering catalogue without adding a Rig model runtime or model key.
**Beta note:** The mandatory agent-technology safety baseline is included. The
Product-Security catalogue remains independently selectable, and no Rig model
runtime or model key is introduced.
[Gate 1 §1–2](../gate1/business-spec.md)
[Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## Why it is this way

The foundational design chose doctrine over bundled runtimes and one shared
router over independent host implementations. Advanced grilling then locked the
"brain" choice to B1: Rig authors configuration and the host agent performs the
work. That keeps the install portable and leaves model execution with the host
the user already chose. [Foundational decisions G1–G6](../sources/logs/grill-decisions.md)
[Advanced grilling GA-1–GA-2](../sources/logs/advanced-grilling.md)

The intent owner later sharpened that product spirit: Rig exists to be a
dynamic, plug-and-play agentic harness that adapts as the project grows, takes
in project context, and lets most updating happen through the host. Rig should
make the host and repository more productive rather than duplicate or displace
what is already there. [Product-spirit hybrid trace](../reasoning/2026-08-20-product-spirit-hybrid.md)

The same posture now explicitly frames Rig as a packaged forward-deployed
harness: it lands in the repository, evaluates what is already there, and
complements that setup with delivered Rig tools rather than trying to become a
parallel infrastructure stack. [Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)
The intent owner reasserted this on 2026-08-31 as the frame for fixing
install-time defects: the adaptation is the user's own host agent's job at
install time — reference the existing config, keep what fits the stack, drop
what doesn't — so phantom-convention text in installed files
(`rig/tier-1/routing.md`, RIG-151/RIG-152) is rewritten as instructions *to
that onboarding agent*, not resolved by an installer-code transform.
[reframe-vs-transform trace](../reasoning/2026-08-31-routing-md-adaptation-not-transform.md)
The same session scoped the adapt engine itself as **deterministic
acceleration**: Rig ships deterministic tools the host agent invokes (config
inventory, reference-by-path, selective skill install) so the mechanical-only
detection boundary (`D24`) is untouched — Rig *code* still does not infer what
a repo wants. The intent owner then locked Path B as **agent-led graft**: the
onboarding host agent, given full repo context plus the full Rig capability
catalogue (organised into families), decides what is relevant, reuses and
extends what already exists, grafts missing Rig behaviour, and adds only genuine
gaps. The user reviews the resulting improvement and only critical decisions,
not a skill-by-skill wizard. Repo-specific state stays under `.rig/`.
Inference-from-repo-shape *in installer code*, auto-trimming, and a
deterministic stack→skill rule engine remain out of beta. Follow-up locks in
the same session settled the last two design points: grafts into repo-owned
files are permitted but confined to explicit begin/end Rig-managed sections so
removal is a clean string operation, and the flat vendored skill shelf is
reorganised into `family → tool/capability → skill` by capability (not by
vendor origin), while the existing `family → group → service → grade` service
catalogue is untouched.
[Path B adapt scope](../reasoning/2026-08-31-path-b-adapt-scope.md)
[Path B product direction](../reasoning/2026-08-31-path-b-product-direction.md)
[Path B follow-up decisions](../reasoning/2026-08-31-path-b-follow-up-decisions.md)

The working Path B technical design makes that identity executable without
turning Rig into the brain: one explicit onboarding invocation gives the host
agent a generated capability catalogue and structural repository inventory;
the agent proposes reuse, marked grafts, and genuine additions; existing
approval, journalling, and checks apply the exact proposal. The full skill
library stays release-pinned but outside host discovery, while only approved
skills are projected into host-native paths. File and byte growth remain
warnings; duplicate projections, dangling references, malformed ownership, and
state drift fail. The completed vertical slice verifies proposal-bound approval,
applies only marked grafts, and reconciles the result into checked state.
[Path B technical specification](../reasoning/2026-08-31-path-b-technical-spec.md)
[Vertical slice](../reasoning/2026-09-01-path-b-slice5-vertical.md)

Grilling authored the executable oracle without reopening product direction:
ten cases cover all six foundational and four support contracts, with the
governed service-catalogue guard intentionally green from the start. The owner
has signed the exact 14-file, 83-case oracle, so implementation can now turn
the remaining product failures green without moving the contract.
[Path B acceptance oracle](../reasoning/2026-08-31-path-b-acceptance-oracle.md) ·
[implementation resumption](../reasoning/2026-09-01-path-b-implementation-resumption.md)

A later office-hours session tested this identity against a candidate fork
(DeepSeek Harness, "DSH") — a full agent-runtime host, the opposite category
from Rig's config-only doctrine layer. The resolution: Rig's moat is the
adaptation-onto-existing-infra engine, not any instruction set, and a DSH-style
shell may be adopted only as an optional, frozen, tier-1-only delivery medium
for the no-host segment — reach, not moat — never chased upstream.
[`GA-36`](../index/decisions.md) [DSH envy and the audience fork](../reasoning/2026-08-23-dsh-envy-and-the-audience-fork.md)
[DSH routes to models, not hosts](../reasoning/2026-08-23-dsh-routes-to-models-not-hosts.md)
[DSH is a delivery medium, not the moat](../reasoning/2026-08-23-dsh-delivery-medium-not-moat.md)

## What binds it

The binding rulings are `G1`–`G6`, `G10`, `GA-1`, `GA-2`, `GA-9g`, `GA-17`,
and `GA-22`–`GA-23`. Gate 1 defines the current outcome and explicitly separates
agent-tech safety from the Product-Security catalogue family.
[Decision index](../index/decisions.md)
[Gate 1 §2](../gate1/business-spec.md)

## What was rejected

A thin fork, a Rig-owned runtime, a Rig model key, a mutable memory database,
and fixed Basic/mid/Advanced install packages were rejected. The old tier
taxonomy remains only as historical evidence and compatibility context.
[Rejected approaches](../index/rejected.md)

## Authorities and sources

- Current intent: [Gate 1](../gate1/business-spec.md)
- Technical shape: [Gate 2 §3–4](../gate2/technical-spec.md#3-current-state-trace)
- Origin: [foundational log](../sources/logs/grill-decisions.md) and [advanced log](../sources/logs/advanced-grilling.md)
- Historical taxonomy: [superseded tier docs](../sources/superseded/deprecated-tier-taxonomy/README.md)
- Product-direction review: [reasoning trace](../reasoning/2026-08-19-product-direction-review.md)
- First-attempt retrospective (what not to do): [reasoning trace](../reasoning/2026-08-20-first-attempt-retrospective.md)
- Product spirit and hybrid posture: [reasoning trace](../reasoning/2026-08-20-product-spirit-hybrid.md)
- Packaged forward-deployed harness clarification: [reasoning trace](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)
- Beta safety posture: [reasoning trace](../reasoning/2026-08-23-beta-safety-posture.md)
- Universal capability model, lint-format first: [reasoning trace](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)
- DSH audience-fork question, opened then resolved: [envy and the fork](../reasoning/2026-08-23-dsh-envy-and-the-audience-fork.md), [DSH routes to models not hosts](../reasoning/2026-08-23-dsh-routes-to-models-not-hosts.md), [delivery medium not moat](../reasoning/2026-08-23-dsh-delivery-medium-not-moat.md)

## What is still open

The product identity, broad Policy delivery, and plan-time model-assisted
secret-triage disclosure are implemented. Production release still needs fresh
independent review evidence over the final PR bytes and explicit tag
publication. [Current status](../status.md)

The audience-fork question (whether to widen reach with a DSH-derived shell) is
closed as `GA-36`: adaptation quality is the moat and is still unproven, and a
DSH shell is at most an optional, frozen, tier-1 reach play. What remains open
is proof, not architecture — whether Rig's merge-not-overwrite pass on a real
repository actually produces a better result, and whether anyone wants to
install it.

That proof now has a first data point, and it is split. The first real
adaptation run — Rig installed onto `inspo/claude-task-master-main/`, a dense
Claude+Cursor+Kiro+plugin repo — scored **+12/100**: the merge-not-overwrite
core is real and working (a non-destructive `append_managed` onto `CLAUDE.md`
with a stored preimage, 100% of original guidance preserved), but *adaptive
integration is not built*. Rig ignored 27 Cursor rules, 5 Kiro steering docs,
the Claude plugin, and `.taskmaster/CLAUDE.md`, stacked generic parallel files
across three ecosystems, and shipped ~85% stack-irrelevant skills. Merge works;
adapt does not yet. [Adaptation eval](../reasoning/2026-08-30-adaptation-eval-claude-task-master.md)

The intent owner's full end-product expectation is now recorded as durable
intent: Rig as a portable "ultimate toolbox" that *installs* (not onboards) into
any repo, rides the host to graft itself onto whatever is already there, and
serves a spectrum from no-host beginners through skill-hoarding workflow users
to superusers — via a tiered, interactive, adaptive install.
[Product vision and tiered adaptive install](../reasoning/2026-08-30-rig-product-vision-and-tiered-adaptive-install.md)
The apparent tension with the à-la-carte model and D24 is now settled at the
product-model layer: Rig *code* still does not guess from repo shape; the
onboarding *host agent* does the judgment from supplied context; the user
consents by reviewing the graft summary rather than picking families. What
remains open is implementation and proof — whether that agent-led graft
actually produces a better result on real repositories.
[Path B product direction](../reasoning/2026-08-31-path-b-product-direction.md)

Rig's universal service-depth method is Policy → Context → Evidence: govern,
understand, then prove the change, while using the lowest level that can reach a
definitive answer. All 115 leaves carry Policy contracts; lint-format retains
the deeper repository-specific Context and rerunnable Evidence proof.
