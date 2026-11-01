'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { containedPath } = require('../../lib/path-safety');

const TOOLS = {
  javascript: { dependency: '@stryker-mutator/core', bin: 'stryker', label: 'Stryker' },
  typescript: { dependency: '@stryker-mutator/core', bin: 'stryker', label: 'Stryker' },
  python: { dependency: 'mutmut', bin: 'mutmut', label: 'mutmut' },
  java: { dependency: 'pitest', bin: 'pitest', label: 'PIT' },
  kotlin: { dependency: 'pitest', bin: 'pitest', label: 'PIT' },
};
const FLOOR = 0.70;

function packageHas(repo, dependency) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
    return ['dependencies', 'devDependencies', 'optionalDependencies'].some((key) => Object.hasOwn(pkg[key] || {}, dependency));
  } catch { return false; }
}

function configured(repo, language, tool) {
  if (language === 'javascript' || language === 'typescript') return packageHas(repo, tool.dependency);
  const files = language === 'python'
    ? ['pyproject.toml', 'requirements.txt', 'requirements-dev.txt', 'Pipfile', 'setup.cfg']
    : ['pom.xml', 'build.gradle', 'build.gradle.kts'];
  return files.some((name) => {
    try { return new RegExp(language === 'python' ? '\\bmutmut\\b' : 'pitest|pitest-maven', 'i').test(fs.readFileSync(path.join(repo, name), 'utf8')); }
    catch { return false; }
  });
}

function normaliseFiles(repo, files) {
  if (!Array.isArray(files) || !files.length) throw new Error('changedFiles must contain at least one repository file');
  return files.map((file) => {
    if (typeof file !== 'string' || !file || path.isAbsolute(file) || file.split(/[\\/]/).includes('..')) throw new Error('changedFiles contains an unsafe path');
    const absolute = containedPath(repo, file);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) throw new Error(`changed file does not exist: ${file}`);
    return file.replaceAll('\\', '/');
  });
}

