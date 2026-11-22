/* CODEDVINYLS 앨범 목록 v3 (2026-11-22 · 구현 ②) — 거르기 · 정렬 · 더 보기 · 날짜 묶음.
   마크업 = _tools/site_album_v3.py(main.cv3-list) · 카드 = _tools/site_card.py · 모양 = assets/cv3-album.css.
   동작 = assets/cv-album.js ③(앨범 목록)을 v3 칸 꼴로 옮긴 것 — 규칙은 그대로다:
     보기 탭 「판매 중」(기본) · 「다룬 판 전체」 · 장르 · 레이블 · 추천 · 찾기(낱말마다 AND · 대소문자 · 악센트 무시) · 조건끼리 AND ·
     정렬(new · price-asc · price-desc · year-asc · year-desc · 값 없는 칸 = 끝 · 같으면 들어온 순) · 「더 보기」 24칸씩 ·
     상태 = 주소 질의(?q=…&view=all&genre=…&label=…&pick=1&sort=…) · 옛 #all · 뒤로 가기 = popstate ·
     나눈 쪽(main data-list · data-catalog · data-total · data-all) = HTML 칸 + 목록 JSON 두 벌(같은 출처 · 번호 n 으로 잇기 · 꼴 그대로) ·
     이어 붙이기 = 「더 보기」가 화면 아래 800px 안에 들면 · 목록 실패 = 「더 보기」가 전체 목록 쪽(data-all)으로 간다 ·
     다른 조건을 둘 때 0장이 되는 장르 · 레이블 = 고를 수 없음(목록이 다 왔을 때만).
   v3 에서 더한 것:
     · 날짜 묶음 머리(li.cv3-grp-h) — 들어온 순(sort=new)일 때만 · 묶음 표 = ul[data-groups] = [날짜 글자, s|o, 판 수, 판매 중 수] 차례.
       목록 JSON 에는 들어온 날 · 판매처가 없다 → 목록 JSON 줄 차례(= 쪽 순서)로 묶음을 센다(표의 판 수 합 ≠ 줄 수 = 묶음 머리 0).
     · 카드 판매처 글자 = 그 묶음이 매장(s)이고 가격이 보일 때만(site_card.card shop=True 와 같은 규칙).
     · 수 = 쪽 이름 아래 한 곳(「판매 중」 보기 = 그 낱말 + {n}장) · 묶음 머리마다 {n}장. 다 세지 못했으면 비운다.
     · 찾기 칸 = 머리의 찾기 칸(틀 v3 · form.cv3-q)과 이 쪽 찾기 칸(휴대폰) 둘 다 같은 조건에 묶는다.
   JS 없으면 = HTML 칸 전부 보임 · 거르기(레이블 · 정렬 · 찾기)는 숨은 채 · 장르 낱말 = 그 장르 쪽 링크. */
