#!/usr/bin/env node
/**
 * backup-frames.js
 *
 * Downloads all animation frame images from external CDNs into a local
 * directory for offline backup and disaster recovery.
 *
 * Usage:
 *   node scripts/backup-frames.js [--output <dir>]
 *
 * Default output directory: ./frame-backup/
 *
 * This script reads every frameUrls-*.ts file in the project, extracts
 * the CDN URLs, and downloads them into per-project subdirectories.
 * It supports resuming — files that already exist locally are skipped.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const FRAME_URL_FILES = [
  { file: "client/src/components/frameUrls.ts", project: "hero-wristband" },
  {
    file: "client/src/components/frameUrls-abaqus-4k.ts",
    project: "abaqus",
  },
  { file: "client/src/components/frameUrls-bon-4k.ts", project: "bon" },
  { file: "client/src/components/frameUrls-cyl-4k.ts", project: "cyl" },
  { file: "client/src/components/frameUrls-func-4k.ts", project: "func" },
  { file: "client/src/components/frameUrls-mod-4k.ts", project: "mod" },
  {
    file: "client/src/components/frameUrls-octolapse-4k.ts",
    project: "octolapse",
  },
  { file: "client/src/data/frameUrls-fpc-4k.ts", project: "fpc" },
  { file: "client/src/data/frameUrls-cpress.ts", project: "cpress" },
];

const CONCURRENCY = 5; // parallel downloads per project
const MAX_RETRIES = 3;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractUrls(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const urlRegex = /https?:\/\/[^\s"',]+/g;
  return content.match(urlRegex) || [];
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      resolve("skipped");
      return;
    }

    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve("downloaded");
      });
      fileStream.on("error", reject);
    });
    request.on("error", reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

async function downloadWithRetry(url, destPath, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await downloadFile(url, destPath);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function downloadBatch(urls, outputDir) {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];

  // Process in chunks of CONCURRENCY
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const chunk = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      chunk.map((url) => {
        const filename = path.basename(url);
        const destPath = path.join(outputDir, filename);
        return downloadWithRetry(url, destPath);
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        if (result.value === "skipped") skipped++;
        else downloaded++;
      } else {
        failed++;
        errors.push(result.reason.message);
      }
    }

    // Progress indicator
    const total = Math.min(i + CONCURRENCY, urls.length);
    process.stdout.write(
      `\r  Progress: ${total}/${urls.length} (${downloaded} new, ${skipped} skipped, ${failed} failed)`
    );
  }
  console.log(); // newline after progress

  return { downloaded, skipped, failed, errors };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  let outputBase = "./frame-backup";

  const outputIdx = args.indexOf("--output");
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    outputBase = args[outputIdx + 1];
  }

  const projectRoot = path.resolve(__dirname, "..");

  console.log("=== Animation Frame Backup Tool ===");
  console.log(`Output directory: ${path.resolve(outputBase)}`);
  console.log();

  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let totalUrls = 0;

  for (const entry of FRAME_URL_FILES) {
    const filePath = path.join(projectRoot, entry.file);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP: ${entry.file} (file not found)`);
      continue;
    }

    const urls = extractUrls(filePath);
    totalUrls += urls.length;

    const outputDir = path.join(outputBase, entry.project);
    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`[${entry.project}] ${urls.length} frames from ${entry.file}`);
    const { downloaded, skipped, failed, errors } = await downloadBatch(
      urls,
      outputDir
    );

    totalDownloaded += downloaded;
    totalSkipped += skipped;
    totalFailed += failed;

    if (errors.length > 0) {
      console.log(`  Errors:`);
      errors.forEach((e) => console.log(`    - ${e}`));
    }
  }

  console.log();
  console.log("=== Summary ===");
  console.log(`Total URLs:    ${totalUrls}`);
  console.log(`Downloaded:    ${totalDownloaded}`);
  console.log(`Skipped:       ${totalSkipped} (already exist)`);
  console.log(`Failed:        ${totalFailed}`);
  console.log(`Output:        ${path.resolve(outputBase)}`);

  if (totalFailed > 0) {
    console.log(
      "\nSome downloads failed. Re-run the script to retry (existing files are skipped)."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
