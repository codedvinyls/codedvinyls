/* CODEDVINYLS 앨범 쪽 v3 — ① 사진 넘겨 보기(§6-4 · 2026-11-22 · 구현 ④) ② 들어 보기 그 자리 재생(2026-11-22 · s6)
   사진이 2장 이상이거나 영상이 특정된 판에만 실린다(site_album_detail_v3.main_html).
   ① 작은 사진을 누르거나 큰 사진을 누르면 다음 장 · 전환 효과 0. 스크립트 꺼짐 = 큰 사진 링크가 원본 사진을 그대로 연다.
   ② 「들어 보기」 줄의 영상 링크(data-yt)를 누르면 그 줄 아래에 재생기가 펼쳐진다 · 같은 링크를 다시 누르면(또는 Esc) 접힌다.
      누르기 전 = 바깥 요청 0(영상 틀 · 썸네일 없음). 주소 꼴 · 속성 = 지금 앨범 쪽 재생(album_detail.LISTEN_JS)과 같다.
      스크립트 꺼짐 · 새 창 열기 조합 키 = 링크 그대로 바깥으로. */
(function () {
  var vw = document.querySelector('.cv3-vw[data-photos]');
  if (!vw) return;
  var bs = [].slice.call(vw.querySelectorAll('.cv3-thumbs button'));
  var a = vw.querySelector('.cv3-zoom'), im = a && a.querySelector('img'), cnt = vw.querySelector('.cv3-scnt'), i = 0;
  if (!im || bs.length < 2) return;
  function go(k) {
    i = (k + bs.length) % bs.length;
    var src = bs[i].getAttribute('data-src');
    im.removeAttribute('srcset');
    im.src = src;
    a.href = src;
    bs.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    if (cnt) cnt.textContent = (i + 1) + ' / ' + bs.length;
  }
  bs.forEach(function (b, j) { b.addEventListener('click', function () { go(j); }); });
  a.addEventListener('click', function (e) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(i + 1);
  });
})();
(function () {
  var d = document, R = /^[A-Za-z0-9_-]{11}$/;
  var q = d.querySelector('.cv3-lisq');
  if (!q || !q.parentNode) return;
  var ls = [].slice.call(q.querySelectorAll('a[data-yt]')).filter(function (a) { return R.test(a.getAttribute('data-yt')); });
  if (!ls.length) return;
  var box = null, cur = null;
  function shut() {
    if (box && box.parentNode) box.parentNode.removeChild(box);
    if (cur) { cur.setAttribute('aria-expanded', 'false'); cur.removeAttribute('aria-controls'); }
    box = cur = null;
  }
  function show(a) {
    shut();
    var id = a.getAttribute('data-yt'), f = d.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
    f.title = a.getAttribute('data-yt-t') || '';
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    box = d.createElement('div');
    box.className = 'cv3-yt';
    box.id = 'cv3-yt';
    box.appendChild(f);
    q.parentNode.insertBefore(box, q.nextSibling);
    a.setAttribute('aria-expanded', 'true');
    a.setAttribute('aria-controls', 'cv3-yt');
    cur = a;
  }
  function flip(a) { if (cur === a) shut(); else show(a); }
  ls.forEach(function (a) {
    a.setAttribute('aria-expanded', 'false');
    a.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      flip(a);
    });
    a.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); flip(a); }
      else if ((e.key === 'Escape' || e.key === 'Esc') && cur === a) { e.preventDefault(); shut(); }
    });
  });
})();
