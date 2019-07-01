const { lstop, ldisposer, lunsub } = require("../dist/index");

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
