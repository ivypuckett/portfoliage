---
title: Lucifer
description: Easy, maintainable testing for command-line applications.
category: App
layout: product.njk
---
Illuminating CLI testing — a command-line app for testing other command-line apps.

Lucifer enables easy, maintainable testing of other CLI applications. Run your
test suite anywhere, maintain your tests effortlessly, reproduce errors quickly,
and more. If you already have [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
installed, just run `cargo install lucifer-testing`.

## Easy test suite management

Your test suite should never become more cumbersome than the code you're
testing. Tests in Lucifer are grouped into features, which are grouped into a
test suite. When you have a new feature to test, add a new file to your suite
folder and start writing — Lucifer registers it automatically and verifies the
new tests on the next check-in.

Each test is uniform: every test has a name, a description, and a set of
expectations. When you understand one test, you understand them all.

## Know quickly when something's wrong

When Lucifer runs, it outputs test information to the console *and* to a
`results.json` file in a folder you specify. That means both human-readable and
machine-readable results, so you always know exactly what's wrong with your
system.

## Links

- [Install from crates.io: lucifer-testing](https://crates.io/crates/lucifer-testing)
- [Source code](https://github.com/ivy-puckett/lucifer)
