/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, lt = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), yt = /* @__PURE__ */ new WeakMap();
let Nt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (lt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = yt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && yt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Jt = (i) => new Nt(typeof i == "string" ? i : i + "", void 0, ct), Rt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new Nt(e, i, ct);
}, Qt = (i, t) => {
  if (lt) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = Z.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, mt = lt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Jt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: te, defineProperty: ee, getOwnPropertyDescriptor: se, getOwnPropertyNames: ie, getOwnPropertySymbols: ne, getPrototypeOf: re } = Object, A = globalThis, _t = A.trustedTypes, oe = _t ? _t.emptyScript : "", et = A.reactiveElementPolyfillSupport, L = (i, t) => i, K = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? oe : null;
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
} }, pt = (i, t) => !te(i, t), gt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: pt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = gt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && ee(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = se(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const a = n == null ? void 0 : n.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? gt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const e = this.properties, s = [...ie(e), ...ne(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(mt(n));
    } else t !== void 0 && e.push(mt(t));
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
    return Qt(t, this.constructor.elementStyles), t;
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
    var r;
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const o = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : K).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = s.getPropertyOptions(n), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : K;
      this._$Em = n;
      const c = l.fromAttribute(e, a.type);
      this[n] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (r = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? pt)(r, e) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, o] of n) {
        const { wrapped: a } = o, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[L("elementProperties")] = /* @__PURE__ */ new Map(), O[L("finalized")] = /* @__PURE__ */ new Map(), et == null || et({ ReactiveElement: O }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, vt = (i) => i, X = B.trustedTypes, bt = X ? X.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, jt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Ht = "?" + k, ae = `<${Ht}>`, U = document, q = () => U.createComment(""), F = (i) => i === null || typeof i != "object" && typeof i != "function", ht = Array.isArray, le = (i) => ht(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", st = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xt = /-->/g, $t = />/g, E = RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wt = /'/g, kt = /"/g, Dt = /^(?:script|style|textarea|title)$/i, It = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), d = It(1), b = It(2), S = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), At = /* @__PURE__ */ new WeakMap(), T = U.createTreeWalker(U, 129);
function Lt(i, t) {
  if (!ht(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return bt !== void 0 ? bt.createHTML(t) : t;
}
const ce = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = D;
  for (let a = 0; a < e; a++) {
    const l = i[a];
    let c, h, p = -1, u = 0;
    for (; u < l.length && (o.lastIndex = u, h = o.exec(l), h !== null); ) u = o.lastIndex, o === D ? h[1] === "!--" ? o = xt : h[1] !== void 0 ? o = $t : h[2] !== void 0 ? (Dt.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = E) : h[3] !== void 0 && (o = E) : o === E ? h[0] === ">" ? (o = n ?? D, p = -1) : h[1] === void 0 ? p = -2 : (p = o.lastIndex - h[2].length, c = h[1], o = h[3] === void 0 ? E : h[3] === '"' ? kt : wt) : o === kt || o === wt ? o = E : o === xt || o === $t ? o = D : (o = E, n = void 0);
    const m = o === E && i[a + 1].startsWith("/>") ? " " : "";
    r += o === D ? l + ae : p >= 0 ? (s.push(c), l.slice(0, p) + jt + l.slice(p) + k + m) : l + k + (p === -2 ? a : m);
  }
  return [Lt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class V {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, l = this.parts, [c, h] = ce(t, e);
    if (this.el = V.createElement(c, s), T.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = T.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(jt)) {
          const u = h[o++], m = n.getAttribute(p).split(k), w = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: r, name: w[2], strings: m, ctor: w[1] === "." ? he : w[1] === "?" ? de : w[1] === "@" ? ue : Q }), n.removeAttribute(p);
        } else p.startsWith(k) && (l.push({ type: 6, index: r }), n.removeAttribute(p));
        if (Dt.test(n.tagName)) {
          const p = n.textContent.split(k), u = p.length - 1;
          if (u > 0) {
            n.textContent = X ? X.emptyScript : "";
            for (let m = 0; m < u; m++) n.append(p[m], q()), T.nextNode(), l.push({ type: 2, index: ++r });
            n.append(p[u], q());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ht) l.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(k, p + 1)) !== -1; ) l.push({ type: 7, index: r }), p += k.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = U.createElement("template");
    return s.innerHTML = t, s;
  }
}
function R(i, t, e = i, s) {
  var o, a;
  if (t === S) return t;
  let n = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const r = F(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = R(i, n._$AS(i, t.values), n, s)), t;
}
class pe {
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
    const { el: { content: e }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? U).importNode(e, !0);
    T.currentNode = n;
    let r = T.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new W(r, r.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (c = new fe(r, this, t)), this._$AV.push(c), l = s[++a];
      }
      o !== (l == null ? void 0 : l.index) && (r = T.nextNode(), o++);
    }
    return T.currentNode = U, n;
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
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = R(this, t, e), F(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : le(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && F(this._$AH) ? this._$AA.nextSibling.data = t : this.T(U.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = V.createElement(Lt(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const o = new pe(n, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = At.get(t.strings);
    return e === void 0 && At.set(t.strings, e = new V(t)), e;
  }
  k(t) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new W(this.O(q()), this.O(q()), this, this.options)) : s = e[n], s._$AI(r), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = vt(t).nextSibling;
      vt(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class Q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, r) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = f;
  }
  _$AI(t, e = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = R(this, t, e, 0), o = !F(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = r[0], l = 0; l < r.length - 1; l++) c = R(this, a[s + l], e, l), c === S && (c = this._$AH[l]), o || (o = !F(c) || c !== this._$AH[l]), c === f ? t = f : t !== f && (t += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class he extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class de extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class ue extends Q {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = R(this, t, e, 0) ?? f) === S) return;
    const s = this._$AH, n = t === f && s !== f || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== f && (s === f || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class fe {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const it = B.litHtmlPolyfillSupport;
it == null || it(V, W), (B.litHtmlVersions ?? (B.litHtmlVersions = [])).push("3.3.3");
const ye = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = n = new W(t.insertBefore(q(), r), r, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
let N = class extends O {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ye(e, this.renderRoot, this.renderOptions);
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
    return S;
  }
};
var zt;
N._$litElement$ = !0, N.finalized = !0, (zt = M.litElementHydrateSupport) == null || zt.call(M, { LitElement: N });
const nt = M.litElementPolyfillSupport;
nt == null || nt({ LitElement: N });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: pt }, _e = (i = me, t, e) => {
  const { kind: s, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, i, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, i, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, i, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function qt(i) {
  return (t, e) => typeof e == "object" ? _e(i, t, e) : ((s, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(i) {
  return qt({ ...i, state: !0, attribute: !1 });
}
const ge = "oklch(0.62 0.16 285)";
function y(i, t) {
  throw new Error(`${i}: ${t}`);
}
function ot(i) {
  return typeof i == "string" && /^media_player\.[a-z0-9_]+$/.test(i);
}
function J(i, t, e, s, n, r) {
  if (t == null || t === "") return r;
  const o = typeof t == "string" ? Number(t) : t;
  return (typeof o != "number" || !Number.isInteger(o) || o < s || o > n) && y(i, `${e} must be an integer between ${s} and ${n}`), o;
}
function ve(i, t) {
  (!Array.isArray(t) || t.length === 0) && y(i, "speakers must be a non-empty list of Google Cast media_player entities");
  const e = [], s = /* @__PURE__ */ new Set();
  for (const n of t) {
    const r = typeof n == "string" ? n : n == null ? void 0 : n.entity;
    ot(r) || y(i, `speaker "${String(r)}" is not a media_player entity`), s.has(r) && y(i, `speaker ${r} is listed twice`), s.add(r);
    const o = typeof n == "object" && n && typeof n.name == "string" && n.name.trim() ? n.name.trim() : void 0;
    e.push(o ? { entity: r, name: o } : { entity: r });
  }
  return e;
}
function be(i, t, e) {
  if (t == null) return [];
  Array.isArray(t) || y(i, "presets must be a list");
  const s = new Set(e.map((r) => r.entity)), n = /* @__PURE__ */ new Set();
  return t.map((r, o) => {
    const a = typeof (r == null ? void 0 : r.name) == "string" ? r.name.trim() : "";
    a || y(i, `preset #${o + 1} needs a name`), n.has(a) && y(i, `preset "${a}" is defined twice`), n.add(a);
    const l = r.levels ?? {};
    (typeof l != "object" || Array.isArray(l)) && y(i, `preset "${a}": levels must be a map of entity -> volume`);
    const c = {};
    for (const [h, p] of Object.entries(l)) {
      s.has(h) || y(i, `preset "${a}": ${h} is not in speakers`);
      const u = typeof p == "string" ? Number(p) : p;
      (typeof u != "number" || !Number.isInteger(u) || u < 0 || u > 100) && y(i, `preset "${a}": volume for ${h} must be an integer 0-100`), c[h] = u;
    }
    return { name: a, levels: c };
  });
}
function xe(i, t) {
  const e = ve(i, t.speakers), s = be(i, t.presets, e), n = typeof t.default_preset == "string" ? t.default_preset.trim() : "";
  return n && !s.some((r) => r.name === n) && y(i, `default_preset "${n}" is not one of the presets`), {
    speakers: e,
    presets: s,
    speaker_count: J(i, t.speaker_count, "speaker_count", 1, 50, e.length),
    preset_tolerance: J(i, t.preset_tolerance, "preset_tolerance", 0, 50, 3),
    master_volume: t.master_volume !== !1,
    default_preset: n
  };
}
function $e(i, t) {
  const e = t.playlist_layout ?? "tiles";
  e !== "tiles" && e !== "list" && y(i, 'playlist_layout must be "tiles" or "list"');
  const s = t.playlist_sort ?? "last_played";
  return s !== "last_played" && s !== "play_count" && y(i, 'playlist_sort must be "last_played" or "play_count"'), {
    playlist_layout: e,
    playlist_sort: s,
    playlist_count: J(i, t.playlist_count, "playlist_count", 1, 50, e === "list" ? 10 : 6),
    tile_columns: J(i, t.tile_columns, "tile_columns", 2, 6, 3)
  };
}
function rt(i, t) {
  return typeof i == "string" && i.trim() ? i.trim() : t;
}
const C = "spotifyplus-media-card";
function we(i) {
  (!i || typeof i != "object") && y(C, "invalid configuration");
  const t = i.spotifyplus_entity ?? "media_player.spotifyplus";
  ot(t) || y(C, "spotifyplus_entity must be the SpotifyPlus media_player entity"), ot(i.cast_group_entity) || y(C, "cast_group_entity must be the Google Cast media_player entity of your speaker group");
  const e = rt(i.device_name, "");
  e || y(C, 'device_name is required (the Spotify Connect name of your speaker group, e.g. "Alla")');
  const s = i.control_via ?? "cast";
  return s !== "cast" && s !== "spotifyplus" && y(C, 'control_via must be "cast" or "spotifyplus"'), {
    type: i.type,
    spotifyplus_entity: t,
    cast_group_entity: i.cast_group_entity,
    device_name: e,
    control_via: s,
    shuffle: i.shuffle === !0,
    ...xe(C, i),
    ...$e(C, i),
    history_key: rt(i.history_key, "spotifyplus-media-card"),
    fill_with_favorites: i.fill_with_favorites !== !1,
    title: typeof i.title == "string" ? i.title : "Listening",
    accent: rt(i.accent, ge)
  };
}
const ke = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Ae(i, t, e) {
  var n;
  const s = ((n = i.states[e]) == null ? void 0 : n.state) === "playing";
  return t.map((r) => {
    const o = i.states[r.entity], a = (o == null ? void 0 : o.attributes) ?? {}, l = !!o && !ke.has(o.state), c = typeof a.volume_level == "number", h = c ? a.volume_level : 0, p = a.is_volume_muted === !0, u = l && !c, m = typeof a.friendly_name == "string" ? a.friendly_name : void 0;
    return {
      entity: r.entity,
      name: r.name ?? m ?? r.entity.replace("media_player.", ""),
      vol: Math.round(h * 100),
      on: l && !u && !p,
      available: l,
      standby: u,
      notInGroup: s && u
    };
  });
}
function Se(i, t) {
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
  const s = e.attributes, n = (r) => typeof r == "number" && Number.isFinite(r) ? r : null;
  return {
    found: !0,
    state: e.state,
    playing: e.state === "playing",
    title: typeof s.media_title == "string" ? s.media_title : "",
    artist: typeof s.media_artist == "string" ? s.media_artist : "",
    art: typeof s.entity_picture == "string" && s.entity_picture ? s.entity_picture : null,
    duration: n(s.media_duration),
    position: n(s.media_position),
    positionUpdatedAt: typeof s.media_position_updated_at == "string" ? s.media_position_updated_at : null
  };
}
function Pe(i, t, e) {
  const s = i.filter((n) => n.available && !n.standby);
  if (!s.length) return null;
  for (const n of t) {
    let r = !0;
    for (const o of s) {
      const a = n.levels[o.entity];
      if (a === void 0) {
        if (o.on) {
          r = !1;
          break;
        }
      } else if (!o.on || Math.abs(o.vol - a) > e) {
        r = !1;
        break;
      }
    }
    if (r) return n.name;
  }
  return null;
}
function Ee(i) {
  const t = i.filter((e) => e.on);
  return t.length ? Math.round(t.reduce((e, s) => e + s.vol, 0) / t.length) : null;
}
function St(i, t) {
  const e = /* @__PURE__ */ new Map(), s = i.filter((o) => o.on);
  if (!s.length) return e;
  const n = s.reduce((o, a) => o + a.vol, 0) / s.length, r = Math.max(0, Math.min(100, t));
  for (const o of s) {
    const a = n > 0 && o.vol > 0 ? o.vol * r / n : r;
    e.set(o.entity, Math.max(0, Math.min(100, Math.round(a))));
  }
  return e;
}
function Ce(i, t) {
  const e = i.states[t];
  return e ? !["playing", "paused", "buffering", "on"].includes(e.state) : !0;
}
function Te(i) {
  const t = i.filter((e) => e.on);
  if (t.length === 0) {
    const e = i.filter((s) => s.available);
    return e.length ? e.every((s) => s.standby) ? "Speakers idle" : "No speakers selected" : "No speakers available";
  }
  return t.length === 1 ? t[0].name : `${t[0].name} + ${t.length - 1} more`;
}
function Me(i, t) {
  var s;
  const e = [(s = i.themes) != null && s.darkMode ? "d" : "l"];
  for (const n of t) {
    const r = i.states[n];
    e.push(r ? r.last_updated : "-");
  }
  return e.join("|");
}
function at(i) {
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
const Ft = { ATTRIBUTE: 1 }, Vt = (i) => (...t) => ({ _$litDirective$: i, values: t });
let Gt = class {
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
const v = Vt(class extends Gt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Ft.ATTRIBUTE || i.name !== "class" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return " " + Object.keys(i).filter((t) => i[t]).join(" ") + " ";
  }
  update(i, [t]) {
    var s, n;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), i.strings !== void 0 && (this.nt = new Set(i.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in t) t[r] && !((s = this.nt) != null && s.has(r)) && this.st.add(r);
      return this.render(t);
    }
    const e = i.element.classList;
    for (const r of this.st) r in t || (e.remove(r), this.st.delete(r));
    for (const r in t) {
      const o = !!t[r];
      o === this.st.has(r) || (n = this.nt) != null && n.has(r) || (o ? (e.add(r), this.st.add(r)) : (e.remove(r), this.st.delete(r)));
    }
    return S;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wt = "important", Ue = " !" + Wt, I = Vt(class extends Gt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Ft.ATTRIBUTE || i.name !== "style" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
      const n = t[s];
      if (n != null) {
        this.ft.add(s);
        const r = typeof n == "string" && n.endsWith(Ue);
        s.includes("-") || r ? e.setProperty(s, r ? n.slice(0, -11) : n, r ? Wt : "") : e[s] = n;
      }
    }
    return S;
  }
}), Oe = Rt`
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
`, x = {
  airplay: b`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 15a9 9 0 0 1 16 0"></path><path d="M12 15l4 6H8l4-6z" fill="currentColor" stroke="none"></path></svg>`,
  play: b`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;"><path d="M7 4.5 19.5 12 7 19.5z"></path></svg>`,
  playSmall: b`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 19.5 12 7 19.5z"></path></svg>`,
  pause: b`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4.2" height="15" rx="1.2"></rect><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"></rect></svg>`,
  prev: b`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2.2v14H6z"></path><path d="M19 5.6v12.8L9.6 12z"></path></svg>`,
  next: b`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.8 5H18v14h-2.2z"></path><path d="M5 5.6 14.4 12 5 18.4z"></path></svg>`,
  speaker: b`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2.5" width="14" height="19" rx="3.5"></rect><circle cx="12" cy="15" r="3.2"></circle><circle cx="12" cy="7.5" r="1.1" fill="currentColor"></circle></svg>`,
  volume: b`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"></path><path d="M16 8.5a5 5 0 0 1 0 7"></path><path d="M18.5 5.5a9 9 0 0 1 0 13"></path></svg>`,
  check: b`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4.5 4.5L19 7"></path></svg>`
};
function ze(i, t) {
  if (i.position === null) return 0;
  let e = i.position;
  if (i.playing && i.positionUpdatedAt) {
    const s = Date.parse(i.positionUpdatedAt);
    Number.isFinite(s) && (e += Math.max(0, (t - s) / 1e3));
  }
  return i.duration !== null && (e = Math.min(e, i.duration)), Math.max(0, e);
}
const H = (i, t, e, s) => i.callService("media_player", t, s, { entity_id: e }), Ne = (i, t) => H(i, "media_play_pause", t), Re = (i, t) => H(i, "media_next_track", t), je = (i, t) => H(i, "media_previous_track", t), He = (i, t, e) => H(i, "media_seek", t, { seek_position: Math.max(0, Math.round(e)) }), Yt = (i, t, e) => H(i, "volume_set", t, { volume_level: Math.max(0, Math.min(100, e)) / 100 }), z = (i, t, e) => H(i, "volume_mute", t, { is_volume_muted: e });
async function De(i, t, e) {
  const s = [], n = [];
  for (const r of t) {
    if (!r.available) continue;
    const o = e.levels[r.entity];
    if (o === void 0) {
      (r.on || r.standby) && n.push(r.entity);
      continue;
    }
    r.on || s.push(z(i, r.entity, !1)), s.push(Yt(i, r.entity, o));
  }
  n.length && s.push(z(i, n, !0)), await Promise.all(s);
}
function Pt(i) {
  const t = Math.max(0, Math.floor(i)), e = Math.floor(t / 60), s = t % 60;
  return `${e}:${String(s).padStart(2, "0")}`;
}
function Et(i) {
  return Math.max(0, Math.min(1, i));
}
function Ct(i, t) {
  let e = 0, s, n = !1, r;
  const o = () => {
    r = void 0, n && (n = !1, e = Date.now(), i(s));
  };
  return (a) => {
    const l = Date.now(), c = l - e;
    if (c >= t && !r) {
      e = l, i(a);
      return;
    }
    s = a, n = !0, r || (r = setTimeout(o, Math.max(0, t - c)));
  };
}
var Ie = Object.defineProperty, Zt = (i, t, e, s) => {
  for (var n = void 0, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = o(t, e, n) || n);
  return n && Ie(t, e, n), n;
};
const Y = 1500, Tt = 150, ft = class ft extends N {
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
    const n = [this.groupEntity ?? "", ...s.speakers.map((o) => o.entity), ...this.extraEntities()].filter(Boolean), r = Me(t, n);
    (r !== this._fp || e) && (this._fp = r, this.hassChanged(t, e), this.requestUpdate());
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
    var s, n;
    const e = ((n = (s = this._hass) == null ? void 0 : s.themes) == null ? void 0 : n.darkMode) ?? !0;
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
    return s ? Ae(t, s.speakers, this.groupEntity ?? "").map((n) => {
      let r = n;
      if (!r.notInGroup) if (r.standby) {
        const a = this._intent.get(r.entity);
        a && (r = { ...r, standby: !1, vol: a.vol ?? 0, on: a.on ?? !0 });
      } else
        this._intent.delete(r.entity);
      const o = this._overrides.get(r.entity);
      return !o || r.notInGroup ? r : e >= o.until ? (this._overrides.delete(r.entity), r) : { ...r, standby: !1, vol: o.vol ?? r.vol, on: o.on ?? r.on };
    }) : [];
  }
  _remember(t, e) {
    const s = this._intent.get(t) ?? {};
    this._intent.set(t, { ...s, ...e });
  }
  _bump(t, e, s = Y) {
    this._remember(t, e), this._overrides.set(t, { ...e, until: Date.now() + s }), this.requestUpdate(), window.setTimeout(() => this.requestUpdate(), s + 50);
  }
  _toggle(t) {
    !this._hass || !t.available || (this._bump(t.entity, { on: !t.on }), this.run(z(this._hass, t.entity, t.on)));
  }
  _muteAll(t, e) {
    if (!this._hass) return;
    const s = t.filter((n) => n.available).map((n) => n.entity);
    if (s.length) {
      for (const n of s) this._bump(n, { on: !e });
      this.run(z(this._hass, s, e));
    }
  }
  applyPreset(t, e) {
    if (this._hass) {
      for (const s of t) {
        if (!s.available) continue;
        const n = e.levels[s.entity];
        this._bump(s.entity, n === void 0 ? { on: !1 } : { on: !0, vol: n }, Y + 1e3);
      }
      this.run(De(this._hass, t, e));
    }
  }
  /** Apply the configured default preset if the group is cold and nothing was touched. */
  applyDefaultPresetIfCold(t, e) {
    const s = this.section;
    if (!(s != null && s.default_preset)) return;
    const n = s.presets.find((r) => r.name === s.default_preset);
    n && e && this._intent.size === 0 && this.applyPreset(this.speakers(t, Date.now()), n);
  }
  _sendVolume(t, e) {
    !this._hass || this._lastSent.get(t) === e || (this._lastSent.set(t, e), this.run(Yt(this._hass, t, e)));
  }
  _throttleFor(t) {
    let e = this._throttled.get(t);
    return e || (e = Ct((s) => this._sendVolume(t, s), Tt), this._throttled.set(t, e)), e;
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
    const n = (r) => {
      t.removeEventListener("pointermove", e), t.removeEventListener("pointerup", n), t.removeEventListener("pointercancel", n), s(r);
    };
    t.addEventListener("pointermove", e), t.addEventListener("pointerup", n), t.addEventListener("pointercancel", n);
  }
  _pct(t, e) {
    const s = t.getBoundingClientRect();
    return Math.round(Et((e.clientX - s.left) / s.width) * 100);
  }
  _dragStart(t, e) {
    const s = this._hass;
    if (!s || !e.available) return;
    const n = this._capture(t);
    e.on || this.run(z(s, e.entity, !1)), this._lastSent.delete(e.entity);
    const r = this._throttleFor(e.entity), o = (a) => {
      const l = this._pct(n, a);
      this._remember(e.entity, { vol: l, on: !0 }), this._overrides.set(e.entity, { vol: l, on: !0, until: 1 / 0 }), this.requestUpdate(), r(l);
    };
    this._track(n, o, (a) => {
      const l = this._pct(n, a);
      this._bump(e.entity, { vol: l, on: !0 }), this._sendVolume(e.entity, l);
    }), o(t);
  }
  _sendMaster(t, e) {
    for (const [s, n] of St(t, e)) this._sendVolume(s, n);
  }
  _masterDragStart(t, e) {
    const s = this._hass;
    if (!s) return;
    let n = e.filter((l) => l.on && l.available);
    if (!n.length) {
      if (n = e.filter((l) => l.available && !l.notInGroup).map((l) => ({ ...l, on: !0, vol: 0 })), !n.length) return;
      this.run(z(s, n.map((l) => l.entity), !1));
    }
    const r = this._capture(t);
    for (const l of n) this._lastSent.delete(l.entity);
    this._masterThrottle || (this._masterThrottle = Ct((l) => this._sendMaster(this._masterBase, l), Tt)), this._masterBase = n;
    const o = (l, c) => {
      for (const [h, p] of St(n, l))
        this._remember(h, { vol: p, on: !0 }), this._overrides.set(h, { vol: p, on: !0, until: c });
      this.requestUpdate();
    }, a = (l) => {
      const c = this._pct(r, l);
      o(c, 1 / 0), this._masterThrottle(c);
    };
    this._track(r, a, (l) => {
      const c = this._pct(r, l);
      o(c, Date.now() + Y), this._sendMaster(n, c), window.setTimeout(() => this.requestUpdate(), Y + 50);
    }), a(t);
  }
  // ---- seek --------------------------------------------------------------
  _seekStart(t, e, s) {
    if (!e.duration) return;
    const n = this._capture(t), r = e.duration, o = (l) => {
      const c = n.getBoundingClientRect();
      return Et((l.clientX - c.left) / c.width) * r;
    }, a = (l) => {
      this._seek = { pos: o(l), until: 1 / 0, stamp: e.positionUpdatedAt }, this.requestUpdate();
    };
    this._track(n, a, (l) => {
      const c = o(l);
      this._seek = { pos: c, until: Date.now() + 2500, stamp: e.positionUpdatedAt }, this.requestUpdate(), this.run(s(c));
    }), a(t);
  }
  position(t, e) {
    const s = this._seek;
    if (s) {
      if (e < s.until && s.stamp === t.positionUpdatedAt) return s.pos;
      this._seek = null;
    }
    return ze(t, e);
  }
  // ---- misc --------------------------------------------------------------
  run(t) {
    t && t.catch((e) => this.showToast(at(e)));
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
  renderHeader(t, e) {
    const s = e.filter((n) => n.on).length;
    return d`<div class="header">
      <div class="header-text">
        <span class="title">${t}</span>
        <span class="summary ellipsis">${Te(e)}</span>
      </div>
      <button class="pill" title="Choose speakers" @click=${() => this._pickerOpen = !this._pickerOpen}>
        ${x.airplay}<span>${s}</span>
      </button>
    </div>`;
  }
  renderSpeakerSection(t) {
    const e = this.section, s = t.filter((o) => o.on).length, n = Pe(t, e.presets, e.preset_tolerance), r = t.slice(0, e.speaker_count);
    return d`
      <div class="section-head">
        <span class="label">Speakers</span>
        <button class="text-btn" @click=${() => this._muteAll(t, s > 0)}>
          ${s > 0 ? "Mute all" : "Play on all"}
        </button>
      </div>
      ${e.presets.length ? d`<div class="presets">
            ${e.presets.map(
      (o) => d`<button class=${v({ preset: !0, active: n === o.name })} @click=${() => this.applyPreset(t, o)}>
                ${o.name}
              </button>`
    )}
          </div>` : f}
      <div class="speakers">
        ${e.master_volume ? this.renderMaster(t) : f}
        ${r.map((o) => this.renderSpeaker(o))}
      </div>
    `;
  }
  renderMaster(t) {
    const e = Ee(t);
    return d`<div class=${v({ "speaker-row": !0, master: !0, on: e !== null })} title="Master volume: scales every speaker that is on">
      <span class="dot" role="img" aria-label="Master volume">${x.volume}</span>
      <span class="sp-name ellipsis">All</span>
      <div class="track-hit" @pointerdown=${(n) => this._masterDragStart(n, t)}>
        <div class="track"><div class="fill" style=${I({ width: `${e ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${e ?? "–"}</span>
    </div>`;
  }
  renderSpeaker(t) {
    const e = t.available ? t.notInGroup ? "Not in the Cast group: add it in the Google Home app" : t.standby ? "Idle" : "Toggle speaker" : "Unavailable";
    return d`<div
      class=${v({ "speaker-row": !0, on: t.on, unavailable: !t.available, standby: t.standby, orphan: t.notInGroup })}
      title=${e}
    >
      <button class="dot" title=${e} ?disabled=${!t.available} @click=${() => this._toggle(t)}>${x.speaker}</button>
      <span class="sp-name ellipsis">${t.name}</span>
      <div class="track-hit" @pointerdown=${(s) => this._dragStart(s, t)}>
        <div class="track"><div class="fill" style=${I({ width: `${t.on ? t.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${t.notInGroup ? "n/a" : t.standby ? "–" : t.vol}</span>
    </div>`;
  }
  renderPicker(t) {
    if (!this._pickerOpen) return f;
    const e = () => this._pickerOpen = !1;
    return d`<div class="scrim" @click=${e}>
      <div class="sheet" @click=${(s) => s.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-title">Play on</span>
          <button class="sheet-done" @click=${e}>Done</button>
        </div>
        <div class="sheet-list">
          ${t.map(
      (s) => d`<button class=${v({ "sheet-row": !0, on: s.on })} ?disabled=${!s.available} @click=${() => this._toggle(s)}>
              <span class="check">${x.check}</span>
              <span class="sheet-name ellipsis">${s.name}</span>
              <span class="sheet-kind">${s.available ? s.notInGroup ? "not in group" : s.standby ? "idle" : s.on ? `${s.vol}` : "muted" : "offline"}</span>
            </button>`
    )}
        </div>
      </div>
    </div>`;
  }
  renderToast() {
    return this._toast ? d`<div class="toast">${this._toast}</div>` : f;
  }
  renderArt(t, e, s, n, r = !1) {
    const o = !!e && !this._broken.has(s);
    return d`<div class=${v({ art: !0, [t]: !0, pulse: r })}>
      <div class="stripes"></div>
      ${o ? d`<img
            src=${e}
            alt=""
            loading="lazy"
            @load=${(a) => a.target.classList.add("loaded")}
            @error=${() => this._imgBroken(s)}
          />` : d`<div class="art-label">ART ${String(n + 1).padStart(2, "0")}</div>`}
    </div>`;
  }
  renderPlaylists(t) {
    if (t.status === "error" && !t.playlists.length)
      return d`<div class="pl-msg">
        <span>${t.error || "Could not load playlists"}</span>
        <button class="text-btn" @click=${t.onRetry}>Retry</button>
      </div>`;
    if (t.status === "ready" && !t.playlists.length) return d`<div class="pl-msg">No playlists yet</div>`;
    if (t.status !== "ready" && !t.playlists.length) {
      const s = t.layout === "list" ? Math.min(t.count, 10) : t.count, n = Array.from({ length: s }, (r, o) => o);
      return t.layout === "list" ? d`<div class="list">
            ${n.map(
        (r) => d`<div class=${v({ "list-row": !0, first: r === 0 })}>
                ${this.renderArt("list-art", null, `ph${r}`, r, !0)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`
      )}
          </div>` : d`<div class="tiles" style=${I({ "--cols": String(t.columns) })}>
            ${n.map(
        (r) => d`<div class="tile">${this.renderArt("tile-art", null, `ph${r}`, r, !0)}<span class="tile-name">&nbsp;</span></div>`
      )}
          </div>`;
    }
    const e = t.playlists.slice(0, t.count);
    return t.layout === "list" ? d`<div class="list">
        ${e.map(
      (s, n) => d`<button class=${v({ "list-row": !0, first: n === 0, active: s.uri === t.activeUri })} @click=${() => t.onPlay(s)}>
            ${this.renderArt("list-art", s.image, s.uri, n)}
            <span class="list-name ellipsis">${s.name}</span>
            <span class="list-play">${x.playSmall}</span>
          </button>`
    )}
      </div>` : d`<div class="tiles" style=${I({ "--cols": String(t.columns) })}>
      ${e.map(
      (s, n) => d`<button class=${v({ tile: !0, active: s.uri === t.activeUri })} title=${s.name} @click=${() => t.onPlay(s)}>
          <div class="tile-art-wrap" style="position:relative;width:100%">
            ${this.renderArt("tile-art", s.image, s.uri, n)}
            <div class="ring"></div>
          </div>
          <span class="tile-name ellipsis">${s.name}</span>
        </button>`
    )}
    </div>`;
  }
  renderNowBar(t, e, s) {
    const n = this.position(t, e), r = t.duration ?? 0, o = r > 0 ? n / r * 100 : 0, a = t.found && (t.state === "unavailable" || t.state === "unknown");
    let l = s.title ?? t.title;
    s.title || (t.found ? a ? l = "Player unavailable" : l || (l = t.state === "playing" ? "Playing" : t.state === "paused" ? "Paused" : "Nothing playing") : l = "Player not found");
    const c = s.subtitle ?? t.artist, h = s.disabled || !t.found || a, p = !h && r > 0;
    return d`<div class=${v({ now: !0, paused: !t.playing && !s.busy, busy: !!s.busy })}>
      <div class="now-row">
        ${this.renderArt("now-art", t.art, `now:${t.art ?? ""}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            ${s.busy ? d`<span class="spinner" aria-label="Starting"></span>` : d`<div class="eq"><div></div><div></div><div></div></div>`}
            <span class="now-title ellipsis">${l}</span>
          </div>
          <span class="now-artist ellipsis">${c}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${h} @click=${() => this.run(s.onPrev())}>${x.prev}</button>
          <button class="play" title=${t.playing ? "Pause" : "Play"} ?disabled=${h} @click=${() => this.run(s.onPlayPause())}>
            ${t.playing ? x.pause : x.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${h} @click=${() => this.run(s.onNext())}>${x.next}</button>
        </div>
      </div>
      <div class=${v({ "progress-hit": !0, disabled: !p })} @pointerdown=${(u) => p && this._seekStart(u, t, s.onSeek)}>
        <div class="progress"><div class="progress-fill" style=${I({ width: `${o.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${Pt(n)}</span><span>${r > 0 ? `-${Pt(r - n)}` : "–:––"}</span></div>
      </div>
    </div>`;
  }
};
ft.styles = Oe;
let G = ft;
Zt([
  g()
], G.prototype, "_pickerOpen");
Zt([
  g()
], G.prototype, "_toast");
function dt(i) {
  const t = i && typeof i == "object" ? i.response : void 0, e = t && typeof t == "object" ? t.result ?? t : {};
  return e && typeof e == "object" ? e : {};
}
function _(i, ...t) {
  if (i) {
    for (const e of t) if (i[e] !== void 0 && i[e] !== null) return i[e];
  }
}
function Kt(i) {
  const t = _(i, "items", "Items");
  return Array.isArray(t) ? t.filter((e) => e && typeof e == "object") : [];
}
function Xt(i) {
  const t = _(i, "uri", "Uri"), e = _(i, "name", "Name");
  if (typeof t != "string" || typeof e != "string") return null;
  let s = _(i, "image_url", "ImageUrl");
  if (!s) {
    const n = _(i, "images", "Images");
    Array.isArray(n) && n[0] && (s = _(n[0], "url", "Url"));
  }
  return { uri: t, name: e, image: typeof s == "string" && s ? s : null };
}
function Le(i) {
  const t = [];
  for (const e of Kt(dt(i))) {
    const s = _(e, "context", "Context"), n = s ? _(s, "uri", "Uri") ?? null : null, r = _(e, "played_at_ms", "PlayedAtMS"), o = _(e, "played_at", "PlayedAt"), a = typeof r == "number" ? r : typeof o == "string" ? Date.parse(o) : NaN;
    if (!Number.isFinite(a)) continue;
    const l = _(e, "track", "Track");
    t.push({ contextUri: n, playedAt: a, trackName: (l && _(l, "name", "Name")) ?? "" });
  }
  return t;
}
const ut = (i, t, e) => i.callService("spotifyplus", t, e, void 0, !1, !0);
async function Be(i, t, e) {
  const s = { entity_id: t, limit: 50 };
  e && e > 0 && (s.after = e);
  const n = await ut(i, "get_player_recent_tracks", s);
  return Le(n).sort((r, o) => o.playedAt - r.playedAt);
}
async function qe(i, t, e = 50) {
  const s = await ut(i, "get_playlist_favorites", { entity_id: t, limit: e });
  return Kt(dt(s)).map(Xt).filter((n) => !!n);
}
async function Fe(i, t, e) {
  const s = e.split(":").pop() ?? e, n = await ut(i, "get_playlist", { entity_id: t, playlist_id: s }), r = Xt(dt(n));
  return r ? { ...r, uri: e } : null;
}
const Ve = (i, t, e, s, n) => i.callService("spotifyplus", "player_media_play_context", {
  entity_id: t,
  context_uri: e,
  device_id: s,
  shuffle: n
});
async function Ge(i, t) {
  const e = await i.callWS({ type: "frontend/get_user_data", key: t });
  return (e == null ? void 0 : e.value) ?? null;
}
async function We(i, t, e) {
  await i.callWS({ type: "frontend/set_user_data", key: t, value: e });
}
const Mt = { version: 1, lastSeen: 0, entries: {} };
function Ye(i) {
  return typeof i == "string" && /^spotify:playlist:[A-Za-z0-9]+$/.test(i);
}
function Ze(i, t) {
  const e = { ...i.entries };
  let s = i.lastSeen;
  for (const n of t) {
    if (n.playedAt <= i.lastSeen || (s = Math.max(s, n.playedAt), !Ye(n.contextUri))) continue;
    const r = e[n.contextUri];
    e[n.contextUri] = r ? { ...r, plays: r.plays + 1, lastPlayed: Math.max(r.lastPlayed, n.playedAt) } : { uri: n.contextUri, name: "", image: null, lastPlayed: n.playedAt, plays: 1 };
  }
  return { version: 1, lastSeen: s, entries: e };
}
function Ke(i, t, e) {
  const s = i.entries[t.uri];
  return {
    ...i,
    entries: {
      ...i.entries,
      [t.uri]: s ? { ...s, name: t.name || s.name, image: t.image ?? s.image, lastPlayed: Math.max(s.lastPlayed, e) } : { uri: t.uri, name: t.name, image: t.image, lastPlayed: e, plays: 0 }
    }
  };
}
function Ut(i, t) {
  let e = !1;
  const s = { ...i.entries };
  for (const n of t) {
    const r = s[n.uri];
    r && (r.name !== n.name || n.image && r.image !== n.image) && (s[n.uri] = { ...r, name: n.name, image: n.image ?? r.image }, e = !0);
  }
  return e ? { ...i, entries: s } : i;
}
function Ot(i) {
  return Object.values(i.entries).filter((t) => !t.name).map((t) => t.uri);
}
function Xe(i, t, e) {
  const s = Object.values(i.entries).filter((n) => n.name);
  return s.sort((n, r) => t === "play_count" && r.plays - n.plays || r.lastPlayed - n.lastPlayed), s.slice(0, e).map((n) => ({ uri: n.uri, name: n.name, image: n.image }));
}
function Je(i, t, e) {
  if (i.length >= e) return i.slice(0, e);
  const s = new Set(i.map((r) => r.uri)), n = [...i];
  for (const r of t) {
    if (n.length >= e) break;
    s.has(r.uri) || (s.add(r.uri), n.push({ uri: r.uri, name: r.name, image: r.image }));
  }
  return n;
}
function Qe(i, t = 200) {
  const e = Object.values(i.entries);
  if (e.length <= t) return i;
  e.sort((n, r) => r.lastPlayed - n.lastPlayed);
  const s = {};
  for (const n of e.slice(0, t)) s[n.uri] = n;
  return { ...i, entries: s };
}
function ts(i) {
  return !!i && typeof i == "object" && i.version === 1 && typeof i.entries == "object";
}
var es = Object.defineProperty, ss = Object.getOwnPropertyDescriptor, tt = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? ss(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && es(t, e, n), n;
};
const is = [
  { name: "spotifyplus_entity", required: !0, selector: { entity: { domain: "media_player", integration: "spotifyplus" } } },
  { name: "cast_group_entity", required: !0, selector: { entity: { domain: "media_player", integration: "cast" } } },
  { name: "device_name", required: !0, selector: { text: {} } },
  { name: "speakers", required: !0, selector: { entity: { domain: "media_player", integration: "cast", multiple: !0 } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "control_via", selector: { select: { mode: "dropdown", options: [{ value: "cast", label: "Google Cast entity (no API calls)" }, { value: "spotifyplus", label: "SpotifyPlus entity" }] } } },
      { name: "shuffle", selector: { boolean: {} } },
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
  { name: "fill_with_favorites", selector: { boolean: {} } },
  { name: "history_key", selector: { text: {} } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } }
], ns = {
  spotifyplus_entity: "SpotifyPlus player",
  cast_group_entity: "Google Cast entity of the speaker group",
  device_name: "Spotify Connect device name to play on (e.g. Alla)",
  speakers: "Speakers (Google Cast entities)",
  control_via: "Now playing / transport via",
  shuffle: "Start playlists shuffled",
  playlist_layout: "Playlist layout",
  playlist_sort: "Playlist order",
  playlist_count: "Playlists to show",
  tile_columns: "Tile columns",
  speaker_count: "Speaker rows to show",
  preset_tolerance: "Preset match tolerance",
  default_preset: "Preset applied on a fresh start (name)",
  master_volume: "Show master volume row",
  fill_with_favorites: "Fill empty slots with my own playlists",
  history_key: "Play history key (shared by cards using the same key)",
  title: "Title",
  accent: "Accent color (CSS)"
};
let j = class extends N {
  constructor() {
    super(...arguments), this._ready = !1;
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
    if (!customElements.get("ha-form"))
      try {
        const s = await ((i = window.loadCardHelpers) == null ? void 0 : i.call(window)), n = s == null ? void 0 : s.createCardElement({ type: "entities", entities: [] });
        (e = n == null ? void 0 : (t = n.constructor).getConfigElement) == null || e.call(t), await customElements.whenDefined("ha-form");
      } catch {
      }
    this._ready = !0;
  }
  _formData() {
    const i = this._config ?? {}, t = Array.isArray(i.speakers) ? i.speakers.map((e) => typeof e == "string" ? e : e == null ? void 0 : e.entity).filter(Boolean) : [];
    return {
      ...i,
      speakers: t,
      spotifyplus_entity: i.spotifyplus_entity ?? "media_player.spotifyplus",
      control_via: i.control_via ?? "cast",
      master_volume: i.master_volume !== !1,
      fill_with_favorites: i.fill_with_favorites !== !1,
      shuffle: i.shuffle === !0
    };
  }
  _valueChanged(i) {
    if (i.stopPropagation(), !this._config) return;
    const t = i.detail.value, e = this._config, s = /* @__PURE__ */ new Map();
    for (const o of e.speakers ?? []) typeof o == "object" && (o != null && o.name) && s.set(o.entity, o.name);
    const n = (t.speakers ?? []).map((o) => s.has(o) ? { entity: o, name: s.get(o) } : o), r = { ...e, ...t, speakers: n };
    for (const o of Object.keys(r)) {
      const a = r[o];
      (a === "" || a === void 0 || a === null) && delete r[o];
    }
    this._config = r, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: r }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._ready ? f : d`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${is}
        .computeLabel=${(i) => ns[i.name] ?? i.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
j.styles = Rt`
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
tt([
  qt({ attribute: !1 })
], j.prototype, "hass", 2);
tt([
  g()
], j.prototype, "_config", 2);
tt([
  g()
], j.prototype, "_ready", 2);
j = tt([
  Bt("spotifyplus-media-card-editor")
], j);
var rs = Object.defineProperty, os = Object.getOwnPropertyDescriptor, P = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? os(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && rs(t, e, n), n;
};
const as = 6e4, ls = 6e4, cs = 10 * 6e4, ps = 60 * 6e4, hs = 5;
let $ = class extends G {
  constructor() {
    super(...arguments), this._history = Mt, this._plStatus = "idle", this._plError = "", this._activeUri = null, this._starting = null, this._favorites = [], this._favoritesAt = 0, this._refreshing = !1, this._historyLoaded = !1;
  }
  get section() {
    return this._config;
  }
  get groupEntity() {
    var i;
    return (i = this._config) == null ? void 0 : i.cast_group_entity;
  }
  get accent() {
    var i;
    return ((i = this._config) == null ? void 0 : i.accent) ?? "";
  }
  extraEntities() {
    return this._config ? [this._config.spotifyplus_entity] : [];
  }
  ticking(i) {
    var t, e;
    return !!this._starting || super.ticking(i) || ((e = i.states[((t = this._config) == null ? void 0 : t.spotifyplus_entity) ?? ""]) == null ? void 0 : e.state) === "playing";
  }
  get _playerEntity() {
    const i = this._config;
    return i.control_via === "spotifyplus" ? i.spotifyplus_entity : i.cast_group_entity;
  }
  // ---- HA card API -------------------------------------------------------
  static getConfigElement() {
    return document.createElement("spotifyplus-media-card-editor");
  }
  static getStubConfig(i) {
    var n, r, o;
    const t = Object.values((i == null ? void 0 : i.states) ?? {}).filter((a) => a.entity_id.startsWith("media_player.")), e = ((n = t.find((a) => a.entity_id.includes("spotifyplus"))) == null ? void 0 : n.entity_id) ?? "media_player.spotifyplus", s = t.filter((a) => typeof a.attributes.app_id == "string" || typeof a.attributes.app_name == "string");
    return {
      spotifyplus_entity: e,
      cast_group_entity: ((r = s[0]) == null ? void 0 : r.entity_id) ?? "media_player.your_cast_group",
      device_name: ((o = s[0]) == null ? void 0 : o.attributes.friendly_name) ?? "Speaker group",
      speakers: s.slice(1, 5).map((a) => a.entity_id),
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  setConfig(i) {
    const t = this._config, e = we(i);
    this._config = e, (!t || t.history_key !== e.history_key || t.spotifyplus_entity !== e.spotifyplus_entity) && (this._historyLoaded = !1, this._history = Mt, this._plStatus = "idle", this._hass && this._refresh());
  }
  hassChanged(i, t) {
    this._checkStarted(i), t && this._plStatus === "idle" && this._refresh();
  }
  connectedCallback() {
    super.connectedCallback(), this._intervalTimer = window.setInterval(() => {
      document.visibilityState === "visible" && this._refresh();
    }, cs), this._hass && this._config && this._plStatus !== "loading" && this._refresh();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const i of [this._refreshTimer, this._intervalTimer, this._startTimer]) i && window.clearTimeout(i);
    this._intervalTimer && window.clearInterval(this._intervalTimer);
  }
  // ---- history / playlists ----------------------------------------------
  get _playlists() {
    const i = this._config;
    if (!i) return [];
    const t = Xe(this._history, i.playlist_sort, i.playlist_count);
    return i.fill_with_favorites ? Je(t, this._favorites, i.playlist_count) : t;
  }
  async _ensureFavorites(i, t) {
    Date.now() - this._favoritesAt < ps || (this._favorites = await qe(i, t.spotifyplus_entity, 50), this._favoritesAt = Date.now());
  }
  async _refresh() {
    const i = this._hass, t = this._config;
    if (!(!i || !t || this._refreshing)) {
      this._refreshing = !0, Object.keys(this._history.entries).length || (this._plStatus = "loading");
      try {
        if (!this._historyLoaded) {
          const r = await Ge(i, t.history_key);
          ts(r) && (this._history = r), this._historyLoaded = !0;
        }
        const e = this._history, s = await Be(i, t.spotifyplus_entity, e.lastSeen);
        let n = Ze(e, s);
        t.fill_with_favorites && await this._ensureFavorites(i, t), n = await this._fillMeta(i, t, n), n = Qe(n), this._history = n, this._plStatus = "ready", this._plError = "", n !== e && await We(i, t.history_key, n);
      } catch (e) {
        this._plStatus = "error", this._plError = at(e);
      } finally {
        this._refreshing = !1;
      }
    }
  }
  /** Names and artwork for playlists we only know by uri: favourites first, then single lookups. */
  async _fillMeta(i, t, e) {
    let s = Ot(e);
    if (!s.length) return e;
    await this._ensureFavorites(i, t), e = Ut(e, this._favorites), s = Ot(e);
    const n = [];
    for (const r of s.slice(0, hs))
      try {
        const o = await Fe(i, t.spotifyplus_entity, r);
        o ? n.push(o) : n.push({ uri: r, name: "Playlist", image: null });
      } catch {
      }
    return Ut(e, n);
  }
  _scheduleRefresh(i) {
    this._refreshTimer && window.clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(() => void this._refresh(), i);
  }
  // ---- start playback ----------------------------------------------------
  _play(i) {
    var n;
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const s = (n = t.states[e.spotifyplus_entity]) == null ? void 0 : n.state;
    if (!s || s === "unavailable" || s === "unknown") {
      this.showToast(`${e.spotifyplus_entity} is unavailable. Check the SpotifyPlus integration.`);
      return;
    }
    if (this._starting) {
      this.showToast(`Still starting on ${e.device_name}…`);
      return;
    }
    this.applyDefaultPresetIfCold(t, Ce(t, e.cast_group_entity)), this._starting = { uri: i.uri, since: Date.now() }, this._activeUri = i.uri, this._history = Ke(this._history, i, Date.now()), this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
      var r;
      ((r = this._starting) == null ? void 0 : r.uri) === i.uri && (this._starting = null, this.showToast(`${e.device_name} did not start within 60 s. Check the speakers and try again.`, 6e3));
    }, as), Ve(t, e.spotifyplus_entity, i.uri, e.device_name, e.shuffle).then(() => this._scheduleRefresh(ls)).catch((r) => {
      this._starting = null, this.showToast(at(r), 6e3);
    });
  }
  /** Playback landed on the Cast group: clear the busy state. */
  _checkStarted(i) {
    const t = this._config;
    if (!t || !this._starting) return;
    const e = i.states[t.cast_group_entity], s = typeof (e == null ? void 0 : e.attributes.app_name) == "string" ? e.attributes.app_name : "";
    (e == null ? void 0 : e.state) === "playing" && /spotify/i.test(s) && i.states[t.cast_group_entity].last_updated > new Date(this._starting.since).toISOString() && (this._starting = null, this._startTimer && window.clearTimeout(this._startTimer));
  }
  // ---- render ------------------------------------------------------------
  render() {
    var p, u, m;
    const i = this._config, t = this._hass;
    if (!i) return f;
    if (!t) return d`<ha-card><div class="card"></div></ha-card>`;
    const e = Date.now(), s = this.speakers(t, e), n = Se(t, this._playerEntity), r = ((p = t.states[i.spotifyplus_entity]) == null ? void 0 : p.attributes) ?? {}, o = typeof r.media_playlist == "string" && r.media_playlist || ((u = this._history.entries[this._activeUri ?? ""]) == null ? void 0 : u.name) || "", a = this._starting, l = a ? ((m = this._history.entries[a.uri]) == null ? void 0 : m.name) || "playlist" : "", c = n.found && (n.state === "unavailable" || n.state === "unknown"), h = this._playerEntity;
    return d`
      <ha-card>
        <div class="card">
          ${this.renderHeader(i.title, s)}
          ${this.renderPlaylists({
      layout: i.playlist_layout,
      count: i.playlist_count,
      columns: i.tile_columns,
      playlists: this._playlists,
      status: this._plStatus,
      error: this._plError,
      activeUri: this._activeUri,
      onPlay: (w) => this._play(w),
      onRetry: () => void this._refresh()
    })}
          ${this.renderSpeakerSection(s)}
          ${this.renderNowBar(n, e, {
      title: a ? `Starting on ${i.device_name}…` : void 0,
      subtitle: a ? `${l} · ${Math.round((e - a.since) / 1e3)} s` : !n.found || c ? h : [n.artist, o].filter(Boolean).join(" · "),
      busy: !!a,
      disabled: !!a,
      onPrev: () => je(t, h),
      onPlayPause: () => Ne(t, h),
      onNext: () => Re(t, h),
      onSeek: (w) => He(t, h, w)
    })}
          ${this.renderPicker(s)} ${this.renderToast()}
        </div>
      </ha-card>
    `;
  }
};
P([
  g()
], $.prototype, "_config", 2);
P([
  g()
], $.prototype, "_history", 2);
P([
  g()
], $.prototype, "_plStatus", 2);
P([
  g()
], $.prototype, "_plError", 2);
P([
  g()
], $.prototype, "_activeUri", 2);
P([
  g()
], $.prototype, "_starting", 2);
P([
  g()
], $.prototype, "_favorites", 2);
$ = P([
  Bt("spotifyplus-media-card")
], $);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "spotifyplus-media-card",
  name: "Spotify Media Card (SpotifyPlus)",
  description: "Start Spotify playlists on a Chromecast speaker group as a Spotify Connect session, via SpotifyPlus.",
  preview: !1
});
export {
  $ as SpotifyPlusMediaCard
};
