---
title: Eleventy Reasonable
description: A Yeoman template for 11ty with minification and good defaults.
category: Library
layout: product.njk
---
A Yeoman template for 11ty so you don't have to set up minification with every new project.

The best way to achieve performance on the web is to deliver the smallest
payload possible and pre-render dynamic resources as much as you can. After
trying many static site generators, I've found that [11ty](https://www.11ty.dev)
delivers both ease of use and the power to pre-render anything I need — I've used
it to build side projects that consistently pass 100% Lighthouse scores.

But 11ty is a fairly bare-bones SSG. After the third or fourth time setting up
the same configs — minification, VS Code build settings, and other defaults — I
got tired of remembering how. [Yeoman](https://yeoman.io/) is an industry-standard
tool for scaffolding projects, so this template lets you run
`yo eleventy-reasonable` and take the tedium out of starting a new site.

## Features

- Runs `npm install` so you always start with the latest dependencies.
- Minification on build via [html-minifier](https://www.npmjs.com/package/html-minifier), [clean-css](https://www.npmjs.com/package/clean-css), and [terser](https://www.npmjs.com/package/terser).
- Sets up the standard 11ty folder structure (`_includes` and `_assets`).
- Wires in a default Nunjucks template and CSS file, with sensible meta tags and an emoji favicon.
- Ships a dark-mode default stylesheet, in case you're coding late at night.
- Small enough that it's easy to see what to update and remove.
- Adds `build` and `serve` scripts to `package.json`, so `npm run serve` just works.

## Getting started

1. Install [Node](https://nodejs.org/en).
2. Install [Yeoman](https://yeoman.io/learning/index.html).
3. Run `yo eleventy-reasonable`.
4. Provide the package name, author, and license.

That's it. It's licensed under MIT, so it's fine for commercial projects too.

## Links

- [Source code](https://github.com/ivy-puckett/generator-eleventy-reasonable)
