/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis, vt = st.ShadowRoot && (st.ShadyCSS === void 0 || st.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, bt = Symbol(), Ct = /* @__PURE__ */ new WeakMap();
let ee = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== bt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (vt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Ct.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Ct.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $e = (s) => new ee(typeof s == "string" ? s : s + "", void 0, bt), wt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new ee(e, s, bt);
}, ke = (s, t) => {
  if (vt) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = st.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, Tt = vt ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return $e(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: Ae, getOwnPropertyDescriptor: Pe, getOwnPropertyNames: Ee, getOwnPropertySymbols: Ce, getPrototypeOf: Te } = Object, S = globalThis, Mt = S.trustedTypes, Me = Mt ? Mt.emptyScript : "", ht = S.reactiveElementPolyfillSupport, G = (s, t) => s, it = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Me : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, xt = (s, t) => !Se(s, t), Ut = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: xt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), S.litPropertyMetadata ?? (S.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ut) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Ae(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = Pe(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const a = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(G("elementProperties"))) return;
    const t = Te(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(G("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(G("properties"))) {
      const e = this.properties, i = [...Ee(e), ...Ce(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(Tt(r));
    } else t !== void 0 && e.push(Tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ke(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : it).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = i.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : it;
      this._$Em = r;
      const c = l.fromAttribute(e, a.type);
      this[r] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? xt)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
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
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
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
    (e = this._$EO) == null || e.forEach((i) => {
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[G("elementProperties")] = /* @__PURE__ */ new Map(), D[G("finalized")] = /* @__PURE__ */ new Map(), ht == null || ht({ ReactiveElement: D }), (S.reactiveElementVersions ?? (S.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, Ot = (s) => s, rt = Y.trustedTypes, zt = rt ? rt.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, se = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, ie = "?" + k, Ue = `<${ie}>`, O = document, Z = () => O.createComment(""), X = (s) => s === null || typeof s != "object" && typeof s != "function", $t = Array.isArray, Oe = (s) => $t(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", ft = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Dt = /-->/g, Rt = />/g, C = RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), It = /'/g, jt = /"/g, re = /^(?:script|style|textarea|title)$/i, ne = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = ne(1), b = ne(2), A = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), T = O.createTreeWalker(O, 129);
function oe(s, t) {
  if (!$t(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return zt !== void 0 ? zt.createHTML(t) : t;
}
const ze = (s, t) => {
  const e = s.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = F;
  for (let a = 0; a < e; a++) {
    const l = s[a];
    let c, u, p = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, u = o.exec(l), u !== null); ) f = o.lastIndex, o === F ? u[1] === "!--" ? o = Dt : u[1] !== void 0 ? o = Rt : u[2] !== void 0 ? (re.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = C) : u[3] !== void 0 && (o = C) : o === C ? u[0] === ">" ? (o = r ?? F, p = -1) : u[1] === void 0 ? p = -2 : (p = o.lastIndex - u[2].length, c = u[1], o = u[3] === void 0 ? C : u[3] === '"' ? jt : It) : o === jt || o === It ? o = C : o === Dt || o === Rt ? o = F : (o = C, r = void 0);
    const g = o === C && s[a + 1].startsWith("/>") ? " " : "";
    n += o === F ? l + Ue : p >= 0 ? (i.push(c), l.slice(0, p) + se + l.slice(p) + k + g) : l + k + (p === -2 ? a : g);
  }
  return [oe(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class J {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, l = this.parts, [c, u] = ze(t, e);
    if (this.el = J.createElement(c, i), T.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = T.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(se)) {
          const f = u[o++], g = r.getAttribute(p).split(k), E = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: E[2], strings: g, ctor: E[1] === "." ? Re : E[1] === "?" ? Ie : E[1] === "@" ? je : ot }), r.removeAttribute(p);
        } else p.startsWith(k) && (l.push({ type: 6, index: n }), r.removeAttribute(p));
        if (re.test(r.tagName)) {
          const p = r.textContent.split(k), f = p.length - 1;
          if (f > 0) {
            r.textContent = rt ? rt.emptyScript : "";
            for (let g = 0; g < f; g++) r.append(p[g], Z()), T.nextNode(), l.push({ type: 2, index: ++n });
            r.append(p[f], Z());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ie) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(k, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += k.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = O.createElement("template");
    return i.innerHTML = t, i;
  }
}
function N(s, t, e = s, i) {
  var o, a;
  if (t === A) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = X(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = N(s, r._$AS(s, t.values), r, i)), t;
}
class De {
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? O).importNode(e, !0);
    T.currentNode = r;
    let n = T.nextNode(), o = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new Q(n, n.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (c = new Ne(n, this, t)), this._$AV.push(c), l = i[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = T.nextNode(), o++);
    }
    return T.currentNode = O, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Q {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = N(this, t, e), X(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Oe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && X(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = J.createElement(oe(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new De(r, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Nt.get(t.strings);
    return e === void 0 && Nt.set(t.strings, e = new J(t)), e;
  }
  k(t) {
    $t(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new Q(this.O(Z()), this.O(Z()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = Ot(t).nextSibling;
      Ot(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class ot {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = N(this, t, e, 0), o = !X(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = n[0], l = 0; l < n.length - 1; l++) c = N(this, a[i + l], e, l), c === A && (c = this._$AH[l]), o || (o = !X(c) || c !== this._$AH[l]), c === h ? t = h : t !== h && (t += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Re extends ot {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ie extends ot {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class je extends ot {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = N(this, t, e, 0) ?? h) === A) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ne {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const mt = Y.litHtmlPolyfillSupport;
mt == null || mt(J, Q), (Y.litHtmlVersions ?? (Y.litHtmlVersions = [])).push("3.3.3");
const He = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new Q(t.insertBefore(Z(), n), n, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
let U = class extends D {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = He(e, this.renderRoot, this.renderOptions);
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
var te;
U._$litElement$ = !0, U.finalized = !0, (te = M.litElementHydrateSupport) == null || te.call(M, { LitElement: U });
const _t = M.litElementPolyfillSupport;
_t == null || _t({ LitElement: U });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: xt }, Be = (s = Le, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, s, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, s, a), a;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, s, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function kt(s) {
  return (t, e) => typeof e == "object" ? Be(s, t, e) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(s) {
  return kt({ ...s, state: !0, attribute: !1 });
}
const ae = "oklch(0.62 0.16 285)";
function m(s, t) {
  throw new Error(`${s}: ${t}`);
}
function nt(s) {
  return typeof s == "string" && /^media_player\.[a-z0-9_]+$/.test(s);
}
function K(s, t, e, i, r, n) {
  if (t == null || t === "") return n;
  const o = typeof t == "string" ? Number(t) : t;
  return (typeof o != "number" || !Number.isInteger(o) || o < i || o > r) && m(s, `${e} must be an integer between ${i} and ${r}`), o;
}
function qe(s, t) {
  (!Array.isArray(t) || t.length === 0) && m(s, "speakers must be a non-empty list of Google Cast media_player entities");
  const e = [], i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const n = typeof r == "string" ? r : r == null ? void 0 : r.entity;
    nt(n) || m(s, `speaker "${String(n)}" is not a media_player entity`), i.has(n) && m(s, `speaker ${n} is listed twice`), i.add(n);
    const o = typeof r == "object" && r && typeof r.name == "string" && r.name.trim() ? r.name.trim() : void 0;
    e.push(o ? { entity: n, name: o } : { entity: n });
  }
  return e;
}
function Ve(s, t, e) {
  if (t == null) return [];
  Array.isArray(t) || m(s, "presets must be a list");
  const i = new Set(e.map((n) => n.entity)), r = /* @__PURE__ */ new Set();
  return t.map((n, o) => {
    const a = typeof (n == null ? void 0 : n.name) == "string" ? n.name.trim() : "";
    a || m(s, `preset #${o + 1} needs a name`), r.has(a) && m(s, `preset "${a}" is defined twice`), r.add(a);
    const l = n.levels ?? {};
    (typeof l != "object" || Array.isArray(l)) && m(s, `preset "${a}": levels must be a map of entity -> volume`);
    const c = {};
    for (const [u, p] of Object.entries(l)) {
      i.has(u) || m(s, `preset "${a}": ${u} is not in speakers`);
      const f = typeof p == "string" ? Number(p) : p;
      (typeof f != "number" || !Number.isInteger(f) || f < 0 || f > 100) && m(s, `preset "${a}": volume for ${u} must be an integer 0-100`), c[u] = f;
    }
    return { name: a, levels: c };
  });
}
function le(s, t) {
  const e = qe(s, t.speakers), i = Ve(s, t.presets, e), r = typeof t.default_preset == "string" ? t.default_preset.trim() : "";
  r && !i.some((a) => a.name === r) && m(s, `default_preset "${r}" is not one of the presets`);
  const n = t.layout ?? "vertical";
  ["vertical", "horizontal", "auto"].includes(n) || m(s, 'layout must be "vertical", "horizontal" or "auto"');
  const o = t.master_style ?? "panel";
  return ["plain", "panel", "tree"].includes(o) || m(s, 'master_style must be "plain", "panel" or "tree"'), {
    layout: n,
    master_label: R(t.master_label, "All"),
    master_style: o,
    speakers: e,
    presets: i,
    speaker_count: K(s, t.speaker_count, "speaker_count", 1, 50, e.length),
    preset_tolerance: K(s, t.preset_tolerance, "preset_tolerance", 0, 50, 3),
    master_volume: t.master_volume !== !1,
    default_preset: r
  };
}
function ce(s, t) {
  const e = t.playlist_layout ?? "tiles";
  e !== "tiles" && e !== "list" && m(s, 'playlist_layout must be "tiles" or "list"');
  const i = t.playlist_sort ?? "last_played";
  i !== "last_played" && i !== "play_count" && m(s, 'playlist_sort must be "last_played" or "play_count"');
  const r = K(s, t.tile_columns, "tile_columns", 2, 8, 3);
  return {
    playlist_layout: e,
    playlist_sort: i,
    playlist_count: K(s, t.playlist_count, "playlist_count", 1, 50, e === "list" ? 10 : 6),
    tile_columns: r,
    /** playlists per row when the card renders two columns (horizontal / auto when wide) */
    tile_columns_wide: K(s, t.tile_columns_wide, "tile_columns_wide", 2, 8, r)
  };
}
function R(s, t) {
  return typeof s == "string" && s.trim() ? s.trim() : t;
}
const tt = "multiroom-spotify-card-ma";
function Fe(s) {
  return (!s || typeof s != "object") && m(tt, "invalid configuration"), nt(s.group_entity) || m(tt, "group_entity must be the Music Assistant media_player entity of your Cast group"), {
    type: s.type,
    group_entity: s.group_entity,
    ...le(tt, s),
    ...ce(tt, s),
    title: typeof s.title == "string" ? s.title : "Listening",
    accent: R(s.accent, ae),
    ma_config_entry_id: typeof s.ma_config_entry_id == "string" ? s.ma_config_entry_id.trim() : ""
  };
}
const We = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Ge(s, t, e) {
  var r;
  const i = ((r = s.states[e]) == null ? void 0 : r.state) === "playing";
  return t.map((n) => {
    const o = s.states[n.entity], a = (o == null ? void 0 : o.attributes) ?? {}, l = !!o && !We.has(o.state), c = typeof a.volume_level == "number", u = c ? a.volume_level : 0, p = a.is_volume_muted === !0, f = l && !c, g = typeof a.friendly_name == "string" ? a.friendly_name : void 0;
    return {
      entity: n.entity,
      name: n.name ?? g ?? n.entity.replace("media_player.", ""),
      vol: Math.round(u * 100),
      on: l && !f && !p,
      available: l,
      standby: f,
      notInGroup: i && f
    };
  });
}
function pe(s, t) {
  const e = s.states[t];
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
  const i = e.attributes, r = (n) => typeof n == "number" && Number.isFinite(n) ? n : null;
  return {
    found: !0,
    state: e.state,
    playing: e.state === "playing",
    title: typeof i.media_title == "string" ? i.media_title : "",
    artist: typeof i.media_artist == "string" ? i.media_artist : "",
    art: typeof i.entity_picture == "string" && i.entity_picture ? i.entity_picture : null,
    duration: r(i.media_duration),
    position: r(i.media_position),
    positionUpdatedAt: typeof i.media_position_updated_at == "string" ? i.media_position_updated_at : null
  };
}
function Ye(s, t, e) {
  const i = s.filter((r) => r.available && !r.standby);
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
      } else if (!o.on || Math.abs(o.vol - a) > e) {
        n = !1;
        break;
      }
    }
    if (n) return r.name;
  }
  return null;
}
function Ke(s) {
  const t = s.filter((e) => e.on);
  return t.length ? Math.round(t.reduce((e, i) => e + i.vol, 0) / t.length) : null;
}
function Ht(s, t) {
  const e = /* @__PURE__ */ new Map(), i = s.filter((o) => o.on);
  if (!i.length) return e;
  const r = i.reduce((o, a) => o + a.vol, 0) / i.length, n = Math.max(0, Math.min(100, t));
  for (const o of i) {
    const a = r > 0 && o.vol > 0 ? o.vol * n / r : n;
    e.set(o.entity, Math.max(0, Math.min(100, Math.round(a))));
  }
  return e;
}
function ue(s, t) {
  const e = s.states[t];
  return e ? !["playing", "paused", "buffering", "on"].includes(e.state) : !0;
}
function Ze(s) {
  const t = s.filter((e) => e.on);
  if (t.length === 0) {
    const e = s.filter((i) => i.available);
    return e.length ? e.every((i) => i.standby) ? "Speakers idle" : "No speakers selected" : "No speakers available";
  }
  return t.length === 1 ? t[0].name : `${t[0].name} + ${t.length - 1} more`;
}
function Xe(s, t) {
  var i;
  const e = [(i = s.themes) != null && i.darkMode ? "d" : "l"];
  for (const r of t) {
    const n = s.states[r];
    e.push(n ? n.last_updated : "-");
  }
  return e.join("|");
}
function I(s) {
  if (s && typeof s == "object") {
    const t = s;
    if (typeof t.message == "string") return t.message;
    if (t.error && typeof t.error.message == "string") return t.error.message;
    if (t.body && typeof t.body.message == "string") return t.body.message;
  }
  return String(s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = { ATTRIBUTE: 1 }, he = (s) => (...t) => ({ _$litDirective$: s, values: t });
let fe = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
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
const v = he(class extends fe {
  constructor(s) {
    var t;
    if (super(s), s.type !== de.ATTRIBUTE || s.name !== "class" || ((t = s.strings) == null ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return " " + Object.keys(s).filter((t) => s[t]).join(" ") + " ";
  }
  update(s, [t]) {
    var i, r;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), s.strings !== void 0 && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((n) => n !== "")));
      for (const n in t) t[n] && !((i = this.nt) != null && i.has(n)) && this.st.add(n);
      return this.render(t);
    }
    const e = s.element.classList;
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
const me = "important", Je = " !" + me, W = he(class extends fe {
  constructor(s) {
    var t;
    if (super(s), s.type !== de.ATTRIBUTE || s.name !== "style" || ((t = s.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return Object.keys(s).reduce((t, e) => {
      const i = s[e];
      return i == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(s, [t]) {
    const { style: e } = s.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft) t[i] == null && (this.ft.delete(i), i.includes("-") ? e.removeProperty(i) : e[i] = null);
    for (const i in t) {
      const r = t[i];
      if (r != null) {
        this.ft.add(i);
        const n = typeof r == "string" && r.endsWith(Je);
        i.includes("-") || n ? e.setProperty(i, n ? r.slice(0, -11) : r, n ? me : "") : e[i] = r;
      }
    }
    return A;
  }
}), Qe = wt`
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
`, w = {
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
function ts(s, t) {
  if (s.position === null) return 0;
  let e = s.position;
  if (s.playing && s.positionUpdatedAt) {
    const i = Date.parse(s.positionUpdatedAt);
    Number.isFinite(i) && (e += Math.max(0, (t - i) / 1e3));
  }
  return s.duration !== null && (e = Math.min(e, s.duration)), Math.max(0, e);
}
const q = (s, t, e, i) => s.callService("media_player", t, i, { entity_id: e }), _e = (s, t) => q(s, "media_play_pause", t), ye = (s, t) => q(s, "media_next_track", t), ge = (s, t) => q(s, "media_previous_track", t), ve = (s, t, e) => q(s, "media_seek", t, { seek_position: Math.max(0, Math.round(e)) }), be = (s, t, e) => q(s, "volume_set", t, { volume_level: Math.max(0, Math.min(100, e)) / 100 }), j = (s, t, e) => q(s, "volume_mute", t, { is_volume_muted: e });
async function es(s, t, e) {
  const i = [], r = [];
  for (const n of t) {
    if (!n.available) continue;
    const o = e.levels[n.entity];
    if (o === void 0) {
      (n.on || n.standby) && r.push(n.entity);
      continue;
    }
    n.on || i.push(j(s, n.entity, !1)), i.push(be(s, n.entity, o));
  }
  r.length && i.push(j(s, r, !0)), await Promise.all(i);
}
function Lt(s) {
  const t = Math.max(0, Math.floor(s)), e = Math.floor(t / 60), i = t % 60;
  return `${e}:${String(i).padStart(2, "0")}`;
}
function Bt(s) {
  return Math.max(0, Math.min(1, s));
}
function qt(s, t) {
  let e = 0, i, r = !1, n;
  const o = () => {
    n = void 0, r && (r = !1, e = Date.now(), s(i));
  };
  return (a) => {
    const l = Date.now(), c = l - e;
    if (c >= t && !n) {
      e = l, s(a);
      return;
    }
    i = a, r = !0, n || (n = setTimeout(o, Math.max(0, t - c)));
  };
}
var ss = Object.defineProperty, we = (s, t, e, i) => {
  for (var r = void 0, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = o(t, e, r) || r);
  return r && ss(t, e, r), r;
};
const et = 1500, Vt = 150, At = class At extends U {
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
    var i;
    const e = this.groupEntity;
    return !!e && ((i = t.states[e]) == null ? void 0 : i.state) === "playing";
  }
  // ---- hass --------------------------------------------------------------
  set hass(t) {
    const e = !this._hass;
    this._hass = t;
    const i = this.section;
    if (!i) return;
    const r = [this.groupEntity ?? "", ...i.speakers.map((o) => o.entity), ...this.extraEntities()].filter(Boolean), n = Xe(t, r);
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
    var i, r;
    const e = ((r = (i = this._hass) == null ? void 0 : i.themes) == null ? void 0 : r.darkMode) ?? !0;
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
    const i = this.section;
    return i ? Ge(t, i.speakers, this.groupEntity ?? "").map((r) => {
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
    const i = this._intent.get(t) ?? {};
    this._intent.set(t, { ...i, ...e });
  }
  _bump(t, e, i = et) {
    this._remember(t, e), this._overrides.set(t, { ...e, until: Date.now() + i }), this.requestUpdate(), window.setTimeout(() => this.requestUpdate(), i + 50);
  }
  _toggle(t) {
    !this._hass || !t.available || (this._bump(t.entity, { on: !t.on }), this.run(j(this._hass, t.entity, t.on)));
  }
  _muteAll(t, e) {
    if (!this._hass) return;
    const i = t.filter((r) => r.available).map((r) => r.entity);
    if (i.length) {
      for (const r of i) this._bump(r, { on: !e });
      this.run(j(this._hass, i, e));
    }
  }
  applyPreset(t, e) {
    if (this._hass) {
      for (const i of t) {
        if (!i.available) continue;
        const r = e.levels[i.entity];
        this._bump(i.entity, r === void 0 ? { on: !1 } : { on: !0, vol: r }, et + 1e3);
      }
      this.run(es(this._hass, t, e));
    }
  }
  /** Apply the configured default preset if the group is cold and nothing was touched. */
  applyDefaultPresetIfCold(t, e) {
    const i = this.section;
    if (!(i != null && i.default_preset)) return;
    const r = i.presets.find((n) => n.name === i.default_preset);
    r && e && this._intent.size === 0 && this.applyPreset(this.speakers(t, Date.now()), r);
  }
  _sendVolume(t, e) {
    !this._hass || this._lastSent.get(t) === e || (this._lastSent.set(t, e), this.run(be(this._hass, t, e)));
  }
  _throttleFor(t) {
    let e = this._throttled.get(t);
    return e || (e = qt((i) => this._sendVolume(t, i), Vt), this._throttled.set(t, e)), e;
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
  _track(t, e, i) {
    const r = (n) => {
      t.removeEventListener("pointermove", e), t.removeEventListener("pointerup", r), t.removeEventListener("pointercancel", r), i(n);
    };
    t.addEventListener("pointermove", e), t.addEventListener("pointerup", r), t.addEventListener("pointercancel", r);
  }
  _pct(t, e) {
    const i = t.getBoundingClientRect();
    return Math.round(Bt((e.clientX - i.left) / i.width) * 100);
  }
  _dragStart(t, e) {
    const i = this._hass;
    if (!i || !e.available) return;
    const r = this._capture(t);
    e.on || this.run(j(i, e.entity, !1)), this._lastSent.delete(e.entity);
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
    for (const [i, r] of Ht(t, e)) this._sendVolume(i, r);
  }
  _masterDragStart(t, e) {
    const i = this._hass;
    if (!i) return;
    let r = e.filter((l) => l.on && l.available);
    if (!r.length) {
      if (r = e.filter((l) => l.available && !l.notInGroup).map((l) => ({ ...l, on: !0, vol: 0 })), !r.length) return;
      this.run(j(i, r.map((l) => l.entity), !1));
    }
    const n = this._capture(t);
    for (const l of r) this._lastSent.delete(l.entity);
    this._masterThrottle || (this._masterThrottle = qt((l) => this._sendMaster(this._masterBase, l), Vt)), this._masterBase = r;
    const o = (l, c) => {
      for (const [u, p] of Ht(r, l))
        this._remember(u, { vol: p, on: !0 }), this._overrides.set(u, { vol: p, on: !0, until: c });
      this.requestUpdate();
    }, a = (l) => {
      const c = this._pct(n, l);
      o(c, 1 / 0), this._masterThrottle(c);
    };
    this._track(n, a, (l) => {
      const c = this._pct(n, l);
      o(c, Date.now() + et), this._sendMaster(r, c), window.setTimeout(() => this.requestUpdate(), et + 50);
    }), a(t);
  }
  // ---- seek --------------------------------------------------------------
  _seekStart(t, e, i) {
    if (!e.duration) return;
    const r = this._capture(t), n = e.duration, o = (l) => {
      const c = r.getBoundingClientRect();
      return Bt((l.clientX - c.left) / c.width) * n;
    }, a = (l) => {
      this._seek = { pos: o(l), until: 1 / 0, stamp: e.positionUpdatedAt }, this.requestUpdate();
    };
    this._track(r, a, (l) => {
      const c = o(l);
      this._seek = { pos: c, until: Date.now() + 2500, stamp: e.positionUpdatedAt }, this.requestUpdate(), this.run(i(c));
    }), a(t);
  }
  position(t, e) {
    const i = this._seek;
    if (i) {
      if (e < i.until && i.stamp === t.positionUpdatedAt) return i.pos;
      this._seek = null;
    }
    return ts(t, e);
  }
  // ---- misc --------------------------------------------------------------
  run(t) {
    t && t.catch((e) => this.showToast(I(e)));
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
    const i = ((r = this.section) == null ? void 0 : r.layout) ?? "vertical";
    return d`<ha-card>
      <div class=${v({ card: !0, horizontal: i === "horizontal", auto: i === "auto" })}>
        <div class="col-left">${t.header}${t.playlists}</div>
        <div class="col-right">${t.now}${t.speakers}</div>
        ${e}
      </div>
    </ha-card>`;
  }
  renderHeader(t, e) {
    const i = e.filter((r) => r.on).length;
    return d`<div class="header">
      <div class="header-text">
        <span class="title">${t}</span>
        <span class="summary ellipsis">${Ze(e)}</span>
      </div>
      <button class="pill" title="Choose speakers" @click=${() => this._pickerOpen = !this._pickerOpen}>
        ${w.airplay}<span>${i}</span>
      </button>
    </div>`;
  }
  renderSpeakerSection(t) {
    const e = this.section, i = t.filter((o) => o.on).length, r = Ye(t, e.presets, e.preset_tolerance), n = t.slice(0, e.speaker_count);
    return d`
      <div class="section-head">
        <span class="label">Speakers</span>
        <button class="text-btn" @click=${() => this._muteAll(t, i > 0)}>
          ${i > 0 ? "Mute all" : "Play on all"}
        </button>
      </div>
      ${e.presets.length ? d`<div class="presets">
            ${e.presets.map(
      (o) => d`<button class=${v({ preset: !0, active: r === o.name })} @click=${() => this.applyPreset(t, o)}>
                ${o.name}
              </button>`
    )}
          </div>` : h}
      <div class=${v({ speakers: !0, [`style-${e.master_style}`]: e.master_volume })}>
        ${e.master_volume ? this.renderMaster(t) : h}
        ${n.map((o) => this.renderSpeaker(o))}
      </div>
    `;
  }
  renderMaster(t) {
    const e = this.section, i = Ke(t);
    return d`<div
      class=${v({ "speaker-row": !0, master: !0, on: i !== null, [e.master_style]: !0 })}
      title="Master volume: scales every speaker that is on"
    >
      <span class="dot" role="img" aria-label="Master volume">${w.volume}</span>
      <span class="sp-name ellipsis">${e.master_label}</span>
      <div class="track-hit" @pointerdown=${(n) => this._masterDragStart(n, t)}>
        <div class="track"><div class="fill" style=${W({ width: `${i ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${i ?? "–"}</span>
    </div>`;
  }
  renderSpeaker(t) {
    const e = t.available ? t.notInGroup ? "Not in the Cast group: add it in the Google Home app" : t.standby ? "Idle" : "Toggle speaker" : "Unavailable";
    return d`<div
      class=${v({ "speaker-row": !0, on: t.on, unavailable: !t.available, standby: t.standby, orphan: t.notInGroup })}
      title=${e}
    >
      <button class="dot" title=${e} ?disabled=${!t.available} @click=${() => this._toggle(t)}>${w.speaker}</button>
      <span class="sp-name ellipsis">${t.name}</span>
      <div class="track-hit" @pointerdown=${(i) => this._dragStart(i, t)}>
        <div class="track"><div class="fill" style=${W({ width: `${t.on ? t.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${t.notInGroup ? "n/a" : t.standby ? "–" : t.vol}</span>
    </div>`;
  }
  renderPicker(t) {
    if (!this._pickerOpen) return h;
    const e = () => this._pickerOpen = !1;
    return d`<div class="scrim" @click=${e}>
      <div class="sheet" @click=${(i) => i.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-title">Play on</span>
          <button class="sheet-done" @click=${e}>Done</button>
        </div>
        <div class="sheet-list">
          ${t.map(
      (i) => d`<button class=${v({ "sheet-row": !0, on: i.on })} ?disabled=${!i.available} @click=${() => this._toggle(i)}>
              <span class="check">${w.check}</span>
              <span class="sheet-name ellipsis">${i.name}</span>
              <span class="sheet-kind">${i.available ? i.notInGroup ? "not in group" : i.standby ? "idle" : i.on ? `${i.vol}` : "muted" : "offline"}</span>
            </button>`
    )}
        </div>
      </div>
    </div>`;
  }
  renderToast() {
    return this._toast ? d`<div class="toast">${this._toast}</div>` : h;
  }
  renderArt(t, e, i, r, n = !1) {
    const o = !!e && !this._broken.has(i);
    return d`<div class=${v({ art: !0, [t]: !0, pulse: n })}>
      <div class="stripes"></div>
      ${o ? d`<img
            src=${e}
            alt=""
            loading="lazy"
            @load=${(a) => a.target.classList.add("loaded")}
            @error=${() => this._imgBroken(i)}
          />` : d`<div class="art-label">ART ${String(r + 1).padStart(2, "0")}</div>`}
    </div>`;
  }
  renderPlaylists(t) {
    return d`<div class="playlists-area">${this._renderPlaylistsInner(t)}</div>`;
  }
  _renderPlaylistsInner(t) {
    if (t.status === "error" && !t.playlists.length)
      return d`<div class="pl-msg">
        <span>${t.error || "Could not load playlists"}</span>
        <button class="text-btn" @click=${t.onRetry}>Retry</button>
      </div>`;
    if (t.status === "ready" && !t.playlists.length) return d`<div class="pl-msg">No playlists yet</div>`;
    if (t.status !== "ready" && !t.playlists.length) {
      const i = t.layout === "list" ? Math.min(t.count, 10) : t.count, r = Array.from({ length: i }, (n, o) => o);
      return t.layout === "list" ? d`<div class="list">
            ${r.map(
        (n) => d`<div class=${v({ "list-row": !0, first: n === 0 })}>
                ${this.renderArt("list-art", null, `ph${n}`, n, !0)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`
      )}
          </div>` : d`<div class="tiles" style=${W({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
            ${r.map(
        (n) => d`<div class="tile">${this.renderArt("tile-art", null, `ph${n}`, n, !0)}<span class="tile-name">&nbsp;</span></div>`
      )}
          </div>`;
    }
    const e = t.playlists.slice(0, t.count);
    return t.layout === "list" ? d`<div class="list">
        ${e.map(
      (i, r) => d`<button class=${v({ "list-row": !0, first: r === 0, active: i.uri === t.activeUri })} @click=${() => t.onPlay(i)}>
            ${this.renderArt("list-art", i.image, i.uri, r)}
            <span class="list-name ellipsis">${i.name}</span>
            <span class="list-play">${w.playSmall}</span>
          </button>`
    )}
      </div>` : d`<div class="tiles" style=${W({ "--cols": String(t.columns), "--cols-wide": String(t.columnsWide ?? t.columns) })}>
      ${e.map(
      (i, r) => d`<button class=${v({ tile: !0, active: i.uri === t.activeUri })} title=${i.name} @click=${() => t.onPlay(i)}>
          <div class="tile-art-wrap" style="position:relative;width:100%">
            ${this.renderArt("tile-art", i.image, i.uri, r)}
            <div class="ring"></div>
          </div>
          <span class="tile-name ellipsis">${i.name}</span>
        </button>`
    )}
    </div>`;
  }
  renderNowBar(t, e, i) {
    const r = this.position(t, e), n = t.duration ?? 0, o = n > 0 ? r / n * 100 : 0, a = t.found && (t.state === "unavailable" || t.state === "unknown");
    let l = i.title ?? t.title;
    i.title || (t.found ? a ? l = "Player unavailable" : l || (l = t.state === "playing" ? "Playing" : t.state === "paused" ? "Paused" : "Nothing playing") : l = "Player not found");
    const c = i.subtitle ?? t.artist, u = i.disabled || !t.found || a, p = !u && n > 0;
    return d`<div class=${v({ now: !0, paused: !t.playing && !i.busy, busy: !!i.busy })}>
      <div class="now-row">
        ${this.renderArt("now-art", t.art, `now:${t.art ?? ""}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            ${i.busy ? d`<span class="spinner" aria-label="Starting"></span>` : d`<div class="eq"><div></div><div></div><div></div></div>`}
            <span class="now-title ellipsis">${l}</span>
          </div>
          <span class="now-artist ellipsis">${c}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${u} @click=${() => this.run(i.onPrev())}>${w.prev}</button>
          <button class="play" title=${t.playing ? "Pause" : "Play"} ?disabled=${u} @click=${() => this.run(i.onPlayPause())}>
            ${t.playing ? w.pause : w.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${u} @click=${() => this.run(i.onNext())}>${w.next}</button>
        </div>
      </div>
      <div class=${v({ "progress-hit": !0, disabled: !p })} @pointerdown=${(f) => p && this._seekStart(f, t, i.onSeek)}>
        <div class="progress"><div class="progress-fill" style=${W({ width: `${o.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${Lt(r)}</span><span>${n > 0 ? `-${Lt(n - r)}` : "–:––"}</span></div>
      </div>
    </div>`;
  }
};
At.styles = Qe;
let H = At;
we([
  _()
], H.prototype, "_pickerOpen");
we([
  _()
], H.prototype, "_toast");
const is = 300 * 1e3, Ft = /* @__PURE__ */ new Map(), rs = {
  last_played: "last_played_desc",
  play_count: "play_count_desc"
};
async function ns(s) {
  const t = await s.callWS({ type: "config_entries/get", domain: "music_assistant" }), e = Array.isArray(t) ? t : [], i = e.find((r) => r.state === "loaded") ?? e[0];
  if (!i) throw new Error("Music Assistant integration not found");
  return i.entry_id;
}
function os(s) {
  if (!s) return null;
  if (typeof s == "string") {
    const t = s.trim();
    return t || null;
  }
  if (typeof s == "object") {
    const t = s;
    for (const e of ["url", "path"]) {
      const i = t[e];
      if (typeof i == "string" && /^(https?:)?\/\//.test(i)) return i;
    }
  }
  return null;
}
function as(s) {
  if (!Array.isArray(s)) return [];
  const t = [];
  for (const e of s) {
    if (!e || typeof e != "object") continue;
    const i = e;
    typeof i.uri != "string" || typeof i.name != "string" || !i.uri || t.push({ uri: i.uri, name: i.name, image: os(i.image) });
  }
  return t;
}
function ls(s, t, e) {
  return `${s}|${t}|${e}`;
}
async function cs(s, t) {
  const e = ls(t.entryId, t.sort, t.limit), i = Ft.get(e);
  if (!t.force && i && Date.now() - i.at < is) return i.items;
  const r = await s.callService(
    "music_assistant",
    "get_library",
    { config_entry_id: t.entryId, media_type: "playlist", order_by: rs[t.sort], limit: t.limit },
    void 0,
    !1,
    !0
  ), n = (r && typeof r == "object" ? r.response : void 0) ?? {}, o = as(n.items);
  return Ft.set(e, { at: Date.now(), items: o }), o;
}
const ps = (s, t, e) => s.callService(
  "music_assistant",
  "play_media",
  { media_id: e, media_type: "playlist", enqueue: "replace" },
  { entity_id: t }
);
var us = Object.defineProperty, ds = Object.getOwnPropertyDescriptor, lt = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ds(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && us(t, e, r), r;
};
const hs = [
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
  { name: "master_label", selector: { text: {} } },
  { name: "master_style", selector: { select: { mode: "dropdown", options: [{ value: "plain", label: "Plain row" }, { value: "panel", label: "Own panel" }, { value: "tree", label: "Speakers indented under it" }] } } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } },
  { name: "ma_config_entry_id", selector: { text: {} } }
], fs = {
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
  master_label: "Master volume label",
  master_style: "Master volume style",
  title: "Title",
  accent: "Accent color (CSS)",
  ma_config_entry_id: "Music Assistant config entry id (optional)"
};
let L = class extends U {
  constructor() {
    super(...arguments), this._helpersLoaded = !1;
  }
  setConfig(s) {
    this._config = s;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadHaForm();
  }
  /** ha-form is lazy-loaded by the frontend; loading the entities card editor pulls it in. */
  async _loadHaForm() {
    var s, t, e;
    if (customElements.get("ha-form")) {
      this._helpersLoaded = !0;
      return;
    }
    try {
      const i = await ((s = window.loadCardHelpers) == null ? void 0 : s.call(window)), r = i == null ? void 0 : i.createCardElement({ type: "entities", entities: [] });
      (e = r == null ? void 0 : (t = r.constructor).getConfigElement) == null || e.call(t), await customElements.whenDefined("ha-form");
    } catch {
    }
    this._helpersLoaded = !0;
  }
  _formData() {
    const s = this._config ?? {}, t = Array.isArray(s.speakers) ? s.speakers.map((e) => typeof e == "string" ? e : e == null ? void 0 : e.entity).filter(Boolean) : [];
    return { ...s, speakers: t, master_volume: s.master_volume !== !1 };
  }
  _valueChanged(s) {
    if (s.stopPropagation(), !this._config) return;
    const t = s.detail.value, e = this._config, i = /* @__PURE__ */ new Map();
    for (const o of e.speakers ?? []) typeof o == "object" && (o != null && o.name) && i.set(o.entity, o.name);
    const r = (t.speakers ?? []).map((o) => i.has(o) ? { entity: o, name: i.get(o) } : o), n = { ...e, ...t, speakers: r };
    for (const o of Object.keys(n)) {
      const a = n[o];
      (a === "" || a === void 0 || a === null) && delete n[o];
    }
    this._config = n, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: n }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._helpersLoaded ? h : d`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${hs}
        .computeLabel=${(s) => fs[s.name] ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets (Focus, Chill, Dinner, Party…) are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
L.styles = wt`
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
lt([
  kt({ attribute: !1 })
], L.prototype, "hass", 2);
lt([
  _()
], L.prototype, "_config", 2);
lt([
  _()
], L.prototype, "_helpersLoaded", 2);
L = lt([
  at("multiroom-spotify-card-ma-editor")
], L);
var ms = Object.defineProperty, _s = Object.getOwnPropertyDescriptor, V = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? _s(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && ms(t, e, r), r;
};
const ys = 3e3;
let z = class extends H {
  constructor() {
    super(...arguments), this._playlists = [], this._plStatus = "idle", this._plError = "", this._activeUri = null, this._entryId = "", this._fetchSeq = 0;
  }
  get section() {
    return this._config;
  }
  get groupEntity() {
    var s;
    return (s = this._config) == null ? void 0 : s.group_entity;
  }
  get accent() {
    var s;
    return ((s = this._config) == null ? void 0 : s.accent) ?? "";
  }
  // ---- HA card API -------------------------------------------------------
  static getConfigElement() {
    return document.createElement("multiroom-spotify-card-ma-editor");
  }
  static getStubConfig(s) {
    const t = Object.values((s == null ? void 0 : s.states) ?? {}).filter((n) => n.entity_id.startsWith("media_player.")), e = t.filter((n) => n.attributes.mass_player_id !== void 0), i = e.find((n) => n.attributes.mass_player_type === "group") ?? e[0], r = t.filter((n) => n.attributes.mass_player_id === void 0 && typeof n.attributes.volume_level == "number").slice(0, 4);
    return {
      group_entity: (i == null ? void 0 : i.entity_id) ?? "media_player.your_cast_group",
      speakers: r.length ? r.map((n) => n.entity_id) : ["media_player.living_room"],
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  setConfig(s) {
    const t = this._config, e = Fe(s);
    this._config = e, this._activeUri = this._loadActive(e.group_entity), (!t || t.playlist_sort !== e.playlist_sort || t.playlist_count !== e.playlist_count || t.ma_config_entry_id !== e.ma_config_entry_id) && (this._entryId = e.ma_config_entry_id, this._plStatus = "idle", this._hass && this._ensurePlaylists());
  }
  hassChanged(s, t) {
    this._syncActiveWithPlayer(s), t && this._plStatus === "idle" && this._ensurePlaylists();
  }
  connectedCallback() {
    super.connectedCallback(), this._hass && this._config && this._plStatus !== "loading" && this._ensurePlaylists();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._refetchTimer && window.clearTimeout(this._refetchTimer);
  }
  // ---- playlists ---------------------------------------------------------
  async _ensurePlaylists(s = !1) {
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const i = ++this._fetchSeq;
    this._playlists.length || (this._plStatus = "loading");
    try {
      this._entryId || (this._entryId = await ns(t));
      const r = await cs(t, { entryId: this._entryId, sort: e.playlist_sort, limit: e.playlist_count, force: s });
      if (i !== this._fetchSeq) return;
      this._playlists = r, this._plStatus = "ready", this._plError = "";
    } catch (r) {
      if (i !== this._fetchSeq) return;
      this._plStatus = "error", this._plError = I(r);
    }
  }
  _play(s) {
    var r;
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const i = (r = t.states[e.group_entity]) == null ? void 0 : r.state;
    if (!i || i === "unavailable" || i === "unknown") {
      this.showToast(`${e.group_entity} is unavailable. Check the Music Assistant integration.`);
      return;
    }
    this._activeUri = s.uri, this._saveActive(e.group_entity, s.uri), this.applyDefaultPresetIfCold(t, ue(t, e.group_entity)), this.run(
      ps(t, e.group_entity, s.uri).then(() => {
        this._refetchTimer && window.clearTimeout(this._refetchTimer), this._refetchTimer = window.setTimeout(() => void this._ensurePlaylists(!0), ys);
      })
    );
  }
  _storageKey(s) {
    return `multiroom-spotify-card-ma:${s}`;
  }
  _loadActive(s) {
    try {
      return window.localStorage.getItem(this._storageKey(s));
    } catch {
      return null;
    }
  }
  _saveActive(s, t) {
    try {
      t ? window.localStorage.setItem(this._storageKey(s), t) : window.localStorage.removeItem(this._storageKey(s));
    } catch {
    }
  }
  /** Forget the highlighted playlist once the player has clearly stopped. */
  _syncActiveWithPlayer(s) {
    if (!this._config || !this._activeUri) return;
    const t = s.states[this._config.group_entity];
    (!t || ["off", "idle", "unavailable", "unknown", "standby"].includes(t.state)) && (this._activeUri = null, this._saveActive(this._config.group_entity, null));
  }
  // ---- render ------------------------------------------------------------
  render() {
    const s = this._config, t = this._hass;
    if (!s) return h;
    if (!t) return d`<ha-card><div class="card"></div></ha-card>`;
    const e = Date.now(), i = this.speakers(t, e), r = pe(t, s.group_entity), n = this._playlists.find((p) => p.uri === this._activeUri) ?? null, o = r.found && (r.state === "unavailable" || r.state === "unknown"), a = !r.found || o ? s.group_entity : [r.artist, n == null ? void 0 : n.name].filter(Boolean).join(" · "), l = this.renderHeader(s.title, i), c = this.renderPlaylists({
      layout: s.playlist_layout,
      count: s.playlist_count,
      columns: s.tile_columns,
      columnsWide: s.tile_columns_wide,
      playlists: this._playlists,
      status: this._plStatus,
      error: this._plError,
      activeUri: this._activeUri,
      onPlay: (p) => this._play(p),
      onRetry: () => void this._ensurePlaylists(!0)
    }), u = this.renderNowBar(r, e, {
      subtitle: a,
      onPrev: () => ge(t, s.group_entity),
      onPlayPause: () => _e(t, s.group_entity),
      onNext: () => ye(t, s.group_entity),
      onSeek: (p) => ve(t, s.group_entity, p)
    });
    return this.renderShell({ header: l, playlists: c, speakers: this.renderSpeakerSection(i), now: u }, [this.renderPicker(i), this.renderToast()]);
  }
};
V([
  _()
], z.prototype, "_config", 2);
V([
  _()
], z.prototype, "_playlists", 2);
V([
  _()
], z.prototype, "_plStatus", 2);
V([
  _()
], z.prototype, "_plError", 2);
V([
  _()
], z.prototype, "_activeUri", 2);
z = V([
  at("multiroom-spotify-card-ma")
], z);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "multiroom-spotify-card-ma",
  name: "Multiroom Spotify Card (Music Assistant)",
  description: "Start Spotify playlists on multi-room Chromecast speakers through Music Assistant.",
  preview: !1
});
const $ = "multiroom-spotify-card";
function gs(s) {
  (!s || typeof s != "object") && m($, "invalid configuration");
  const t = s.spotifyplus_entity ?? "media_player.spotifyplus";
  nt(t) || m($, "spotifyplus_entity must be the SpotifyPlus media_player entity"), nt(s.cast_group_entity) || m($, "cast_group_entity must be the Google Cast media_player entity of your speaker group");
  const e = R(s.device_name, "");
  e || m($, 'device_name is required (the Spotify Connect name of your speaker group, e.g. "Alla")');
  const i = s.control_via ?? "cast";
  return i !== "cast" && i !== "spotifyplus" && m($, 'control_via must be "cast" or "spotifyplus"'), {
    type: s.type,
    spotifyplus_entity: t,
    cast_group_entity: s.cast_group_entity,
    device_name: e,
    control_via: i,
    shuffle: s.shuffle === !0,
    ...le($, s),
    ...ce($, s),
    history_key: R(s.history_key, "multiroom-spotify-card"),
    fill_with_favorites: s.fill_with_favorites !== !1,
    start_script: (() => {
      const r = R(s.start_script, "");
      return r && !/^script\.[a-z0-9_]+$/.test(r) && m($, "start_script must be a script entity id like script.multiroom_spotify_start"), r;
    })(),
    title: typeof s.title == "string" ? s.title : "Listening",
    accent: R(s.accent, ae)
  };
}
function ct(s) {
  const t = s && typeof s == "object" ? s.response : void 0, e = t && typeof t == "object" ? t.result ?? t : {};
  return e && typeof e == "object" ? e : {};
}
function y(s, ...t) {
  if (s) {
    for (const e of t) if (s[e] !== void 0 && s[e] !== null) return s[e];
  }
}
function St(s) {
  const t = y(s, "items", "Items");
  return Array.isArray(t) ? t.filter((e) => e && typeof e == "object") : [];
}
function xe(s) {
  const t = y(s, "uri", "Uri"), e = y(s, "name", "Name");
  if (typeof t != "string" || typeof e != "string") return null;
  let i = y(s, "image_url", "ImageUrl");
  if (!i) {
    const a = y(s, "images", "Images");
    Array.isArray(a) && a[0] && (i = y(a[0], "url", "Url"));
  }
  const r = y(s, "owner", "Owner"), n = r ? y(r, "id", "Id") : void 0, o = { uri: t, name: e, image: typeof i == "string" && i ? i : null };
  return typeof n == "string" && n && (o.ownerId = n), o;
}
function vs(s) {
  const t = [];
  for (const e of St(ct(s))) {
    const i = y(e, "context", "Context"), r = i ? y(i, "uri", "Uri") ?? null : null, n = y(e, "played_at_ms", "PlayedAtMS"), o = y(e, "played_at", "PlayedAt"), a = typeof n == "number" ? n : typeof o == "string" ? Date.parse(o) : NaN;
    if (!Number.isFinite(a)) continue;
    const l = y(e, "track", "Track");
    t.push({ contextUri: r, playedAt: a, trackName: (l && y(l, "name", "Name")) ?? "" });
  }
  return t;
}
const pt = (s, t, e) => s.callService("spotifyplus", t, e, void 0, !1, !0);
async function bs(s, t, e) {
  const i = { entity_id: t, limit: 50 };
  e && e > 0 && (i.after = e);
  const r = await pt(s, "get_player_recent_tracks", i);
  return vs(r).sort((n, o) => o.playedAt - n.playedAt);
}
async function ws(s, t, e = 500) {
  const i = await pt(s, "get_playlist_favorites", { entity_id: t, limit: 50, limit_total: e });
  return St(ct(i)).map(xe).filter((r) => !!r);
}
async function Wt(s, t, e) {
  const i = e.split(":").pop() ?? e, r = await pt(s, "get_playlist", { entity_id: t, playlist_id: i }), n = xe(ct(r));
  return n ? { ...n, uri: e } : null;
}
const xs = (s, t, e, i, r) => s.callService(
  "spotifyplus",
  "player_media_play_context",
  { entity_id: t, context_uri: e, device_id: i, shuffle: r },
  void 0,
  !1
), $s = (s, t, e) => s.callService("script", t.replace(/^script\./, ""), e, void 0, !1);
async function ks(s, t, e = !1) {
  const i = await pt(s, "get_spotify_connect_devices", { entity_id: t, refresh: e });
  return St(ct(i)).map((r) => y(r, "name", "Name")).filter((r) => typeof r == "string");
}
async function Ss(s, t, e, i = 45e3) {
  const r = Date.now() + i;
  for (; Date.now() < r; ) {
    try {
      if ((await ks(s, t, !1)).some((o) => o.toLowerCase() === e.toLowerCase()))
        return await new Promise((o) => setTimeout(o, 5e3)), !0;
    } catch {
    }
    await new Promise((n) => setTimeout(n, 3e3));
  }
  return !1;
}
const As = (s, t) => s.callService("spotifyplus", "get_spotify_connect_devices", { entity_id: t, refresh: !0 }, void 0, !1, !0);
async function Ps(s, t, e = () => {
  var r;
  return (r = s.states[t]) == null ? void 0 : r.state;
}, i = 3e4) {
  if (!s.callApi) throw new Error("config entry reload not available");
  const r = await s.callWS({ type: "config_entries/get", domain: "spotifyplus" }), n = r == null ? void 0 : r[0];
  if (!n) throw new Error("SpotifyPlus config entry not found");
  await s.callApi("POST", `config/config_entries/entry/${n.entry_id}/reload`), await new Promise((a) => setTimeout(a, 3e3));
  const o = Date.now() + i;
  for (; Date.now() < o; ) {
    await new Promise((l) => setTimeout(l, 1e3));
    const a = e();
    if (a && a !== "unavailable" && a !== "unknown") return;
  }
  throw new Error("SpotifyPlus did not come back after reload");
}
async function Gt(s, t) {
  const e = await s.callWS({ type: "frontend/get_user_data", key: t });
  return (e == null ? void 0 : e.value) ?? null;
}
async function Yt(s, t, e) {
  await s.callWS({ type: "frontend/set_user_data", key: t, value: e });
}
const Kt = { version: 1, lastSeen: 0, entries: {} };
function Es(s) {
  return typeof s == "string" && /^spotify:playlist:[A-Za-z0-9]+$/.test(s);
}
function Cs(s, t) {
  const e = { ...s.entries };
  let i = s.lastSeen;
  for (const r of t) {
    if (r.playedAt <= s.lastSeen || (i = Math.max(i, r.playedAt), !Es(r.contextUri))) continue;
    const n = e[r.contextUri];
    e[r.contextUri] = n ? { ...n, plays: n.plays + 1, lastPlayed: Math.max(n.lastPlayed, r.playedAt) } : { uri: r.contextUri, name: "", image: null, lastPlayed: r.playedAt, plays: 1 };
  }
  return { version: 1, lastSeen: i, entries: e };
}
function Ts(s, t, e) {
  const i = s.entries[t.uri];
  return {
    ...s,
    entries: {
      ...s.entries,
      [t.uri]: i ? { ...i, name: t.name || i.name, image: t.image ?? i.image, lastPlayed: Math.max(i.lastPlayed, e) } : { uri: t.uri, name: t.name, image: t.image, lastPlayed: e, plays: 0 }
    }
  };
}
function yt(s, t) {
  let e = !1;
  const i = { ...s.entries };
  for (const r of t) {
    const n = i[r.uri];
    n && (n.name !== r.name || r.image && n.image !== r.image) && (i[r.uri] = { ...n, name: r.name, image: r.image ?? n.image }, e = !0);
  }
  return e ? { ...s, entries: i } : s;
}
function Zt(s) {
  return Object.values(s.entries).filter((t) => !t.name).map((t) => t.uri);
}
function Ms(s, t, e) {
  const i = Object.values(s.entries).filter((r) => r.name);
  return i.sort((r, n) => t === "play_count" && n.plays - r.plays || n.lastPlayed - r.lastPlayed), i.slice(0, e).map((r) => ({ uri: r.uri, name: r.name, image: r.image }));
}
function Us(s, t, e) {
  if (s.length >= e) return s.slice(0, e);
  const i = new Set(s.map((n) => n.uri)), r = [...s];
  for (const n of t) {
    if (r.length >= e) break;
    i.has(n.uri) || (i.add(n.uri), r.push({ uri: n.uri, name: n.name, image: n.image }));
  }
  return r;
}
function Os(s, t, e, i, r) {
  return Object.values(s.entries).filter((n) => !t.has(n.uri) && (n.validatedAt === void 0 || e - n.validatedAt > i)).sort((n, o) => (n.validatedAt ?? 0) - (o.validatedAt ?? 0)).slice(0, r).map((n) => n.uri);
}
function zs(s, t) {
  const e = { ...s.entries };
  let i = !1;
  for (const r of t) r in e && (delete e[r], i = !0);
  return i ? { ...s, entries: e } : s;
}
function Ds(s, t, e) {
  const i = { ...s.entries };
  let r = !1;
  for (const n of t) i[n] && (i[n] = { ...i[n], validatedAt: e }, r = !0);
  return r ? { ...s, entries: i } : s;
}
function Rs(s, t = 200) {
  const e = Object.values(s.entries);
  if (e.length <= t) return s;
  e.sort((r, n) => n.lastPlayed - r.lastPlayed);
  const i = {};
  for (const r of e.slice(0, t)) i[r.uri] = r;
  return { ...s, entries: i };
}
function gt(s) {
  return !!s && typeof s == "object" && s.version === 1 && typeof s.entries == "object";
}
var Is = Object.defineProperty, js = Object.getOwnPropertyDescriptor, ut = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? js(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Is(t, e, r), r;
};
const Ns = [
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
  { name: "master_label", selector: { text: {} } },
  { name: "master_style", selector: { select: { mode: "dropdown", options: [{ value: "plain", label: "Plain row" }, { value: "panel", label: "Own panel" }, { value: "tree", label: "Speakers indented under it" }] } } },
  { name: "fill_with_favorites", selector: { boolean: {} } },
  { name: "history_key", selector: { text: {} } },
  { name: "start_script", selector: { entity: { domain: "script" } } },
  { name: "title", selector: { text: {} } },
  { name: "accent", selector: { text: {} } }
], Hs = {
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
  master_label: "Master volume label",
  master_style: "Master volume style",
  fill_with_favorites: "Fill empty slots with my own playlists",
  history_key: "Play history key (shared by cards using the same key)",
  start_script: "Start via HA script (server-side recovery, optional)",
  title: "Title",
  accent: "Accent color (CSS)"
};
let B = class extends U {
  constructor() {
    super(...arguments), this._ready = !1;
  }
  setConfig(s) {
    this._config = s;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadHaForm();
  }
  /** ha-form is lazy-loaded by the frontend; loading the entities card editor pulls it in. */
  async _loadHaForm() {
    var s, t, e;
    if (!customElements.get("ha-form"))
      try {
        const i = await ((s = window.loadCardHelpers) == null ? void 0 : s.call(window)), r = i == null ? void 0 : i.createCardElement({ type: "entities", entities: [] });
        (e = r == null ? void 0 : (t = r.constructor).getConfigElement) == null || e.call(t), await customElements.whenDefined("ha-form");
      } catch {
      }
    this._ready = !0;
  }
  _formData() {
    const s = this._config ?? {}, t = Array.isArray(s.speakers) ? s.speakers.map((e) => typeof e == "string" ? e : e == null ? void 0 : e.entity).filter(Boolean) : [];
    return {
      ...s,
      speakers: t,
      spotifyplus_entity: s.spotifyplus_entity ?? "media_player.spotifyplus",
      control_via: s.control_via ?? "cast",
      master_volume: s.master_volume !== !1,
      fill_with_favorites: s.fill_with_favorites !== !1,
      shuffle: s.shuffle === !0
    };
  }
  _valueChanged(s) {
    if (s.stopPropagation(), !this._config) return;
    const t = s.detail.value, e = this._config, i = /* @__PURE__ */ new Map();
    for (const o of e.speakers ?? []) typeof o == "object" && (o != null && o.name) && i.set(o.entity, o.name);
    const r = (t.speakers ?? []).map((o) => i.has(o) ? { entity: o, name: i.get(o) } : o), n = { ...e, ...t, speakers: r };
    for (const o of Object.keys(n)) {
      const a = n[o];
      (a === "" || a === void 0 || a === null) && delete n[o];
    }
    this._config = n, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: n }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this.hass || !this._config || !this._ready ? h : d`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${Ns}
        .computeLabel=${(s) => Hs[s.name] ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
};
B.styles = wt`
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
ut([
  kt({ attribute: !1 })
], B.prototype, "hass", 2);
ut([
  _()
], B.prototype, "_config", 2);
ut([
  _()
], B.prototype, "_ready", 2);
B = ut([
  at("multiroom-spotify-card-editor")
], B);
var Ls = Object.defineProperty, Bs = Object.getOwnPropertyDescriptor, P = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Bs(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Ls(t, e, r), r;
};
const Xt = 6e4, qs = 36e4, Vs = 5e3, Jt = 6e4, Qt = 10 * 6e4, Fs = 60 * 6e4, Ws = 5, Gs = 1440 * 6e4, Ys = 5;
let x = class extends H {
  constructor() {
    super(...arguments), this._history = Kt, this._plStatus = "idle", this._plError = "", this._activeUri = null, this._starting = null, this._favorites = [], this._favoritesAt = 0, this._refreshing = !1, this._historyLoaded = !1, this._backoffMs = 0;
  }
  get section() {
    return this._config;
  }
  get groupEntity() {
    var s;
    return (s = this._config) == null ? void 0 : s.cast_group_entity;
  }
  get accent() {
    var s;
    return ((s = this._config) == null ? void 0 : s.accent) ?? "";
  }
  extraEntities() {
    return this._config ? [this._config.spotifyplus_entity] : [];
  }
  ticking(s) {
    var t, e;
    return !!this._starting || super.ticking(s) || ((e = s.states[((t = this._config) == null ? void 0 : t.spotifyplus_entity) ?? ""]) == null ? void 0 : e.state) === "playing";
  }
  get _playerEntity() {
    const s = this._config;
    return s.control_via === "spotifyplus" ? s.spotifyplus_entity : s.cast_group_entity;
  }
  // ---- HA card API -------------------------------------------------------
  static getConfigElement() {
    return document.createElement("multiroom-spotify-card-editor");
  }
  static getStubConfig(s) {
    var r, n, o;
    const t = Object.values((s == null ? void 0 : s.states) ?? {}).filter((a) => a.entity_id.startsWith("media_player.")), e = ((r = t.find((a) => a.entity_id.includes("spotifyplus"))) == null ? void 0 : r.entity_id) ?? "media_player.spotifyplus", i = t.filter((a) => typeof a.attributes.app_id == "string" || typeof a.attributes.app_name == "string");
    return {
      spotifyplus_entity: e,
      cast_group_entity: ((n = i[0]) == null ? void 0 : n.entity_id) ?? "media_player.your_cast_group",
      device_name: ((o = i[0]) == null ? void 0 : o.attributes.friendly_name) ?? "Speaker group",
      speakers: i.slice(1, 5).map((a) => a.entity_id),
      presets: [],
      playlist_layout: "tiles",
      playlist_sort: "last_played",
      playlist_count: 6
    };
  }
  setConfig(s) {
    const t = this._config, e = gs(s);
    this._config = e, (!t || t.history_key !== e.history_key || t.spotifyplus_entity !== e.spotifyplus_entity) && (this._historyLoaded = !1, this._history = Kt, this._plStatus = "idle", this._hass && this._refresh());
  }
  hassChanged(s, t) {
    this._checkStarted(s), t && this._plStatus === "idle" && this._refresh();
  }
  connectedCallback() {
    super.connectedCallback(), this._intervalTimer = window.setInterval(() => {
      document.visibilityState === "visible" && this._refresh();
    }, Qt), this._hass && this._config && this._plStatus !== "loading" && this._refresh();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const s of [this._refreshTimer, this._intervalTimer, this._startTimer, this._scriptDoneTimer]) s && window.clearTimeout(s);
    this._intervalTimer && window.clearInterval(this._intervalTimer);
  }
  // ---- history / playlists ----------------------------------------------
  get _playlists() {
    const s = this._config;
    if (!s) return [];
    const t = Ms(this._history, s.playlist_sort, s.playlist_count);
    return s.fill_with_favorites ? Us(t, this._favorites, s.playlist_count) : t;
  }
  async _ensureFavorites(s, t) {
    Date.now() - this._favoritesAt < Fs || (this._favorites = await ws(s, t.spotifyplus_entity), this._favoritesAt = Date.now());
  }
  async _refresh() {
    const s = this._hass, t = this._config;
    if (!(!s || !t || this._refreshing)) {
      this._refreshing = !0, Object.keys(this._history.entries).length || (this._plStatus = "loading");
      try {
        if (!this._historyLoaded) {
          let n = await Gt(s, t.history_key);
          !gt(n) && t.history_key === "multiroom-spotify-card" && (n = await Gt(s, "spotifyplus-media-card"), gt(n) && await Yt(s, t.history_key, n)), gt(n) && (this._history = n), this._historyLoaded = !0;
        }
        const e = this._history, i = await bs(s, t.spotifyplus_entity, e.lastSeen);
        let r = Cs(e, i);
        await this._ensureFavorites(s, t), r = await this._fillMeta(s, t, r), r = await this._dropDeleted(s, t, r), r = Rs(r), this._history = r, this._plStatus = "ready", this._plError = "", r !== e && await Yt(s, t.history_key, r), this._backoffMs = 0;
      } catch (e) {
        this._plStatus = "error", this._plError = I(e), this._backoffMs = Math.min(this._backoffMs ? this._backoffMs * 2 : 6e4, Qt), this._scheduleRefresh(this._backoffMs);
      } finally {
        this._refreshing = !1;
      }
    }
  }
  /** Names and artwork for playlists we only know by uri: favourites first, then single lookups. */
  async _fillMeta(s, t, e) {
    let i = Zt(e);
    if (!i.length) return e;
    await this._ensureFavorites(s, t), e = yt(e, this._favorites), i = Zt(e);
    const r = [];
    for (const n of i.slice(0, Ws))
      try {
        const o = await Wt(s, t.spotifyplus_entity, n);
        o ? r.push(o) : r.push({ uri: n, name: "Playlist", image: null });
      } catch {
      }
    return yt(e, r);
  }
  /**
   * Spotify never deletes a playlist; "deleting" your own playlist just unfollows it, and it
   * stays fetchable by id. So a history entry the user owns that is no longer among their
   * playlists is a deleted one: drop it. Others' playlists played without following are kept.
   * Checked once a day per entry, a few per refresh.
   */
  async _dropDeleted(s, t, e) {
    var c;
    const i = (c = s.states[t.spotifyplus_entity]) == null ? void 0 : c.attributes.sp_user_id;
    if (typeof i != "string" || !i || !this._favorites.length) return e;
    const r = Date.now(), n = new Set(this._favorites.map((u) => u.uri)), o = Os(e, n, r, Gs, Ys), a = [], l = [];
    for (const u of o)
      try {
        const p = await Wt(s, t.spotifyplus_entity, u);
        (p == null ? void 0 : p.ownerId) === i ? a.push(u) : (l.push(u), p && (e = yt(e, [p])));
      } catch {
        l.push(u);
      }
    return Ds(zs(e, a), l, r);
  }
  _scheduleRefresh(s) {
    this._refreshTimer && window.clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(() => void this._refresh(), s);
  }
  // ---- start playback ----------------------------------------------------
  _play(s) {
    var n;
    const t = this._hass, e = this._config;
    if (!t || !e) return;
    const i = (n = t.states[e.spotifyplus_entity]) == null ? void 0 : n.state;
    if (!i || i === "unavailable" || i === "unknown") {
      this.showToast(`${e.spotifyplus_entity} is unavailable. Check the SpotifyPlus integration.`);
      return;
    }
    if (this._starting) {
      this.showToast(`Still starting on ${e.device_name}…`);
      return;
    }
    if (this.applyDefaultPresetIfCold(t, ue(t, e.cast_group_entity)), this._starting = { uri: s.uri, since: Date.now() }, this._activeUri = s.uri, this._history = Ts(this._history, s, Date.now()), this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
      var o;
      ((o = this._starting) == null ? void 0 : o.uri) === s.uri && (this._starting = null, this.showToast(`${e.device_name} did not start within 60 s. Check the speakers and try again.`, 6e3));
    }, Xt), e.start_script) {
      this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
        var o;
        ((o = this._starting) == null ? void 0 : o.uri) === s.uri && (this._starting = null, this.showToast(`${e.device_name} did not start within 6 min. Check the speakers and try again.`, 6e3));
      }, qs), $s(t, e.start_script, {
        context_uri: s.uri,
        device_name: e.device_name,
        group_entity: e.cast_group_entity,
        shuffle: e.shuffle
      }).then(() => this._scheduleRefresh(Jt)).catch((o) => {
        this._starting = null, this.showToast(I(o), 8e3);
      });
      return;
    }
    const r = () => xs(t, e.spotifyplus_entity, s.uri, e.device_name, e.shuffle);
    r().catch(async (o) => {
      var a;
      this.showToast(`${I(o)} Reloading SpotifyPlus and retrying…`, 8e3), this._starting = { uri: s.uri, since: Date.now() }, this._startTimer && window.clearTimeout(this._startTimer), this._startTimer = window.setTimeout(() => {
        var l;
        ((l = this._starting) == null ? void 0 : l.uri) === s.uri && (this._starting = null, this.showToast(`${e.device_name} did not start within 90 s. Check the speakers and try again.`, 6e3));
      }, Xt + 3e4);
      try {
        await Ps(t, e.spotifyplus_entity, () => {
          var l, c;
          return (c = (l = this._hass) == null ? void 0 : l.states[e.spotifyplus_entity]) == null ? void 0 : c.state;
        }), await Ss(t, e.spotifyplus_entity, e.device_name);
      } catch {
        await As(t, e.spotifyplus_entity);
      }
      ((a = this._starting) == null ? void 0 : a.uri) === s.uri && await r();
    }).then(() => this._scheduleRefresh(Jt)).catch((o) => {
      this._starting = null, this.showToast(I(o), 8e3);
    });
  }
  /** Playback landed on the Cast group: clear the busy state. */
  _checkStarted(s) {
    const t = this._config;
    if (!t || !this._starting) return;
    const e = s.states[t.cast_group_entity], i = typeof (e == null ? void 0 : e.attributes.app_name) == "string" ? e.attributes.app_name : "", r = new Date(this._starting.since).toISOString();
    if ((e == null ? void 0 : e.state) === "playing" && /spotify/i.test(i) && s.states[t.cast_group_entity].last_updated > r) {
      this._starting = null, this._startTimer && window.clearTimeout(this._startTimer), this._scriptDoneTimer && window.clearTimeout(this._scriptDoneTimer), this._scriptDoneTimer = void 0;
      return;
    }
    const n = t.start_script ? s.states[t.start_script] : void 0;
    if (n && n.state === "off" && n.last_changed > r && !this._scriptDoneTimer) {
      const o = this._starting.uri;
      this._scriptDoneTimer = window.setTimeout(() => {
        var a;
        this._scriptDoneTimer = void 0, ((a = this._starting) == null ? void 0 : a.uri) === o && (this._starting = null, this._startTimer && window.clearTimeout(this._startTimer), this.showToast(`${t.device_name} did not start. Check the speakers and the Home Assistant log.`, 8e3));
      }, Vs);
    }
  }
  // ---- render ------------------------------------------------------------
  render() {
    var E, Pt, Et;
    const s = this._config, t = this._hass;
    if (!s) return h;
    if (!t) return d`<ha-card><div class="card"></div></ha-card>`;
    const e = Date.now(), i = this.speakers(t, e), r = pe(t, this._playerEntity), n = ((E = t.states[s.spotifyplus_entity]) == null ? void 0 : E.attributes) ?? {}, o = typeof n.media_playlist == "string" && n.media_playlist || ((Pt = this._history.entries[this._activeUri ?? ""]) == null ? void 0 : Pt.name) || "", a = this._starting, l = a ? ((Et = this._history.entries[a.uri]) == null ? void 0 : Et.name) || "playlist" : "", c = r.found && (r.state === "unavailable" || r.state === "unknown"), u = this._playerEntity, p = this.renderHeader(s.title, i), f = this.renderPlaylists({
      layout: s.playlist_layout,
      count: s.playlist_count,
      columns: s.tile_columns,
      columnsWide: s.tile_columns_wide,
      playlists: this._playlists,
      status: this._plStatus,
      error: this._plError,
      activeUri: this._activeUri,
      onPlay: (dt) => this._play(dt),
      onRetry: () => void this._refresh()
    }), g = this.renderNowBar(r, e, {
      title: a ? `Starting on ${s.device_name}…` : void 0,
      subtitle: a ? `${l} · ${Math.round((e - a.since) / 1e3)} s` : !r.found || c ? u : [r.artist, o].filter(Boolean).join(" · "),
      busy: !!a,
      disabled: !!a,
      onPrev: () => ge(t, u),
      onPlayPause: () => _e(t, u),
      onNext: () => ye(t, u),
      onSeek: (dt) => ve(t, u, dt)
    });
    return this.renderShell({ header: p, playlists: f, speakers: this.renderSpeakerSection(i), now: g }, [this.renderPicker(i), this.renderToast()]);
  }
};
P([
  _()
], x.prototype, "_config", 2);
P([
  _()
], x.prototype, "_history", 2);
P([
  _()
], x.prototype, "_plStatus", 2);
P([
  _()
], x.prototype, "_plError", 2);
P([
  _()
], x.prototype, "_activeUri", 2);
P([
  _()
], x.prototype, "_starting", 2);
P([
  _()
], x.prototype, "_favorites", 2);
x = P([
  at("multiroom-spotify-card")
], x);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "multiroom-spotify-card",
  name: "Multiroom Spotify Card",
  description: "Start Spotify playlists on a Chromecast speaker group as a Spotify Connect session, via SpotifyPlus.",
  preview: !1
});
