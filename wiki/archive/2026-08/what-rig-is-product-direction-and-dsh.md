---
date: 2026-08-31
source: intent owner
topics: what-rig-is, the-catalogue, delivery-plan, onboarding-flow, host-and-ci-coverage, distribution-and-release
status: historical
summary: Archived August 2026 reasoning on what Rig is, the product direction, the first-attempt retrospective and the DSH audience fork — 9 traces compacted.
---

# What Rig is: product direction, the first-attempt retrospective, and the DSH audience fork

Compacted on 2026-10-17 from 9 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

Rig is a **packaged forward-deployed harness**: it lands in a repository,
evaluates what is already there, decides how best to implement the harness
given the tools being delivered, and complements the existing setup rather than
becoming a parallel infrastructure stack. The product spirit (`GA-17`) is
hybrid: "we don't add redundant things by pushing what we have over what is
already there, we push things which will improve and amplify what is there."

The two-tier reading was corrected by the owner at the outset: Tier 2 is not a
competing product but a refined, targeted version of Tier 1 — one product at
two levels of intelligence. The reason the catalogue stalled was named by the
owner in their own diagnosis: **context rot**. The product exists to defeat
context rot across the agentic development cycle, and context rot is what
defeated its own construction.

The first-attempt retrospective is the five-item "what not to do" list in the
owner's own voice: authored the whole catalogue at once; let context rot carry
the work off course; built the whole mechanism before proving one leaf;
over-engineered the governance shell for a solo project; wrote tests calibrated
to placeholders. The owner also named their own instinct to watch — "freeze all
the specs then burn all 115 at once" is the same shape as mistake 1.

The DSH arc ran three traces in one session and closed as `GA-36`. Rig has no
loop, no session and no UI; DSH *is* a host and competes with Claude Code
rather than layering on it, and its `llm` packages route to **model APIs, not
agent hosts** — there is no seam for wiring Claude Code in as a backend. The
corpus is the invariant and is host-agnostic by nature, so config-only *is* the
spectrum play. The moat is not the instruction set — the owner's sharpest
question, "is my instruction set really the moat?", was answered **no** — it is
the adaptation-onto-existing-infra engine, whose *quality* was the unproven
asset. DSH was adopted as an optional, frozen, tier-1-only delivery shell for
the no-host segment: reach, not moat, never chased upstream.

By 2026-08-30 the owner restated the full end-product expectation: Rig as a
portable "ultimate toolbox" you install (not onboard) into any repo, riding the
host to graft itself onto whatever is already there, serving a spectrum from
vanilla beginners to openclaw superusers through a tiered, interactive,
adaptive install. That statement's tensions with the à-la-carte model, with
D24's mechanical-only detection and with the +12 eval were recorded as the
honest open state rather than silently reconciled.

Separately, for the beta the owner authorized saying plainly that safety guards
are not being put in yet because it is a beta product.

## Source traces

### 2026-08-19-product-direction-review.md
- **Summary:** Product-point-of-view review of the whole repository, opened because the current direction felt over-engineered; closes with the horizontal-vs-vertical fork open.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** What the owner wants the product to be (context maintenance, multiple-document management, change management, spec-driven development, making the agent process deterministic, across as many hosts as possible). The two tiers as measured: Tier 1 ~373 lines across ~13 hosts with no runtime; Tier 2 at 805 taxonomy leaf files, a ~2,467-LOC materialization engine, ~14,157 lines of governance wiki, 0 of 115 services semantically authored and 432 files carrying `TODO(Slice 10)`. The owner's correction that B is a refined version of A. The horizontal-vs-vertical fork and the proposed reconciliation.
- **Verbatim rulings / rejections / traps:** Owner verbatim: "I think I have over engineered the current implementation, but then I want this thing to like serve as many host that is possible." On the catalogue leaves: "all of those are needed... but then all of them are targeted." Root cause: "I got sidetracked a lot because I think it's due to context rot that I was not able to deliver on all of this." Horizontal case verbatim: "once I nailed down the decisions which I thought were like very few that I could ship out all the 115 entities together... just nailed down all the specs right now, freeze them from my side, and then the agent can go around on its own time... once the intent is clear from my side code is just cheap." Trap: the 19 `advanced-*.test.js` files "are green and, per `status.md`, worthless (calibrated to placeholder content)." Agent's case against pure horizontal: "the delivery-plan hub already records that bulk/parallel authoring is what produced the 432 placeholders, with sequential authorship chosen in Gate 2 §14 specifically to avoid repeating it. So 'freeze then burn all 115 together' is close to the approach the repo already tried and rejected."

