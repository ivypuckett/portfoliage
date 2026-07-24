// Eleventy config — builds the site into ./_site.
//
// Content model:
//   • ./content/*.md   the canonical Markdown store. This is the ONLY place
//                      agent-visible text lives, and each file is served
//                      verbatim (passthrough copy) at /<slug>.md.
//   • ./src/           pure machinery/chrome that LLMs never see: the base
//                      layout, the page compiler, and the llms.txt template.
//
// HTML is compiled FROM the Markdown (src/_data/pages.js parses each file;
// src/pages.11ty.js renders it into the layout). Because the served .md is the
// source file itself, the human and agent views can never drift.

module.exports = function (eleventyConfig) {
  // Serve the raw canonical Markdown verbatim: content/index.md -> /index.md.
  eleventyConfig.addPassthroughCopy({ content: "/" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "11ty.js"],
    htmlTemplateEngine: "njk",
  };
};
