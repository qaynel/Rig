#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {verifyTestEvidence}=require('../rig/lib/ai-sdlc');
const root=path.resolve(__dirname,'..');
function option(name,fallback) {const i=process.argv.indexOf(name); return i < 0 ? fallback : process.argv[i+1];}
const target=path.resolve(option('--root',root));
const board=path.resolve(option('--board',path.join(target,'wiki/Tickets.md')));
const tickets=path.resolve(option('--tickets',path.join(target,'wiki/tickets')));
let completed=false;
const references=new Map(), failures=[], ticketReferences=new Map(), processedTickets=new Set();
let manualCount=0;
try {
  for (const line of fs.readFileSync(board,'utf8').split(/\r?\n/)) {
    const heading=line.match(/^## (.+)$/);
    if (heading) {completed=['Done','Ready for Commit'].includes(heading[1].trim()); continue;}
    if (!completed) continue;
    const link=line.match(/\[Solution\]\(([^)]+)\)/i);
    if (!link) continue;
    const file=path.join(tickets,path.basename(link[1]));
    if (processedTickets.has(file)) continue;
    processedTickets.add(file);
    ticketReferences.set(file,[]);
    const text=fs.readFileSync(file,'utf8');
    const section=text.match(/^## Acceptance(?:\s*\([^)]*\))?\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1];
    if (!section) {failures.push(`${path.basename(file)}: missing acceptance`);continue;}
    const bullets=section.match(/^\s{0,3}[-*]\s+.*(?:\n(?!\s{0,3}[-*]\s|##)[^\n]*)*/gm)||[];
    for (const bullet of bullets) {
      const m=bullet.trim().match(/→\s*`?(tests\/[A-Za-z0-9._/-]+\.test\.js)::([^`\n]+?)`?\s*$/);
      if (!m) {
        if (/→\s*`?manual:\s*\S/i.test(bullet)) {manualCount++;continue;}
        failures.push(`${path.basename(file)}: acceptance has no evidence reference`);continue;
      }
      ticketReferences.get(file).push(`${m[1]}\0${m[2].trim()}`);
      references.set(`${m[1]}\0${m[2].trim()}`,{file:m[1],title:m[2].trim()});
    }
  }
  const passed=new Set();
  for (const [key,reference] of references) {
    const result=verifyTestEvidence(target,reference);
    if (result.status === 'passed') passed.add(key);
    else failures.push(`${reference.file}::${reference.title}: ${result.status}`);
  }
  for (const [file,keys] of ticketReferences) {
    if (!keys.some(key=>passed.has(key))) failures.push(`${path.basename(file)}: completed ticket has no passing executable proving test`);
  }
} catch(error) {failures.push(error.message);}
for (const failure of failures) console.error(failure);
console.log(`Executed proving-test references: ${references.size}; failures: ${failures.length}. Historical manual guidance: ${manualCount}; manual evidence does not prove behavior. Reference hygiene is checked separately.`);
process.exitCode=failures.length?1:0;
