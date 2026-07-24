// Compiles each canonical Markdown file (from the `pages` data) into a styled
// HTML page. The Markdown->HTML conversion happens in src/_data/pages.js; this
// template just places the resulting HTML into the base layout.

module.exports = class {
  data() {
    return {
      pagination: { data: "pages", size: 1, alias: "doc" },
      permalink: (data) => data.doc.url,
      layout: "base.njk",
      eleventyExcludeFromCollections: true,
      eleventyComputed: {
        title: (data) => data.doc.title,
        description: (data) => data.doc.description,
        mdUrl: (data) => data.doc.mdUrl,
      },
    };
  }

  render(data) {
    return data.doc.html;
  }
};
