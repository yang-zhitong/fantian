require("./css/common.css");
require("./css/index.css");
require("./css/estate.css");
require("./css/tech.css");
require("./css/communities.css");
require("./css/partner.css");

const $ = require("jquery");

var elemTops = [];
var $nava = $(".nav-a");

$nava.each(function () {
  var target = $(this).data("target");
  var offset = ($("." + target).offset() || 0).top || 0;
  elemTops.push(offset);
});

$(window).scroll(function (event) {
  var top = $(window).scrollTop();
  for (var i = 0; i < elemTops.length; i++) {
    if (top >= elemTops[i] && top < elemTops[i + 1]) {
      $nava
        .eq(i)
        .addClass("current")
        .siblings()
        .removeClass("current");
    }
  }
});

if (!window.console) {
  window.console = {
    log: "",
    dir: "",
    warn: ""
  };
}

$(".nav").on("click", ".nav-a", function (e) {
  e.preventDefault();
  $(this)
    .addClass("current")
    .siblings()
    .removeClass("current");
  var target = $(this).data("target");
  var offset = $("." + target).offset().top || 0;
  $("body,html")
    .stop()
    .animate({
        scrollTop: offset
      },
      1000
    );
});

function timeFormat(phpT) {
  var dateObj = new Date(phpT * 1000),
    month = dateObj.getMonth() + 1,
    year = dateObj.getFullYear(),
    day = dateObj.getDate();
  if (month < 10) month = "0" + month;
  return year + "-" + month + "-" + day;
}

window.timeFormat = timeFormat;

