/* Photos — Pratik Jade — page logic. Markup lives in <template id="dc-root"> in photos.html */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { sel: null };
    // Add your photos to assets/photos/ and set src, e.g. src: 'assets/photos/graduation.jpg'
    this.photos = [
      { id: 'p1', caption: '[the desk where it ships]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[Write the story behind this photo — what was happening, why it matters to you.]' },
      { id: 'p2', caption: 'graduation day', title: 'B.TECH, DONE', meta: '2024 · GHRCEM, PUNE', story: '[Four years of AI and data science, one photo. Write what this day felt like.]' },
      { id: 'p3', caption: '[match day]', title: '[STORY TITLE]', meta: '[DATE · STADIUM]', story: '[A cricket memory — the match, the jersey, who you were with.]' },
      { id: 'p4', caption: '[family]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[The people behind the work.]' },
      { id: 'p5', caption: '[Pune, my city]', title: '[STORY TITLE]', meta: '[DATE · PUNE]', story: '[A favourite spot in Pune and why.]' },
      { id: 'p6', caption: '[first thing I shipped]', title: '[STORY TITLE]', meta: '[DATE]', story: '[The first project you were proud of.]' },
      { id: 'p7', caption: '[on the road]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[A trip that stuck with you.]' },
      { id: 'p8', caption: '[your pick]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[Anything that says who you are.]' },
      { id: 'p9', caption: '[late-night build]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[A night you stayed up to get something working.]' },
      { id: 'p10', caption: '[college crew]', title: '[STORY TITLE]', meta: '[DATE · GHRCEM]', story: '[The friends who got you through B.Tech.]' },
      { id: 'p11', caption: '[jersey collection]', title: '[STORY TITLE]', meta: '[DATE]', story: '[The jersey that means the most and why.]' },
      { id: 'p12', caption: '[a festival]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[A celebration you love.]' },
      { id: 'p13', caption: '[the view]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[A place that clears your head.]' },
      { id: 'p14', caption: '[first paycheck day]', title: '[STORY TITLE]', meta: '[DATE]', story: '[Starting out as an engineer.]' },
      { id: 'p15', caption: '[home]', title: '[STORY TITLE]', meta: '[DATE · PUNE]', story: '[Where you recharge.]' },
      { id: 'p16', caption: '[what is next]', title: '[STORY TITLE]', meta: '[DATE]', story: '[Something you are looking forward to.]' },
      { id: 'p17', caption: '[a concert / gig]', title: '[STORY TITLE]', meta: '[DATE · PLACE]', story: '[A song or show that stuck with you.]' },
      { id: 'p18', caption: '[my corner]', title: '[STORY TITLE]', meta: '[DATE · PUNE]', story: '[Where the headphones go on and the work begins.]' }
    ];
  }
  renderVals() {
    const self = this;
    const tilts = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5, -2];
    let photoItem = null;
    const photos = this.photos.map((ph, i) => {
      const isSel = self.state.sel === ph.id;
      const bg = ph.src ? 'url(' + ph.src + ')' : 'repeating-linear-gradient(45deg, rgba(31,35,40,0.08) 0 6px, transparent 6px 12px)';
      const label = ph.src ? '' : '[PHOTO ' + (i + 1) + ']';
      if (isSel) photoItem = Object.assign({ n: i + 1, bg: bg, label: label }, ph);
      return { n: i + 1, bg: bg, label: label, caption: ph.caption, tilt: tilts[i % tilts.length], aria: 'Open the story behind photo ' + (i + 1),
        cls: 'pin-photo' + (isSel ? ' off' : ''), pick: () => self.setState({ sel: isSel ? null : ph.id }) };
    });
    const len = this.photos.length;
    const pIdx = photoItem ? photoItem.n - 1 : 0;
    const film = [];
    for (let i = 0; i < 40; i++) film.push(i);
    return {
      photos: photos, film: film,
      photoSel: !!photoItem, noSel: !photoItem,
      ps: photoItem || { n: '', meta: '', title: '', story: '', bg: 'none', label: '' },
      nextPhoto: () => self.setState({ sel: self.photos[(pIdx + 1) % len].id }),
      prevPhoto: () => self.setState({ sel: self.photos[(pIdx - 1 + len) % len].id }),
      putBack: () => self.setState({ sel: null }),
      count: len + ' FRAMES',
      openLabel: photoItem ? 'FRAME ' + photoItem.n : '—'
    };
  }
}

function initPhoneLog() {
  const tl = document.querySelector('.m-tl');
  if (!tl) return;
  document.documentElement.classList.add('js-log');
  const items = Array.prototype.slice.call(tl.querySelectorAll('.m-st'));
  const yr = tl.querySelector('.m-tl-yr');
  const rail = tl.querySelector('.m-tl-rail');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    items.forEach((s) => io.observe(s));
  } else items.forEach((s) => s.classList.add('in'));
  let raf = 0;
  const upd = () => {
    raf = 0;
    const r = rail.getBoundingClientRect();
    const eye = window.innerHeight * 0.55;
    const p = Math.max(0, Math.min(1, (eye - r.top) / r.height));
    tl.style.setProperty('--p', p.toFixed(4));
    const y = r.top + p * r.height;
    let cur = '2002';
    items.forEach((s) => { if (s.getBoundingClientRect().top + 14 <= y) cur = s.getAttribute('data-yr') || cur; });
    if (p >= 0.995) cur = 'NOW'; else cur = "'" + cur.slice(2);
    if (yr && yr.textContent !== cur) yr.textContent = cur;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(upd); };
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  upd();
}

// ---- phone layout: a separate template (#dc-root-m) with a few extra helpers ----
class MobileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.state, { menu: false });
  }
  renderVals() {
    const v = super.renderVals();
    const self = this;
    const open = this.state.menu;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    v.menuClass = 'm-drawer' + (open ? ' open' : '');
    v.burgerClass = 'm-burger' + (open ? ' x' : '');
    v.toggleMenu = () => self.setState({ menu: !self.state.menu });
    v.closeMenu = () => self.setState({ menu: false });
    if (v.clock === undefined) {
      try {
        v.clock = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      } catch (e) { v.clock = ''; }
      v.mood = 'drafted in Pune, India';
    }
    if (this.projects) {
      v.mProjects = this.projects.map((p, i) => Object.assign({}, p, {
        isCK: p.fig === 'ck', isGauge: p.fig === 'gauge', isWeb: p.fig === 'web', isBlank: p.fig === 'blank',
        of: (i + 1) + ' / ' + this.projects.length
      }));
    }
    return v;
  }
}
(function () {
  const phone = window.matchMedia('(max-width: 899px)');
  const mobile = phone.matches;
  document.documentElement.classList.toggle('is-phone', mobile);
  mountDC(mobile ? MobileComponent : Component, mobile ? 'dc-root-m' : 'dc-root');
  if (mobile && typeof initPhoneLog === 'function') setTimeout(initPhoneLog, 0);
  const flip = () => { if (phone.matches !== mobile) location.reload(); };
  if (phone.addEventListener) phone.addEventListener('change', flip); else phone.addListener(flip);
})();
