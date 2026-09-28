/*
 * dc-lite.js — a tiny template runtime for this portfolio (no build step, no dependencies).
 *
 * Each page keeps its markup in <template id="dc-root">. Inside it:
 *   {{path.to.value}}          text / attribute holes, filled from renderVals()
 *   onClick="{{handler}}"      event handlers (also onMouseEnter / onMouseLeave)
 *   <sc-for list="{{items}}" as="item">   repeats its children ($index is available)
 *   <sc-if value="{{flag}}">   shows its children only when flag is truthy
 *
 * A page script defines `class Component extends DCLogic { renderVals() { ... } }`
 * and calls mountDC(Component). setState() merges state and re-renders in place,
 * so CSS / SVG animations keep running between updates.
 */
(function () {
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var EVENTS = { onclick: 'click', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave', oninput: 'input', onchange: 'change' };

  function lookup(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split('.');
    var v = scope[parts[0]];
    for (var i = 1; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (m, p) { var v = lookup(scope, p); return v == null ? '' : String(v); });
  }
  function wholeHole(str) {
    var m = str.match(/^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/);
    return m ? m[1] : null;
  }
  function childScope(parent, as, item, index) {
    var s = Object.create(parent);
    s[as] = item;
    s.$index = index;
    return s;
  }

  // Build DOM for one template node. Returns an array of live nodes; pushes update fns into block.
  function build(src, block) {
    if (src.nodeType === 3) {
      if (!HOLE.test(src.data)) { HOLE.lastIndex = 0; return [src.cloneNode(false)]; }
      HOLE.lastIndex = 0;
      var t = document.createTextNode('');
      var tpl = src.data;
      block.push(function (scope) { var v = interp(tpl, scope); if (t.data !== v) t.data = v; });
      return [t];
    }
    if (src.nodeType !== 1) return [src.cloneNode(false)];

    var tag = src.localName;
    if (tag === 'sc-for' || tag === 'sc-if') return buildBlock(src, block, tag);

    var el = src.cloneNode(false);
    Array.prototype.slice.call(src.attributes).forEach(function (attr) {
      var name = attr.name, val = attr.value;
      if (name.indexOf('hint-') === 0) { el.removeAttribute(name); return; }
      if (val.indexOf('{{') === -1) return;
      var lower = name.toLowerCase();
      if (EVENTS[lower]) {
        el.removeAttribute(name);
        var path = wholeHole(val), current = null;
        el.addEventListener(EVENTS[lower], function (e) { if (typeof current === 'function') current(e); });
        block.push(function (scope) { current = lookup(scope, path); });
        return;
      }
      el.removeAttribute(name);
      var last = null;
      block.push(function (scope) {
        var v = interp(val, scope);
        if (v !== last) { el.setAttribute(name, v); last = v; }
      });
    });
    Array.prototype.forEach.call(src.childNodes, function (c) {
      build(c, block).forEach(function (n) { el.appendChild(n); });
    });
    return [el];
  }

  function buildBlock(src, block, tag) {
    var start = document.createComment(tag), end = document.createComment('/' + tag);
    var isFor = tag === 'sc-for';
    var path = wholeHole(src.getAttribute(isFor ? 'list' : 'value') || '') || '';
    var as = src.getAttribute('as') || 'item';
    var entries = [];   // for sc-for: [{nodes, fns}]
    var shown = null;   // for sc-if
    var ifEntry = null;

    function renderChildren(scope) {
      var fns = [], nodes = [];
      Array.prototype.forEach.call(src.childNodes, function (c) { nodes = nodes.concat(build(c, fns)); });
      var parent = end.parentNode;
      nodes.forEach(function (n) { parent.insertBefore(n, end); });
      fns.forEach(function (f) { f(scope); });
      return { nodes: nodes, fns: fns };
    }
    function remove(entry) { entry.nodes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }

    block.push(function (scope) {
      if (isFor) {
        var list = lookup(scope, path) || [];
        if (list.length !== entries.length) {
          entries.forEach(remove);
          entries = list.map(function (item, i) { return renderChildren(childScope(scope, as, item, i)); });
        } else {
          entries.forEach(function (e, i) { var s = childScope(scope, as, list[i], i); e.fns.forEach(function (f) { f(s); }); });
        }
      } else {
        var cond = !!lookup(scope, path);
        if (cond !== shown) {
          if (ifEntry) { remove(ifEntry); ifEntry = null; }
          if (cond) ifEntry = renderChildren(scope);
          shown = cond;
        } else if (ifEntry) {
          ifEntry.fns.forEach(function (f) { f(scope); });
        }
      }
    });
    return [start, end];
  }

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    if (typeof patch === 'function') patch = patch(this.state, this.props);
    this.state = Object.assign({}, this.state, patch);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__schedule) this.__schedule(); };

  function mountDC(Component, templateId, rootId) {
    var tpl = document.getElementById(templateId || 'dc-root');
    var root = document.getElementById(rootId || 'app');
    var comp = new Component({});
    var fns = [];
    var scheduled = false;
    Array.prototype.forEach.call(tpl.content.childNodes, function (c) {
      build(c, fns).forEach(function (n) { root.appendChild(n); });
    });
    function run() {
      scheduled = false;
      var vals = comp.renderVals ? comp.renderVals() : {};
      fns.forEach(function (f) { f(vals); });
    }
    comp.__schedule = function () { if (!scheduled) { scheduled = true; requestAnimationFrame(run); } };
    run();
    if (comp.componentDidMount) comp.componentDidMount();
    window.addEventListener('pagehide', function () { if (comp.componentWillUnmount) comp.componentWillUnmount(); });
    return comp;
  }

  window.DCLogic = DCLogic;
  window.mountDC = mountDC;
})();
