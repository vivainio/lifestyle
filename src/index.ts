type Disposer = () => void;
type Expression = () => void;

const _disposers = new WeakMap<Object, Disposer[]>();

/** associate disp in the weakmap with object obj */
function addOrSet(obj: Object, disp: Disposer): void {
  const ds = _disposers.get(obj);
  if (!ds) {
    _disposers.set(obj, [disp]);
  } else {
    ds.push(disp);
  }
}

/** Register disposer function for later disposal by lstop(), associated with obj */
export function ldisposer(obj: Object, disp: Disposer): void {
  addOrSet(obj, disp);
}

/** Convenience method to create function that adds disposers. Use e.g. with mobx autorun
 * 'creator' is like autorun
 * Use with mobx:
 *
 * ar = lwrap(this, () => this.cdr.markForCheck(), autorun)
 * ar(function one() { })
 * ar(function two() { })
 *
 */
export function lwrap(
  obj: Object,
  creator: (e: Expression) => Disposer,
  postCall: () => void,
) {
  const maker = function(fn: () => void) {
    const wrapFn = function() {
      fn();
      postCall();
    };
    ldisposer(obj, creator(wrapFn));
  };

  return maker;
}

/** Dispose all resources associated with obj */
export function lstop(obj: Object): void {
  const ds = _disposers.get(obj);
  if (!ds) {
    throw new Error(
      "Illegal lifestyle, attempted to stop without disposers: " + obj
    );
  }
  for (const d of ds) {
    d();
  }
  _disposers.delete(obj);
}

/** Disposer that calls unsubscribe(). Use with RxJS subscriptions */
export function lunsub<T extends { unsubscribe: () => void }>(
  obj: Object,
  ...obs: T[]
): void {
  for (const o of obs) {
    addOrSet(obj, () => o.unsubscribe());
  }
}
