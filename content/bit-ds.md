---
title: Bit DS
description: A 1-bit, accessibility-first design system delivered as a single CSS file.
category: Article
layout: product.njk
---
Bit DS is a design system named for its 1-bit colour palette. It prioritises user engagement by holding to strict accessibility standards and design best practices.

Implementation is a single raw CSS file, which makes it usable inside any web
project.

## Colours

Inspired by 1-bit pixel art, Bit DS restricts itself to two colours. No shadows,
no gradients — just shape and space. Any two colours may be used, as long as the
contrast ratio meets [WCAG AAA standards](https://webaim.org/resources/contrastchecker/)
for normal text:

- **`0`** — the "dark" colour, which styles text and all foreground elements.
- **`1`** — the "light" colour, which styles background elements and borders.

## Typography

**Font choice.** Arial is the font for both headers and body text, for two
reasons: it is [easier for people with dyslexia to read](https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide),
and it's web-safe, which slightly improves performance. Any other font is fine as
long as it's applied consistently and meets the first criterion.

**Font size.** The base size is 16px for all text. Header sizes scale in
increments of the 8px base grid; `h4` is the smallest header, starting at 24px.

**Spacing.**

- Letter spacing is left at Arial's default (may be revised in future versions).
- Line height is 1.5× the font size.
- Header margins are 1× the font size on top, 0.5× on the bottom.
- Body margins are 1× the font size, top and bottom.
- No paragraph should be wider than 600px.

**Inline links.** Following the dyslexia-friendly style guide, links aren't
underlined. Like buttons, they're bold, carry 1-unit margins, and are slightly
larger at 20px. Most of these choices are inspired by the
[British Dyslexia Association](https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide).

## Buttons

Buttons use bold text, are 20 units wide and 4 units tall, are square, and have
an inset border of half a unit. Primary buttons are filled with the inverted
font colour.

## Cards

Cards model physical playing cards:

- A 5 / 7 aspect ratio, to match a playing card.
- A half-unit border and a 2-unit border radius.
- Space for a title, an image, and a description.

## Input elements

The philosophy is to adopt HTML5's built-in form tools, so form elements are
largely unstyled. The one exception: inputs use the same square border as
buttons, to signal that they're interactive.
