# @mapl/web
Low-level, runtime-agnostic JS backend framework.

```ts
// index.ts
import { router, send } from '@mapl/web';
import { compile, vars } from '@mapl/web/generic';

const root = router.init();

send.body(
  router.get(root, '/'),
  (req, c) => {
    c.status = 418;
    return req.url;
  },
  vars.request,
);

send.html(
  router.get(root, '/home'),
  (req) => `<a>${req.url}</a>`,
  vars.request,
);

send.jsonAsync(
  router.post(root, '/json'),
  (req) => req.json(),
  vars.request,
);

export default compile(root);

// serve.ts
import handlerId from './index.ts';
import { getDependency } from 'runtime-compiler';

export default {
  fetch: getDependency(handlerId),
};
```
