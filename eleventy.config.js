// Eleventy config — builds the site into ./_site.
//
// Content model:
//   • ./content/*.md   the canonical Markdown store. This is the ONLY place
//                      agent-visible text lives. Eleventy renders each file to
//                      HTML *and* passthrough-copies it verbatim to /<slug>.md,
//                      so what an agent fetches is byte-for-byte the source.
//   • ./src/           pure machinery/chrome that LLMs never see: the layout
//                      and site data. Referenced via ../src below.
//
// There is no hand-rolled Markdown parsing here — Eleventy renders the HTML
// natively, and the raw .md is just the source file copied through.

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

module.exports = function (eleventyConfig) {
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

  // Interactive web tools are self-contained HTML/JS widgets, not canonical
  // Markdown, so they live outside content/ and are copied straight through:
  // src/tools/palette-generator/ -> /tools/palette-generator/.
  eleventyConfig.addPassthroughCopy({ "src/tools": "tools" });

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
