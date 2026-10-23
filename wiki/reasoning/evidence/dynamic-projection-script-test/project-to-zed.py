#!/usr/bin/env python3
"""
Rig → Zed projection script.

Reads the canonical Rig corpus (skills, routing, rules) and produces:
  .zed/prompts/*.md    — plain markdown, no frontmatter
  .zed/settings.json   — minimal agent config pointing to the prompts

Zed custom prompts are plain markdown files in .zed/prompts/.
The settings.json enables the assistant and references the prompts directory.

General: discovers skills dynamically from the corpus directory.
"""

import os
import sys
import re
import json
import glob

# --- Configuration -----------------------------------------------------------

RIG_BASE = os.path.expanduser("~/projects/Rig/rig/tier-1")
SKILLS_DIR = os.path.join(RIG_BASE, "skills")
ROUTING_FILE = os.path.join(RIG_BASE, "routing.md")
RULES_DIR = os.path.join(RIG_BASE, "rules")
OUTPUT_BASE = os.environ.get(
    "RIG_OUTPUT_DIR", "/tmp/rig-projection-script-test/output/zed"
)
PROMPTS_DIR = os.path.join(OUTPUT_BASE, ".zed", "prompts")
SETTINGS_PATH = os.path.join(OUTPUT_BASE, ".zed", "settings.json")

# --- Helpers -----------------------------------------------------------------

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def strip_yaml_frontmatter(content):
    """Remove YAML frontmatter from markdown content."""
    match = re.match(r'^---\s*\n.*?\n---\s*\n', content, re.DOTALL)
    if match:
        return content[match.end():]
    return content


def extract_yaml_field(content, field):
    match = re.search(rf'^{field}:\s*(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip().strip('"').strip("'")
    match = re.search(rf'^{field}:\s*>\s*\n((?:\s+.+\n?)+)', content, re.MULTILINE)
    if match:
        lines = match.group(1).strip().split('\n')
        return ' '.join(line.strip() for line in lines)
    return None


def write_prompt(filename, body):
    """Write a plain markdown prompt file (no frontmatter)."""
    os.makedirs(PROMPTS_DIR, exist_ok=True)
    path = os.path.join(PROMPTS_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body)
    return path


def discover_skills():
    """Discover all skill directories dynamically."""
    skills = []
    if not os.path.isdir(SKILLS_DIR):
        print(f"ERROR: Skills directory not found: {SKILLS_DIR}", file=sys.stderr)
        sys.exit(1)
    for entry in sorted(os.listdir(SKILLS_DIR)):
        skill_dir = os.path.join(SKILLS_DIR, entry)
        skill_file = os.path.join(skill_dir, "SKILL.md")
        if os.path.isdir(skill_dir) and os.path.isfile(skill_file):
            skills.append((entry, skill_dir, skill_file))
    return skills

# --- Main --------------------------------------------------------------------

def main():
    written = []

    # 1. Routing + rules → single prompt file (always loaded by convention)
    routing_content = read_file(ROUTING_FILE)
    rule_files = sorted(glob.glob(os.path.join(RULES_DIR, "*.md")))
    rules_body = ""
    for rf in rule_files:
        rules_body += "\n\n" + read_file(rf)

    combined = routing_content.rstrip() + "\n" + rules_body.rstrip() + "\n"
    path = write_prompt("rig-routing.md", combined)
    written.append(path)
    print(f"  [routing+rules] {path}")

    # 2. Each skill → its own prompt file (plain markdown)
    skills = discover_skills()
    prompt_names = ["rig-routing"]
    for skill_name, skill_dir, skill_file in skills:
        content = read_file(skill_file)
        description = extract_yaml_field(content, "description") or f"Rig {skill_name} skill."
        body_raw = strip_yaml_frontmatter(content)

        # Prepend a summary line so Zed users know what the prompt is
        body = f"<!-- {description} -->\n\n" + body_raw

        # Append extra files from skill dir
        for extra in sorted(os.listdir(skill_dir)):
            extra_path = os.path.join(skill_dir, extra)
            if extra != "SKILL.md" and os.path.isfile(extra_path) and extra.endswith(".md"):
                extra_content = read_file(extra_path)
                body += f"\n\n---\n\n<!-- {extra} -->\n\n" + strip_yaml_frontmatter(extra_content)

        prompt_file = f"rig-{skill_name}.md"
        path = write_prompt(prompt_file, body.rstrip() + "\n")
        written.append(path)
        prompt_names.append(f"rig-{skill_name}")
        print(f"  [skill] {path}")

    # 3. Write settings.json with agent config
    os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)
    settings = {
        "assistant": {
            "default_model": {
                "provider": "anthropic",
                "model": "claude-sonnet-4-20250514"
            },
            "version": "2"
        },
        "context_servers": {},
        "language_models": {
            "anthropic": {
                "version": "1"
            }
        }
    }
    with open(SETTINGS_PATH, "w", encoding="utf-8") as f:
        json.dump(settings, f, indent=2)
        f.write("\n")
    written.append(SETTINGS_PATH)
    print(f"  [settings] {SETTINGS_PATH}")

    print(f"\nZed projection complete: {len(written)} files written.")
    print(f"  Prompts: {len(prompt_names)} files in {PROMPTS_DIR}")
    print(f"  Settings: {SETTINGS_PATH}")
    return written


if __name__ == "__main__":
    main()
