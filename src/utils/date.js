function dateTransText(stamp) {
  stamp = parseInt(stamp);
  var formatStamp = new Date(stamp);
  var str =
    `${
      formatStamp.getHours() < 10
        ? "0" + formatStamp.getHours()
        : formatStamp.getHours()
    }` +
    ":" +
    `${
      formatStamp.getMinutes() < 10
        ? "0" + formatStamp.getMinutes()
        : formatStamp.getMinutes()
    }`;
  var df = dateDiff(stamp);
  if (df < 0) {
    return "今天 " + str;
  } else if (df == 0) {
    return "昨天 " + str;
  } else if (df == 1) {
    return "前天 " + str;
  } else if (df >= 2 && df <= 7) {
    return "三天前";
  } else if (df > 7 && df <= 14) {
    return "一周前";
  } else {
    let timer = new Date(stamp);
    return timer.getMonth() + 1 + "/" + timer.getDate() + " " + str;
  }
}

function dateDiff(stamp) {
  stamp = parseInt(stamp);
  var today = new Date();
  var oneDayHours = 1000 * 60 * 60 * 24;
  var zeroPoint = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  return zeroPoint - stamp < 0
    ? -1
    : parseInt((zeroPoint - stamp) / oneDayHours);
}

export { dateTransText, dateDiff };
