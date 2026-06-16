---
name: react-no-unnecessary-effects
description: React useEffect and useLayoutEffect audit guidance based on React's "You Might Not Need an Effect". Use when writing or reviewing React code with effects, derived state, prop-to-state syncing, event logic, data fetching, subscriptions, timers, or requests to reduce extra renders.
---

# React No Unnecessary Effects

Use this skill before adding, changing, or reviewing `useEffect` / `useLayoutEffect`.

Source: https://react.dev/learn/you-might-not-need-an-effect

## Core Rule

Effects synchronize React with external systems: browser APIs, DOM measurement or mutation, subscriptions, timers, network state, third-party widgets, analytics, or imperative media/player APIs.

If there is no external system, start by deleting the Effect.

## Audit Checklist

For every Effect ask:

1. What external system is this syncing with?
2. Could this value be calculated during render?
3. Could this logic run in the event handler that already knows what happened?
4. Is this resetting state because props changed? Prefer a `key` remount boundary.
5. Is this adjusting state because props changed? Prefer storing an ID and deriving the selected object during render.
6. Is this a chain of state updates? Prefer one event handler or reducer that computes the next state.
7. Does this subscribe to an external store? Prefer `useSyncExternalStore`.
8. Does this fetch data? Prefer framework/router/cache loaders. If an Effect is necessary, cleanup must ignore stale responses.
9. Does cleanup exactly undo setup?

## Replacements

- Derived render values: calculate directly from props/state. Use `useMemo` only for expensive pure calculations.
- Event-specific work: run it in the event handler, even if multiple handlers call the same helper.
- Full state reset on identity change: split the component and pass `key={id}` to the inner component.
- Partial state adjustment: first try deriving from stable IDs. Only adjust state during render when unavoidable.
- Parent notifications: update parent state in the same event that changed child state.
- External store subscriptions: use `useSyncExternalStore`.
- Imperative browser/widget sync: keep a minimal Effect with exact dependencies and cleanup.

## Review Language

Lead with the smallest change that works:

- `delete effect`: no external system; calculate during render.
- `move to event`: this is caused by a specific user action.
- `key reset`: component identity changed; remounting is clearer than syncing state.
- `derive state`: this state duplicates props or other state.
- `keep effect`: real external sync; verify dependencies and cleanup.

## Safe Effect Shape

```tsx
useEffect(() => {
  const subscription = external.subscribe(value, handleChange);
  return () => subscription.unsubscribe();
}, [value]);
```

## Red Flags

- Effect immediately calls `setState` from props or other state.
- Effect only formats, filters, maps, sorts, or concatenates data for rendering.
- Effect handles a click, submit, save, or notification after the interaction already happened.
- Effect resets multiple state variables when an ID prop changes.
- Effect exists only to trigger another state update.
- Effect fetches without race-condition cleanup.
