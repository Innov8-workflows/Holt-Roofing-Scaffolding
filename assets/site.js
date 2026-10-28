
document.querySelectorAll('.yr').forEach(function(e){ e.textContent = new Date().getFullYear(); });


(function(){
  var b = document.getElementById('burger'), m = document.getElementById('mobileMenu');
  if(!b || !m) return;
  b.addEventListener('click', function(){
    var open = m.classList.toggle('open');
    b.setAttribute('aria-expanded', open);
  });
  m.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ m.classList.remove('open'); b.setAttribute('aria-expanded', false); }); });
})();


(function(){
  var grid = document.getElementById('owGrid');
  if(!grid) return;
  var imgs = Array.prototype.slice.call(grid.querySelectorAll('.ow-item img'));
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg');
  var ci = 0;
  function open(n){ ci = n; lbImg.src = imgs[ci].src; lbImg.alt = imgs[ci].alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
  function nav(d){ ci = (ci + d + imgs.length) % imgs.length; lbImg.src = imgs[ci].src; lbImg.alt = imgs[ci].alt; }
  imgs.forEach(function(im, n){ im.parentElement.addEventListener('click', function(){ open(n); }); });
  var close_ = document.getElementById('lbClose'); if(close_) close_.addEventListener('click', close);
  var prev = document.getElementById('lbPrev'); if(prev) prev.addEventListener('click', function(e){ e.stopPropagation(); nav(-1); });
  var next = document.getElementById('lbNext'); if(next) next.addEventListener('click', function(e){ e.stopPropagation(); nav(1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') nav(-1);
    if(e.key === 'ArrowRight') nav(1);
  });
})();


(function(){
  var btn = document.getElementById('cfSend');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var name = (document.getElementById('cf-name') || {}).value || '';
    var phone = (document.getElementById('cf-phone') || {}).value || '';
    var service = (document.getElementById('cf-service') || {}).value || '';
    var msg = (document.getElementById('cf-msg') || {}).value || '';
    var lines = ['Hi Josh, I found you on your website and would like a free quote.'];
    if(name) lines.push('Name: ' + name);
    if(phone) lines.push('Phone: ' + phone);
    if(service) lines.push('Service: ' + service);
    if(msg) lines.push('Details: ' + msg);
    window.open('https://wa.me/447908961324?text=' + encodeURIComponent(lines.join('\n')), '_blank');
  });
})();


(function(){
  var el = document.getElementById('areaMap'), card = document.getElementById('mapCard');
  if(!el) return;
  var TOWNS = [["Ilkeston",52.9708,-1.3092],["Belper",53.0229,-1.4817],["Kilburn",53.0066,-1.4307],["Ripley",53.0515,-1.4026],["Alfreton",53.0973,-1.39],["Denby",53.0126,-1.4118],["Codnor",53.0425,-1.3766],["Heanor",53.0146,-1.3575],["Heage",53.0499,-1.4491],["Matlock",53.1375,-1.5545],["Derby",52.9142,-1.472],["Long Eaton",52.8986,-1.2708],["Eastwood",53.0172,-1.3039],["Kimberley",52.998,-1.2595],["Smalley",52.9976,-1.3928],["Langley Mill",53.0206,-1.3357],["Loscoe",53.0279,-1.3724]];
  var started = false;
  function load(){
    if(started) return; started = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(css);
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    s.onload = init;
    s.onerror = function(){ card.style.display = 'none'; };
    document.head.appendChild(s);
  }
  function init(){
    var map = L.map(el, { zoomControl:false, dragging:false, scrollWheelZoom:false, doubleClickZoom:false, touchZoom:false, boxZoom:false, keyboard:false, tap:false, zoomSnap:0.25 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:14,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(map);
    map.attributionControl.setPrefix(false);
    TOWNS.forEach(function(t, i){
      var base = i === 0;
      var m = L.marker([t[1], t[2]], { keyboard:false, zIndexOffset: base ? 1000 : 0,
        icon: L.divIcon({ className:'', html:'<div class="' + (base ? 'map-base' : 'map-pin') + '"></div>', iconSize: base ? [16,16] : [12,12] }) }).addTo(map);
      m.bindTooltip(t[0], { direction:'top', offset:[0, base ? -12 : -8], className:'map-tip' });
    });
    function fit(){ map.invalidateSize(); map.fitBounds(TOWNS.map(function(t){ return [t[1], t[2]]; }), { paddingTopLeft:[24,44], paddingBottomRight:[24,22] }); }
    fit();
    window.addEventListener('resize', fit);
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(en){ if(en[0].isIntersecting){ io.disconnect(); load(); } }, { rootMargin:'600px 0px' });
    io.observe(el);
  } else load();
})();
