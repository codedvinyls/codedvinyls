/* cv-video — 커스텀 스크러버 (progressive enhancement)
   모든 <video>를 감싸 네이티브 controls 대신 브랜드 스크러버 부착.
   클릭/드래그 시킹, 키보드 ←→(5초), 버퍼 표시. JS 실패 시 네이티브 controls 유지. */
(function () {
  if (!document.querySelectorAll || !window.addEventListener) return;
  var vids = document.querySelectorAll('video');
  for (var i = 0; i < vids.length; i++) enhance(vids[i]);

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function enhance(v) {
    if (v.parentNode && v.parentNode.className === 'cvv') return; // 중복 방지
    v.removeAttribute('controls');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');

    var wrap = document.createElement('div');
    wrap.className = 'cvv';
    v.parentNode.insertBefore(wrap, v);
    wrap.appendChild(v);

    var bar = document.createElement('div');
    bar.className = 'cvv-bar';
    bar.innerHTML =
      '<button class="cvv-play" type="button" aria-label="재생/일시정지">▶</button>' +
      '<div class="cvv-track" role="slider" tabindex="0" aria-label="재생 위치" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
        '<div class="cvv-rail"></div><div class="cvv-buf"></div><div class="cvv-fill"></div><div class="cvv-knob"></div>' +
      '</div>' +
      '<span class="cvv-time">0:00 / 0:00</span>';
    wrap.appendChild(bar);

    var playBtn = bar.querySelector('.cvv-play');
    var track = bar.querySelector('.cvv-track');
    var fill = bar.querySelector('.cvv-fill');
    var buf = bar.querySelector('.cvv-buf');
    var knob = bar.querySelector('.cvv-knob');
    var time = bar.querySelector('.cvv-time');

    function toggle() { if (v.paused) { v.play(); } else { v.pause(); } }
    v.addEventListener('click', toggle);
    playBtn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    v.addEventListener('play', function () { wrap.className = 'cvv playing'; playBtn.textContent = '❚❚'; });
    v.addEventListener('pause', function () { wrap.className = 'cvv'; playBtn.textContent = '▶'; });
    v.addEventListener('ended', function () { wrap.className = 'cvv'; playBtn.textContent = '▶'; });

    v.addEventListener('loadedmetadata', render);
    v.addEventListener('timeupdate', render);
    v.addEventListener('progress', renderBuf);
    function render() {
      var d = v.duration || 0, c = v.currentTime || 0;
      var p = d ? (c / d) : 0;
      fill.style.width = (p * 100) + '%';
      knob.style.left = (p * 100) + '%';
      time.textContent = fmt(c) + ' / ' + fmt(d);
      track.setAttribute('aria-valuenow', Math.round(p * 100));
      renderBuf();
    }
    function renderBuf() {
      try {
        if (v.buffered && v.buffered.length && v.duration) {
          buf.style.width = ((v.buffered.end(v.buffered.length - 1) / v.duration) * 100) + '%';
        }
      } catch (e) {}
    }

    var dragging = false;
    function seekAt(clientX) {
      var r = track.getBoundingClientRect();
      if (!r.width) return;
      var p = (clientX - r.left) / r.width;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      if (v.duration) { v.currentTime = p * v.duration; render(); }
    }
    track.addEventListener('pointerdown', function (e) {
      e.preventDefault(); e.stopPropagation();
      dragging = true; wrap.classList.add('scrubbing');
      if (track.setPointerCapture) { try { track.setPointerCapture(e.pointerId); } catch (x) {} }
      seekAt(e.clientX);
    });
    track.addEventListener('pointermove', function (e) { if (dragging) seekAt(e.clientX); });
    track.addEventListener('pointerup', function () { dragging = false; wrap.classList.remove('scrubbing'); });
    track.addEventListener('pointercancel', function () { dragging = false; wrap.classList.remove('scrubbing'); });
    track.addEventListener('keydown', function (e) {
      if (!v.duration) return;
      if (e.key === 'ArrowRight' || e.keyCode === 39) { v.currentTime = Math.min(v.duration, v.currentTime + 5); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.keyCode === 37) { v.currentTime = Math.max(0, v.currentTime - 5); e.preventDefault(); }
      else if (e.key === ' ' || e.keyCode === 32) { toggle(); e.preventDefault(); }
    });
  }
})();
