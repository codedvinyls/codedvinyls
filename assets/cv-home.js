/* CODEDVINYLS 입고 목록 동작 (2026-10-26)
   · 「회현동 매장」 보기 = 같은 목록에서 매장 칸만(#store) · 스크립트가 없으면 전부 보인다.
   · 처음엔 24칸 · 「더 보기」로 24칸씩.
   홈 둘러보기 자리 레이블 고르는 칸 — 맨 아래 절. */
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

/* 홈 둘러보기 자리 레이블 고르는 칸(HTML 은 hidden = 자리만 · 여기서 연다 · /album/ 필터 줄과 같은 규칙)
   고르면 /album/?label=<값>(cv-album.js 가 읽는 꼴) · 뒤로 돌아오면 첫 칸으로(pageshow)
   첫 칸 = 빈 값 · 골라도 이동 0 */
(function () {
  "use strict";
  var box = document.querySelector(".cvh-sel"), sel = box && box.querySelector("select");
  if (!sel) return;
  box.hidden = false;
  sel.addEventListener("change", function () {
    if (!sel.value) return;
    location.href = sel.getAttribute("data-go") + encodeURIComponent(sel.value);
  });
  window.addEventListener("pageshow", function () { sel.value = ""; });
})();
