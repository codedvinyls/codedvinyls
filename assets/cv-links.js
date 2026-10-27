/* CODEDVINYLS 판 묶음 (2026-10-27 · 단계 4) — 묶음마다 보기 칩(판매 중 / 다룬 판 전체) · 처음 data-n 칸(8) · 「더 보기」 한 번에 data-step 칸(24).
   JS 없으면 칩은 숨고 칸은 전부 보인다. 주소(#)는 바꾸지 않는다 — 묶음 안에서만 거른다(앨범 목록 /album/ 은 cv-album.js). */
(function(){
  [].forEach.call(document.querySelectorAll('.cvl[data-step]'),function(L){
    var cells=[].slice.call(L.querySelectorAll('.cval-cell')),box=L.querySelector('.cvl-chips'),
        chips=box?[].slice.call(box.querySelectorAll('button')):[],
        STEP=parseInt(L.getAttribute('data-step'),10)||24,N=parseInt(L.getAttribute('data-n'),10)||8,shown=N,v=L.getAttribute('data-first')||'all';
    L.classList.add('cval-js');
    if(box)box.hidden=false;
    var more=document.createElement('div');more.className='cval-morebox';
    var btn=document.createElement('button');btn.type='button';btn.className='cval-morebtn';btn.textContent=L.getAttribute('data-more')||'';
    more.appendChild(btn);var go=L.querySelector('.cvl-go');L.insertBefore(more,go||null);
    function paint(){var n=0;
      chips.forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-view')===v?'true':'false');});
      cells.forEach(function(c){var on=v==='all'||c.getAttribute('data-on')==='1';c.classList.toggle('is-off',!on);
        if(on){n++;c.classList.toggle('is-later',n>shown);}else c.classList.remove('is-later');});
      more.hidden=n<=shown;}
    chips.forEach(function(c){c.addEventListener('click',function(){v=c.getAttribute('data-view');shown=N;paint();});});
    btn.addEventListener('click',function(){shown+=STEP;paint();});
    paint();
  });
})();
