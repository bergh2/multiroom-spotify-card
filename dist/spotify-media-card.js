/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, it = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, rt = Symbol(), at = /* @__PURE__ */ new WeakMap();
let At = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== rt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (it && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = at.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && at.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (e) => new At(typeof e == "string" ? e : e + "", void 0, rt), St = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new At(s, e, rt);
}, Dt = (e, t) => {
  if (it) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = W.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, lt = it ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Rt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: qt, defineProperty: Bt, getOwnPropertyDescriptor: Vt, getOwnPropertyNames: Ft, getOwnPropertySymbols: Gt, getPrototypeOf: Wt } = Object, w = globalThis, ct = w.trustedTypes, Kt = ct ? ct.emptyScript : "", J = w.reactiveElementPolyfillSupport, N = (e, t) => e, K = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Kt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, nt = (e, t) => !qt(e, t), pt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = pt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Bt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = Vt(this.prototype, t) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: r, set(o) {
      const a = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const s = this.properties, i = [...Ft(s), ...Gt(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) s.unshift(lt(r));
    } else t !== void 0 && s.push(lt(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((s) => s(this));
  }
  addController(t) {
    var s;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((s = t.hostConnected) == null || s.call(t));
  }
  removeController(t) {
    var s;
    (s = this._$EO) == null || s.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Dt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostConnected) == null ? void 0 : i.call(s);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostDisconnected) == null ? void 0 : i.call(s);
    });
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : K).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = i.getPropertyOptions(r), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : K;
      this._$Em = r;
      const l = c.fromAttribute(s, a.type);
      this[r] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? nt)(n, s) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? s ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: a } = o, c = this[n];
        a !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(s)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var s;
    (s = this._$EO) == null || s.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((s) => this._$ET(s, this[s]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[N("elementProperties")] = /* @__PURE__ */ new Map(), M[N("finalized")] = /* @__PURE__ */ new Map(), J == null || J({ ReactiveElement: M }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, dt = (e) => e, Y = H.trustedTypes, ht = Y ? Y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Et = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Ct = "?" + $, Yt = `<${Ct}>`, P = document, R = () => P.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", ot = Array.isArray, Zt = (e) => ot(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Q = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ut = /-->/g, ft = />/g, S = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _t = /'/g, mt = /"/g, Pt = /^(?:script|style|textarea|title)$/i, Mt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), h = Mt(1), g = Mt(2), k = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), yt = /* @__PURE__ */ new WeakMap(), E = P.createTreeWalker(P, 129);
function Tt(e, t) {
  if (!ot(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ht !== void 0 ? ht.createHTML(t) : t;
}
const Xt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
  for (let a = 0; a < s; a++) {
    const c = e[a];
    let l, p, d = -1, _ = 0;
    for (; _ < c.length && (o.lastIndex = _, p = o.exec(c), p !== null); ) _ = o.lastIndex, o === j ? p[1] === "!--" ? o = ut : p[1] !== void 0 ? o = ft : p[2] !== void 0 ? (Pt.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = S) : p[3] !== void 0 && (o = S) : o === S ? p[0] === ">" ? (o = r ?? j, d = -1) : p[1] === void 0 ? d = -2 : (d = o.lastIndex - p[2].length, l = p[1], o = p[3] === void 0 ? S : p[3] === '"' ? mt : _t) : o === mt || o === _t ? o = S : o === ut || o === ft ? o = j : (o = S, r = void 0);
    const x = o === S && e[a + 1].startsWith("/>") ? " " : "";
    n += o === j ? c + Yt : d >= 0 ? (i.push(l), c.slice(0, d) + Et + c.slice(d) + $ + x) : c + $ + (d === -2 ? a : x);
  }
  return [Tt(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class q {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, c = this.parts, [l, p] = Xt(t, s);
    if (this.el = q.createElement(l, i), E.currentNode = this.el.content, s === 2 || s === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = E.nextNode()) !== null && c.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(Et)) {
          const _ = p[o++], x = r.getAttribute(d).split($), V = /([.?@])?(.*)/.exec(_);
          c.push({ type: 1, index: n, name: V[2], strings: x, ctor: V[1] === "." ? Qt : V[1] === "?" ? te : V[1] === "@" ? ee : Z }), r.removeAttribute(d);
        } else d.startsWith($) && (c.push({ type: 6, index: n }), r.removeAttribute(d));
        if (Pt.test(r.tagName)) {
          const d = r.textContent.split($), _ = d.length - 1;
          if (_ > 0) {
            r.textContent = Y ? Y.emptyScript : "";
            for (let x = 0; x < _; x++) r.append(d[x], R()), E.nextNode(), c.push({ type: 2, index: ++n });
            r.append(d[_], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ct) c.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf($, d + 1)) !== -1; ) c.push({ type: 7, index: n }), d += $.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = P.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(e, t, s = e, i) {
  var o, a;
  if (t === k) return t;
  let r = i !== void 0 ? (o = s._$Co) == null ? void 0 : o[i] : s._$Cl;
  const n = D(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ?? (s._$Co = []))[i] = r : s._$Cl = r), r !== void 0 && (t = O(e, r._$AS(e, t.values), r, i)), t;
}
class Jt {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? P).importNode(s, !0);
    E.currentNode = r;
    let n = E.nextNode(), o = 0, a = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let l;
        c.type === 2 ? l = new B(n, n.nextSibling, this, t) : c.type === 1 ? l = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (l = new se(n, this, t)), this._$AV.push(l), c = i[++a];
      }
      o !== (c == null ? void 0 : c.index) && (n = E.nextNode(), o++);
    }
    return E.currentNode = P, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class B {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = O(this, t, s), D(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = q.createElement(Tt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(s);
    else {
      const o = new Jt(r, this), a = o.u(this.options);
      o.p(s), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = yt.get(t.strings);
    return s === void 0 && yt.set(t.strings, s = new q(t)), s;
  }
  k(t) {
    ot(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new B(this.O(R()), this.O(R()), this, this.options)) : i = s[r], i._$AI(n), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, s); t !== this._$AB; ) {
      const r = dt(t).nextSibling;
      dt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var s;
    this._$AM === void 0 && (this._$Cv = t, (s = this._$AP) == null || s.call(this, t));
  }
}
class Z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = O(this, t, s, 0), o = !D(t) || t !== this._$AH && t !== k, o && (this._$AH = t);
    else {
      const a = t;
      let c, l;
      for (t = n[0], c = 0; c < n.length - 1; c++) l = O(this, a[i + c], s, c), l === k && (l = this._$AH[c]), o || (o = !D(l) || l !== this._$AH[c]), l === u ? t = u : t !== u && (t += (l ?? "") + n[c + 1]), this._$AH[c] = l;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Qt extends Z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class te extends Z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ee extends Z {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = O(this, t, s, 0) ?? u) === k) return;
    const i = this._$AH, r = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== u && (i === u || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class se {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const tt = H.litHtmlPolyfillSupport;
tt == null || tt(q, B), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.3");
const ie = (e, t, s) => {
  const i = (s == null ? void 0 : s.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (s == null ? void 0 : s.renderBefore) ?? null;
    i._$litPart$ = r = new B(t.insertBefore(R(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
let U = class extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const t = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = t.firstChild), t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ie(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return k;
  }
};
var kt;
U._$litElement$ = !0, U.finalized = !0, (kt = C.litElementHydrateSupport) == null || kt.call(C, { LitElement: U });
const et = C.litElementPolyfillSupport;
et == null || et({ LitElement: U });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: nt }, ne = (e = re, t, s) => {
  const { kind: i, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), i === "accessor") {
    const { name: o } = s;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, c, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (i === "setter") {
    const { name: o } = s;
    return function(a) {
      const c = this[o];
      t.call(this, a), this.requestUpdate(o, c, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Ot(e) {
  return (t, s) => typeof s == "object" ? ne(e, t, s) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(e) {
  return Ot({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = { ATTRIBUTE: 1 }, Lt = (e) => (...t) => ({ _$litDirective$: e, values: t });
let jt = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, s, i) {
    this._$Ct = t, this._$AM = s, this._$Ci = i;
  }
  _$AS(t, s) {
    return this.update(t, s);
  }
  update(t, s) {
    return this.render(...s);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const m = Lt(class extends jt {
  constructor(e) {
    var t;
    if (super(e), e.type !== zt.ATTRIBUTE || e.name !== "class" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return " " + Object.keys(e).filter((t) => e[t]).join(" ") + " ";
  }
  update(e, [t]) {
    var i, r;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), e.strings !== void 0 && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((n) => n !== "")));
      for (const n in t) t[n] && !((i = this.nt) != null && i.has(n)) && this.st.add(n);
      return this.render(t);
    }
    const s = e.element.classList;
    for (const n of this.st) n in t || (s.remove(n), this.st.delete(n));
    for (const n in t) {
      const o = !!t[n];
      o === this.st.has(n) || (r = this.nt) != null && r.has(n) || (o ? (s.add(n), this.st.add(n)) : (s.remove(n), this.st.delete(n)));
    }
    return k;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = "important", oe = " !" + It, I = Lt(class extends jt {
  constructor(e) {
    var t;
    if (super(e), e.type !== zt.ATTRIBUTE || e.name !== "style" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return Object.keys(e).reduce((t, s) => {
      const i = e[s];
      return i == null ? t : t + `${s = s.includes("-") ? s : s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(e, [t]) {
    const { style: s } = e.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft) t[i] == null && (this.ft.delete(i), i.includes("-") ? s.removeProperty(i) : s[i] = null);
    for (const i in t) {
      const r = t[i];
      if (r != null) {
        this.ft.add(i);
        const n = typeof r == "string" && r.endsWith(oe);
        i.includes("-") || n ? s.setProperty(i, n ? r.slice(0, -11) : r, n ? It : "") : s[i] = r;
      }
    }
    return k;
  }
}), ae = St`
  :host {
    display: block;
    --page: #08080a;
    --card: rgba(24, 24, 27, 0.86);
    --chip: rgba(255, 255, 255, 0.06);
    --chip2: rgba(255, 255, 255, 0.12);
    --line: rgba(255, 255, 255, 0.1);
    --hairline: rgba(255, 255, 255, 0.06);
    --text: #f5f5f7;
    --text2: rgba(235, 235, 245, 0.52);
    --text2solid: rgba(235, 235, 245, 0.62);
    --text3: rgba(235, 235, 245, 0.34);
    --art: #232326;
    --stripe: rgba(255, 255, 255, 0.07);
    --track: rgba(255, 255, 255, 0.13);
    --bar: rgba(255, 255, 255, 0.05);
    --sheet: rgba(44, 44, 48, 0.92);
    --scrim: rgba(8, 8, 10, 0.55);
    --onText: #101013;
    --accent: oklch(0.62 0.16 285);
    --mono: ui-monospace, 'SF Mono', Menlo, monospace;
    font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  :host([theme='light']) {
    --page: #f2f2f5;
    --card: rgba(255, 255, 255, 0.86);
    --chip: rgba(10, 10, 14, 0.05);
    --chip2: rgba(10, 10, 14, 0.09);
    --line: rgba(10, 10, 14, 0.1);
    --hairline: rgba(255, 255, 255, 0.9);
    --text: #111114;
    --text2: rgba(30, 30, 36, 0.55);
    --text2solid: rgba(30, 30, 36, 0.6);
    --text3: rgba(30, 30, 36, 0.38);
    --art: #e6e6ea;
    --stripe: rgba(10, 10, 14, 0.08);
    --track: rgba(10, 10, 14, 0.11);
    --bar: rgba(10, 10, 14, 0.035);
    --sheet: rgba(250, 250, 252, 0.94);
    --scrim: rgba(240, 240, 244, 0.6);
    --onText: #ffffff;
  }

  ha-card {
    display: block;
    background: none;
    border: none;
    box-shadow: none;
    border-radius: 26px;
  }
  .card,
  .card *,
  .card *::before,
  .card *::after {
    box-sizing: border-box;
  }
  .card {
    position: relative;
    width: 100%;
    border-radius: 26px;
    padding: 16px 14px 14px;
    background: var(--card);
    border: 0.5px solid var(--line);
    box-shadow:
      0 30px 70px -20px rgba(0, 0, 0, 0.65),
      0 1px 0 0 var(--hairline) inset;
    backdrop-filter: blur(30px) saturate(160%);
    -webkit-backdrop-filter: blur(30px) saturate(160%);
    overflow: hidden;
    color: var(--text);
    transition:
      background 0.35s ease,
      border-color 0.35s ease;
  }
  button {
    font-family: inherit;
    color: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    text-align: left;
  }
  button:disabled {
    cursor: default;
  }
  button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .mono {
    font-family: var(--mono);
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .header-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .title {
    font-size: 15px;
    font-weight: 640;
    letter-spacing: -0.01em;
    color: var(--text);
  }
  .summary {
    font-size: 11.5px;
    color: var(--text2);
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 6px 8px;
    border-radius: 999px;
    border: 0.5px solid var(--line);
    background: var(--chip);
    color: var(--text);
    font-size: 12px;
    font-weight: 560;
    flex: 0 0 auto;
  }

  /* Artwork */
  .art {
    position: relative;
    overflow: hidden;
    background: var(--art);
    border: 0.5px solid var(--line);
  }
  .stripes {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(135deg, var(--stripe) 0 3px, transparent 3px 8px);
  }
  .art-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--mono);
    font-size: 7.5px;
    letter-spacing: 0.04em;
    color: var(--text3);
  }
  .art img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
  }
  .art img.loaded {
    opacity: 1;
  }
  .pulse .stripes {
    animation: pulse 1.4s ease-in-out infinite;
  }

  /* Playlists: tiles */
  .tiles {
    display: grid;
    grid-template-columns: repeat(var(--cols, 3), 1fr);
    gap: 9px;
    margin-bottom: 18px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .tile-art {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    box-shadow: 0 6px 14px -8px rgba(0, 0, 0, 0.7);
  }
  .ring {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    box-shadow: 0 0 0 2px var(--accent) inset;
    opacity: 0;
    transition: opacity 0.18s ease;
  }
  .tile.active .ring {
    opacity: 1;
  }
  .tile-name {
    font-size: 11px;
    font-weight: 560;
    line-height: 1.25;
    color: var(--text);
    display: block;
  }

  /* Playlists: list */
  .list {
    display: flex;
    flex-direction: column;
    margin: 0 -4px 14px;
  }
  .list-row {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 4px 4px;
    border-top: 0.5px solid var(--line);
    border-radius: 6px;
    min-height: 33px;
  }
  .list-row.first {
    border-top-color: transparent;
  }
  .list-row:hover {
    background: var(--chip);
  }
  .list-art {
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }
  .list-art .art-label {
    font-size: 5px;
  }
  .list-name {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 12.5px;
    font-weight: 540;
    letter-spacing: -0.01em;
    color: var(--text);
  }
  .list-row.active .list-name {
    color: var(--accent);
  }
  .list-play {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    color: var(--accent);
    opacity: 0;
  }
  .list-row.active .list-play {
    opacity: 1;
  }
  .pl-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 64px;
    margin-bottom: 14px;
    font-size: 12px;
    color: var(--text3);
    text-align: center;
  }

  /* Section header */
  .section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .label {
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text2);
  }
  .text-btn {
    font-size: 11.5px;
    font-weight: 560;
    color: var(--accent);
  }

  /* Presets */
  .presets {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
  }
  .preset {
    flex: 1 1 0;
    min-width: 0;
    padding: 7px 4px;
    border-radius: 10px;
    font-size: 11.5px;
    font-weight: 560;
    letter-spacing: -0.005em;
    text-align: center;
    border: 0.5px solid var(--line);
    background: var(--chip);
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition:
      background 0.18s ease,
      color 0.18s ease;
  }
  .preset.active {
    background: var(--accent);
    color: #fff;
    border-color: transparent;
  }

  /* Speakers */
  .speakers {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 16px;
  }
  .speaker-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 2px;
  }
  .speaker-row.unavailable {
    opacity: 0.45;
  }
  .speaker-row.standby .sp-vol {
    color: var(--text3);
  }
  .speaker-row.master {
    padding-bottom: 9px;
    margin-bottom: 4px;
    border-bottom: 0.5px solid var(--line);
  }
  .speaker-row.master .sp-name {
    font-weight: 620;
    color: var(--text);
  }
  .speaker-row.master .dot {
    background: var(--chip2);
    color: var(--text);
  }
  .speaker-row.master .track {
    height: 8px;
  }
  .speaker-row.master .fill {
    background: var(--text2solid);
  }
  .speaker-row.master.on .fill {
    background: var(--accent);
  }
  .speaker-row.orphan .sp-name {
    text-decoration: underline dotted var(--text3);
    text-underline-offset: 3px;
  }
  .speaker-row.orphan .sp-vol {
    font-size: 9px;
  }
  .dot {
    flex: 0 0 auto;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    border: 0.5px solid var(--line);
    background: var(--chip);
    color: var(--text2);
    transition:
      background 0.18s ease,
      color 0.18s ease;
  }
  .speaker-row.on .dot {
    background: var(--accent);
    color: #fff;
  }
  .sp-name {
    flex: 0 0 74px;
    min-width: 0;
    font-size: 12.5px;
    font-weight: 540;
    letter-spacing: -0.01em;
    color: var(--text2);
  }
  .speaker-row.on .sp-name {
    color: var(--text);
  }
  .track-hit {
    position: relative;
    flex: 1 1 auto;
    height: 26px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;
  }
  .speaker-row.unavailable .track-hit {
    cursor: default;
  }
  .track {
    position: relative;
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: var(--track);
    overflow: hidden;
  }
  .fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 999px;
    background: var(--text3);
    transition: width 0.12s linear;
  }
  .speaker-row.on .fill {
    background: var(--accent);
  }
  .sp-vol {
    flex: 0 0 26px;
    text-align: right;
    font-family: var(--mono);
    font-size: 10.5px;
    color: var(--text2);
  }

  /* Now playing */
  .now {
    border-radius: 18px;
    padding: 11px 12px 12px;
    background: var(--bar);
    border: 0.5px solid var(--line);
  }
  .now-row {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .now-art {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
  .now-art .art-label {
    font-size: 6px;
  }
  .now-meta {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .now-title-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .eq {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 1.5px;
    height: 9px;
    transition: opacity 0.3s ease;
  }
  .eq div {
    width: 2px;
    height: 100%;
    border-radius: 1px;
    background: var(--accent);
    animation: eq 0.9s ease-in-out infinite;
    transform-origin: bottom;
  }
  .eq div:nth-child(2) {
    animation-delay: 0.3s;
  }
  .eq div:nth-child(3) {
    animation-delay: 0.6s;
  }
  .now.paused .eq {
    opacity: 0.25;
  }
  .now.paused .eq div {
    animation-play-state: paused;
  }
  .now-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text);
  }
  .now-artist {
    font-size: 11.5px;
    color: var(--text2);
  }
  .transport {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .tbtn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    border-radius: 8px;
  }
  .tbtn:hover {
    background: var(--chip);
  }
  .play {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--text);
    color: var(--onText);
  }
  .play svg {
    display: block;
  }
  .progress-hit {
    margin-top: 10px;
    cursor: pointer;
    touch-action: none;
  }
  .progress-hit.disabled {
    cursor: default;
  }
  .progress {
    position: relative;
    height: 4px;
    border-radius: 999px;
    background: var(--track);
    overflow: hidden;
  }
  .progress-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--text2solid);
    border-radius: 999px;
  }
  .times {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text3);
  }

  /* Device picker sheet */
  .scrim {
    position: absolute;
    inset: 0;
    border-radius: 26px;
    background: var(--scrim);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
    z-index: 2;
  }
  .sheet {
    border-radius: 20px;
    overflow: hidden;
    background: var(--sheet);
    border: 0.5px solid var(--line);
    animation: sheetUp 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .sheet-head {
    padding: 12px 14px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sheet-title {
    font-size: 13px;
    font-weight: 620;
    color: var(--text);
  }
  .sheet-done {
    font-size: 12.5px;
    font-weight: 560;
    color: var(--accent);
  }
  .sheet-list {
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    overflow-y: auto;
  }
  .sheet-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-top: 0.5px solid var(--line);
    width: 100%;
  }
  .check {
    flex: 0 0 auto;
    width: 17px;
    height: 17px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.2px solid var(--line);
    background: transparent;
    color: var(--onText);
  }
  .sheet-row.on .check {
    border-color: var(--accent);
    background: var(--accent);
  }
  .check svg {
    opacity: 0;
  }
  .sheet-row.on .check svg {
    opacity: 1;
  }
  .sheet-name {
    flex: 1 1 auto;
    font-size: 13px;
    font-weight: 540;
    color: var(--text);
  }
  .sheet-kind {
    font-family: var(--mono);
    font-size: 10.5px;
    color: var(--text2);
  }

  .toast {
    position: absolute;
    left: 14px;
    right: 14px;
    top: 10px;
    z-index: 3;
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--sheet);
    border: 0.5px solid var(--line);
    color: var(--text);
    font-size: 11.5px;
    animation: sheetUp 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes eq {
    0%,
    100% {
      transform: scaleY(0.35);
    }
    50% {
      transform: scaleY(1);
    }
  }
  @keyframes sheetUp {
    from {
      transform: translateY(18px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .eq div,
    .sheet,
    .toast,
    .pulse .stripes {
      animation: none;
    }
  }
`, v = {
  airplay: g`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 15a9 9 0 0 1 16 0"></path><path d="M12 15l4 6H8l4-6z" fill="currentColor" stroke="none"></path></svg>`,
  play: g`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;"><path d="M7 4.5 19.5 12 7 19.5z"></path></svg>`,
  playSmall: g`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 19.5 12 7 19.5z"></path></svg>`,
  pause: g`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4.2" height="15" rx="1.2"></rect><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"></rect></svg>`,
  prev: g`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2.2v14H6z"></path><path d="M19 5.6v12.8L9.6 12z"></path></svg>`,
  next: g`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.8 5H18v14h-2.2z"></path><path d="M5 5.6 14.4 12 5 18.4z"></path></svg>`,
  speaker: g`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2.5" width="14" height="19" rx="3.5"></rect><circle cx="12" cy="15" r="3.2"></circle><circle cx="12" cy="7.5" r="1.1" fill="currentColor"></circle></svg>`,
  volume: g`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"></path><path d="M16 8.5a5 5 0 0 1 0 7"></path><path d="M18.5 5.5a9 9 0 0 1 0 13"></path></svg>`,
  check: g`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4.5 4.5L19 7"></path></svg>`
}, le = "oklch(0.62 0.16 285)";
function f(e) {
  throw new Error(`spotify-media-card: ${e}`);
}
function Nt(e) {
  return typeof e == "string" && /^media_player\.[a-z0-9_]+$/.test(e);
}
function F(e, t, s, i, r) {
  if (e == null || e === "") return r;
  const n = typeof e == "string" ? Number(e) : e;
  return (typeof n != "number" || !Number.isInteger(n) || n < s || n > i) && f(`${t} must be an integer between ${s} and ${i}`), n;
}
function ce(e) {
  (!Array.isArray(e) || e.length === 0) && f("speakers must be a non-empty list of Google Cast media_player entities");
  const t = [], s = /* @__PURE__ */ new Set();
  for (const i of e) {
    const r = typeof i == "string" ? i : i == null ? void 0 : i.entity;
    Nt(r) || f(`speaker "${String(r)}" is not a media_player entity`), s.has(r) && f(`speaker ${r} is listed twice`), s.add(r);
    const n = typeof i == "object" && i && typeof i.name == "string" && i.name.trim() ? i.name.trim() : void 0;
    t.push(n ? { entity: r, name: n } : { entity: r });
  }
  return t;
}
function pe(e, t) {
  if (e == null) return [];
  Array.isArray(e) || f("presets must be a list");
  const s = new Set(t.map((r) => r.entity)), i = /* @__PURE__ */ new Set();
  return e.map((r, n) => {
    const o = typeof (r == null ? void 0 : r.name) == "string" ? r.name.trim() : "";
    o || f(`preset #${n + 1} needs a name`), i.has(o) && f(`preset "${o}" is defined twice`), i.add(o);
    const a = r.levels ?? {};
    (typeof a != "object" || Array.isArray(a)) && f(`preset "${o}": levels must be a map of entity -> volume`);
    const c = {};
    for (const [l, p] of Object.entries(a)) {
      s.has(l) || f(`preset "${o}": ${l} is not in speakers`);
      const d = typeof p == "string" ? Number(p) : p;
      (typeof d != "number" || !Number.isInteger(d) || d < 0 || d > 100) && f(`preset "${o}": volume for ${l} must be an integer 0-100`), c[l] = d;
    }
    return { name: o, levels: c };
  });
}
function de(e) {
  (!e || typeof e != "object") && f("invalid configuration"), Nt(e.group_entity) || f("group_entity must be the Music Assistant media_player entity of your Cast group");
  const t = ce(e.speakers), s = pe(e.presets, t), i = e.playlist_layout ?? "tiles";
  i !== "tiles" && i !== "list" && f('playlist_layout must be "tiles" or "list"');
  const r = e.playlist_sort ?? "last_played";
  r !== "last_played" && r !== "play_count" && f('playlist_sort must be "last_played" or "play_count"');
  const n = typeof e.default_preset == "string" ? e.default_preset.trim() : "";
  return n && !s.some((o) => o.name === n) && f(`default_preset "${n}" is not one of the presets`), {
    type: e.type,
    group_entity: e.group_entity,
    speakers: t,
    presets: s,
    default_preset: n,
    master_volume: e.master_volume !== !1,
    playlist_layout: i,
    playlist_sort: r,
    playlist_count: F(e.playlist_count, "playlist_count", 1, 50, i === "list" ? 10 : 6),
    tile_columns: F(e.tile_columns, "tile_columns", 2, 6, 3),
    speaker_count: F(e.speaker_count, "speaker_count", 1, 50, t.length),
    title: typeof e.title == "string" ? e.title : "Listening",
    accent: typeof e.accent == "string" && e.accent.trim() ? e.accent.trim() : le,
    preset_tolerance: F(e.preset_tolerance, "preset_tolerance", 0, 50, 3),
    ma_config_entry_id: typeof e.ma_config_entry_id == "string" ? e.ma_config_entry_id.trim() : ""
  };
}
const he = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function ue(e, t) {
  var i;
  const s = ((i = e.states[t.group_entity]) == null ? void 0 : i.state) === "playing";
  return t.speakers.map((r) => {
    const n = e.states[r.entity], o = (n == null ? void 0 : n.attributes) ?? {}, a = !!n && !he.has(n.state), c = typeof o.volume_level == "number", l = c ? o.volume_level : 0, p = o.is_volume_muted === !0, d = a && !c, _ = typeof o.friendly_name == "string" ? o.friendly_name : void 0;
    return {
      entity: r.entity,
      name: r.name ?? _ ?? r.entity.replace("media_player.", ""),
      vol: Math.round(l * 100),
      on: a && !d && !p,
      available: a,
      standby: d,
      notInGroup: s && d
    };
  });
}
function fe(e, t) {
  const s = e.states[t];
  if (!s)
    return {
      found: !1,
      state: "missing",
      playing: !1,
      title: "",
      artist: "",
      art: null,
      duration: null,
      position: null,
      positionUpdatedAt: null
    };
  const i = s.attributes, r = (n) => typeof n == "number" && Number.isFinite(n) ? n : null;
  return {
    found: !0,
    state: s.state,
    playing: s.state === "playing",
    title: typeof i.media_title == "string" ? i.media_title : "",
    artist: typeof i.media_artist == "string" ? i.media_artist : "",
    art: typeof i.entity_picture == "string" && i.entity_picture ? i.entity_picture : null,
    duration: r(i.media_duration),
    position: r(i.media_position),
    positionUpdatedAt: typeof i.media_position_updated_at == "string" ? i.media_position_updated_at : null
  };
}
function _e(e, t, s) {
  const i = e.filter((r) => r.available && !r.standby);
  if (!i.length) return null;
  for (const r of t) {
    let n = !0;
    for (const o of i) {
      const a = r.levels[o.entity];
      if (a === void 0) {
        if (o.on) {
          n = !1;
          break;
        }
      } else if (!o.on || Math.abs(o.vol - a) > s) {
        n = !1;
        break;
      }
    }
    if (n) return r.name;
  }
  return null;
}
function me(e) {
  const t = e.filter((s) => s.on);
  return t.length ? Math.round(t.reduce((s, i) => s + i.vol, 0) / t.length) : null;
}
function gt(e, t) {
  const s = /* @__PURE__ */ new Map(), i = e.filter((o) => o.on);
  if (!i.length) return s;
  const r = i.reduce((o, a) => o + a.vol, 0) / i.length, n = Math.max(0, Math.min(100, t));
  for (const o of i) {
    const a = r > 0 && o.vol > 0 ? o.vol * n / r : n;
    s.set(o.entity, Math.max(0, Math.min(100, Math.round(a))));
  }
  return s;
}
function ye(e, t) {
  const s = e.states[t];
  return s ? !["playing", "paused", "buffering", "on"].includes(s.state) : !0;
}
function ge(e) {
  const t = e.filter((s) => s.on);
  if (t.length === 0) {
    const s = e.filter((i) => i.available);
    return s.length ? s.every((i) => i.standby) ? "Speakers idle" : "No speakers selected" : "No speakers available";
  }
  return t.length === 1 ? t[0].name : `${t[0].name} + ${t.length - 1} more`;
}
function ve(e, t) {
  var r;
  const s = [(r = e.themes) != null && r.darkMode ? "d" : "l"], i = e.states[t.group_entity];
  s.push(i ? i.last_updated : "-");
  for (const n of t.speakers) {
    const o = e.states[n.entity];
    s.push(o ? o.last_updated : "-");
  }
  return s.join("|");
}
function be(e, t) {
  if (e.position === null) return 0;
  let s = e.position;
  if (e.playing && e.positionUpdatedAt) {
    const i = Date.parse(e.positionUpdatedAt);
    Number.isFinite(i) && (s += Math.max(0, (t - i) / 1e3));
  }
  return e.duration !== null && (s = Math.min(s, e.duration)), Math.max(0, s);
}
const xe = 300 * 1e3, vt = /* @__PURE__ */ new Map(), $e = {
  last_played: "last_played_desc",
  play_count: "play_count_desc"
};
async function we(e) {
  const t = await e.callWS({ type: "config_entries/get", domain: "music_assistant" }), s = Array.isArray(t) ? t : [], i = s.find((r) => r.state === "loaded") ?? s[0];
  if (!i) throw new Error("Music Assistant integration not found");
  return i.entry_id;
}
function ke(e) {
  if (!e) return null;
  if (typeof e == "string") {
    const t = e.trim();
    return t || null;
  }
  if (typeof e == "object") {
    const t = e;
    for (const s of ["url", "path"]) {
      const i = t[s];
      if (typeof i == "string" && /^(https?:)?\/\//.test(i)) return i;
    }
  }
  return null;
}
function Ae(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const s of e) {
    if (!s || typeof s != "object") continue;
    const i = s;
    typeof i.uri != "string" || typeof i.name != "string" || !i.uri || t.push({ uri: i.uri, name: i.name, image: ke(i.image) });
  }
  return t;
}
function Se(e, t, s) {
  return `${e}|${t}|${s}`;
}
async function Ee(e, t) {
  const s = Se(t.entryId, t.sort, t.limit), i = vt.get(s);
  if (!t.force && i && Date.now() - i.at < xe) return i.items;
  const r = await e.callService(
    "music_assistant",
    "get_library",
    { config_entry_id: t.entryId, media_type: "playlist", order_by: $e[t.sort], limit: t.limit },
    void 0,
    !1,
    !0
  ), n = (r && typeof r == "object" ? r.response : void 0) ?? {}, o = Ae(n.items);
  return vt.set(s, { at: Date.now(), items: o }), o;
}
const L = (e, t, s, i) => e.callService("media_player", t, i, { entity_id: s }), Ce = (e, t, s) => e.callService(
  "music_assistant",
  "play_media",
  { media_id: s, media_type: "playlist", enqueue: "replace" },
  { entity_id: t }
), Pe = (e, t) => L(e, "media_play_pause", t), Me = (e, t) => L(e, "media_next_track", t), Te = (e, t) => L(e, "media_previous_track", t), Ue = (e, t, s) => L(e, "media_seek", t, { seek_position: Math.max(0, Math.round(s)) }), Ht = (e, t, s) => L(e, "volume_set", t, { volume_level: Math.max(0, Math.min(100, s)) / 100 }), T = (e, t, s) => L(e, "volume_mute", t, { is_volume_muted: s });
async function Oe(e, t, s) {
  const i = [], r = [];
  for (const n of t) {
    if (!n.available) continue;
    const o = s.levels[n.entity];
    if (o === void 0) {
      (n.on || n.standby) && r.push(n.entity);
      continue;
    }
    n.on || i.push(T(e, n.entity, !1)), i.push(Ht(e, n.entity, o));
  }
  r.length && i.push(T(e, r, !0)), await Promise.all(i);
}
function bt(e) {
  const t = Math.max(0, Math.floor(e)), s = Math.floor(t / 60), i = t % 60;
  return `${s}:${String(i).padStart(2, "0")}`;
}
function st(e) {
  return Math.max(0, Math.min(1, e));
}
function xt(e, t) {
  let s = 0, i, r = !1, n;
  const o = () => {
    n = void 0, r && (r = !1, s = Date.now(), e(i));
  };
  return (a) => {
    const c = Date.now(), l = c - s;
    if (l >= t && !n) {
      s = c, e(a);
      return;
    }
    i = a, r = !0, n || (n = setTimeout(o, Math.max(0, t - l)));
  };
}
var ze = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, X = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Le(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && ze(t, s, r), r;
};
const je = [
  {
    name: "group_entity",
    required: !0,
    selector: { entity: { domain: "media_player", integration: "music_assistant" } }
  },
  {
    name: "speakers",
    required: !0,
    selector: { entity: { domain: "media_player", integration: "cast", multiple: !0 } }
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "playlist_layout", selector: { select: { mode: "dropdown", options: [{ value: "tiles", label: "Tiles" }, { value: "list", label: "List" }] } } },
      { name: "playlist_sort", selector: { select: { mode: "dropdown", options: [{ value: "last_played", label: "Last played" }, { value: "play_count", label: "Most played" }] } } },
      { name: "playlist_count", selector: { number: { min: 1, max: 50, mode: "box" } } },
      { name: "tile_columns", selector: { number: { min: 2, max: 6, mode: "box" } } },
      { name: "speaker_count", selector: { number: { min: 1, max: 50, mode: "box" } } },
      { name: "preset_tolerance", selector: { number: { min: 0, max: 50, mode: "box" } } }
    ]
  },
  { name: "default_preset", selector: { text: {} } },
  { name: "master_volume", selector: { boolean: {} } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } },
  { name: "ma_config_entry_id", selector: { text: {} } }
], Ie = {
  group_entity: "Music Assistant player for the Cast group",
  speakers: "Speakers (Google Cast entities)",
  playlist_layout: "Playlist layout",
  playlist_sort: "Playlist order",
  playlist_count: "Playlists to show",
  tile_columns: "Tile columns",
  speaker_count: "Speaker rows to show",
  preset_tolerance: "Preset match tolerance",
  default_preset: "Preset applied on a fresh start (name)",
  master_volume: "Show master volume row",
  title: "Title",
  accent: "Accent color (CSS)",
  ma_config_entry_id: "Music Assistant config entry id (optional)"
};
let z = class extends U {
  constructor() {
    super(...arguments), this._helpersLoaded = !1;
  }
  setConfig(e) {
    this._config = e;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadHaForm();
  }
  /** ha-form is lazy-loaded by the frontend; loading the entities card editor pulls it in. */
  async _loadHaForm() {
    var e, t, s;
    if (customElements.get("ha-form")) {
      this._helpersLoaded = !0;
      return;
    }
    try {
      const i = await ((e = window.loadCardHelpers) == null ? void 0 : e.call(window)), r = i == null ? void 0 : i.createCardElement({ type: "entities", entities: [] });
      (s = r == null ? void 0 : (t = r.constructor).getConfigElement) == null || s.call(t), await customElements.whenDefined("ha-form");
    } catch {
    }
    this._helpersLoaded = !0;
  }
  _formData() {
    const e = this._config ?? {}, t = Array.isArray(e.speakers) ? e.speakers.map((s) => typeof s == "string" ? s : s == null ? void 0 : s.entity).filter(Boolean) : [];
    return { ...e, speakers: t, master_volume: e.master_volume !== !1 };
  }
  _valueChanged(e) {
    if (e.stopPropagation(), !this._config) return;
    const t = e.detail.value, s = this._config, i = /* @__PURE__ */ new Map();
    for (const o of s.speakers ?? []) typeof o == "object" && (o != null && o.name) && i.set(o.entity, o.name);
    const r = (t.speakers ?? []).map((o) => i.has(o) ? { entity: o, name: i.get(o) } : o), n = { ...s, ...t, speakers: r };
    for (const o of Object.keys(n)) {
      const a = n[o];
      (a === "" || a === void 0 || a === null) && delete n[o];
    }
    this._config = n, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: n }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._helpersLoaded ? u : h`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${je}
        .computeLabel=${(e) => Ie[e.name] ?? e.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets (Focus, Chill, Dinner, Party…) are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
z.styles = St`
    .hint {
      margin-top: 12px;
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.4;
    }
    code {
      font-family: ui-monospace, Menlo, monospace;
    }
  `;
X([
  Ot({ attribute: !1 })
], z.prototype, "hass", 2);
X([
  b()
], z.prototype, "_config", 2);
X([
  b()
], z.prototype, "_helpersLoaded", 2);
z = X([
  Ut("spotify-media-card-editor")
], z);
var Ne = Object.defineProperty, He = Object.getOwnPropertyDescriptor, A = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? He(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && Ne(t, s, r), r;
};
const G = 1500, Re = 3e3, $t = 150;
let y = class extends U {
  constructor() {
    super(...arguments), this._pickerOpen = !1, this._playlists = [], this._plStatus = "idle", this._plError = "", this._activeUri = null, this._toast = "", this._fp = "", this._entryId = "", this._overrides = /* @__PURE__ */ new Map(), this._intent = /* @__PURE__ */ new Map(), this._seek = null, this._broken = /* @__PURE__ */ new Set(), this._throttled = /* @__PURE__ */ new Map(), this._fetchSeq = 0, this._lastSent = /* @__PURE__ */ new Map(), this._masterBase = [];
  }
  // ---- HA card API -------------------------------------------------------
  static getConfigElement() {
    return document.createElement("spotify-media-card-editor");
  }
  static getStubConfig(e) {
    const t = Object.values((e == null ? void 0 : e.states) ?? {}).filter((n) => n.entity_id.startsWith("media_player.")), s = t.filter((n) => n.attributes.mass_player_id !== void 0), i = s.find((n) => n.attributes.mass_player_type === "group") ?? s[0], r = t.filter((n) => n.attributes.mass_player_id === void 0 && typeof n.attributes.volume_level == "number").slice(0, 4);
    return {
      group_entity: (i == null ? void 0 : i.entity_id) ?? "media_player.your_cast_group",
      speakers: r.length ? r.map((n) => n.entity_id) : ["media_player.living_room"],
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  setConfig(e) {
    const t = this._config, s = de(e);
    this._config = s, this._activeUri = this._loadActive(s.group_entity), (!t || t.playlist_sort !== s.playlist_sort || t.playlist_count !== s.playlist_count || t.ma_config_entry_id !== s.ma_config_entry_id) && (this._entryId = s.ma_config_entry_id, this._plStatus = "idle", this._hass && this._ensurePlaylists());
  }
  set hass(e) {
    const t = !this._hass;
    if (this._hass = e, !this._config) return;
    const s = ve(e, this._config);
    s !== this._fp && (this._fp = s, this._syncActiveWithPlayer(e), this.requestUpdate()), t && this._plStatus === "idle" && this._ensurePlaylists();
  }
  get hass() {
    return this._hass;
  }
  // ---- lifecycle ---------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._tick = window.setInterval(() => {
      if (!this._hass || !this._config) return;
      const e = this._hass.states[this._config.group_entity];
      ((e == null ? void 0 : e.state) === "playing" || this._overrides.size || this._seek) && this.requestUpdate();
    }, 1e3), this._hass && this._config && this._plStatus !== "loading" && this._ensurePlaylists();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tick && window.clearInterval(this._tick), this._toastTimer && window.clearTimeout(this._toastTimer), this._refetchTimer && window.clearTimeout(this._refetchTimer);
  }
  updated(e) {
    var s, i;
    const t = ((i = (s = this._hass) == null ? void 0 : s.themes) == null ? void 0 : i.darkMode) ?? !0;
    this.setAttribute("theme", t ? "dark" : "light"), this._config && this.style.setProperty("--accent", this._config.accent);
  }
  // ---- playlists ---------------------------------------------------------
  async _ensurePlaylists(e = !1) {
    const t = this._hass, s = this._config;
    if (!t || !s) return;
    const i = ++this._fetchSeq;
    this._playlists.length || (this._plStatus = "loading");
    try {
      this._entryId || (this._entryId = await we(t));
      const r = await Ee(t, {
        entryId: this._entryId,
        sort: s.playlist_sort,
        limit: s.playlist_count,
        force: e
      });
      if (i !== this._fetchSeq) return;
      this._playlists = r, this._plStatus = "ready", this._plError = "";
    } catch (r) {
      if (i !== this._fetchSeq) return;
      this._plStatus = "error", this._plError = wt(r);
    }
  }
  _play(e) {
    const t = this._hass, s = this._config;
    if (!t || !s) return;
    this._activeUri = e.uri, this._saveActive(s.group_entity, e.uri);
    const i = s.default_preset ? s.presets.find((r) => r.name === s.default_preset) : void 0;
    i && ye(t, s.group_entity) && this._intent.size === 0 && this._applyPreset(this._speakers(t, s, Date.now()), i), this._run(
      Ce(t, s.group_entity, e.uri).then(() => {
        this._refetchTimer && window.clearTimeout(this._refetchTimer), this._refetchTimer = window.setTimeout(() => void this._ensurePlaylists(!0), Re);
      })
    );
  }
  _storageKey(e) {
    return `spotify-media-card:${e}`;
  }
  _loadActive(e) {
    try {
      return window.localStorage.getItem(this._storageKey(e));
    } catch {
      return null;
    }
  }
  _saveActive(e, t) {
    try {
      t ? window.localStorage.setItem(this._storageKey(e), t) : window.localStorage.removeItem(this._storageKey(e));
    } catch {
    }
  }
  /** Forget the highlighted playlist once the player has clearly stopped. */
  _syncActiveWithPlayer(e) {
    if (!this._config || !this._activeUri) return;
    const t = e.states[this._config.group_entity];
    (!t || ["off", "idle", "unavailable", "unknown", "standby"].includes(t.state)) && (this._activeUri = null, this._saveActive(this._config.group_entity, null));
  }
  // ---- speakers ----------------------------------------------------------
  /**
   * Live speaker state with two local layers on top:
   * - short-lived optimistic overrides right after a service call, and
   * - "intent" values remembered for speakers that are idle (Cast reports no
   *   volume while off), so a preset or slider set before playback starts stays visible.
   */
  _speakers(e, t, s) {
    return ue(e, t).map((i) => {
      let r = i;
      if (!r.notInGroup) if (r.standby) {
        const o = this._intent.get(r.entity);
        o && (r = { ...r, standby: !1, vol: o.vol ?? 0, on: o.on ?? !0 });
      } else
        this._intent.delete(r.entity);
      const n = this._overrides.get(r.entity);
      return !n || r.notInGroup ? r : s >= n.until ? (this._overrides.delete(r.entity), r) : { ...r, standby: !1, vol: n.vol ?? r.vol, on: n.on ?? r.on };
    });
  }
  _remember(e, t) {
    const s = this._intent.get(e) ?? {};
    this._intent.set(e, { ...s, ...t });
  }
  _bump(e, t, s = G) {
    this._remember(e, t), this._overrides.set(e, { ...t, until: Date.now() + s }), this.requestUpdate(), window.setTimeout(() => this.requestUpdate(), s + 50);
  }
  _toggle(e) {
    !this._hass || !e.available || (this._bump(e.entity, { on: !e.on }), this._run(T(this._hass, e.entity, e.on)));
  }
  _muteAll(e, t) {
    if (!this._hass) return;
    const s = e.filter((i) => i.available).map((i) => i.entity);
    if (s.length) {
      for (const i of s) this._bump(i, { on: !t });
      this._run(T(this._hass, s, t));
    }
  }
  _applyPreset(e, t) {
    if (this._hass) {
      for (const s of e) {
        if (!s.available) continue;
        const i = t.levels[s.entity];
        this._bump(s.entity, i === void 0 ? { on: !1 } : { on: !0, vol: i }, G + 1e3);
      }
      this._run(Oe(this._hass, e, t));
    }
  }
  _sendVolume(e, t) {
    !this._hass || this._lastSent.get(e) === t || (this._lastSent.set(e, t), this._run(Ht(this._hass, e, t)));
  }
  _throttleFor(e) {
    let t = this._throttled.get(e);
    return t || (t = xt((s) => this._sendVolume(e, s), $t), this._throttled.set(e, t)), t;
  }
  _dragStart(e, t) {
    const s = this._hass;
    if (!s || !t.available) return;
    e.preventDefault();
    const i = e.currentTarget;
    try {
      i.setPointerCapture(e.pointerId);
    } catch {
    }
    t.on || this._run(T(s, t.entity, !1)), this._lastSent.delete(t.entity);
    const r = this._throttleFor(t.entity), n = (c) => {
      const l = i.getBoundingClientRect();
      return Math.round(st((c.clientX - l.left) / l.width) * 100);
    }, o = (c) => {
      const l = n(c);
      this._remember(t.entity, { vol: l, on: !0 }), this._overrides.set(t.entity, { vol: l, on: !0, until: 1 / 0 }), this.requestUpdate(), r(l);
    }, a = (c) => {
      i.removeEventListener("pointermove", o), i.removeEventListener("pointerup", a), i.removeEventListener("pointercancel", a);
      const l = n(c);
      this._bump(t.entity, { vol: l, on: !0 }), this._sendVolume(t.entity, l);
    };
    i.addEventListener("pointermove", o), i.addEventListener("pointerup", a), i.addEventListener("pointercancel", a), o(e);
  }
  _sendMaster(e, t) {
    if (this._hass)
      for (const [i, r] of gt(e, t)) this._sendVolume(i, r);
  }
  _masterDragStart(e, t) {
    const s = this._hass;
    if (!s) return;
    let i = t.filter((l) => l.on && l.available);
    if (!i.length) {
      if (i = t.filter((l) => l.available && !l.notInGroup).map((l) => ({ ...l, on: !0, vol: 0 })), !i.length) return;
      this._run(T(s, i.map((l) => l.entity), !1));
    }
    e.preventDefault();
    const r = e.currentTarget;
    try {
      r.setPointerCapture(e.pointerId);
    } catch {
    }
    for (const l of i) this._lastSent.delete(l.entity);
    this._masterThrottle || (this._masterThrottle = xt((l) => this._sendMaster(this._masterBase, l), $t)), this._masterBase = i;
    const n = (l) => {
      const p = r.getBoundingClientRect();
      return Math.round(st((l.clientX - p.left) / p.width) * 100);
    }, o = (l, p) => {
      for (const [d, _] of gt(i, l))
        this._remember(d, { vol: _, on: !0 }), this._overrides.set(d, { vol: _, on: !0, until: p });
      this.requestUpdate();
    }, a = (l) => {
      const p = n(l);
      o(p, 1 / 0), this._masterThrottle(p);
    }, c = (l) => {
      r.removeEventListener("pointermove", a), r.removeEventListener("pointerup", c), r.removeEventListener("pointercancel", c);
      const p = n(l);
      o(p, Date.now() + G), this._sendMaster(i, p), window.setTimeout(() => this.requestUpdate(), G + 50);
    };
    r.addEventListener("pointermove", a), r.addEventListener("pointerup", c), r.addEventListener("pointercancel", c), a(e);
  }
  _renderMaster(e) {
    const t = me(e);
    return h`<div class=${m({ "speaker-row": !0, master: !0, on: t !== null })} title="Master volume: scales every speaker that is on">
      <span class="dot" role="img" aria-label="Master volume">${v.volume}</span>
      <span class="sp-name ellipsis">All</span>
      <div class="track-hit" @pointerdown=${(i) => this._masterDragStart(i, e)}>
        <div class="track"><div class="fill" style=${I({ width: `${t ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${t ?? "–"}</span>
    </div>`;
  }
  // ---- transport ---------------------------------------------------------
  _seekStart(e, t) {
    const s = this._hass, i = this._config;
    if (!s || !i || !t.duration) return;
    e.preventDefault();
    const r = e.currentTarget, n = t.duration;
    try {
      r.setPointerCapture(e.pointerId);
    } catch {
    }
    const o = (l) => {
      const p = r.getBoundingClientRect();
      return st((l.clientX - p.left) / p.width) * n;
    }, a = (l) => {
      this._seek = { pos: o(l), until: 1 / 0, stamp: t.positionUpdatedAt }, this.requestUpdate();
    }, c = (l) => {
      r.removeEventListener("pointermove", a), r.removeEventListener("pointerup", c), r.removeEventListener("pointercancel", c);
      const p = o(l);
      this._seek = { pos: p, until: Date.now() + 2500, stamp: t.positionUpdatedAt }, this.requestUpdate(), this._run(Ue(s, i.group_entity, p));
    };
    r.addEventListener("pointermove", a), r.addEventListener("pointerup", c), r.addEventListener("pointercancel", c), a(e);
  }
  _position(e, t) {
    const s = this._seek;
    if (s) {
      if (t < s.until && s.stamp === e.positionUpdatedAt) return s.pos;
      this._seek = null;
    }
    return be(e, t);
  }
  // ---- misc --------------------------------------------------------------
  _run(e) {
    e && e.catch((t) => this._showToast(wt(t)));
  }
  _showToast(e) {
    this._toast = e, this._toastTimer && window.clearTimeout(this._toastTimer), this._toastTimer = window.setTimeout(() => {
      this._toast = "";
    }, 4e3);
  }
  _imgBroken(e) {
    this._broken.add(e), this.requestUpdate();
  }
  // ---- render ------------------------------------------------------------
  render() {
    const e = this._config, t = this._hass;
    if (!e) return u;
    if (!t) return h`<ha-card><div class="card"></div></ha-card>`;
    const s = Date.now(), i = this._speakers(t, e, s), r = i.slice(0, e.speaker_count), n = fe(t, e.group_entity), o = i.filter((l) => l.on).length, a = _e(i, e.presets, e.preset_tolerance), c = this._playlists.find((l) => l.uri === this._activeUri) ?? null;
    return h`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="header-text">
              <span class="title">${e.title}</span>
              <span class="summary ellipsis">${ge(i)}</span>
            </div>
            <button class="pill" title="Choose speakers" @click=${() => this._pickerOpen = !this._pickerOpen}>
              ${v.airplay}<span>${o}</span>
            </button>
          </div>

          ${e.playlist_layout === "list" ? this._renderList(e) : this._renderTiles(e)}

          <div class="section-head">
            <span class="label">Speakers</span>
            <button class="text-btn" @click=${() => this._muteAll(i, o > 0)}>
              ${o > 0 ? "Mute all" : "Play on all"}
            </button>
          </div>

          ${e.presets.length ? h`<div class="presets">
                ${e.presets.map(
      (l) => h`<button
                    class=${m({ preset: !0, active: a === l.name })}
                    @click=${() => this._applyPreset(i, l)}
                  >
                    ${l.name}
                  </button>`
    )}
              </div>` : u}

          <div class="speakers">
            ${e.master_volume ? this._renderMaster(i) : u}
            ${r.map((l) => this._renderSpeaker(l))}
          </div>

          ${this._renderNow(n, c, s)}
          ${this._pickerOpen ? this._renderPicker(i) : u}
          ${this._toast ? h`<div class="toast">${this._toast}</div>` : u}
        </div>
      </ha-card>
    `;
  }
  _renderArt(e, t, s, i, r = !1) {
    const n = !!t && !this._broken.has(s);
    return h`<div class=${m({ art: !0, [e]: !0, pulse: r })}>
      <div class="stripes"></div>
      ${n ? h`<img
            src=${t}
            alt=""
            loading="lazy"
            @load=${(o) => o.target.classList.add("loaded")}
            @error=${() => this._imgBroken(s)}
          />` : h`<div class="art-label">ART ${String(i + 1).padStart(2, "0")}</div>`}
    </div>`;
  }
  _renderPlaylistState(e) {
    if (this._plStatus === "error")
      return h`<div class="pl-msg">
        <span>${this._plError || "Could not load playlists"}</span>
        <button class="text-btn" @click=${() => void this._ensurePlaylists(!0)}>Retry</button>
      </div>`;
    if (this._plStatus === "ready" && !this._playlists.length)
      return h`<div class="pl-msg">No playlists yet</div>`;
    if (this._plStatus !== "ready" && !this._playlists.length) {
      const t = e.playlist_layout === "list" ? Math.min(e.playlist_count, 10) : e.playlist_count, s = Array.from({ length: t }, (i, r) => r);
      return e.playlist_layout === "list" ? h`<div class="list">
            ${s.map(
        (i) => h`<div class=${m({ "list-row": !0, first: i === 0 })}>
                ${this._renderArt("list-art", null, `ph${i}`, i, !0)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`
      )}
          </div>` : h`<div class="tiles" style=${I({ "--cols": String(e.tile_columns) })}>
            ${s.map(
        (i) => h`<div class="tile">
                ${this._renderArt("tile-art", null, `ph${i}`, i, !0)}<span class="tile-name">&nbsp;</span>
              </div>`
      )}
          </div>`;
    }
    return null;
  }
  _renderTiles(e) {
    const t = this._renderPlaylistState(e);
    return t || h`<div class="tiles" style=${I({ "--cols": String(e.tile_columns) })}>
      ${this._playlists.slice(0, e.playlist_count).map(
      (s, i) => h`<button
          class=${m({ tile: !0, active: s.uri === this._activeUri })}
          title=${s.name}
          @click=${() => this._play(s)}
        >
          <div class="tile-art-wrap" style="position:relative;width:100%">
            ${this._renderArt("tile-art", s.image, s.uri, i)}
            <div class="ring"></div>
          </div>
          <span class="tile-name ellipsis">${s.name}</span>
        </button>`
    )}
    </div>`;
  }
  _renderList(e) {
    const t = this._renderPlaylistState(e);
    return t || h`<div class="list">
      ${this._playlists.slice(0, e.playlist_count).map(
      (s, i) => h`<button
          class=${m({ "list-row": !0, first: i === 0, active: s.uri === this._activeUri })}
          @click=${() => this._play(s)}
        >
          ${this._renderArt("list-art", s.image, s.uri, i)}
          <span class="list-name ellipsis">${s.name}</span>
          <span class="list-play">${v.playSmall}</span>
        </button>`
    )}
    </div>`;
  }
  _renderSpeaker(e) {
    const t = e.available ? e.notInGroup ? "Not in the Cast group: add it in the Google Home app" : e.standby ? "Idle" : "Toggle speaker" : "Unavailable";
    return h`<div
      class=${m({ "speaker-row": !0, on: e.on, unavailable: !e.available, standby: e.standby, orphan: e.notInGroup })}
      title=${t}
    >
      <button class="dot" title=${t} ?disabled=${!e.available} @click=${() => this._toggle(e)}>
        ${v.speaker}
      </button>
      <span class="sp-name ellipsis">${e.name}</span>
      <div class="track-hit" @pointerdown=${(s) => this._dragStart(s, e)}>
        <div class="track"><div class="fill" style=${I({ width: `${e.on ? e.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${e.notInGroup ? "n/a" : e.standby ? "–" : e.vol}</span>
    </div>`;
  }
  _renderNow(e, t, s) {
    const i = this._config, r = this._position(e, s), n = e.duration ?? 0, o = n > 0 ? r / n * 100 : 0;
    let a = e.title;
    e.found ? a || (a = e.state === "playing" ? "Playing" : e.state === "paused" ? "Paused" : "Nothing playing") : a = "Player not found";
    const c = e.found ? [e.artist, t == null ? void 0 : t.name].filter(Boolean).join(" · ") : i.group_entity, l = e.found && n > 0, p = !e.found;
    return h`<div class=${m({ now: !0, paused: !e.playing })}>
      <div class="now-row">
        ${this._renderArt("now-art", e.art, `now:${e.art ?? ""}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            <div class="eq"><div></div><div></div><div></div></div>
            <span class="now-title ellipsis">${a}</span>
          </div>
          <span class="now-artist ellipsis">${c}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${p} @click=${() => this._run(Te(this._hass, i.group_entity))}>${v.prev}</button>
          <button class="play" title=${e.playing ? "Pause" : "Play"} ?disabled=${p} @click=${() => this._run(Pe(this._hass, i.group_entity))}>
            ${e.playing ? v.pause : v.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${p} @click=${() => this._run(Me(this._hass, i.group_entity))}>${v.next}</button>
        </div>
      </div>
      <div class=${m({ "progress-hit": !0, disabled: !l })} @pointerdown=${(d) => this._seekStart(d, e)}>
        <div class="progress"><div class="progress-fill" style=${I({ width: `${o.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${bt(r)}</span><span>${n > 0 ? `-${bt(n - r)}` : "–:––"}</span></div>
      </div>
    </div>`;
  }
  _renderPicker(e) {
    const t = () => this._pickerOpen = !1;
    return h`<div class="scrim" @click=${t}>
      <div class="sheet" @click=${(s) => s.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-title">Play on</span>
          <button class="sheet-done" @click=${t}>Done</button>
        </div>
        <div class="sheet-list">
          ${e.map(
      (s) => h`<button class=${m({ "sheet-row": !0, on: s.on })} ?disabled=${!s.available} @click=${() => this._toggle(s)}>
              <span class="check">${v.check}</span>
              <span class="sheet-name ellipsis">${s.name}</span>
              <span class="sheet-kind">${s.available ? s.notInGroup ? "not in group" : s.standby ? "idle" : s.on ? `${s.vol}` : "muted" : "offline"}</span>
            </button>`
    )}
        </div>
      </div>
    </div>`;
  }
};
y.styles = ae;
A([
  b()
], y.prototype, "_config", 2);
A([
  b()
], y.prototype, "_pickerOpen", 2);
A([
  b()
], y.prototype, "_playlists", 2);
A([
  b()
], y.prototype, "_plStatus", 2);
A([
  b()
], y.prototype, "_plError", 2);
A([
  b()
], y.prototype, "_activeUri", 2);
A([
  b()
], y.prototype, "_toast", 2);
y = A([
  Ut("spotify-media-card")
], y);
function wt(e) {
  if (e && typeof e == "object") {
    const t = e;
    if (typeof t.message == "string") return t.message;
    if (t.error && typeof t.error.message == "string") return t.error.message;
  }
  return String(e);
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "spotify-media-card",
  name: "Spotify Media Card",
  description: "Start Spotify playlists on multi-room Chromecast speakers through Music Assistant.",
  preview: !1
});
export {
  y as SpotifyMediaCard
};
