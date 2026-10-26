/* CODEDVINYLS 상세 창 → 앨범 페이지 링크 (2026-10-26 · 단계 3a).
   갤러리 칸 안 숨은 a.gal-album(site_album.link_gallery)을 상세 창이 열릴 때 창 안에 보인다.
   앨범이 없는 칸 = 링크 0. 회차 페이지의 상세 창 스크립트는 건드리지 않는다. */
(function(){
  var d=document.getElementById('gal-lb');if(!d)return;
  var body=d.querySelector('.gal-lb-body');if(!body)return;
  var box=document.createElement('p');box.className='gal-lb-album';box.hidden=true;body.appendChild(box);
  var cur=null;
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.gal-item,.dp-row'):null;if(t)cur=t;
  },true);
  function sync(){
    if(!d.open){cur=null;return;}
    var it=cur;
    if(!it){var k=decodeURIComponent(location.hash.slice(1));it=k?document.getElementById(k):null;}
    var a=it?it.querySelector('a.gal-album'):null;
    box.innerHTML='';
    if(a){var c=a.cloneNode(true);c.hidden=false;c.removeAttribute('hidden');box.appendChild(c);box.hidden=false;}
    else box.hidden=true;
  }
  if(window.MutationObserver)new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['open']});
  if(d.open)sync();
})();
