#!/usr/bin/env python3
"""
Rig → Cursor projection script.

Reads the canonical Rig corpus (skills, routing, rules) and produces
.cursor/rules/*.mdc files with the correct YAML frontmatter.

- The routing + rules are merged into a single always-on rule file.
- Each skill becomes its own .mdc file with alwaysApply: false.
- Any additional files inside a skill directory (e.g. playbook.md) are
  appended to that skill's .mdc output.

General: discovers skills dynamically from the corpus directory.
"""

import os
import sys
import re
import glob

# --- Configuration -----------------------------------------------------------

RIG_BASE = os.path.expanduser("~/projects/Rig/rig/tier-1")
SKILLS_DIR = os.path.join(RIG_BASE, "skills")
ROUTING_FILE = os.path.join(RIG_BASE, "routing.md")
RULES_DIR = os.path.join(RIG_BASE, "rules")
OUTPUT_DIR = os.path.join(
    os.environ.get("RIG_OUTPUT_DIR", "/tmp/rig-projection-script-test/output/cursor"),
    ".cursor", "rules"
)

# --- Helpers -----------------------------------------------------------------

def read_file(path):
    """Read a file and return its content."""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_mdc(filename, description, always_apply, body, globs=""):
    """Write a .mdc file with Cursor YAML frontmatter."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, filename)
    frontmatter = f"---\ndescription: {description}\nglobs: {globs}\nalwaysApply: {'true' if always_apply else 'false'}\n---\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(frontmatter + body)
    return path


def extract_yaml_field(content, field):
    """Extract a field value from YAML frontmatter in a SKILL.md."""
    match = re.search(rf'^{field}:\s*(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    # Handle multi-line description with >
    match = re.search(rf'^{field}:\s*>\s*\n((?:\s+.+\n?)+)', content, re.MULTILINE)
    if match:
        lines = match.group(1).strip().split('\n')
        return ' '.join(line.strip() for line in lines)
    return None


def strip_yaml_frontmatter(content):
    """Remove YAML frontmatter from markdown content."""
    match = re.match(r'^---\s*\n.*?\n---\s*\n', content, re.DOTALL)
    if match:
        return content[match.end():]
    return content


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

    # 1. Build the routing + rules file (alwaysApply: true)
    routing_content = read_file(ROUTING_FILE)
    rule_files = sorted(glob.glob(os.path.join(RULES_DIR, "*.md")))
    rules_body = ""
    for rf in rule_files:
        rules_body += "\n\n" + read_file(rf)

    combined_body = routing_content.rstrip() + "\n" + rules_body.rstrip() + "\n"
    path = write_mdc(
        "rig-routing.mdc",
        "Rig task routing and curated engineering workflow.",
        always_apply=True,
        body=combined_body
    )
    written.append(path)
    print(f"  [routing+rules] {path}")

    # 2. Project each skill (alwaysApply: false)
    skills = discover_skills()
    for skill_name, skill_dir, skill_file in skills:
        content = read_file(skill_file)
        description = extract_yaml_field(content, "description") or f"Rig {skill_name} skill."
        # Remove surrounding quotes if present
        description = description.strip('"').strip("'")
        body = strip_yaml_frontmatter(content)

        # Check for additional files in the skill directory
        for extra in sorted(os.listdir(skill_dir)):
            extra_path = os.path.join(skill_dir, extra)
            if extra != "SKILL.md" and os.path.isfile(extra_path) and extra.endswith(".md"):
                extra_content = read_file(extra_path)
                body += f"\n\n---\n\n<!-- {extra} -->\n\n" + strip_yaml_frontmatter(extra_content)

        mdc_name = f"rig-{skill_name}.mdc"
        path = write_mdc(
            mdc_name,
            description,
            always_apply=False,
            body=body.rstrip() + "\n"
        )
        written.append(path)
        print(f"  [skill] {path}")

    print(f"\nCursor projection complete: {len(written)} files written.")
    return written


if __name__ == "__main__":
    main()
