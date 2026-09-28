/* Pegboard — Pratik Jade — page logic. Markup lives in <template id="dc-root"> in pegboard.html */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { sel: null, shake: false, watered: false };
    this.papers = ['#F7F4EC', '#FFFFFF', '#EFE6CF'];
    this.sections = [
      { name: 'DESIGN', items: [
        { id: 'linear', name: 'Linear', domain: 'linear.app', url: 'https://linear.app', why: 'Product craft to study: fast, keyboard-first and calm.' },
        { id: 'stripe', name: 'Stripe Docs', domain: 'docs.stripe.com', url: 'https://docs.stripe.com', why: 'The bar for developer documentation.' },
        { id: 'refui', name: 'Refactoring UI', domain: 'refactoringui.com', url: 'https://www.refactoringui.com', why: 'Practical design rules written for developers.' },
        { id: 'fiu', name: 'Fonts In Use', domain: 'fontsinuse.com', url: 'https://fontsinuse.com', why: 'Real-world typography to learn from.' }
      ]},
      { name: 'AI & ML', items: [
        { id: 'hf', name: 'Hugging Face', domain: 'huggingface.co', url: 'https://huggingface.co', why: 'Models, datasets and demos in one place.' },
        { id: 'arxiv', name: 'arXiv', domain: 'arxiv.org', url: 'https://arxiv.org', why: 'Where new research lands first.' },
        { id: 'distill', name: 'Distill', domain: 'distill.pub', url: 'https://distill.pub', why: 'Machine learning explained with beautiful, interactive figures.' },
        { id: '3b1b', name: '3Blue1Brown', domain: '3blue1brown.com', url: 'https://www.3blue1brown.com', why: 'The clearest visual intuition for neural networks.' }
      ]},
      { name: 'MAPS & DATA', items: [
        { id: 'kepler', name: 'kepler.gl', domain: 'kepler.gl', url: 'https://kepler.gl', why: 'Big geospatial data, visualised right in the browser.' },
        { id: 'observable', name: 'Observable', domain: 'observablehq.com', url: 'https://observablehq.com', why: 'Notebooks built for data visualisation.' },
        { id: 'osm', name: 'OpenStreetMap', domain: 'openstreetmap.org', url: 'https://www.openstreetmap.org', why: 'The open map of the world, built by its people.' }
      ]},
      { name: 'TOOLS', items: [
        { id: 'excalidraw', name: 'Excalidraw', domain: 'excalidraw.com', url: 'https://excalidraw.com', why: 'Hand-drawn diagrams in seconds.' },
        { id: 'raycast', name: 'Raycast', domain: 'raycast.com', url: 'https://www.raycast.com', why: 'A launcher that replaces a dozen small utilities.' },
        { id: 'regex101', name: 'regex101', domain: 'regex101.com', url: 'https://regex101.com', why: 'Build, test and understand regular expressions.' }
      ]}
    ];
  }
  componentWillUnmount() { clearTimeout(this.t); clearTimeout(this.tw); }
  renderVals() {
    const self = this;
    let k = 0;
    let selItem = null;
    const sections = this.sections.map((sec) => ({
      name: sec.name,
      items: sec.items.map((it) => {
        const v = k % 3; k += 1;
        const isSel = self.state.sel === it.id;
        if (isSel) selItem = Object.assign({ section: sec.name, mono: it.name.charAt(0).toUpperCase() }, it);
        return {
          name: it.name, domain: it.domain, mono: it.name.charAt(0).toUpperCase(), aria: 'Take ' + it.name + ' off the board',
          paper: self.papers[v], cls: 'peg-item v' + v + (isSel ? ' off' : ''),
          pick: () => self.setState({ sel: isSel ? null : it.id })
        };
      })
    }));
    const music = self.state.sel === 'music';
    return {
      red: this.props.red ?? '#B23A1C',
      sections: sections,
      boardClass: 'board' + (this.state.shake ? ' shake' : ''),
      hasSel: !!selItem, noSel: !selItem && !music, musicSel: music,
      sel: selItem || { section: '', name: '', domain: '', why: '', url: '#', mono: '' },
      count: k + ' BOOKMARKS',
      inHand: music ? 'HEADPHONES' : (selItem ? selItem.name.toUpperCase() : '—'),
      putBack: () => self.setState({ sel: null }),
      phonesCls: 'phones' + (music ? ' off' : ''),
      pickPhones: () => self.setState({ sel: music ? null : 'music' }),
      plantCls: 'plant' + (self.state.watered ? ' watered' : ''),
      waterPlant: () => { if (self.state.watered) return; self.setState({ watered: true }); self.tw = setTimeout(() => self.setState({ watered: false }), 2400); },
      shakeBoard: () => { if (self.state.shake) return; self.setState({ shake: true }); self.t = setTimeout(() => self.setState({ shake: false }), 1700); }
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
