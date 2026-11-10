/* CODEDVINYLS 앨범 (2026-10-26 · 단계 3a·3b).
   ① 상세 창 → 앨범 링크: 갤러리 칸 안 숨은 a.gal-album 을 상세 창이 열릴 때 창 안에 보인다(3a).
   ② 자켓 직행(3b): a.gal-album.is-direct 가 있는 칸의 자켓을 누르면 상세 창 대신 앨범 페이지로 간다.
      옛 공유 주소(#키)로 들어오면 상세 창은 그대로 열린다.
   ③ 앨범 목록(3b): 보기 칩(판매 중 / 다룬 판 전체) · 「더 보기」(24칸씩). JS 없으면 전체가 보인다.
      ★261110 /album/ 첫 쪽 필터 줄(장르 · 레이블 · 추천 · 주소 질의) — 아래 ③ 머리 주석. */
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

  /* ③ 앨범 목록 — 칩 「판매 중」(기본 · /album/) · 「다룬 판 전체」(#all) · 다시 읽지 않고 거르기만
     ★261110 /album/ 첫 쪽 필터 줄(.cval-filter · HTML 에선 hidden → 여기서 연다): 장르 · 레이블 · 추천(album_picks 비면 칩 0) ·
     조건끼리 AND · 결과 수(다룬 판 전체에서만) · 조건 지우기(보기 유지) · 「더 보기」는 걸러진 칸으로 센다. 상태 = 주소 질의 ?view=all&genre=…&label=…&pick=1
     (공유 · 뒤로 가기 = popstate) · 옛 #all 도 읽는다. 필터 줄 없는 쪽(/album/<장르>/) = 종전대로 #all. */
  var L=document.querySelector('.cval');if(!L)return;
  var cells=[].slice.call(L.querySelectorAll('.cval-cell')),chips=[].slice.call(L.querySelectorAll('.cval-chips a')),STEP=24,shown=STEP;
  var first=L.getAttribute('data-first')||'all',F=L.querySelector('.cval-filter');
  L.classList.add('cval-js');
  var more=document.createElement('div');more.className='cval-morebox';
  var btn=document.createElement('button');btn.type='button';btn.className='cval-morebtn';btn.textContent=L.getAttribute('data-more')||'';
  more.appendChild(btn);var gl=L.querySelector('.cval-genres');L.insertBefore(more,gl||null);
  var Q=F?{gb:[].slice.call(F.querySelectorAll('.cval-fg button')),sel:F.querySelector('select'),pk:F.querySelector('.cval-fp'),
    n:F.querySelector('.cval-count'),fn:F.querySelector('.cval-fn'),clr:F.querySelector('.cval-clear'),empty:L.querySelector('.cval-empty'),tpl:F.getAttribute('data-count')||''}:null;
  function dec(s){try{return decodeURIComponent(s.replace(/\+/g,' '));}catch(e){return '';}}
  function qs(){var o={};(location.search||'').replace(/^\?/,'').split('&').forEach(function(p){if(!p)return;
    var i=p.indexOf('='),k=dec(i<0?p:p.slice(0,i));if(!(k in o))o[k]=dec(i<0?'':p.slice(i+1));});return o;}
  function read(){var s={view:first,genre:'',label:'',pick:false};
    if(F){var q=qs();
      if(chips.length&&(q.view==='all'||q.view==='now'))s.view=q.view;
      if(q.genre&&Q.gb.some(function(b){return b.getAttribute('data-genre')===q.genre;}))s.genre=q.genre;
      if(q.label&&Q.sel&&[].some.call(Q.sel.options,function(o){return o.value===q.label;}))s.label=q.label;
      s.pick=!!Q.pk&&q.pick==='1';}
    if((location.hash||'').slice(1)==='all')s.view='all';
    return s;}
  var S=read();
  function cp(s){return {view:s.view,genre:s.genre,label:s.label,pick:s.pick};}
  function href(s){if(!F)return s.view==='all'?'#all':location.pathname;
    var p=[];if(s.view!==first)p.push('view='+s.view);if(s.genre)p.push('genre='+encodeURIComponent(s.genre));
    if(s.label)p.push('label='+encodeURIComponent(s.label));if(s.pick)p.push('pick=1');
    return location.pathname+(p.length?'?'+p.join('&'):'');}
  function match(c,s,skip){return (s.view==='all'||c.getAttribute('data-on')==='1')
    &&(skip==='genre'||!s.genre||c.getAttribute('data-genre')===s.genre)
    &&(skip==='label'||!s.label||c.getAttribute('data-label')===s.label)
    &&(!s.pick||c.getAttribute('data-pick')==='1');}
  function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
  function facets(s,n){var g={},l={};   /* 다른 조건을 그대로 둘 때 0장이 되는 장르 칩 · 레이블 = 고를 수 없음 */
    cells.forEach(function(c){if(match(c,s,'genre'))g[c.getAttribute('data-genre')||'']=1;if(match(c,s,'label'))l[c.getAttribute('data-label')||'']=1;});
    Q.gb.forEach(function(b){var k=b.getAttribute('data-genre')||'';b.setAttribute('aria-pressed',k===s.genre?'true':'false');b.disabled=!!k&&k!==s.genre&&!g[k];});
    if(Q.sel){[].forEach.call(Q.sel.options,function(o){o.disabled=!!o.value&&o.value!==s.label&&!l[o.value];});Q.sel.value=s.label;}
    if(Q.pk)Q.pk.setAttribute('aria-pressed',s.pick?'true':'false');
    /* ★261110 편집장 dg-0645 — 결과 수 = 「다룬 판 전체」 + n>0 에서만 · 조건 지우기 = 장르 · 레이블 · 추천을 골랐을 때만(보기 칩 제외) ·
       0장 문장 = role=status 칸에 글자를 넣어 읽기 프로그램에도 닿게 · 결과 수 · 지우기 둘 다 비면 줄째 숨김 */
    var ct=(s.view==='all'&&n>0)?Q.tpl.replace('{n}',fmt(n)):'',nc=!s.genre&&!s.label&&!s.pick;
    if(Q.n)Q.n.textContent=ct;
    if(Q.empty)Q.empty.textContent=n>0?'':(Q.empty.getAttribute('data-empty')||'');
    if(Q.clr)Q.clr.hidden=nc;
    if(Q.fn)Q.fn.hidden=!ct&&nc;}
  function paint(){var s=S,n=0;
    chips.forEach(function(c){if(c.getAttribute('data-view')===s.view)c.setAttribute('aria-current','page');else c.removeAttribute('aria-current');});
    cells.forEach(function(c){var on=match(c,s);c.classList.toggle('is-off',!on);
      if(on){n++;c.classList.toggle('is-later',n>shown);}else c.classList.remove('is-later');});
    more.hidden=n<=shown;
    if(F)facets(s,n);}
  function go(s){S=s;shown=STEP;
    if(history.pushState){var u=href(s);if(u!==location.pathname+location.search+location.hash)history.pushState(null,'',u);}
    else if(!F)location.hash=s.view==='all'?'all':'';
    paint();}
  chips.forEach(function(c){c.addEventListener('click',function(e){
    e.preventDefault();var s=cp(S);s.view=c.getAttribute('data-view');go(s);});});
  if(F){
    Q.gb.forEach(function(b){b.addEventListener('click',function(){var s=cp(S);s.genre=b.getAttribute('data-genre')||'';go(s);});});
    if(Q.sel)Q.sel.addEventListener('change',function(){var s=cp(S);s.label=Q.sel.value;go(s);});
    if(Q.pk)Q.pk.addEventListener('click',function(){var s=cp(S);s.pick=!s.pick;go(s);});
    if(Q.clr)Q.clr.addEventListener('click',function(){go({view:S.view,genre:'',label:'',pick:false});if(Q.gb[0])Q.gb[0].focus();});
    F.hidden=false;}
  btn.addEventListener('click',function(){shown+=STEP;paint();});
  window.addEventListener('hashchange',function(){S=read();shown=STEP;paint();});
  window.addEventListener('popstate',function(){S=read();shown=STEP;paint();});
  paint();
})();
