# Dear Amma

A cinematic Mother's Day surprise website built with Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP, and Three.js.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Replace Photos

Place new images in `public/memories`, then update `lib/memories.ts`.

Each memory supports:

- `image`: deployed public path, like `/memories/my-photo.jpeg`
- `title`
- `year`
- `caption`
- `quote`
- `rotate`
- `align`

The hero currently uses `/memories/amma-beach.jpeg` in `app/page.tsx`. Replace that path if you want a different opening photo.

## Add Voice Recording

For a permanent deployed voice message, add:

```text
public/voice/amma-message.mp3
```

The on-page upload button is for previewing a voice file locally in the browser. Uploaded files are not saved unless you place them in `public/voice`.

## Deploy To Vercel

1. Push this folder to a GitHub repository.
2. Go to `https://vercel.com/new`.
3. Import the repository.
4. Keep the default settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click Deploy.
6. After deployment, open the Vercel URL on mobile and desktop.

## Production Checks

Before deploying, run:

```bash
npm run build
```

The app is static-prerendered and uses optimized Next images from `public/memories`, so the personal photos deploy with the site.
