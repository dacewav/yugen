#!/usr/bin/env node
/**
 * postinstall: patch @sveltejs/adapter-cloudflare to externalize ALL Node built-ins.
 * Required because firebase-admin depends on http, https, net, tls, url, etc.
 * that aren't in the adapter's default compatible_node_modules list.
 *
 * Also externalizes react/react-dom (required by Resend SDK).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// Find the adapter index.js
const possiblePaths = [
  'node_modules/@sveltejs/adapter-cloudflare/index.js',
  'node_modules/@sveltejs/adapter-cloudflare/dist/index.js',
];

let adapterPath;
for (const p of possiblePaths) {
  const full = resolve(process.cwd(), p);
  if (existsSync(full)) {
    adapterPath = full;
    break;
  }
}

if (!adapterPath) {
  console.warn('[patch-cf-adapter] adapter-cloudflare not found, skipping');
  process.exit(0);
}

let content = readFileSync(adapterPath, 'utf8');

// 1. Extend compatible_node_modules with ALL Node built-ins
const builtins = [
  'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console',
  'constants', 'crypto', 'dgram', 'diagnostics_channel', 'dns', 'domain',
  'events', 'fs', 'http', 'http2', 'https', 'inspector', 'module', 'net',
  'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring',
  'readline', 'repl', 'stream', 'string_decoder', 'sys', 'timers',
  'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm',
  'wasi', 'worker_threads', 'zlib',
];

const oldModuleList = `const compatible_node_modules = [
\t'assert',
\t'async_hooks',
\t'buffer',
\t'crypto',
\t'diagnostics_channel',
\t'events',
\t'path',
\t'process',
\t'stream',
\t'string_decoder',
\t'util'
];`;

const newModuleList = `const compatible_node_modules = ${JSON.stringify(builtins, null, '\t')};`;

if (content.includes(oldModuleList)) {
  content = content.replace(oldModuleList, newModuleList);
  console.log('[patch-cf-adapter] Extended compatible_node_modules with', builtins.length, 'entries');
} else if (content.includes(newModuleList)) {
  console.log('[patch-cf-adapter] compatible_node_modules already patched');
} else {
  console.warn('[patch-cf-adapter] Could not find module list to patch — adapter may have changed');
}

// 2. Add react/react-dom to externals
const oldExternal = "const external = ['cloudflare:*', ...compatible_node_modules.map((id) => `node:${id}`)];";
const newExternal = "const external = ['cloudflare:*', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/server', ...compatible_node_modules.map((id) => `node:${id}`)];";

if (content.includes(oldExternal)) {
  content = content.replace(oldExternal, newExternal);
  console.log('[patch-cf-adapter] Added react/react-dom to externals');
} else if (content.includes("'react'")) {
  console.log('[patch-cf-adapter] React externals already patched');
} else {
  console.warn('[patch-cf-adapter] Could not find external list to patch');
}

writeFileSync(adapterPath, content);
console.log('[patch-cf-adapter] Done');
