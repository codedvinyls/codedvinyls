/* CODEDVINYLS 앨범 (2026-10-26 · 단계 3a·3b).
   ① 상세 창 → 앨범 링크: 갤러리 칸 안 숨은 a.gal-album 을 상세 창이 열릴 때 창 안에 보인다(3a).
   ② 자켓 직행(3b): a.gal-album.is-direct 가 있는 칸의 자켓을 누르면 상세 창 대신 앨범 페이지로 간다.
      옛 공유 주소(#키)로 들어오면 상세 창은 그대로 열린다.
   ③ 앨범 목록(3b): 보기 칩(판매 중 / 다룬 판 전체) · 「더 보기」(24칸씩). JS 없으면 전체가 보인다. */
(function(){
  /* ② 자켓 직행 — 상세 창 스크립트보다 먼저(잡기 단계) */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.gal-open'):null;if(!b)return;
    var it=b.closest('.gal-item'),a=it?it.querySelector('a.gal-album.is-direct'):null;if(!a)return;
    e.preventDefault();e.stopImmediatePropagation();location.href=a.getAttribute('href');
  },true);

  /* ① 상세 창 안 링크 */
  var d=document.getElementById('gal-lb');
  if(d){var body=d.querySelector('.gal-lb-body');
    if(body){var box=document.createElement('p');box.className='gal-lb-album';box.hidden=true;body.appendChild(box);
      var cur=null;
      document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('.gal-item,.dp-row'):null;if(t)cur=t;},true);
      var sync=function(){if(!d.open){cur=null;return;}var it=cur;
        if(!it){var k=decodeURIComponent(location.hash.slice(1));it=k?document.getElementById(k):null;}
        var a=it?it.querySelector('a.gal-album'):null;box.innerHTML='';
        if(a){var c=a.cloneNode(true);c.hidden=false;c.removeAttribute('hidden');box.appendChild(c);box.hidden=false;}else box.hidden=true;};
      if(window.MutationObserver)new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['open']});
      if(d.open)sync();}}

  /* ③ 앨범 목록 — 칩 「판매 중」(기본 · /album/) · 「다룬 판 전체」(#all) · 다시 읽지 않고 거르기만 */
  var L=document.querySelector('.cval');if(!L)return;
  var cells=[].slice.call(L.querySelectorAll('.cval-cell')),chips=[].slice.call(L.querySelectorAll('.cval-chips a')),STEP=24,shown=STEP;
  var first=L.getAttribute('data-first')||'all';
  L.classList.add('cval-js');
  var more=document.createElement('div');more.className='cval-morebox';
  var btn=document.createElement('button');btn.type='button';btn.className='cval-morebtn';btn.textContent=L.getAttribute('data-more')||'';
  more.appendChild(btn);var gl=L.querySelector('.cval-genres');L.insertBefore(more,gl||null);
  function view(){return (location.hash||'').slice(1)==='all'?'all':first;}
  function paint(){var v=view(),n=0;
    chips.forEach(function(c){if(c.getAttribute('data-view')===v)c.setAttribute('aria-current','page');else c.removeAttribute('aria-current');});
    cells.forEach(function(c){var on=v==='all'||c.getAttribute('data-on')==='1';c.classList.toggle('is-off',!on);
      if(on){n++;c.classList.toggle('is-later',n>shown);}else c.classList.remove('is-later');});
    more.hidden=n<=shown;}
  chips.forEach(function(c){c.addEventListener('click',function(e){
    var v=c.getAttribute('data-view');e.preventDefault();
    if(history.pushState)history.pushState(null,'',v==='all'?'#all':location.pathname);else location.hash=v==='all'?'all':'';
    shown=STEP;paint();});});
  btn.addEventListener('click',function(){shown+=STEP;paint();});
  window.addEventListener('hashchange',function(){shown=STEP;paint();});
  window.addEventListener('popstate',function(){shown=STEP;paint();});
  paint();
})();