function scoreStryker(repo, files, tool) {
  const bin = path.join(repo, 'node_modules/.bin', tool.bin);
  if (!fs.existsSync(bin)) return null;
  const reportPaths = [path.join(repo, 'reports/mutation/mutation.json'), path.join(repo, 'mutation.json')];
  const before = reportPaths.map((file) => {
    try { const stat = fs.statSync(file); return { file, mtimeMs: stat.mtimeMs, size: stat.size, digest: require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex') }; }
    catch { return { file, absent: true }; }
  });
  const result = spawnSync(bin, ['run', `--mutate=${files.join(',')}`, '--reporters=json'], { cwd: repo, encoding: 'utf8', timeout: 15 * 60 * 1000, maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) return { score: null, error: result.error?.message || result.stderr || `mutation command exited ${result.status}` };
  try {
    const summary = JSON.parse(result.stdout.trim());
    if (Number.isInteger(summary.killed) && Number.isInteger(summary.total) && summary.total > 0 && summary.killed >= 0 && summary.killed <= summary.total) return { score: summary.killed / summary.total };
  } catch { /* Stryker's JSON reporter writes a report file. */ }
  let report;
  for (const [index, candidate] of reportPaths.entries()) {
    try {
      const stat = fs.statSync(candidate);
      const digest = require('node:crypto').createHash('sha256').update(fs.readFileSync(candidate)).digest('hex');
      const prior = before[index];
      if (!prior.absent && prior.mtimeMs === stat.mtimeMs && prior.size === stat.size && prior.digest === digest) continue;
      report = JSON.parse(fs.readFileSync(candidate, 'utf8')); break;
    } catch { /* try next report location */ }
  }
  if (!report) return { score: null, error: 'mutation tool did not produce a fresh JSON report' };
  const normalized = (name) => {
    let value = String(name).replace(/^file:\/\//, '');
    try { value = decodeURIComponent(value); } catch { /* leave malformed report paths unmatched */ }
    const absolute = path.resolve(repo, value);
    const relative = path.relative(repo, absolute);
    return relative.startsWith('..') || path.isAbsolute(relative) ? null : relative.split(path.sep).join('/').replace(/^\.\//, '');
  };
  const byPath = new Map(Object.entries(report.files || {}).map(([name, value]) => [normalized(name), value]));
  const statuses = [];
  for (const file of files) {
    const scoped = byPath.get(file);
    if (!scoped) return { score: null, error: `mutation tool reported no per-file results for changed file ${file}` };
    const rows = (scoped.mutants || []).map((mutant) => typeof mutant === 'string' ? mutant : mutant.status);
    if (!rows.length) return { score: null, error: `mutation tool reported no mutants for changed file ${file}` };
    statuses.push(...rows);
  }
  const total = statuses.filter((status) => ['Killed', 'Survived', 'NoCoverage', 'Timeout', 'CompileError', 'RuntimeError'].includes(status)).length;
  if (!total) return { score: null, error: 'mutation tool reported no mutants for the changed files' };
  const killed = statuses.filter((status) => status === 'Killed').length;
  return { score: killed / total };
}

function executable(repo, name, candidates = []) {
  for (const candidate of candidates) {
    const file = path.join(repo, candidate);
    try { if (fs.statSync(file).isFile()) return file; } catch { /* try next */ }
  }
  const result = spawnSync(name, ['--version'], { cwd: repo, encoding: 'utf8', timeout: 10_000 });
  return !result.error && result.status === 0 ? name : null;
}

function scoreMutmut(repo, files, tool) {
  const bin = executable(repo, tool.bin, ['.venv/bin/mutmut', 'venv/bin/mutmut', 'bin/mutmut']);
  if (!bin) return null;
  const modules = files.map((file) => file.replace(/\\/g, '/').replace(/\.py$/i, '').replaceAll('/', '.'));
  // mutmut's CI export aggregates its whole cache. Run each changed module against an empty cache,
  // consume its per-file metadata, then restore the user's original cache byte-for-byte.
  const names = ['mutants', ...fs.readdirSync(repo).filter((name) => name.startsWith('.mutmut-cache'))];
  for (const name of names) {
    try { if (fs.lstatSync(path.join(repo, name)).isSymbolicLink()) return { error: `refusing symlinked mutmut cache: ${name}` }; }
    catch (error) { if (error.code !== 'ENOENT') return { error: `cannot inspect mutmut cache ${name}: ${error.message}` }; }
  }
  const backup = fs.mkdtempSync(path.join(repo, '.rig-mutmut-cache-'));
  const saved = [];
  let isolated = false;
  const clearGenerated = () => { for (const name of isolated ? names : saved) fs.rmSync(path.join(repo, name), { recursive: true, force: true }); };
  try {
    for (const name of names) {
      const original = path.join(repo, name);
      try { fs.lstatSync(original); } catch { continue; }
      fs.renameSync(original, path.join(backup, name)); saved.push(name);
    }
    isolated = true;
    let killed = 0, total = 0;
    for (let index = 0; index < files.length; index++) {
      clearGenerated();
      const file = files[index];
      const run = spawnSync(bin, ['run', modules[index]], { cwd: repo, encoding: 'utf8', timeout: 15 * 60 * 1000, maxBuffer: 8 * 1024 * 1024 });
      if (run.error || run.status !== 0) return { error: run.error?.message || run.stderr || `mutmut exited ${run.status}` };
      const metadata = path.join(repo, 'mutants', `${file}.meta`);
      const mutantSource = path.join(repo, 'mutants', file);
      let data;
      try {
        if (fs.lstatSync(metadata).isSymbolicLink() || fs.lstatSync(mutantSource).isSymbolicLink()) throw new Error('symlink report refused');
        data = JSON.parse(fs.readFileSync(metadata, 'utf8'));
        if (fs.statSync(mutantSource).mtimeMs < fs.statSync(path.join(repo, file)).mtimeMs) throw new Error('stale mutant source');
      } catch (error) { return { error: `mutmut produced no fresh per-file report for ${file}: ${error.message}` }; }
      const statuses = data.exit_code_by_key;
      if (!statuses || typeof statuses !== 'object' || !Object.keys(statuses).length) return { error: `mutmut report has no mutants for ${file}` };
      for (const code of Object.values(statuses)) {
        if (code === null || code === 2 || ![0, 1, 3, 5, 24, 34, 35, 36, 152, 255, -24, -11, -9].includes(code)) return { error: `mutmut report is incomplete or contains an unsupported status for ${file}` };
        if (code === 34) continue;
        total++;
        if ([1, 3, 24, 36, 152, 255, -24].includes(code)) killed++;
      }
    }
    return total ? { score: killed / total } : { error: 'mutmut reported no scored mutants for the changed files' };
  } finally {
    clearGenerated();
    for (const name of saved) fs.renameSync(path.join(backup, name), path.join(repo, name));
    fs.rmSync(backup, { recursive: true, force: true });
  }
}

function xmlMutations(xml) {
  const rows = [...xml.matchAll(/<mutation\b([^>]*)\/?\s*>/gi)];
  let killed = 0, total = 0;
  for (const [, attrs] of rows) {
    const status = attrs.match(/\bstatus=["']([^"']+)["']/i)?.[1]?.toUpperCase();
    const detected = attrs.match(/\bdetected=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (!status && detected === undefined) continue;
    total++;
    if (status === 'KILLED' || detected === 'true') killed++;
  }
  return total ? { score: killed / total } : { error: 'PIT XML report contains no mutation records' };
}

function scorePit(repo, files, tool, language) {
  const maven = fs.existsSync(path.join(repo, 'pom.xml'));
  const gradle = ['build.gradle', 'build.gradle.kts'].find((f) => fs.existsSync(path.join(repo, f)));
  const launcher = maven
    ? executable(repo, 'mvn', ['mvnw'])
    : gradle ? executable(repo, process.platform === 'win32' ? 'gradlew.bat' : './gradlew', ['gradlew']) : null;
  if (!launcher) return null;
  const classes = files.flatMap((file) => {
    const source = fs.readFileSync(path.join(repo, file), 'utf8');
    const pkg = source.match(/^\s*package\s+([\w.]+)\s*;?/m)?.[1];
    const base = path.basename(file).replace(/\.(?:java|kt)$/i, '');
    const declarations = [...source.matchAll(/^\s*(?:(?:public|protected|private|internal|abstract|final|open|sealed|data|enum|annotation|value|static|expect|actual|companion|inner)\s+)*(?:class|interface|enum(?:\s+class)?|record|object)\s+([A-Za-z_$][\w$]*)/gm)].map((match) => match[1]);
    const names = [...new Set(declarations.length ? declarations : [language === 'kotlin' ? `${base}Kt` : base])];
    return names.flatMap((name) => [`${pkg ? `${pkg}.` : ''}${name}`, `${pkg ? `${pkg}.` : ''}${name}$*`]);
  });
  const reports = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'rig-pit-'));
  const args = maven
    ? ['-q', 'test-compile', 'org.pitest:pitest-maven:mutationCoverage', '-DoutputFormats=XML', `-DreportsDirectory=${reports}`, '-DtimestampedReports=false', `-DtargetClasses=${classes.join(',')}`]
    : ['pitest', `-Doverride.pitest.targetClasses=${classes.join(',')}`, '-Doverride.pitest.outputFormats=XML', `-Doverride.pitest.reportDir=${reports}`, '-Doverride.pitest.timestampedReports=false'];
  // The report lives in a fresh external temp directory, so a stale project report cannot pass.
  const result = spawnSync(launcher, args, { cwd: repo, encoding: 'utf8', timeout: 15 * 60 * 1000, maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) { fs.rmSync(reports, { recursive: true, force: true }); return { error: result.error?.message || result.stderr || `PIT exited ${result.status}` }; }
  const found = [];
  const walk = (dir) => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, entry.name); if (entry.isDirectory()) walk(p); else if (entry.name === 'mutations.xml') found.push(p); } };
  walk(reports);
  if (!found.length) { fs.rmSync(reports, { recursive: true, force: true }); return { error: 'PIT did not produce a fresh XML mutation report' }; }
  const measured = xmlMutations(found.map((file) => fs.readFileSync(file, 'utf8')).join('\n'));
  fs.rmSync(reports, { recursive: true, force: true });
  return measured;
}

function measure({ repo, changedFiles, language }) {
  if (typeof repo !== 'string' || !fs.existsSync(repo) || !fs.statSync(repo).isDirectory()) throw new Error('repo must be an existing directory');
  if (typeof language !== 'string' || !language) throw new Error('language is required');
  const lang = language.toLowerCase();
  const tool = TOOLS[lang];
  if (!tool || !configured(repo, lang, tool)) return { language: lang, tool: null, score: null, floor: FLOOR, ok: false, gap: `no mutation tool for ${lang}; install ${tool?.label || 'a supported mutation tool'} to measure` };
  const files = normaliseFiles(repo, changedFiles);
  if (!fs.existsSync(path.join(repo, 'node_modules/.bin', tool.bin)) && (lang === 'javascript' || lang === 'typescript')) {
    return { language: lang, tool: null, score: null, floor: FLOOR, ok: false, gap: `no mutation tool for ${lang}; install ${tool.label} to measure` };
  }
  const measured = tool.bin === 'stryker' ? scoreStryker(repo, files, tool)
    : lang === 'python' ? scoreMutmut(repo, files, tool)
      : scorePit(repo, files, tool, lang);
  if (!measured) return { language: lang, tool: tool.label, score: null, floor: FLOOR, ok: false, gap: `${tool.label} measurement is not configured for ${lang}; configure the repository tool to measure` };
  if (measured.error) return { language: lang, tool: tool.label, score: null, floor: FLOOR, ok: false, gap: `${tool.label} could not measure changed files: ${measured.error}` };
  return { language: lang, tool: tool.label, score: measured.score, floor: FLOOR, ok: measured.score >= FLOOR, gap: null };
}

module.exports = { measure, FLOOR };
