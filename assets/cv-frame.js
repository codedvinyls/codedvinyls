/* CODEDVINYLS 공통 틀 동작 (2026-10-26)
   · 휴대폰 「메뉴」 → 화면 전체 시트(닫기 · Esc · 링크 누름). 스크립트가 없어도 #cvf-sheet 로 열린다.
   · 아래로 내리면 머리를 숨기고, 위로 밀면 다시 보인다. 늘 떠 있는 요소는 없다. */
(function () {
  "use strict";
  if (window.__cvFrame) return; window.__cvFrame = true;
  var root = document.documentElement;
  var hd = document.querySelector("[data-cvf-hd]");
  var sheet = document.getElementById("cvf-sheet");
  var btn = document.querySelector(".cvf-menu");
  var lastFocus = null;

  function open() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.classList.add("is-open");
    root.classList.add("cvf-lock");
    if (btn) btn.setAttribute("aria-expanded", "true");
    var first = sheet.querySelector(".cvf-sheet-nav a");
    if (first) first.focus({ preventScroll: true });
  }
  function close() {
    if (!sheet) return;
    sheet.classList.remove("is-open");
    root.classList.remove("cvf-lock");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (location.hash === "#cvf-sheet" && history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  if (btn) btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
  if (sheet) {
    var x = sheet.querySelector(".cvf-close");
    if (x) x.addEventListener("click", function (e) { e.preventDefault(); close(); });
    sheet.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a && !a.classList.contains("cvf-close") && a.getAttribute("href").charAt(0) !== "#") close();
    });
    if (location.hash === "#cvf-sheet") open();
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet && sheet.classList.contains("is-open")) close();
  });

  if (!hd) return;
  var lastY = window.pageYOffset || 0, ticking = false;
  function onScroll() {
    var y = window.pageYOffset || 0;
    hd.classList.toggle("is-stuck", y > 4);
    if (y > 160 && y > lastY + 6) hd.classList.add("is-hidden");
    else if (y < lastY - 6 || y <= 160) hd.classList.remove("is-hidden");
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  hd.addEventListener("focusin", function () { hd.classList.remove("is-hidden"); });
})();
