function showTime(endTime) {
  const transTime = (time) => {
    if (typeof time === 'number') {
      return time;
    } else if (typeof time === 'string') {
      return Date.parse(new Date(time));
    } else if (Object.prototype.toString.call(endTime) === '[object Date]') {
      return Date.parse(time);
    } else {
      return '错误的时间格式';
    }
  };
  endTime = transTime(endTime);
  let value = (endTime - Date.now()) / 1000;
  if (value <= 0) {
    return false;
  } else {
    const day = parseInt(value / (24 * 60 * 60));
    value = value - day * (24 * 60 * 60);
    const hour = parseInt(value / (60 * 60));
    value = value - hour * (60 * 60);
    const min = parseInt(value / 60);
    const second = parseInt(value - min * 60);
    return {
      day,
      hour,
      min,
      second
    };
  }
}

export default showTime;