### 2026-08-20-first-attempt-retrospective.md
- **Summary:** Retrospective on the first attempt to build the catalogue, in the owner's own voice — five named mistakes and the instinct to watch.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** (1) Authored the whole catalogue at once — 432 `TODO(Slice 10)` files, 0 of 115 authored; Gate 2 §14 named bulk/parallel authoring as the direct cause. (2) Let context rot carry the work off course. (3) Built the whole mechanism (~2,467 lines, two gates, 805 leaf files) before proving one leaf. (4) Over-engineered the governance shell for a solo project. (5) Wrote nineteen tests calibrated to placeholders.
- **Verbatim rulings / rejections / traps:** Framing: "I am building a framework to defeat context rot across the agentic development cycle, and context rot is what defeated the framework's own construction." Mistake 1 rule: "do not generate the whole shelf in one pass. One leaf finished, installed, and working beats a hundred and fifteen stubbed. Cheap-looking bulk output is the most expensive thing here, because it looks like progress and is not." Mistake 2 rule: "do not keep the whole thing open at once. Open a small context, finish it, close it." Mistake 3 rule: "do not build the factory before you have made one good unit by hand." Mistake 4 rule: "do not add a control until the threat it defeats is real and present. Match the ceremony to the threat and to the size of the team, which is one." Mistake 5 rule: "do not write a test that cannot fail. A test calibrated to pass against placeholder content is worse than no test, because it manufactures false confidence." The instinct to watch: "My stated preference now — freeze all the specs from my side, then have the agent burn all 115 leaves at once because 'once the intent is clear from my side code is just cheap' — is the same shape as mistake 1… But it is the exact instinct that produced the 432 placeholders, so it has to earn its way back in."

### 2026-08-20-packaged-forward-deployed-harness.md
- **Summary:** Rig framed as a packaged forward-deployed harness that looks at the repo context, decides how best to implement the harness, and respects existing infra.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The owner's framing instruction, filed verbatim, with permission to propagate the clarification wherever needed.
- **Verbatim rulings / rejections / traps:** "the Rig needs to be looked at in terms of a pakaged forward deployed harness. It looks at the current repo/project context. Decides how best to implement the harness given the tools (which we are delivering right now).\n\nthen it helps the user setup the harness to the best of their expeirence while respect exsisting infra and complementing it rather than replacing it\n\nyou can update/tweak wherever this clarification is needed"

### 2026-08-20-product-spirit-hybrid.md
- **Summary:** GA-17 — the product spirit: a dynamic, plug-and-play agentic harness that amplifies what is already there; when there are product options, choose the hybrid one.
- **Decisions:** GA-17
- **Status:** historical
- **What it recorded:** The owner's statement of the main pain point and the resulting selection rule.
- **Verbatim rulings / rejections / traps:** "The main pain point the RIg is solving is that we want a agentic harness that is more dynamic and on the go + plug n play which adapts grows with the project taking in context and most of this updating happens from the host we are just making it the most productive it can be.\n\nSo when there are options of product we choose hybrid one\n\nThe main point being we don't add redundant things by pushing what we have over what is already there we push thing which will improve and amplify what is there.\n\nthat is the spirit of product."

