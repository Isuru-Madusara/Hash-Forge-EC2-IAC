# Hash Forge

A small React + Vite app that turns any password or text into multiple hash
digests — MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3-256, and
RIPEMD-160 — computed live in the browser as you type.

Everything runs client-side with [crypto-js](https://github.com/brix/crypto-js);
nothing you type is sent to a server.

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- crypto-js

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

## Build for production

```bash
npm run build
npm run preview
```

Or use the helper script, which installs dependencies and builds in one step:

```bash
bash scripts/deploy.sh
```

The production files are output to `dist/`, ready to upload to any static
host (S3 + CloudFront, Netlify, Vercel, Nginx on an EC2 instance, etc.).

## Project structure

```
hash-forge/
├── public/          static assets (favicon)
├── scripts/         helper shell scripts (build/deploy)
├── src/
│   ├── App.jsx       main hash generator UI
│   ├── main.jsx       React entry point
│   └── index.css      Tailwind base + custom styles
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## A note on "hash cracking"

Hashing is one-way by design — these algorithms cannot be reversed back into
the original password. This tool generates digests from input you provide;
it does not attempt to recover passwords from existing hashes.
