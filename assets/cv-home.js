/* CODEDVINYLS 입고 목록 동작 (2026-10-26)
   · 「회현동 매장」 보기 = 같은 목록에서 매장 칸만(#store) · 스크립트가 없으면 전부 보인다.
   · 처음엔 24칸 · 「더 보기」로 24칸씩. */
(function () {
  "use strict";
  var main = document.querySelector(".cvl");
  if (!main) return;
  var root = document.documentElement;
  var STEP = 24;
  var cells = Array.prototype.slice.call(main.querySelectorAll(".cvl-cell"));
  var btn = main.querySelector(".cvl-morebtn");
  var chips = Array.prototype.slice.call(main.querySelectorAll(".cvl-chips a"));
  var shown = STEP;
  root.classList.add("cvl-js");

  function view() {
    return main.getAttribute("data-view") === "all" && location.hash === "#store" ? "store" : main.getAttribute("data-view");
  }
  function render() {
    var v = view(), n = 0, total = 0;
    cells.forEach(function (c) {
      var hit = v === "all" || c.getAttribute("data-kind") === v || (v === "online" && c.getAttribute("data-kind") === "online");
      c.classList.toggle("is-filtered", !hit);
      if (!hit) return;
      total++;
      c.classList.remove("cvl-more");
      c.classList.toggle("is-shown", n < shown);
      if (n >= shown) c.classList.add("cvl-more");
      n++;
    });
    if (btn) btn.hidden = total <= shown;
    chips.forEach(function (a) {
      var k = a.getAttribute("data-view");
      if (k === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
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

/* 홈 「최근 7일 입고」 아래 자켓 칸 전환 (2026-11-05)
   · 기본 = 온라인(자사몰 전까지 · 대표 261105) · 버튼은 보이기만 바꾼다 · 스크립트가 없으면 두 칸 다 보이고 버튼 = 목록 쪽 링크. */
(function () {
  "use strict";
  var box = document.querySelector(".cvh-tabs");
  if (!box) return;
  var chips = Array.prototype.slice.call(box.querySelectorAll("a[data-tab]"));
  var panes = Array.prototype.slice.call(box.querySelectorAll("[data-pane]"));
  var more = box.querySelector(".cvh-tabmore");
  box.classList.add("cvh-tabs-js");   // 전환 중엔 두 칸이 같은 자리(쌓임 간격 0)
  function show(k) {
    panes.forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== k; });
    chips.forEach(function (a) {
      if (a.getAttribute("data-tab") === k) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    if (more && more.getAttribute("data-" + k)) more.setAttribute("href", more.getAttribute("data-" + k));
  }
  chips.forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); show(a.getAttribute("data-tab")); });
  });
  show(box.getAttribute("data-tab") || "online");
})();
