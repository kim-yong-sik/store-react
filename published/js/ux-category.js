// 2021-10-08 카테고리 상단 메뉴 1뎁스 & 2뎁스 전용 스크립트
const category = ".category__header__menu";
const submenu = $(category).find(".swiper-slide");
const activeClass = "category__header__menu--active";
const isSub = $(".category__header").hasClass("category__header__sub");
const vw = window.innerWidth;
const mo = 640;
const tab = 1280;

submenu.on("click", e => {
  e.preventDefault();

  let slide = $(e.currentTarget);

  if (!slide.hasClass(activeClass)) {
    submenu.filter("."+activeClass).removeClass(activeClass);
    slide.addClass(activeClass);
    // [dev] do filter!!
  }
});

if (submenu.length < 4) {
  // 메뉴가 4개 미만일때
  // 버튼 숨김
  $(category).find(".swiper-button-next, .swiper-button-prev").hide();

  if (isSub) {
    // 2뎁스의 경우
    if (submenu.length === 1) {
      // 전체보기 하나일 경우 숨김
      submenu.css("visibility", "hidden");
    } else {
      // 메뉴가 2개 혹은 3개 일때 메뉴 너비 1/n (사실 2개는 있을 수 없음)
      check2depth();
      $(window).resize(() => {
        check2depth();
      });
    };
  };
} else if (submenu.length >= 4) {
  if (isSub) {
    // 2뎁스의 경우
    $(category).find(".swiper-wrapper").removeClass("centered");
  } else {
    // 1뎁스의 경우
    check1depth();
    $(window).resize(() => {
      check1depth();
    });
  };

  // 메뉴가 4개 이상일때 스와이프 생성
  new Swiper(category, {
    slidesPerView: "auto",
    breakpoints: {
      320: {
        allowTouchMove: true,
      },
      1281: {
        allowTouchMove: false,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
function check1depth () {
  const vw = window.innerWidth;
  const firstChild = submenu.filter(":first-child");
  let itemWidth;

  if (vw > tab) {
    // PC의 경우 중앙 정렬
    $(category).find(".swiper-wrapper").addClass("centered");
    firstChild.removeAttr("style");
  } else {
    // mobile의 경우 좌측 정렬
    $(category).find(".swiper-wrapper").removeClass("centered");
    if (vw <= mo) {
      // mobile의 경우
      itemWidth = 304;
    } else {
      // tablet의 경우
      itemWidth = 632;
    };
    if (vw > itemWidth) {
      firstChild.css("marginLeft", (vw - itemWidth) / 2);
    } else {
      firstChild.removeAttr("style");
    }
  };
  // submenu.filter(":first-child").css("marginLeft", "48px");
}
function check2depth () {
  // 2뎁스 && 메뉴 4개 미만일때 메뉴 너비 지정
  const vw = window.innerWidth;

  if (vw <= tab) {
    submenu.width(vw / submenu.length);
    submenu.find("a").css({display: "block", width: "100%", paddingTop: "1em"});
    if (vw <= mo) {
      submenu.find("a").css({paddingTop: "1.2em"});
    }
  } else {
    submenu.removeAttr("style");
    submenu.find("a").removeAttr("style");
  }
}