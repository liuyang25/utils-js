export function timeFormat(timestamp, format) {
  if (!timestamp) {
    return '';
  }
  let fmt = format;
  if (!fmt) {
    fmt = 'YYYY-MM-DD hh:mm:ss';
  }
  const t = new Date(timestamp);
  const o = {
    'M+': t.getMonth() + 1, // 月份
    'D+': t.getDate(), // 日
    'h+': t.getHours(), // 小时
    'm+': t.getMinutes(), // 分
    's+': t.getSeconds(), // 秒
    'q+': Math.floor((t.getMonth() + 3) / 3), // 季度
    S: t.getMilliseconds(), // 毫秒
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${t.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
}

/*
 * 修改默认的HTML的rem大小，做到自适应屏幕大小
 * @param {Interge} width 屏幕尺寸
 */
function resetRem(width = 375) {
  const html1 = document.documentElement;

  function getscreen() {
    const screenWidth = html1.clientWidth;
    html1.style.fontSize = `${(100 / width) * screenWidth}px`;
  }

  getscreen();
  window.onresize = getscreen;
}

//浏览器视口的高度

function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

// 浏览器视口宽度

function getWindowWidth() {
  return document.documentElement.clientWidth || window.innerWidth
}

/**
 * 修复iOS9、iOS10里面WKWebView滚轮问题
 *
 */
function WKScrollBugFixed() {
  //滚动条在Y轴上的滚动距离
  function getScrollTop() {
    let scrollTop = 0,
      bodyScrollTop = 0,
      documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  }

  //文档的总高度
  function getScrollHeight() {
    let scrollHeight = 0,
      bodyScrollHeight = 0,
      documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  }


  function scrollFixed() {
    let scrollHeight = getScrollHeight();
    if (getScrollTop() + getWindowHeight() >= scrollHeight) {
      window.scrollTo(0, scrollHeight - 1)
    } else if (getScrollTop() <= 0) {
      window.scrollTo(0, 1);
    }
  };

  window.onscroll = scrollFixed;
  window.onresize = scrollFixed;
}

/**
 * 闭包缓存纯函数的结果
 * @param {Function} fn
 */
function cached(fn) {
  const cache = Object.create(null);
  return ((...argv) => {
    const key = Array.prototype.join.call(argv, '_');
    const hit = cache[key];
    // if (hit) { console.log('hit', hit); }
    // eslint-disable-next-line
    return hit || (cache[key] = Reflect.apply(fn, null, argv));
  });
}