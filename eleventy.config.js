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

module.exports = function (eleventyConfig) {
  // Serve the raw canonical Markdown verbatim: content/index.md -> /index.md.
  eleventyConfig.addPassthroughCopy("content/*.md");

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
