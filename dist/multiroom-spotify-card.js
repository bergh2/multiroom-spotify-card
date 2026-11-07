/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, kt = rt.ShadowRoot && (rt.ShadyCSS === void 0 || rt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $t = Symbol(), Ot = /* @__PURE__ */ new WeakMap();
let re = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== $t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (kt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Ot.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Ot.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const we = (i) => new re(typeof i == "string" ? i : i + "", void 0, $t), ae = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new re(e, i, $t);
}, xe = (i, t) => {
  if (kt) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = rt.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, zt = kt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return we(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ke, defineProperty: $e, getOwnPropertyDescriptor: Se, getOwnPropertyNames: Ae, getOwnPropertySymbols: Pe, getPrototypeOf: Te } = Object, M = globalThis, Dt = M.trustedTypes, Ee = Dt ? Dt.emptyScript : "", ut = M.reactiveElementPolyfillSupport, X = (i, t) => i, at = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ee : null;
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
} }, St = (i, t) => !ke(i, t), Rt = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: St };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), M.litPropertyMetadata ?? (M.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let N = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && $e(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = Se(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: n, set(a) {
      const o = n == null ? void 0 : n.call(this);
      r == null || r.call(this, a), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(X("elementProperties"))) return;
    const t = Te(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(X("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(X("properties"))) {
      const e = this.properties, s = [...Ae(e), ...Pe(e)];
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
      for (const n of s) e.unshift(zt(n));
    } else t !== void 0 && e.push(zt(t));
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
    return xe(t, this.constructor.elementStyles), t;
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
      const a = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : at).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, a;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : at;
      this._$Em = n;
      const p = l.fromAttribute(e, o.type);
      this[n] = p ?? ((a = this._$Ej) == null ? void 0 : a.get(n)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    var a;
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? St)(r, e) || s.useDefault && s.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, a] of n) {
        const { wrapped: o } = a, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, a, l);
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[X("elementProperties")] = /* @__PURE__ */ new Map(), N[X("finalized")] = /* @__PURE__ */ new Map(), ut == null || ut({ ReactiveElement: N }), (M.reactiveElementVersions ?? (M.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, It = (i) => i, ot = Z.trustedTypes, Nt = ot ? ot.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, oe = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + C, Ce = `<${le}>`, I = document, J = () => I.createComment(""), Q = (i) => i === null || typeof i != "object" && typeof i != "function", At = Array.isArray, Me = (i) => At(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", ht = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, jt = /-->/g, Ht = />/g, z = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Lt = /'/g, Bt = /"/g, ce = /^(?:script|style|textarea|title)$/i, pe = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), u = pe(1), k = pe(2), U = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), qt = /* @__PURE__ */ new WeakMap(), D = I.createTreeWalker(I, 129);
function de(i, t) {
  if (!At(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Nt !== void 0 ? Nt.createHTML(t) : t;
}
const Ue = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = W;
  for (let o = 0; o < e; o++) {
    const l = i[o];
    let p, d, c = -1, h = 0;
    for (; h < l.length && (a.lastIndex = h, d = a.exec(l), d !== null); ) h = a.lastIndex, a === W ? d[1] === "!--" ? a = jt : d[1] !== void 0 ? a = Ht : d[2] !== void 0 ? (ce.test(d[2]) && (n = RegExp("</" + d[2], "g")), a = z) : d[3] !== void 0 && (a = z) : a === z ? d[0] === ">" ? (a = n ?? W, c = -1) : d[1] === void 0 ? c = -2 : (c = a.lastIndex - d[2].length, p = d[1], a = d[3] === void 0 ? z : d[3] === '"' ? Bt : Lt) : a === Bt || a === Lt ? a = z : a === jt || a === Ht ? a = W : (a = z, n = void 0);
    const _ = a === z && i[o + 1].startsWith("/>") ? " " : "";
    r += a === W ? l + Ce : c >= 0 ? (s.push(p), l.slice(0, c) + oe + l.slice(c) + C + _) : l + C + (c === -2 ? o : _);
  }
  return [de(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class tt {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const o = t.length - 1, l = this.parts, [p, d] = Ue(t, e);
    if (this.el = tt.createElement(p, s), D.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = D.nextNode()) !== null && l.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const c of n.getAttributeNames()) if (c.endsWith(oe)) {
          const h = d[a++], _ = n.getAttribute(c).split(C), A = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: r, name: A[2], strings: _, ctor: A[1] === "." ? ze : A[1] === "?" ? De : A[1] === "@" ? Re : lt }), n.removeAttribute(c);
        } else c.startsWith(C) && (l.push({ type: 6, index: r }), n.removeAttribute(c));
        if (ce.test(n.tagName)) {
          const c = n.textContent.split(C), h = c.length - 1;
          if (h > 0) {
            n.textContent = ot ? ot.emptyScript : "";
            for (let _ = 0; _ < h; _++) n.append(c[_], J()), D.nextNode(), l.push({ type: 2, index: ++r });
            n.append(c[h], J());
          }
        }
      } else if (n.nodeType === 8) if (n.data === le) l.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = n.data.indexOf(C, c + 1)) !== -1; ) l.push({ type: 7, index: r }), c += C.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = I.createElement("template");
    return s.innerHTML = t, s;
  }
}
function B(i, t, e = i, s) {
  var a, o;
  if (t === U) return t;
  let n = s !== void 0 ? (a = e._$Co) == null ? void 0 : a[s] : e._$Cl;
  const r = Q(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((o = n == null ? void 0 : n._$AO) == null || o.call(n, !1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = B(i, n._$AS(i, t.values), n, s)), t;
}
class Oe {
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
    const { el: { content: e }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? I).importNode(e, !0);
    D.currentNode = n;
    let r = D.nextNode(), a = 0, o = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let p;
        l.type === 2 ? p = new st(r, r.nextSibling, this, t) : l.type === 1 ? p = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (p = new Ie(r, this, t)), this._$AV.push(p), l = s[++o];
      }
      a !== (l == null ? void 0 : l.index) && (r = D.nextNode(), a++);
    }
    return D.currentNode = I, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class st {
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
    t = B(this, t, e), Q(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Me(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && Q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(I.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = tt.createElement(de(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const a = new Oe(n, this), o = a.u(this.options);
      a.p(e), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = qt.get(t.strings);
    return e === void 0 && qt.set(t.strings, e = new tt(t)), e;
  }
  k(t) {
    At(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new st(this.O(J()), this.O(J()), this, this.options)) : s = e[n], s._$AI(r), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = It(t).nextSibling;
      It(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class lt {
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
    let a = !1;
    if (r === void 0) t = B(this, t, e, 0), a = !Q(t) || t !== this._$AH && t !== U, a && (this._$AH = t);
    else {
      const o = t;
      let l, p;
      for (t = r[0], l = 0; l < r.length - 1; l++) p = B(this, o[s + l], e, l), p === U && (p = this._$AH[l]), a || (a = !Q(p) || p !== this._$AH[l]), p === f ? t = f : t !== f && (t += (p ?? "") + r[l + 1]), this._$AH[l] = p;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ze extends lt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class De extends lt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class Re extends lt {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = B(this, t, e, 0) ?? f) === U) return;
    const s = this._$AH, n = t === f && s !== f || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== f && (s === f || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ie {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    B(this, t);
  }
}
const ft = Z.litHtmlPolyfillSupport;
ft == null || ft(tt, st), (Z.litHtmlVersions ?? (Z.litHtmlVersions = [])).push("3.3.3");
const Ne = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = n = new st(t.insertBefore(J(), r), r, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis;
let L = class extends N {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ne(e, this.renderRoot, this.renderOptions);
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
    return U;
  }
};
var ne;
L._$litElement$ = !0, L.finalized = !0, (ne = R.litElementHydrateSupport) == null || ne.call(R, { LitElement: L });
const mt = R.litElementPolyfillSupport;
mt == null || mt({ LitElement: L });
(R.litElementVersions ?? (R.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = { attribute: !0, type: String, converter: at, reflect: !1, hasChanged: St }, He = (i = je, t, e) => {
  const { kind: s, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(e.name, i), s === "accessor") {
    const { name: a } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(a, l, i, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, i, o), o;
    } };
  }
  if (s === "setter") {
    const { name: a } = e;
    return function(o) {
      const l = this[a];
      t.call(this, o), this.requestUpdate(a, l, i, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function he(i) {
  return (t, e) => typeof e == "object" ? He(i, t, e) : ((s, n, r) => {
    const a = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(i) {
  return he({ ...i, state: !0, attribute: !1 });
}
const Le = "oklch(0.62 0.16 285)";
function m(i, t) {
  throw new Error(`${i}: ${t}`);
}
function xt(i) {
  return typeof i == "string" && /^media_player\.[a-z0-9_]+$/.test(i);
}
function K(i, t, e, s, n, r) {
  if (t == null || t === "") return r;
  const a = typeof t == "string" ? Number(t) : t;
  return (typeof a != "number" || !Number.isInteger(a) || a < s || a > n) && m(i, `${e} must be an integer between ${s} and ${n}`), a;
}
function Be(i, t) {
  (!Array.isArray(t) || t.length === 0) && m(i, "speakers must be a non-empty list of Google Cast media_player entities");
  const e = [], s = /* @__PURE__ */ new Set();
  for (const n of t) {
    const r = typeof n == "string" ? n : n == null ? void 0 : n.entity;
    xt(r) || m(i, `speaker "${String(r)}" is not a media_player entity`), s.has(r) && m(i, `speaker ${r} is listed twice`), s.add(r);
    const a = typeof n == "object" && n && typeof n.name == "string" && n.name.trim() ? n.name.trim() : void 0;
    e.push(a ? { entity: r, name: a } : { entity: r });
  }
  return e;
}
function qe(i, t, e) {
  if (t == null) return [];
  Array.isArray(t) || m(i, "presets must be a list");
  const s = new Set(e.map((r) => r.entity)), n = /* @__PURE__ */ new Set();
  return t.map((r, a) => {
    const o = typeof (r == null ? void 0 : r.name) == "string" ? r.name.trim() : "";
    o || m(i, `preset #${a + 1} needs a name`), n.has(o) && m(i, `preset "${o}" is defined twice`), n.add(o);
    const l = r.levels ?? {};
    (typeof l != "object" || Array.isArray(l)) && m(i, `preset "${o}": levels must be a map of entity -> volume`);
    const p = {};
    for (const [d, c] of Object.entries(l)) {
      s.has(d) || m(i, `preset "${o}": ${d} is not in speakers`);
      const h = typeof c == "string" ? Number(c) : c;
      (typeof h != "number" || !Number.isInteger(h) || h < 0 || h > 100) && m(i, `preset "${o}": volume for ${d} must be an integer 0-100`), p[d] = h;
    }
    return { name: o, levels: p };
  });
}
function Ve(i, t) {
  const e = Be(i, t.speakers), s = qe(i, t.presets, e), n = typeof t.default_preset == "string" ? t.default_preset.trim() : "";
  n && !s.some((o) => o.name === n) && m(i, `default_preset "${n}" is not one of the presets`);
  const r = t.layout ?? "vertical";
  ["vertical", "horizontal", "auto"].includes(r) || m(i, 'layout must be "vertical", "horizontal" or "auto"');
  const a = t.master_style ?? "panel";
  return ["plain", "panel", "tree"].includes(a) || m(i, 'master_style must be "plain", "panel" or "tree"'), {
    layout: r,
    master_label: j(t.master_label, "All"),
    master_style: a,
    speakers: e,
    presets: s,
    speaker_count: K(i, t.speaker_count, "speaker_count", 1, 50, e.length),
    preset_tolerance: K(i, t.preset_tolerance, "preset_tolerance", 0, 50, 3),
    master_volume: t.master_volume !== !1,
    default_preset: n
  };
}
function Fe(i, t) {
  const e = t.playlist_layout ?? "tiles";
  e !== "tiles" && e !== "list" && m(i, 'playlist_layout must be "tiles" or "list"');
  const s = t.playlist_sort ?? "last_played";
  s !== "last_played" && s !== "play_count" && m(i, 'playlist_sort must be "last_played" or "play_count"');
  const n = K(i, t.tile_columns, "tile_columns", 2, 8, 3);
  return {
    playlist_layout: e,
    playlist_sort: s,
    playlist_count: K(i, t.playlist_count, "playlist_count", 1, 50, e === "list" ? 10 : 6),
    tile_columns: n,
    /** playlists per row when the card renders two columns (horizontal / auto when wide) */
    tile_columns_wide: K(i, t.tile_columns_wide, "tile_columns_wide", 2, 8, n)
  };
}
function j(i, t) {
  return typeof i == "string" && i.trim() ? i.trim() : t;
}
const x = "multiroom-spotify-card";
function Ge(i) {
  (!i || typeof i != "object") && m(x, "invalid configuration");
  const t = i.backend ?? "spotifyplus";
  t !== "spotifyplus" && t !== "spotcast" && m(x, 'backend must be "spotifyplus" or "spotcast"');
  const e = i.spotifyplus_entity ?? "media_player.spotifyplus";
  t === "spotifyplus" && !xt(e) && m(x, "spotifyplus_entity must be the SpotifyPlus media_player entity"), xt(i.cast_group_entity) || m(x, "cast_group_entity must be the Google Cast media_player entity of your speaker group");
  const s = j(i.device_name, "");
  t === "spotifyplus" && !s && m(x, 'device_name is required (the Spotify Connect name of your speaker group, e.g. "Alla")');
  const n = i.control_via ?? "cast";
  return n !== "cast" && n !== "spotifyplus" && m(x, 'control_via must be "cast" or "spotifyplus"'), t === "spotcast" && n === "spotifyplus" && m(x, "control_via: spotifyplus needs backend: spotifyplus"), {
    type: i.type,
    backend: t,
    spotifyplus_entity: e,
    spotcast_account: j(i.spotcast_account, ""),
    cast_group_entity: i.cast_group_entity,
    device_name: s,
    control_via: n,
    shuffle: i.shuffle === !0,
    ...Ve(x, i),
    ...Fe(x, i),
    history_key: j(i.history_key, "multiroom-spotify-card"),
    fill_with_favorites: i.fill_with_favorites !== !1,
    start_script: (() => {
      const r = j(i.start_script, "");
      return r && !/^script\.[a-z0-9_]+$/.test(r) && m(x, "start_script must be a script entity id like script.multiroom_spotify_start"), r;
    })(),
    title: typeof i.title == "string" ? i.title : "Listening",
    accent: j(i.accent, Le)
  };
}
const We = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Ye(i, t, e) {
  var n;
  const s = ((n = i.states[e]) == null ? void 0 : n.state) === "playing";
  return t.map((r) => {
    const a = i.states[r.entity], o = (a == null ? void 0 : a.attributes) ?? {}, l = !!a && !We.has(a.state), p = typeof o.volume_level == "number", d = p ? o.volume_level : 0, c = o.is_volume_muted === !0, h = l && !p, _ = typeof o.friendly_name == "string" ? o.friendly_name : void 0;
    return {
      entity: r.entity,
      name: r.name ?? _ ?? r.entity.replace("media_player.", ""),
      vol: Math.round(d * 100),
      on: l && !h && !c,
      available: l,
      standby: h,
      notInGroup: s && h
    };
  });
}
function Xe(i, t) {
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
function Ze(i, t, e) {
  const s = i.filter((n) => n.available && !n.standby);
  if (!s.length) return null;
  for (const n of t) {
    let r = !0;
    for (const a of s) {
      const o = n.levels[a.entity];
      if (o === void 0) {
        if (a.on) {
          r = !1;
          break;
        }
      } else if (!a.on || Math.abs(a.vol - o) > e) {
        r = !1;
        break;
      }
    }
    if (r) return n.name;
  }
  return null;
}
function Vt(i) {
  const t = i.filter((e) => e.on);
  return t.length ? Math.round(t.reduce((e, s) => e + s.vol, 0) / t.length) : null;
}
function Ft(i, t) {
  const e = /* @__PURE__ */ new Map(), s = i.filter((a) => a.on);
  if (!s.length) return e;
  const n = s.reduce((a, o) => a + o.vol, 0) / s.length, r = Math.max(0, Math.min(100, t));
  for (const a of s) {
    const o = n > 0 && a.vol > 0 ? a.vol * r / n : r;
    e.set(a.entity, Math.max(0, Math.min(100, Math.round(o))));
  }
  return e;
}
function Ke(i, t) {
  const e = i.states[t];
  return e ? !["playing", "paused", "buffering", "on"].includes(e.state) : !0;
}
function Je(i) {
  const t = i.filter((e) => e.on);
  if (t.length === 0) {
    const e = i.filter((s) => s.available);
    return e.length ? e.every((s) => s.standby) ? "Speakers idle" : "No speakers selected" : "No speakers available";
  }
  return t.length === 1 ? t[0].name : `${t[0].name} + ${t.length - 1} more`;
}
function Qe(i, t) {
  var s;
  const e = [(s = i.themes) != null && s.darkMode ? "d" : "l"];
  for (const n of t) {
    const r = i.states[n];
    e.push(r ? r.last_updated : "-");
  }
  return e.join("|");
}
function E(i) {
  if (i && typeof i == "object") {
    const t = i;
    if (typeof t.message == "string") return t.message;
    if (t.error && typeof t.error.message == "string") return t.error.message;
    if (t.body && typeof t.body.message == "string") return t.body.message;
  }
  return String(i);
}
function ts(i, t = Date.now()) {
  const e = /retry[- ]after:?\s*(\d+)\s*s|try again in\s*(\d+)\s*s/i.exec(i), s = e ? Number(e[1] ?? e[2]) : NaN;
  return Number.isFinite(s) && s > 0 ? t + s * 1e3 : null;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = { ATTRIBUTE: 1 }, me = (i) => (...t) => ({ _$litDirective$: i, values: t });
let ye = class {
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
const b = me(class extends ye {
  constructor(i) {
    var t;
    if (super(i), i.type !== fe.ATTRIBUTE || i.name !== "class" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
      const a = !!t[r];
      a === this.st.has(r) || (n = this.nt) != null && n.has(r) || (a ? (e.add(r), this.st.add(r)) : (e.remove(r), this.st.delete(r)));
    }
    return U;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = "important", es = " !" + _e, Y = me(class extends ye {
  constructor(i) {
    var t;
    if (super(i), i.type !== fe.ATTRIBUTE || i.name !== "style" || ((t = i.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
        const r = typeof n == "string" && n.endsWith(es);
        s.includes("-") || r ? e.setProperty(s, r ? n.slice(0, -11) : n, r ? _e : "") : e[s] = n;
      }
    }
    return U;
  }
}), ss = ae`
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
    /* vertical swipes scroll the page; the card handles sideways drags */
    touch-action: pan-y;
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
    /* vertical swipes scroll the page; the card handles sideways drags */
    touch-action: pan-y;
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

  .speaker-row.master .sp-name {
    color: var(--text);
  }

  /*
   * Master style: panel. The panel spans the full row width (same as the preset
   * buttons). The rows under it are indented onto a rail that starts at the
   * master icon, and their tracks start/end at the same x as the panel track:
   *   panel:  12 (pad) + 28 (icon) + 10 + 95 (name) + 10 = 155
   *   rows:   39 (pad) + 22 (icon) + 10 + 74 (name) + 10 = 155
   * both end at width - 12 (pad) - 10 - 26 (value).
   */
  .speaker-row.master.panel {
    padding: 9px 11.5px; /* 12px minus the 0.5px border so the track starts exactly where the rows' do */
    margin: 0 0 4px;
    border-radius: 14px;
    border: 0.5px solid var(--line);
    background: var(--bar);
    gap: 10px;
  }
  .speaker-row.master.panel .dot {
    width: 28px;
    height: 28px;
    border-radius: 9px;
    background: var(--chip2);
  }
  .speaker-row.master.panel.on .dot {
    background: var(--accent);
    color: #fff;
  }
  .speaker-row.master.panel .sp-name {
    flex-basis: 95px;
  }
  .speaker-row.master.panel .track {
    height: 10px;
  }
  .speaker-row.master.panel .sp-vol {
    font-size: 12px;
    color: var(--text);
  }
  .speakers.style-panel .speaker-row:not(.master) {
    position: relative;
    padding-left: 39px;
    padding-right: 12px;
  }
  .speakers.style-panel .speaker-row:not(.master)::before {
    content: "";
    position: absolute;
    left: 26px;
    top: -1px;
    bottom: -1px;
    width: 1.5px;
    background: var(--line);
  }
  .speakers.style-panel .speaker-row.master.panel + .speaker-row::before {
    top: -5px;
  }
  .speakers.style-panel .speaker-row:not(.master):last-child::before {
    bottom: 50%;
  }
  .speakers.style-panel .speaker-row:not(.master)::after {
    content: "";
    position: absolute;
    left: 26px;
    top: 50%;
    width: 9px;
    height: 1.5px;
    background: var(--line);
  }

  /* Master style: tree (speakers indented under the master, joined by a rail) */
  .speakers.style-tree .speaker-row.master {
    border-bottom: none;
    padding-bottom: 6px;
    margin-bottom: 0;
  }
  .speakers.style-tree .speaker-row.master .dot {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: var(--chip2);
  }
  .speakers.style-tree .speaker-row.master.on .dot {
    background: var(--accent);
    color: #fff;
  }
  .speakers.style-tree .speaker-row.master .track {
    height: 8px;
  }
  .speakers.style-tree .speaker-row:not(.master) {
    margin-left: 12px;
    padding-left: 14px;
    border-left: 1.5px solid var(--line);
    position: relative;
  }
  .speakers.style-tree .speaker-row:not(.master)::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 9px;
    height: 1.5px;
    background: var(--line);
  }
  .speakers.style-tree .speaker-row:not(.master):last-child {
    border-left-color: transparent;
    background:
      linear-gradient(var(--line), var(--line)) no-repeat 0 0 / 1.5px 50%;
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
`, $ = {
  airplay: k`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 15a9 9 0 0 1 16 0"></path><path d="M12 15l4 6H8l4-6z" fill="currentColor" stroke="none"></path></svg>`,
  play: k`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;"><path d="M7 4.5 19.5 12 7 19.5z"></path></svg>`,
  playSmall: k`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 19.5 12 7 19.5z"></path></svg>`,
  pause: k`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4.2" height="15" rx="1.2"></rect><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"></rect></svg>`,
  prev: k`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2.2v14H6z"></path><path d="M19 5.6v12.8L9.6 12z"></path></svg>`,
  next: k`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.8 5H18v14h-2.2z"></path><path d="M5 5.6 14.4 12 5 18.4z"></path></svg>`,
  speaker: k`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2.5" width="14" height="19" rx="3.5"></rect><circle cx="12" cy="15" r="3.2"></circle><circle cx="12" cy="7.5" r="1.1" fill="currentColor"></circle></svg>`,
  volume: k`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"></path><path d="M16 8.5a5 5 0 0 1 0 7"></path><path d="M18.5 5.5a9 9 0 0 1 0 13"></path></svg>`,
  check: k`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4.5 4.5L19 7"></path></svg>`
};
function is(i, t) {
  if (i.position === null) return 0;
  let e = i.position;
  if (i.playing && i.positionUpdatedAt) {
    const s = Date.parse(i.positionUpdatedAt);
    Number.isFinite(s) && (e += Math.max(0, (t - s) / 1e3));
  }
  return i.duration !== null && (e = Math.min(e, i.duration)), Math.max(0, e);
}
const V = (i, t, e, s) => i.callService("media_player", t, s, { entity_id: e }, !1), ns = (i, t) => V(i, "media_play_pause", t), rs = (i, t) => V(i, "media_next_track", t), as = (i, t) => V(i, "media_previous_track", t), os = (i, t, e) => V(i, "media_seek", t, { seek_position: Math.max(0, Math.round(e)) }), ge = (i, t, e) => V(i, "volume_set", t, { volume_level: Math.max(0, Math.min(100, e)) / 100 }), H = (i, t, e) => V(i, "volume_mute", t, { is_volume_muted: e });
async function yt(i, t = 2500) {
  try {
    return await i();
  } catch (e) {
    await new Promise((s) => setTimeout(s, t));
    try {
      return await i();
    } catch {
      throw e;
    }
  }
}
async function ls(i, t, e) {
  const s = [], n = [];
  for (const r of t) {
    if (!r.available) continue;
    const a = e.levels[r.entity];
    if (a === void 0) {
      (r.on || r.standby) && n.push(r.entity);
      continue;
    }
    r.on || s.push(yt(() => H(i, r.entity, !1))), s.push(yt(() => ge(i, r.entity, a)));
  }
  for (const r of n) s.push(yt(() => H(i, r, !0)));
  await Promise.all(s);
}
function Gt(i) {
  const t = Math.max(0, Math.floor(i)), e = Math.floor(t / 60), s = t % 60;
  return `${e}:${String(s).padStart(2, "0")}`;
}
function Wt(i) {
  return Math.max(0, Math.min(1, i));
}
function Yt(i, t) {
  let e = 0, s, n = !1, r;
  const a = () => {
    r = void 0, n && (n = !1, e = Date.now(), i(s));
  };
  return (o) => {
    const l = Date.now(), p = l - e;
    if (p >= t && !r) {
      e = l, i(o);
      return;
    }
    s = o, n = !0, r || (r = setTimeout(a, Math.max(0, t - p)));
  };
}
const cs = 10;
function ps(i, t, e = cs) {
  const s = Math.abs(i), n = Math.abs(t);
  return s < e && n < e ? "pending" : s > n ? "drag" : "scroll";
}
function ds(i, t, e) {
  const s = i + t / Math.max(1, e);
  return Math.min(1, Math.max(0, s));
}
var us = Object.defineProperty, ve = (i, t, e, s) => {
  for (var n = void 0, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = a(t, e, n) || n);
  return n && us(t, e, n), n;
};
const it = 1500, Xt = 150, Mt = class Mt extends L {
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
    const n = [this.groupEntity ?? "", ...s.speakers.map((a) => a.entity), ...this.extraEntities()].filter(Boolean), r = Qe(t, n);
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
    return s ? Ye(t, s.speakers, this.groupEntity ?? "").map((n) => {
      let r = n;
      if (!r.notInGroup) if (r.standby) {
        const o = this._intent.get(r.entity);
        o && (r = { ...r, standby: !1, vol: o.vol ?? 0, on: o.on ?? !0 });
      } else
        this._intent.delete(r.entity);
      const a = this._overrides.get(r.entity);
      return !a || r.notInGroup ? r : e >= a.until ? (this._overrides.delete(r.entity), r) : { ...r, standby: !1, vol: a.vol ?? r.vol, on: a.on ?? r.on };
    }) : [];
  }
  _remember(t, e) {
    const s = this._intent.get(t) ?? {};
    this._intent.set(t, { ...s, ...e });
  }
  _bump(t, e, s = it) {
    this._remember(t, e), this._overrides.set(t, { ...e, until: Date.now() + s }), this.requestUpdate(), window.setTimeout(() => this.requestUpdate(), s + 50);
  }
  _toggle(t) {
    !this._hass || !t.available || (this._bump(t.entity, { on: !t.on }), this.run(H(this._hass, t.entity, t.on)));
  }
  _muteAll(t, e) {
    if (!this._hass) return;
    const s = t.filter((n) => n.available).map((n) => n.entity);
    if (s.length) {
      for (const n of s) this._bump(n, { on: !e });
      this.run(H(this._hass, s, e));
    }
  }
  applyPreset(t, e) {
    if (this._hass) {
      for (const s of t) {
        if (!s.available) continue;
        const n = e.levels[s.entity];
        this._bump(s.entity, n === void 0 ? { on: !1 } : { on: !0, vol: n }, it + 1e3);
      }
      this.run(ls(this._hass, t, e));
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
    !this._hass || this._lastSent.get(t) === e || (this._lastSent.set(t, e), this.run(ge(this._hass, t, e)));
  }
  _throttleFor(t) {
    let e = this._throttled.get(t);
    return e || (e = Yt((s) => this._sendVolume(t, s), Xt), this._throttled.set(t, e)), e;
  }
  /**
   * Drive a slider from a pointerdown. Mouse/pen: the value follows the pointer from the
   * first press. Touch: nothing happens until the finger moves sideways (a vertical move
   * is left to the browser as a page scroll), then the value moves relative to `value0`;
   * a tap without movement changes nothing. Values are fractions 0..1.
   */
  _slide(t, e) {
    var F;
    const s = t.currentTarget, n = t.pointerId, r = (y) => {
      const g = s.getBoundingClientRect();
      return Wt((y.clientX - g.left) / Math.max(1, g.width));
    }, a = (y, g) => {
      const P = (G) => {
        G.pointerId === n && y(G);
      }, T = (G) => {
        G.pointerId === n && (Ut(), g(G));
      }, Ut = () => {
        s.removeEventListener("pointermove", P), s.removeEventListener("pointerup", T), s.removeEventListener("pointercancel", T);
      };
      return s.addEventListener("pointermove", P), s.addEventListener("pointerup", T), s.addEventListener("pointercancel", T), Ut;
    }, o = () => {
      try {
        s.setPointerCapture(n);
      } catch {
      }
    };
    if (t.pointerType !== "touch") {
      t.preventDefault(), o(), (F = e.begin) == null || F.call(e);
      let y = r(t);
      e.move(y), a(
        (g) => {
          y = r(g), e.move(y);
        },
        (g) => e.end(g.type === "pointerup" ? r(g) : y)
      );
      return;
    }
    const l = t.clientX, p = t.clientY, d = s.getBoundingClientRect().width;
    let c = !1, h = e.value0;
    const _ = (y) => ds(e.value0, y.clientX - l, d), A = a(
      (y) => {
        var g;
        if (!c) {
          const P = ps(y.clientX - l, y.clientY - p);
          if (P === "pending") return;
          if (P === "scroll") {
            A();
            return;
          }
          c = !0, o(), (g = e.begin) == null || g.call(e);
        }
        y.preventDefault(), h = _(y), e.move(h);
      },
      (y) => {
        c && e.end(y.type === "pointerup" ? _(y) : h);
      }
    );
  }
  _dragStart(t, e) {
    const s = this._hass;
    if (!s || !e.available) return;
    const n = this._throttleFor(e.entity);
    this._slide(t, {
      value0: (e.on ? e.vol : 0) / 100,
      begin: () => {
        e.on || this.run(H(s, e.entity, !1)), this._lastSent.delete(e.entity);
      },
      move: (r) => {
        const a = Math.round(r * 100);
        this._remember(e.entity, { vol: a, on: !0 }), this._overrides.set(e.entity, { vol: a, on: !0, until: 1 / 0 }), this.requestUpdate(), n(a);
      },
      end: (r) => {
        const a = Math.round(r * 100);
        this._bump(e.entity, { vol: a, on: !0 }), this._sendVolume(e.entity, a);
      }
    });
  }
  _sendMaster(t, e) {
    for (const [s, n] of Ft(t, e)) this._sendVolume(s, n);
  }
  _masterDragStart(t, e) {
    const s = this._hass;
    if (!s) return;
    let n = e.filter((o) => o.on && o.available);
    const r = !n.length;
    if (r && (n = e.filter((o) => o.available && !o.notInGroup).map((o) => ({ ...o, on: !0, vol: 0 })), !n.length))
      return;
    this._masterThrottle || (this._masterThrottle = Yt((o) => this._sendMaster(this._masterBase, o), Xt));
    const a = (o, l) => {
      for (const [p, d] of Ft(n, o))
        this._remember(p, { vol: d, on: !0 }), this._overrides.set(p, { vol: d, on: !0, until: l });
      this.requestUpdate();
    };
    this._slide(t, {
      value0: (Vt(e) ?? 0) / 100,
      begin: () => {
        r && this.run(H(s, n.map((o) => o.entity), !1));
        for (const o of n) this._lastSent.delete(o.entity);
        this._masterBase = n;
      },
      move: (o) => {
        const l = Math.round(o * 100);
        a(l, 1 / 0), this._masterThrottle(l);
      },
      end: (o) => {
        const l = Math.round(o * 100);
        a(l, Date.now() + it), this._sendMaster(n, l), window.setTimeout(() => this.requestUpdate(), it + 50);
      }
    });
  }
  // ---- seek --------------------------------------------------------------
  _seekStart(t, e, s) {
    if (!e.duration) return;
    const n = e.duration;
    this._slide(t, {
      value0: Wt(this.position(e, Date.now()) / n),
      move: (r) => {
        this._seek = { pos: r * n, until: 1 / 0, stamp: e.positionUpdatedAt }, this.requestUpdate();
      },
      end: (r) => {
        const a = r * n;
        this._seek = { pos: a, until: Date.now() + 2500, stamp: e.positionUpdatedAt }, this.requestUpdate(), this.run(s(a));
      }
    });
  }
  position(t, e) {
    const s = this._seek;
    if (s) {
      if (e < s.until && s.stamp === t.positionUpdatedAt) return s.pos;
      this._seek = null;
    }
    return is(t, e);
  }
  // ---- misc --------------------------------------------------------------
  run(t) {
    t && t.catch((e) => this.showToast(E(e)));
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
    var n;
    const s = ((n = this.section) == null ? void 0 : n.layout) ?? "vertical";
    return u`<ha-card>
      <div class=${b({ card: !0, horizontal: s === "horizontal", auto: s === "auto" })}>
        <div class="col-left">${t.header}${t.playlists}</div>
        <div class="col-right">${t.now}${t.speakers}</div>
        ${e}
      </div>
    </ha-card>`;
  }
  renderHeader(t, e) {
    const s = e.filter((n) => n.on).length;
    return u`<div class="header">
      <div class="header-text">
        <span class="title">${t}</span>
        <span class="summary ellipsis">${Je(e)}</span>
      </div>
      <button class="pill" title="Choose speakers" @click=${() => this._pickerOpen = !this._pickerOpen}>
        ${$.airplay}<span>${s}</span>
      </button>
    </div>`;
  }
  renderSpeakerSection(t) {
    const e = this.section, s = t.filter((a) => a.on).length, n = Ze(t, e.presets, e.preset_tolerance), r = t.slice(0, e.speaker_count);
    return u`
      <div class="section-head">
        <span class="label">Speakers</span>
        <button class="text-btn" @click=${() => this._muteAll(t, s > 0)}>
          ${s > 0 ? "Mute all" : "Play on all"}
        </button>
      </div>
      ${e.presets.length ? u`<div class="presets">
            ${e.presets.map(
      (a) => u`<button class=${b({ preset: !0, active: n === a.name })} @click=${() => this.applyPreset(t, a)}>
                ${a.name}
              </button>`
    )}
          </div>` : f}
      <div class=${b({ speakers: !0, [`style-${e.master_style}`]: e.master_volume })}>
        ${e.master_volume ? this.renderMaster(t) : f}
        ${r.map((a) => this.renderSpeaker(a))}
      </div>
    `;
  }
  renderMaster(t) {
    const e = this.section, s = Vt(t);
    return u`<div
      class=${b({ "speaker-row": !0, master: !0, on: s !== null, [e.master_style]: !0 })}
      title="Master volume: scales every speaker that is on"
    >
      <span class="dot" role="img" aria-label="Master volume">${$.volume}</span>
      <span class="sp-name ellipsis">${e.master_label}</span>
      <div class="track-hit" @pointerdown=${(r) => this._masterDragStart(r, t)}>
        <div class="track"><div class="fill" style=${Y({ width: `${s ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${s ?? "–"}</span>
    </div>`;
  }
  renderSpeaker(t) {
    const e = t.available ? t.notInGroup ? "Not in the Cast group: add it in the Google Home app" : t.standby ? "Idle" : "Toggle speaker" : "Unavailable";
    return u`<div
      class=${b({ "speaker-row": !0, on: t.on, unavailable: !t.available, standby: t.standby, orphan: t.notInGroup })}
      title=${e}
    >
      <button class="dot" title=${e} ?disabled=${!t.available} @click=${() => this._toggle(t)}>${$.speaker}</button>
      <span class="sp-name ellipsis">${t.name}</span>
      <div class="track-hit" @pointerdown=${(s) => this._dragStart(s, t)}>
        <div class="track"><div class="fill" style=${Y({ width: `${t.on ? t.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${t.notInGroup ? "n/a" : t.standby ? "–" : t.vol}</span>
    </div>`;
  }
  renderPicker(t) {
    if (!this._pickerOpen) return f;
    const e = () => this._pickerOpen = !1;
    return u`<div class="scrim" @click=${e}>
      <div class="sheet" @click=${(s) => s.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-title">Play on</span>
          <button class="sheet-done" @click=${e}>Done</button>
        </div>
        <div class="sheet-list">
          ${t.map(
      (s) => u`<button class=${b({ "sheet-row": !0, on: s.on })} ?disabled=${!s.available} @click=${() => this._toggle(s)}>
              <span class="check">${$.check}</span>
              <span class="sheet-name ellipsis">${s.name}</span>
              <span class="sheet-kind">${s.available ? s.notInGroup ? "not in group" : s.standby ? "idle" : s.on ? `${s.vol}` : "muted" : "offline"}</span>
            </button>`
    )}
        </div>
      </div>
    </div>`;
  }
  renderToast() {
    return this._toast ? u`<div class="toast">${this._toast}</div>` : f;
  }
  renderArt(t, e, s, n, r = !1) {
    const a = !!e && !this._broken.has(s);
    return u`<div class=${b({ art: !0, [t]: !0, pulse: r })}>
      <div class="stripes"></div>
      ${a ? u`<img
            src=${e}
            alt=""
            loading="lazy"
            @load=${(o) => o.target.classList.add("loaded")}
            @error=${() => this._imgBroken(s)}
          />` : u`<div class="art-label">ART ${String(n + 1).padStart(2, "0")}</div>`}
    </div>`;
  }
  renderPlaylists(t) {
    return u`<div class="playlists-area">${this._renderPlaylistsInner(t)}</div>`;
  }
  _renderPlaylistsInner(t) {
    if (t.status === "error" && !t.playlists.length)
      return u`<div class="pl-msg">
        <span>${t.error || "Could not load playlists"}</span>
        <button class="text-btn" @click=${t.onRetry}>Retry</button>
      </div>`;
    if (t.status === "ready" && !t.playlists.length) return u`<div class="pl-msg">No playlists yet</div>`;
    if (t.status !== "ready" && !t.playlists.length) {
      const s = t.layout === "list" ? Math.min(t.count, 10) : t.count, n = Array.from({ length: s }, (r, a) => a);
      return t.layout === "list" ? u`<div class="list">
            ${n.map(
        (r) => u`<div class=${b({ "list-row": !0, first: r === 0 })}>
                ${this.renderArt("list-art", null, `ph${r}`, r, !0)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`
      )}
          </div>` : u`<div class="tiles" style=${Y({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
            ${n.map(
        (r) => u`<div class="tile">${this.renderArt("tile-art", null, `ph${r}`, r, !0)}<span class="tile-name">&nbsp;</span></div>`
      )}
          </div>`;
    }
    const e = t.playlists.slice(0, t.count);
    return t.layout === "list" ? u`<div class="list">
        ${e.map(
      (s, n) => u`<button class=${b({ "list-row": !0, first: n === 0, active: s.uri === t.activeUri })} @click=${() => t.onPlay(s)}>
            ${this.renderArt("list-art", s.image, s.uri, n)}
            <span class="list-name ellipsis">${s.name}</span>
            <span class="list-play">${$.playSmall}</span>
          </button>`
    )}
      </div>` : u`<div class="tiles" style=${Y({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
      ${e.map(
      (s, n) => u`<button class=${b({ tile: !0, active: s.uri === t.activeUri })} title=${s.name} @click=${() => t.onPlay(s)}>
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
    const n = this.position(t, e), r = t.duration ?? 0, a = r > 0 ? n / r * 100 : 0, o = t.found && (t.state === "unavailable" || t.state === "unknown");
    let l = s.title ?? t.title;
    s.title || (t.found ? o ? l = "Player unavailable" : l || (l = t.state === "playing" ? "Playing" : t.state === "paused" ? "Paused" : "Nothing playing") : l = "Player not found");
    const p = s.subtitle ?? t.artist, d = s.disabled || !t.found || o, c = !d && r > 0;
    return u`<div class=${b({ now: !0, paused: !t.playing && !s.busy, busy: !!s.busy })}>
      <div class="now-row">
        ${this.renderArt("now-art", t.art, `now:${t.art ?? ""}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            ${s.busy ? u`<span class="spinner" aria-label="Starting"></span>` : u`<div class="eq"><div></div><div></div><div></div></div>`}
            <span class="now-title ellipsis">${l}</span>
          </div>
          <span class="now-artist ellipsis">${p}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${d} @click=${() => this.run(s.onPrev())}>${$.prev}</button>
          <button class="play" title=${t.playing ? "Pause" : "Play"} ?disabled=${d} @click=${() => this.run(s.onPlayPause())}>
            ${t.playing ? $.pause : $.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${d} @click=${() => this.run(s.onNext())}>${$.next}</button>
        </div>
      </div>
      <div class=${b({ "progress-hit": !0, disabled: !c })} @pointerdown=${(h) => c && this._seekStart(h, t, s.onSeek)}>
        <div class="progress"><div class="progress-fill" style=${Y({ width: `${a.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${Gt(n)}</span><span>${r > 0 ? `-${Gt(r - n)}` : "–:––"}</span></div>
      </div>
    </div>`;
  }
};
Mt.styles = ss;
let et = Mt;
ve([
  w()
], et.prototype, "_pickerOpen");
ve([
  w()
], et.prototype, "_toast");
function ct(i) {
  const t = i && typeof i == "object" ? i.response : void 0, e = t && typeof t == "object" ? t.result ?? t : {};
  return e && typeof e == "object" ? e : {};
}
function v(i, ...t) {
  if (i) {
    for (const e of t) if (i[e] !== void 0 && i[e] !== null) return i[e];
  }
}
function Pt(i) {
  const t = v(i, "items", "Items");
  return Array.isArray(t) ? t.filter((e) => e && typeof e == "object") : [];
}
function Tt(i) {
  const t = v(i, "uri", "Uri"), e = v(i, "name", "Name");
  if (typeof t != "string" || typeof e != "string") return null;
  let s = v(i, "image_url", "ImageUrl");
  if (!s) {
    const o = v(i, "images", "Images");
    Array.isArray(o) && o[0] && (s = v(o[0], "url", "Url"));
  }
  const n = v(i, "owner", "Owner"), r = n ? v(n, "id", "Id") : void 0, a = { uri: t, name: e, image: typeof s == "string" && s ? s : null };
  return typeof r == "string" && r && (a.ownerId = r), a;
}
function hs(i) {
  const t = [];
  for (const e of Pt(ct(i))) {
    const s = v(e, "context", "Context"), n = s ? v(s, "uri", "Uri") ?? null : null, r = v(e, "played_at_ms", "PlayedAtMS"), a = v(e, "played_at", "PlayedAt"), o = typeof r == "number" ? r : typeof a == "string" ? Date.parse(a) : NaN;
    if (!Number.isFinite(o)) continue;
    const l = v(e, "track", "Track");
    t.push({ contextUri: n, playedAt: o, trackName: (l && v(l, "name", "Name")) ?? "" });
  }
  return t;
}
const pt = (i, t, e) => i.callService("spotifyplus", t, e, void 0, !1, !0);
async function fs(i, t, e) {
  const s = { entity_id: t, limit: 50 };
  e && e > 0 && (s.after = e);
  const n = await pt(i, "get_player_recent_tracks", s);
  return hs(n).sort((r, a) => a.playedAt - r.playedAt);
}
async function ms(i, t, e = 500) {
  const s = await pt(i, "get_playlist_favorites", { entity_id: t, limit: 50, limit_total: e });
  return Pt(ct(s)).map(Tt).filter((n) => !!n);
}
async function Zt(i, t, e) {
  const s = e.split(":").pop() ?? e, n = await pt(i, "get_playlist", { entity_id: t, playlist_id: s }), r = Tt(ct(n));
  return r ? { ...r, uri: e } : null;
}
const ys = (i, t, e, s, n) => i.callService(
  "spotifyplus",
  "player_media_play_context",
  { entity_id: t, context_uri: e, device_id: s, shuffle: n },
  void 0,
  !1
), _s = (i, t, e) => i.callService("script", t.replace(/^script\./, ""), e, void 0, !1);
async function gs(i, t, e = !1) {
  const s = await pt(i, "get_spotify_connect_devices", { entity_id: t, refresh: e });
  return Pt(ct(s)).map((n) => v(n, "name", "Name")).filter((n) => typeof n == "string");
}
async function vs(i, t, e, s = 45e3) {
  const n = Date.now() + s;
  for (; Date.now() < n; ) {
    try {
      if ((await gs(i, t, !1)).some((a) => a.toLowerCase() === e.toLowerCase()))
        return await new Promise((a) => setTimeout(a, 5e3)), !0;
    } catch {
    }
    await new Promise((r) => setTimeout(r, 3e3));
  }
  return !1;
}
const bs = (i, t) => i.callService("spotifyplus", "get_spotify_connect_devices", { entity_id: t, refresh: !0 }, void 0, !1, !0);
async function ws(i, t, e = () => {
  var n;
  return (n = i.states[t]) == null ? void 0 : n.state;
}, s = 3e4) {
  if (!i.callApi) throw new Error("config entry reload not available");
  const n = await i.callWS({ type: "config_entries/get", domain: "spotifyplus" }), r = n == null ? void 0 : n[0];
  if (!r) throw new Error("SpotifyPlus config entry not found");
  await i.callApi("POST", `config/config_entries/entry/${r.entry_id}/reload`), await new Promise((o) => setTimeout(o, 3e3));
  const a = Date.now() + s;
  for (; Date.now() < a; ) {
    await new Promise((l) => setTimeout(l, 1e3));
    const o = e();
    if (o && o !== "unavailable" && o !== "unknown") return;
  }
  throw new Error("SpotifyPlus did not come back after reload");
}
async function _t(i, t) {
  const e = await i.callWS({ type: "frontend/get_user_data", key: t });
  return (e == null ? void 0 : e.value) ?? null;
}
async function nt(i, t, e) {
  await i.callWS({ type: "frontend/set_user_data", key: t, value: e });
}
const Et = (i, t) => i.callWS(t), Ct = (i, t) => t ? { ...i, account: t } : i;
async function xs(i, t, e = 50) {
  const s = await Et(i, Ct({ type: "spotcast/playlists", limit: e }, t));
  return ((s == null ? void 0 : s.playlists) ?? []).map(Tt).filter((n) => !!n);
}
function ks(i) {
  const t = (i && typeof i == "object" ? i.state : void 0) ?? {}, e = t.context, s = t.device, n = t.item;
  return {
    contextUri: e && typeof e.uri == "string" ? e.uri : null,
    isPlaying: t.is_playing === !0,
    deviceName: s && typeof s.name == "string" ? s.name : "",
    trackName: n && typeof n.name == "string" ? n.name : ""
  };
}
async function Kt(i, t) {
  return ks(await Et(i, Ct({ type: "spotcast/player" }, t)));
}
async function $s(i, t) {
  const e = await Et(i, { type: "spotcast/accounts" }), s = (e == null ? void 0 : e.accounts) ?? [], n = t ? s.find((r) => r.entry_id === t) : s.find((r) => r.is_default) ?? s[0];
  return (n == null ? void 0 : n.spotify_id) ?? null;
}
const Jt = (i, t, e, s, n) => i.callService(
  "spotcast",
  "play_media",
  Ct({ media_player: { entity_id: t }, spotify_uri: e, data: { shuffle: s } }, n),
  void 0,
  !1
);
async function Ss(i, t = fetch) {
  try {
    const e = await t(`https://open.spotify.com/oembed?url=${encodeURIComponent(i)}`);
    if (!e.ok) return null;
    const s = await e.json();
    return typeof s.title != "string" || !s.title ? null : { uri: i, name: s.title, image: typeof s.thumbnail_url == "string" ? s.thumbnail_url : null };
  } catch {
    return null;
  }
}
const Qt = { version: 1, lastSeen: 0, entries: {} };
function be(i) {
  return typeof i == "string" && /^spotify:playlist:[A-Za-z0-9]+$/.test(i);
}
function As(i, t) {
  const e = { ...i.entries };
  let s = i.lastSeen;
  for (const n of t) {
    if (n.playedAt <= i.lastSeen || (s = Math.max(s, n.playedAt), !be(n.contextUri))) continue;
    const r = e[n.contextUri];
    e[n.contextUri] = r ? { ...r, plays: r.plays + 1, lastPlayed: Math.max(r.lastPlayed, n.playedAt) } : { uri: n.contextUri, name: "", image: null, lastPlayed: n.playedAt, plays: 1 };
  }
  return { version: 1, lastSeen: s, entries: e };
}
function Ps(i, t, e) {
  const s = i.entries[t.uri];
  return {
    ...i,
    entries: {
      ...i.entries,
      [t.uri]: s ? { ...s, name: t.name || s.name, image: t.image ?? s.image, lastPlayed: Math.max(s.lastPlayed, e) } : { uri: t.uri, name: t.name, image: t.image, lastPlayed: e, plays: 0 }
    }
  };
}
function Ts(i, t, e, s) {
  if (!be(t)) return i;
  const n = i.entries[t];
  return n && e - n.lastPlayed < s ? e <= n.lastPlayed ? i : { ...i, entries: { ...i.entries, [t]: { ...n, lastPlayed: e } } } : {
    ...i,
    entries: {
      ...i.entries,
      [t]: n ? { ...n, plays: n.plays + 1, lastPlayed: e } : { uri: t, name: "", image: null, lastPlayed: e, plays: 1 }
    }
  };
}
function Es(i, t, e) {
  const s = { ...i.entries };
  let n = !1;
  for (const r of t) {
    const a = s[r.uri];
    a && r.ownerId === e && !a.owned && (s[r.uri] = { ...a, owned: !0 }, n = !0);
  }
  return n ? { ...i, entries: s } : i;
}
function Cs(i, t) {
  return Object.values(i.entries).filter((e) => e.owned && !t.has(e.uri)).map((e) => e.uri);
}
function gt(i, t) {
  let e = !1;
  const s = { ...i.entries };
  for (const n of t) {
    const r = s[n.uri];
    r && (r.name !== n.name || n.image && r.image !== n.image) && (s[n.uri] = { ...r, name: n.name, image: n.image ?? r.image }, e = !0);
  }
  return e ? { ...i, entries: s } : i;
}
function te(i) {
  return Object.values(i.entries).filter((t) => !t.name).map((t) => t.uri);
}
function Ms(i, t, e) {
  const s = Object.values(i.entries).filter((n) => n.name);
  return s.sort((n, r) => t === "play_count" && r.plays - n.plays || r.lastPlayed - n.lastPlayed), s.slice(0, e).map((n) => ({ uri: n.uri, name: n.name, image: n.image }));
}
function Us(i, t, e) {
  if (i.length >= e) return i.slice(0, e);
  const s = new Set(i.map((r) => r.uri)), n = [...i];
  for (const r of t) {
    if (n.length >= e) break;
    s.has(r.uri) || (s.add(r.uri), n.push({ uri: r.uri, name: r.name, image: r.image }));
  }
  return n;
}
function Os(i, t, e, s, n) {
  return Object.values(i.entries).filter((r) => !t.has(r.uri) && (r.validatedAt === void 0 || e - r.validatedAt > s)).sort((r, a) => (r.validatedAt ?? 0) - (a.validatedAt ?? 0)).slice(0, n).map((r) => r.uri);
}
function ee(i, t) {
  const e = { ...i.entries };
  let s = !1;
  for (const n of t) n in e && (delete e[n], s = !0);
  return s ? { ...i, entries: e } : i;
}
function zs(i, t, e) {
  const s = { ...i.entries };
  let n = !1;
  for (const r of t) s[r] && (s[r] = { ...s[r], validatedAt: e }, n = !0);
  return n ? { ...i, entries: s } : i;
}
function Ds(i, t = 200) {
  const e = Object.values(i.entries);
  if (e.length <= t) return i;
  e.sort((n, r) => r.lastPlayed - n.lastPlayed);
  const s = {};
  for (const n of e.slice(0, t)) s[n.uri] = n;
  return { ...i, entries: s };
}
function vt(i) {
  return !!i && typeof i == "object" && i.version === 1 && typeof i.entries == "object";
}
var Rs = Object.defineProperty, Is = Object.getOwnPropertyDescriptor, dt = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Is(t, e) : t, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = (s ? a(t, e, n) : a(n)) || n);
  return s && n && Rs(t, e, n), n;
};
const Ns = [
  { name: "backend", selector: { select: { mode: "dropdown", options: [{ value: "spotifyplus", label: "SpotifyPlus" }, { value: "spotcast", label: "Spotcast (recommended)" }] } } },
  { name: "spotifyplus_entity", selector: { entity: { domain: "media_player", integration: "spotifyplus" } } },
  { name: "cast_group_entity", required: !0, selector: { entity: { domain: "media_player", integration: "cast" } } },
  { name: "device_name", selector: { text: {} } },
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
  { name: "master_label", selector: { text: {} } },
  { name: "master_style", selector: { select: { mode: "dropdown", options: [{ value: "plain", label: "Plain row" }, { value: "panel", label: "Own panel" }, { value: "tree", label: "Speakers indented under it" }] } } },
  { name: "fill_with_favorites", selector: { boolean: {} } },
  { name: "history_key", selector: { text: {} } },
  { name: "start_script", selector: { entity: { domain: "script" } } },
  { name: "spotcast_account", selector: { text: {} } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } }
], js = {
  backend: "Starts playback and lists playlists via",
  spotifyplus_entity: "SpotifyPlus player (SpotifyPlus backend)",
  cast_group_entity: "Google Cast entity of the speaker group",
  device_name: "Spotify Connect device name (required with SpotifyPlus, label only with Spotcast)",
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
  master_label: "Master volume label",
  master_style: "Master volume style",
  fill_with_favorites: "Fill empty slots with my own playlists",
  history_key: "Play history key (shared by cards using the same key)",
  start_script: "Start via HA script (server-side recovery, optional)",
  spotcast_account: "Spotcast config entry id (only with several Spotcast accounts)",
  title: "Title",
  accent: "Accent color (CSS)"
};
let q = class extends L {
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
      backend: i.backend ?? "spotifyplus",
      spotifyplus_entity: i.spotifyplus_entity ?? (i.backend === "spotcast" ? void 0 : "media_player.spotifyplus"),
      control_via: i.control_via ?? "cast",
      master_volume: i.master_volume !== !1,
      fill_with_favorites: i.fill_with_favorites !== !1,
      shuffle: i.shuffle === !0
    };
  }
  _valueChanged(i) {
    if (i.stopPropagation(), !this._config) return;
    const t = i.detail.value, e = this._config, s = /* @__PURE__ */ new Map();
    for (const a of e.speakers ?? []) typeof a == "object" && (a != null && a.name) && s.set(a.entity, a.name);
    const n = (t.speakers ?? []).map((a) => s.has(a) ? { entity: a, name: s.get(a) } : a), r = { ...e, ...t, speakers: n };
    for (const a of Object.keys(r)) {
      const o = r[a];
      (o === "" || o === void 0 || o === null) && delete r[a];
    }
    this._config = r, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: r }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._ready ? f : u`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${Ns}
        .computeLabel=${(i) => js[i.name] ?? i.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
q.styles = ae`
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
dt([
  he({ attribute: !1 })
], q.prototype, "hass", 2);
dt([
  w()
], q.prototype, "_config", 2);
dt([
  w()
], q.prototype, "_ready", 2);
q = dt([
  ue("multiroom-spotify-card-editor")
], q);
var Hs = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, O = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Ls(t, e) : t, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = (s ? a(t, e, n) : a(n)) || n);
  return s && n && Hs(t, e, n), n;
};
const se = 6e4, Bs = 36e4, qs = 5e3, bt = 6e4, ie = 10 * 6e4, wt = 720 * 6e4, Vs = 5, Fs = 1440 * 6e4, Gs = 5, Ws = 20 * 6e4, Ys = 4e3;
let S = class extends et {
  constructor() {
    super(...arguments), this._history = Qt, this._plStatus = "idle", this._plError = "", this._activeUri = null, this._starting = null, this._favorites = [], this._favoritesAt = 0, this._refreshing = !1, this._historyLoaded = !1, this._accountId = null, this._lastContextUri = null, this._backoffMs = 0;
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
    const i = this._config;
    return (i == null ? void 0 : i.backend) === "spotifyplus" ? [i.spotifyplus_entity] : [];
  }
  ticking(i) {
    var s;
    const t = this._config, e = (t == null ? void 0 : t.backend) === "spotifyplus" && ((s = i.states[t.spotifyplus_entity]) == null ? void 0 : s.state) === "playing";
    return !!this._starting || super.ticking(i) || e;
  }
  /** Name shown for the speaker group: the configured device name, else the Cast entity's name. */
  _groupLabel(i) {
    var s;
    const t = this._config, e = (s = i.states[t.cast_group_entity]) == null ? void 0 : s.attributes.friendly_name;
    return t.device_name || typeof e == "string" && e || "speaker group";
  }
  get _playerEntity() {
    const i = this._config;
    return i.control_via === "spotifyplus" ? i.spotifyplus_entity : i.cast_group_entity;
  }
  // ---- HA card API -------------------------------------------------------
  static getConfigElement() {
    return document.createElement("multiroom-spotify-card-editor");
  }
  static getStubConfig(i) {
    var n, r, a;
    const t = Object.values((i == null ? void 0 : i.states) ?? {}).filter((o) => o.entity_id.startsWith("media_player.")), e = ((n = t.find((o) => o.entity_id.includes("spotifyplus"))) == null ? void 0 : n.entity_id) ?? "media_player.spotifyplus", s = t.filter((o) => typeof o.attributes.app_id == "string" || typeof o.attributes.app_name == "string");
    return {
      spotifyplus_entity: e,
      cast_group_entity: ((r = s[0]) == null ? void 0 : r.entity_id) ?? "media_player.your_cast_group",
      device_name: ((a = s[0]) == null ? void 0 : a.attributes.friendly_name) ?? "Speaker group",
      speakers: s.slice(1, 5).map((o) => o.entity_id),
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  setConfig(i) {
    const t = this._config, e = Ge(i);
    this._config = e, (!t || t.history_key !== e.history_key || t.spotifyplus_entity !== e.spotifyplus_entity) && (this._historyLoaded = !1, this._history = Qt, this._plStatus = "idle", this._hass && this._refresh());
  }
  hassChanged(i, t) {
    this._checkStarted(i), t && this._plStatus === "idle" && this._refresh();
  }
  connectedCallback() {
    super.connectedCallback(), this._intervalTimer = window.setInterval(() => {
      document.visibilityState === "visible" && this._refresh();
    }, ie), this._hass && this._config && this._plStatus !== "loading" && this._refresh();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const i of [this._refreshTimer, this._intervalTimer, this._startTimer, this._scriptDoneTimer, this._contextCheckTimer]) i && window.clearTimeout(i);
    this._intervalTimer && window.clearInterval(this._intervalTimer);
  }
  // ---- history / playlists ----------------------------------------------
  get _playlists() {
    const i = this._config;
    if (!i) return [];
    const t = Ms(this._history, i.playlist_sort, i.playlist_count);
    return i.fill_with_favorites ? Us(t, this._favorites, i.playlist_count) : t;
  }
  async _ensureFavorites(i, t) {
    const e = Date.now();
    if (e - this._favoritesAt < wt) return;
    const s = `${t.history_key}:library`;
    if (!this._favoritesAt) {
      const n = await _t(i, s);
      if (n && typeof n.at == "number" && n.backend === t.backend && Array.isArray(n.items) && e - n.at < wt) {
        this._favorites = n.items, this._favoritesAt = n.at;
        return;
      }
    }
    this._favorites = t.backend === "spotcast" ? await xs(i, t.spotcast_account || void 0) : await ms(i, t.spotifyplus_entity), this._favoritesAt = e, await nt(i, s, { at: e, backend: t.backend, items: this._favorites });
  }
  /**
   * The playlist endpoints have the smallest Spotify quota; when they are exhausted the
   * history must still refresh and render, so a library failure only skips the metadata steps.
   */
  async _tryFavorites(i, t) {
    try {
      return await this._ensureFavorites(i, t), !0;
    } catch (e) {
      const s = E(e);
      console.warn("multiroom-spotify-card: playlist library unavailable, keeping the cached history:", s);
      const n = ts(s);
      return n && (this._favoritesAt = n - wt, await nt(i, `${t.history_key}:library`, { at: this._favoritesAt, backend: t.backend, items: this._favorites }).catch(() => {
      })), this._favorites.length > 0;
    }
  }
  /**
   * Spotcast backend: no "recently played" API. The history is built from the card's own
   * starts plus the playback context Spotcast reports at each refresh (any device, any app),
   * one API call per refresh.
   */
  async _observePlayback(i, t, e) {
    const s = i.states[t.cast_group_entity], n = typeof (s == null ? void 0 : s.attributes.app_name) == "string" ? s.attributes.app_name : "";
    if ((s == null ? void 0 : s.state) !== "playing" || !/spotify/i.test(n)) return e;
    const r = await Kt(i, t.spotcast_account || void 0);
    return r.isPlaying ? (this._lastContextUri = r.contextUri, Ts(e, r.contextUri, Date.now(), Ws)) : e;
  }
  async _refresh() {
    const i = this._hass, t = this._config;
    if (!(!i || !t || this._refreshing)) {
      this._refreshing = !0, Object.keys(this._history.entries).length || (this._plStatus = "loading");
      try {
        if (!this._historyLoaded) {
          let n = await _t(i, t.history_key);
          !vt(n) && t.history_key === "multiroom-spotify-card" && (n = await _t(i, "spotifyplus-media-card"), vt(n) && await nt(i, t.history_key, n)), vt(n) && (this._history = n), this._historyLoaded = !0;
        }
        const e = this._history;
        let s;
        if (t.backend === "spotcast")
          s = await this._observePlayback(i, t, e), await this._tryFavorites(i, t) && (s = await this._fillMeta(i, t, s), s = await this._dropDeletedSpotcast(i, t, s));
        else {
          const n = await fs(i, t.spotifyplus_entity, e.lastSeen);
          s = As(e, n), await this._tryFavorites(i, t) && (s = await this._fillMeta(i, t, s), s = await this._dropDeleted(i, t, s));
        }
        s = Ds(s), this._history = s, this._plStatus = "ready", this._plError = "", s !== e && await nt(i, t.history_key, s), this._backoffMs = 0;
      } catch (e) {
        this._plStatus = "error", this._plError = E(e), this._backoffMs = Math.min(this._backoffMs ? this._backoffMs * 2 : 6e4, ie), this._scheduleRefresh(this._backoffMs);
      } finally {
        this._refreshing = !1;
      }
    }
  }
  /** Names and artwork for playlists we only know by uri: favourites first, then single lookups. */
  async _fillMeta(i, t, e) {
    let s = te(e);
    if (!s.length) return e;
    await this._ensureFavorites(i, t), e = gt(e, this._favorites), s = te(e);
    const n = [];
    for (const r of s.slice(0, Vs))
      try {
        const a = t.backend === "spotcast" ? await Ss(r) : await Zt(i, t.spotifyplus_entity, r);
        a ? n.push(a) : n.push({ uri: r, name: "Playlist", image: null });
      } catch {
      }
    return gt(e, n);
  }
  /**
   * Spotcast backend: a playlist the user owns that has left their library was deleted in
   * Spotify (deleting only unfollows it). Ownership is learnt while it is still in the library.
   */
  async _dropDeletedSpotcast(i, t, e) {
    if (!this._favorites.length) return e;
    if (!this._accountId)
      try {
        this._accountId = await $s(i, t.spotcast_account || void 0);
      } catch {
        return e;
      }
    return this._accountId ? (e = Es(e, this._favorites, this._accountId), ee(e, Cs(e, new Set(this._favorites.map((s) => s.uri))))) : e;
  }
  /**
   * Spotify never deletes a playlist; "deleting" your own playlist just unfollows it, and it
   * stays fetchable by id. So a history entry the user owns that is no longer among their
   * playlists is a deleted one: drop it. Others' playlists played without following are kept.
   * Checked once a day per entry, a few per refresh.
   */
  async _dropDeleted(i, t, e) {
    var p;
    const s = (p = i.states[t.spotifyplus_entity]) == null ? void 0 : p.attributes.sp_user_id;
    if (typeof s != "string" || !s || !this._favorites.length) return e;
    const n = Date.now(), r = new Set(this._favorites.map((d) => d.uri)), a = Os(e, r, n, Fs, Gs), o = [], l = [];
    for (const d of a)
      try {
        const c = await Zt(i, t.spotifyplus_entity, d);
        (c == null ? void 0 : c.ownerId) === s ? o.push(d) : (l.push(d), c && (e = gt(e, [c])));
      } catch {
        l.push(d);
      }
    return zs(ee(e, o), l, n);
  }
  _scheduleRefresh(i) {
    this._refreshTimer && window.clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(() => void this._refresh(), i);
  }
  // ---- start playback ----------------------------------------------------
  _play(i) {
    var r;
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const s = this._groupLabel(t);
    if (e.backend === "spotifyplus") {
      const a = (r = t.states[e.spotifyplus_entity]) == null ? void 0 : r.state;
      if (!a || a === "unavailable" || a === "unknown") {
        this.showToast(`${e.spotifyplus_entity} is unavailable. Check the SpotifyPlus integration.`);
        return;
      }
    }
    if (this._starting) {
      this.showToast(`Still starting on ${s}…`);
      return;
    }
    if (this.applyDefaultPresetIfCold(t, Ke(t, e.cast_group_entity)), this._starting = { uri: i.uri, since: Date.now() }, this._activeUri = i.uri, this._history = Ps(this._history, i, Date.now()), this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
      var a;
      ((a = this._starting) == null ? void 0 : a.uri) === i.uri && (this._starting = null, this.showToast(`${s} did not start within 60 s. Check the speakers and try again.`, 6e3));
    }, se), e.start_script) {
      this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
        var a;
        ((a = this._starting) == null ? void 0 : a.uri) === i.uri && (this._starting = null, this.showToast(`${s} did not start within 6 min. Check the speakers and try again.`, 6e3));
      }, Bs), _s(t, e.start_script, {
        context_uri: i.uri,
        device_name: s,
        group_entity: e.cast_group_entity,
        shuffle: e.shuffle
      }).then(() => this._scheduleRefresh(bt)).catch((a) => {
        this._starting = null, this.showToast(E(a), 8e3);
      });
      return;
    }
    if (e.backend === "spotcast") {
      Jt(t, e.cast_group_entity, i.uri, e.shuffle, e.spotcast_account || void 0).then(() => {
        this._lastContextUri = i.uri, this._scheduleRefresh(bt);
      }).catch((a) => {
        this._starting = null, this._startTimer && window.clearTimeout(this._startTimer), this.showToast(E(a), 8e3);
      });
      return;
    }
    const n = () => ys(t, e.spotifyplus_entity, i.uri, e.device_name, e.shuffle);
    n().catch(async (a) => {
      var o;
      this.showToast(`${E(a)} Reloading SpotifyPlus and retrying…`, 8e3), this._starting = { uri: i.uri, since: Date.now() }, this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
        var l;
        ((l = this._starting) == null ? void 0 : l.uri) === i.uri && (this._starting = null, this.showToast(`${e.device_name} did not start within 90 s. Check the speakers and try again.`, 6e3));
      }, se + 3e4);
      try {
        await ws(t, e.spotifyplus_entity, () => {
          var l, p;
          return (p = (l = this._hass) == null ? void 0 : l.states[e.spotifyplus_entity]) == null ? void 0 : p.state;
        }), await vs(t, e.spotifyplus_entity, e.device_name);
      } catch {
        await bs(t, e.spotifyplus_entity);
      }
      ((o = this._starting) == null ? void 0 : o.uri) === i.uri && await n();
    }).then(() => this._scheduleRefresh(bt)).catch((a) => {
      this._starting = null, this.showToast(E(a), 8e3);
    });
  }
  /** Playback landed on the Cast group: clear the busy state. */
  _checkStarted(i) {
    const t = this._config;
    if (!t || !this._starting) return;
    const e = i.states[t.cast_group_entity], s = typeof (e == null ? void 0 : e.attributes.app_name) == "string" ? e.attributes.app_name : "", n = new Date(this._starting.since).toISOString();
    if ((e == null ? void 0 : e.state) === "playing" && /spotify/i.test(s) && i.states[t.cast_group_entity].last_updated > n) {
      const a = this._starting.uri;
      this._starting = null, this._startTimer && window.clearTimeout(this._startTimer), this._scriptDoneTimer && window.clearTimeout(this._scriptDoneTimer), this._scriptDoneTimer = void 0, t.backend === "spotcast" && !t.start_script && this._scheduleContextCheck(a);
      return;
    }
    const r = t.start_script ? i.states[t.start_script] : void 0;
    if (r && r.state === "off" && r.last_changed > n && !this._scriptDoneTimer) {
      const a = this._starting.uri;
      this._scriptDoneTimer = window.setTimeout(() => {
        var o;
        this._scriptDoneTimer = void 0, ((o = this._starting) == null ? void 0 : o.uri) === a && (this._starting = null, this._startTimer && window.clearTimeout(this._startTimer), this.showToast(`${this._groupLabel(i)} did not start. Check the speakers and the Home Assistant log.`, 8e3));
      }, qs);
    }
  }
  /**
   * When the Spotify Cast app logs the group in, it resumes whatever the account played last,
   * and that resume can land a second after Spotcast's play command and override it: the group
   * then plays yesterday's podcast instead of the tapped playlist. Once the group reports
   * playing, ask Spotify what context is running (one API call) and, if it is not the one we
   * asked for, send the play command once more; with the device now active it sticks.
   */
  _scheduleContextCheck(i) {
    this._contextCheckTimer && window.clearTimeout(this._contextCheckTimer), this._contextCheckTimer = window.setTimeout(async () => {
      this._contextCheckTimer = void 0;
      const t = this._hass, e = this._config;
      if (!(!t || !e || this._starting))
        try {
          const s = await Kt(t, e.spotcast_account || void 0);
          if (!s.isPlaying || s.contextUri === i) return;
          await Jt(t, e.cast_group_entity, i, e.shuffle, e.spotcast_account || void 0), this._lastContextUri = i;
        } catch (s) {
          console.warn("multiroom-spotify-card: could not verify the playing context:", E(s));
        }
    }, Ys);
  }
  // ---- render ------------------------------------------------------------
  render() {
    var F, y, g, P;
    const i = this._config, t = this._hass;
    if (!i) return f;
    if (!t) return u`<ha-card><div class="card"></div></ha-card>`;
    const e = Date.now(), s = this.speakers(t, e), n = Xe(t, this._playerEntity), r = i.backend === "spotifyplus" ? ((F = t.states[i.spotifyplus_entity]) == null ? void 0 : F.attributes) ?? {} : {}, a = typeof r.media_playlist == "string" && r.media_playlist || ((y = this._history.entries[this._lastContextUri ?? ""]) == null ? void 0 : y.name) || ((g = this._history.entries[this._activeUri ?? ""]) == null ? void 0 : g.name) || "", o = this._groupLabel(t), l = this._starting, p = l ? ((P = this._history.entries[l.uri]) == null ? void 0 : P.name) || "playlist" : "", d = n.found && (n.state === "unavailable" || n.state === "unknown"), c = this._playerEntity, h = this.renderHeader(i.title, s), _ = this.renderPlaylists({
      layout: i.playlist_layout,
      count: i.playlist_count,
      columns: i.tile_columns,
      columnsWide: i.tile_columns_wide,
      playlists: this._playlists,
      status: this._plStatus,
      error: this._plError,
      activeUri: this._activeUri,
      onPlay: (T) => this._play(T),
      onRetry: () => void this._refresh()
    }), A = this.renderNowBar(n, e, {
      title: l ? `Starting on ${o}…` : void 0,
      subtitle: l ? `${p} · ${Math.round((e - l.since) / 1e3)} s` : !n.found || d ? c : [n.artist, a].filter(Boolean).join(" · "),
      busy: !!l,
      disabled: !!l,
      onPrev: () => as(t, c),
      onPlayPause: () => ns(t, c),
      onNext: () => rs(t, c),
      onSeek: (T) => os(t, c, T)
    });
    return this.renderShell({ header: h, playlists: _, speakers: this.renderSpeakerSection(s), now: A }, [this.renderPicker(s), this.renderToast()]);
  }
};
O([
  w()
], S.prototype, "_config", 2);
O([
  w()
], S.prototype, "_history", 2);
O([
  w()
], S.prototype, "_plStatus", 2);
O([
  w()
], S.prototype, "_plError", 2);
O([
  w()
], S.prototype, "_activeUri", 2);
O([
  w()
], S.prototype, "_starting", 2);
O([
  w()
], S.prototype, "_favorites", 2);
S = O([
  ue("multiroom-spotify-card")
], S);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "multiroom-spotify-card",
  name: "Multiroom Spotify Card",
  description: "Start Spotify playlists on a Chromecast speaker group as a Spotify Connect session, via Spotcast or SpotifyPlus.",
  preview: !1
});
export {
  S as MultiroomSpotifyCard
};
