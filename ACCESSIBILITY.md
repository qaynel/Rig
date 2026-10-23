# Accessibility

## Commitment

Rig should be usable by people who rely on assistive technology, a keyboard,
or a terminal. Barriers in the documentation, installer, and command-line
tooling are bugs.

This project does not claim a WCAG conformance level. It has not had a formal
accessibility audit.

## Supported environments

- Documentation is Markdown, read on GitHub or in a text editor.
- The installer expects a POSIX shell with Git, Node.js, `curl`, and `tar`.
  See the [installation guide](docs/install.md).
- macOS and Linux are the environments described by the docs.
- Rig does not ship a graphical application.

## Known limitations

- Diagrams and screenshots may not have a complete text alternative.
- Terminal behavior depends on the terminal and screen reader in use.
- The catalogue is long-form Markdown and has not been reviewed as a set for
  heading structure or reading order.
- Environments outside the installation guide, including native Windows
  without a POSIX shell, are untested.

## Reporting a barrier

Open an [accessibility issue](https://github.com/qaynel/Rig/issues/new/choose)
and include:

- what you were trying to do
- what got in the way
- your operating system
- the assistive technology and version, if you use one

You do not need to disclose a disability.
