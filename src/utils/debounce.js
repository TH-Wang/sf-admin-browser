export default function debounce(fn, wait = 500) {
  let timer = null;
  return function() {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, wait);
  };
}
