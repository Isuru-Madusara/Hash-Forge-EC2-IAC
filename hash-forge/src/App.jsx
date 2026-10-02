import { useMemo, useState } from 'react'
import CryptoJS from 'crypto-js'

const ALGORITHMS = [
  { id: 'md5', label: 'MD5', bits: 128, fn: (v) => CryptoJS.MD5(v) },
  { id: 'sha1', label: 'SHA-1', bits: 160, fn: (v) => CryptoJS.SHA1(v) },
  { id: 'sha224', label: 'SHA-224', bits: 224, fn: (v) => CryptoJS.SHA224(v) },
  { id: 'sha256', label: 'SHA-256', bits: 256, fn: (v) => CryptoJS.SHA256(v) },
  { id: 'sha384', label: 'SHA-384', bits: 384, fn: (v) => CryptoJS.SHA384(v) },
  { id: 'sha512', label: 'SHA-512', bits: 512, fn: (v) => CryptoJS.SHA512(v) },
  { id: 'sha3', label: 'SHA3-256', bits: 256, fn: (v) => CryptoJS.SHA3(v, { outputLength: 256 }) },
  { id: 'ripemd160', label: 'RIPEMD-160', bits: 160, fn: (v) => CryptoJS.RIPEMD160(v) },
]

function CopyButton({ value, disabled }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (disabled || !value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard not available; fail silently in UI
    }
  }

  return (
    <button
      onClick={copy}
      disabled={disabled}
      className="shrink-0 rounded-md border border-ink-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-600 disabled:hover:text-slate-300"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function HashRow({ algo, value, uppercase }) {
  const digest = useMemo(() => {
    if (!value) return ''
    const out = algo.fn(value).toString(CryptoJS.enc.Hex)
    return uppercase ? out.toUpperCase() : out
  }, [algo, value, uppercase])

  return (
    <div className="flex items-center gap-4 border-b border-ink-700 py-3.5 last:border-b-0">
      <div className="w-24 shrink-0">
        <div className="text-sm font-semibold text-slate-100">{algo.label}</div>
        <div className="text-[11px] text-slate-500">{algo.bits}-bit</div>
      </div>
      <div className="hashscroll min-w-0 flex-1 overflow-x-auto">
        <code className="block whitespace-pre font-mono text-[13px] leading-relaxed text-mint">
          {digest || <span className="text-slate-600">waiting for input&hellip;</span>}
        </code>
      </div>
      <CopyButton value={digest} disabled={!digest} />
    </div>
  )
}

export default function App() {
  const [input, setInput] = useState('')
  const [uppercase, setUppercase] = useState(false)

  const copyAll = async () => {
    if (!input) return
    const lines = ALGORITHMS.map((a) => {
      const digest = a.fn(input).toString(CryptoJS.enc.Hex)
      return `${a.label}: ${uppercase ? digest.toUpperCase() : digest}`
    })
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen px-5 py-14 text-slate-100 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="7" fill="#1A2432" />
              <path d="M9 9v14M9 16h8M23 9v14" stroke="#F2A93C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="23" cy="9" r="1.6" fill="#4ADE9B" />
            </svg>
            <span className="text-sm font-semibold tracking-tight text-slate-400">Hash Forge</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Turn any password into every hash digest.
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-400">
            Type a password or phrase and watch it recompute live as MD5, SHA-1,
            the SHA-2 family, SHA3-256, and RIPEMD-160. Everything runs locally
            in your browser — nothing you type is sent anywhere.
          </p>
        </header>

        <div className="mb-6">
          <label htmlFor="pw" className="mb-2 block text-sm font-medium text-slate-300">
            Password or text to hash
          </label>
          <input
            id="pw"
            type="text"
            autoComplete="off"
            spellCheck="false"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. correct-horse-battery-staple"
            className="w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 font-mono text-[15px] text-white placeholder:text-slate-600 outline-none transition focus:border-signal focus:ring-1 focus:ring-signal"
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-3.5 w-3.5 rounded-sm border-ink-600 bg-ink-800 text-signal accent-signal"
            />
            Uppercase hex
          </label>
          <button
            onClick={copyAll}
            disabled={!input}
            className="rounded-md bg-signal px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-signal-soft disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
          >
            Copy all digests
          </button>
        </div>

        <div className="rounded-lg border border-ink-700 bg-ink-900/60 px-5">
          {ALGORITHMS.map((algo) => (
            <HashRow key={algo.id} algo={algo} value={input} uppercase={uppercase} />
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-slate-600">
          Hashing is one-way: these digests can't be turned back into your
          original password. Use them to verify data integrity, store
          password fingerprints, or check that two files match — not as a
          substitute for a proper password manager or a salted hashing
          algorithm like bcrypt or Argon2 in production systems.
        </p>
      </div>
    </div>
  )
}
