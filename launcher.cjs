#!/usr/bin/env node
/**
 * MovieHunt Launcher  (CommonJS – compiled to .exe with pkg)
 * Starts the Vite dev server and opens the browser automatically.
 */

'use strict'

const { spawn, exec } = require('child_process')
const path  = require('path')
const http  = require('http')

// When running as a pkg .exe, process.execPath is the .exe path itself.
// dirname gives us the folder the .exe lives in (= project root).
const projectDir = path.dirname(process.execPath)
const PORT = 5173
const URL  = `http://localhost:${PORT}`

/* ── Banner ─────────────────────────────────────────────────── */
console.log('\n')
console.log('  ╔═══════════════════════════════════╗')
console.log('  ║   🎬  MovieHunt  Dev  Server  🎬   ║')
console.log('  ╚═══════════════════════════════════╝')
console.log(`\n  📁  Project : ${projectDir}`)
console.log(`  🌐  URL     : ${URL}`)
console.log('  ⏹   Press Ctrl+C to stop\n')

/* ── Spawn Vite dev server ──────────────────────────────────── */
const server = spawn('cmd', ['/c', 'npm run dev'], {
  cwd: projectDir,
  stdio: 'inherit',
  shell: false,
})

server.on('error', err => {
  console.error('\n  ❌ Failed to start server:', err.message)
  console.error('     Make sure Node.js and npm are installed and in PATH.\n')
  process.exit(1)
})

server.on('close', code => {
  console.log(`\n  ✋ Server stopped (exit code ${code}).`)
  process.exit(code != null ? code : 0)
})

/* ── Poll until Vite is ready, then open browser ───────────── */
function tryOpen(retriesLeft, delay) {
  if (retriesLeft == null) retriesLeft = 24
  if (delay == null) delay = 500

  const req = http.get(URL, res => {
    // Vite responds 200 on the root when ready
    console.log(`\n  ✅ Server ready!  Opening ${URL} ...\n`)
    exec(`start "" "${URL}"`)
    req.destroy()
  })

  req.on('error', () => {
    if (retriesLeft <= 0) {
      console.log('\n  ⚠️  Server taking longer than expected – opening browser anyway.')
      exec(`start "" "${URL}"`)
      return
    }
    setTimeout(() => tryOpen(retriesLeft - 1, delay), delay)
  })

  req.end()
}

// Give Vite ~1 s to start the child process before we begin polling
setTimeout(() => tryOpen(), 1000)

/* ── Graceful shutdown ──────────────────────────────────────── */
process.on('SIGINT',  () => { server.kill('SIGINT');  process.exit(0) })
process.on('SIGTERM', () => { server.kill('SIGTERM'); process.exit(0) })
