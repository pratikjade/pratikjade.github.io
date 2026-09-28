/* Blog — Pratik Jade — page logic. Markup lives in <template id="dc-root"> in blog.html */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { filter: 'ALL' };
    this.posts = [
      { no: 'N-01', tag: 'AI', title: 'An agentic layer for any SaaS', excerpt: 'Designing ConversaKit: turning what a user says into real actions inside a product. [DRAFT]', meta: '[DATE] · [X] MIN' },
      { no: 'N-02', tag: 'AI', title: 'Wiring agents to real tools', excerpt: 'LangGraph for the loop, MCP for the plugs — and where it gets tricky. [DRAFT]', meta: '[DATE] · [X] MIN' },
      { no: 'N-03', tag: 'GEO', title: 'Random splits lie on maps', excerpt: 'Why spatial cross-validation matters when your data lives on a map. [DRAFT]', meta: '[DATE] · [X] MIN' },
      { no: 'N-04', tag: 'ML', title: 'What 80.7% taught me', excerpt: 'Notes from publishing a model that detects AI-written text. [DRAFT]', meta: '[DATE] · [X] MIN' },
      { no: 'N-05', tag: 'ML', title: 'Boosting on geospatial features', excerpt: 'Gradient-boosted models, place-based features and honest evaluation. [DRAFT]', meta: '[DATE] · [X] MIN' },
      { no: 'N-06', tag: 'NOTES', title: 'Drawing a portfolio like a blueprint', excerpt: 'How this site became a set of engineering drawings. [DRAFT]', meta: '[DATE] · [X] MIN' }
    ];
  }
  renderVals() {
    const self = this;
    const f = this.state.filter;
    const list = this.posts.filter((p) => f === 'ALL' || p.tag === f);
    const chips = ['ALL', 'AI', 'ML', 'GEO', 'NOTES'].map((c) => ({
      label: c, pressed: c === f ? 'true' : 'false',
      style: c === f ? 'background: #1F2328; color: #FFFFFF' : 'background: transparent; color: #1F2328',
      pick: () => self.setState({ filter: c })
    }));
    return {
      chips: chips,
      showFeatured: list.length > 0,
      feat: list[0] || { tag: '', meta: '', title: '', excerpt: '' },
      rows: list.slice(1)
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
