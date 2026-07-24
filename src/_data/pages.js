// Reads the canonical Markdown store in ./content and turns each file into a
// page record. This is the ONE place the source Markdown is parsed; both the
// compiled HTML (src/pages.11ty.js) and the agent index (src/llms.txt.njk)
// consume this data. The raw .md files themselves are served untouched via
// passthrough copy (see eleventy.config.js), so what an agent fetches at
// /<slug>.md is byte-for-byte the file an author edits in ./content.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({ html: true, linkify: true });
const CONTENT_DIR = path.join(process.cwd(), "content");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

module.exports = function () {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return walk(CONTENT_DIR)
    .map((file) => {
      const rel = path.relative(CONTENT_DIR, file).split(path.sep).join("/");
      const slug = rel.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(file, "utf8"));

      return {
        slug,
        // URL of the human HTML page: index -> "/", about -> "/about/".
        url: slug === "index" ? "/" : `/${slug.replace(/\/index$/, "")}/`,
        // URL of the raw Markdown twin: mirrors the source path under /content.
        mdUrl: `/${rel}`,
        title: data.title || slug,
        description: data.description || "",
        order: typeof data.order === "number" ? data.order : 100,
        html: md.render(content),
      };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
};
