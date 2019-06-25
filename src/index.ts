type Disposer = () => void;

const _disposers = new WeakMap<Object, Disposer[]>();

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
