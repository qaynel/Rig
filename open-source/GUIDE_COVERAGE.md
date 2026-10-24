# Coverage of the entire canonical English-language Open Source Guides collection

**Inventory method:** enumerate all guide links on the English home page, open each linked article, examine its table of contents and substantive guidance, and translate each into maintainable project standards. This covers **13/13 English guide articles surfaced on the homepage as of 2026-10-24**. It does **not** claim to archive translations, every linked third-party page, footers, assets, or every URL under the domain. Use the upstream source for the complete, current text.

The original site is maintained by GitHub and community contributors, and its content is CC BY 4.0. Attribution: *Open Source Guides*, GitHub/community contributors, https://opensource.guide/, https://github.com/github/opensource.guide. The summaries and controls in this bundle are original interpretations, not copied pages.

| # | Guide / primary URL | Operationalisation in this framework | Evidence to request |
|---|---|---|---|
| 01 | [Accessibility Best Practices for Your Project](https://opensource.guide/accessibility-best-practices-for-your-project/) | Inclusive docs and CLI/UI; keyboard/no-colour-only, `--help`, `--json` if suitable, understandable errors; accessibility issues and tests | Accessibility policy, sampled docs, accessible CLI/UI tests, manual smoke results |
| 02 | [Security Best Practices for Your Project](https://opensource.guide/security-best-practices-for-your-project/) | MFA, SAST, secret prevention, dependency/OSS licence reviews, protected branches, private disclosure and incident response | Repo/org settings, workflow config, scanner runs, SECURITY.md, exercises |
| 03 | [Maintaining Balance for Open Source Maintainers](https://opensource.guide/maintaining-balance-for-open-source-maintainers/) | Declared service levels and time boundaries, triage automation, limited obligations, delegation once real volunteers exist | SUPPORT.md, issue/PR expectations, rotation or escalation ownership |
| 04 | [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/) | Design for first-time developers and non-code contributions; explain submission/review loop and standards | Fresh clone to passing test, first-PR exercise, issue labels, templates |
| 05 | [Starting an Open Source Project](https://opensource.guide/starting-a-project/) | OSS-appropriate licence, compelling README, CONTRIBUTING, conduct policy, real example, pre-launch secret/history check | Licence review, README walkthrough, source and history audit |
| 06 | [Finding Users for Your Project](https://opensource.guide/finding-users/) | Honest positioning and boundaries, discoverability, searchable examples, one authoritative homepage, feedback routes | README value proposition, example runs, packaging metadata |
| 07 | [Building Welcoming Communities](https://opensource.guide/building-community/) | Low-friction contributor funnel, good first issues, respectful acknowledgement and transparent moderation | Triaged issues, first-contributor experience, public decisions |
| 08 | [Best Practices for Maintainers](https://opensource.guide/best-practices/) | Document vision, issue/PR intake, contribution limits, predictable responses, CI and automation without needless bureaucracy | VISION.md or README scope, contribution templates, enforced gates |
| 09 | [Leadership and Governance](https://opensource.guide/leadership-and-governance/) | Publish decision owner and contributor/maintainer privileges; add formal governance only when needed | Governance policy, access review and escalation path |
| 10 | [Getting Paid for Open Source Work](https://opensource.guide/getting-paid/) | Optional funding and time sustainability; transparent sponsor/support expectations; no implied SLAs | FUNDING.yml or rationale for omitting, support policy |
| 11 | [Your Code of Conduct](https://opensource.guide/code-of-conduct/) | Established code of conduct, private reporting, real contact and alternative reporting path, practical enforcement | CODE_OF_CONDUCT.md + verified intake path, owner acknowledgement |
| 12 | [Open Source Metrics](https://opensource.guide/metrics/) | Measure onboarding, usage where privacy-respecting, responsiveness, contributor health; never use stars as a quality proxy | Monthly low-maintenance health report with definitions and trend |
| 13 | [The Legal Side of Open Source](https://opensource.guide/legal/) | OSI-approved explicit software licence, copyright/IP ownership, dependency compatibility, clear contribution attestation | Licence notice and provenance review, DCO/CLA decision, dependency inventory |

## Modern standards used to turn guidance into measurable controls

1. **OpenSSF OSPS Baseline (current snapshot version v2026.08.28):** https://baseline.openssf.org/versions/2026-08-28 . Level 1 applies to projects with any number of maintainers/users; Level 2 is intended for code projects with >=2 maintainers and consistent users; Level 3 for projects with many consistent users. Levels contain formal *MUST* requirements. **Do not claim compliance from this summary; evaluate every applicable control in the versioned source.**
2. **OpenSSF Scorecard:** https://github.com/ossf/scorecard . Automated *signal* for branch protection, code review, dependency updates, dangerous workflows, CI, tokens, signing and more. Review false positives and constraints rather than gaming a scalar score.
3. **OpenSSF Best Practices Badge:** https://openssf.org/projects/best-practices-badge/ . Optional voluntary self-assessment; distinct metal (passing/silver/gold) and baseline criteria. Never claim a badge not earned.
4. **GitHub community health standard:** https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions . Discoverable contribution, conduct, security, issue and PR paths.
5. **GitHub Actions secure use:** https://docs.github.com/en/actions/reference/security/secure-use . Secrets, least privilege, untrusted pull requests, workflow dependencies. *Current GitHub advice prioritises workflow-dependency lockfiles where supported, and full SHA pinning where they cannot be used.*
6. **GitHub artifact attestations:** https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations . Provenance/SBOM attestation for real build outputs, verified before distribution.
7. **REUSE v3.3:** https://reuse.software/spec/ . Machine-readable per-file licence declarations and licence-file inventory when complexity justifies it.
8. **Diátaxis:** https://diataxis.fr/ . Distinct tutorials, goal-based how-to, reference and explanation as a documentation architecture, adopted incrementally.
9. **CHAOSS Responsiveness:** https://www.chaoss.community/practitioner-guide-responsiveness/ . Interpret first response and time-to-close as diagnostic trends, not targets to manipulate.
10. **OpenChain ISO/IEC 5230:** https://openchainproject.org/license-compliance . A heavier organisational licence-compliance process; **optional** for small independent projects.
11. **npm OIDC trusted publishing (if npm is used):** https://docs.npmjs.com/trusted-publishers/ . Avoid long-lived publish tokens when registry and runner support trusted publishing.
12. **GitHub private vulnerability reporting:** https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately . This capability must be enabled separately from merely creating SECURITY.md.

## Priority and legal cautions

- A *public* repository without a licence is not necessarily open source. Licence choice has real redistribution, dependency and contributor consequences; never choose a licence on behalf of the owner without approval.
- DCO (`Signed-off-by`) is a practical attestation mechanism. A CLA can be justified for some business/legal objectives, but should not be silently imposed or conflated with DCO. The choice and enforceability require project-specific review.
- Non-code content (docs, art, datasets, models) may need additional licensing; a source-code software licence alone does not automatically clarify the rights to all assets.
- A vulnerability intake path must work and must be *private*. A link to a public issue is insufficient for sensitive reports.
- Source pages evolve; record a source version/date in the project audit, especially OSPS.