(function(){
  var L=document.querySelector('.cv3-list');if(!L)return;
  var grid=L.querySelector('.cv3-cards');if(!grid)return;
  var chips=[].slice.call(L.querySelectorAll('.cv3-tabs a')),STEP=24,shown=STEP;
  var first=L.getAttribute('data-first')||'all',F=L.querySelector('.cv3-ls')?L.querySelector('.cv3-rail'):null;
  var LU=L.getAttribute('data-list'),CU=L.getAttribute('data-catalog'),ALL=L.getAttribute('data-all')||'',TOTAL=+(L.getAttribute('data-total')||0);
  var NOW=L.getAttribute('data-now')||'',CT=L.getAttribute('data-count')||'',SHOP=L.getAttribute('data-shop')||'',SEP=L.getAttribute('data-sep')||'';
  var GN={s:grid.getAttribute('data-store')||'',o:grid.getAttribute('data-online')||''},GR=[],GH={};
  try{GR=JSON.parse(grid.getAttribute('data-groups')||'[]');}catch(e){GR=[];}
  if(!Array.isArray(GR)||!GR.every(function(g){return Array.isArray(g)&&typeof g[0]==='string'&&(g[1]==='s'||g[1]==='o')&&typeof g[2]==='number'&&typeof g[3]==='number';}))GR=[];
  function own(u){return /^\/album\/[a-z]+\.json(\?v=[0-9a-f]+)?$/.test(u||'');}   /* 같은 출처 · 앨범 목록 두 파일만 */
  var ready=!LU,failed=false,pend=false,TPL='',SOLD='',CUR='',TH=null,n0=0;
  function nz(t){t=String(t||'');try{t=t.normalize('NFKD').replace(/[̀-ͯ]/g,'');}catch(e){}return t.toLowerCase();}
  function txt(c,sel){var e=c.querySelector(sel);return e?e.textContent:'';}
  function gid(v){v=parseInt(v,10);return v>=0&&v<GR.length?v:-1;}
  function fromEl(c,i){var a=c.querySelector('a');
    return {el:c,i:i,h:a?a.getAttribute('href'):'',n:+(c.getAttribute('data-n')||0),on:c.getAttribute('data-on')==='1',g:c.getAttribute('data-genre')||'',
      l:c.getAttribute('data-label')||'',p:c.getAttribute('data-pick')==='1',gi:gid(c.getAttribute('data-grp')),
      hay:nz(txt(c,'.cv3-ar')+' '+txt(c,'.cv3-al')+' '+(c.getAttribute('data-lc')||'')),y:0,pr:0};}
  var items=[].slice.call(grid.querySelectorAll('.cv3-cell')).map(fromEl);
  [].forEach.call(grid.querySelectorAll('.cv3-grp-h'),function(h){var k=gid(h.getAttribute('data-grp'));if(k>=0)GH[k]=h;else h.hidden=true;});
  L.classList.add('cv3-js');
  var btn=document.createElement('button');btn.type='button';btn.className='cv3-more';btn.textContent=L.getAttribute('data-more')||'';
  var more=btn;grid.parentNode.insertBefore(more,grid.nextSibling);
  var Q=F?{gb:[].slice.call(F.querySelectorAll('.cv3-chips [data-genre]')),sel:F.querySelector('.cv3-ls'),pk:F.querySelector('.cv3-fp'),
    qi:[].slice.call(document.querySelectorAll('form.cv3-q input[name="q"],.cv3-fq input')),so:F.querySelector('.cv3-ss'),
    fn:F.querySelector('.cv3-fn'),clr:F.querySelector('.cv3-clear'),empty:L.querySelector('.cv3-empty')}:null;
  var CN=L.querySelector('.cv3-cnt');
  var SORTS=Q&&Q.so?[].map.call(Q.so.options,function(o){return o.value;}):['new'];
  function hasG(k){return Q.gb.some(function(b){return b.getAttribute('data-genre')===k;});}
  function dec(s){try{return decodeURIComponent(s.replace(/\+/g,' '));}catch(e){return '';}}
  function qs(){var o={};(location.search||'').replace(/^\?/,'').split('&').forEach(function(p){if(!p)return;
    var i=p.indexOf('='),k=dec(i<0?p:p.slice(0,i));if(!(k in o))o[k]=dec(i<0?'':p.slice(i+1));});return o;}
  function read(){var s={view:first,genre:'',label:'',pick:false,q:'',sort:'new'};
    if(F){var q=qs();
      if(chips.length&&(q.view==='all'||q.view==='now'))s.view=q.view;
      if(q.genre&&hasG(q.genre))s.genre=q.genre;
      if(q.label&&Q.sel&&[].some.call(Q.sel.options,function(o){return o.value===q.label;}))s.label=q.label;
      s.pick=!!Q.pk&&q.pick==='1';
      if(Q.qi.length&&q.q)s.q=q.q.slice(0,80);
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
  function cnt(n){return CT.replace('{n}',fmt(n));}
  function free(s){return !s.genre&&!s.label&&!s.pick&&!s.q;}
  function off(b,v){if(b.tagName==='BUTTON')b.disabled=v;if(v)b.setAttribute('aria-disabled','true');else b.removeAttribute('aria-disabled');}
  function face(e){var v=e.parentNode.querySelector('.cv3-sel-v'),o=e.options[e.selectedIndex];if(v&&o)v.textContent=o.textContent;}   /* 고르는 칸의 보이는 글자 = 고른 값 */
  function facets(s,n,tw){var g={},l={};   /* 다른 조건을 그대로 둘 때 0장이 되는 장르 · 레이블 = 고를 수 없음(목록이 다 왔을 때만) */
    items.forEach(function(c){if(match(c,s,'genre',tw))g[c.g]=1;if(match(c,s,'label',tw))l[c.l]=1;});
    Q.gb.forEach(function(b){var k=b.getAttribute('data-genre')||'';
      if(k===s.genre)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');off(b,ready&&!!k&&k!==s.genre&&!g[k]);});
    if(Q.sel){[].forEach.call(Q.sel.options,function(o){o.disabled=ready&&!!o.value&&o.value!==s.label&&!l[o.value];});Q.sel.value=s.label;face(Q.sel);}
    if(Q.pk)Q.pk.setAttribute('aria-pressed',s.pick?'true':'false');
    if(Q.so){Q.so.value=s.sort;face(Q.so);}
    Q.qi.forEach(function(i){if(document.activeElement!==i)i.value=s.q;});
    if(Q.empty)Q.empty.textContent=(n>0||!ready)?'':(Q.empty.getAttribute('data-empty')||'');
    if(Q.clr&&Q.fn)Q.fn.hidden=free(s);}
  function span(p,c,t){var e=document.createElement('span');if(c)e.className=c;e.textContent=t;p.appendChild(e);return e;}
  function make(c){var r=c.r,x=c.x,li=document.createElement('li');li.className='cv3-cell';   /* site_album_v3._cell + site_card.card 와 같은 마크업 */
    li.setAttribute('data-on',c.on?'1':'0');li.setAttribute('data-n',String(c.n));if(x.lc)li.setAttribute('data-lc',x.lc);
    if(c.g)li.setAttribute('data-genre',c.g);if(c.l)li.setAttribute('data-label',c.l);if(c.p)li.setAttribute('data-pick','1');
    if(c.gi>=0)li.setAttribute('data-grp',String(c.gi));
    var a=document.createElement('a');a.className='cv3-card';a.setAttribute('href',r.href);
    var b=span(a,'cv3-jk','');
    var im=document.createElement('img');
    im.setAttribute('alt',typeof x.alt==='string'?x.alt:TPL.replace('{artist}',function(){return r.artist;}).replace('{album}',function(){return r.album;}));
    im.setAttribute('width',String(r.w));im.setAttribute('height',String(r.h));im.setAttribute('loading','lazy');im.setAttribute('decoding','async');
    b.appendChild(im);
    span(a,'cv3-ar',r.artist);span(a,'cv3-al',r.album);span(a,'cv3-ed',typeof x.v==='string'?x.v:'');
    var sd=!c.pr&&x.s===1,p=span(a,sd?'cv3-pr cv3-so':'cv3-pr',c.pr?CUR+fmt(c.pr):(sd?SOLD:''));
    if(c.pr&&c.gi>=0&&GR[c.gi][1]==='s'&&SHOP)span(p,'cv3-ch',SEP+SHOP);   /* 판매처 글자 = 매장 판 · 가격이 보일 때만 */
    li.appendChild(a);c.im=im;return li;}
  /* 칸 자켓 주소 — 줄 t=1 + 머리 thumb 규칙 = 파생본(cv-album.js pic 과 같은 규칙 · HTML 칸과 같은 주소) · 아니면 원본. 자리에 넣은 뒤 부른다. */
  function pic(c){var im=c.im,r=c.r;
    if(TH&&c.x.t===1){var s=TH.dir+r.img.replace(/^assets\//,'').replace(/\.[^.\/]+$/,'');
      im.setAttribute('srcset',TH.w.map(function(w){return s+'-'+w+'.webp '+w+'w';}).join(', '));im.setAttribute('sizes',TH.sizes);
      im.setAttribute('src',s+'-'+TH.src+'.webp');}
    else im.setAttribute('src','/'+r.img);}
  function head(k){var h=GH[k],g=GR[k];if(h||!g||!g[0])return h||null;   /* site_album_v3._grp_head 와 같은 마크업 */
    h=document.createElement('li');h.className='cv3-grp-h';h.setAttribute('data-grp',String(k));
    span(h,'cv3-d',g[0]);var n=span(h,'cv3-gk',''),t=document.createElement('i');
    t.className=g[1]==='o'?'cv3-tick cv3-tick-o':'cv3-tick';t.setAttribute('aria-hidden','true');n.appendChild(t);n.appendChild(document.createTextNode(GN[g[1]]));
    span(h,'cv3-gn','');GH[k]=h;return h;}
  function paint(){var s=S,n=0,tw=terms(s),seq=[],last=-2,gc={},grouped=s.sort==='new'&&GR.length>0,nc=free(s);L.setAttribute('data-sort',s.sort);
    chips.forEach(function(c){if(c.getAttribute('data-view')===s.view)c.setAttribute('aria-current','page');else c.removeAttribute('aria-current');});
    var mk=[],used={};
    order(s).forEach(function(c){var on=match(c,s,null,tw);if(on){n++;gc[c.gi]=(gc[c.gi]||0)+1;}
      if(on&&n<=shown&&!c.el){c.el=make(c);mk.push(c);}
      if(!c.el)return;
      c.el.classList.toggle('is-off',!on);c.el.classList.toggle('is-later',on&&n>shown);
      if(grouped&&on&&n<=shown&&c.gi!==last){last=c.gi;var h=c.gi>=0?head(c.gi):null;if(h){used[c.gi]=1;seq.push(h);}}
      seq.push(c.el);});
    var cur=grid.firstElementChild;
    seq.forEach(function(e){if(e!==cur)grid.insertBefore(e,cur);else cur=cur.nextElementSibling;});   /* 정렬 차례로 자리 옮김 */
    for(var k in GH){var h=GH[k],g=GR[k],on=!!used[k];h.hidden=!on;
      if(on){var e=h.querySelector('.cv3-gn'),v=ready?(gc[k]||0):(nc?(s.view==='all'?g[2]:g[3]):0);if(e)e.textContent=v>0?cnt(v):'';}}
    mk.forEach(pic);
    n0=n;more.hidden=n<=shown&&(ready||TOTAL<=items.length);
    if(CN){var tot=ready?n:(nc?GR.reduce(function(a,g){return a+(s.view==='all'?g[2]:g[3]);},0):0);
      CN.textContent=tot>0?((s.view==='now'&&NOW?NOW+' ':'')+cnt(tot)):'';}
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
    Q.gb.forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();if(b.getAttribute('aria-disabled')==='true')return;
      var s=cp(S);s.genre=b.getAttribute('data-genre')||'';go(s);});});
    if(Q.sel)Q.sel.addEventListener('change',function(){var s=cp(S);s.label=Q.sel.value;go(s);});
    if(Q.pk)Q.pk.addEventListener('click',function(){var s=cp(S);s.pick=!s.pick;go(s);});
    if(Q.so)Q.so.addEventListener('change',function(){var s=cp(S);s.sort=Q.so.value;go(s);});
    Q.qi.forEach(function(qi){var tq=0,typed=false;
      qi.addEventListener('input',function(){clearTimeout(tq);tq=setTimeout(function(){var s=cp(S);s.q=qi.value.trim().slice(0,80);go(s,typed);typed=true;},160);});
      qi.addEventListener('blur',function(){typed=false;});
      qi.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();qi.blur();}});
      if(qi.form)qi.form.addEventListener('submit',function(e){e.preventDefault();});});
    if(Q.clr)Q.clr.addEventListener('click',function(){go({view:S.view,genre:'',label:'',pick:false,q:'',sort:S.sort});Q.qi.forEach(function(i){i.value='';});});
    [].forEach.call(F.querySelectorAll('.cv3-fl,.cv3-sort,.cv3-fq,.cv3-flt-p'),function(e){e.hidden=false;});}
  btn.addEventListener('click',function(){step(false);});
  window.addEventListener('hashchange',function(){S=read();shown=STEP;paint();kick();});
  window.addEventListener('popstate',function(){S=read();shown=STEP;paint();kick();});
  function join(lst,cat){var by={},xs={},seen={},out=[],pos={},rows=lst.albums||[],k=0,left=GR.length?GR[0][2]:0;
    TPL=typeof lst.alt==='string'?lst.alt:'';SOLD=typeof lst.sold==='string'?lst.sold:'';CUR=typeof lst.cur==='string'?lst.cur:'';
    var t=lst.thumb;   /* 머리 thumb 꼴 밖 = 파생 0(원본 그대로) */
    TH=(t&&typeof t.dir==='string'&&/^\/album\/[a-z]+\/$/.test(t.dir)&&typeof t.sizes==='string'&&Array.isArray(t.w)&&t.w.length
      &&t.w.every(function(w){return typeof w==='number'&&w===Math.floor(w)&&w>0;})&&t.w.indexOf(t.src)>=0)?t:null;
    /* 묶음 = 목록 JSON 줄 차례로 센다(표의 판 수 합 = 줄 수일 때만 · 어긋나면 이어 붙이는 칸의 묶음 0) */
    var sum=GR.reduce(function(a,g){return a+g[2];},0),okg=GR.length>0&&sum===rows.length;
    rows.forEach(function(x){while(okg&&left<=0&&k<GR.length-1){k++;left=GR[k][2];}
      if(x&&typeof x.n==='number')pos[x.n]=okg?k:-1;left--;});
    (cat.albums||[]).forEach(function(r){if(r&&typeof r.n==='number'&&typeof r.href==='string'&&/^\/album\/[a-z0-9-]+\/$/.test(r.href)
      &&typeof r.img==='string'&&!/^\/|\/\/|\.\.|:/.test(r.img)&&typeof r.artist==='string'&&typeof r.album==='string')by[r.n]=r;});
    rows.forEach(function(x){if(x&&typeof x.n==='number')xs[x.n]=x;});
    function num(v){return typeof v==='number'&&v>0?v:0;}
    items.forEach(function(c){var x=xs[c.n];seen[c.h]=1;if(x){c.y=num(x.y);c.pr=num(x.pr);}});   /* HTML 칸 = 정렬 재료만 더함 */
    rows.forEach(function(x){var r=x&&by[x.n];if(!r||seen[r.href])return;seen[r.href]=1;
      out.push({el:null,n:x.n,h:r.href,on:x.on===1,g:typeof x.g==='string'?x.g:'',l:typeof x.l==='string'?x.l:'',p:x.p===1,r:r,x:x,gi:pos[x.n],
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
