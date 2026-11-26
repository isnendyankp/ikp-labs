// Copies the Linux-x64 native binaries for lightningcss and @tailwindcss/oxide
// into the location their JS loaders expect. On a plain `npm install`, npm's
// optional-dependency platform resolution does not reliably surface these
// binaries when the package sits inside an npm-workspaces monorepo member
// (apps/kameravue-fe) — confirmed failing the same way on a fresh Vercel
// build and a fresh DigitalOcean Droplet clone. Declaring the two Linux
// packages as explicit optionalDependencies on this package guarantees npm
// installs them on Linux; this script then places the compiled .node file
// where lightningcss/@tailwindcss/oxide look for it. No-ops on any other
// platform, and never throws — a missing binary here should not fail the
// install, since the only consumers (Next.js dev/build) will surface their
// own clear error if something is still missing.

if (process.platform !== 'linux') {
  process.exit(0);
}

const fs = require('fs');
const path = require('path');

function resolveNodeModules(startDir) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, 'node_modules');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const nodeModules = resolveNodeModules(__dirname);
if (!nodeModules) {
  process.exit(0);
}

const copies = [
  {
    src: path.join(
      nodeModules,
      'lightningcss-linux-x64-gnu',
      'lightningcss.linux-x64-gnu.node'
    ),
    dest: path.join(
      nodeModules,
      'lightningcss',
      'node',
      'lightningcss.linux-x64-gnu.node'
    ),
  },
  {
    src: path.join(
      nodeModules,
      '@tailwindcss',
      'oxide-linux-x64-gnu',
      'tailwindcss-oxide.linux-x64-gnu.node'
    ),
    dest: path.join(
      nodeModules,
      '@tailwindcss',
      'oxide',
      'tailwindcss-oxide.linux-x64-gnu.node'
    ),
  },
];

for (const { src, dest } of copies) {
  try {
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  } catch {
    // Best-effort only — see file header.
  }
}
