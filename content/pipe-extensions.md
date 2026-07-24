---
title: Pipe Extensions
description: A forward pipe operator for C#, distributed on NuGet.
category: Library
layout: product.njk
---
A forward pipe operator for C# — chain function calls into concise, readable pipelines.

## Impetus

I believe the forward pipe operator is one of the most crucial operators for
writing concise, readable code. I know that's a bold claim, but I honestly
believe it. When I found out there wasn't a way to make a forward pipe operator
in C#, I built a library.

Be careful with this one. Much like [Automapper](https://automapper.org/), once
you expose your codebase to it, it can be hard to remove.

## Features

- **Broad compatibility** — works with most versions of .NET.
- **Pass multiple types** — using tuples, you can pass up to three variables as parameters to the next function.
- **Installed through NuGet** — because it's important to use the right channels.
- **Dependency-less** — you only install the code itself.

## Tech stack

- C#. Just C#.

## Links

- [NuGet: WinstonPuckett.PipeExtensions](https://www.nuget.org/packages/WinstonPuckett.PipeExtensions)
- [Source code](https://github.com/winstonpuckett/WinstonPuckett.PipeExtensions)
