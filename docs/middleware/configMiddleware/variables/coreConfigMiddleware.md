[**Core Documentation v0.0.36**](../../../README.md)

***

[Core Documentation](../../../modules.md) / [middleware/configMiddleware](../README.md) / coreConfigMiddleware

# Variable: coreConfigMiddleware

> `const` **coreConfigMiddleware**: `MixedPipe`[]

Defined in: [middleware/configMiddleware.ts:369](https://github.com/stonemjs/core/blob/9f959fbf0878444ad50749e09c8b1ee612a83d71/src/middleware/configMiddleware.ts#L369)

Array representing the core configuration middleware for the application.

This array contains the list of core middleware functions that are used to process the application
configuration in a specific order. Each middleware is associated with a priority that determines
the sequence in which it is executed. Middleware functions are used to build the application's blueprint,
set up the adapter, register providers, and handle other essential configuration steps.

## Example

```typescript
import { coreConfigMiddleware } from './coreConfigMiddleware';

// The middleware will be used to configure the application's settings before it starts.
```
