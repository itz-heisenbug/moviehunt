#!/usr/bin/env node
/**
 * MovieHunt Launcher
 * Starts the Vite dev server and opens the browser automatically.
 * Compiled to .exe with `pkg`.
 */

const { spawn, exec } = require('child_process')
const path = require('path')
const http = require('http')

// When running as a pkg .exe, process.execPath is the .exe itself
// so dirname gives us the folder the .exe lives in (project root)
const projectDir = path.dirname(process.execPath)
const PORT = 5173
const URL  = `http://localhost:${PORT}`

// ── ASCII banner ─────────────────────────────────────────────
console.log('\n')
console.log('  ╔═══════════════════════════════════╗')
console.log('  ║   🎬  MovieHunt  Dev  Server  🎬   ║')
console.log('  ╚═══════════════════════════════════╝')
console.log(`\n  📁  Project : ${projectDir}`)
console.log(`  🌐  URL     : ${URL}\n`)

// ── Start Vite dev server ─────────────────────────────────────
const server = spawn('cmd', ['/c', 'npm run dev'], {
  cwd: projectDir,
  stdio: 'inherit',
  shell: false,
})

server.on('error', err => {
  console.error('\n  ❌ Failed to start server:', err.message)
  console.error('  Make sure Node.js and npm are installed.\n')
  process.exit(1)
})

server.on('close', code => {
  console.log(`\n  ✋ Server stopped (code ${code}).`)
  process.exit(code ?? 0)
})

// ── Wait for server then open browser ─────────────────────────
function tryOpen(retries = 20, delay = 500) {
  http.get(URL, res => {
    if (res.statusCode === 200 || res.statusCode === 304) {
      console.log(`\n  ✅ Server is up! Opening browser...\n`)
      exec(`start "" "${URL}"`)
    } else {
      retry(retries, delay)
    }
  }).on('error', () => {
    retry(retries, delay)
  })
}

function retry(retries, delay) {
  if (retries <= 0) {
    console.log(`\n  ⚠️  Could not confirm server start. Opening browser anyway...`)
    exec(`start "" "${URL}"`)
    return
  }
  setTimeout(() => tryOpen(retries - 1, delay), delay)
}

// Give Vite a moment to begin spawning, then poll
setTimeout(() => tryOpen(), 1500)

// ── Keep process alive (server is a child) ────────────────────
process.on('SIGINT',  () => { server.kill(); process.exit(0) })
process.on('SIGTERM', () => { server.kill(); process.exit(0) })
