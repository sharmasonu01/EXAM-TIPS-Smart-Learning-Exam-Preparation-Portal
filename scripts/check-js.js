import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function collectJsFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const filesToCheck = [
  'server.js',
  'vite.config.js',
  ...collectJsFiles('src'),
].filter((f) => fs.existsSync(f));

let failed = false;
for (const file of filesToCheck) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    failed = true;
    console.error(`Syntax error in ${file}:`);
    console.error(err.stderr?.toString() || err.message);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Checked ${filesToCheck.length} JavaScript files — zero syntax errors.`);
