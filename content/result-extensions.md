---
title: Result Extensions
description: The Result monad for C#, distributed on NuGet.
category: Library
layout: product.njk
---
The Result monad for C# — deprecate try/catch in favour of values that flow through your pipes.

## Impetus

Once [Pipe Extensions](/pipe-extensions/) was off the ground, I got tired of
using try/catch, which breaks up the flow of a pipe. I built this library to
deprecate try/catch in favour of the Result monad. I never really wrote
documentation for it, so it may be less obvious how wonderful this package is —
but Intellisense provides great docs if you want to take a look.

## Features

- **Broad compatibility** — works with most versions of .NET.
- **Pass multiple types** — using tuples, you can pass up to three variables as parameters to the next function.
- **Installed through NuGet** — because it's important to use the right channels.
- **Dependency-less** — you only install the code itself.

## Tech stack

- C#. Just C#.

## Links

- [NuGet: WinstonPuckett.ResultExtensions](https://www.nuget.org/packages/WinstonPuckett.ResultExtensions)
- [Source code](https://github.com/winstonpuckett/WinstonPuckett.ResultExtensions)
