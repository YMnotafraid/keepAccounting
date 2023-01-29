const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
};
target.target = target;
const myclone = (target, map = new Map()) => {
  if (target instanceof Object) {
    let newclone = Array.isArray(target) ? [] : {};
    if (map.get(target)) return map.get(target);
    map.set(target, newclone);
    for (const key in target) {
      newclone[key] = myclone(target[key], map);
    }
    return newclone;
  } else return target;
};
console.log(myclone(target));
