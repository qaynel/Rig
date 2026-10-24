# Source ingestion protocol for a local agent

## What has been covered in this research

The English landing page at https://opensource.guide/ exposed **13 canonical guide articles** on 24 October 2026. The complete 13/13 URL inventory, topic mapping and operational interpretation are in `GUIDE_COVERAGE.md`. Additional linked third-party resources are supplementary, not part of the canonical-guide completeness claim. This bundle does **not** reproduce full article text.

## For an agent needing the full original material

Preferred source: **the official, version-controlled site repository**, not a brittle HTML scrape:

```bash
# Run in an external research workspace, NOT inside the target project.
git clone --depth 1 https://github.com/github/opensource.guide.git research-opensource-guide
cd research-opensource-guide
git rev-parse HEAD
ls _articles
```

Identify the English-language source articles corresponding to the **13 URLs in `GUIDE_COVERAGE.md`**; inspect language/translation conventions and the site's source mappings instead of guessing filenames. Read the complete current content of each of these 13. Keep provenance `(source URL, site commit SHA, date read, heading, derived policy ID)` for every extracted rule. Check the official notices/licence before storing, transforming or redistributing content. The original site content uses **CC BY 4.0** and requires appropriate attribution and licence notices.

If a repo clone is impossible, open the 13 URLs in `GUIDE_COVERAGE.md` through approved HTTP/web access, follow any crawl restrictions, use rate limits, and extract the page `main/article` text and table of contents while excluding nav/footer/translated duplicates. Record failures explicitly. Never claim full coverage if any of the 13 fails, and never silently use stale caches.

## Grounding discipline

1. Distinguish **upstream claim**, **recommended local policy**, and **observed repository fact**.
2. Bind every decision to its original URL or versioned specification. Store short paraphrases and links rather than mass-copying source articles into the user repo.
3. Record any gaps between the current upstream version and the research snapshot used here.
4. Keep OpenSSF security baseline pinned to **v2026.08.28** for initial comparison; check whether a newer *current* version has been published before adopting controls in production.
5. Do not copy sample contributor identities, contact addresses, repository names or licensing choices into the target project as if they were the user's.
6. Source ingestion may read/clone upstream into a temporary research workspace when authorised; it may **not** alter the target repo or publish a derivative without explicit owner approval.