const ajaxLoad = [{
    name: "estate",
    template: require("./src/estate.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/wisdom"
  },
  {
    name: "techs",
    template: require("./src/techs.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/technology"
  },
  {
    name: "communities",
    template: require("./src/communities.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/cases"
  },
  {
    name: "news",
    template: require("./src/news.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/news"
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

const hookClass = {
  estate: function (temp, data) {
    window.estateData = data;
    $(".J_videosPlay").html(temp(data));
    estateEvent();
  },
  techs: function (temp, data) {
    $(".J_slideTechs").html(temp(data));
    $(".J_slideTechs").unslider({
      arrows: {
        prev: '<a class="unslider-arrow prev">&lt;</a>',
        next: '<a class="unslider-arrow next">&gt;</a>'
      }
    });
  },
  communities: function (temp, data) {
    window.commuData = data.data;
    $(".J_slideThumbnails").html(temp(data));
    commuEvent();
  },
  news: function (temp, data) {
    $(".J_showNews").html(temp(data));
    $('.J_flip').hover(function () {
      $(this).find('.news-img-box').addClass('flipInX');
    }, function () {
      $(this).find('.news-img-box').removeClass('flipInX');
    });
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
  $.get(url, function (data) {
    hookClass[name](template, data);
    renderInOrder(index);
  });
}

renderInOrder(0);

function estateEvent() {
  // 视频播放
  $(".J_videosPlay").on("click", ".video", function () {
    var $this = $(this),
      clickData = window.estateData.data[$this.index()],
      $videoBox = $(".J_videoBox"),
      $preload = $videoBox.find(".preload"),
      $embed = $videoBox.find(".embed"),
      $text = $videoBox.find(".text"),
      $parent = $this.parents(".black-ipad");

    var preloadText =
      '<img src="' +
      clickData.picone +
      '" class="preload-img"><p class="preload-cn">' +
      clickData.title +
      '</p><p class="preload-en">' +
      clickData.english +
      "</p>";
    var queue = [
      function (next) {
        $parent.siblings(".hand").addClass("far");
        next();
      },
      function (next) {
        $parent.fadeOut(1000, function () {
          next();
        });
      },
      function (next) {
        $embed.removeClass("show").find('embed').remove();
        $preload.removeClass("hide").html(preloadText);
        $videoBox.fadeIn(1000, function () {
          $preload.addClass("hide");
          $text.text(clickData.content);
          var embedHtml =
            '<embed  src="' +
            clickData.view +
            '" allowFullScreen="true" quality="high" width="100%" height="690px" align="middle" allowScriptAccess="always"type="application/x-shockwave-flash" />';
          $embed.addClass("show").append($(embedHtml));
        });
      }
    ];
    $(document).queue("videoAni", queue);
    $(document).dequeue("videoAni");
    $(".nav-a .cn")
      .eq(0)
      .text("返回首页")
      .one("click", function (e) {
        e.preventDefault();
        $(this).text("智慧地产");
        $videoBox.fadeOut(function () {
          $parent.fadeIn();
          $parent.siblings(".hand").removeClass("far");
        });
        return false;
      });
  });
}

function commuEvent() {
  var $thumbnails = $(".J_slideThumbnails");
  $thumbnails.unslider({
    animation: "fade",
    arrows: {
      prev: '<a class="sprite arrow-left prev">&lt;</a>',
      next: '<a class="sprite arrow-right next">&gt;</a>'
    }
  });
  $thumbnails.css({
    overflow: "visible"
  });

  $thumbnails.on("click", ".figure-img", function () {
    var $this = $(this),
      $Jslide = $(".J_slidePics"),
      parentIndex = $this.data("parentindex"),
      childIndex = $this.data("childindex"),
      src = $this.find("img").attr("src"),
      $figure = $this.parent(),
      $clone = $figure.clone().addClass("flying");

    fadeText(parentIndex, childIndex);

    var view = window.commuData[parentIndex][childIndex].view;
    var embedHtml =
    '<embed  src="' +
    view +
    '" allowFullScreen="true" quality="high" width="100%" height="100%" align="middle" allowScriptAccess="always"type="application/x-shockwave-flash" />';

    $Jslide.find('.slide-pics').html('').append($(embedHtml));
  });

  // 触发
  $(".J_slideThumbnails .figure-img")
    .eq(0)
    .trigger("click");
}

// 飞之前替换文字
function fadeText(pi, ci) {
  var $texts = $(".J_whiteIpad"),
    cData = window.commuData[pi][ci];
  $texts.find(".area-title").text(cData.title);
  $texts
    .find(".area-name")
    .fadeOut(function () {
      $(this).text(cData.name);
    })
    .delay(500)
    .fadeIn();
  $texts
    .find(".area-intro")
    .fadeOut(function () {
      $(this).text(cData.content);
    })
    .delay(500)
    .fadeIn();
}

// ipad看房轮播
function picSlide(pi, ci) {
  var srcs = window.commuData[pi][ci].imageL;
  var tmpHtml = "",
    $pics = $(".J_slidePics");
  $.each(srcs, function (index, item) {
    tmpHtml += '<li><img src="' + item.image + '"</li>';
  });

  $pics.find(".pics-wrap").html(tmpHtml);
  var slider = $pics.find(".slide-pics");

  // slider.on("unslider.ready", function() {
  //   $pics
  //     .find(".pics-wrap")
  //     .addClass("scale")
  //     .animate({
  //       opacity: 1,
  //       width: "100%",
  //       height: "100%"
  //     }, 1000);
  // });

  slider.unslider({
    animation: "fade",
    speed: 1500,
    autoplay: true,
    arrows: false
  });
}

const imgsArr = [
  [{
    selector: "hand",
    url: require("./images/images/hand_sprite.png"),
    callback: function () {
      $(".hand").removeClass("far");
    }
  }]
];

function imgsArrLoop(parentIndex) {
  if (!imgsArr[parentIndex]) return false;
  imgsArr[parentIndex].forEach(function (imgObj, childIndex) {
    var img = new Image(),
      cb = imgObj.callback,
      selector = imgObj.selector,
      url = imgObj.url;
    img.onload = function () {
      $("." + selector).css("background-image", 'url("' + img.src + '")');
      if (cb) cb();
      if (childIndex === imgsArr[parentIndex].length - 1) {
        parentIndex++;
        imgsArrLoop(parentIndex);
      }
    };
    img.src = url;
  });
}

imgsArrLoop(0);