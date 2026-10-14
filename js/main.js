/* Vila Katarina — animacije pri učitavanju i skrolovanju */
(function () {
  if (window.__vkMotion) return; window.__vkMotion = 1;
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return; // bez podrške: sve odmah vidljivo
  const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mob = () => innerWidth < 720;
  const D = v => (mob() ? v / 2 : v);
  const STEP = () => (mob() ? 50 : 80);
  const html = document.documentElement;
  html.classList.add('vk-js');
  html.style.scrollPaddingTop = '96px';

  const css = document.createElement('style');
  css.textContent = `
html.vk-js:not(.vk-ready) main,html.vk-js:not(.vk-ready) header{opacity:0}
[data-vk-pre]{opacity:0!important}
[data-vk-pre="clip"]{opacity:1!important}
[data-vk-pre="clip"]::after,[data-vk-cur]::after{content:"";position:absolute;inset:-1px;background:var(--vk-cb,#EAE3D6);transform-origin:50% 0;pointer-events:none;z-index:9}
@media (hover:hover) and (pointer:fine){html{scrollbar-gutter:stable}}
[data-vk-line="b"]{border-bottom-color:transparent!important}
[data-vk-line="t"]{border-top-color:transparent!important}
[data-vk-line]::after{content:"";position:absolute;left:0;right:0;height:var(--vk-lw,1px);background:var(--vk-lc);bottom:calc(var(--vk-lw,1px)*-1);transform:scaleX(0);transform-origin:0 50%;transition:transform 1s ${E} var(--vk-ld,0ms);pointer-events:none}
[data-vk-line="t"]::after{bottom:auto;top:calc(var(--vk-lw,1px)*-1)}
[data-vk-line][data-vk-lon]::after{transform:scaleX(1)}
[data-vk-rel]{position:relative}
[data-vk-count]::after{content:attr(data-vk-final);display:block;height:0;overflow:hidden;visibility:hidden;white-space:nowrap;font-variant-numeric:tabular-nums}
#vk-progress{position:fixed;left:0;right:0;top:0;height:2px;background:#C9A24B;transform-origin:0 50%;transform:scaleX(0);z-index:99;pointer-events:none}
header > #vk-progress{position:absolute;left:0;right:0;top:auto;bottom:-1px;height:2px;margin:0;z-index:2}
#vk-top{position:fixed;right:24px;bottom:24px;width:48px;height:48px;border-radius:50%;border:0;background:#2F4A3A;color:#F3EEE5;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:90;opacity:0;pointer-events:none;box-shadow:0 6px 18px -6px rgba(30,46,37,0.45);transition:opacity .4s ${E},background-color .25s ease-out,transform .25s ease-out,bottom .3s ease-out}
#vk-top.on{opacity:1;pointer-events:auto}
#vk-top:hover{background:#1E2E25;transform:translateY(-2px)}
#vk-top:focus-visible{outline:2px solid #C9A24B;outline-offset:3px}
[data-vk-pin]::after{content:"";position:absolute;left:50%;top:50%;width:100%;height:100%;border-radius:50%;background:rgba(201,162,75,0.45);transform:translate(-50%,-50%) scale(1);opacity:0;animation:vk-pulse 3s ${E} 1.2s infinite;pointer-events:none}
@keyframes vk-pulse{0%{transform:translate(-50%,-50%) scale(1);opacity:.6}70%,100%{transform:translate(-50%,-50%) scale(3.2);opacity:0}}
@media (prefers-reduced-motion: reduce){[data-vk-pin]::after{animation:none}#vk-top{transition:opacity .2s}}`;
  document.head.appendChild(css);
  // loading screen: hero animacije čekaju da zavesa krene nagore
  const gated = () => html.classList.contains('vk-l') && !window.__vkGo;
  const safety = () => setTimeout(() => html.classList.add('vk-ready'), 2500); // sigurnosni izlaz
  if (gated()) addEventListener('vk:reveal', () => { safety(); if (document.body) { scan(); onScroll(); } }, { once: true }); else safety();

  // slike: animacija kreće tek kad je slika učitana i dekodirana
  const abs = u => { try { return new URL(u, location.href).href; } catch (e) { return u; } };
  const IP = window.__vkImgP || (window.__vkImgP = {});
  const loadUrl = u => { u = abs(u); if (window.__vkImg) return window.__vkImg(u); if (IP[u]) return IP[u]; const i = new Image(); let p; i.decoding = 'async'; p = IP[u] = new Promise(r => { const fin = () => { p.done = 1; r(); }; i.onload = () => (i.decode ? i.decode() : Promise.resolve()).then(fin, fin); i.onerror = fin; i.src = u; }); p.img = i; return p; };
  const PSEUDO = (() => { try { const a = html.animate(null, { pseudoElement: '::after', duration: 0 }); const ok = a.pseudoElement === '::after'; a.cancel(); return ok; } catch (e) { return false; } })();
  const bgBehind = el => { for (let n = el.parentElement; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c)) return c; } return '#EAE3D6'; };
  const bgUrls = n => { const out = [], s = n.style && n.style.backgroundImage; if (s) s.replace(/url\(["']?([^"')]+)["']?\)/g, (_, u) => out.push(u)); return out; };
  const okSrc = i => { const s = i.getAttribute('src'); return !!s && !/\{\{|%7B%7B/i.test(s); };
  const imgsIn = el => (!el || !el.querySelectorAll ? [] : el.tagName === 'IMG' ? [el] : [...el.querySelectorAll('img')]).filter(okSrc);
  const urlsIn = el => { if (!el || !el.querySelectorAll) return []; const out = []; [el, ...el.querySelectorAll('[style*="url("]')].forEach(n => out.push(...bgUrls(n))); return [...new Set(out.filter(u => u && !/\{\{|%7B%7B/i.test(u)).map(abs))].filter(u => !/^data:/.test(u)); };
  const imgDone = i => i.complete ? (i.decode ? i.decode().catch(() => {}) : null) : new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }).then(() => i.decode && i.decode().catch(() => {}));
  const ready = el => Promise.race([Promise.all([...urlsIn(el).map(loadUrl), ...imgsIn(el).map(imgDone)]), new Promise(r => setTimeout(r, 8000))]);
  if (window.__vkImgs && !window.__vkImg) window.__vkImgs.forEach(loadUrl);

  let lockY = null;
  const claimed = new WeakSet(), seen = new WeakSet(), reg = new Map();
  let started = false, settled = false;
  const cs = el => getComputedStyle(el);
  const isSC = n => n && n.tagName && (n.tagName.startsWith('SC-') || n.tagName.startsWith('X-') || n.tagName === 'DC-IMPORT');
  const kids = el => { const out = []; for (const k of el.children) { if (isSC(k) || cs(k).display === 'contents') out.push(...kids(k)); else out.push(k); } return out; };
  const gp = el => { let p = el.parentElement; while (p && (isSC(p) || cs(p).display === 'contents')) p = p.parentElement; return p; };
  const up = el => { for (let n = el; n && n !== document.body; n = n.parentElement) if (claimed.has(n)) return true; return false; };
  const bad = el => {
    if (el.closest('header,[aria-hidden="true"],[role="dialog"]')) return true;
    for (let n = el; n && n !== document.body; n = n.parentElement) if (cs(n).position === 'fixed') return true;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return true;
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) { const c = cs(n); if (/auto|scroll/.test(c.overflowX) || /auto|scroll/.test(c.overflowY) && n.scrollHeight > n.clientHeight + 2) return true; }
    if (settled && r.top + scrollY < scrollY + innerHeight) return true; // ne diraj sadržaj koji je već na ekranu
    return false;
  };
  const MOB = matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;
  const anim = (el, kf, o) => { o = Object.assign({ duration: 700, easing: E, fill: 'backwards' }, o); if (MOB) { o.duration = Math.min(450, o.duration * 0.6); o.delay = (o.delay || 0) * 0.5; } return el.animate(kf, o); };

  // element sa clip-path ima nultu vidljivu površinu, pa za "zavesu" posmatramo roditelja
  const proxy = new Map();
  const observe = el => { const r = reg.get(el); if (r && r.type === 'clip' && el.parentElement) { const p = el.parentElement; if (!proxy.has(p)) proxy.set(p, new Set()); proxy.get(p).add(el); io.observe(p); } else io.observe(el); };
  const unobserve = el => { const p = el.parentElement, s = p && proxy.get(p); if (s && s.delete(el)) { if (!s.size) { proxy.delete(p); if (!reg.has(p)) io.unobserve(p); } } else io.unobserve(el); };
  const counters = new Set();
  // jedan zajednički observer za pojavljivanje i brojače
  const io = new IntersectionObserver(entries => {
    const out = [];
    entries.filter(e => e.isIntersecting).forEach(e => {
      const t = e.target, s = proxy.get(t);
      if (counters.has(t)) { counters.delete(t); if (!reg.has(t) && !s) io.unobserve(t); countUp(t, 200); }
      if (s) out.push(...s); if (reg.has(t)) out.push(t);
    });
    if (out.length) reveal(out);
  }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
  function reveal(els) {
    const groups = new Map();
    [...new Set(els)].forEach(el => { const r = reg.get(el); if (!r || r.manual) return; unobserve(el); const g = r.group || el; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(el); });
    groups.forEach(list => {
      list.sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
      const rs = list.map(el => { el.__vkWait = 1; return reg.get(el); });
      Promise.all(list.map(ready)).then(() => requestAnimationFrame(() => list.forEach((el, i) => {
        el.__vkWait = 0; const r = rs[i];
        if (!el.isConnected || reg.get(el) !== r) return;
        play(el, r, (r.delay || 0) + Math.min(i, 5) * (r.step || STEP()));
      })));
    });
  }
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight * 0.95 && r.right > 0 && r.left < innerWidth; };
  // prikaži odmah, bez animacije
  function show(el) {
    el.getAnimations().forEach(a => { try { a.finish(); } catch (e) { a.cancel(); } });
    if (el.__vkInner) el.__vkInner.getAnimations().forEach(a => { try { a.finish(); } catch (e) { a.cancel(); } });
    el.removeAttribute('data-vk-pre'); el.removeAttribute('data-vk-cur'); el.style.removeProperty('--vk-cb'); el.__vkPlayed = 1; reg.delete(el); unobserve(el);
  }
  // sigurnosna mreža: sve što je na ekranu duže od 1.5 s a još je sakriveno, prikaži odmah
  setInterval(() => {
    const now = performance.now();
    document.querySelectorAll('[data-vk-pre]').forEach(el => {
      if (!el.isConnected || el.__vkWait) return;
      if (!inView(el)) { el.__vkSeen = 0; return; }
      if (!el.__vkSeen) el.__vkSeen = now; else if (now - el.__vkSeen > 1500) show(el);
    });
  }, 300);

  function prep(el, type, o = {}) {
    if (claimed.has(el)) return;
    claimed.add(el);
    if (document.hidden && !o.manual) return; // skriven dokument: sadržaj ostaje vidljiv
    reg.set(el, Object.assign({ type }, o));
    if (o.manual) { el.setAttribute('data-vk-pre', type === 'clip' ? 'clip' : ''); return; }
    fresh.push(el); // atribut se postavlja zajedno na kraju skeniranja (bez ponovnog računanja stilova)
  }
  let fresh = [];

  // pojavljivanje koristi samo opacity i zasebna svojstva translate/scale, pa se ne sudara sa transform-om
  // koji element već ima (hover, rotacija, React stanje). Svaki element se animira tačno jednom.
  function play(el, r, delay) {
    el.removeAttribute('data-vk-pre');
    reg.delete(el); unobserve(el);
    if (el.__vkPlayed) return; el.__vkPlayed = 1;
    setTimeout(() => { if (el.isConnected && el.getAnimations().some(a => a.playState !== 'finished' && (a.currentTime || 0) < 1)) show(el); }, delay + 1500);
    lazyFade(el);
    if (RM) { anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: Math.min(delay, 200) }); return; }
    const t = MOB && /^(scale|label|review|pop|pin|heroImg)$/.test(r.type) ? 'up' : r.type;
    if (t === 'up' || t === 'card' || t === 'row') {
      anim(el, [{ opacity: 0, translate: '0 ' + D(r.d || 24) + 'px' }, { opacity: 1, translate: '0 0' }], { delay, duration: r.dur || 700 });
      if (t === 'card') el.querySelectorAll('[data-ic]').forEach(ic => anim(ic, [{ opacity: 0, scale: '0.6' }, { opacity: 1, scale: '1' }], { delay: delay + 220, duration: 650 }));
      if (t === 'row' && r.line) drawLine(el, r.line, delay + 120);
    } else if (t === 'scale') {
      anim(el, [{ opacity: 0, scale: '0.96' }, { opacity: 1, scale: '1' }], { delay, duration: 800 });
    } else if (t === 'clip') {
      curtain(el, r, delay);
    } else if (t === 'label') {
      anim(el, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], { delay, duration: 900 });
    } else if (t === 'heading') {
      heading(el, delay);
    } else if (t === 'review') {
      anim(el, [{ opacity: 0, translate: D(60) * (r.side || 1) + 'px 0' }, { opacity: 1, translate: '0 0' }], { delay, duration: 1100 });
    } else if (t === 'pop') {
      anim(el, [{ opacity: 0, scale: String(r.s || 0.94) }, { opacity: 1, scale: '1' }], { delay, duration: 700 });
      (r.also || []).forEach(p => anim(p, [{ opacity: 0, scale: '0.7' }, { opacity: 1, scale: '1' }], { delay: delay + 250, duration: 650 }));
    } else if (t === 'heroImg') {
      anim(el, [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'none' }], { delay, duration: 1600 });
    } else if (t === 'pin') {
      anim(el, [{ opacity: 0, translate: '0 -40px' }, { opacity: 1, translate: '0 0' }], { delay, duration: 900 });
    } else {
      anim(el, [{ opacity: 0 }, { opacity: 1 }], { delay });
    }
  }
  // „zavesa": pseudo-element u boji pozadine skuplja se nagore (transform), slika se blago smanjuje (scale)
  function curtain(el, r, delay) {
    const end = () => { el.removeAttribute('data-vk-cur'); el.style.removeProperty('--vk-cb'); };
    if (r.inner) anim(r.inner, [{ scale: '1.15' }, { scale: '1' }], { delay, duration: 1200 });
    if (!PSEUDO) { end(); anim(el, [{ opacity: 0 }, { opacity: 1 }], { delay, duration: 900 }); return; }
    el.setAttribute('data-vk-cur', '');
    const a = anim(el, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { delay, duration: 1100, pseudoElement: '::after', fill: 'both' });
    a.onfinish = a.oncancel = end;
  }

  function lazyFade(el) {
    const imgs = el.tagName === 'IMG' ? [el] : [...el.querySelectorAll('img')];
    imgs.forEach(img => { if (img.complete || img.__vkLazy) return; img.__vkLazy = 1; img.addEventListener('load', () => { if (!RM) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: E }); }, { once: true }); });
  }
  function drawLine(el, side, delay) {
    const c = cs(el), w = side === 't' ? c.borderTopWidth : c.borderBottomWidth, col = side === 't' ? c.borderTopColor : c.borderBottomColor;
    if (c.position === 'static') el.setAttribute('data-vk-rel', '');
    el.style.setProperty('--vk-lc', col); el.style.setProperty('--vk-lw', w); el.style.setProperty('--vk-ld', delay + 'ms');
    el.setAttribute('data-vk-line', side === 't' ? 't' : 'b');
    requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('data-vk-lon', '')));
    setTimeout(() => { ['data-vk-line', 'data-vk-lon'].forEach(a => el.removeAttribute(a)); ['--vk-lc', '--vk-lw', '--vk-ld'].forEach(p => el.style.removeProperty(p)); }, delay + 1150);
  }

  const busy = el => { el.__vkBusy = (el.__vkBusy || 0) + 1; setTimeout(() => { el.__vkBusy--; }, 0); };
  // naslov se pojavljuje kao celina (opacity + translate): bez deljenja na redove i bez vraćanja originalnog teksta,
  // pa nema promene rasporeda posle animacije
  function heading(h, delay) {
    anim(h, [{ opacity: 0, translate: '0 ' + D(24) + 'px' }, { opacity: 1, translate: '0 0' }], { delay, duration: 900 });
  }

  // brojanje
  const NUM = /^(\d+(?:[.,]\d+)?)(\s?(?:\+|€|km|m|min|h))?$/i;
  const cGroup = el => el.closest('tr,[data-row],[role="row"]') || (el.parentElement && el.parentElement.parentElement) || el;
  const pending = new Set();
  function countUp(el, delay) {
    if (el.__vkCounted) return; el.__vkCounted = 1; pending.delete(el);
    const g = cGroup(el); [...pending].forEach(o => { if (cGroup(o) === g) { counters.delete(o); if (!reg.has(o)) io.unobserve(o); countOne(o, delay); o.__vkCounted = 1; pending.delete(o); } });
    countOne(el, delay);
  }
  function countOne(el, delay) {
    const tn = el.firstChild; if (!tn || tn.nodeType !== 3) return;
    const orig = tn.nodeValue, m = orig.trim().match(NUM); if (!m) return;
    const lead = orig.slice(0, orig.indexOf(m[1])), tail = orig.slice(orig.indexOf(m[1]) + m[0].length);
    const target = parseFloat(m[1].replace(',', '.')), dec = (m[1].split(/[.,]/)[1] || '').length, sep = m[1].includes(',') ? ',' : '.', suf = m[2] || '';
    const L = m[1].length;
    const fmt = v => { const s = v.toFixed(dec).replace('.', sep); return lead + s + suf + tail; };
    if (document.hidden) return;
    el.style.fontVariantNumeric = 'tabular-nums';
    const c = cs(el); if (c.display === 'inline') el.style.display = 'inline-block';
    el.setAttribute('data-vk-final', orig.trim()); el.setAttribute('data-vk-count', ''); el.style.whiteSpace = 'nowrap';
    const dur = 1200; let last = fmt(0), t0, best = 0;
    const done = () => { el.removeAttribute('data-vk-count'); el.removeAttribute('data-vk-final'); el.style.whiteSpace = ''; };
    const stars = el.nextElementSibling && /^★+$/.test(el.nextElementSibling.textContent.trim()) ? el.nextElementSibling : null;
    requestAnimationFrame(now => { t0 = now + delay; tn.nodeValue = last; if (stars) starsPrep(stars); requestAnimationFrame(f); });
    setTimeout(() => { if (tn.nodeValue === last) tn.nodeValue = orig; done(); if (stars) starsPlay(stars); }, delay + dur + 600);
    const f = now => {
      if (tn.nodeValue !== last) { done(); if (stars) starsPlay(stars, 0); return; } // React je promenio vrednost
      const t = Math.min(1, Math.max(0, (now - t0) / dur));
      best = Math.min(target, Math.max(best, target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) { last = fmt(best); tn.nodeValue = last; requestAnimationFrame(f); }
      else { tn.nodeValue = orig; done(); if (stars) starsPlay(stars, 0); }
    };
    if (stars) setTimeout(() => starsPlay(stars, 0), delay + dur * 0.55);
  }
  function starsPrep(s) {
    if (s.__vk) return; const orig = [...s.childNodes], txt = s.textContent;
    const spans = [...txt].map(ch => { const e = document.createElement('span'); e.textContent = ch; e.style.opacity = '0.2'; return e; });
    busy(s); s.replaceChildren(...spans); s.__vk = { orig, spans };
  }
  function starsPlay(s) {
    const st = s.__vk; if (!st || st.played) return; st.played = 1; let last;
    st.spans.forEach((e, i) => { last = e.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 400, delay: i * 120, easing: E, fill: 'forwards' }); });
    if (last) last.onfinish = () => { busy(s); s.replaceChildren(...st.orig); delete s.__vk; };
  }

  function cardLike(k) {
    const c = cs(k);
    if (k.tagName === 'BUTTON' || k.tagName === 'A' && !k.hasAttribute('data-hc')) return false;
    if (parseFloat(c.borderTopLeftRadius) < 6) return false;
    const bg = c.backgroundColor, hasBg = bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg);
    if (!(parseFloat(c.borderTopWidth) >= 1 || hasBg || c.boxShadow !== 'none')) return false;
    const h = k.getBoundingClientRect().height; return h > 60 && h < 1000 && !k.querySelector('h1');
  }
  const hasClaimedDesc = el => { for (const n of el.querySelectorAll('*')) if (claimed.has(n)) return true; return false; };
  const isMedia = el => { if (el.tagName === 'IMG') return true; if (el.getAttribute('role') === 'img') return true; const b = cs(el).backgroundImage; return b && (b.includes('url(') || b.includes('repeating-linear-gradient')); };

  function scan() { try { scanInner(); } catch (e) { console.error('[vk] animacije:', e); flush(); } }
  function scanInner() {
    const main = document.querySelector('main'); if (!main) return;
    const hero = main.querySelector('section');
    if (started && heroH1 && !heroH1.isConnected && !settled && hero && hero.querySelector('h1')) heroSeq(hero);
    if (!started) {
      if (gated()) return;
      if (!fontsOk) { if (!fontsWait) { fontsWait = 1; const go = () => { if (fontsOk) return; fontsOk = true; scan(); onScroll(); }; (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go, go); setTimeout(go, 3000); } return; }
      if (!hero || !hero.querySelector('h1')) return;
      if (!quiet) { clearTimeout(qt); qt = setTimeout(() => { quiet = true; scan(); onScroll(); }, 180); return; }
      started = true;
      const hdr = document.querySelector('header');
      html.classList.add('vk-ready');
      if (!RM) {
        if (hdr) anim(hdr, [{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'none' }], { duration: 700 });
        anim(main, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
      } else anim(main, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
      heroSeq(hero);
      setTimeout(() => { settled = true; }, 1500);
    }
    // recenzije
    main.querySelectorAll('figure').forEach(f => {
      if (up(f) || bad(f) || !/rotate/.test(f.style.transform || '')) return;
      const sec = f.closest('section'), sr = sec.getBoundingClientRect(), fr = f.getBoundingClientRect();
      prep(f, 'review', { group: sec, side: fr.left + fr.width / 2 < sr.left + sr.width / 2 ? -1 : 1, step: 140 });
      const col = [...(gp(gp(f)) || f).children].find(c => /^9,6$/.test(c.textContent.trim().slice(0, 3)) || c.querySelector && [...c.querySelectorAll('div')].some(d => d.textContent.trim() === '9,6'));
      if (col && !claimed.has(col) && !col.contains(f)) prep(col, 'up', { d: 24, delay: 650 });
    });
    // istaknuta kolona
    main.querySelectorAll('span').forEach(s => {
      if (s.textContent.trim() !== 'Najtraženiji' || up(s)) return;
      const ov = s.parentElement; if (bad(ov)) return;
      prep(ov, 'pop', { delay: 750, s: 0.97, also: [s] });
    });
    // kartice
    const cardSet = new Set();
    main.querySelectorAll('[data-hc]').forEach(el => cardSet.add(el));
    main.querySelectorAll('div').forEach(p => {
      const ks = kids(p); if (ks.length < 2 || ks.length > 16) return;
      const d = cs(p).display; if (!/grid|flex/.test(d)) return;
      if (ks.every(cardLike)) ks.forEach(k => cardSet.add(k));
    });
    cardSet.forEach(el => { if (!up(el) && !bad(el)) prep(el, 'card', { group: gp(el), d: 32 }); });
    // liste sa linijama
    main.querySelectorAll('div,ul,ol,dl').forEach(p => {
      const ks = kids(p); if (ks.length < 3 || ks.length > 40) return;
      const sides = ks.map(k => { const c = cs(k); return parseFloat(c.borderBottomWidth) >= 1 ? 'b' : parseFloat(c.borderTopWidth) >= 1 ? 't' : null; });
      if (sides.filter(Boolean).length < ks.length - 1) return;
      if (ks.some(k => parseFloat(cs(k).borderTopLeftRadius) >= 6)) return;
      ks.forEach((k, i) => { if (!up(k) && !bad(k)) prep(k, 'row', { group: p, d: 24, line: sides[i] }); });
    });
    // fotografije
    const frames = new Set();
    main.querySelectorAll('img,div,span,button[data-tile]').forEach(el => {
      if (seen.has(el)) return; seen.add(el);
      if (!isMedia(el) || up(el) || el.closest('[aria-hidden="true"]')) return;
      let fr = el, n = el;
      for (let i = 0; i < 3 && n.parentElement; i++) { n = n.parentElement; if (/^(SECTION|MAIN)$/.test(n.tagName) || n.querySelector('h1,h2')) break; if (cs(n).overflow === 'hidden' || cs(n).overflowX === 'hidden') fr = n; }
      const r = fr.getBoundingClientRect(); if (r.width < 120 || r.height < 100 || up(fr) || bad(fr)) return;
      fr.__vkInner = el !== fr ? el : [...fr.querySelectorAll('img,[role="img"]')][0] || null;
      frames.add(fr);
    });
    const byParent = new Map();
    frames.forEach(f => { const p = gp(f); if (!byParent.has(p)) byParent.set(p, []); byParent.get(p).push(f); });
    byParent.forEach((fs, p) => {
      const sibs = kids(p).filter(k => frames.has(k) || claimed.has(k) && reg.get(k) && reg.get(k).type === 'scale');
      if (sibs.length >= 3 || fs.length >= 3) fs.forEach(f => { prep(f, 'scale', { group: p }); mosaics.add(p); });
      else if (fs.length >= 2 && fs[0].getBoundingClientRect().width < 260) fs.forEach(f => prep(f, 'up', { group: p, d: 20, delay: 250 }));
      else fs.forEach(f => prep(f, 'clip', { inner: f.__vkInner }));
    });
    // zaglavlja sekcija
    main.querySelectorAll('h1,h2').forEach(h => {
      if (up(h) || bad(h)) return;
      const prev = h.previousElementSibling, next = h.nextElementSibling;
      if (prev && prev.tagName === 'P' && !up(prev) && parseFloat(cs(prev).letterSpacing) > 1.5) prep(prev, 'label');
      prep(h, 'heading', { delay: 80 });
      if (next && next.tagName === 'P' && !up(next)) prep(next, 'up', { d: 20, delay: 220 });
    });
    // tekst
    main.querySelectorAll('p,ul,ol,blockquote,h3,h4,dl,div').forEach(el => {
      if (up(el) || bad(el)) return;
      if (el.tagName === 'DIV') { const ks = kids(el); if (!ks.length || !ks.every(k => /^(A|BUTTON)$/.test(k.tagName)) || hasClaimedDesc(el)) return; }
      if (el.tagName === 'UL' || el.tagName === 'OL') { const ks = kids(el).filter(k => !up(k)); if (ks.length >= 3) { ks.forEach(k => prep(k, 'up', { group: el, d: 24 })); return; } }
      prep(el, 'up', { group: gp(el), d: 24 });
    });
    // ostale mreže (statistika i sl.)
    main.querySelectorAll('div').forEach(p => {
      if (up(p) || cs(p).display !== 'grid') return;
      const ks = kids(p); if (ks.length < 2 || ks.length > 8) return;
      if (ks.some(k => up(k) || hasClaimedDesc(k) || bad(k) || k.querySelector('h1,h2,input,select,textarea,button'))) return;
      ks.forEach(k => prep(k, 'up', { group: p, d: 24 }));
    });
    // brojevi
    if (!RM) main.querySelectorAll('div,span,strong').forEach(el => {
      if (el.__vkNum || el.children.length || !el.firstChild || el.firstChild.nodeType !== 3) return;
      const t = el.textContent.trim(); if (!NUM.test(t)) return;
      const c = cs(el); if (parseFloat(c.fontSize) < 18 || parseInt(c.fontWeight) < 500) return;
      const sec = el.closest('section'); if (sec && sec.querySelector('input,textarea,select')) return;
      if (el.closest('header,[aria-hidden="true"]') || (settled && el.getBoundingClientRect().top < innerHeight)) return;
      el.__vkNum = 1; pending.add(el); counters.add(el); io.observe(el);
    });
    main.querySelectorAll('[data-vk-pin]').forEach(p => { if (!up(p)) prep(p, 'pin', { delay: 400 }); });
    mosaicSig();
    // slike van animacija koje još nisu spremne: nevidljive dok se ne dekodiraju
    main.querySelectorAll('img').forEach(img => {
      if (img.__vkLz || !okSrc(img) || img.complete || img.closest('[data-vk-pre]') || up(img)) return; img.__vkLz = 1;
      img.style.opacity = '0';
      ready(img).then(() => { img.style.opacity = ''; if (!RM) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: E }); });
    });
    // već vidljivo pri učitavanju: odmah, bez čekanja na skrol
    const list = fresh; fresh = [];
    const vis = list.filter(el => el.isConnected && inView(el));
    list.forEach(el => { const r = reg.get(el); if (!r) return;
      if (r.type === 'clip') { el.style.setProperty('--vk-cb', bgBehind(el)); if (cs(el).position === 'static') el.setAttribute('data-vk-rel', ''); }
      el.setAttribute('data-vk-pre', r.type === 'clip' ? 'clip' : ''); observe(el); });
    // osvežavanje na sredini stranice: ono što je već na ekranu prikazuje se odmah
    if (vis.length) { if (!firstDone && scrollY > 80) vis.forEach(show); else reveal(vis); }
    if (started) firstDone = true;
  }
  let firstDone = false;

  let heroH1 = null, quiet = false, qt, fontsOk = !document.fonts || document.fonts.status === 'loaded', fontsWait = 0;
  function heroSeq(hero) {
    const h1 = hero.querySelector('h1'), cont = h1.parentElement; heroH1 = h1;
    let d = 180;
    const img = [...hero.querySelectorAll('img')].find(i => cs(i).position === 'absolute');
    if (img) { prep(img, 'heroImg', { manual: 1 }); const r = reg.get(img); heroPar = img; if (r) { img.__vkWait = 1; ready(img).then(() => { img.__vkWait = 0; if (reg.get(img) === r) play(img, r, 0); }); } }
    kids(cont).forEach(k => {
      if (claimed.has(k)) return;
      const type = k === h1 ? 'heading' : 'up';
      prep(k, type, { manual: 1, d: 20 }); play(k, reg.get(k), d);
      d += k === h1 ? 260 : 120;
    });
    const panels = [...hero.querySelectorAll('[data-panel]')].filter(p => !claimed.has(p)), pd = d;
    panels.forEach(p => { prep(p, 'up', { manual: 1, d: 40 }); p.__vkWait = 1; });
    const prs = panels.map(p => reg.get(p)), pt = performance.now();
    if (panels.length) Promise.all(panels.map(ready)).then(() => panels.forEach((p, i) => { p.__vkWait = 0; if (prs[i] && reg.get(p) === prs[i]) play(p, prs[i], Math.max(0, pd + 80 + i * 150 - (performance.now() - pt))); }));
  }

  // filteri (Galerija, Lokacija): sve stavke ostaju u stranici; odlazeće izblede, nove se pojave, preostale glatko
  // pređu na novo mesto (FLIP preko translate/scale, ne dira transform koji koristi hover). Novi klik prekida tekući.
  window.__vkFilter = (grid, next, commit, after) => {
    const run0 = grid.__vkRun; const cur = new Map();
    if (run0) { run0.items.forEach(el => { const c = cs(el); cur.set(el, { o: parseFloat(c.opacity), s: c.scale && c.scale !== 'none' ? parseFloat(c.scale) : 1 }); }); run0.cancel(); }
    const anims = [], timers = [], run = { items: [], cancel() { timers.forEach(clearTimeout); anims.forEach(a => { try { a.cancel(); } catch (e) {} }); run.items.forEach(el => { el.style.opacity = ''; el.__vkIn = 1; }); grid.style.height = ''; grid.style.overflow = ''; grid.style.alignContent = ''; } };
    grid.__vkRun = run;
    const items = [...grid.querySelectorAll('[data-fk]')];
    run.items = items;
    const shown = el => el.getClientRects().length > 0;
    items.forEach(el => { el.getAnimations().forEach(a => { try { a.finish(); } catch (e) {} }); if (el.hasAttribute('data-vk-pre')) show(el); el.__vkPlayed = 1; });
    const vis = items.filter(shown), first = new Map(vis.map(el => [el, el.getBoundingClientRect()])), h0 = grid.offsetHeight;
    const leaving = vis.filter(el => !next.has(el.getAttribute('data-fk')));
    const E2 = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const finish = () => {
      leaving.forEach(el => el.getAnimations().forEach(a => a.cancel()));
      const now = items.filter(shown), h1 = grid.offsetHeight;
      const entering = [];
      if (!RM) {
        let k = 0;
        now.forEach(el => {
          const F = first.get(el);
          if (!F) { el.style.opacity = '0'; entering.push([el, Math.min(k++, 8) * 45]); return; }
          // samo klizanje (translate); ako se veličina promenila, kratko se pojavi na novom mestu u novoj veličini
          const L = el.getBoundingClientRect(), dx = F.left - L.left, dy = F.top - L.top;
          if (Math.abs(F.width - L.width) > 1) { anims.push(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: 'ease-out' })); return; }
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
          anims.push(el.animate([{ translate: dx + 'px ' + dy + 'px' }, { translate: '0 0' }], { duration: 400, easing: E2 }));
        });
        // nove stavke: sakrivene odmah, animacija kreće u sledećem frejmu (posle iscrtavanja), uz rezervni izlaz
        const reveal = () => entering.forEach(([el, d]) => { if (el.__vkIn) return; el.__vkIn = 1; const x = el.animate([{ opacity: 0, scale: '0.96' }, { opacity: 1, scale: '1' }], { duration: 300, delay: d, easing: E2, fill: 'backwards' }); el.style.opacity = ''; anims.push(x); });
        entering.forEach(([el]) => { el.__vkIn = 0; });
        requestAnimationFrame(reveal);
        timers.push(setTimeout(() => { reveal(); entering.forEach(([el]) => { el.style.opacity = ''; }); anims.forEach(x => { if (x.pending || ((x.currentTime || 0) === 0 && x.playState === 'running')) { try { x.finish(); } catch (e) {} } }); }, 700));
        if (Math.abs(h1 - h0) > 1) { grid.style.overflow = 'visible'; grid.style.alignContent = cs(grid).display.includes('flex') ? 'flex-start' : 'start'; const ha = grid.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 400, easing: E2 }); ha.onfinish = ha.oncancel = () => { grid.style.overflow = ''; grid.style.alignContent = ''; }; anims.push(ha); }
      }
      timers.push(setTimeout(() => { if (grid.__vkRun === run) grid.__vkRun = null; }, 800));
      if (after) after();
    };
    if (RM || !leaving.length) { commit(finish); return; }
    leaving.forEach(el => { const c = cur.get(el) || { o: 1, s: 1 }; anims.push(el.animate([{ opacity: c.o, scale: String(c.s) }, { opacity: 0, scale: '0.96' }], { duration: 250 * Math.max(0.3, c.o), easing: 'ease-out', fill: 'forwards' })); });
    timers.push(setTimeout(() => { if (grid.__vkRun === run || !grid.__vkRun) commit(finish); }, 250));
  };

  // Galerija: prelaz cele mreže (izbledi, novi raspored dok je nevidljiva, slike se pojave jedna za drugom).
  // Veličina slike se nikad ne menja dok je vidljiva. Novi klik prekida tekući prelaz.
  window.__vkGridSwap = (grid, commit, after) => {
    const r0 = grid.__vkSwap; let fromOp = 1;
    if (r0) { fromOp = r0.phase === 'out' ? parseFloat(cs(grid).opacity) || 0 : 1; r0.cancel(); }
    const items = [...grid.querySelectorAll('[data-fk]')], shown = el => el.getClientRects().length > 0;
    items.forEach(el => { if (el.hasAttribute('data-vk-pre')) show(el); el.__vkPlayed = 1; });
    const anims = [], timers = [], E2 = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const run = { phase: 'out', cancel() { timers.forEach(clearTimeout); anims.forEach(a => { try { a.cancel(); } catch (e) {} }); items.forEach(el => { el.style.opacity = ''; }); grid.style.overflow = ''; grid.style.alignContent = ''; } };
    grid.__vkSwap = run;
    if (RM) { commit(() => { grid.__vkSwap = null; if (after) after(); }); return; }
    const h0 = grid.offsetHeight, tOut = Math.round(180 * fromOp);
    const out = grid.animate([{ opacity: fromOp }, { opacity: 0 }], { duration: Math.max(1, tOut), easing: 'ease-out', fill: 'forwards' });
    anims.push(out);
    timers.push(setTimeout(() => commit(() => {
      if (grid.__vkSwap !== run) return;
      run.phase = 'in';
      const vis = items.filter(shown);
      vis.forEach(el => { el.style.opacity = '0'; });
      out.cancel();
      const h1 = grid.offsetHeight;
      if (Math.abs(h1 - h0) > 1) { grid.style.overflow = 'visible'; grid.style.alignContent = cs(grid).display.includes('flex') ? 'flex-start' : 'start'; const ha = grid.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 300, easing: E2 }); ha.onfinish = ha.oncancel = () => { grid.style.overflow = ''; grid.style.alignContent = ''; }; anims.push(ha); }
      let started = false;
      const start = () => { if (started || grid.__vkSwap !== run) return; started = true; vis.forEach((el, i) => { anims.push(el.animate([{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 300, delay: Math.min(i, 8) * 40, easing: E2, fill: 'backwards' })); el.style.opacity = ''; }); };
      requestAnimationFrame(start);
      timers.push(setTimeout(() => { start(); vis.forEach(el => { el.style.opacity = ''; }); anims.forEach(x => { if (x.pending || ((x.currentTime || 0) === 0 && x.playState === 'running')) { try { x.finish(); } catch (e) {} } }); }, 800));
      timers.push(setTimeout(() => { if (grid.__vkSwap === run) grid.__vkSwap = null; }, 1000));
      if (after) after();
    }), tOut));
  };

  // Galerija: ponovno pojavljivanje posle filtera
  const mosaics = new Set(), sigs = new WeakMap();
  const sig = p => kids(p).map(k => (k.getAttribute('aria-label') || '') + cs(k).gridColumn).join('|');
  function mosaicSig() { try { mosaicInner(); } catch (e) { console.error('[vk] galerija:', e); } }
  function mosaicInner() {
    mosaics.forEach(p => {
      if (p.closest('[data-vk-flt]')) return;
      if (!p.isConnected) { mosaics.delete(p); return; }
      const s = sig(p); if (!sigs.has(p)) { sigs.set(p, s); return; }
      if (s === sigs.get(p)) return; sigs.set(p, s);
      kids(p).forEach(k => { if (k.hasAttribute('data-vk-pre') && inView(k)) show(k); });
      if (RM) return;
      const vis = kids(p).filter(k => { const r = k.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
      vis.forEach(k => { k.__vkWait = 1; k.setAttribute('data-vk-pre', ''); });
      Promise.all(vis.map(ready)).then(() => requestAnimationFrame(() => vis.forEach((k, i) => { k.__vkWait = 0; k.removeAttribute('data-vk-pre'); anim(k, [{ opacity: 0, scale: '0.96' }, { opacity: 1, scale: '1' }], { delay: Math.min(i, 5) * STEP(), duration: 800 }); })));
    });
  }
  document.addEventListener('click', () => [80, 320, 650].forEach(t => setTimeout(mosaicSig, t)), true);

  // traka napretka, dugme nazad na vrh, paralaks
  let heroPar = null, bar, topBtn;
  function chrome() {
    if (bar) return;
    bar = document.createElement('div'); bar.id = 'vk-progress'; bar.setAttribute('aria-hidden', 'true');
    topBtn = document.createElement('button'); topBtn.id = 'vk-top'; topBtn.type = 'button'; topBtn.setAttribute('aria-label', 'Nazad na vrh');
    topBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    topBtn.onclick = () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    const hd = document.querySelector('header'); if (hd) hd.appendChild(bar); else document.body.append(bar); document.body.append(topBtn);
  }
  const ctaBgs = () => /galerija|lokacija|kontakt/i.test(decodeURIComponent(location.pathname)) ? [...document.querySelectorAll('main section[data-screen-label^="Poziv"] > [aria-hidden="true"]:first-child')].filter(b => !b.style.transform) : [];
  // jedan rAF ciklus za sve: stranice (header), traka napretka, dugme na vrh, paralaks.
  // Prvo sva čitanja rasporeda, pa sva pisanja.
  const subs = new Set();
  window.__vkScroll = fn => { subs.add(fn); return () => subs.delete(fn); };
  let ticking = false, stickyAt = -1e9, stickyEl = null, ctaList = [];
  function onScroll() {
    if (lockY !== null || ticking) return;
    ticking = true; requestAnimationFrame(frame);
  }
  function frame() { try { frameInner(); } catch (e) { ticking = false; console.error('[vk] skrol:', e); } }
  function frameInner() {
    ticking = false; chrome();
    subs.forEach(fn => { try { fn(); } catch (e) {} });
    const y = scrollY, vh = innerHeight, max = html.scrollHeight - vh, now = performance.now(), parOn = !RM && !mob();
    if (now - stickyAt > 1000) { stickyAt = now; stickyEl = document.querySelector('[data-vk-sticky]'); ctaList = ctaBgs(); }
    const off = 24 + (stickyEl && stickyEl.isConnected ? stickyEl.offsetHeight : 0);
    const hh = heroPar ? heroPar.offsetHeight || 1 : 1;
    const ctas = parOn ? ctaList.filter(b => b.isConnected).map(b => [b, b.parentElement.getBoundingClientRect(), b.offsetHeight]) : [];
    const hdr = document.querySelector('header'); if (hdr && bar.parentNode !== hdr) hdr.appendChild(bar);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    topBtn.classList.toggle('on', y > vh);
    topBtn.style.bottom = off + 'px';
    if (heroPar) { const sh = parOn ? Math.min(60, y * 0.25) : 0; heroPar.style.transformOrigin = '50% 100%'; heroPar.style.translate = sh ? `0 ${sh.toFixed(1)}px` : ''; heroPar.style.scale = sh ? String(1 + sh / hh) : ''; }
    if (!parOn) ctaList.forEach(b => { b.style.translate = ''; b.style.scale = ''; });
    ctas.forEach(([b, s, bh]) => {
      if (s.bottom < 0 || s.top > vh) return;
      const k = Math.max(-1, Math.min(1, (s.top + s.height / 2 - vh / 2) / vh));
      b.style.scale = String(1 + 150 / Math.max(300, bh || s.height));
      b.style.translate = `0 ${(-k * 60).toFixed(1)}px`;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; stickyAt = -1e9; } onScroll(); }, { passive: true });

  function flush() { document.querySelectorAll('[data-vk-pre]').forEach(show); html.classList.add('vk-ready'); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
  addEventListener('beforeprint', flush);
  addEventListener('pageshow', e => { if (e.persisted) flush(); });
  let to;
  const mine = n => { for (; n && n !== document.body; n = n.parentElement) if (n.__vkBusy || n.id === 'vk-top') return true; return false; };
  const mo = new MutationObserver(recs => {
    if (recs.every(r => mine(r.target) || r.target === document.body && [...r.addedNodes].every(n => n === bar || n === topBtn))) return; clearTimeout(to); to = setTimeout(() => { scan(); onScroll(); }, 60); });
  const boot = () => { mo.observe(document.body, { childList: true, subtree: true }); scan(); onScroll(); };
  if (window.__vkOff) {} else if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);

  // interni prelaz: loading screen se ne prikazuje
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || e.defaultPrevented) return; const h = a.getAttribute('href'); if (/^[\w-]+\.html(#.*)?$/.test(h)) { try { sessionStorage.setItem('vk-nav', '1'); } catch (er) {} } }, true);

  // mobilni meni: zaključan skrol, Esc zatvara, aktivna stranica označena
  const page = (location.pathname.split('/').pop() || 'index.html');
  const menuSel = 'header nav[data-vk-menu]';
  const syncMenu = () => { try { syncMenuInner(); } catch (e) { console.error('[vk] meni:', e); } };
  const syncMenuInner = () => {
    const nav = document.querySelector(menuSel), open = !!nav && nav.isConnected && !!nav.closest('header') && nav.getClientRects().length > 0;
    if (html.classList.contains('vk-menu') !== open) html.classList.toggle('vk-menu', open);
    if (nav) nav.querySelectorAll('a[href]').forEach(a => { if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page'); });
  };
  // posmatra ceo body: header se može zameniti novim čvorom pri iscrtavanju
  const menuMo = new MutationObserver(syncMenu);
  const watch = () => { if (!document.body) return setTimeout(watch, 50); menuMo.observe(document.body, { childList: true, subtree: true }); syncMenu(); };
  watch();
  addEventListener('keydown', e => { if (e.key !== 'Escape' || !document.querySelector(menuSel)) return; const b = document.querySelector('header button[aria-expanded]'); if (b) { b.click(); b.focus(); } });
  // dodirni uređaji: :hover pravila važe samo za miš (da se efekti ne "zaglave")
  if (matchMedia('(hover: none)').matches) {
    const doneSh = new WeakMap();
    const unhover = () => { for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch (e) { continue; } if (doneSh.get(sh) === rs.length) continue; doneSh.set(sh, rs.length); for (let i = rs.length - 1; i >= 0; i--) { const r = rs[i]; if (r.selectorText && r.selectorText.includes(':hover')) { const t = r.cssText; sh.deleteRule(i); try { sh.insertRule('@media (hover: hover){' + t + '}', i); } catch (e) {} } } } };
    addEventListener('touchstart', unhover, { capture: true, passive: true });
    addEventListener('load', unhover);
  }

  // donja traka: sakrij dok je korisnik u formi za upit (vidljiva forma ili fokus u polju)
  let formTick = false;
  const formCheck = () => { if (formTick || lockY !== null) return; formTick = true; requestAnimationFrame(() => { formTick = false;
    const ae = document.activeElement, typing = ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName) && !ae.closest('header');
    const inForm = [...document.querySelectorAll('#upit, form:has(textarea)')].some(f => { const r = f.getBoundingClientRect(); return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4; });
    html.classList.toggle('vk-form', !!(typing || inForm)); }); };
  addEventListener('scroll', formCheck, { passive: true });
  addEventListener('focusin', formCheck); addEventListener('focusout', () => setTimeout(formCheck, 50));
  addEventListener('load', formCheck);

  // zaključavanje skrola bez skoka: body fixed + pamćenje pozicije (meni, kalendar, lightbox, modal)
  const wantLock = () => html.classList.contains('vk-menu') || html.classList.contains('vk-dp') || !!document.querySelector('body [style*="position: fixed; inset: 0px"]:not(#vk-loader)');
  let clickY = 0, clickT = 0;
  const markY = () => { if (lockY === null) { clickY = window.scrollY; clickT = performance.now(); } };
  addEventListener('pointerdown', markY, true); addEventListener('click', markY, true); addEventListener('keydown', markY, true);
  const applyLock = () => { try { applyLockInner(); } catch (e) { console.error('[vk] zaključavanje:', e); } };
  const applyLockInner = () => {
    const b = document.body; if (!b) return;
    const want = wantLock();
    if (want && lockY === null) {
      lockY = performance.now() - clickT < 1500 ? clickY : window.scrollY;
      b.style.position = 'fixed'; b.style.top = -lockY + 'px'; b.style.left = '0'; b.style.right = '0'; b.style.width = '100%';
    } else if (!want && lockY !== null) {
      const y = lockY; lockY = null;
      b.style.position = ''; b.style.top = ''; b.style.left = ''; b.style.right = ''; b.style.width = '';
      const sb = html.style.scrollBehavior; html.style.scrollBehavior = 'auto';
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
      html.style.scrollBehavior = sb;
    }
  };
  window.__vkLockY = () => lockY;
  const lockMo = new MutationObserver(applyLock);
  const lockWatch = () => { if (!document.body) return setTimeout(lockWatch, 50); lockMo.observe(document.body, { childList: true, subtree: true }); lockMo.observe(html, { attributes: true, attributeFilter: ['class'] }); applyLock(); };
  lockWatch();
})();
