/* CODEDVINYLS 입고 목록 v3 동작 (2026-11-22 · 구현 ⑤) — 지금 목록 동작과 같은 규칙.
   · 「회현동 매장」 보기 = 같은 목록에서 매장 줄만(#store) · 스크립트가 없으면 전부 보인다.
   · 처음엔 24줄 · 「더 보기」로 24줄씩. 바깥 주소 0. */
(function () {
  "use strict";
  var main = document.querySelector(".cv3-arr");
  if (!main) return;
  var STEP = 24;
  var rows = Array.prototype.slice.call(main.querySelectorAll(".cv3-rw"));
  var btn = main.querySelector(".cv3-amore");
  var chips = Array.prototype.slice.call(main.querySelectorAll(".cv3-achips a"));
  var shown = STEP;
  document.documentElement.classList.add("cv3-js");

  function view() {
    return main.getAttribute("data-view") === "all" && location.hash === "#store" ? "store" : main.getAttribute("data-view");
  }
  function render() {
    var v = view(), n = 0, total = 0;
    rows.forEach(function (c) {
      var hit = v === "all" || c.getAttribute("data-kind") === v;
      c.classList.toggle("cv3-rw-off", !hit);
      c.classList.remove("cv3-rw-more");
      if (!hit) return;
      total++;
      if (n >= shown) c.classList.add("cv3-rw-more");
      n++;
    });
    if (btn) btn.hidden = total <= shown;
    chips.forEach(function (a) {
      if (a.getAttribute("data-view") === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  if (btn) btn.addEventListener("click", function () { shown += STEP; render(); });
  chips.forEach(function (a) {
    var k = a.getAttribute("data-view");
    if (main.getAttribute("data-view") !== "all" || k === "online") return;   // 온라인 = /update/ 로 간다
    a.addEventListener("click", function (e) {
      e.preventDefault();
      shown = STEP;
      if (k === "store") history.replaceState(null, "", "#store");
      else history.replaceState(null, "", location.pathname);
      render();
    });
  });
  window.addEventListener("hashchange", function () { shown = STEP; render(); });
  render();
})();
