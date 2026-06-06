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
