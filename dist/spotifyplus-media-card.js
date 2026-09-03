/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, ct = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pt = Symbol(), gt = /* @__PURE__ */ new WeakMap();
let Ht = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== pt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ct && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = gt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && gt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ee = (i) => new Ht(typeof i == "string" ? i : i + "", void 0, pt), Dt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new Ht(e, i, pt);
}, se = (i, t) => {
  if (ct) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = K.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, vt = ct ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ee(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ie, defineProperty: re, getOwnPropertyDescriptor: ne, getOwnPropertyNames: oe, getOwnPropertySymbols: ae, getPrototypeOf: le } = Object, k = globalThis, bt = k.trustedTypes, ce = bt ? bt.emptyScript : "", it = k.reactiveElementPolyfillSupport, L = (i, t) => i, J = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? ce : null;
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
} }, dt = (i, t) => !ie(i, t), xt = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: dt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), k.litPropertyMetadata ?? (k.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = xt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && re(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = ne(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const a = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? xt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = le(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const e = this.properties, s = [...oe(e), ...ae(e)];
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
      for (const r of s) e.unshift(vt(r));
    } else t !== void 0 && e.push(vt(t));
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
    return se(t, this.constructor.elementStyles), t;
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
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : J).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : J;
      this._$Em = r;
      const c = l.fromAttribute(e, a.type);
      this[r] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? dt)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
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
        const { wrapped: a } = o, l = this[n];
        a !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[L("elementProperties")] = /* @__PURE__ */ new Map(), z[L("finalized")] = /* @__PURE__ */ new Map(), it == null || it({ ReactiveElement: z }), (k.reactiveElementVersions ?? (k.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, $t = (i) => i, Q = B.trustedTypes, wt = Q ? Q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, It = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, Lt = "?" + w, pe = `<${Lt}>`, U = document, V = () => U.createComment(""), F = (i) => i === null || typeof i != "object" && typeof i != "function", ht = Array.isArray, de = (i) => ht(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", rt = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, kt = /-->/g, At = />/g, E = RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), St = /'/g, Pt = /"/g, Bt = /^(?:script|style|textarea|title)$/i, qt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), h = qt(1), b = qt(2), A = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Et = /* @__PURE__ */ new WeakMap(), T = U.createTreeWalker(U, 129);
function Vt(i, t) {
  if (!ht(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return wt !== void 0 ? wt.createHTML(t) : t;
}
const he = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = D;
  for (let a = 0; a < e; a++) {
    const l = i[a];
    let c, d, p = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, d = o.exec(l), d !== null); ) f = o.lastIndex, o === D ? d[1] === "!--" ? o = kt : d[1] !== void 0 ? o = At : d[2] !== void 0 ? (Bt.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = E) : d[3] !== void 0 && (o = E) : o === E ? d[0] === ">" ? (o = r ?? D, p = -1) : d[1] === void 0 ? p = -2 : (p = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? E : d[3] === '"' ? Pt : St) : o === Pt || o === St ? o = E : o === kt || o === At ? o = D : (o = E, r = void 0);
    const y = o === E && i[a + 1].startsWith("/>") ? " " : "";
    n += o === D ? l + pe : p >= 0 ? (s.push(c), l.slice(0, p) + It + l.slice(p) + w + y) : l + w + (p === -2 ? a : y);
  }
  return [Vt(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class G {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, l = this.parts, [c, d] = he(t, e);
    if (this.el = G.createElement(c, s), T.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = T.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(It)) {
          const f = d[o++], y = r.getAttribute(p).split(w), P = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: P[2], strings: y, ctor: P[1] === "." ? fe : P[1] === "?" ? me : P[1] === "@" ? ye : tt }), r.removeAttribute(p);
        } else p.startsWith(w) && (l.push({ type: 6, index: n }), r.removeAttribute(p));
        if (Bt.test(r.tagName)) {
          const p = r.textContent.split(w), f = p.length - 1;
          if (f > 0) {
            r.textContent = Q ? Q.emptyScript : "";
            for (let y = 0; y < f; y++) r.append(p[y], V()), T.nextNode(), l.push({ type: 2, index: ++n });
            r.append(p[f], V());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Lt) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(w, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += w.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = U.createElement("template");
    return s.innerHTML = t, s;
  }
}
function N(i, t, e = i, s) {
  var o, a;
  if (t === A) return t;
  let r = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = F(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = N(i, r._$AS(i, t.values), r, s)), t;
}
class ue {
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
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? U).importNode(e, !0);
    T.currentNode = r;
    let n = T.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new Y(n, n.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (c = new _e(n, this, t)), this._$AV.push(c), l = s[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = T.nextNode(), o++);
    }
    return T.currentNode = U, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class Y {
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
    t = N(this, t, e), F(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : de(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && F(this._$AH) ? this._$AA.nextSibling.data = t : this.T(U.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = G.createElement(Vt(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new ue(r, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Et.get(t.strings);
    return e === void 0 && Et.set(t.strings, e = new G(t)), e;
  }
  k(t) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new Y(this.O(V()), this.O(V()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = $t(t).nextSibling;
      $t(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class tt {
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
    if (n === void 0) t = N(this, t, e, 0), o = !F(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = n[0], l = 0; l < n.length - 1; l++) c = N(this, a[s + l], e, l), c === A && (c = this._$AH[l]), o || (o = !F(c) || c !== this._$AH[l]), c === u ? t = u : t !== u && (t += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class fe extends tt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class me extends tt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ye extends tt {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = N(this, t, e, 0) ?? u) === A) return;
    const s = this._$AH, r = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class _e {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const nt = B.litHtmlPolyfillSupport;
nt == null || nt(G, Y), (B.litHtmlVersions ?? (B.litHtmlVersions = [])).push("3.3.3");
const ge = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new Y(t.insertBefore(V(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
let R = class extends z {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ge(e, this.renderRoot, this.renderOptions);
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
    return A;
  }
};
var jt;
R._$litElement$ = !0, R.finalized = !0, (jt = M.litElementHydrateSupport) == null || jt.call(M, { LitElement: R });
const ot = M.litElementPolyfillSupport;
ot == null || ot({ LitElement: R });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = { attribute: !0, type: String, converter: J, reflect: !1, hasChanged: dt }, be = (i = ve, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
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
function Gt(i) {
  return (t, e) => typeof e == "object" ? be(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(i) {
  return Gt({ ...i, state: !0, attribute: !1 });
}
const xe = "oklch(0.62 0.16 285)";
function m(i, t) {
  throw new Error(`${i}: ${t}`);
}
function lt(i) {
  return typeof i == "string" && /^media_player\.[a-z0-9_]+$/.test(i);
}
function q(i, t, e, s, r, n) {
  if (t == null || t === "") return n;
  const o = typeof t == "string" ? Number(t) : t;
  return (typeof o != "number" || !Number.isInteger(o) || o < s || o > r) && m(i, `${e} must be an integer between ${s} and ${r}`), o;
}
function $e(i, t) {
  (!Array.isArray(t) || t.length === 0) && m(i, "speakers must be a non-empty list of Google Cast media_player entities");
  const e = [], s = /* @__PURE__ */ new Set();
  for (const r of t) {
    const n = typeof r == "string" ? r : r == null ? void 0 : r.entity;
    lt(n) || m(i, `speaker "${String(n)}" is not a media_player entity`), s.has(n) && m(i, `speaker ${n} is listed twice`), s.add(n);
    const o = typeof r == "object" && r && typeof r.name == "string" && r.name.trim() ? r.name.trim() : void 0;
    e.push(o ? { entity: n, name: o } : { entity: n });
  }
  return e;
}
function we(i, t, e) {
  if (t == null) return [];
  Array.isArray(t) || m(i, "presets must be a list");
  const s = new Set(e.map((n) => n.entity)), r = /* @__PURE__ */ new Set();
  return t.map((n, o) => {
    const a = typeof (n == null ? void 0 : n.name) == "string" ? n.name.trim() : "";
    a || m(i, `preset #${o + 1} needs a name`), r.has(a) && m(i, `preset "${a}" is defined twice`), r.add(a);
    const l = n.levels ?? {};
    (typeof l != "object" || Array.isArray(l)) && m(i, `preset "${a}": levels must be a map of entity -> volume`);
    const c = {};
    for (const [d, p] of Object.entries(l)) {
      s.has(d) || m(i, `preset "${a}": ${d} is not in speakers`);
      const f = typeof p == "string" ? Number(p) : p;
      (typeof f != "number" || !Number.isInteger(f) || f < 0 || f > 100) && m(i, `preset "${a}": volume for ${d} must be an integer 0-100`), c[d] = f;
    }
    return { name: a, levels: c };
  });
}
function ke(i, t) {
  const e = $e(i, t.speakers), s = we(i, t.presets, e), r = typeof t.default_preset == "string" ? t.default_preset.trim() : "";
  r && !s.some((o) => o.name === r) && m(i, `default_preset "${r}" is not one of the presets`);
  const n = t.layout ?? "vertical";
  return ["vertical", "horizontal", "auto"].includes(n) || m(i, 'layout must be "vertical", "horizontal" or "auto"'), {
    layout: n,
    speakers: e,
    presets: s,
    speaker_count: q(i, t.speaker_count, "speaker_count", 1, 50, e.length),
    preset_tolerance: q(i, t.preset_tolerance, "preset_tolerance", 0, 50, 3),
    master_volume: t.master_volume !== !1,
    default_preset: r
  };
}
function Ae(i, t) {
  const e = t.playlist_layout ?? "tiles";
  e !== "tiles" && e !== "list" && m(i, 'playlist_layout must be "tiles" or "list"');
  const s = t.playlist_sort ?? "last_played";
  s !== "last_played" && s !== "play_count" && m(i, 'playlist_sort must be "last_played" or "play_count"');
  const r = q(i, t.tile_columns, "tile_columns", 2, 8, 3);
  return {
    playlist_layout: e,
    playlist_sort: s,
    playlist_count: q(i, t.playlist_count, "playlist_count", 1, 50, e === "list" ? 10 : 6),
    tile_columns: r,
    /** playlists per row when the card renders two columns (horizontal / auto when wide) */
    tile_columns_wide: q(i, t.tile_columns_wide, "tile_columns_wide", 2, 8, r)
  };
}
function at(i, t) {
  return typeof i == "string" && i.trim() ? i.trim() : t;
}
const C = "spotifyplus-media-card";
function Se(i) {
  (!i || typeof i != "object") && m(C, "invalid configuration");
  const t = i.spotifyplus_entity ?? "media_player.spotifyplus";
  lt(t) || m(C, "spotifyplus_entity must be the SpotifyPlus media_player entity"), lt(i.cast_group_entity) || m(C, "cast_group_entity must be the Google Cast media_player entity of your speaker group");
  const e = at(i.device_name, "");
  e || m(C, 'device_name is required (the Spotify Connect name of your speaker group, e.g. "Alla")');
  const s = i.control_via ?? "cast";
  return s !== "cast" && s !== "spotifyplus" && m(C, 'control_via must be "cast" or "spotifyplus"'), {
    type: i.type,
    spotifyplus_entity: t,
    cast_group_entity: i.cast_group_entity,
    device_name: e,
    control_via: s,
    shuffle: i.shuffle === !0,
    ...ke(C, i),
    ...Ae(C, i),
    history_key: at(i.history_key, "spotifyplus-media-card"),
    fill_with_favorites: i.fill_with_favorites !== !1,
    title: typeof i.title == "string" ? i.title : "Listening",
    accent: at(i.accent, xe)
  };
}
const Pe = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Ee(i, t, e) {
  var r;
  const s = ((r = i.states[e]) == null ? void 0 : r.state) === "playing";
  return t.map((n) => {
    const o = i.states[n.entity], a = (o == null ? void 0 : o.attributes) ?? {}, l = !!o && !Pe.has(o.state), c = typeof a.volume_level == "number", d = c ? a.volume_level : 0, p = a.is_volume_muted === !0, f = l && !c, y = typeof a.friendly_name == "string" ? a.friendly_name : void 0;
    return {
      entity: n.entity,
      name: n.name ?? y ?? n.entity.replace("media_player.", ""),
      vol: Math.round(d * 100),
      on: l && !f && !p,
      available: l,
      standby: f,
      notInGroup: s && f
    };
  });
}
function Ce(i, t) {
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
function Te(i, t, e) {
  const s = i.filter((r) => r.available && !r.standby);
  if (!s.length) return null;
  for (const r of t) {
    let n = !0;
    for (const o of s) {
      const a = r.levels[o.entity];
      if (a === void 0) {
        if (o.on) {
          n = !1;
          break;
        }
      } else if (!o.on || Math.abs(o.vol - a) > e) {
        n = !1;
        break;
      }
    }
    if (n) return r.name;
  }
  return null;
}
function Me(i) {
  const t = i.filter((e) => e.on);
  return t.length ? Math.round(t.reduce((e, s) => e + s.vol, 0) / t.length) : null;
}
function Ct(i, t) {
  const e = /* @__PURE__ */ new Map(), s = i.filter((o) => o.on);
  if (!s.length) return e;
  const r = s.reduce((o, a) => o + a.vol, 0) / s.length, n = Math.max(0, Math.min(100, t));
  for (const o of s) {
    const a = r > 0 && o.vol > 0 ? o.vol * n / r : n;
    e.set(o.entity, Math.max(0, Math.min(100, Math.round(a))));
  }
  return e;
}
function Ue(i, t) {
  const e = i.states[t];
  return e ? !["playing", "paused", "buffering", "on"].includes(e.state) : !0;
}
function ze(i) {
  const t = i.filter((e) => e.on);
  if (t.length === 0) {
    const e = i.filter((s) => s.available);
    return e.length ? e.every((s) => s.standby) ? "Speakers idle" : "No speakers selected" : "No speakers available";
  }
  return t.length === 1 ? t[0].name : `${t[0].name} + ${t.length - 1} more`;
}
function Oe(i, t) {
  var s;
  const e = [(s = i.themes) != null && s.darkMode ? "d" : "l"];
  for (const r of t) {
    const n = i.states[r];
    e.push(n ? n.last_updated : "-");
  }
  return e.join("|");
}
function X(i) {
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
const Wt = { ATTRIBUTE: 1 }, Yt = (i) => (...t) => ({ _$litDirective$: i, values: t });
let Zt = class {
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
const g = Yt(class extends Zt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Wt.ATTRIBUTE || i.name !== "class" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
    return A;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = "important", Re = " !" + Kt, I = Yt(class extends Zt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Wt.ATTRIBUTE || i.name !== "style" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
        const n = typeof r == "string" && r.endsWith(Re);
        s.includes("-") || n ? e.setProperty(s, n ? r.slice(0, -11) : r, n ? Kt : "") : e[s] = r;
      }
    }
    return A;
  }
}), Ne = Dt`
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
  .col-right > .now {
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
  .card.horizontal .col-right > .now {
    order: 0;
    margin-bottom: 16px;
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
    .card.auto .col-right > .now {
      order: 0;
      margin-bottom: 16px;
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
function je(i, t) {
  if (i.position === null) return 0;
  let e = i.position;
  if (i.playing && i.positionUpdatedAt) {
    const s = Date.parse(i.positionUpdatedAt);
    Number.isFinite(s) && (e += Math.max(0, (t - s) / 1e3));
  }
  return i.duration !== null && (e = Math.min(e, i.duration)), Math.max(0, e);
}
const H = (i, t, e, s) => i.callService("media_player", t, s, { entity_id: e }), He = (i, t) => H(i, "media_play_pause", t), De = (i, t) => H(i, "media_next_track", t), Ie = (i, t) => H(i, "media_previous_track", t), Le = (i, t, e) => H(i, "media_seek", t, { seek_position: Math.max(0, Math.round(e)) }), Xt = (i, t, e) => H(i, "volume_set", t, { volume_level: Math.max(0, Math.min(100, e)) / 100 }), O = (i, t, e) => H(i, "volume_mute", t, { is_volume_muted: e });
async function Be(i, t, e) {
  const s = [], r = [];
  for (const n of t) {
    if (!n.available) continue;
    const o = e.levels[n.entity];
    if (o === void 0) {
      (n.on || n.standby) && r.push(n.entity);
      continue;
    }
    n.on || s.push(O(i, n.entity, !1)), s.push(Xt(i, n.entity, o));
  }
  r.length && s.push(O(i, r, !0)), await Promise.all(s);
}
function Tt(i) {
  const t = Math.max(0, Math.floor(i)), e = Math.floor(t / 60), s = t % 60;
  return `${e}:${String(s).padStart(2, "0")}`;
}
function Mt(i) {
  return Math.max(0, Math.min(1, i));
}
function Ut(i, t) {
  let e = 0, s, r = !1, n;
  const o = () => {
    n = void 0, r && (r = !1, e = Date.now(), i(s));
  };
  return (a) => {
    const l = Date.now(), c = l - e;
    if (c >= t && !n) {
      e = l, i(a);
      return;
    }
    s = a, r = !0, n || (n = setTimeout(o, Math.max(0, t - c)));
  };
}
var qe = Object.defineProperty, Jt = (i, t, e, s) => {
  for (var r = void 0, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = o(t, e, r) || r);
  return r && qe(t, e, r), r;
};
const Z = 1500, zt = 150, mt = class mt extends R {
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
    const r = [this.groupEntity ?? "", ...s.speakers.map((o) => o.entity), ...this.extraEntities()].filter(Boolean), n = Oe(t, r);
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
    return s ? Ee(t, s.speakers, this.groupEntity ?? "").map((r) => {
      let n = r;
      if (!n.notInGroup) if (n.standby) {
        const a = this._intent.get(n.entity);
        a && (n = { ...n, standby: !1, vol: a.vol ?? 0, on: a.on ?? !0 });
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
  _bump(t, e, s = Z) {
    this._remember(t, e), this._overrides.set(t, { ...e, until: Date.now() + s }), this.requestUpdate(), window.setTimeout(() => this.requestUpdate(), s + 50);
  }
  _toggle(t) {
    !this._hass || !t.available || (this._bump(t.entity, { on: !t.on }), this.run(O(this._hass, t.entity, t.on)));
  }
  _muteAll(t, e) {
    if (!this._hass) return;
    const s = t.filter((r) => r.available).map((r) => r.entity);
    if (s.length) {
      for (const r of s) this._bump(r, { on: !e });
      this.run(O(this._hass, s, e));
    }
  }
  applyPreset(t, e) {
    if (this._hass) {
      for (const s of t) {
        if (!s.available) continue;
        const r = e.levels[s.entity];
        this._bump(s.entity, r === void 0 ? { on: !1 } : { on: !0, vol: r }, Z + 1e3);
      }
      this.run(Be(this._hass, t, e));
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
    !this._hass || this._lastSent.get(t) === e || (this._lastSent.set(t, e), this.run(Xt(this._hass, t, e)));
  }
  _throttleFor(t) {
    let e = this._throttled.get(t);
    return e || (e = Ut((s) => this._sendVolume(t, s), zt), this._throttled.set(t, e)), e;
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
    return Math.round(Mt((e.clientX - s.left) / s.width) * 100);
  }
  _dragStart(t, e) {
    const s = this._hass;
    if (!s || !e.available) return;
    const r = this._capture(t);
    e.on || this.run(O(s, e.entity, !1)), this._lastSent.delete(e.entity);
    const n = this._throttleFor(e.entity), o = (a) => {
      const l = this._pct(r, a);
      this._remember(e.entity, { vol: l, on: !0 }), this._overrides.set(e.entity, { vol: l, on: !0, until: 1 / 0 }), this.requestUpdate(), n(l);
    };
    this._track(r, o, (a) => {
      const l = this._pct(r, a);
      this._bump(e.entity, { vol: l, on: !0 }), this._sendVolume(e.entity, l);
    }), o(t);
  }
  _sendMaster(t, e) {
    for (const [s, r] of Ct(t, e)) this._sendVolume(s, r);
  }
  _masterDragStart(t, e) {
    const s = this._hass;
    if (!s) return;
    let r = e.filter((l) => l.on && l.available);
    if (!r.length) {
      if (r = e.filter((l) => l.available && !l.notInGroup).map((l) => ({ ...l, on: !0, vol: 0 })), !r.length) return;
      this.run(O(s, r.map((l) => l.entity), !1));
    }
    const n = this._capture(t);
    for (const l of r) this._lastSent.delete(l.entity);
    this._masterThrottle || (this._masterThrottle = Ut((l) => this._sendMaster(this._masterBase, l), zt)), this._masterBase = r;
    const o = (l, c) => {
      for (const [d, p] of Ct(r, l))
        this._remember(d, { vol: p, on: !0 }), this._overrides.set(d, { vol: p, on: !0, until: c });
      this.requestUpdate();
    }, a = (l) => {
      const c = this._pct(n, l);
      o(c, 1 / 0), this._masterThrottle(c);
    };
    this._track(n, a, (l) => {
      const c = this._pct(n, l);
      o(c, Date.now() + Z), this._sendMaster(r, c), window.setTimeout(() => this.requestUpdate(), Z + 50);
    }), a(t);
  }
  // ---- seek --------------------------------------------------------------
  _seekStart(t, e, s) {
    if (!e.duration) return;
    const r = this._capture(t), n = e.duration, o = (l) => {
      const c = r.getBoundingClientRect();
      return Mt((l.clientX - c.left) / c.width) * n;
    }, a = (l) => {
      this._seek = { pos: o(l), until: 1 / 0, stamp: e.positionUpdatedAt }, this.requestUpdate();
    };
    this._track(r, a, (l) => {
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
    return je(t, e);
  }
  // ---- misc --------------------------------------------------------------
  run(t) {
    t && t.catch((e) => this.showToast(X(e)));
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
   * Card frame. Two-column layout: header + playlists on the left, now-playing
   * above the speaker section on the right. In the vertical layout both columns
   * are `display: contents` and CSS `order` pushes the now-playing bar last, which
   * gives the classic stack: header, playlists, speakers, now-playing.
   */
  renderShell(t, e) {
    var r;
    const s = ((r = this.section) == null ? void 0 : r.layout) ?? "vertical";
    return h`<ha-card>
      <div class=${g({ card: !0, horizontal: s === "horizontal", auto: s === "auto" })}>
        <div class="col-left">${t.header}${t.playlists}</div>
        <div class="col-right">${t.now}${t.speakers}</div>
        ${e}
      </div>
    </ha-card>`;
  }
  renderHeader(t, e) {
    const s = e.filter((r) => r.on).length;
    return h`<div class="header">
      <div class="header-text">
        <span class="title">${t}</span>
        <span class="summary ellipsis">${ze(e)}</span>
      </div>
      <button class="pill" title="Choose speakers" @click=${() => this._pickerOpen = !this._pickerOpen}>
        ${x.airplay}<span>${s}</span>
      </button>
    </div>`;
  }
  renderSpeakerSection(t) {
    const e = this.section, s = t.filter((o) => o.on).length, r = Te(t, e.presets, e.preset_tolerance), n = t.slice(0, e.speaker_count);
    return h`
      <div class="section-head">
        <span class="label">Speakers</span>
        <button class="text-btn" @click=${() => this._muteAll(t, s > 0)}>
          ${s > 0 ? "Mute all" : "Play on all"}
        </button>
      </div>
      ${e.presets.length ? h`<div class="presets">
            ${e.presets.map(
      (o) => h`<button class=${g({ preset: !0, active: r === o.name })} @click=${() => this.applyPreset(t, o)}>
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
    const e = Me(t);
    return h`<div class=${g({ "speaker-row": !0, master: !0, on: e !== null })} title="Master volume: scales every speaker that is on">
      <span class="dot" role="img" aria-label="Master volume">${x.volume}</span>
      <span class="sp-name ellipsis">All</span>
      <div class="track-hit" @pointerdown=${(r) => this._masterDragStart(r, t)}>
        <div class="track"><div class="fill" style=${I({ width: `${e ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${e ?? "–"}</span>
    </div>`;
  }
  renderSpeaker(t) {
    const e = t.available ? t.notInGroup ? "Not in the Cast group: add it in the Google Home app" : t.standby ? "Idle" : "Toggle speaker" : "Unavailable";
    return h`<div
      class=${g({ "speaker-row": !0, on: t.on, unavailable: !t.available, standby: t.standby, orphan: t.notInGroup })}
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
      (s) => h`<button class=${g({ "sheet-row": !0, on: s.on })} ?disabled=${!s.available} @click=${() => this._toggle(s)}>
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
    return this._toast ? h`<div class="toast">${this._toast}</div>` : u;
  }
  renderArt(t, e, s, r, n = !1) {
    const o = !!e && !this._broken.has(s);
    return h`<div class=${g({ art: !0, [t]: !0, pulse: n })}>
      <div class="stripes"></div>
      ${o ? h`<img
            src=${e}
            alt=""
            loading="lazy"
            @load=${(a) => a.target.classList.add("loaded")}
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
        (n) => h`<div class=${g({ "list-row": !0, first: n === 0 })}>
                ${this.renderArt("list-art", null, `ph${n}`, n, !0)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`
      )}
          </div>` : h`<div class="tiles" style=${I({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
            ${r.map(
        (n) => h`<div class="tile">${this.renderArt("tile-art", null, `ph${n}`, n, !0)}<span class="tile-name">&nbsp;</span></div>`
      )}
          </div>`;
    }
    const e = t.playlists.slice(0, t.count);
    return t.layout === "list" ? h`<div class="list">
        ${e.map(
      (s, r) => h`<button class=${g({ "list-row": !0, first: r === 0, active: s.uri === t.activeUri })} @click=${() => t.onPlay(s)}>
            ${this.renderArt("list-art", s.image, s.uri, r)}
            <span class="list-name ellipsis">${s.name}</span>
            <span class="list-play">${x.playSmall}</span>
          </button>`
    )}
      </div>` : h`<div class="tiles" style=${I({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
      ${e.map(
      (s, r) => h`<button class=${g({ tile: !0, active: s.uri === t.activeUri })} title=${s.name} @click=${() => t.onPlay(s)}>
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
    const r = this.position(t, e), n = t.duration ?? 0, o = n > 0 ? r / n * 100 : 0, a = t.found && (t.state === "unavailable" || t.state === "unknown");
    let l = s.title ?? t.title;
    s.title || (t.found ? a ? l = "Player unavailable" : l || (l = t.state === "playing" ? "Playing" : t.state === "paused" ? "Paused" : "Nothing playing") : l = "Player not found");
    const c = s.subtitle ?? t.artist, d = s.disabled || !t.found || a, p = !d && n > 0;
    return h`<div class=${g({ now: !0, paused: !t.playing && !s.busy, busy: !!s.busy })}>
      <div class="now-row">
        ${this.renderArt("now-art", t.art, `now:${t.art ?? ""}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            ${s.busy ? h`<span class="spinner" aria-label="Starting"></span>` : h`<div class="eq"><div></div><div></div><div></div></div>`}
            <span class="now-title ellipsis">${l}</span>
          </div>
          <span class="now-artist ellipsis">${c}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${d} @click=${() => this.run(s.onPrev())}>${x.prev}</button>
          <button class="play" title=${t.playing ? "Pause" : "Play"} ?disabled=${d} @click=${() => this.run(s.onPlayPause())}>
            ${t.playing ? x.pause : x.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${d} @click=${() => this.run(s.onNext())}>${x.next}</button>
        </div>
      </div>
      <div class=${g({ "progress-hit": !0, disabled: !p })} @pointerdown=${(f) => p && this._seekStart(f, t, s.onSeek)}>
        <div class="progress"><div class="progress-fill" style=${I({ width: `${o.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${Tt(r)}</span><span>${n > 0 ? `-${Tt(n - r)}` : "–:––"}</span></div>
      </div>
    </div>`;
  }
};
mt.styles = Ne;
let W = mt;
Jt([
  v()
], W.prototype, "_pickerOpen");
Jt([
  v()
], W.prototype, "_toast");
function ut(i) {
  const t = i && typeof i == "object" ? i.response : void 0, e = t && typeof t == "object" ? t.result ?? t : {};
  return e && typeof e == "object" ? e : {};
}
function _(i, ...t) {
  if (i) {
    for (const e of t) if (i[e] !== void 0 && i[e] !== null) return i[e];
  }
}
function Qt(i) {
  const t = _(i, "items", "Items");
  return Array.isArray(t) ? t.filter((e) => e && typeof e == "object") : [];
}
function te(i) {
  const t = _(i, "uri", "Uri"), e = _(i, "name", "Name");
  if (typeof t != "string" || typeof e != "string") return null;
  let s = _(i, "image_url", "ImageUrl");
  if (!s) {
    const r = _(i, "images", "Images");
    Array.isArray(r) && r[0] && (s = _(r[0], "url", "Url"));
  }
  return { uri: t, name: e, image: typeof s == "string" && s ? s : null };
}
function Ve(i) {
  const t = [];
  for (const e of Qt(ut(i))) {
    const s = _(e, "context", "Context"), r = s ? _(s, "uri", "Uri") ?? null : null, n = _(e, "played_at_ms", "PlayedAtMS"), o = _(e, "played_at", "PlayedAt"), a = typeof n == "number" ? n : typeof o == "string" ? Date.parse(o) : NaN;
    if (!Number.isFinite(a)) continue;
    const l = _(e, "track", "Track");
    t.push({ contextUri: r, playedAt: a, trackName: (l && _(l, "name", "Name")) ?? "" });
  }
  return t;
}
const ft = (i, t, e) => i.callService("spotifyplus", t, e, void 0, !1, !0);
async function Fe(i, t, e) {
  const s = { entity_id: t, limit: 50 };
  e && e > 0 && (s.after = e);
  const r = await ft(i, "get_player_recent_tracks", s);
  return Ve(r).sort((n, o) => o.playedAt - n.playedAt);
}
async function Ge(i, t, e = 50) {
  const s = await ft(i, "get_playlist_favorites", { entity_id: t, limit: e });
  return Qt(ut(s)).map(te).filter((r) => !!r);
}
async function We(i, t, e) {
  const s = e.split(":").pop() ?? e, r = await ft(i, "get_playlist", { entity_id: t, playlist_id: s }), n = te(ut(r));
  return n ? { ...n, uri: e } : null;
}
const Ye = (i, t, e, s, r) => i.callService("spotifyplus", "player_media_play_context", {
  entity_id: t,
  context_uri: e,
  device_id: s,
  shuffle: r
}), Ze = (i, t) => i.callService("spotifyplus", "get_spotify_connect_devices", { entity_id: t, refresh: !0 }, void 0, !1, !0);
async function Ke(i, t) {
  const e = await i.callWS({ type: "frontend/get_user_data", key: t });
  return (e == null ? void 0 : e.value) ?? null;
}
async function Xe(i, t, e) {
  await i.callWS({ type: "frontend/set_user_data", key: t, value: e });
}
const Ot = { version: 1, lastSeen: 0, entries: {} };
function Je(i) {
  return typeof i == "string" && /^spotify:playlist:[A-Za-z0-9]+$/.test(i);
}
function Qe(i, t) {
  const e = { ...i.entries };
  let s = i.lastSeen;
  for (const r of t) {
    if (r.playedAt <= i.lastSeen || (s = Math.max(s, r.playedAt), !Je(r.contextUri))) continue;
    const n = e[r.contextUri];
    e[r.contextUri] = n ? { ...n, plays: n.plays + 1, lastPlayed: Math.max(n.lastPlayed, r.playedAt) } : { uri: r.contextUri, name: "", image: null, lastPlayed: r.playedAt, plays: 1 };
  }
  return { version: 1, lastSeen: s, entries: e };
}
function ts(i, t, e) {
  const s = i.entries[t.uri];
  return {
    ...i,
    entries: {
      ...i.entries,
      [t.uri]: s ? { ...s, name: t.name || s.name, image: t.image ?? s.image, lastPlayed: Math.max(s.lastPlayed, e) } : { uri: t.uri, name: t.name, image: t.image, lastPlayed: e, plays: 0 }
    }
  };
}
function Rt(i, t) {
  let e = !1;
  const s = { ...i.entries };
  for (const r of t) {
    const n = s[r.uri];
    n && (n.name !== r.name || r.image && n.image !== r.image) && (s[r.uri] = { ...n, name: r.name, image: r.image ?? n.image }, e = !0);
  }
  return e ? { ...i, entries: s } : i;
}
function Nt(i) {
  return Object.values(i.entries).filter((t) => !t.name).map((t) => t.uri);
}
function es(i, t, e) {
  const s = Object.values(i.entries).filter((r) => r.name);
  return s.sort((r, n) => t === "play_count" && n.plays - r.plays || n.lastPlayed - r.lastPlayed), s.slice(0, e).map((r) => ({ uri: r.uri, name: r.name, image: r.image }));
}
function ss(i, t, e) {
  if (i.length >= e) return i.slice(0, e);
  const s = new Set(i.map((n) => n.uri)), r = [...i];
  for (const n of t) {
    if (r.length >= e) break;
    s.has(n.uri) || (s.add(n.uri), r.push({ uri: n.uri, name: n.name, image: n.image }));
  }
  return r;
}
function is(i, t = 200) {
  const e = Object.values(i.entries);
  if (e.length <= t) return i;
  e.sort((r, n) => n.lastPlayed - r.lastPlayed);
  const s = {};
  for (const r of e.slice(0, t)) s[r.uri] = r;
  return { ...i, entries: s };
}
function rs(i) {
  return !!i && typeof i == "object" && i.version === 1 && typeof i.entries == "object";
}
var ns = Object.defineProperty, os = Object.getOwnPropertyDescriptor, et = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? os(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && ns(t, e, r), r;
};
const as = [
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
      { name: "tile_columns", selector: { number: { min: 2, max: 8, mode: "box" } } },
      { name: "tile_columns_wide", selector: { number: { min: 2, max: 8, mode: "box" } } },
      { name: "speaker_count", selector: { number: { min: 1, max: 50, mode: "box" } } },
      { name: "preset_tolerance", selector: { number: { min: 0, max: 50, mode: "box" } } }
    ]
  },
  { name: "layout", selector: { select: { mode: "dropdown", options: [{ value: "vertical", label: "Vertical" }, { value: "horizontal", label: "Horizontal (playlists left, speakers right)" }, { value: "auto", label: "Auto (horizontal when wide)" }] } } },
  { name: "default_preset", selector: { text: {} } },
  { name: "master_volume", selector: { boolean: {} } },
  { name: "fill_with_favorites", selector: { boolean: {} } },
  { name: "history_key", selector: { text: {} } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } }
], ls = {
  spotifyplus_entity: "SpotifyPlus player",
  cast_group_entity: "Google Cast entity of the speaker group",
  device_name: "Spotify Connect device name to play on (e.g. Alla)",
  speakers: "Speakers (Google Cast entities)",
  control_via: "Now playing / transport via",
  shuffle: "Start playlists shuffled",
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
  fill_with_favorites: "Fill empty slots with my own playlists",
  history_key: "Play history key (shared by cards using the same key)",
  title: "Title",
  accent: "Accent color (CSS)"
};
let j = class extends R {
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
        const s = await ((i = window.loadCardHelpers) == null ? void 0 : i.call(window)), r = s == null ? void 0 : s.createCardElement({ type: "entities", entities: [] });
        (e = r == null ? void 0 : (t = r.constructor).getConfigElement) == null || e.call(t), await customElements.whenDefined("ha-form");
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
    const r = (t.speakers ?? []).map((o) => s.has(o) ? { entity: o, name: s.get(o) } : o), n = { ...e, ...t, speakers: r };
    for (const o of Object.keys(n)) {
      const a = n[o];
      (a === "" || a === void 0 || a === null) && delete n[o];
    }
    this._config = n, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: n }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._ready ? u : h`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${as}
        .computeLabel=${(i) => ls[i.name] ?? i.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
j.styles = Dt`
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
et([
  Gt({ attribute: !1 })
], j.prototype, "hass", 2);
et([
  v()
], j.prototype, "_config", 2);
et([
  v()
], j.prototype, "_ready", 2);
j = et([
  Ft("spotifyplus-media-card-editor")
], j);
var cs = Object.defineProperty, ps = Object.getOwnPropertyDescriptor, S = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ps(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && cs(t, e, r), r;
};
const ds = 6e4, hs = 6e4, us = 10 * 6e4, fs = 60 * 6e4, ms = 5;
let $ = class extends W {
  constructor() {
    super(...arguments), this._history = Ot, this._plStatus = "idle", this._plError = "", this._activeUri = null, this._starting = null, this._favorites = [], this._favoritesAt = 0, this._refreshing = !1, this._historyLoaded = !1;
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
    var r, n, o;
    const t = Object.values((i == null ? void 0 : i.states) ?? {}).filter((a) => a.entity_id.startsWith("media_player.")), e = ((r = t.find((a) => a.entity_id.includes("spotifyplus"))) == null ? void 0 : r.entity_id) ?? "media_player.spotifyplus", s = t.filter((a) => typeof a.attributes.app_id == "string" || typeof a.attributes.app_name == "string");
    return {
      spotifyplus_entity: e,
      cast_group_entity: ((n = s[0]) == null ? void 0 : n.entity_id) ?? "media_player.your_cast_group",
      device_name: ((o = s[0]) == null ? void 0 : o.attributes.friendly_name) ?? "Speaker group",
      speakers: s.slice(1, 5).map((a) => a.entity_id),
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  setConfig(i) {
    const t = this._config, e = Se(i);
    this._config = e, (!t || t.history_key !== e.history_key || t.spotifyplus_entity !== e.spotifyplus_entity) && (this._historyLoaded = !1, this._history = Ot, this._plStatus = "idle", this._hass && this._refresh());
  }
  hassChanged(i, t) {
    this._checkStarted(i), t && this._plStatus === "idle" && this._refresh();
  }
  connectedCallback() {
    super.connectedCallback(), this._intervalTimer = window.setInterval(() => {
      document.visibilityState === "visible" && this._refresh();
    }, us), this._hass && this._config && this._plStatus !== "loading" && this._refresh();
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
    const t = es(this._history, i.playlist_sort, i.playlist_count);
    return i.fill_with_favorites ? ss(t, this._favorites, i.playlist_count) : t;
  }
  async _ensureFavorites(i, t) {
    Date.now() - this._favoritesAt < fs || (this._favorites = await Ge(i, t.spotifyplus_entity, 50), this._favoritesAt = Date.now());
  }
  async _refresh() {
    const i = this._hass, t = this._config;
    if (!(!i || !t || this._refreshing)) {
      this._refreshing = !0, Object.keys(this._history.entries).length || (this._plStatus = "loading");
      try {
        if (!this._historyLoaded) {
          const n = await Ke(i, t.history_key);
          rs(n) && (this._history = n), this._historyLoaded = !0;
        }
        const e = this._history, s = await Fe(i, t.spotifyplus_entity, e.lastSeen);
        let r = Qe(e, s);
        t.fill_with_favorites && await this._ensureFavorites(i, t), r = await this._fillMeta(i, t, r), r = is(r), this._history = r, this._plStatus = "ready", this._plError = "", r !== e && await Xe(i, t.history_key, r);
      } catch (e) {
        this._plStatus = "error", this._plError = X(e);
      } finally {
        this._refreshing = !1;
      }
    }
  }
  /** Names and artwork for playlists we only know by uri: favourites first, then single lookups. */
  async _fillMeta(i, t, e) {
    let s = Nt(e);
    if (!s.length) return e;
    await this._ensureFavorites(i, t), e = Rt(e, this._favorites), s = Nt(e);
    const r = [];
    for (const n of s.slice(0, ms))
      try {
        const o = await We(i, t.spotifyplus_entity, n);
        o ? r.push(o) : r.push({ uri: n, name: "Playlist", image: null });
      } catch {
      }
    return Rt(e, r);
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
    this.applyDefaultPresetIfCold(t, Ue(t, e.cast_group_entity)), this._starting = { uri: i.uri, since: Date.now() }, this._activeUri = i.uri, this._history = ts(this._history, i, Date.now()), this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
      var o;
      ((o = this._starting) == null ? void 0 : o.uri) === i.uri && (this._starting = null, this.showToast(`${e.device_name} did not start within 60 s. Check the speakers and try again.`, 6e3));
    }, ds);
    const r = () => Ye(t, e.spotifyplus_entity, i.uri, e.device_name, e.shuffle);
    r().catch(async (o) => {
      var a;
      this.showToast(`${X(o)} Retrying with a refreshed device list…`, 6e3), await Ze(t, e.spotifyplus_entity), ((a = this._starting) == null ? void 0 : a.uri) === i.uri && await r();
    }).then(() => this._scheduleRefresh(hs)).catch((o) => {
      this._starting = null, this.showToast(X(o), 8e3);
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
    var P, yt, _t;
    const i = this._config, t = this._hass;
    if (!i) return u;
    if (!t) return h`<ha-card><div class="card"></div></ha-card>`;
    const e = Date.now(), s = this.speakers(t, e), r = Ce(t, this._playerEntity), n = ((P = t.states[i.spotifyplus_entity]) == null ? void 0 : P.attributes) ?? {}, o = typeof n.media_playlist == "string" && n.media_playlist || ((yt = this._history.entries[this._activeUri ?? ""]) == null ? void 0 : yt.name) || "", a = this._starting, l = a ? ((_t = this._history.entries[a.uri]) == null ? void 0 : _t.name) || "playlist" : "", c = r.found && (r.state === "unavailable" || r.state === "unknown"), d = this._playerEntity, p = this.renderHeader(i.title, s), f = this.renderPlaylists({
      layout: i.playlist_layout,
      count: i.playlist_count,
      columns: i.tile_columns,
      columnsWide: i.tile_columns_wide,
      playlists: this._playlists,
      status: this._plStatus,
      error: this._plError,
      activeUri: this._activeUri,
      onPlay: (st) => this._play(st),
      onRetry: () => void this._refresh()
    }), y = this.renderNowBar(r, e, {
      title: a ? `Starting on ${i.device_name}…` : void 0,
      subtitle: a ? `${l} · ${Math.round((e - a.since) / 1e3)} s` : !r.found || c ? d : [r.artist, o].filter(Boolean).join(" · "),
      busy: !!a,
      disabled: !!a,
      onPrev: () => Ie(t, d),
      onPlayPause: () => He(t, d),
      onNext: () => De(t, d),
      onSeek: (st) => Le(t, d, st)
    });
    return this.renderShell({ header: p, playlists: f, speakers: this.renderSpeakerSection(s), now: y }, [this.renderPicker(s), this.renderToast()]);
  }
};
S([
  v()
], $.prototype, "_config", 2);
S([
  v()
], $.prototype, "_history", 2);
S([
  v()
], $.prototype, "_plStatus", 2);
S([
  v()
], $.prototype, "_plError", 2);
S([
  v()
], $.prototype, "_activeUri", 2);
S([
  v()
], $.prototype, "_starting", 2);
S([
  v()
], $.prototype, "_favorites", 2);
$ = S([
  Ft("spotifyplus-media-card")
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
