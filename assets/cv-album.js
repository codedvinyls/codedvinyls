/* CODEDVINYLS 앨범 (2026-10-26 · 단계 3a·3b).
   ① 상세 창 → 앨범 링크: 갤러리 칸 안 숨은 a.gal-album 을 상세 창이 열릴 때 창 안에 보인다(3a).
   ② 자켓 직행(3b): a.gal-album.is-direct 가 있는 칸의 자켓을 누르면 상세 창 대신 앨범 페이지로 간다.
      옛 공유 주소(#키)로 들어오면 상세 창은 그대로 열린다.
   ③ 앨범 목록(3b): 보기 칩(판매 중 / 다룬 판 전체) · 「더 보기」(24칸씩). JS 없으면 전체가 보인다.
      ★261110 /album/ 첫 쪽 필터 줄(장르 · 레이블 · 추천 · 주소 질의) — 아래 ③ 머리 주석.
      ★261119 /album/ 첫 쪽 = 앞 48칸만 HTML · 나머지 = 목록 JSON 두 벌(같은 출처 · 번호로 잇기)을 읽어 스크롤 때 이어 붙인다 — 아래 ③ 머리 주석.
      ★261119 이어 붙이는 칸 자켓 = 작은 파생본(목록 머리 thumb · 줄 t=1 · HTML 칸과 같은 주소 · 아니면 원본) — 아래 pic. */
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
     (공유 · 뒤로 가기 = popstate) · 옛 #all 도 읽는다. 필터 줄 없는 쪽(/album/<장르>/) = 종전대로 #all.
     ★261119 나눈 쪽(main data-list · data-catalog · data-total · data-all = site_album.list_page) = HTML 칸 + 목록 JSON 두 벌
     (/album/list.json = 이 쪽 칸 · 순서 · /album/catalog.json = 앱과 같은 판 이름 · 자켓 · 주소 — 같은 출처 · 번호 n 으로 잇기).
     칸 = 자료(판매 중 · 장르 · 레이블 · 추천)로 거르고 그릴 칸만 그때 만든다(HTML 칸과 같은 마크업 · 글자 = textContent).
     이어 붙이기 = 「더 보기」 칸이 화면 아래 800px 안에 들면(IntersectionObserver · 없으면 단추). 목록이 오기 전 = 고를 수 없는 칩 · 결과 수 · 빈 결과 줄 0
     (일부로 세지 않는다). 목록 실패 = 「더 보기」 단추가 전체 목록 쪽(data-all · 조건 그대로)으로 간다(자동 이동 0). 나누지 않은 쪽 = 종전 그대로.
     목록 읽기 시작 = 쪽 load 뒤(첫 화면 자켓과 다투지 않게) · 그 전이라도 주소에 조건이 있거나 · 칩 · 필터를 만지거나 · 끝에 닿으면 바로. */
  /* ★261119 디깅 시안(아트디렉터 dg-1056 · 시안 사본 전용) — 위 ③ 에 더함:
     검색(q · 아티스트 · 앨범 · 레이블 카탈로그 줄 · 낱말마다 AND · 대소문자 · 악센트 무시) · 정렬(sort = new · price-asc · price-desc ·
     year-asc · year-desc · 값 없는 칸 = 끝 · 같으면 들어온 순) · B = 장르 고르는 칸 · 「판매 중만」 토글(보기 now ↔ all).
     칸 차례 = 정렬 차례로 자리를 옮긴다(HTML 칸 · 이어 붙인 칸 같은 규칙) · 목록이 오기 전 = HTML 칸만으로 거르고 오면 다시 그린다.
     결과 수 = 「다룬 판 전체」 또는 검색어가 있을 때 · 조건 지우기 = 검색어 · 장르 · 레이블 · 추천. 주소 = ?q=…&sort=… (공유 · 뒤로 가기). */
  var L=document.querySelector('.cval');if(!L)return;
  var grid=L.querySelector('.cval-grid'),chips=[].slice.call(L.querySelectorAll('.cval-chips a')),STEP=24,shown=STEP;
  var first=L.getAttribute('data-first')||'all',F=L.querySelector('.cval-filter');
  var LU=L.getAttribute('data-list'),CU=L.getAttribute('data-catalog'),ALL=L.getAttribute('data-all')||'',TOTAL=+(L.getAttribute('data-total')||0);
  function own(u){return /^\/album\/[a-z]+\.json(\?v=[0-9a-f]+)?$/.test(u||'');}   /* 같은 출처 · 앨범 목록 두 파일만 */
  var ready=!LU,failed=false,pend=false,TPL='',SOLD='',CUR='',TH=null,n0=0;
  function nz(t){t=String(t||'');try{t=t.normalize('NFKD').replace(/[̀-ͯ]/g,'');}catch(e){}return t.toLowerCase();}
  function txt(c,sel){var e=c.querySelector(sel);return e?e.textContent:'';}
  function fromEl(c,i){var a=c.querySelector('a');
    return {el:c,i:i,h:a?a.getAttribute('href'):'',n:+(c.getAttribute('data-n')||0),on:c.getAttribute('data-on')==='1',g:c.getAttribute('data-genre')||'',
      l:c.getAttribute('data-label')||'',p:c.getAttribute('data-pick')==='1',
      hay:nz(txt(c,'figcaption .a')+' '+txt(c,'figcaption .t')+' '+(c.getAttribute('data-lc')||'')),y:0,pr:0};}
  var items=[].slice.call(L.querySelectorAll('.cval-cell')).map(fromEl);
  L.classList.add('cval-js');
  var more=document.createElement('div');more.className='cval-morebox';
  var btn=document.createElement('button');btn.type='button';btn.className='cval-morebtn';btn.textContent=L.getAttribute('data-more')||'';
  more.appendChild(btn);var gl=L.querySelector('.cval-genres');L.insertBefore(more,gl||null);
  var Q=F?{gb:[].slice.call(F.querySelectorAll('.cval-fg button')),gs:F.querySelector('.cval-gs'),sel:F.querySelector('.cval-ls'),pk:F.querySelector('.cval-fp'),
    qi:F.querySelector('.cval-q input'),so:F.querySelector('.cval-so'),only:F.querySelector('.cval-only'),
    n:F.querySelector('.cval-count'),fn:F.querySelector('.cval-fn'),clr:F.querySelector('.cval-clear'),empty:L.querySelector('.cval-empty'),tpl:F.getAttribute('data-count')||''}:null;
  var SORTS=Q&&Q.so?[].map.call(Q.so.options,function(o){return o.value;}):['new'];
  function hasG(k){return Q.gb.some(function(b){return b.getAttribute('data-genre')===k;})||(!!Q.gs&&[].some.call(Q.gs.options,function(o){return o.value===k;}));}
  function dec(s){try{return decodeURIComponent(s.replace(/\+/g,' '));}catch(e){return '';}}
  function qs(){var o={};(location.search||'').replace(/^\?/,'').split('&').forEach(function(p){if(!p)return;
    var i=p.indexOf('='),k=dec(i<0?p:p.slice(0,i));if(!(k in o))o[k]=dec(i<0?'':p.slice(i+1));});return o;}
  function read(){var s={view:first,genre:'',label:'',pick:false,q:'',sort:'new'};
    if(F){var q=qs();
      if((chips.length||Q.only)&&(q.view==='all'||q.view==='now'))s.view=q.view;
      if(q.genre&&hasG(q.genre))s.genre=q.genre;
      if(q.label&&Q.sel&&[].some.call(Q.sel.options,function(o){return o.value===q.label;}))s.label=q.label;
      s.pick=!!Q.pk&&q.pick==='1';
      if(Q.qi&&q.q)s.q=q.q.slice(0,80);
      if(q.sort&&SORTS.indexOf(q.sort)>0)s.sort=q.sort;}
    if((location.hash||'').slice(1)==='all')s.view='all';
    return s;}
  var S=read();
  function cp(s){return {view:s.view,genre:s.genre,label:s.label,pick:s.pick,q:s.q,sort:s.sort};}
  function href(s){if(!F)return s.view==='all'?'#all':location.pathname;
    var p=[];if(s.q)p.push('q='+encodeURIComponent(s.q));if(s.view!==first)p.push('view='+s.view);if(s.genre)p.push('genre='+encodeURIComponent(s.genre));
    if(s.label)p.push('label='+encodeURIComponent(s.label));if(s.pick)p.push('pick=1');if(s.sort!=='new')p.push('sort='+s.sort);
    return location.pathname+(p.length?'?'+p.join('&'):'');}
  function terms(s){return nz(s.q).split(/\s+/).filter(Boolean);}
  function match(c,s,skip,tw){return (s.view==='all'||c.on)
    &&(skip==='genre'||!s.genre||c.g===s.genre)
    &&(skip==='label'||!s.label||c.l===s.label)
    &&(!s.pick||c.p)
    &&(!tw||tw.every(function(t){return c.hay.indexOf(t)>=0;}));}
  function order(s){if(s.sort==='new')return items;
    var k=s.sort.slice(0,s.sort.indexOf('-'))==='price'?'pr':'y',d=/-desc$/.test(s.sort)?-1:1;
    return items.slice().sort(function(a,b){var x=a[k]||0,y=b[k]||0;if(!x!==!y)return x?-1:1;return x!==y?(x-y)*d:a.i-b.i;});}
  function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
  function facets(s,n,tw){var g={},l={};   /* 다른 조건을 그대로 둘 때 0장이 되는 장르 · 레이블 = 고를 수 없음(목록이 다 왔을 때만) */
    items.forEach(function(c){if(match(c,s,'genre',tw))g[c.g]=1;if(match(c,s,'label',tw))l[c.l]=1;});
    Q.gb.forEach(function(b){var k=b.getAttribute('data-genre')||'';b.setAttribute('aria-pressed',k===s.genre?'true':'false');b.disabled=ready&&!!k&&k!==s.genre&&!g[k];});
    if(Q.gs){[].forEach.call(Q.gs.options,function(o){o.disabled=ready&&!!o.value&&o.value!==s.genre&&!g[o.value];});Q.gs.value=s.genre;}
    if(Q.sel){[].forEach.call(Q.sel.options,function(o){o.disabled=ready&&!!o.value&&o.value!==s.label&&!l[o.value];});Q.sel.value=s.label;}
    if(Q.pk)Q.pk.setAttribute('aria-pressed',s.pick?'true':'false');
    if(Q.only)Q.only.setAttribute('aria-pressed',s.view==='now'?'true':'false');
    if(Q.so)Q.so.value=s.sort;
    if(Q.qi&&document.activeElement!==Q.qi)Q.qi.value=s.q;
    var ct=(ready&&(s.view==='all'||!!s.q)&&n>0)?Q.tpl.replace('{n}',fmt(n)):'',nc=!s.genre&&!s.label&&!s.pick&&!s.q;
    if(Q.n)Q.n.textContent=ct;
    if(Q.empty)Q.empty.textContent=(n>0||!ready)?'':(Q.empty.getAttribute('data-empty')||'');
    if(Q.clr)Q.clr.hidden=nc;
    if(Q.fn)Q.fn.hidden=!ct&&nc;}
  function span(p,c,t){var e=document.createElement('span');if(c)e.className=c;e.textContent=t;p.appendChild(e);return e;}
  function make(c){var r=c.r,x=c.x,li=document.createElement('li');li.className='cval-cell';   /* site_album._list_cell 과 같은 마크업 */
    li.setAttribute('data-n',String(c.n));if(x.lc)li.setAttribute('data-lc',x.lc);
    li.setAttribute('data-on',c.on?'1':'0');if(c.g)li.setAttribute('data-genre',c.g);if(c.l)li.setAttribute('data-label',c.l);if(c.p)li.setAttribute('data-pick','1');
    var a=document.createElement('a');a.setAttribute('href',r.href);
    var b=document.createElement('span');b.className='cval-img';
    var im=document.createElement('img');
    im.setAttribute('alt',typeof x.alt==='string'?x.alt:TPL.replace('{artist}',function(){return r.artist;}).replace('{album}',function(){return r.album;}));
    im.setAttribute('width',String(r.w));im.setAttribute('height',String(r.h));im.setAttribute('loading','lazy');im.setAttribute('decoding','async');
    b.appendChild(im);a.appendChild(b);
    /* ★261120 카드 = 아티스트 · 앨범 · 프레싱 줄(v) · 가격 줄(판매 중 = 가격 · 판매 완료 = SOLD · 그 밖 빈 줄) — site_album._list_cap 과 같은 꼴 */
    var f=document.createElement('figcaption');span(f,'a',r.artist);span(f,'t',r.album);span(f,'v',typeof x.v==='string'?x.v:'');
    var sd=!c.pr&&x.s===1;span(f,sd?'p s':'p',c.pr?CUR+fmt(c.pr):(sd?SOLD:''));
    a.appendChild(f);li.appendChild(a);c.im=im;return li;}
  /* ★261119 칸 자켓 주소 — 줄 t=1 + 머리 thumb 규칙 = 파생본(dir + img 에서 assets/ · 확장자 뺀 줄기 + -<폭>.webp ·
     src · srcset · sizes = site_album._list_cell(home_thumbs 「cell」)과 같은 값) · 아니면 원본 img. 자리에 넣은 뒤 부른다(지연 읽기). */
  function pic(c){var im=c.im,r=c.r;
    if(TH&&c.x.t===1){var s=TH.dir+r.img.replace(/^assets\//,'').replace(/\.[^.\/]+$/,'');
      im.setAttribute('srcset',TH.w.map(function(w){return s+'-'+w+'.webp '+w+'w';}).join(', '));im.setAttribute('sizes',TH.sizes);
      im.setAttribute('src',s+'-'+TH.src+'.webp');}
    else im.setAttribute('src','/'+r.img);}
  function paint(){var s=S,n=0,tw=terms(s),cur=grid.firstElementChild;L.setAttribute('data-sort',s.sort);   /* css = 연도 정렬일 때 A 칸 연도를 보인다 */
    chips.forEach(function(c){if(c.getAttribute('data-view')===s.view)c.setAttribute('aria-current','page');else c.removeAttribute('aria-current');});
    order(s).forEach(function(c){var on=match(c,s,null,tw),mk=false;if(on)n++;
      if(on&&n<=shown&&!c.el){c.el=make(c);mk=true;}
      if(c.el){c.el.classList.toggle('is-off',!on);c.el.classList.toggle('is-later',on&&n>shown);
        if(c.el!==cur)grid.insertBefore(c.el,cur);else cur=cur.nextElementSibling;   /* 정렬 차례로 자리 옮김 */
        if(mk)pic(c);}});
    n0=n;more.hidden=n<=shown&&(ready||TOTAL<=items.length);
    if(F)facets(s,n,tw);}
  var io=null;
  function kick(){if(io){io.unobserve(more);if(!more.hidden)io.observe(more);}}
  function step(auto){
    if(n0>shown){shown+=STEP;paint();kick();return;}
    if(!ready&&!failed){if(!auto)pend=true;start();return;}
    if(failed&&!auto&&ALL)location.href=ALL+location.search;}
  function go(s,quiet){S=s;shown=STEP;
    if(!ready&&(s.q||s.sort!=='new'))start();
    if(history.pushState){var u=href(s);if(u!==location.pathname+location.search+location.hash)history[quiet?'replaceState':'pushState'](null,'',u);}
    else if(!F)location.hash=s.view==='all'?'all':'';
    paint();kick();}
  chips.forEach(function(c){c.addEventListener('click',function(e){
    e.preventDefault();var s=cp(S);s.view=c.getAttribute('data-view');go(s);});});
  if(F){
    Q.gb.forEach(function(b){b.addEventListener('click',function(){var s=cp(S);s.genre=b.getAttribute('data-genre')||'';go(s);});});
    if(Q.gs)Q.gs.addEventListener('change',function(){var s=cp(S);s.genre=Q.gs.value;go(s);});
    if(Q.sel)Q.sel.addEventListener('change',function(){var s=cp(S);s.label=Q.sel.value;go(s);});
    if(Q.pk)Q.pk.addEventListener('click',function(){var s=cp(S);s.pick=!s.pick;go(s);});
    if(Q.only)Q.only.addEventListener('click',function(){var s=cp(S);s.view=s.view==='now'?'all':'now';go(s);});
    if(Q.so)Q.so.addEventListener('change',function(){var s=cp(S);s.sort=Q.so.value;go(s);});
    if(Q.qi){var tq=0,typed=false;
      Q.qi.addEventListener('input',function(){clearTimeout(tq);tq=setTimeout(function(){var s=cp(S);s.q=Q.qi.value.trim().slice(0,80);go(s,typed);typed=true;},160);});
      Q.qi.addEventListener('blur',function(){typed=false;});
      Q.qi.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();Q.qi.blur();}});}
    if(Q.clr)Q.clr.addEventListener('click',function(){go({view:S.view,genre:'',label:'',pick:false,q:'',sort:S.sort});if(Q.qi)Q.qi.value='';if(Q.qi)Q.qi.focus();});
    F.hidden=false;}
  btn.addEventListener('click',function(){step(false);});
  window.addEventListener('hashchange',function(){S=read();shown=STEP;paint();kick();});
  window.addEventListener('popstate',function(){S=read();shown=STEP;paint();kick();});
  function join(lst,cat){var by={},xs={},seen={},out=[];
    TPL=typeof lst.alt==='string'?lst.alt:'';SOLD=typeof lst.sold==='string'?lst.sold:'';CUR=typeof lst.cur==='string'?lst.cur:'';
    var t=lst.thumb;   /* 머리 thumb 꼴 밖 = 파생 0(원본 그대로) */
    TH=(t&&typeof t.dir==='string'&&/^\/album\/[a-z]+\/$/.test(t.dir)&&typeof t.sizes==='string'&&Array.isArray(t.w)&&t.w.length
      &&t.w.every(function(w){return typeof w==='number'&&w===Math.floor(w)&&w>0;})&&t.w.indexOf(t.src)>=0)?t:null;
    (cat.albums||[]).forEach(function(r){if(r&&typeof r.n==='number'&&typeof r.href==='string'&&/^\/album\/[a-z0-9-]+\/$/.test(r.href)
      &&typeof r.img==='string'&&!/^\/|\/\/|\.\.|:/.test(r.img)&&typeof r.artist==='string'&&typeof r.album==='string')by[r.n]=r;});
    (lst.albums||[]).forEach(function(x){if(x&&typeof x.n==='number')xs[x.n]=x;});
    function num(v){return typeof v==='number'&&v>0?v:0;}
    items.forEach(function(c){var x=xs[c.n];seen[c.h]=1;if(x){c.y=num(x.y);c.pr=num(x.pr);}});   /* HTML 칸 = 정렬 재료만 더함 */
    (lst.albums||[]).forEach(function(x){var r=x&&by[x.n];if(!r||seen[r.href])return;seen[r.href]=1;
      out.push({el:null,n:x.n,h:r.href,on:x.on===1,g:typeof x.g==='string'?x.g:'',l:typeof x.l==='string'?x.l:'',p:x.p===1,r:r,x:x,
        hay:nz(r.artist+' '+r.album+' '+(typeof x.lc==='string'?x.lc:'')),y:num(x.y),pr:num(x.pr)});});
    items=items.concat(out);items.forEach(function(c,i){c.i=i;});}
  function get(u){return fetch(u,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json();});}
  var go1=false;
  function start(){if(go1||ready||failed)return;go1=true;
    Promise.all([get(LU),get(CU)]).then(function(v){join(v[0]||{},v[1]||{});ready=true;if(pend){pend=false;shown+=STEP;}paint();kick();},
      function(){failed=true;paint();});}
  if(!ready){
    if(window.IntersectionObserver)io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)step(true);});},{rootMargin:'0px 0px 800px 0px'});
    if(own(LU)&&own(CU)&&window.fetch&&window.Promise){
      L.addEventListener('pointerdown',start,true);L.addEventListener('focusin',start,true);
      if((location.search||'').length>1||(location.hash||'')==='#all'||document.readyState==='complete')start();
      else window.addEventListener('load',start);}
    else failed=true;}
  paint();kick();
})();
