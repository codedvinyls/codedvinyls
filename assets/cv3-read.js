/* CODEDVINYLS 저널 · 아카이브 · 레이블 v3 (2026-11-22 · 구현 ⑥) — 판 묶음의 보기 낱말(판매 중 / 다룬 판 전체) · 처음 data-n 칸 · 「더 보기」 한 번에 data-step 칸,
   참고문헌 접힘(글 쪽은 열어 둔 채 받아 접는다 · 각주를 누르면 펼친다). 지금 묶음 동작(cv-links.js) · 지금 글 쪽 안 스크립트와 같은 규칙.
   스크립트가 없으면 보기 낱말 · 「더 보기」는 숨고 칸은 전부 보이며 참고문헌은 펼친 채다. 주소(#)는 바꾸지 않는다. 바깥 요청 0. */
(function(){
  [].forEach.call(document.querySelectorAll('.cv3-plates'),function(L){
    var cells=[].slice.call(L.querySelectorAll('.cv3-pc')),box=L.querySelector('.cv3-chips'),btn=L.querySelector('.cv3-more'),
        chips=box?[].slice.call(box.querySelectorAll('button')):[],
        STEP=parseInt(L.getAttribute('data-step'),10)||24,N=parseInt(L.getAttribute('data-n'),10)||12,shown=N,
        v=chips.length?(L.getAttribute('data-first')||'all'):'all';
    L.classList.add('cv3-js');
    if(box)box.hidden=false;
    function paint(){var n=0;
      chips.forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-view')===v?'true':'false');});
      cells.forEach(function(c){var on=v==='all'||c.getAttribute('data-on')==='1';c.classList.toggle('cv3-off',!on);
        if(on){n++;c.classList.toggle('cv3-later',n>shown);}else c.classList.remove('cv3-later');});
      if(btn)btn.hidden=n<=shown;}
    chips.forEach(function(c){c.addEventListener('click',function(){v=c.getAttribute('data-view');shown=N;paint();});});
    if(btn)btn.addEventListener('click',function(){shown+=STEP;paint();});
    paint();
  });
  function reveal(){var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){return;}
    var el=id&&document.getElementById(id);if(!el)return;var p=el.closest('details');if(p&&!p.open)p.open=true;else if(!p)return;
    requestAnimationFrame(function(){el.scrollIntoView({block:'start'});if(el.hasAttribute('tabindex'))el.focus({preventScroll:true});});}
  [].forEach.call(document.querySelectorAll('details[data-cv3-fold]'),function(d){d.open=false;});
  window.addEventListener('hashchange',reveal);
  [].forEach.call(document.querySelectorAll('.cv3-rd a[href^="#"]'),function(a){a.addEventListener('click',function(){
    var el=document.getElementById(a.hash.slice(1));if(el){var p=el.closest('details');if(p)p.open=true;}setTimeout(reveal,0);});});
  reveal();
})();
