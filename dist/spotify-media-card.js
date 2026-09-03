/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, rt = Y.ShadowRoot && (Y.ShadyCSS === void 0 || Y.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== nt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (rt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ct.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ct.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Vt = (i) => new Et(typeof i == "string" ? i : i + "", void 0, nt), Pt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new Et(e, i, nt);
}, Wt = (i, t) => {
  if (rt) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = Y.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, dt = rt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Vt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: Gt, getOwnPropertyDescriptor: Kt, getOwnPropertyNames: Yt, getOwnPropertySymbols: Zt, getPrototypeOf: Jt } = Object, $ = globalThis, pt = $.trustedTypes, Xt = pt ? pt.emptyScript : "", tt = $.reactiveElementPolyfillSupport, H = (i, t) => i, Z = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Xt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, ot = (i, t) => !Ft(i, t), ht = { attribute: !0, type: String, converter: Z, reflect: !1, useDefault: !1, hasChanged: ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ht) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && Gt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = Kt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = Jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, s = [...Yt(e), ...Zt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(dt(r));
    } else t !== void 0 && e.push(dt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : Z).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = s.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : Z;
      this._$Em = r;
      const c = a.fromAttribute(e, l.type);
      this[r] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? ot)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[H("elementProperties")] = /* @__PURE__ */ new Map(), C[H("finalized")] = /* @__PURE__ */ new Map(), tt == null || tt({ ReactiveElement: C }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, ut = (i) => i, J = R.trustedTypes, ft = J ? J.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Ct = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, Mt = "?" + x, Qt = `<${Mt}>`, E = document, L = () => E.createComment(""), q = (i) => i === null || typeof i != "object" && typeof i != "function", at = Array.isArray, te = (i) => at(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, mt = /-->/g, yt = />/g, k = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _t = /'/g, gt = /"/g, Tt = /^(?:script|style|textarea|title)$/i, Ut = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), h = Ut(1), g = Ut(2), w = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), A = E.createTreeWalker(E, 129);
function zt(i, t) {
  if (!at(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(t) : t;
}
const ee = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let c, p, d = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, p = o.exec(a), p !== null); ) f = o.lastIndex, o === j ? p[1] === "!--" ? o = mt : p[1] !== void 0 ? o = yt : p[2] !== void 0 ? (Tt.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = k) : p[3] !== void 0 && (o = k) : o === k ? p[0] === ">" ? (o = r ?? j, d = -1) : p[1] === void 0 ? d = -2 : (d = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? k : p[3] === '"' ? gt : _t) : o === gt || o === _t ? o = k : o === mt || o === yt ? o = j : (o = k, r = void 0);
    const _ = o === k && i[l + 1].startsWith("/>") ? " " : "";
    n += o === j ? a + Qt : d >= 0 ? (s.push(c), a.slice(0, d) + Ct + a.slice(d) + x + _) : a + x + (d === -2 ? l : _);
  }
  return [zt(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, p] = ee(t, e);
    if (this.el = B.createElement(c, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = A.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(Ct)) {
          const f = p[o++], _ = r.getAttribute(d).split(x), F = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: n, name: F[2], strings: _, ctor: F[1] === "." ? ie : F[1] === "?" ? re : F[1] === "@" ? ne : X }), r.removeAttribute(d);
        } else d.startsWith(x) && (a.push({ type: 6, index: n }), r.removeAttribute(d));
        if (Tt.test(r.tagName)) {
          const d = r.textContent.split(x), f = d.length - 1;
          if (f > 0) {
            r.textContent = J ? J.emptyScript : "";
            for (let _ = 0; _ < f; _++) r.append(d[_], L()), A.nextNode(), a.push({ type: 2, index: ++n });
            r.append(d[f], L());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Mt) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(x, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += x.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = E.createElement("template");
    return s.innerHTML = t, s;
  }
}
function U(i, t, e = i, s) {
  var o, l;
  if (t === w) return t;
  let r = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = q(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = U(i, r._$AS(i, t.values), r, s)), t;
}
class se {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? E).importNode(e, !0);
    A.currentNode = r;
    let n = A.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new W(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new oe(n, this, t)), this._$AV.push(c), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = A.nextNode(), o++);
    }
    return A.currentNode = E, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class W {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = U(this, t, e), q(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : te(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = B.createElement(zt(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new se(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = vt.get(t.strings);
    return e === void 0 && vt.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new W(this.O(L()), this.O(L()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = ut(t).nextSibling;
      ut(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = U(this, t, e, 0), o = !q(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = U(this, l[s + a], e, a), c === w && (c = this._$AH[a]), o || (o = !q(c) || c !== this._$AH[a]), c === u ? t = u : t !== u && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ie extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class re extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ne extends X {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = U(this, t, e, 0) ?? u) === w) return;
    const s = this._$AH, r = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class oe {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    U(this, t);
  }
}
const st = R.litHtmlPolyfillSupport;
st == null || st(B, W), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.3");
const ae = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new W(t.insertBefore(L(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
let T = class extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ae(e, this.renderRoot, this.renderOptions);
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
    return w;
  }
};
var St;
T._$litElement$ = !0, T.finalized = !0, (St = S.litElementHydrateSupport) == null || St.call(S, { LitElement: T });
const it = S.litElementPolyfillSupport;
it == null || it({ LitElement: T });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ot = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = { attribute: !0, type: String, converter: Z, reflect: !1, hasChanged: ot }, ce = (i = le, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function It(i) {
  return (t, e) => typeof e == "object" ? ce(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(i) {
  return It({ ...i, state: !0, attribute: !1 });
}
const de = "oklch(0.62 0.16 285)";
function m(i, t) {
  throw new Error(`${i}: ${t}`);
}
function jt(i) {
  return typeof i == "string" && /^media_player\.[a-z0-9_]+$/.test(i);
}
function D(i, t, e, s, r, n) {
  if (t == null || t === "") return n;
  const o = typeof t == "string" ? Number(t) : t;
  return (typeof o != "number" || !Number.isInteger(o) || o < s || o > r) && m(i, `${e} must be an integer between ${s} and ${r}`), o;
}
function pe(i, t) {
  (!Array.isArray(t) || t.length === 0) && m(i, "speakers must be a non-empty list of Google Cast media_player entities");
  const e = [], s = /* @__PURE__ */ new Set();
  for (const r of t) {
    const n = typeof r == "string" ? r : r == null ? void 0 : r.entity;
    jt(n) || m(i, `speaker "${String(n)}" is not a media_player entity`), s.has(n) && m(i, `speaker ${n} is listed twice`), s.add(n);
    const o = typeof r == "object" && r && typeof r.name == "string" && r.name.trim() ? r.name.trim() : void 0;
    e.push(o ? { entity: n, name: o } : { entity: n });
  }
  return e;
}
function he(i, t, e) {
  if (t == null) return [];
  Array.isArray(t) || m(i, "presets must be a list");
  const s = new Set(e.map((n) => n.entity)), r = /* @__PURE__ */ new Set();
  return t.map((n, o) => {
    const l = typeof (n == null ? void 0 : n.name) == "string" ? n.name.trim() : "";
    l || m(i, `preset #${o + 1} needs a name`), r.has(l) && m(i, `preset "${l}" is defined twice`), r.add(l);
    const a = n.levels ?? {};
    (typeof a != "object" || Array.isArray(a)) && m(i, `preset "${l}": levels must be a map of entity -> volume`);
    const c = {};
    for (const [p, d] of Object.entries(a)) {
      s.has(p) || m(i, `preset "${l}": ${p} is not in speakers`);
      const f = typeof d == "string" ? Number(d) : d;
      (typeof f != "number" || !Number.isInteger(f) || f < 0 || f > 100) && m(i, `preset "${l}": volume for ${p} must be an integer 0-100`), c[p] = f;
    }
    return { name: l, levels: c };
  });
}
function ue(i, t) {
  const e = pe(i, t.speakers), s = he(i, t.presets, e), r = typeof t.default_preset == "string" ? t.default_preset.trim() : "";
  r && !s.some((o) => o.name === r) && m(i, `default_preset "${r}" is not one of the presets`);
  const n = t.layout ?? "vertical";
  return ["vertical", "horizontal", "auto"].includes(n) || m(i, 'layout must be "vertical", "horizontal" or "auto"'), {
    layout: n,
    speakers: e,
    presets: s,
    speaker_count: D(i, t.speaker_count, "speaker_count", 1, 50, e.length),
    preset_tolerance: D(i, t.preset_tolerance, "preset_tolerance", 0, 50, 3),
    master_volume: t.master_volume !== !1,
    default_preset: r
  };
}
function fe(i, t) {
  const e = t.playlist_layout ?? "tiles";
  e !== "tiles" && e !== "list" && m(i, 'playlist_layout must be "tiles" or "list"');
  const s = t.playlist_sort ?? "last_played";
  s !== "last_played" && s !== "play_count" && m(i, 'playlist_sort must be "last_played" or "play_count"');
  const r = D(i, t.tile_columns, "tile_columns", 2, 8, 3);
  return {
    playlist_layout: e,
    playlist_sort: s,
    playlist_count: D(i, t.playlist_count, "playlist_count", 1, 50, e === "list" ? 10 : 6),
    tile_columns: r,
    /** playlists per row when the card renders two columns (horizontal / auto when wide) */
    tile_columns_wide: D(i, t.tile_columns_wide, "tile_columns_wide", 2, 8, r)
  };
}
function me(i, t) {
  return typeof i == "string" && i.trim() ? i.trim() : t;
}
const G = "spotify-media-card";
function ye(i) {
  return (!i || typeof i != "object") && m(G, "invalid configuration"), jt(i.group_entity) || m(G, "group_entity must be the Music Assistant media_player entity of your Cast group"), {
    type: i.type,
    group_entity: i.group_entity,
    ...ue(G, i),
    ...fe(G, i),
    title: typeof i.title == "string" ? i.title : "Listening",
    accent: me(i.accent, de),
    ma_config_entry_id: typeof i.ma_config_entry_id == "string" ? i.ma_config_entry_id.trim() : ""
  };
}
const _e = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function ge(i, t, e) {
  var r;
  const s = ((r = i.states[e]) == null ? void 0 : r.state) === "playing";
  return t.map((n) => {
    const o = i.states[n.entity], l = (o == null ? void 0 : o.attributes) ?? {}, a = !!o && !_e.has(o.state), c = typeof l.volume_level == "number", p = c ? l.volume_level : 0, d = l.is_volume_muted === !0, f = a && !c, _ = typeof l.friendly_name == "string" ? l.friendly_name : void 0;
    return {
      entity: n.entity,
      name: n.name ?? _ ?? n.entity.replace("media_player.", ""),
      vol: Math.round(p * 100),
      on: a && !f && !d,
      available: a,
      standby: f,
      notInGroup: s && f
    };
  });
}
function ve(i, t) {
  const e = i.states[t];
  if (!e)
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
  const s = e.attributes, r = (n) => typeof n == "number" && Number.isFinite(n) ? n : null;
  return {
    found: !0,
    state: e.state,
    playing: e.state === "playing",
    title: typeof s.media_title == "string" ? s.media_title : "",
    artist: typeof s.media_artist == "string" ? s.media_artist : "",
    art: typeof s.entity_picture == "string" && s.entity_picture ? s.entity_picture : null,
    duration: r(s.media_duration),
    position: r(s.media_position),
    positionUpdatedAt: typeof s.media_position_updated_at == "string" ? s.media_position_updated_at : null
  };
}
function be(i, t, e) {
  const s = i.filter((r) => r.available && !r.standby);
  if (!s.length) return null;
  for (const r of t) {
    let n = !0;
    for (const o of s) {
      const l = r.levels[o.entity];
      if (l === void 0) {
        if (o.on) {
          n = !1;
          break;
        }
      } else if (!o.on || Math.abs(o.vol - l) > e) {
        n = !1;
        break;
      }
    }
    if (n) return r.name;
  }
  return null;
}
function xe(i) {
  const t = i.filter((e) => e.on);
  return t.length ? Math.round(t.reduce((e, s) => e + s.vol, 0) / t.length) : null;
}
function bt(i, t) {
  const e = /* @__PURE__ */ new Map(), s = i.filter((o) => o.on);
  if (!s.length) return e;
  const r = s.reduce((o, l) => o + l.vol, 0) / s.length, n = Math.max(0, Math.min(100, t));
  for (const o of s) {
    const l = r > 0 && o.vol > 0 ? o.vol * n / r : n;
    e.set(o.entity, Math.max(0, Math.min(100, Math.round(l))));
  }
  return e;
}
function $e(i, t) {
  const e = i.states[t];
  return e ? !["playing", "paused", "buffering", "on"].includes(e.state) : !0;
}
function we(i) {
  const t = i.filter((e) => e.on);
  if (t.length === 0) {
    const e = i.filter((s) => s.available);
    return e.length ? e.every((s) => s.standby) ? "Speakers idle" : "No speakers selected" : "No speakers available";
  }
  return t.length === 1 ? t[0].name : `${t[0].name} + ${t.length - 1} more`;
}
function ke(i, t) {
  var s;
  const e = [(s = i.themes) != null && s.darkMode ? "d" : "l"];
  for (const r of t) {
    const n = i.states[r];
    e.push(n ? n.last_updated : "-");
  }
  return e.join("|");
}
function Nt(i) {
  if (i && typeof i == "object") {
    const t = i;
    if (typeof t.message == "string") return t.message;
    if (t.error && typeof t.error.message == "string") return t.error.message;
    if (t.body && typeof t.body.message == "string") return t.body.message;
  }
  return String(i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = { ATTRIBUTE: 1 }, Rt = (i) => (...t) => ({ _$litDirective$: i, values: t });
let Dt = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, s) {
    this._$Ct = t, this._$AM = e, this._$Ci = s;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = Rt(class extends Dt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Ht.ATTRIBUTE || i.name !== "class" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return " " + Object.keys(i).filter((t) => i[t]).join(" ") + " ";
  }
  update(i, [t]) {
    var s, r;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), i.strings !== void 0 && (this.nt = new Set(i.strings.join(" ").split(/\s/).filter((n) => n !== "")));
      for (const n in t) t[n] && !((s = this.nt) != null && s.has(n)) && this.st.add(n);
      return this.render(t);
    }
    const e = i.element.classList;
    for (const n of this.st) n in t || (e.remove(n), this.st.delete(n));
    for (const n in t) {
      const o = !!t[n];
      o === this.st.has(n) || (r = this.nt) != null && r.has(n) || (o ? (e.add(n), this.st.add(n)) : (e.remove(n), this.st.delete(n)));
    }
    return w;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = "important", Ae = " !" + Lt, N = Rt(class extends Dt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Ht.ATTRIBUTE || i.name !== "style" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return Object.keys(i).reduce((t, e) => {
      const s = i[e];
      return s == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(i, [t]) {
    const { style: e } = i.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const s of this.ft) t[s] == null && (this.ft.delete(s), s.includes("-") ? e.removeProperty(s) : e[s] = null);
    for (const s in t) {
      const r = t[s];
      if (r != null) {
        this.ft.add(s);
        const n = typeof r == "string" && r.endsWith(Ae);
        s.includes("-") || n ? e.setProperty(s, n ? r.slice(0, -11) : r, n ? Lt : "") : e[s] = r;
      }
    }
    return w;
  }
}), Se = Pt`
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

  /* Layout: two columns (playlists + player | speakers) */
  :host {
    container-type: inline-size;
  }
  .card {
    display: flex;
    flex-direction: column;
  }
  .col-left,
  .col-right {
    display: contents;
  }
  /* vertical order: header, playlists, speakers, now-playing */
  .col-left > .now {
    order: 5;
  }
  .card.horizontal {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: 22px;
    align-items: stretch;
  }
  .card.horizontal .col-left,
  .card.horizontal .col-right {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .card.horizontal .col-left > .playlists-area {
    flex: 1 1 auto;
  }
  .card.horizontal .col-left > .now {
    margin-top: auto;
  }
  .card.horizontal .col-right > .speakers {
    margin-bottom: 0;
  }
  .card.horizontal .tiles {
    grid-template-columns: repeat(var(--cols-wide, var(--cols, 3)), 1fr);
  }
  @container (min-width: 600px) {
    .card.auto {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      column-gap: 22px;
      align-items: stretch;
    }
    .card.auto .col-left,
    .card.auto .col-right {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .card.auto .col-left > .playlists-area {
      flex: 1 1 auto;
    }
    .card.auto .col-left > .now {
      margin-top: auto;
    }
    .card.auto .col-right > .speakers {
      margin-bottom: 0;
    }
    .card.auto .tiles {
      grid-template-columns: repeat(var(--cols-wide, var(--cols, 3)), 1fr);
    }
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

  .spinner {
    flex: 0 0 auto;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 1.5px solid var(--track);
    border-top-color: var(--accent);
    animation: spin 0.8s linear infinite;
  }
  .now.busy .now-title {
    color: var(--text2);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
};
function Ee(i, t) {
  if (i.position === null) return 0;
  let e = i.position;
  if (i.playing && i.positionUpdatedAt) {
    const s = Date.parse(i.positionUpdatedAt);
    Number.isFinite(s) && (e += Math.max(0, (t - s) / 1e3));
  }
  return i.duration !== null && (e = Math.min(e, i.duration)), Math.max(0, e);
}
const O = (i, t, e, s) => i.callService("media_player", t, s, { entity_id: e }), Pe = (i, t) => O(i, "media_play_pause", t), Ce = (i, t) => O(i, "media_next_track", t), Me = (i, t) => O(i, "media_previous_track", t), Te = (i, t, e) => O(i, "media_seek", t, { seek_position: Math.max(0, Math.round(e)) }), qt = (i, t, e) => O(i, "volume_set", t, { volume_level: Math.max(0, Math.min(100, e)) / 100 }), M = (i, t, e) => O(i, "volume_mute", t, { is_volume_muted: e });
async function Ue(i, t, e) {
  const s = [], r = [];
  for (const n of t) {
    if (!n.available) continue;
    const o = e.levels[n.entity];
    if (o === void 0) {
      (n.on || n.standby) && r.push(n.entity);
      continue;
    }
    n.on || s.push(M(i, n.entity, !1)), s.push(qt(i, n.entity, o));
  }
  r.length && s.push(M(i, r, !0)), await Promise.all(s);
}
function xt(i) {
  const t = Math.max(0, Math.floor(i)), e = Math.floor(t / 60), s = t % 60;
  return `${e}:${String(s).padStart(2, "0")}`;
}
function $t(i) {
  return Math.max(0, Math.min(1, i));
}
function wt(i, t) {
  let e = 0, s, r = !1, n;
  const o = () => {
    n = void 0, r && (r = !1, e = Date.now(), i(s));
  };
  return (l) => {
    const a = Date.now(), c = a - e;
    if (c >= t && !n) {
      e = a, i(l);
      return;
    }
    s = l, r = !0, n || (n = setTimeout(o, Math.max(0, t - c)));
  };
}
var ze = Object.defineProperty, Bt = (i, t, e, s) => {
  for (var r = void 0, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = o(t, e, r) || r);
  return r && ze(t, e, r), r;
};
const K = 1500, kt = 150, lt = class lt extends T {
  constructor() {
    super(...arguments), this._pickerOpen = !1, this._toast = "", this._fp = "", this._overrides = /* @__PURE__ */ new Map(), this._intent = /* @__PURE__ */ new Map(), this._seek = null, this._broken = /* @__PURE__ */ new Set(), this._throttled = /* @__PURE__ */ new Map(), this._lastSent = /* @__PURE__ */ new Map(), this._masterBase = [];
  }
  /** Extra entity ids whose changes should trigger a re-render. */
  extraEntities() {
    return [];
  }
  /** Called after a hass object with visible changes arrived. */
  hassChanged(t, e) {
  }
  /** Whether the 1 s ticker should re-render (position moving). */
  ticking(t) {
    var s;
    const e = this.groupEntity;
    return !!e && ((s = t.states[e]) == null ? void 0 : s.state) === "playing";
  }
  // ---- hass --------------------------------------------------------------
  set hass(t) {
    const e = !this._hass;
    this._hass = t;
    const s = this.section;
    if (!s) return;
    const r = [this.groupEntity ?? "", ...s.speakers.map((o) => o.entity), ...this.extraEntities()].filter(Boolean), n = ke(t, r);
    (n !== this._fp || e) && (this._fp = n, this.hassChanged(t, e), this.requestUpdate());
  }
  get hass() {
    return this._hass;
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  // ---- lifecycle ---------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._tick = window.setInterval(() => {
      this._hass && (this.ticking(this._hass) || this._overrides.size || this._seek) && this.requestUpdate();
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tick && window.clearInterval(this._tick), this._toastTimer && window.clearTimeout(this._toastTimer);
  }
  updated(t) {
    var s, r;
    const e = ((r = (s = this._hass) == null ? void 0 : s.themes) == null ? void 0 : r.darkMode) ?? !0;
    this.setAttribute("theme", e ? "dark" : "light"), this.style.setProperty("--accent", this.accent);
  }
  // ---- speakers ----------------------------------------------------------
  /**
   * Live speaker state with two local layers on top:
   * - short-lived optimistic overrides right after a service call, and
   * - "intent" values remembered for speakers that are idle (Cast reports no
   *   volume while off), so a preset or slider set before playback starts stays visible.
   */
  speakers(t, e) {
    const s = this.section;
    return s ? ge(t, s.speakers, this.groupEntity ?? "").map((r) => {
      let n = r;
      if (!n.notInGroup) if (n.standby) {
        const l = this._intent.get(n.entity);
        l && (n = { ...n, standby: !1, vol: l.vol ?? 0, on: l.on ?? !0 });
      } else
        this._intent.delete(n.entity);
      const o = this._overrides.get(n.entity);
      return !o || n.notInGroup ? n : e >= o.until ? (this._overrides.delete(n.entity), n) : { ...n, standby: !1, vol: o.vol ?? n.vol, on: o.on ?? n.on };
    }) : [];
  }
  _remember(t, e) {
    const s = this._intent.get(t) ?? {};
    this._intent.set(t, { ...s, ...e });
  }
  _bump(t, e, s = K) {
    this._remember(t, e), this._overrides.set(t, { ...e, until: Date.now() + s }), this.requestUpdate(), window.setTimeout(() => this.requestUpdate(), s + 50);
  }
  _toggle(t) {
    !this._hass || !t.available || (this._bump(t.entity, { on: !t.on }), this.run(M(this._hass, t.entity, t.on)));
  }
  _muteAll(t, e) {
    if (!this._hass) return;
    const s = t.filter((r) => r.available).map((r) => r.entity);
    if (s.length) {
      for (const r of s) this._bump(r, { on: !e });
      this.run(M(this._hass, s, e));
    }
  }
  applyPreset(t, e) {
    if (this._hass) {
      for (const s of t) {
        if (!s.available) continue;
        const r = e.levels[s.entity];
        this._bump(s.entity, r === void 0 ? { on: !1 } : { on: !0, vol: r }, K + 1e3);
      }
      this.run(Ue(this._hass, t, e));
    }
  }
  /** Apply the configured default preset if the group is cold and nothing was touched. */
  applyDefaultPresetIfCold(t, e) {
    const s = this.section;
    if (!(s != null && s.default_preset)) return;
    const r = s.presets.find((n) => n.name === s.default_preset);
    r && e && this._intent.size === 0 && this.applyPreset(this.speakers(t, Date.now()), r);
  }
  _sendVolume(t, e) {
    !this._hass || this._lastSent.get(t) === e || (this._lastSent.set(t, e), this.run(qt(this._hass, t, e)));
  }
  _throttleFor(t) {
    let e = this._throttled.get(t);
    return e || (e = wt((s) => this._sendVolume(t, s), kt), this._throttled.set(t, e)), e;
  }
  _capture(t) {
    t.preventDefault();
    const e = t.currentTarget;
    try {
      e.setPointerCapture(t.pointerId);
    } catch {
    }
    return e;
  }
  _track(t, e, s) {
    const r = (n) => {
      t.removeEventListener("pointermove", e), t.removeEventListener("pointerup", r), t.removeEventListener("pointercancel", r), s(n);
    };
    t.addEventListener("pointermove", e), t.addEventListener("pointerup", r), t.addEventListener("pointercancel", r);
  }
  _pct(t, e) {
    const s = t.getBoundingClientRect();
    return Math.round($t((e.clientX - s.left) / s.width) * 100);
  }
  _dragStart(t, e) {
    const s = this._hass;
    if (!s || !e.available) return;
    const r = this._capture(t);
    e.on || this.run(M(s, e.entity, !1)), this._lastSent.delete(e.entity);
    const n = this._throttleFor(e.entity), o = (l) => {
      const a = this._pct(r, l);
      this._remember(e.entity, { vol: a, on: !0 }), this._overrides.set(e.entity, { vol: a, on: !0, until: 1 / 0 }), this.requestUpdate(), n(a);
    };
    this._track(r, o, (l) => {
      const a = this._pct(r, l);
      this._bump(e.entity, { vol: a, on: !0 }), this._sendVolume(e.entity, a);
    }), o(t);
  }
  _sendMaster(t, e) {
    for (const [s, r] of bt(t, e)) this._sendVolume(s, r);
  }
  _masterDragStart(t, e) {
    const s = this._hass;
    if (!s) return;
    let r = e.filter((a) => a.on && a.available);
    if (!r.length) {
      if (r = e.filter((a) => a.available && !a.notInGroup).map((a) => ({ ...a, on: !0, vol: 0 })), !r.length) return;
      this.run(M(s, r.map((a) => a.entity), !1));
    }
    const n = this._capture(t);
    for (const a of r) this._lastSent.delete(a.entity);
    this._masterThrottle || (this._masterThrottle = wt((a) => this._sendMaster(this._masterBase, a), kt)), this._masterBase = r;
    const o = (a, c) => {
      for (const [p, d] of bt(r, a))
        this._remember(p, { vol: d, on: !0 }), this._overrides.set(p, { vol: d, on: !0, until: c });
      this.requestUpdate();
    }, l = (a) => {
      const c = this._pct(n, a);
      o(c, 1 / 0), this._masterThrottle(c);
    };
    this._track(n, l, (a) => {
      const c = this._pct(n, a);
      o(c, Date.now() + K), this._sendMaster(r, c), window.setTimeout(() => this.requestUpdate(), K + 50);
    }), l(t);
  }
  // ---- seek --------------------------------------------------------------
  _seekStart(t, e, s) {
    if (!e.duration) return;
    const r = this._capture(t), n = e.duration, o = (a) => {
      const c = r.getBoundingClientRect();
      return $t((a.clientX - c.left) / c.width) * n;
    }, l = (a) => {
      this._seek = { pos: o(a), until: 1 / 0, stamp: e.positionUpdatedAt }, this.requestUpdate();
    };
    this._track(r, l, (a) => {
      const c = o(a);
      this._seek = { pos: c, until: Date.now() + 2500, stamp: e.positionUpdatedAt }, this.requestUpdate(), this.run(s(c));
    }), l(t);
  }
  position(t, e) {
    const s = this._seek;
    if (s) {
      if (e < s.until && s.stamp === t.positionUpdatedAt) return s.pos;
      this._seek = null;
    }
    return Ee(t, e);
  }
  // ---- misc --------------------------------------------------------------
  run(t) {
    t && t.catch((e) => this.showToast(Nt(e)));
  }
  showToast(t, e = 4e3) {
    this._toast = t, this._toastTimer && window.clearTimeout(this._toastTimer), this._toastTimer = window.setTimeout(() => {
      this._toast = "";
    }, e);
  }
  _imgBroken(t) {
    this._broken.add(t), this.requestUpdate();
  }
  // ---- render helpers ----------------------------------------------------
  /**
   * Card frame. `left` = header + playlists + now-playing, `right` = speaker section.
   * In the vertical layout both columns are `display: contents`, so the DOM order
   * (with the now-playing bar pushed last via CSS `order`) gives the classic stack.
   */
  renderShell(t, e, s) {
    var n;
    const r = ((n = this.section) == null ? void 0 : n.layout) ?? "vertical";
    return h`<ha-card>
      <div class=${y({ card: !0, horizontal: r === "horizontal", auto: r === "auto" })}>
        <div class="col-left">${t}</div>
        <div class="col-right">${e}</div>
        ${s}
      </div>
    </ha-card>`;
  }
  renderHeader(t, e) {
    const s = e.filter((r) => r.on).length;
    return h`<div class="header">
      <div class="header-text">
        <span class="title">${t}</span>
        <span class="summary ellipsis">${we(e)}</span>
      </div>
      <button class="pill" title="Choose speakers" @click=${() => this._pickerOpen = !this._pickerOpen}>
        ${v.airplay}<span>${s}</span>
      </button>
    </div>`;
  }
  renderSpeakerSection(t) {
    const e = this.section, s = t.filter((o) => o.on).length, r = be(t, e.presets, e.preset_tolerance), n = t.slice(0, e.speaker_count);
    return h`
      <div class="section-head">
        <span class="label">Speakers</span>
        <button class="text-btn" @click=${() => this._muteAll(t, s > 0)}>
          ${s > 0 ? "Mute all" : "Play on all"}
        </button>
      </div>
      ${e.presets.length ? h`<div class="presets">
            ${e.presets.map(
      (o) => h`<button class=${y({ preset: !0, active: r === o.name })} @click=${() => this.applyPreset(t, o)}>
                ${o.name}
              </button>`
    )}
          </div>` : u}
      <div class="speakers">
        ${e.master_volume ? this.renderMaster(t) : u}
        ${n.map((o) => this.renderSpeaker(o))}
      </div>
    `;
  }
  renderMaster(t) {
    const e = xe(t);
    return h`<div class=${y({ "speaker-row": !0, master: !0, on: e !== null })} title="Master volume: scales every speaker that is on">
      <span class="dot" role="img" aria-label="Master volume">${v.volume}</span>
      <span class="sp-name ellipsis">All</span>
      <div class="track-hit" @pointerdown=${(r) => this._masterDragStart(r, t)}>
        <div class="track"><div class="fill" style=${N({ width: `${e ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${e ?? "–"}</span>
    </div>`;
  }
  renderSpeaker(t) {
    const e = t.available ? t.notInGroup ? "Not in the Cast group: add it in the Google Home app" : t.standby ? "Idle" : "Toggle speaker" : "Unavailable";
    return h`<div
      class=${y({ "speaker-row": !0, on: t.on, unavailable: !t.available, standby: t.standby, orphan: t.notInGroup })}
      title=${e}
    >
      <button class="dot" title=${e} ?disabled=${!t.available} @click=${() => this._toggle(t)}>${v.speaker}</button>
      <span class="sp-name ellipsis">${t.name}</span>
      <div class="track-hit" @pointerdown=${(s) => this._dragStart(s, t)}>
        <div class="track"><div class="fill" style=${N({ width: `${t.on ? t.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${t.notInGroup ? "n/a" : t.standby ? "–" : t.vol}</span>
    </div>`;
  }
  renderPicker(t) {
    if (!this._pickerOpen) return u;
    const e = () => this._pickerOpen = !1;
    return h`<div class="scrim" @click=${e}>
      <div class="sheet" @click=${(s) => s.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-title">Play on</span>
          <button class="sheet-done" @click=${e}>Done</button>
        </div>
        <div class="sheet-list">
          ${t.map(
      (s) => h`<button class=${y({ "sheet-row": !0, on: s.on })} ?disabled=${!s.available} @click=${() => this._toggle(s)}>
              <span class="check">${v.check}</span>
              <span class="sheet-name ellipsis">${s.name}</span>
              <span class="sheet-kind">${s.available ? s.notInGroup ? "not in group" : s.standby ? "idle" : s.on ? `${s.vol}` : "muted" : "offline"}</span>
            </button>`
    )}
        </div>
      </div>
    </div>`;
  }
  renderToast() {
    return this._toast ? h`<div class="toast">${this._toast}</div>` : u;
  }
  renderArt(t, e, s, r, n = !1) {
    const o = !!e && !this._broken.has(s);
    return h`<div class=${y({ art: !0, [t]: !0, pulse: n })}>
      <div class="stripes"></div>
      ${o ? h`<img
            src=${e}
            alt=""
            loading="lazy"
            @load=${(l) => l.target.classList.add("loaded")}
            @error=${() => this._imgBroken(s)}
          />` : h`<div class="art-label">ART ${String(r + 1).padStart(2, "0")}</div>`}
    </div>`;
  }
  renderPlaylists(t) {
    return h`<div class="playlists-area">${this._renderPlaylistsInner(t)}</div>`;
  }
  _renderPlaylistsInner(t) {
    if (t.status === "error" && !t.playlists.length)
      return h`<div class="pl-msg">
        <span>${t.error || "Could not load playlists"}</span>
        <button class="text-btn" @click=${t.onRetry}>Retry</button>
      </div>`;
    if (t.status === "ready" && !t.playlists.length) return h`<div class="pl-msg">No playlists yet</div>`;
    if (t.status !== "ready" && !t.playlists.length) {
      const s = t.layout === "list" ? Math.min(t.count, 10) : t.count, r = Array.from({ length: s }, (n, o) => o);
      return t.layout === "list" ? h`<div class="list">
            ${r.map(
        (n) => h`<div class=${y({ "list-row": !0, first: n === 0 })}>
                ${this.renderArt("list-art", null, `ph${n}`, n, !0)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`
      )}
          </div>` : h`<div class="tiles" style=${N({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
            ${r.map(
        (n) => h`<div class="tile">${this.renderArt("tile-art", null, `ph${n}`, n, !0)}<span class="tile-name">&nbsp;</span></div>`
      )}
          </div>`;
    }
    const e = t.playlists.slice(0, t.count);
    return t.layout === "list" ? h`<div class="list">
        ${e.map(
      (s, r) => h`<button class=${y({ "list-row": !0, first: r === 0, active: s.uri === t.activeUri })} @click=${() => t.onPlay(s)}>
            ${this.renderArt("list-art", s.image, s.uri, r)}
            <span class="list-name ellipsis">${s.name}</span>
            <span class="list-play">${v.playSmall}</span>
          </button>`
    )}
      </div>` : h`<div class="tiles" style=${N({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
      ${e.map(
      (s, r) => h`<button class=${y({ tile: !0, active: s.uri === t.activeUri })} title=${s.name} @click=${() => t.onPlay(s)}>
          <div class="tile-art-wrap" style="position:relative;width:100%">
            ${this.renderArt("tile-art", s.image, s.uri, r)}
            <div class="ring"></div>
          </div>
          <span class="tile-name ellipsis">${s.name}</span>
        </button>`
    )}
    </div>`;
  }
  renderNowBar(t, e, s) {
    const r = this.position(t, e), n = t.duration ?? 0, o = n > 0 ? r / n * 100 : 0, l = t.found && (t.state === "unavailable" || t.state === "unknown");
    let a = s.title ?? t.title;
    s.title || (t.found ? l ? a = "Player unavailable" : a || (a = t.state === "playing" ? "Playing" : t.state === "paused" ? "Paused" : "Nothing playing") : a = "Player not found");
    const c = s.subtitle ?? t.artist, p = s.disabled || !t.found || l, d = !p && n > 0;
    return h`<div class=${y({ now: !0, paused: !t.playing && !s.busy, busy: !!s.busy })}>
      <div class="now-row">
        ${this.renderArt("now-art", t.art, `now:${t.art ?? ""}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            ${s.busy ? h`<span class="spinner" aria-label="Starting"></span>` : h`<div class="eq"><div></div><div></div><div></div></div>`}
            <span class="now-title ellipsis">${a}</span>
          </div>
          <span class="now-artist ellipsis">${c}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${p} @click=${() => this.run(s.onPrev())}>${v.prev}</button>
          <button class="play" title=${t.playing ? "Pause" : "Play"} ?disabled=${p} @click=${() => this.run(s.onPlayPause())}>
            ${t.playing ? v.pause : v.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${p} @click=${() => this.run(s.onNext())}>${v.next}</button>
        </div>
      </div>
      <div class=${y({ "progress-hit": !0, disabled: !d })} @pointerdown=${(f) => d && this._seekStart(f, t, s.onSeek)}>
        <div class="progress"><div class="progress-fill" style=${N({ width: `${o.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${xt(r)}</span><span>${n > 0 ? `-${xt(n - r)}` : "–:––"}</span></div>
      </div>
    </div>`;
  }
};
lt.styles = Se;
let V = lt;
Bt([
  b()
], V.prototype, "_pickerOpen");
Bt([
  b()
], V.prototype, "_toast");
const Oe = 300 * 1e3, At = /* @__PURE__ */ new Map(), Ie = {
  last_played: "last_played_desc",
  play_count: "play_count_desc"
};
async function je(i) {
  const t = await i.callWS({ type: "config_entries/get", domain: "music_assistant" }), e = Array.isArray(t) ? t : [], s = e.find((r) => r.state === "loaded") ?? e[0];
  if (!s) throw new Error("Music Assistant integration not found");
  return s.entry_id;
}
function Ne(i) {
  if (!i) return null;
  if (typeof i == "string") {
    const t = i.trim();
    return t || null;
  }
  if (typeof i == "object") {
    const t = i;
    for (const e of ["url", "path"]) {
      const s = t[e];
      if (typeof s == "string" && /^(https?:)?\/\//.test(s)) return s;
    }
  }
  return null;
}
function He(i) {
  if (!Array.isArray(i)) return [];
  const t = [];
  for (const e of i) {
    if (!e || typeof e != "object") continue;
    const s = e;
    typeof s.uri != "string" || typeof s.name != "string" || !s.uri || t.push({ uri: s.uri, name: s.name, image: Ne(s.image) });
  }
  return t;
}
function Re(i, t, e) {
  return `${i}|${t}|${e}`;
}
async function De(i, t) {
  const e = Re(t.entryId, t.sort, t.limit), s = At.get(e);
  if (!t.force && s && Date.now() - s.at < Oe) return s.items;
  const r = await i.callService(
    "music_assistant",
    "get_library",
    { config_entry_id: t.entryId, media_type: "playlist", order_by: Ie[t.sort], limit: t.limit },
    void 0,
    !1,
    !0
  ), n = (r && typeof r == "object" ? r.response : void 0) ?? {}, o = He(n.items);
  return At.set(e, { at: Date.now(), items: o }), o;
}
const Le = (i, t, e) => i.callService(
  "music_assistant",
  "play_media",
  { media_id: e, media_type: "playlist", enqueue: "replace" },
  { entity_id: t }
);
var qe = Object.defineProperty, Be = Object.getOwnPropertyDescriptor, Q = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Be(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && qe(t, e, r), r;
};
const Ve = [
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
      { name: "tile_columns", selector: { number: { min: 2, max: 8, mode: "box" } } },
      { name: "tile_columns_wide", selector: { number: { min: 2, max: 8, mode: "box" } } },
      { name: "speaker_count", selector: { number: { min: 1, max: 50, mode: "box" } } },
      { name: "preset_tolerance", selector: { number: { min: 0, max: 50, mode: "box" } } }
    ]
  },
  { name: "layout", selector: { select: { mode: "dropdown", options: [{ value: "vertical", label: "Vertical" }, { value: "horizontal", label: "Horizontal (playlists left, speakers right)" }, { value: "auto", label: "Auto (horizontal when wide)" }] } } },
  { name: "default_preset", selector: { text: {} } },
  { name: "master_volume", selector: { boolean: {} } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } },
  { name: "ma_config_entry_id", selector: { text: {} } }
], We = {
  group_entity: "Music Assistant player for the Cast group",
  speakers: "Speakers (Google Cast entities)",
  playlist_layout: "Playlist layout",
  playlist_sort: "Playlist order",
  playlist_count: "Playlists to show",
  tile_columns: "Playlists per row",
  tile_columns_wide: "Playlists per row in two-column layout",
  speaker_count: "Speaker rows to show",
  preset_tolerance: "Preset match tolerance",
  layout: "Card layout",
  default_preset: "Preset applied on a fresh start (name)",
  master_volume: "Show master volume row",
  title: "Title",
  accent: "Accent color (CSS)",
  ma_config_entry_id: "Music Assistant config entry id (optional)"
};
let z = class extends T {
  constructor() {
    super(...arguments), this._helpersLoaded = !1;
  }
  setConfig(i) {
    this._config = i;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadHaForm();
  }
  /** ha-form is lazy-loaded by the frontend; loading the entities card editor pulls it in. */
  async _loadHaForm() {
    var i, t, e;
    if (customElements.get("ha-form")) {
      this._helpersLoaded = !0;
      return;
    }
    try {
      const s = await ((i = window.loadCardHelpers) == null ? void 0 : i.call(window)), r = s == null ? void 0 : s.createCardElement({ type: "entities", entities: [] });
      (e = r == null ? void 0 : (t = r.constructor).getConfigElement) == null || e.call(t), await customElements.whenDefined("ha-form");
    } catch {
    }
    this._helpersLoaded = !0;
  }
  _formData() {
    const i = this._config ?? {}, t = Array.isArray(i.speakers) ? i.speakers.map((e) => typeof e == "string" ? e : e == null ? void 0 : e.entity).filter(Boolean) : [];
    return { ...i, speakers: t, master_volume: i.master_volume !== !1 };
  }
  _valueChanged(i) {
    if (i.stopPropagation(), !this._config) return;
    const t = i.detail.value, e = this._config, s = /* @__PURE__ */ new Map();
    for (const o of e.speakers ?? []) typeof o == "object" && (o != null && o.name) && s.set(o.entity, o.name);
    const r = (t.speakers ?? []).map((o) => s.has(o) ? { entity: o, name: s.get(o) } : o), n = { ...e, ...t, speakers: r };
    for (const o of Object.keys(n)) {
      const l = n[o];
      (l === "" || l === void 0 || l === null) && delete n[o];
    }
    this._config = n, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: n }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._helpersLoaded ? u : h`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${Ve}
        .computeLabel=${(i) => We[i.name] ?? i.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets (Focus, Chill, Dinner, Party…) are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
z.styles = Pt`
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
Q([
  It({ attribute: !1 })
], z.prototype, "hass", 2);
Q([
  b()
], z.prototype, "_config", 2);
Q([
  b()
], z.prototype, "_helpersLoaded", 2);
z = Q([
  Ot("spotify-media-card-editor")
], z);
var Fe = Object.defineProperty, Ge = Object.getOwnPropertyDescriptor, I = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Ge(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && Fe(t, e, r), r;
};
const Ke = 3e3;
let P = class extends V {
  constructor() {
    super(...arguments), this._playlists = [], this._plStatus = "idle", this._plError = "", this._activeUri = null, this._entryId = "", this._fetchSeq = 0;
  }
  get section() {
    return this._config;
  }
  get groupEntity() {
    var i;
    return (i = this._config) == null ? void 0 : i.group_entity;
  }
  get accent() {
    var i;
    return ((i = this._config) == null ? void 0 : i.accent) ?? "";
  }
  // ---- HA card API -------------------------------------------------------
  static getConfigElement() {
    return document.createElement("spotify-media-card-editor");
  }
  static getStubConfig(i) {
    const t = Object.values((i == null ? void 0 : i.states) ?? {}).filter((n) => n.entity_id.startsWith("media_player.")), e = t.filter((n) => n.attributes.mass_player_id !== void 0), s = e.find((n) => n.attributes.mass_player_type === "group") ?? e[0], r = t.filter((n) => n.attributes.mass_player_id === void 0 && typeof n.attributes.volume_level == "number").slice(0, 4);
    return {
      group_entity: (s == null ? void 0 : s.entity_id) ?? "media_player.your_cast_group",
      speakers: r.length ? r.map((n) => n.entity_id) : ["media_player.living_room"],
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  setConfig(i) {
    const t = this._config, e = ye(i);
    this._config = e, this._activeUri = this._loadActive(e.group_entity), (!t || t.playlist_sort !== e.playlist_sort || t.playlist_count !== e.playlist_count || t.ma_config_entry_id !== e.ma_config_entry_id) && (this._entryId = e.ma_config_entry_id, this._plStatus = "idle", this._hass && this._ensurePlaylists());
  }
  hassChanged(i, t) {
    this._syncActiveWithPlayer(i), t && this._plStatus === "idle" && this._ensurePlaylists();
  }
  connectedCallback() {
    super.connectedCallback(), this._hass && this._config && this._plStatus !== "loading" && this._ensurePlaylists();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._refetchTimer && window.clearTimeout(this._refetchTimer);
  }
  // ---- playlists ---------------------------------------------------------
  async _ensurePlaylists(i = !1) {
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const s = ++this._fetchSeq;
    this._playlists.length || (this._plStatus = "loading");
    try {
      this._entryId || (this._entryId = await je(t));
      const r = await De(t, { entryId: this._entryId, sort: e.playlist_sort, limit: e.playlist_count, force: i });
      if (s !== this._fetchSeq) return;
      this._playlists = r, this._plStatus = "ready", this._plError = "";
    } catch (r) {
      if (s !== this._fetchSeq) return;
      this._plStatus = "error", this._plError = Nt(r);
    }
  }
  _play(i) {
    var r;
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const s = (r = t.states[e.group_entity]) == null ? void 0 : r.state;
    if (!s || s === "unavailable" || s === "unknown") {
      this.showToast(`${e.group_entity} is unavailable. Check the Music Assistant integration.`);
      return;
    }
    this._activeUri = i.uri, this._saveActive(e.group_entity, i.uri), this.applyDefaultPresetIfCold(t, $e(t, e.group_entity)), this.run(
      Le(t, e.group_entity, i.uri).then(() => {
        this._refetchTimer && window.clearTimeout(this._refetchTimer), this._refetchTimer = window.setTimeout(() => void this._ensurePlaylists(!0), Ke);
      })
    );
  }
  _storageKey(i) {
    return `spotify-media-card:${i}`;
  }
  _loadActive(i) {
    try {
      return window.localStorage.getItem(this._storageKey(i));
    } catch {
      return null;
    }
  }
  _saveActive(i, t) {
    try {
      t ? window.localStorage.setItem(this._storageKey(i), t) : window.localStorage.removeItem(this._storageKey(i));
    } catch {
    }
  }
  /** Forget the highlighted playlist once the player has clearly stopped. */
  _syncActiveWithPlayer(i) {
    if (!this._config || !this._activeUri) return;
    const t = i.states[this._config.group_entity];
    (!t || ["off", "idle", "unavailable", "unknown", "standby"].includes(t.state)) && (this._activeUri = null, this._saveActive(this._config.group_entity, null));
  }
  // ---- render ------------------------------------------------------------
  render() {
    const i = this._config, t = this._hass;
    if (!i) return u;
    if (!t) return h`<ha-card><div class="card"></div></ha-card>`;
    const e = Date.now(), s = this.speakers(t, e), r = ve(t, i.group_entity), n = this._playlists.find((c) => c.uri === this._activeUri) ?? null, o = r.found && (r.state === "unavailable" || r.state === "unknown"), l = !r.found || o ? i.group_entity : [r.artist, n == null ? void 0 : n.name].filter(Boolean).join(" · "), a = h`
      ${this.renderHeader(i.title, s)}
      ${this.renderPlaylists({
      layout: i.playlist_layout,
      count: i.playlist_count,
      columns: i.tile_columns,
      columnsWide: i.tile_columns_wide,
      playlists: this._playlists,
      status: this._plStatus,
      error: this._plError,
      activeUri: this._activeUri,
      onPlay: (c) => this._play(c),
      onRetry: () => void this._ensurePlaylists(!0)
    })}
      ${this.renderNowBar(r, e, {
      subtitle: l,
      onPrev: () => Me(t, i.group_entity),
      onPlayPause: () => Pe(t, i.group_entity),
      onNext: () => Ce(t, i.group_entity),
      onSeek: (c) => Te(t, i.group_entity, c)
    })}
    `;
    return this.renderShell(a, this.renderSpeakerSection(s), [this.renderPicker(s), this.renderToast()]);
  }
};
I([
  b()
], P.prototype, "_config", 2);
I([
  b()
], P.prototype, "_playlists", 2);
I([
  b()
], P.prototype, "_plStatus", 2);
I([
  b()
], P.prototype, "_plError", 2);
I([
  b()
], P.prototype, "_activeUri", 2);
P = I([
  Ot("spotify-media-card")
], P);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "spotify-media-card",
  name: "Spotify Media Card (Music Assistant)",
  description: "Start Spotify playlists on multi-room Chromecast speakers through Music Assistant.",
  preview: !1
});
export {
  P as SpotifyMediaCard
};
