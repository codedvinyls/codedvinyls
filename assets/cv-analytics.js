/* cv-analytics — codedvinyls.com 방문 분석 (GA4)
   측정ID는 공개 클라이언트 식별자(시크릿 아님). 노출·유입·체류시간·페이지뷰 추적.
   네이버 애널리틱스 추가 시 이 파일 하단에 wcs 스니펫 append. */
(function () {
  var GA_ID = 'G-VW6XFTKSG8';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

/* 네이버 애널리틱스 (wcs) — 네이버 검색유입 추적. wa=공개 클라이언트 ID(시크릿 아님). */
(function () {
  var NA_ID = 'a855c1ef37a6a8';
  var w = document.createElement('script');
  w.async = true;
  w.src = 'https://wcs.pstatic.net/wcslog.js';
  w.onload = function () {
    if (!window.wcs_add) window.wcs_add = {};
    window.wcs_add['wa'] = NA_ID;
    if (window.wcs) window.wcs_do();
  };
  document.head.appendChild(w);
})();

/* ★261105 [261105-3차] 전환 측정 — 스마트스토어로 넘어가는 클릭 = GA4 이벤트 smartstore_click.
   GA4 향상된 측정(외부 링크 click) 설정과 상관없이 잡는다 · 개인정보 0(주소·상품번호만).
   수집 = GA4 → 일간·주간 리포트. */
(function () {
  var HOST_RE = /(^|\.)smartstore\.naver\.com$/i;
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !window.gtag) return;
    var host = a.hostname || '';
    if (!HOST_RE.test(host)) return;
    var m = (a.pathname || '').match(/\/products\/(\d+)/);
    window.gtag('event', 'smartstore_click', {
      link_url: a.href,
      product_no: m ? m[1] : '',
      page_path: location.pathname
    });
  }, true);
})();
