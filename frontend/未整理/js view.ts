/**
 * 找出元素item在给定数组arr中的位置
 */
function findItemIndex(
  arr: Array<number | string>,
  item: number | string
): number {
  const i = arr.findIndex((e) => e === item);
  return i;
}

const i = findItemIndex([1, 2, 3, 4], 3);
console.log(i);

function indexOf(arr, item) {
  if (Array.prototype.indexOf) {
    return arr.indexOf(item);
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return i;
    }
  }
  return -1;
}

/**
 * 在数组arr末尾添加元素item，不要直接修改数组arr，结果返回新的数组
 */
function getNewArr(
  arr: Array<number | string | boolean | number[] | string[] | object>,
  item: number | string | boolean | number[] | string[] | object
): Array<number | string | boolean | number[] | string[] | object> {
  // let newArr = [];
  // arr.forEach((element) => {
  //   newArr.push(element);
  // });
  // push会改变原数组
  // newArr.push(item);

  // concat不会改变原数组，concat对数组和非数组有包容性，都可以传
  // arr.concat(item);

  // slice也不会改变原数组，浅copy
  // arr.slice(0).push(item);

  const newArr = [...arr, item];
  return newArr;
}

/**
 * 移除数组arr中的所有值与item相等的元素，直接在给定的arr数组上进行操作，并将结果返回
 * 直接操作一般就是用splice(index, 1)
 */
function removeWithoutCopy(
  array: Array<number | string>,
  item: number | string
) {
  // 注意下标的变化，一般不会要求直接动原数组
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element === item) {
      array.splice(index, 1);
      index--;
    }
  }

  // 从后往前删，下标值不变
  // for (let index = array.length; index >= 0; index--) {
  //   const element = array[index];
  //   if (element === item) {
  //     array.splice(index, 1);
  //   }
  // }

  return array;

  // 不直接操作数组，不改变原数组
  let tempArr = array.filter((element) => element !== item);
  return tempArr;
}
