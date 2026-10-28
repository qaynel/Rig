'use strict';

// Deterministic-first model routing. Mechanical work never reaches a model.
// Other work starts on the cheapest available model and escalates at most once.

const fs = require('fs');
const path = require('path');
const { acquireLock } = require('../../lib/apply');

/* Budget consumption ported from NousResearch/hermes-agent, MIT:
 * https://github.com/NousResearch/hermes-agent/blob/748c79a1c6873124d84071cdabb4062a75913e1f/agent/iteration_budget.py
 * Component: IterationBudget.consume. Keep: locked check-and-consume before an
 * attempt. Adapt: durable spend-unit reservation across processes. Discard:
 * Python threads, refund and per-agent runtime. Unknown/failed calls stay charged.
 * Copyright (c) 2025 Nous Research
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const PRICE = { cheap: 0, expensive: 1 };
const CAPABILITY = { mechanical: 0, judgement: 1 };

const file = (repo, name) => path.join(repo, '.rig', name);

function readJson(f, fallback) {
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fallback;
}

function record(repo, entry) {
  fs.mkdirSync(path.join(repo, '.rig'), { recursive: true });
  fs.appendFileSync(file(repo, 'model-routing-log.jsonl'), `${JSON.stringify(entry)}\n`);
  return entry;
}

function log(repo) {
  const f = file(repo, 'model-routing-log.jsonl');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

// Cheapest first, then least capable, so ties go to the smaller model.
function ladder(inventory) {
  return inventory.models
    .filter((m) => m.available === true)
    .sort((a, b) => PRICE[a.price_class] - PRICE[b.price_class] || CAPABILITY[a.capability] - CAPABILITY[b.capability]);
}

// Reserve before dispatch; failed and unknown-cost attempts keep their charge.
function attempt(repo, task, provider, model, max, number) {
  // rig: one spend unit per call unless the host declares a larger bound; this
  // is a call budget, not a currency estimate. Unknown cost never refunds it.
  const units = model.max_spend_units ?? 1;
  let lock;
  try {
    if (!Number.isFinite(units) || units <= 0) throw new Error('model has no valid spend bound');
    lock = acquireLock(repo, 'model-budget');
    const spend = readJson(file(repo, 'spend.json'), { used_units: 0 });
    if (!Number.isFinite(spend.used_units) || spend.used_units < 0) throw new Error('recorded spend is invalid; repair spend.json');
    if (spend.used_units + units > max) throw new Error(`spend cap reached (${spend.used_units} of ${max} units)`);
    const tmp = file(repo, `spend.json.${process.pid}.tmp`);
    fs.writeFileSync(tmp, JSON.stringify({ used_units: spend.used_units + units }));
    fs.renameSync(tmp, file(repo, 'spend.json'));
  } catch (err) {
    const reason = err.message;
    record(repo, { task: task.task, model: model.id, blocked: true, reason, cost: 'unknown' });
    return { blocked: true, reason };
  } finally { if (lock) fs.unlinkSync(lock); }
  let result, failure;
  try {
    result = provider(model.id, { max_spend_units: units });
    if (result && typeof result.then === 'function') {
      result.catch(() => {});
      throw new Error('asynchronous provider needs a bounded synchronous executor');
    }
    if (result && (result.ok === false || result.status === 'fail')) throw new Error('provider returned failed evidence');
  } catch (err) {
    failure = String((err && err.message) || err);
  }
  const cost = result && Number.isFinite(result.cost) && result.cost >= 0 ? result.cost : 'unknown';
  record(repo, { task: task.task, model: model.id, attempt: number, reserved_units: units, cost, status: failure ? 'fail' : 'pass', reason: failure });
  return { failure };
}

function run(repo, task, { provider }) {
  if (task.kind === 'mechanical') {
    record(repo, { task: task.task, mechanism: 'deterministic', reason: 'mechanical task, no model call' });
    return { mechanism: 'deterministic' };
  }

  let inventory;
  try { inventory = readJson(file(repo, 'model-inventory.json'), null); } catch { inventory = null; }
  const max = inventory?.budget?.max_spend_units;
  if (!inventory || !Array.isArray(inventory.models) || !Number.isFinite(max) || max < 0
    || inventory.models.some((m) => !m || typeof m.id !== 'string' || !Object.hasOwn(PRICE, m.price_class) || !Object.hasOwn(CAPABILITY, m.capability))) {
    const reason = 'model inventory or budget missing/invalid; configure .rig/model-inventory.json before model work';
    record(repo, { task: task.task, blocked: true, reason, cost: 'unknown' });
    return { blocked: true, reason };
  }

  const models = ladder(inventory);
  const stop = (reason) => {
    record(repo, { task: task.task, mechanism: 'model', stop_reason: reason });
    return { stopped: true, reason };
  };
  if (models.length === 0) return stop('no available model');

  const [first] = models;
  // Cheap attempt first even for high risk (PT-027). High risk always escalates to judgement, so a cheap answer is never final.
  const needsJudgement = task.risk === 'high' && first.capability !== 'judgement';
  if (needsJudgement && !models.some((m) => m.capability === 'judgement')) {
    return stop('high risk needs a judgement model, none available');
  }

  const initial = attempt(repo, task, provider, first, max, 1);
  if (initial.blocked) return initial;
  const { failure } = initial;
  if (!failure && !needsJudgement) {
    const reason = `${first.capability} need met by cheapest available model`;
    record(repo, { task: task.task, model: first.id, capability: first.capability, price_class: first.price_class, reason, mechanism: 'model' });
    return { model: first.id, mechanism: 'model', reason };
  }

  const why = failure ? `${first.id} failed: ${failure}` : `high risk requires judgement, ${first.id} is ${first.capability}`;
  const next = models.find((m) => CAPABILITY[m.capability] > CAPABILITY[first.capability]);
  if (!next) return stop(`${why}; no more capable model available`);

  const second = attempt(repo, task, provider, next, max, 2);
  if (second.blocked) return second;
  if (second.failure) return stop(`${why}; ${next.id} failed: ${second.failure}`);

  const reason = `${why}; escalated to ${next.id}`;
  record(repo, { task: task.task, model: next.id, capability: next.capability, price_class: next.price_class, reason, mechanism: 'model', escalation_reason: why });
  return { escalated: true, reason };
}

module.exports = { run, log };
