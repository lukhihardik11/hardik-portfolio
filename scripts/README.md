# Scripts — Asset Backup & Restore

This directory contains tools for backing up and restoring the external assets that the portfolio website depends on. The site's scroll-driven "Exploded View" animations load high-resolution image frames from external CDNs at runtime. If those CDNs become unavailable, the animations will fail to render. This backup system ensures the assets can be recovered.

## External Asset Manifest

The following table lists every category of external asset the site depends on, its hosting location, current status, and whether it has been localized into the repository.

| Category | Host | URL Count | Est. Size | Localized? |
|---|---|---|---|---|
| Hero wristband frames | CloudFront (`d2xsxph8kpxj0f.cloudfront.net`) | 192 | ~14 MB | No (CDN) |
| Abaqus project frames | CloudFront | 192 | ~14 MB | No (CDN) |
| Cyl project frames | CloudFront | 192 | ~14 MB | No (CDN) |
| Mod project frames | CloudFront | 192 | ~14 MB | No (CDN) |
| Octolapse project frames | CloudFront | 192 | ~14 MB | No (CDN) |
| FPC project frames | CloudFront | 192 | ~14 MB | No (CDN) |
| Bon project frames | Manus CDN (`files.manuscdn.com`) | 192 | ~63 MB | No (CDN) |
| Func project frames | Manus CDN | 192 | ~63 MB | No (CDN) |
| Cpress project frames | Manus CDN | 192 | ~63 MB | No (CDN) |
| Abaqus gallery images | **Local repo** (`assets/gallery/abaqus/`) | 5 | 1.5 MB | Yes |
| Cpress gallery images | **Local repo** (`assets/gallery/cpress/`) | 5 | 0.8 MB | Yes |
| Graduate project report | **Local repo** (`assets/reports/`) | 1 | 1.1 MB | Yes |
| Final presentation | **Local repo** (`assets/reports/`) | 1 | 1.7 MB | Yes |
| Project videos | **Local repo** (`assets/videos/`) | 3 | 4.0 MB | Yes |
| Spline 3D robot scene | Spline (`prod.spline.design`) | 1 | ~1.3 MB | No (SaaS) |

**Total external animation frames:** 1,728 URLs across 9 projects (~274 MB).

## Backing Up Animation Frames

Run the backup script to download all 1,728 animation frames to a local directory:

```bash
# From the project root:
node scripts/backup-frames.js

# Or specify a custom output directory:
node scripts/backup-frames.js --output /path/to/backup
```

The script will create per-project subdirectories inside `./frame-backup/` (or your custom path):

```
frame-backup/
  hero-wristband/   (192 .webp files)
  abaqus/           (192 .webp files)
  bon/              (192 .webp files)
  cyl/              (192 .webp files)
  func/             (192 .webp files)
  mod/              (192 .webp files)
  octolapse/        (192 .webp files)
  fpc/              (192 .webp files)
  cpress/           (192 .webp files)
```

The script supports resuming. If a file already exists locally, it is skipped. Failed downloads are retried up to 3 times. Re-run the script to retry any remaining failures.

## Restoring From Backup

If the CDN links break and you need to serve frames locally:

1. Run `backup-frames.js` to ensure all frames are downloaded.
2. Copy the `frame-backup/` directory into the Vite `public/` folder:
   ```bash
   cp -r frame-backup/ client/public/frames/
   ```
3. Update each `frameUrls-*.ts` file to replace the CDN URLs with local paths. For example, change:
   ```ts
   "https://d2xsxph8kpxj0f.cloudfront.net/.../frame_0001_abc123.webp"
   ```
   to:
   ```ts
   "/frames/hero-wristband/frame_0001_abc123.webp"
   ```
4. Rebuild the site with `pnpm build`.

## Spline 3D Scene

The hero section's interactive 3D robot is hosted on Spline's servers:

- **Scene URL:** `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`
- **Size:** ~1.3 MB
- **Runtime:** `@splinetool/react-spline` + `@splinetool/runtime`

The Spline scene is a proprietary binary format that requires the Spline runtime to render. It cannot be self-hosted without a Spline Pro account. If the scene URL becomes unavailable, the hero section will gracefully fall back to a static gradient background (the Spline component is wrapped in a Suspense boundary with error handling).

To back up the raw scene file for archival purposes:
```bash
curl -o spline-robot-scene.splinecode "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
```

## Notes

- The `frame-backup/` directory is listed in `.gitignore` and should not be committed to the repository (it would add ~274 MB of binary data).
- The gallery images, reports, and videos have already been localized into `assets/` and are committed to the repository.
- All CDN URLs are currently accessible (verified March 2026). The Manus CDN URLs (`files.manuscdn.com/user_upload_by_module/session_file/...`) are temporary session uploads and may expire without notice.
