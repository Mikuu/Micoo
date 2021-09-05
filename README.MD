Micoo
--

![micoo.gif](./docs/images/micoo.gif)

[![CircleCI](https://circleci.com/gh/Mikuu/Micoo.svg?style=svg)](https://circleci.com/gh/Mikuu/Micoo)

Micoo is a pixel based screenshots comparison solution for visual regression test, some characters Micoo provides:

* a web application, for inspecting test results, making visual mismatch decision and maintain baseline build,
* an engine service, for comparing the latest screenshots against baseline screenshots, based on pixel difference,
* a methodology, about how to do visual regression test with service,
* quick local setup and server side deployment with Docker Compose,
* basic authentication with a passcode and API key,
* different easy methods to view the mismatch,
* ignoring rectangles to enable visual testing on dynamic and inconsistent UI elements,

Micoo does `NOT`:
* take screenshots from your SUT application,
* process screenshots before doing visual comparison,
* provide Email notification for comparison mismatch,
* provide user management to distinguish `teams`,

So, what Micoo targets at is the most stable and straightforward function for comparing screenshots. Micoo is not, and probably, would never be a powerful thing, like `JVM`, but hope to be an always useful helper, like `string.replace()`.

## Installation and Usage
For more detailed information including installation and usage, please visit this [document](https://arxman.com/micoo/).

## Reference
For reference about using Micoo in practice, please refer this [article](https://mikuu.medium.com/ui-visual-regression-testing-with-micoo-12c7a4a036b9).

## Micoo Clients and Backend APIs
For Micoo clients and backend APIs usage, please check [here](https://github.com/Mikuu/Micoo/tree/master/clients)