### 2026-08-23-dsh-envy-and-the-audience-fork.md
- **Summary:** Office-hours session opened by a DeepSeek Harness zip landing in the repo — the category confusion, the three options, and the standing instruction to treat the wiki as the reference source.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Rig is a doctrine layer installed into someone else's repo with no runtime and no model key — decision `B1`/`GA-2`, reached through grilling and locked. DSH is the opposite category: ~57 packages, `npx dsh web` boots its own UI; it *is* the host. So "fork dsh and integrate it with Rig" is a category switch, not an integration. D1 (goal): a mix — long-run possibly a startup, right now open source looking for real users' feedback, also a first project and learning vehicle. D2/D3: the real axis is who runs the agent loop. Three options named: A (host does it, Rig stays config-only, ~80% built, ships this quarter), B (Rig forks dsh and owns a host), C (host runs the loop, Rig steals dsh's shape and surface). Asked to describe the vision without either product, the owner restated Rig's own charter almost verbatim.
- **Verbatim rulings / rejections / traps:** The read: "this is not idea-confusion. It is surface-envy — `dsh` has *built machinery* and a visible UI; Rig is 380 tests of markdown ceremony that does not yet *feel* like a product." The expensive trap: "by definition, the users a forward-deployed harness targets already have a loop, so the 'bring dsh's loop' branch fires for the fewest users while costing the most engineering (~90%: fork 57 packages, keep them synced forever, build the runtime, the UI, and the mode-switching logic)." Standing instruction, verbatim: "Make it a point to save like reasoning, traces, and like updating the philosophy, and all of these things in the wiki — I want this to be like a reference source. If you're developing software, it's more about what was the intent behind [it] rather than what is the code — because the code might be faulty, or architecture might be faulty, but then if the intent was right, it could always be rebuilt with the correct architecture. The correct architecture can always be built if the intent — the spirit — was clearly defined."

### 2026-08-23-dsh-routes-to-models-not-hosts.md
- **Summary:** Checked against DSH's own packages — its `llm` adapters route to model APIs, not agent hosts, so "DSH as a UI over Claude Code" is not a thing DSH does.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Reading `deepseek-harness-master/packages/{llm,host,acp,subagent,client}`: `llm` is provider adapters to model APIs; `host`/`client` are DSH's own web GUI; `acp` exposes harness agents to external clients, i.e. the reverse direction. There is no seam for wiring Claude Code in as a backend, because Claude Code and Cursor are loops, not model endpoints. The reframe: the corpus is the invariant, host-agnostic by nature, so config-only *is* the spectrum play. The assignment given was to write one source-of-truth corpus on one real repo, emit both `CLAUDE.md` and `.cursor/rules`, run the same task through both hosts, and observe.
- **Verbatim rulings / rejections / traps:** "One loop cannot be nested inside another loop's UI." On what a fork actually buys: "It gets you DSH's loop calling the Claude model. Which collapses the 'middle of the spectrum' idea into exactly the outcome the intent owner said they wanted to avoid: **a coding agent competing with Cursor and Claude Code**, with a corpus preloaded and a UI to maintain forever." On DSH's actual addition: "it adds exactly one thing: a front end of its own, for people with **no host at all**. And that slice is the one where 'I adapt to what you already have' is worth nothing, because there is nothing to adapt to." Recommendation: "Keep it in the wiki as a v2 possibility; do not let it be v1." Cheap test framing: "A 'yes' finds the wedge; a 'meh' is a three-month monorepo-fork avoided cheaply."

### 2026-08-23-dsh-delivery-medium-not-moat.md
- **Summary:** GA-36 — DSH adopted as an optional, frozen, tier-1-only delivery shell for the no-host segment; the moat is the adaptation engine, whose quality is the unproven asset.
- **Decisions:** GA-36
- **Status:** historical
- **What it recorded:** Three corrections along the way (wrapping a host is real and Conductor proves it, but DSH does not hand it over; the owner's own "more than linear" test applied honestly makes corpus-first the only super-linear choice; and the instruction set is conceded not to be the moat). Where the real moat lives, in four concrete parts: merge-not-overwrite, repo-shape-aware tailoring, fitting the existing AI-development workflow, and emitting per host from one adaptive analysis. Three guardrails attached to the yes, all accepted by the owner.
- **Verbatim rulings / rejections / traps:** The sharpest question and its answer: "**\"Is my instruction set really the moat?\"** — the sharpest question in the session. Honest answer: **no.** Good prompts and skills are not scarce or defensible; they are everywhere." Verdict: "**not delusion — the instinct is right, with one relabel held firmly.** DSH widens Rig's **reach**, not its **moat**, and the two must never be confused." On the funnel: "'DSH handles most of that segment' cuts both ways: low build cost, but also low ownership — most of that user's value is DeepSeek's, not Rig's. Fine for a funnel play; fatal if mistaken for defensibility." Guardrail 1: "Availability everywhere is fine as a someday-maybe; *support* everywhere is not something to commit to ahead of demand." Guardrail 2: "The moat is unproven. 'Adapts onto existing infra' has been treated as a settled asset throughout this session; it is a hypothesis." Guardrail 3: "A hardwired loop *runs*; an instruction only has a *probability* of running, gated on how well the host agent obeys — that is the honest shape of what config can guarantee." The line in permanent ink: "*target hosts freely; never chase DSH upstream.*" Decision text: "**DSH is adopted as an optional, frozen, tier-1-only delivery shell for the no-host segment — reach, not moat.**… Build order stays corpus-first: the adaptation engine, then an authoring/preview/approve surface that borrows DSH's UI ideas, then — last, and only on real demand — a DSH-derived or Agent-SDK-based shell for the no-host tier."

### 2026-08-23-beta-safety-posture.md
- **Summary:** Owner authorizes stating plainly that safety guards are not being put in now because it is a beta product.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The owner's instruction to make that change wherever necessary.
- **Verbatim rulings / rejections / traps:** "Yeah, OK yeah just say that you're not putting in safety guards now as because it's a beta product\n\nYeah, can you do that? Just make that change wherever necessary"

### 2026-08-30-rig-product-vision-and-tiered-adaptive-install.md
- **Summary:** Intent owner's full end-product expectation — RIG as a portable "ultimate toolbox" that installs (not onboards) into any repo, rides the host to graft itself onto whatever is already there, and serves a spectrum from no-host beginners to superusers via a tiered, interactive, adaptive install.
- **Decisions:** none
- **Status:** current (at time of filing)
- **What it recorded:** Part 1 is the owner's verbatim statement of the original intent, the spectrum, the "take your Rig with you" toolbox framing, the cheap model (let the owner run it on their own host, supercharge whatever intelligence is there), and the one-corpus-translated-per-host idea the owner could not remember the objection to. Part 2 is the pitch restated the same day, naming the three audience bands (vanilla beginner; person with skills.md/hooks/basic harnesses; openclaw superuser) and the two-step interactive install. A closing synthesis section records the tensions with what is frozen.
- **Verbatim rulings / rejections / traps:** Toolbox framing, verbatim: "You take your Rig with you. It's like a toolbox that is there, the ultimate toolbox for landing into any repository." On the model: "So the model is static, right? Regardless of whatever model is there, we are trying to supercharge it… It must be, like, just like an LLM… But we'll power thrust it with so much… we are supercharging that intelligence with our sort of expertise." On the corpus idea: "why can't we have, like, one corpus of, like, Rig artifacts, which are then translated into how natively other hosts are picking up… I don't know why that was shot down. But then, I mean, that is a very clean way." The pitch: "you install us (not even onboard, we'll handle that by riding your host and giving it context to how best graft rig)". Recorded tensions: "'Rig has everything' / one-stop amalgamation vs. the à-la-carte model and the +12 eval… installing everything is the *liability*, not the selling point (~85% dead weight on a Node/TS repo)." And: "'Host onboards Rig, inferring best practices and adapting per repo' vs. D24 mechanical-only detection… The tiered adaptive install described here is a direction change from that, not a backfill of it, and would need its own grilling and gate, not a silent edit." And on the corpus objection: "per GA-36 it was *not* shot down as an architecture — corpus-first with one analysis emitted per host is the decided direction; what was flagged was forking a runtime and maintaining its packages."
