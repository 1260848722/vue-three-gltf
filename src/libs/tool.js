/**
 * @desc 函数防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 * @param immediate true - 立即执行， false - 延迟执行
 */
 export function debounce(func, wait = 300, immediate = true) {
    let timer;
    return function() {
      let context = this,
        args = arguments;
      if (timer) clearTimeout(timer);
      if (immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, wait);
        if (callNow) func.apply(context, args);
      } else {
        timer = setTimeout(() => {
          func.apply(context, args);
        }, wait)
      }
    }
  }

  export function getNowDate() {
    const addZero = val => val > 9 ? val : ('0' + val)
    const date = new Date();
    const year = date.getFullYear();
    const month = addZero(date.getMonth() + 1);
    const day = addZero(date.getDate());
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    const second = addZero(date.getSeconds());
    return [year, month, day, hour, minute, second];
  }