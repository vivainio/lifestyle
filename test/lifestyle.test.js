const { lstop, ldisposer, lunsub, lwrap } = require("../dist/index");

test("ldisposer, lunsub should work", () => {
  var o = {};
  const called = [false, false, false];
  expect(() => lstop(o).toThrowError());
  ldisposer(o, () => {
    called[0] = true;
  });
  ldisposer(o, () => {
    called[1] = true;
  });

  lunsub(o, {
    unsubscribe() {
      called[2] = true;
    }
  });

  expect(called).toEqual([false, false, false]);
  lstop(o);
  expect(called).toEqual([true, true, true]);
  expect(() => lstop(o).toThrowError());
});

test("lwrap works", () => {
  const o = {};
  let disposerCalled = false;
  function autorun(fn) {
    fn();
    return () => {
      disposerCalled = true;
    };
  }
  let postopCount = 0;
  const w = lwrap(
    o,
    () => {
      postopCount += 1;
    },
    autorun
  );

  let payload = false;
  w(() => {
    payload = true;
  });

  expect(postopCount).toEqual(1);
  expect(payload).toEqual(true);
  expect(disposerCalled).toEqual(false);
  let pl2 = false;
  w(() => {
    pl2 = true;
  });
  expect(pl2).toEqual(true);
  expect(postopCount).toEqual(2);

  lstop(o);
  expect(disposerCalled).toEqual(true);
});
