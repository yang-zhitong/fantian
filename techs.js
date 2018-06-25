require("./css/common.css");
require("./css/vr-robot.css");

if (!window.console) {
  window.console = {
    log: "",
    dir: "",
    warn: ""
  };
}

const $ = require("jquery");

$(".nav").on("click", ".nav-a", function(e) {
  $(this)
    .addClass("current")
    .siblings()
    .removeClass("current");
  var target = $(this).data("target");
  if (target) {
    e.preventDefault();
    var offset = $("." + target).offset().top || 0;
    $("body,html")
      .stop()
      .animate(
        {
          scrollTop: offset
        },
        1000
      );
  }
});

let url, queryId = getParameterByName("id") || 10;

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const ajaxLoad = [
  {
    name: "content",
    template: require("./src/vr-robot.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/technology_details/id/" + queryId,
  },
  {
    name: "footer",
    template: require("./src/footer.ejs"),
    url: "http://xiftkj.fantiankeji.com/fantistic/index.php/Home/index/companys"
  }
];

const navTemplate = require("./src/nav.ejs");


const hookClass = {
  content: function (temp, data) {
    $('.bg1').css({backgroundImage: `url(http://xiftkj.fantiankeji.com${data.data.picback})`})

    $(".J_content").html(temp(data));
    
    $(".nav").append($(navTemplate(data)));
  },
  footer: function(temp, data) {
    $(".J_footerInfo").html(temp(data));
    $(".J_profileContent").text(data.data[0].content); // 公司简介单独拿出来的
  }
};

function renderInOrder(index) {
  if (!ajaxLoad[index]) return false;
  const { url, template, name } = ajaxLoad[index];
  index++;
  $.get(url)
    .done(function(data) {
      if (data.code == 10000) {
        hookClass[name](template, data);
        renderInOrder(index);
      }
    })
    .fail(function(err) {
      if (err.code == 10000) {
        hookClass[name](template, data);
        renderInOrder(index);
      }
    });
}

renderInOrder(0);