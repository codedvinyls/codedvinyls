/* ──────────────────────────────────────────────────────────────
   CODEDVINYLS 랜딩 네비게이터 (cv-nav) — 2026-06-06
   전역 빠른이동(사이트맵) + 긴 글 섹션 점프(목차/스크롤스파이).
   사이트맵 정본은 이 파일의 SITE 배열 단 한 곳. 새 페이지는 cv-nav.css/js 링크만 추가.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  if (window.__cvNavLoaded) return; window.__cvNavLoaded = true;

  // ── 사이트맵 정본 ──
  var SITE = [
    { kr: "홈",          en: "HOME",         href: "index.html" },
    { kr: "신보 입고",    en: "NEW ARRIVALS", href: "new-arrivals-260606.html" },
    { kr: "큐레이션",     en: "CURATION",     href: "index.html#curation" },
    { kr: "청음 세션",    en: "LISTENING",    href: "index.html#listening" },
    { kr: "저널",        en: "JOURNAL",      href: "journal-original-pressing.html" },
    { kr: "그레이딩",     en: "GRADING",      href: "grading.html" },
    { kr: "보존 관리",    en: "ARCHIVAL",     href: "standard.html" },
    { kr: "매장 방문",    en: "VISIT",        href: "index.html#visit" },
    { kr: "스토어",       en: "STORE",        href: "https://smartstore.naver.com/codedvinyls", ext: true }
  ];

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  function fileOf(href) { return (href.split("#")[0].split("/").pop() || "index.html").toLowerCase(); }

  // ── 이 페이지 섹션 수집 ──
  function slug(s, i) {
    var b = (s || "").trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "");
    return "sec-" + (b || "x") + "-" + i;
  }
  function collectSections() {
    var out = [];
    var explicit = document.querySelectorAll("[data-cv-section]");
    if (explicit.length) {
      explicit.forEach(function (el, i) {
        if (!el.id) el.id = slug(el.getAttribute("data-cv-section"), i);
        out.push({ id: el.id, label: el.getAttribute("data-cv-section") || el.id, el: el });
      });
      return out;
    }
    var groups = document.querySelectorAll(".rec-group[id]");
    if (groups.length) {
      groups.forEach(function (el) {
        var h = el.querySelector(".group-head h2 .display") || el.querySelector(".group-head h2") || el.querySelector("h2");
        out.push({ id: el.id, label: h ? h.textContent.trim() : el.id, el: el });
      });
      return out;
    }
    var hs = document.querySelectorAll("article .prose h2, article h2");
    hs.forEach(function (h, i) {
      if (!h.id) h.id = slug(h.textContent, i);
      out.push({ id: h.id, label: h.textContent.replace(/\s+/g, " ").trim(), el: h });
    });
    return out;
  }
  var sections = collectSections();

  // ── DOM 빌드 ──
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var fab = el("button", "cv-fab");
  fab.type = "button";
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "cvPanel");
  fab.setAttribute("aria-label", "메뉴 열기 — 페이지 이동");
  fab.innerHTML = '<span class="cv-fab-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="cv-fab-txt">메뉴</span><span class="cv-fab-here" aria-hidden="true"></span>';

  var scrim = el("div", "cv-scrim");
  var panel = el("nav", "cv-panel"); panel.id = "cvPanel"; panel.setAttribute("aria-label", "사이트 내비게이션");

  // 이 페이지 섹션 그룹 (있을 때만)
  var railLinks = [], panelSectionLinks = [];
  if (sections.length >= 2) {
    var g1 = el("div", "cv-grp");
    g1.appendChild(el("div", "cv-grp-h", "이 페이지"));
    sections.forEach(function (s) {
      var a = el("a", "cv-sec-link");
      a.href = "#" + s.id;
      a.innerHTML = '<span class="cv-kr"></span>';
      a.querySelector(".cv-kr").textContent = s.label;
      a.dataset.target = s.id;
      g1.appendChild(a);
      panelSectionLinks.push(a);
    });
    panel.appendChild(g1);
  }

  // 둘러보기(사이트맵) 그룹
  var g2 = el("div", "cv-grp");
  g2.appendChild(el("div", "cv-grp-h", "둘러보기"));
  SITE.forEach(function (item) {
    var a = el("a");
    if (item.ext) { a.target = "_blank"; a.rel = "noopener"; a.className = "ext"; }
    a.href = item.href;
    a.innerHTML = '<span class="cv-kr"></span><span class="cv-en"></span>';
    a.querySelector(".cv-kr").textContent = item.kr;
    a.querySelector(".cv-en").textContent = item.en;
    if (!item.ext && fileOf(item.href) === page && item.href.indexOf("#") === -1) {
      a.classList.add("is-current"); a.setAttribute("aria-current", "page");
    }
    g2.appendChild(a);
  });
  panel.appendChild(g2);

  // 우측 레일 (긴 글)
  var rail = null;
  if (sections.length >= 3) {
    rail = el("nav", "cv-rail"); rail.setAttribute("aria-label", "페이지 섹션");
    sections.forEach(function (s) {
      var a = el("a");
      a.href = "#" + s.id; a.dataset.target = s.id;
      a.innerHTML = '<span class="cv-rail-label"></span><span class="cv-rail-dot"></span>';
      a.querySelector(".cv-rail-label").textContent = s.label;
      rail.appendChild(a);
      railLinks.push(a);
    });
  }

  document.body.appendChild(scrim);
  document.body.appendChild(panel);
  document.body.appendChild(fab);
  if (rail) document.body.appendChild(rail);

  // ── 열고 닫기 ──
  function open() { fab.setAttribute("aria-expanded", "true"); panel.classList.add("open"); scrim.classList.add("open"); }
  function close() { fab.setAttribute("aria-expanded", "false"); panel.classList.remove("open"); scrim.classList.remove("open"); }
  function toggle() { (fab.getAttribute("aria-expanded") === "true") ? close() : open(); }
  fab.addEventListener("click", toggle);
  scrim.addEventListener("click", close);
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  // ── 스무스 스크롤 (섹션 링크) ──
  function smoothTo(id) {
    var t = document.getElementById(id); if (!t) return;
    t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#" + id);
  }
  [].concat(panelSectionLinks, railLinks).forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); smoothTo(a.dataset.target); });
  });

  // ── 스크롤스파이 ──
  if (sections.length >= 2 && "IntersectionObserver" in window) {
    var current = null;
    function setActive(id) {
      if (id === current) return; current = id;
      railLinks.concat(panelSectionLinks).forEach(function (a) {
        a.classList.toggle("is-active", a.dataset.target === id);
      });
      var s = sections.filter(function (x) { return x.id === id; })[0];
      if (s) { fab.classList.add("has-here"); fab.querySelector(".cv-fab-here").textContent = "· " + s.label; }
    }
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var best = null, bestR = 0;
      sections.forEach(function (s) { var r = visible[s.id] || 0; if (r > bestR) { bestR = r; best = s.id; } });
      if (best) setActive(best);
    }, { rootMargin: "-15% 0px -55% 0px", threshold: [0, .25, .5, 1] });
    sections.forEach(function (s) { io.observe(s.el); });
  }
})();
