// Eleventy config — builds the site into ./_site.
//
// Every content page (tagged `page`) is published twice from a single source:
//   • a styled HTML page for humans/browsers        -> /<slug>/index.html
//   • the raw Markdown for agents/LLMs              -> /<slug>/index.md
// plus a root /llms.txt index pointing agents at the Markdown twins.
//
// The Markdown twins are generated in `src/md.njk` from each page's
// `rawInput` (Eleventy 3's raw, front-matter-stripped source), so the HTML
// and Markdown never drift — they come from the same `.md` file.

module.exports = function (eleventyConfig) {
  // Static assets (images, etc.) pass straight through if the folder exists.
  // Uncomment once you add files under src/_assets/:
  // eleventyConfig.addPassthroughCopy({ "src/_assets": "assets" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
