import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "data");
const outputFile = path.join(rootDir, "gallery-data.js");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const titleOverrides = new Map([["casa_estreito.jpg", "Casa do Estreito"]]);

function titleFromFilename(filename) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");

  return withoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\p{L}+/gu, (word) => word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1));
}

const entries = await readdir(dataDir);

const images = (
  await Promise.all(
    entries.map(async (filename) => {
      const extension = path.extname(filename).toLowerCase();

      if (!imageExtensions.has(extension)) {
        return null;
      }

      const filePath = path.join(dataDir, filename);
      const fileStats = await stat(filePath);

      if (!fileStats.isFile()) {
        return null;
      }

      return {
        title: titleOverrides.get(filename) || titleFromFilename(filename),
        src: `data/${encodeURIComponent(filename)}`,
        filename,
        updatedAt: fileStats.mtime.toISOString()
      };
    })
  )
)
  .filter(Boolean)
  .sort((a, b) => a.filename.localeCompare(b.filename, "pt-BR", { sensitivity: "base" }));

const contents = `window.PORTFOLIO_GALLERY = ${JSON.stringify(images, null, 2)};\n`;

await writeFile(outputFile, contents);

console.log(`Galeria atualizada com ${images.length} imagem(ns).`);
