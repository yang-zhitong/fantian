require("./css/common.css");
require('./css/news.css');

if (!window.console) {
  window.console = {
    log: "",
    dir: "",
    warn: ""
  };
}

function timeFormat(phpT) {
  var dateObj = new Date(phpT * 1000),
    month = dateObj.getMonth() + 1,
    year = dateObj.getFullYear(),
    day = dateObj.getDate();
  if (month < 10) month = "0" + month;
  return year + "-" + month + "-" + day;
}

window.timeFormat = timeFormat;

$(".nav").on("click", ".nav-a", function (e) {
  $(this).addClass('current').siblings().removeClass('current');
  var target = $(this).data("target");
  if (target) {
    e.preventDefault();
    var offset = $("." + target).offset().top || 0;
    $("body,html")
      .stop()
      .animate({
        scrollTop: offset
      }, 1000);
  }
});

var temp = require('./src/newsDetail.ejs');
var articles;
var articleIndex = Number(window.location.pathname.split('/').pop());

articleIndex = /^\d+$/.test(articleIndex) ? articleIndex : 2;


// $("body").on("click", "p.btn", function () {
//   var $this = $(this);
//   if ($this.hasClass("last")) {
//     articleIndex--;
//   } else {
//     articleIndex++;
//   }
//   if (articleIndex < 0) {
//     articleIndex = articles.length - 1;
//   } else if (articleIndex >= articles.length) {
//     articleIndex = 0;
//   }
//   newsRender();
// });

function newsRender() {
  if (!articles[articleIndex].alt1) articles[articleIndex].alt1 = '';
  if (!articles[articleIndex].alt2) articles[articleIndex].alt2 = '';
  $(".content").html(temp(articles[articleIndex]));
  var len = articles.length,
    last = (articleIndex - 1 + len) % len,
    next = (articleIndex + 1 + len) % len,
    tmpHtml = `<a href="/Home/News/index/id/${last}" style="color: #6979c4;" class="last btn">上一篇<span class="news-name">${articles[last].title}</span></a>`;
  tmpHtml += `<a href="/Home/News/index/id/${next}" style="color: #6979c4;" class="next btn">下一篇<span class="news-name">${articles[next].title}</span></a>`;
  $(".J_pageBox").html(tmpHtml);
}


// var img = new Image();
// img.onload = function () {
//   $(".J_content").css({
//     'backgroundImage': 'url("' + img.src + '")'
//   }).fadeIn(2000);
// };
// img.src = require('./images/new_content_bg_min.png');

  $(".J_content").fadeIn(2000);

const ajaxLoad = [{
    name: "content",
    template: temp,
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/news_details"
  },
  {
    name: "footer",
    template: require("./src/footer.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/companys"
  },
  {
    name: "partner",
    template: require("./src/partner.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/enterprise"
  },
];

const navTemplate = require("./src/nav.ejs");

const hookClass = {
  content: function (temp, data) {
    articles = data.data;
    newsRender();
    $(".nav").append($(navTemplate(data)));
  },
  footer: function (temp, data) {
    $(".J_footerInfo").html(temp(data));
    $(".J_profileContent").text(data.data[0].content); // 公司简介单独拿出来的
    $('.J_weibo').appendTo('.J_footerInfo .three-way');
  },
  partner: function (temp, data) {
    var flatarr = data.data.reduce(function(total, cur, index) {
      return total.concat(cur);
    }, []);
    $(".J_partner").html(temp({data: flatarr}));
  },
};

function renderInOrder(index) {
  if (!ajaxLoad[index]) return false;
  const {
    url,
    template,
    name
  } = ajaxLoad[index];
  index++;
  $.get(url)
    .done(function (data) {
      if (data.code == 10000) {
        hookClass[name](template, data);
        renderInOrder(index);
      }
    })
    .fail(function (err) {
      if (err.code == 10000) {
        hookClass[name](template, data);
        renderInOrder(index);
      }
    });
}

renderInOrder(0);