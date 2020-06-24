![micoo.gif](./docs/images/micoo.gif)

## Micoo
Micoo is a pixel based screenshots comparison solution for visual regression test, some characters Micoo provides:

* a web application, for inspecting test results, making visual mismatch decision and maintain baseline build,
* an engine service, for comparing the latest screenshots against baseline screenshots, based on pixel difference,
* a methodology, about how to do visual regression test with service,
* quick local setup and server side deployment with Docker Compose,

Micoo does `NOT`:
* take screenshots from your SUT application,
* process screenshots before doing visual comparison,
* provide Email notification for comparison mismatch,
* provide user management to distinguish `teams`,

So, what Micoo targets at is the most stable and straightforward function for comparing screenshots. Micoo is not, and probably, would never be a powerful thing, like `JVM`, but hope to be an always useful helper, like `string.replace()`.

For more detailed information, please visit this [document](https://arxman.com/micoo/).
