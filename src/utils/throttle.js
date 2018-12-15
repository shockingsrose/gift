// 节流（一段时间内 只执行一次函数）例如：滚动下拉加载（用户疯狂下拉 但是数据还没有加载好）
function throttle(fn, wait) {
  let timer;
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, wait);
    }
  };
}

export default throttle;
