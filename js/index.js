/* Pratik Jade — AI/ML Engineer — page logic. Markup lives in <template id="dc-root"> in index.html */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.words = ['agentic AI pipelines.', 'location intelligence.', 'forecasting models.', 'geospatial systems.', 'things that ship.'];
    this.state = { wi: 0, ci: 0, del: false, pause: 0, clock: '--:--:--', mood: 'heads-down building', count: null, launched: false, idx: 0, hover: false, elapsed: 0, leaving: false, entering: false };
    this.projects = [
      { sheet: 'P-01', kind: 'FEATURED', tag: 'OPEN SOURCE · IN DEVELOPMENT', title: 'CONVERSAKIT', fig: 'ck',
        desc: 'An open-source framework that gives any SaaS product a conversational, agentic layer. Users say what they want; ConversaKit turns that intent into real actions inside the product.',
        points: [{ k: 'A', t: 'Intent-to-action pipeline' }, { k: 'B', t: 'ReAct reasoning loop' }, { k: 'C', t: 'Multi-tenant session isolation' }, { k: 'D', t: 'LangGraph + MCP stack' }],
        link: '[GITHUB LINK] →', type: 'FRAMEWORK', stack: 'PYTHON · LANGGRAPH · MCP', status: 'IN DEVELOPMENT' },
      { sheet: 'P-02', kind: 'RESEARCH', tag: 'PUBLISHED · SPRINGER', title: 'AI CONTENT DETECTION', fig: 'gauge',
        desc: 'A model that separates AI-generated text from human writing, published as a peer-reviewed paper by Springer.',
        points: [{ k: 'A', t: '80.7% classification accuracy' }, { k: 'B', t: 'Peer-reviewed, Springer' }, { k: 'C', t: '[DATASET / METHOD]' }],
        link: '[PAPER TITLE + DOI LINK] →', type: 'RESEARCH PAPER', stack: '[STACK]', status: 'PUBLISHED' },
      { sheet: 'P-03', kind: 'SIDE BUILD', tag: 'EARLIER PORTFOLIO', title: 'MULTIVERSE PORTFOLIO', fig: 'web',
        desc: 'An earlier personal site in a comic-book, multiverse style — a playground for motion and front-end craft.',
        points: [{ k: 'A', t: 'Comic-panel layouts' }, { k: 'B', t: 'Motion-heavy interactions' }, { k: 'C', t: '[WHAT YOU LEARNED]' }],
        link: '[LIVE LINK] →', type: 'WEBSITE', stack: '[STACK]', status: 'SHIPPED' },
      { sheet: 'P-04', kind: 'RESERVED', tag: 'ON THE DRAFTING TABLE', title: 'NEXT BUILD', fig: 'blank',
        desc: 'This sheet is reserved for the next system coming off the drafting table.',
        points: [{ k: 'A', t: '[PROBLEM]' }, { k: 'B', t: '[APPROACH]' }, { k: 'C', t: '[RESULT]' }],
        link: '[ADD PROJECT] →', type: '[TYPE]', stack: '[STACK]', status: 'RESERVED' }
    ];
    this.go = this.go.bind(this);
    this.launch = this.launch.bind(this);
  }
  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 85);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.cd);
    (this.to || []).forEach((t) => clearTimeout(t));
  }
  go(n) {
    if (this.state.leaving) return;
    const len = this.projects.length;
    const target = ((n % len) + len) % len;
    this.setState({ leaving: true, elapsed: 0 });
    this.to = this.to || [];
    this.to.push(setTimeout(() => this.setState({ idx: target, leaving: false, entering: true }), 500));
    this.to.push(setTimeout(() => this.setState({ entering: false }), 1150));
  }
  launch() {
    if (this.state.count !== null || this.state.launched) return;
    this.setState({ count: 3 });
    this.to = [];
    this.cd = setInterval(() => {
      const n = this.state.count - 1;
      if (n <= 0) {
        clearInterval(this.cd);
        this.setState({ count: 0, launched: true });
        this.to.push(setTimeout(() => {
          try { const el = document.getElementById('top'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
        }, 1300));
        this.to.push(setTimeout(() => this.setState({ count: null, launched: false }), 4200));
      } else {
        this.setState({ count: n });
      }
    }, 800);
  }
  tick() {
    const s = this.state;
    let wi = s.wi, ci = s.ci, del = s.del, pause = s.pause;
    const word = this.words[wi];
    if (pause > 0) { pause -= 1; }
    else if (!del) { ci += 1; if (ci >= word.length) { del = true; pause = 22; } }
    else { ci -= 1; if (ci <= 0) { del = false; wi = (wi + 1) % this.words.length; pause = 5; } }
    let clock = s.clock, mood = s.mood;
    try {
      clock = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false });
      const h = parseInt(clock.slice(0, 2), 10);
      if (h < 7) mood = 'probably asleep (or debugging)';
      else if (h < 10) mood = 'chai + first commits';
      else if (h < 19) mood = 'heads-down building';
      else mood = 'side-project hours';
    } catch (e) {}
    let elapsed = s.elapsed;
    if (!s.hover && !s.leaving && !s.entering) {
      elapsed += 85;
      if (elapsed >= 10000) { elapsed = 0; this.go(s.idx + 1); }
    }
    this.setState({ wi: wi, ci: ci, del: del, pause: pause, clock: clock, mood: mood, elapsed: elapsed });
  }
  renderVals() {
    const showGrid = this.props.showGrid ?? true;
    const word = this.words[this.state.wi] || '';
    return {
      paper: this.props.paper ?? '#F6F3EC',
      red: this.props.red ?? '#B23A1C',
      gridClass: showGrid ? 'bp-grid' : 'bp-plain',
      typed: word.slice(0, this.state.ci),
      clock: this.state.clock,
      mood: this.state.mood,
      launch: this.launch,
      cur: this.projects[this.state.idx],
      back1: this.projects[(this.state.idx + 1) % this.projects.length],
      back2: this.projects[(this.state.idx + 2) % this.projects.length],
      isCK: this.projects[this.state.idx].fig === 'ck',
      isGauge: this.projects[this.state.idx].fig === 'gauge',
      isWeb: this.projects[this.state.idx].fig === 'web',
      isBlank: this.projects[this.state.idx].fig === 'blank',
      sheetOf: (this.state.idx + 1) + ' / ' + this.projects.length,
      frontClass: 'card-front' + (this.state.leaving ? ' out' : (this.state.entering ? ' in' : '')),
      stackClass: 'stack' + (this.state.entering ? ' shift' : '') + (this.state.hover ? ' hold' : ''),
      holdOn: () => this.setState({ hover: true }),
      holdOff: () => this.setState({ hover: false }),
      next: () => this.go(this.state.idx + 1),
      prev: () => this.go(this.state.idx - 1),
      progress: Math.min(100, (this.state.elapsed / 10000) * 100).toFixed(1),
      secsLeft: this.state.hover ? 'PAUSED' : Math.max(0, Math.ceil((10000 - this.state.elapsed) / 1000)) + 's',
      holdLabel: this.state.hover ? 'HOLDING — CURSOR ON SHEET' : 'AUTO-ADVANCE',
      index: this.projects.map((pr, i) => ({
        sheet: pr.sheet, title: pr.title, mark: i === this.state.idx ? '●' : '○',
        pick: () => { if (i !== this.state.idx) this.go(i); },
        style: 'display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; padding: 0 12px; border: none; border-bottom: 1px solid rgba(31,35,40,0.35); cursor: pointer; color: #1F2328; background: ' + (i === this.state.idx ? 'rgba(178,58,28,0.08)' : 'transparent') + '; transition: background .3s ease'
      })),
      launched: this.state.launched,
      rocketClass: this.state.launched ? 'rocket launch' : (this.state.count !== null ? 'rocket shake' : 'rocket idle'),
      flameClass: (this.state.launched || this.state.count !== null) ? 'flame-g big' : 'flame-g small',
      countLabel: '00:0' + (this.state.count === null ? 3 : this.state.count),
      status: this.state.launched ? 'LIFT-OFF — RETURNING TO 01' : (this.state.count !== null ? 'IGNITION SEQUENCE' : 'STANDING BY'),
      launchLabel: this.state.launched ? 'LIFT-OFF' : (this.state.count !== null ? 'IGNITION…' : 'LAUNCH — BACK TO SHEET 01'),
      zones: ['1','2','3','4','5','6','7','8','9','10','11','12']
    };
  }
}

// ---- contact links ----------------------------------------------------------
// Fill these in. The email is never shown on the page; the Compose button opens the visitor's mail app.
const CONTACT = {
  email: '',          // e.g. 'you@example.com'
  github: '',         // e.g. 'https://github.com/your-handle'
  linkedin: '',       // e.g. 'https://www.linkedin.com/in/your-handle'
  resume: 'assets/resume.pdf'
};
function wireContacts() {
  document.querySelectorAll('[data-contact]').forEach((a) => {
    const key = a.getAttribute('data-contact');
    const v = CONTACT[key];
    if (!v) return;
    if (key === 'email') {
      a.setAttribute('href', 'mailto:' + v + '?subject=' + encodeURIComponent('Hello from your portfolio'));
    } else {
      a.setAttribute('href', v);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
  });
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
wireContacts();
