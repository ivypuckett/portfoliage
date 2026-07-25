// Eleventy config — builds the site into ./_site.
//
// Content model — three directories, each with exactly one build role. The
// roles are about *how a file is published*, never about what kind of thing it
// is, so a new tool, game or demo never needs a new category to live in:
//   • ./content/*.md   the canonical Markdown store. This is the ONLY place
//                      agent-visible text lives. Eleventy renders each file to
//                      HTML *and* passthrough-copies it verbatim to /<slug>.md,
//                      so what an agent fetches is byte-for-byte the source.
//   • ./public/        self-contained pages shipped verbatim to the web root.
//                      Served to humans, absent from the Markdown corpus and
//                      llms.txt. public/<slug>/ -> /<slug>/.
//   • ./src/           pure machinery/chrome that is never served at all: the
//                      layout and site data. Referenced via ../src below.
//
// There is no hand-rolled Markdown parsing here — Eleventy renders the HTML
// natively, and the raw .md is just the source file copied through.

const fs = require("node:fs");
const path = require("node:path");

const site = require("./src/_data/site.json");

const siteHost = new URL(site.url).hostname;

// True for http(s) links that point off this site. Relative and root-relative
// hrefs resolve against site.url and so come out internal; mailto:, tel: and
// other schemes are left alone entirely.
function isExternalLink(href) {
  try {
    const url = new URL(href, site.url);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname !== siteHost
    );
  } catch {
    return false;
  }
}

// ./public and ./content publish into one flat URL namespace, so public/blog/
// and content/blog.md would both claim /blog/ — the passthrough copy and the
// rendered page racing to write the same file. Eleventy won't flag that, so
// fail the build loudly instead of shipping whichever one happened to win.
function assertNoSlugCollisions() {
  const publicDir = path.join(__dirname, "public");
  if (!fs.existsSync(publicDir)) return;

  const publicSlugs = fs
    .readdirSync(publicDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const contentSlugs = new Set(
    fs
      .readdirSync(path.join(__dirname, "content"))
      .filter((file) => file.endsWith(".md"))
      .map((file) => path.basename(file, ".md"))
  );

  const collisions = publicSlugs.filter((slug) => contentSlugs.has(slug));
  if (collisions.length > 0) {
    throw new Error(
      `URL collision: ${collisions
        .map((slug) => `public/${slug}/ and content/${slug}.md both claim /${slug}/`)
        .join("; ")}. Rename one of them.`
    );
  }
}

module.exports = function (eleventyConfig) {
  assertNoSlugCollisions();

  // Serve the raw canonical Markdown verbatim: content/index.md -> /index.md.
  eleventyConfig.addPassthroughCopy("content/*.md");

  // External links open in a new tab and carry rel="noopener noreferrer":
  // noopener denies the opened page a window.opener handle back to this one,
  // noreferrer additionally withholds the Referer header. Applied as a
  // markdown-it render rule rather than written into ./content by hand, so the
  // canonical Markdown stays plain, portable Markdown with no HTML in it.
  eleventyConfig.amendLibrary("md", (md) => {
    const renderDefault =
      md.renderer.rules.link_open ||
      ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options, env));

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (isExternalLink(token.attrGet("href") || "")) {
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
      }
      return renderDefault(tokens, idx, options, env, self);
    };
  });

  // Everything in public/ is copied verbatim to the output root, so each entry
  // sits at the top level alongside the pages: public/palette-generator/ ->
  // /palette-generator/. These are self-contained HTML/JS pages rather than
  // canonical Markdown, which is the whole reason they live outside content/ —
  // whether any given one is a tool, a game or a demo makes no difference here.
  eleventyConfig.addPassthroughCopy({ public: "/" });

  // Map a page's HTML url to its Markdown twin url ("/" -> "/index.md",
  // "/about/" -> "/about.md").
  eleventyConfig.addFilter("mdUrl", (url) =>
    url === "/" ? "/index.md" : url.replace(/\/$/, "") + ".md"
  );

  // The agent discovery index (https://llmstxt.org). Defined here rather than
  // as a file so ./content stays nothing-but-canonical-Markdown.
  eleventyConfig.addTemplate(
    "llms.txt.njk",
    [
      "# {{ site.title }}",
      "",
      "> {{ site.description }}",
      "",
      "## Pages",
      "{% for p in collections.page %}",
      "- [{{ p.data.title }}]({{ site.url }}{{ p.url | mdUrl }}){% if p.data.description %}: {{ p.data.description }}{% endif %}",
      "{%- endfor %}",
      "",
    ].join("\n"),
    // layout:false / tags:[] override the ./content directory data, which
    // would otherwise wrap this in the HTML layout and list it in itself.
    { permalink: "/llms.txt", layout: false, tags: [], eleventyExcludeFromCollections: true }
  );

  return {
    dir: {
      input: "content",
      includes: "../src/_includes",
      data: "../src/_data",
      output: "_site",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
