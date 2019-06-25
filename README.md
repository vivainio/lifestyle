[![npm version](https://badge.fury.io/js/lifestyle.svg)](https://badge.fury.io/js/lifestyle)
[![Build Status](https://dev.azure.com/ville0567/ville/_apis/build/status/vivainio.lifestyle?branchName=master)](https://dev.azure.com/ville0567/ville/_build/latest?definitionId=11&branchName=master)
# lifestyle

JS object life cycle management helper. Best used with Angular. 

## Installation

```
$ yarn add --dev lifestyle
```

## Usage

This is typically used in angular application to avoid messing up your application code with
explicit subscriptions and resource disposal calls. 

```ts

import {lunsub, ldisposer, lstop} from "lifestyle";

// ... my component code

ngOnInit() {
  // schedule .unsubscribe on passed object. For RxJS observables
  lunsub(this, mystream$.subscribe(val => { ...}));
  lunsub(this, otherstream$.subscribe(val => { ... }));

  // lunsub supports many args 
  lunsub(this, a.subscribe(...), b.subscribe(...));
  
  )
  // call your own disposal code
  ldisposer(this, () => { console.log('arbitrary disposer function' )})
  // mobx autorun() follows the same protocol.
  ldisposer(this, autorun( () => ... mobx autorun code ...);

}

ngOnDestroy() {
  // this cleans up everything. You forget it, you leak stuff.
  lstop(this);  
}

```

## How it works

It stores all pushed disposers to in a WeakMap associated with passed "this". Full
implementation is https://github.com/vivainio/lifestyle/blob/master/src/index.ts.

This is more convenient and harder to screw up than `takeUntil(this.destroy$)` pattern,
especially if you end up going to subscribe() anyway.

Size is ~ 500 bytes uncompressed, and there are no dependencies.

## License

MIT. Copyright (c) 2019 by Ville M. Vainio <vivainio@gmail.com>
