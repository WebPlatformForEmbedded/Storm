# Storm Test Runner

## Test Case Features - Nested Tests

So far we have only discussed Test cases than run in sequence from start until end, possibly repeating a single step more than once. But what if you want to repeat a short sequence of steps a few times, inside your test case?

For advanced scenarios like this, the Test runner supports the concept of **nested tests**. This basically means that you can define a step to be an entire Test case with it's own steps.

This nested test can contain everything a normal Test case can. So you can define a [`sleep`](./sleeping.md) and [`repeat`](./repeat) property, but a nested test can also have it's own [`setup` and `teardown`](./setup-teardown.md) methods.

```js
// to do example
```

Technically there is no limit to the level of nesting. In other words, a nested test itself can contain a nested test (and that nested test as well and so forth). Off course with deeply nested tests it's easy to end up with overly complicated tests and lose the overview.

### Context and nested tests

Todo

### Data and nested tests

Todo
