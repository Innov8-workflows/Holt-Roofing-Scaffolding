if(document.querySelector(".case-frame video")){
(function(){
  var vids = document.querySelectorAll('.case-frame video');
  if(!vids.length) return;
  
  vids.forEach(function(v){ v.muted = true; v.controls = false; v.removeAttribute('controls'); });
  if(!('IntersectionObserver' in window)){
    vids.forEach(function(v){ v.play().catch(function(){}); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.play().catch(function(){}); }
      else { en.target.pause(); }
    });
  }, {threshold:0, rootMargin:'200px 0px 200px 0px'});
  vids.forEach(function(v){ io.observe(v); });
})();
}
if(document.querySelector("#baSlider")){
(function(){
  var s = document.getElementById('baSlider');
  if(!s) return;
  var range = s.querySelector('.ba-range'), dragging = false, touched = false;
  function set(p){ p = Math.max(0, Math.min(100, p)); s.style.setProperty('--pos', p + '%'); range.value = Math.round(p); }
  function fromX(x){ var r = s.getBoundingClientRect(); set((x - r.left) / r.width * 100); }
  s.addEventListener('pointerdown', function(e){ if(e.pointerType !== 'mouse') return; dragging = true; touched = true; s.setPointerCapture(e.pointerId); fromX(e.clientX); });
  s.addEventListener('pointermove', function(e){ if(dragging) fromX(e.clientX); });
  ['pointerup','pointercancel','pointerleave'].forEach(function(t){ s.addEventListener(t, function(){ dragging = false; }); });
  
  var tx = 0, ty = 0, horiz = null;
  s.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; ty = e.touches[0].clientY; horiz = null; touched = true; }, {passive:true});
  s.addEventListener('touchmove', function(e){
    var t = e.touches[0];
    if(horiz === null) horiz = Math.abs(t.clientX - tx) > Math.abs(t.clientY - ty);
    if(horiz){ e.preventDefault(); fromX(t.clientX); }
  }, {passive:false});
  range.addEventListener('input', function(){ touched = true; set(+range.value); });
  
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io = new IntersectionObserver(function(en){
      if(!en[0].isIntersecting) return;
      io.disconnect();
      var steps = [50, 30, 70, 50], i = 0;
      (function next(){ if(touched || i >= steps.length) return; s.style.transition = 'none'; animate(steps[i++], next); })();
    }, {threshold:.6});
    io.observe(s);
  }
  function animate(to, done){
    var from = parseFloat(s.style.getPropertyValue('--pos')) || 50, t0 = null;
    function step(t){
      if(touched) return;
      if(t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / 650), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
      set(from + (to - from) * e);
      if(k < 1) requestAnimationFrame(step); else setTimeout(done, 120);
    }
    requestAnimationFrame(step);
  }
})();
}
if(document.querySelector("#revTrack")){
(function(){
  
  var reviews = [
    {
      "src": "g",
      "h": "Sarah M.",
      "w": "Google review",
      "t": "Really glad to have found Holt Roofing as previous roofers have all been disappointing. Josh has been reliable and communicated well throughout. The team were respectful and tidy and they responded promptly when an issue was raised such that we have had them back for a second job since."
    },
    {
      "src": "c",
      "h": "Highly recommend",
      "w": "Roofing repairs, Heanor, DE75",
      "d": "November 2025",
      "t": "Fantastic work from Josh and team at Holt. Roofing, quick to repair leak and then roof end caps fitted, top quality. Honestly can’t give enough praise. All cleaned up after, highly recommend."
    },
    {
      "src": "g",
      "h": "Steve H.",
      "w": "Google review",
      "t": "Reached out to holt roofing for a leak on the side of my dormer that was entering my kids bedroom. Straight away I was given confidence that the issue would be found and fixed. It was all done to a high standard and no mess left behind."
    },
    {
      "src": "g",
      "h": "D. M.",
      "w": "Google review",
      "t": "Josh and his team put a new roof on for us, stripped out old attic rooms, installed 3 new dormer windows, insulated and rebuilt the internal rooms just as they were designed in 1880. Reinstating the lovely curves in the room that we thought we would lose. From start to finish Josh made the process smooth and demonstrated that we could trust him. The quality of work is very good and the finish is just right. His team showed respect for my home and were polite. A very happy customer."
    },
    {
      "src": "c",
      "h": "Excellent",
      "w": "Bay window roof, Ripley, DE5",
      "d": "May 2026",
      "t": "Arrived on the day and time as promised. Renewed roof of Bay window and at a very competitive price. Lovely guys. Pleasant and very respectful, very reassuring for older generation like me. Highly recommend. I would definitely use them again. Thank you Sandy"
    },
    {
      "src": "g",
      "h": "Ivan T.",
      "w": "Google review",
      "t": "We needed a roofer for a new roof on an extension plus stripping and replacing the old roof on the existing building to match. We had an added complication in that we were having flush fitting solar panels installed on the roof by our energy provider. Josh scheduled the work so they were on site when the solar panels were installed and Josh and his team did an excellent job. Communication was very good; Josh was prompt when providing a quote and answering questions throughout the project when we had them. We have had plenty of positive comments from friends and neighbours. The inspection team from the energy provider, also commented that the tiling is one of the best jobs he has seen. I am very happy with the quality and standard of the work Josh and his team have done. I  would highly recommend them."
    },
    {
      "src": "g",
      "h": "David M.",
      "w": "Google review",
      "t": "Can't recommend Holt Roofing enough. Josh and his team were friendly, professional, and did a brilliant job. Communication has been brilliant too with keeping us updated throughout from the no cost quote visit to the job being done. Josh even spotted a few sections on the chimney and ridges which needed repointing and despite this not being part of the original job, he did a bit of maintenance on these at no extra cost, which we thought was showing great duty of care and pride in their work. There were no pressure sales tactics but a calm explanation of what mind be needed to be done on the roof in a couple years time. Safe to say we have asked for another quote from Josh for another job we need doing on a separate flat roof and will be coming back to them in the future as needed."
    },
    {
      "src": "c",
      "h": "Professional and reliable",
      "w": "Flat roofing, Derby, DE22",
      "d": "October 2025",
      "t": "This is a very reliable and trustworthy company. Josh arrives when he says he will, explains the job without being patronising, provides a fair and prompt quote, his team work efficiently and update photos are provided throughout. All the work was done on time and a full clear up afterwards was done. Insulation and flat roof completed with minimal fuss. A throughly professional experience. I'll be keeping this number for future roofing repairs and recommendations."
    },
    {
      "src": "c",
      "h": "Removed and replaced old ridge tiles with clip system.",
      "w": "Dry ridge, Long Eaton, NG10",
      "d": "April 2025",
      "t": "Josh really knows his stuff and provided a quality job at a competitive price. Job completed cleanly, safely and above expectations as Josh replaced some broken tiles which he noticed at no extra charge."
    }
  ];
  var GLOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.6 5.8 21 7 14 2 9.3 9 8.5 12 2"/></svg>';
  var track = document.getElementById('revTrack'), dotsWrap = document.getElementById('revDots');
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  reviews.forEach(function(r){
    var cell = document.createElement('div');
    cell.className = 'rev-cell';
    var google = r.src === 'g';
    cell.innerHTML =
      '<article class="rev-card">' +
        '<div class="rev-top"><div class="rev-av">' + (google ? GLOGO : '<img src="../img/badge-checkatrade.webp" alt="" width="34" height="34">') + '</div>' +
        '<div class="rev-who"><b>' + esc(r.h) + '</b><span>' + esc(r.w) + '</span></div></div>' +
        '<div class="rev-stars" role="img" aria-label="' + (google ? 'Rated 5 out of 5 on Google' : 'Scored 10 out of 10 on Checkatrade') + '">' + STAR + STAR + STAR + STAR + STAR + '</div>' +
        '<div class="rev-body"><p>' + esc(r.t) + '</p><button type="button" class="rev-more" hidden>Read more</button></div>' +
        '<div class="rev-foot">' + (google ? 'Review left on Google' : 'Verified Checkatrade review, ' + r.d) + '</div>' +
      '</article>';
    track.appendChild(cell);
  });
  
  function clampCheck(){
    track.querySelectorAll('.rev-card').forEach(function(card){
      if(card.classList.contains('open')) return;
      var p = card.querySelector('.rev-body p');
      card.querySelector('.rev-more').hidden = p.scrollHeight <= p.clientHeight + 2;
    });
  }
  track.addEventListener('click', function(e){
    var b = e.target.closest('.rev-more');
    if(!b) return;
    var card = b.closest('.rev-card'), open = card.classList.toggle('open');
    b.textContent = open ? 'Show less' : 'Read more';
  });
  clampCheck();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(clampCheck);
  window.addEventListener('resize', clampCheck);
  function perView(){ return window.innerWidth <= 680 ? 1 : (window.innerWidth <= 1024 ? 2 : 3); }
  var pv = perView(), page = 0, timer;
  function pages(){ return Math.max(1, Math.ceil(reviews.length / pv)); }
  function buildDots(){
    dotsWrap.innerHTML = '';
    for(var i = 0; i < pages(); i++){
      (function(i){
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Reviews page ' + (i+1));
        b.addEventListener('click', function(){ go(i); reset(); });
        dotsWrap.appendChild(b);
      })(i);
    }
  }
  function go(n){
    var pc = pages();
    page = (n + pc) % pc;
    track.style.transform = 'translateX(-' + (page*100) + '%)';
    dotsWrap.querySelectorAll('button').forEach(function(b,k){ b.classList.toggle('active', k===page); });
  }
  function reset(){ clearInterval(timer); timer = setInterval(function(){ go(page+1); }, 6500); }
  buildDots(); go(0); reset();
  var view = document.getElementById('revView');
  view.addEventListener('mouseenter', function(){ clearInterval(timer); });
  view.addEventListener('mouseleave', reset);
  document.getElementById('revPrev').addEventListener('click', function(){ go(page-1); reset(); });
  document.getElementById('revNext').addEventListener('click', function(){ go(page+1); reset(); });
  
  var sx = 0, sy = 0;
  view.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive:true});
  view.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){ go(page + (dx < 0 ? 1 : -1)); reset(); }
  }, {passive:true});
  window.addEventListener('resize', function(){
    var n = perView();
    if(n !== pv){ pv = n; buildDots(); go(0); reset(); }
  });
})();
}