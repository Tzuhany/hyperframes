var LiquidDOM = (() => {
  var fe = Object.defineProperty;
  var ut = Object.getOwnPropertyDescriptor;
  var dt = Object.getOwnPropertyNames;
  var ft = Object.prototype.hasOwnProperty;
  var pt = (e, t) => {
      for (var n in t) fe(e, n, { get: t[n], enumerable: !0 });
    },
    gt = (e, t, n, r) => {
      if ((t && typeof t == "object") || typeof t == "function")
        for (let i of dt(t))
          !ft.call(e, i) &&
            i !== n &&
            fe(e, i, { get: () => t[i], enumerable: !(r = ut(t, i)) || r.enumerable });
      return e;
    };
  var mt = (e) => gt(fe({}, "__esModule", { value: !0 }), e);
  var Jt = {};
  pt(Jt, {
    Container: () => L,
    Glass: () => N,
    Group: () => P,
    Html: () => B,
    Renderer: () => ht,
    Scene: () => k,
  });
  var ne = 2,
    me = 0.6,
    vt = 4,
    ve = (vt - ne) / me;
  function xt(e) {
    return Number.isFinite(e) ? Math.max(e, 0) : 0;
  }
  function ze(e) {
    return Number.isFinite(e) ? Math.min(Math.max(e, 0), 1) : me;
  }
  function Ne(e) {
    return ne + ze(e) * ve;
  }
  function xe() {
    return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  }
  function q(e, t) {
    return {
      a: e.a * t.a + e.c * t.b,
      b: e.b * t.a + e.d * t.b,
      c: e.a * t.c + e.c * t.d,
      d: e.b * t.c + e.d * t.d,
      e: e.a * t.e + e.c * t.f + e.e,
      f: e.b * t.e + e.d * t.f + e.f,
    };
  }
  function pe(e, t) {
    return { a: 1, b: 0, c: 0, d: 1, e, f: t };
  }
  function bt(e, t) {
    return { a: e, b: 0, c: 0, d: t, e: 0, f: 0 };
  }
  function yt(e) {
    let t = Math.cos(e),
      n = Math.sin(e);
    return { a: t, b: n, c: -n, d: t, e: 0, f: 0 };
  }
  function St(e) {
    return q(
      pe(e.x, e.y),
      q(
        pe(e.origin.x, e.origin.y),
        q(yt(e.rotation), q(bt(e.scaleX, e.scaleY), pe(-e.origin.x, -e.origin.y))),
      ),
    );
  }
  function F(e, t) {
    return q(e, t);
  }
  function $(e) {
    let t = e.a * e.d - e.b * e.c;
    if (Math.abs(t) < 1e-6) return null;
    let n = 1 / t;
    return {
      a: e.d * n,
      b: -e.b * n,
      c: -e.c * n,
      d: e.a * n,
      e: (e.c * e.f - e.d * e.e) * n,
      f: (e.b * e.e - e.a * e.f) * n,
    };
  }
  function be(e, t) {
    return { a: e.a * t, b: e.b * t, c: e.c * t, d: e.d * t, e: e.e * t, f: e.f * t };
  }
  function W(e, t, n) {
    return { x: e.a * t + e.c * n + e.e, y: e.b * t + e.d * n + e.f };
  }
  function Fe(e) {
    let t = Math.hypot(e.a, e.b),
      n = Math.hypot(e.c, e.d);
    return Math.max(Math.min(t, n), 1e-4);
  }
  function Ct(e) {
    return e ? { x: e.x, y: e.y } : { x: 0, y: 0 };
  }
  function ke(e) {
    return e ? { r: e.r, g: e.g, b: e.b, a: e.a } : { r: 0, g: 0, b: 0, a: 0 };
  }
  function re(e, t) {
    t &&
      (t.x !== void 0 && (e.x = t.x),
      t.y !== void 0 && (e.y = t.y),
      t.scaleX !== void 0 && (e.scaleX = t.scaleX),
      t.scaleY !== void 0 && (e.scaleY = t.scaleY),
      t.rotation !== void 0 && (e.rotation = t.rotation),
      t.origin !== void 0 && (e.origin = Ct(t.origin)));
  }
  function We(e) {
    let t = e instanceof k ? e : (e?._parent ?? null);
    for (; t; ) {
      if (t instanceof k) return t;
      t = t._parent;
    }
    return null;
  }
  function S(e) {
    We(e)?._notifyMutation();
  }
  function I(e) {
    let t = e._parent;
    if (!t) return;
    let n = We(e);
    ((t._children = t._children.filter((r) => r !== e)), (e._parent = null), n?._notifyMutation());
  }
  function se(e, t) {
    if (e === t) throw new Error("A Group cannot be added to itself.");
    let n = e;
    for (; n; ) {
      if (n === t) throw new Error("A Group cannot be added to one of its descendants.");
      n = "_parent" in n ? n._parent : null;
    }
  }
  function Et(e) {
    let t = e;
    for (; t instanceof P; ) t = t._parent;
    return t;
  }
  function Ye(e, t) {
    if (
      !(!t || e instanceof P) &&
      !(t instanceof k && (e instanceof L || e instanceof B)) &&
      !(t instanceof L && e instanceof N) &&
      !(t instanceof N && e instanceof B)
    )
      throw new Error(
        "A Group child must match the node type accepted by its nearest non-group parent.",
      );
  }
  function K(e, t) {
    for (let n of e._children) (Ye(n, t), n instanceof P && K(n, t));
  }
  var B = class {
      x = 0;
      y = 0;
      scaleX = 1;
      scaleY = 1;
      rotation = 0;
      origin = { x: 0, y: 0 };
      host;
      _width = 0;
      _height = 0;
      _opacity = 1;
      _blur = 0;
      _zIndex = 0;
      _element = null;
      _elementVersion = 0;
      _parent = null;
      constructor(e = {}) {
        ((this.host = document.createElement("div")),
          (this.host.style.position = "absolute"),
          (this.host.style.left = "0"),
          (this.host.style.top = "0"),
          (this.host.style.display = "block"),
          (this.host.style.overflow = "hidden"),
          (this.host.style.transformOrigin = "0 0"),
          re(this, e),
          e.width !== void 0 ? (this.width = e.width) : this.syncHostSize(),
          e.height !== void 0 ? (this.height = e.height) : this.syncHostSize(),
          e.opacity !== void 0 && (this.opacity = e.opacity),
          e.blur !== void 0 && (this.blur = e.blur),
          e.zIndex !== void 0 && (this.zIndex = e.zIndex),
          e.element !== void 0 && this.setElement(e.element));
      }
      get width() {
        return this._width;
      }
      set width(e) {
        this._width !== e && ((this._width = e), this.syncHostSize(), S(this));
      }
      get height() {
        return this._height;
      }
      set height(e) {
        this._height !== e && ((this._height = e), this.syncHostSize(), S(this));
      }
      get opacity() {
        return this._opacity;
      }
      set opacity(e) {
        this._opacity !== e && ((this._opacity = e), S(this));
      }
      get blur() {
        return this._blur;
      }
      set blur(e) {
        this._blur !== e && ((this._blur = e), S(this));
      }
      get zIndex() {
        return this._zIndex;
      }
      set zIndex(e) {
        this._zIndex !== e && ((this._zIndex = e), S(this));
      }
      get element() {
        return this._element;
      }
      setElement(e) {
        this._element !== e &&
          ((this._element = e),
          (this._elementVersion += 1),
          this.host.replaceChildren(),
          e && this.host.append(e),
          S(this));
      }
      remove() {
        I(this);
      }
      syncHostSize() {
        ((this.host.style.width = `${this._width}px`),
          (this.host.style.height = `${this._height}px`));
      }
    },
    N = class extends EventTarget {
      x = 0;
      y = 0;
      scaleX = 1;
      scaleY = 1;
      rotation = 0;
      origin = { x: 0, y: 0 };
      _width = 0;
      _height = 0;
      get width() {
        return this._width;
      }
      set width(e) {
        this._width !== e && ((this._width = e), S(this));
      }
      get height() {
        return this._height;
      }
      set height(e) {
        this._height !== e && ((this._height = e), S(this));
      }
      _cornerRadius = 0;
      _cornerSmoothing = me;
      get cornerRadius() {
        return this._cornerRadius;
      }
      set cornerRadius(e) {
        let t = xt(e);
        this._cornerRadius !== t && ((this._cornerRadius = t), S(this));
      }
      get cornerSmoothing() {
        return this._cornerSmoothing;
      }
      set cornerSmoothing(e) {
        let t = ze(e);
        this._cornerSmoothing !== t && ((this._cornerSmoothing = t), S(this));
      }
      _pointerEvents = !1;
      _zIndex = 0;
      get pointerEvents() {
        return this._pointerEvents;
      }
      set pointerEvents(e) {
        this._pointerEvents !== e && ((this._pointerEvents = e), S(this));
      }
      get zIndex() {
        return this._zIndex;
      }
      set zIndex(e) {
        this._zIndex !== e && ((this._zIndex = e), S(this));
      }
      _parent = null;
      _children = [];
      constructor(e = {}) {
        (super(),
          re(this, e),
          e.width !== void 0 && (this.width = e.width),
          e.height !== void 0 && (this.height = e.height),
          e.cornerRadius !== void 0 && (this.cornerRadius = e.cornerRadius),
          e.cornerSmoothing !== void 0 && (this.cornerSmoothing = e.cornerSmoothing),
          e.pointerEvents !== void 0 && (this.pointerEvents = e.pointerEvents),
          e.zIndex !== void 0 && (this.zIndex = e.zIndex));
      }
      add(e) {
        return (
          e instanceof P && (se(this, e), K(e, this)),
          I(e),
          this._children.push(e),
          (e._parent = this),
          S(e),
          e
        );
      }
      remove() {
        I(this);
      }
      addEventListener(e, t, n) {
        super.addEventListener(e, t, n);
      }
      removeEventListener(e, t, n) {
        super.removeEventListener(e, t, n);
      }
    },
    L = class {
      x = 0;
      y = 0;
      scaleX = 1;
      scaleY = 1;
      rotation = 0;
      origin = { x: 0, y: 0 };
      opacity = 1;
      spacing = 12;
      blur = 8;
      bezelWidth = 14;
      thickness = 90;
      displacementFactor = 1;
      displacementBlur = 6;
      normalDivergenceBlendPower = 0.5;
      normalDivergenceBlendEnabled = !0;
      ior = 1.5;
      contentIor = 1;
      contentDepth = 0;
      dispersion = 0;
      surfaceProfile = "convex";
      lightDirection = -Math.PI / 4;
      specularStrength = 1;
      specularWidth = 1;
      specularFalloff = 1;
      oppositeSpecularStrength = 1;
      specularSharpness = 2;
      specularOpacity = 0.45;
      reflectionOffset = 18;
      tint = { r: 1, g: 1, b: 1, a: 0.15 };
      shadowColor = { r: 0, g: 0, b: 0, a: 0.12 };
      shadowOffsetX = 0;
      shadowOffsetY = 10;
      shadowBlur = 24;
      shadowSpread = 0;
      debugDisplacement = !1;
      zIndex = 0;
      _parent = null;
      _children = [];
      constructor(e = {}) {
        (re(this, e),
          e.opacity !== void 0 && (this.opacity = e.opacity),
          e.spacing !== void 0 && (this.spacing = e.spacing),
          e.blur !== void 0 && (this.blur = e.blur),
          e.bezelWidth !== void 0 && (this.bezelWidth = e.bezelWidth),
          e.thickness !== void 0 && (this.thickness = e.thickness),
          e.displacementFactor !== void 0 && (this.displacementFactor = e.displacementFactor),
          e.displacementBlur !== void 0 && (this.displacementBlur = e.displacementBlur),
          e.normalDivergenceBlendPower !== void 0 &&
            (this.normalDivergenceBlendPower = e.normalDivergenceBlendPower),
          e.normalDivergenceBlendEnabled !== void 0 &&
            (this.normalDivergenceBlendEnabled = e.normalDivergenceBlendEnabled),
          e.ior !== void 0 && (this.ior = e.ior),
          e.contentIor !== void 0 && (this.contentIor = e.contentIor),
          e.contentDepth !== void 0 && (this.contentDepth = e.contentDepth),
          e.dispersion !== void 0 && (this.dispersion = e.dispersion),
          e.surfaceProfile !== void 0 && (this.surfaceProfile = e.surfaceProfile),
          e.lightDirection !== void 0 && (this.lightDirection = e.lightDirection),
          e.specularStrength !== void 0 && (this.specularStrength = e.specularStrength),
          e.specularWidth !== void 0 && (this.specularWidth = e.specularWidth),
          e.specularFalloff !== void 0 && (this.specularFalloff = e.specularFalloff),
          (this.oppositeSpecularStrength = e.oppositeSpecularStrength ?? this.specularStrength),
          e.specularSharpness !== void 0 && (this.specularSharpness = e.specularSharpness),
          e.specularOpacity !== void 0 && (this.specularOpacity = e.specularOpacity),
          e.reflectionOffset !== void 0 && (this.reflectionOffset = e.reflectionOffset),
          e.tint !== void 0 && (this.tint = ke(e.tint)),
          e.shadowColor !== void 0 && (this.shadowColor = ke(e.shadowColor)),
          e.shadowOffsetX !== void 0 && (this.shadowOffsetX = e.shadowOffsetX),
          e.shadowOffsetY !== void 0 && (this.shadowOffsetY = e.shadowOffsetY),
          e.shadowBlur !== void 0 && (this.shadowBlur = e.shadowBlur),
          e.shadowSpread !== void 0 && (this.shadowSpread = e.shadowSpread),
          e.debugDisplacement !== void 0 && (this.debugDisplacement = e.debugDisplacement),
          e.zIndex !== void 0 && (this.zIndex = e.zIndex));
      }
      add(e) {
        return (
          e instanceof P && (se(this, e), K(e, this)),
          I(e),
          this._children.push(e),
          (e._parent = this),
          S(e),
          e
        );
      }
      remove() {
        I(this);
      }
    },
    P = class ge {
      x = 0;
      y = 0;
      scaleX = 1;
      scaleY = 1;
      rotation = 0;
      origin = { x: 0, y: 0 };
      _parent = null;
      _children = [];
      constructor(t = {}) {
        re(this, t);
      }
      add(t) {
        t instanceof ge && se(this, t);
        let n = Et(this);
        return (
          Ye(t, n),
          t instanceof ge && K(t, n),
          I(t),
          this._children.push(t),
          (t._parent = this),
          S(t),
          t
        );
      }
      remove() {
        I(this);
      }
    },
    Q = class extends P {
      _zIndex = 0;
      constructor(e = {}) {
        (super(e), e.zIndex !== void 0 && (this._zIndex = e.zIndex));
      }
      get zIndex() {
        return this._zIndex;
      }
      set zIndex(e) {
        this._zIndex !== e && ((this._zIndex = e), S(this));
      }
    },
    k = class {
      _children = [];
      _listeners = new Set();
      add(e) {
        return (
          e instanceof P && (se(this, e), K(e, this)),
          I(e),
          this._children.push(e),
          (e._parent = this),
          this._notifyMutation(),
          e
        );
      }
      _subscribe(e) {
        return (
          this._listeners.add(e),
          () => {
            this._listeners.delete(e);
          }
        );
      }
      _notifyMutation() {
        for (let e of this._listeners) e();
      }
    };
  function Xe(e) {
    let t = [];
    function n(r, i) {
      let s = { value: 0 },
        a = [];
      (ie(
        r,
        i,
        s,
        (o, l) => {
          (o instanceof L || o instanceof B) &&
            (a.push({ child: o, transform: l, zIndex: o.zIndex, order: s.value }), (s.value += 1));
        },
        (o, l) => {
          (a.push({ child: o, transform: l, zIndex: o.zIndex, order: s.value }), (s.value += 1));
        },
      ),
        a.sort((o, l) => o.zIndex - l.zIndex || o.order - l.order));
      for (let o of a) {
        if (o.child instanceof Q) {
          n(o.child._children, o.transform);
          continue;
        }
        t.push({ child: o.child, transform: o.transform, traversalIndex: t.length });
      }
    }
    return (n(e._children, xe()), t);
  }
  function ye(e) {
    let t = [];
    function n(r, i) {
      let s = { value: 0 },
        a = [];
      (ie(
        r,
        i,
        s,
        (o, l) => {
          o instanceof N &&
            (a.push({ child: o, transform: l, zIndex: o.zIndex, order: s.value }), (s.value += 1));
        },
        (o, l) => {
          (a.push({ child: o, transform: l, zIndex: o.zIndex, order: s.value }), (s.value += 1));
        },
      ),
        a.sort((o, l) => o.zIndex - l.zIndex || o.order - l.order));
      for (let o of a) {
        if (o.child instanceof Q) {
          n(o.child._children, o.transform);
          continue;
        }
        t.push({ glass: o.child, transform: o.transform, traversalIndex: t.length });
      }
    }
    return (n(e._children, xe()), t);
  }
  function Ue(e) {
    let t = [];
    function n(r, i) {
      let s = { value: 0 },
        a = [];
      (ie(
        r,
        i,
        s,
        (o, l) => {
          o instanceof B &&
            (a.push({ child: o, transform: l, zIndex: o.zIndex, order: s.value }), (s.value += 1));
        },
        (o, l) => {
          (a.push({ child: o, transform: l, zIndex: o.zIndex, order: s.value }), (s.value += 1));
        },
      ),
        a.sort((o, l) => o.zIndex - l.zIndex || o.order - l.order));
      for (let o of a) {
        if (o.child instanceof Q) {
          n(o.child._children, o.transform);
          continue;
        }
        t.push({ html: o.child, transform: o.transform, traversalIndex: t.length });
      }
    }
    return (n(e._children, xe()), t);
  }
  function ie(e, t, n, r, i) {
    for (let s of e) {
      let a = F(t, St(s));
      if (s instanceof Q) {
        i(s, a);
        continue;
      }
      if (s instanceof P) {
        ie(s._children, a, n, r, i);
        continue;
      }
      r(s, a);
    }
  }
  var wt = class extends Event {
      glass;
      renderer;
      nativeEvent;
      pointerId;
      pointerType;
      isPrimary;
      button;
      buttons;
      clientX;
      clientY;
      canvasX;
      canvasY;
      localX;
      localY;
      inside;
      constructor(e, t) {
        (super(e, { bubbles: !1, cancelable: !0, composed: !1 }),
          (this.glass = t.glass),
          (this.renderer = t.renderer),
          (this.nativeEvent = t.nativeEvent),
          (this.pointerId = t.nativeEvent.pointerId),
          (this.pointerType = t.nativeEvent.pointerType),
          (this.isPrimary = t.nativeEvent.isPrimary),
          (this.button = t.nativeEvent.button),
          (this.buttons = t.nativeEvent.buttons),
          (this.clientX = t.nativeEvent.clientX),
          (this.clientY = t.nativeEvent.clientY),
          (this.canvasX = t.canvasX),
          (this.canvasY = t.canvasY),
          (this.localX = t.localX),
          (this.localY = t.localY),
          (this.inside = t.inside));
      }
    },
    T = 1;
  function Te(e) {
    let t = 1;
    for (; t < e; ) t *= 2;
    return t;
  }
  function z(e, t = Number.POSITIVE_INFINITY) {
    if (e > t) throw new Error(`Texture size ${e} exceeds the maximum supported size ${t}.`);
    return Math.min(Te(Math.max(1, e)), t);
  }
  function Pt(e, t) {
    let n = new Map(),
      r = 0,
      i = 0,
      s = 0;
    for (let a of e) {
      let o = z(a.deviceWidth) + T * 2,
        l = z(a.deviceHeight) + T * 2;
      if (o > t) return null;
      (r > 0 && r + o > t && ((r = 0), (i += s), (s = 0)),
        n.set(a.html, { x: r, y: i }),
        (r += o),
        (s = Math.max(s, l)));
    }
    return { width: t, height: i + s, rects: n };
  }
  function Tt(e, t) {
    if (e.length === 0)
      throw new Error("Cannot build a glass content atlas without any content entries.");
    let n = 1;
    for (let i of e) n = Math.max(n, z(i.deviceWidth) + T * 2);
    let r = Te(n);
    for (; r <= t; ) {
      let i = Pt(e, r);
      if (i) {
        let s = Te(i.height);
        if (s <= t) return { ...i, height: s };
      }
      r *= 2;
    }
    throw new Error("Glass content atlas exceeds the maximum supported texture size.");
  }
  var Re = 4,
    Rt = Float32Array.BYTES_PER_ELEMENT;
  function m(...e) {
    if (e.length > Re) throw new Error("A vec4 layout lane cannot contain more than four fields.");
    return { type: "vec4f", fields: e };
  }
  function U(e) {
    let t = Object.keys(e),
      n = t.length * Re,
      r = n * Rt,
      i = (s, a, o) => {
        let l = a * n;
        if (l < 0 || l + n > s.length)
          throw new RangeError("GPU struct write is outside the target buffer.");
        s.fill(0, l, l + n);
        for (let d = 0; d < t.length; d += 1) {
          let c = t[d],
            f = e[c].fields,
            u = o[c],
            p = l + d * Re;
          for (let v = 0; v < f.length; v += 1) s[p + v] = u[f[v]];
        }
      };
    return {
      floatCount: n,
      byteSize: r,
      createArray(s = 1) {
        return new Float32Array(Math.max(s, 1) * n);
      },
      wgsl(s) {
        let a = t.map((o) => `  ${o}: vec4f,`).join(`
`);
        return `struct ${s} {
${a}
};`;
      },
      write(s, a) {
        i(s, 0, a);
      },
      writeAt: i,
    };
  }
  var j = class {
      constructor(e, t, n) {
        ((this.device = e),
          (this.layout = t),
          (this.data = t.createArray()),
          (this.buffer = e.createBuffer({ size: t.byteSize, usage: n })));
      }
      device;
      layout;
      data;
      buffer;
      get bindingResource() {
        return { buffer: this.buffer };
      }
      write(e) {
        (this.layout.write(this.data, e), this.device.queue.writeBuffer(this.buffer, 0, this.data));
      }
      destroy() {
        this.buffer.destroy();
      }
    },
    De = class {
      constructor(e, t, n) {
        ((this.device = e), (this.layout = t), (this.usage = n), (this.data = t.createArray()));
      }
      device;
      layout;
      usage;
      data;
      buffer = null;
      capacity = 0;
      get bindingResource() {
        if (!this.buffer) throw new Error("GPU struct array buffer has not been allocated.");
        return { buffer: this.buffer };
      }
      ensureCapacity(e) {
        let t = Math.max(e, 1);
        (this.buffer && t <= this.capacity) ||
          (this.buffer?.destroy(),
          (this.buffer = this.device.createBuffer({
            size: t * this.layout.byteSize,
            usage: this.usage,
          })),
          (this.data = this.layout.createArray(t)),
          (this.capacity = t));
      }
      writeAt(e, t) {
        this.layout.writeAt(this.data, e, t);
      }
      upload(e) {
        this.buffer &&
          this.device.queue.writeBuffer(
            this.buffer,
            0,
            this.data,
            0,
            Math.max(e, 1) * this.layout.floatCount,
          );
      }
      destroy() {
        (this.buffer?.destroy(), (this.buffer = null), (this.capacity = 0));
      }
    },
    Me = U({ params: m("directionX", "directionY", "radius") }),
    He = U({
      canvas: m("width", "height"),
      container: m("opacity"),
      shape: m("smoothing", "bezelWidth", "shapeCount", "surfaceProfile"),
      sdf: m("normalDivergenceBlendPower", "normalDivergenceBlendEnabled"),
      glass: m("thickness", "displacementFactor", "ior", "dispersion"),
      content: m("ior", "depth"),
      lighting: m("x", "y"),
      specular: m("strength", "width", "sharpness", "opacity"),
      specularSecondary: m("oppositeStrength", "falloff", "reflectionOffset"),
      tint: m("r", "g", "b", "a"),
      shadow: m("offsetX", "offsetY", "spread", "blur"),
      shadowColor: m("r", "g", "b", "a"),
      debug: m("displacement"),
    }),
    it = U({
      inverse0: m("a", "c", "e", "minimumScale"),
      inverse1: m("b", "d", "f", "cornerRadius"),
      geometry: m("halfWidth", "halfHeight", "cornerSmoothing"),
      contentRange: m("start", "count"),
    }),
    Ie = U({
      inverse0: m("a", "c", "e", "copiedWidth"),
      inverse1: m("b", "d", "f", "copiedHeight"),
      atlasRect: m("u", "v", "uScale", "vScale"),
      opacity: m("value"),
    }),
    at = U({ bounds: m("minX", "minY", "maxX", "maxY") }),
    ot = U({
      canvas: m("width", "height", "uScale", "vScale"),
      inverse0: m("a", "c", "e", "copiedWidth"),
      inverse1: m("b", "d", "f", "copiedHeight"),
      opacity: m("value"),
    }),
    te = `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(-1.0, 1.0),
    vec2f(3.0, 1.0),
  );

  let position = positions[vertexIndex];
  var output: VertexOutput;
  output.position = vec4f(position, 0.0, 1.0);
  output.uv = vec2f(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  return output;
}
`,
    Dt = `
${te}

@group(0) @binding(0) var downsampleSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let textureSize = vec2f(textureDimensions(inputTexture));
  let texel = 1.0 / max(textureSize, vec2f(1.0));
  let clampedUv = clamp(in.uv, vec2f(0.0), vec2f(1.0));

  return (
    textureSampleLevel(inputTexture, downsampleSampler, clampedUv + texel * vec2f(-0.5, -0.5), 0.0) +
    textureSampleLevel(inputTexture, downsampleSampler, clampedUv + texel * vec2f(0.5, -0.5), 0.0) +
    textureSampleLevel(inputTexture, downsampleSampler, clampedUv + texel * vec2f(-0.5, 0.5), 0.0) +
    textureSampleLevel(inputTexture, downsampleSampler, clampedUv + texel * vec2f(0.5, 0.5), 0.0)
  ) * 0.25;
}
`,
    Mt = `
${te}

@group(0) @binding(0) var upsampleSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  return textureSampleLevel(inputTexture, upsampleSampler, in.uv, 0.0);
}
`,
    Ve = `
${te}

@group(0) @binding(0) var blitSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  return textureSampleLevel(inputTexture, blitSampler, in.uv, 0.0);
}
`,
    Bt = `
${Me.wgsl("BlurParams")}
${te}

@group(0) @binding(0) var blurSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> blurParams: BlurParams;

const ADAPTIVE_BLUR_TAP_RADIUS: f32 = 6.0;
const ADAPTIVE_BLUR_CENTER_WEIGHT: f32 = 0.13702282;
const ADAPTIVE_BLUR_PAIR_OFFSETS: array<f32, 3> = array<f32, 3>(
  1.4584295,
  3.4039848,
  5.3518057,
);
const ADAPTIVE_BLUR_PAIR_WEIGHTS: array<f32, 3> = array<f32, 3>(
  0.23933733,
  0.1394403,
  0.052710965,
);

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let textureSize = vec2f(textureDimensions(inputTexture));
  let blurStep =
    blurParams.params.xy /
    max(textureSize, vec2f(1.0)) *
    (blurParams.params.z / ADAPTIVE_BLUR_TAP_RADIUS);
  let clampedUv = clamp(in.uv, vec2f(0.0), vec2f(1.0));

  var color = textureSampleLevel(inputTexture, blurSampler, clampedUv, 0.0) * ADAPTIVE_BLUR_CENTER_WEIGHT;

  for (var i = 0u; i < 3u; i = i + 1u) {
    let offset = blurStep * ADAPTIVE_BLUR_PAIR_OFFSETS[i];
    let weight = ADAPTIVE_BLUR_PAIR_WEIGHTS[i];
    color =
      color +
      (
        textureSampleLevel(inputTexture, blurSampler, clamp(clampedUv + offset, vec2f(0.0), vec2f(1.0)), 0.0) +
        textureSampleLevel(inputTexture, blurSampler, clamp(clampedUv - offset, vec2f(0.0), vec2f(1.0)), 0.0)
      ) *
      weight;
  }

  return color;
}
`,
    ue = `
${He.wgsl("Globals")}

${it.wgsl("ShapeData")}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

// Smooth union uses the classic polynomial smooth-min only after a normal gate.
// Nearly aligned normals are treated as duplicate or nested boundaries and fall
// back toward a hard union; diverging normals get the full blend radius so real
// corners can form a rounded transition.
// globals.sdf.x shapes a continuous ramp from aligned normals to opposed
// normals. A high power keeps smoothing very small until larger angle
// differences, without introducing a hard threshold in the blend radius.
// globals.sdf.y toggles that normal gate; when disabled, every pair receives
// the full configured smoothing distance.
const SDF_EPSILON: f32 = 0.0001;
const SDF_GRADIENT_STEP_PX: f32 = 1.0;
const DEBUG_DISPLACEMENT_ENCODE_SCALE: f32 = 0.01;
// Smooth blending can flatten the fused SDF so one distance unit covers
// more than one screen pixel. Specular is a screen-space rim effect, so it
// converts SDF distance back to pixels with derivatives and caps the correction
// when the local field becomes nearly flat.
const SPECULAR_DISTANCE_SCALE_FLOOR: f32 = 0.25;
// Width of the antialiased feather around the specular band edge in device
// pixels. This is separate from the configured specular band width.
const SPECULAR_EDGE_FEATHER_PX: f32 = 1.0;
const CIRCULAR_CORNER_EXPONENT: f32 = ${ne.toFixed(8)};
const CORNER_SMOOTHING_EXPONENT_DELTA: f32 = ${ve.toFixed(8)};

// Keep the SDF value and its local normal together. The normal is used to decide
// when smoothing is a real edge-to-edge blend instead of an overlap artifact.
struct SdfSample {
  distance: f32,
  gradient: vec2f,
};

fn normalizeSdfGradient(gradient: vec2f) -> vec2f {
  let magnitude = length(gradient);
  if (magnitude < SDF_EPSILON) {
    return vec2f(0.0, -1.0);
  }
  return gradient / magnitude;
}

fn hardUnion(left: SdfSample, right: SdfSample) -> SdfSample {
  if (left.distance <= right.distance) {
    return left;
  }
  return right;
}

fn smoothUnion(left: SdfSample, right: SdfSample, smoothing: f32) -> SdfSample {
  let normalAlignment = clamp(dot(left.gradient, right.gradient), -1.0, 1.0);
  let normalDivergenceBlendPower = max(globals.sdf.x, 0.0001);
  let gatedNormalDivergence = pow((1.0 - normalAlignment) * 0.5, normalDivergenceBlendPower);
  let normalDivergence = select(1.0, gatedNormalDivergence, globals.sdf.y > 0.5);
  let blendDistance = smoothing * normalDivergence;

  if (blendDistance <= SDF_EPSILON) {
    return hardUnion(left, right);
  }

  let h = clamp(0.5 + 0.5 * (right.distance - left.distance) / blendDistance, 0.0, 1.0);
  return SdfSample(
    mix(right.distance, left.distance, h) - blendDistance * h * (1.0 - h),
    normalizeSdfGradient(mix(right.gradient, left.gradient, h)),
  );
}

fn shapeLocalPos(shape: ShapeData, pos: vec2f) -> vec2f {
  return vec2f(
    shape.inverse0.x * pos.x + shape.inverse0.y * pos.y + shape.inverse0.z,
    shape.inverse1.x * pos.x + shape.inverse1.y * pos.y + shape.inverse1.z,
  );
}

fn superellipseLength(v: vec2f, exponent: f32) -> f32 {
  let a = abs(v);
  return pow(pow(a.x, exponent) + pow(a.y, exponent), 1.0 / exponent);
}

// CPU hit testing mirrors this in renderer/interaction.ts. If this p-norm
// approximation changes, update that path at the same time.
fn sdSmoothRoundRect(localPos: vec2f, halfSize: vec2f, radius: f32, cornerSmoothing: f32) -> f32 {
  let cornerLimit = min(halfSize.x, halfSize.y);
  let clampedRadius = min(max(radius, 0.0), cornerLimit);
  let q = abs(localPos) - halfSize + vec2f(clampedRadius);
  let maxSmoothingThatFits = select(
    0.0,
    max(cornerLimit / max(radius, SDF_EPSILON) - 1.0, 0.0),
    radius > SDF_EPSILON,
  );
  let effectiveSmoothing = min(clamp(cornerSmoothing, 0.0, 1.0), maxSmoothingThatFits);
  let exponent = CIRCULAR_CORNER_EXPONENT + effectiveSmoothing * CORNER_SMOOTHING_EXPONENT_DELTA;
  let cornerDistance = superellipseLength(max(q, vec2f(0.0)), exponent);
  return cornerDistance + min(max(q.x, q.y), 0.0) - clampedRadius;
}

fn shapeDistanceFromLocal(shape: ShapeData, localPos: vec2f) -> f32 {
  let halfSize = shape.geometry.xy;
  let localDistance = sdSmoothRoundRect(
    localPos - halfSize,
    halfSize,
    shape.inverse1.w,
    shape.geometry.z,
  );
  return localDistance * shape.inverse0.w;
}

fn shapeDistance(shape: ShapeData, pos: vec2f) -> f32 {
  return shapeDistanceFromLocal(shape, shapeLocalPos(shape, pos));
}

fn shapeGradient(shape: ShapeData, pos: vec2f) -> vec2f {
  let eps = SDF_GRADIENT_STEP_PX;
  return normalizeSdfGradient(vec2f(
    shapeDistance(shape, pos + vec2f(eps, 0.0)) - shapeDistance(shape, pos - vec2f(eps, 0.0)),
    shapeDistance(shape, pos + vec2f(0.0, eps)) - shapeDistance(shape, pos - vec2f(0.0, eps)),
  ));
}

fn shapeSdfSample(shape: ShapeData, pos: vec2f) -> SdfSample {
  return SdfSample(
    shapeDistance(shape, pos),
    shapeGradient(shape, pos),
  );
}

fn sceneSdfSample(pos: vec2f, shapeCount: u32, smoothing: f32) -> SdfSample {
  var result = SdfSample(1e5, vec2f(0.0, -1.0));
  var found = false;

  for (var i = 0u; i < shapeCount; i = i + 1u) {
    let nextSample = shapeSdfSample(shapes[i], pos);
    if (!found) {
      result = nextSample;
      found = true;
    } else {
      result = smoothUnion(result, nextSample, smoothing);
    }
  }

  return result;
}

fn smootherstep(value: f32) -> f32 {
  let x = clamp(value, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

fn smootherstepDerivative(value: f32) -> f32 {
  let x = clamp(value, 0.0, 1.0);
  return 30.0 * x * x * (x * (x - 2.0) + 1.0);
}

fn convexSquircle(x: f32) -> vec2f {
  let u = 1.0 - clamp(x, 0.0, 1.0);
  let inside = max(1.0 - pow(u, 4.0), 0.0001);
  let height = sqrt(inside);
  let derivative = 2.0 * pow(u, 3.0) / sqrt(inside);
  return vec2f(height, derivative);
}

fn concaveCircle(x: f32) -> vec2f {
  let squircle = convexSquircle(x);
  return vec2f(1.0 - squircle.x, -squircle.y);
}

fn evaluateHeightProfile(profileIndex: f32, x: f32) -> vec2f {
  if (profileIndex < 0.5) {
    return convexSquircle(x);
  }

  if (profileIndex < 1.5) {
    return concaveCircle(x);
  }

  let convex = convexSquircle(x);
  let concave = concaveCircle(x);
  let blend = smootherstep(x);
  let blendDerivative = smootherstepDerivative(x);
  let height = mix(convex.x, concave.x, blend);
  let derivative = mix(convex.y, concave.y, blend) + (concave.x - convex.x) * blendDerivative;
  return vec2f(height, derivative);
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(-1.0, 1.0),
    vec2f(3.0, 1.0),
  );

  let position = positions[vertexIndex];
  var output: VertexOutput;
  output.position = vec4f(position, 0.0, 1.0);
  output.uv = vec2f(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  return output;
}
`,
    qe = `
${ue}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> shapes: array<ShapeData>;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let shapeCount = u32(globals.shape.z);
  let fragCoord = in.uv * globals.canvas.xy;
  let sdfSample = sceneSdfSample(fragCoord, shapeCount, globals.shape.x);
  let distance = sdfSample.distance;
  let fillMask = 1.0 - smoothstep(0.0, 1.4, distance);
  let pixelWidth = max(fwidth(distance), 0.75);
  let bezelWidth = max(globals.shape.y, pixelWidth * 2.0);
  let inwardDistance = max(-distance, 0.0);
  let bezelProgress = clamp(inwardDistance / bezelWidth, 0.0, 1.0);
  let surfaceDerivative = select(
    evaluateHeightProfile(globals.shape.w, bezelProgress).y,
    0.0,
    inwardDistance > bezelWidth,
  );
  let clampedSlope = min(surfaceDerivative, tan(1.4835298));
  let surfaceSlope = sdfSample.gradient * clampedSlope;

  return vec4f(surfaceSlope * fillMask, 0.0, fillMask);
}
`,
    $e = `
${ue}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> shapes: array<ShapeData>;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let shapeCount = u32(globals.shape.z);
  let fragCoord = in.uv * globals.canvas.xy;
  let shadowCoord = fragCoord - globals.shadow.xy;
  let distance = sceneSdfSample(shadowCoord, shapeCount, globals.shape.x).distance - globals.shadow.z;
  let pixelWidth = max(fwidth(distance), 0.75);
  let alpha = 1.0 - smoothstep(0.0, pixelWidth, distance);

  return vec4f(0.0, 0.0, 0.0, alpha);
}
`,
    Ke = `
${He.wgsl("Globals")}
${te}

@group(0) @binding(0) var shadowSampler: sampler;
@group(0) @binding(1) var sceneTexture: texture_2d<f32>;
@group(0) @binding(2) var shadowMaskTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> globals: Globals;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let sceneColor = textureSampleLevel(sceneTexture, shadowSampler, in.uv, 0.0);
  let shadowMask = textureSampleLevel(shadowMaskTexture, shadowSampler, in.uv, 0.0).a;
  let containerOpacity = clamp(globals.container.x, 0.0, 1.0);
  let shadowOpacity = clamp(shadowMask * globals.shadowColor.a * containerOpacity, 0.0, 1.0);
  let color = mix(sceneColor.rgb, globals.shadowColor.rgb, shadowOpacity);

  return vec4f(color, sceneColor.a);
}
`,
    Qe = `
${ue}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> shapes: array<ShapeData>;
@group(0) @binding(2) var backgroundSampler: sampler;
@group(0) @binding(3) var backgroundTextureSharp: texture_2d<f32>;
@group(0) @binding(4) var backgroundTextureBlurred: texture_2d<f32>;
@group(0) @binding(5) var glassContentTexture: texture_2d<f32>;

${Ie.wgsl("ContentData")}

@group(0) @binding(6) var<storage, read> contentEntries: array<ContentData>;
@group(0) @binding(7) var displacementFieldTexture: texture_2d<f32>;

fn sampleBackgroundSharp(uv: vec2f) -> vec3f {
  return textureSampleLevel(backgroundTextureSharp, backgroundSampler, uv, 0.0).rgb;
}

fn sampleBackgroundBlurred(uv: vec2f) -> vec3f {
  return textureSampleLevel(backgroundTextureBlurred, backgroundSampler, uv, 0.0).rgb;
}

fn sampleSurfaceSlope(uv: vec2f) -> vec2f {
  let field = textureSampleLevel(displacementFieldTexture, backgroundSampler, uv, 0.0);
  return select(vec2f(0.0), field.xy / max(field.a, SDF_EPSILON), field.a > SDF_EPSILON);
}

fn contentLocalPos(content: ContentData, glassLocalPos: vec2f) -> vec2f {
  return vec2f(
    content.inverse0.x * glassLocalPos.x + content.inverse0.y * glassLocalPos.y + content.inverse0.z,
    content.inverse1.x * glassLocalPos.x + content.inverse1.y * glassLocalPos.y + content.inverse1.z,
  );
}

fn sampleGlassContentAtlas(content: ContentData, localPos: vec2f) -> vec4f {
  let copiedSize = vec2f(content.inverse0.w, content.inverse1.w);
  if (
    any(copiedSize <= vec2f(0.0)) ||
    any(content.atlasRect.zw <= vec2f(0.0)) ||
    any(localPos < vec2f(0.0)) ||
    any(localPos > copiedSize)
  ) {
    return vec4f(0.0);
  }

  let atlasUv = content.atlasRect.xy + localPos * content.atlasRect.zw;
  let contentColor = textureSampleLevel(glassContentTexture, backgroundSampler, atlasUv, 0.0);
  return vec4f(contentColor.rgb, contentColor.a * clamp(content.opacity.x, 0.0, 1.0));
}

fn sampleGlassContentEntry(
  content: ContentData,
  glassLocalRed: vec2f,
  glassLocalGreen: vec2f,
  glassLocalBlue: vec2f,
  contentMask: f32,
) -> vec4f {
  if (contentMask <= 0.0) {
    return vec4f(0.0);
  }

  let contentRed = sampleGlassContentAtlas(content, contentLocalPos(content, glassLocalRed));
  let contentGreen = sampleGlassContentAtlas(content, contentLocalPos(content, glassLocalGreen));
  let contentBlue = sampleGlassContentAtlas(content, contentLocalPos(content, glassLocalBlue));
  let alpha = max(contentGreen.a, max(contentRed.a, contentBlue.a)) * contentMask;
  return vec4f(vec3f(contentRed.r, contentGreen.g, contentBlue.b), alpha);
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let shapeCount = u32(globals.shape.z);
  let fragCoord = in.uv * globals.canvas.xy;
  let background = sampleBackgroundSharp(in.uv);
  let containerOpacity = clamp(globals.container.x, 0.0, 1.0);

  let sdfSample = sceneSdfSample(fragCoord, shapeCount, globals.shape.x);
  let distance = sdfSample.distance;
  let fillMask = 1.0 - smoothstep(0.0, 1.4, distance);
  let gradient = sdfSample.gradient;
  let pixelWidth = max(fwidth(distance), 0.75);
  let specularDistanceUnitsPerPx = max(
    length(vec2f(dpdx(distance), dpdy(distance))),
    SPECULAR_DISTANCE_SCALE_FLOOR,
  );
  let specularDistancePx = distance / specularDistanceUnitsPerPx;
  let specularInwardDistancePx = max(-specularDistancePx, 0.0);
  let rimWidthPx = max(globals.specular.y, 0.0001);
  let specularOuterMask = 1.0 - smoothstep(0.0, SPECULAR_EDGE_FEATHER_PX, specularDistancePx);
  let specularInnerMask = 1.0 - smoothstep(
    rimWidthPx,
    rimWidthPx + SPECULAR_EDGE_FEATHER_PX,
    specularInwardDistancePx,
  );
  let rimBandMask = specularOuterMask * specularInnerMask;
  let rimNormal = gradient;
  let lightDir = normalize(
    select(vec2f(1.0, 0.0), globals.lighting.xy, dot(globals.lighting.xy, globals.lighting.xy) > 0.0001),
  );
  let mirroredLightDir = -lightDir;

  let bezelWidth = max(globals.shape.y, pixelWidth * 2.0);
  let inwardDistance = max(-distance, 0.0);
  let bezelProgress = clamp(inwardDistance / bezelWidth, 0.0, 1.0);
  let profileResult = evaluateHeightProfile(globals.shape.w, bezelProgress);
  let profileHeight = profileResult.x * bezelWidth;
  let flatHeight = evaluateHeightProfile(globals.shape.w, 1.0).x * bezelWidth;
  let surfaceHeight = globals.glass.x + select(profileHeight, flatHeight, inwardDistance > bezelWidth);
  let surfaceSlope = sampleSurfaceSlope(in.uv);

  // The displacement prepass filters the 2D bevel slope before we rebuild the
  // 3D surface normal. Keeping this as a surface field, rather than a final
  // pixel displacement, lets the glass and content refraction paths still use
  // their own IOR, depth, and dispersion settings.
  let surfaceNormal = normalize(vec3f(surfaceSlope, 1.0));
  let dispersion = max(globals.glass.w, 0.0);
  let baseIor = max(globals.glass.z, 1.0001);
  let refractedRayRed = refract(
    vec3f(0.0, 0.0, -1.0),
    surfaceNormal,
    1.0 / max(baseIor + dispersion, 1.0001),
  );
  let refractedRayGreen = refract(vec3f(0.0, 0.0, -1.0), surfaceNormal, 1.0 / baseIor);
  let refractedRayBlue = refract(
    vec3f(0.0, 0.0, -1.0),
    surfaceNormal,
    1.0 / max(baseIor - dispersion, 1.0001),
  );
  let displacementPxRed = select(
    refractedRayRed.xy / max(-refractedRayRed.z, 0.0001) * surfaceHeight * globals.glass.y,
    vec2f(0.0),
    fillMask <= 0.0,
  );
  let displacementPxGreen = select(
    refractedRayGreen.xy / max(-refractedRayGreen.z, 0.0001) * surfaceHeight * globals.glass.y,
    vec2f(0.0),
    fillMask <= 0.0,
  );
  let displacementPxBlue = select(
    refractedRayBlue.xy / max(-refractedRayBlue.z, 0.0001) * surfaceHeight * globals.glass.y,
    vec2f(0.0),
    fillMask <= 0.0,
  );
  if (globals.debug.x > 0.5) {
    // Signed pixel displacement is centered at 0.5 for display in the color target:
    // red/green hold x/y displacement, blue stays zero.
    let debugDisplacement = displacementPxGreen * DEBUG_DISPLACEMENT_ENCODE_SCALE + vec2f(0.5);
    let debugColor = mix(background, vec3f(debugDisplacement, 0.0), fillMask);
    return vec4f(mix(background, debugColor, containerOpacity), 1.0);
  }
  let contentBaseIor = max(globals.content.x, 1.0001);
  let contentRefractedRayRed = refract(
    vec3f(0.0, 0.0, -1.0),
    surfaceNormal,
    1.0 / max(contentBaseIor + dispersion, 1.0001),
  );
  let contentRefractedRayGreen = refract(vec3f(0.0, 0.0, -1.0), surfaceNormal, 1.0 / contentBaseIor);
  let contentRefractedRayBlue = refract(
    vec3f(0.0, 0.0, -1.0),
    surfaceNormal,
    1.0 / max(contentBaseIor - dispersion, 1.0001),
  );
  let contentDisplacementPxRed = select(
    contentRefractedRayRed.xy /
      max(-contentRefractedRayRed.z, 0.0001) *
      globals.content.y *
      globals.glass.y,
    vec2f(0.0),
    fillMask <= 0.0,
  );
  let contentDisplacementPxGreen = select(
    contentRefractedRayGreen.xy /
      max(-contentRefractedRayGreen.z, 0.0001) *
      globals.content.y *
      globals.glass.y,
    vec2f(0.0),
    fillMask <= 0.0,
  );
  let contentDisplacementPxBlue = select(
    contentRefractedRayBlue.xy /
      max(-contentRefractedRayBlue.z, 0.0001) *
      globals.content.y *
      globals.glass.y,
    vec2f(0.0),
    fillMask <= 0.0,
  );
  let refractedUvRed = in.uv + displacementPxRed / globals.canvas.xy;
  let refractedUvGreen = in.uv + displacementPxGreen / globals.canvas.xy;
  let refractedUvBlue = in.uv + displacementPxBlue / globals.canvas.xy;
  let refractedColor = vec3f(
    sampleBackgroundBlurred(refractedUvRed).r,
    sampleBackgroundBlurred(refractedUvGreen).g,
    sampleBackgroundBlurred(refractedUvBlue).b,
  );
  let reflectedUv = in.uv + rimNormal * globals.specularSecondary.z / globals.canvas.xy;
  let reflectedColor = sampleBackgroundBlurred(reflectedUv);
  let glass = mix(refractedColor, globals.tint.rgb, globals.tint.a);
  let refractedLuma = dot(refractedColor, vec3f(0.2126, 0.7152, 0.0722));
  let reflectedLuma = dot(reflectedColor, vec3f(0.2126, 0.7152, 0.0722));

  // Reflection only shows when the reflected sample is bright enough and the refracted sample
  // underneath is dark enough to accept it.
  let reflectionPresence = smoothstep(0.2, 0.85, reflectedLuma);
  let refractionAcceptance = 1.0 - smoothstep(0.35, 0.85, refractedLuma);
  let reflectionBlend = reflectionPresence * refractionAcceptance;
  let edgeSpecularColor = mix(refractedColor, reflectedColor, reflectionBlend);

  // Content rendered into per-glass canvas children is sampled from its own sharp atlas,
  // refracted with the same displacement field, and then layered over the tinted backdrop
  // before any specular contributions are applied.
  var glassInterior = glass;
  for (var i = 0u; i < shapeCount; i = i + 1u) {
    let shape = shapes[i];
    let contentStart = u32(shape.contentRange.x);
    let contentCount = u32(shape.contentRange.y);
    let shapeDistanceAtFrag = shapeDistance(shape, fragCoord);
    let contentBand = max(globals.shape.x, pixelWidth);
    let contentMask = 1.0 - smoothstep(contentBand, contentBand + pixelWidth, shapeDistanceAtFrag);
    let glassLocalRed = shapeLocalPos(shape, fragCoord + contentDisplacementPxRed);
    let glassLocalGreen = shapeLocalPos(shape, fragCoord + contentDisplacementPxGreen);
    let glassLocalBlue = shapeLocalPos(shape, fragCoord + contentDisplacementPxBlue);

    for (var contentOffset = 0u; contentOffset < contentCount; contentOffset = contentOffset + 1u) {
      let contentLayer = sampleGlassContentEntry(
        contentEntries[contentStart + contentOffset],
        glassLocalRed,
        glassLocalGreen,
        glassLocalBlue,
        contentMask,
      );
      glassInterior = mix(glassInterior, contentLayer.rgb, contentLayer.a);
    }
  }

  // White specular is a separate rim-only highlight driven by 2D normal/light alignment and
  // then masked back to the configured rim band. The mask uses derivative-scaled
  // screen-pixel distance so smooth SDF blends do not stretch hairline highlights.
  let primaryBandProgress = clamp(
    specularInwardDistancePx / max(rimWidthPx, SPECULAR_EDGE_FEATHER_PX),
    0.0,
    1.0,
  );
  let oppositeBandProgress = primaryBandProgress;
  let primaryStrength = globals.specular.x - globals.specularSecondary.y * primaryBandProgress * primaryBandProgress;
  let oppositeStrength =
    globals.specularSecondary.x - globals.specularSecondary.y * oppositeBandProgress * oppositeBandProgress;
  let oppositeRimBandMask = rimBandMask;
  let rimSpecular = pow(max(dot(rimNormal, lightDir), 0.0), globals.specular.z);
  let mirroredRimSpecular = pow(max(dot(rimNormal, mirroredLightDir), 0.0), globals.specular.z);
  let primarySpecularOpacity = clamp(rimSpecular * primaryStrength, 0.0, 1.0);
  let oppositeSpecularOpacity = clamp(mirroredRimSpecular * oppositeStrength, 0.0, 1.0);
  let combinedRimSpecularOpacity = clamp(
    primarySpecularOpacity * rimBandMask + oppositeSpecularOpacity * oppositeRimBandMask,
    0.0,
    1.0,
  );
  let whiteSpecularOpacity = combinedRimSpecularOpacity * globals.specular.w;
  let coloredEdgeOpacity = combinedRimSpecularOpacity;
  let whiteSpecular = vec3f(1.0) * whiteSpecularOpacity;

  var color = background;
  if (fillMask > 0.0) {
    color = mix(color, glassInterior, fillMask);
    color = mix(color, edgeSpecularColor, coloredEdgeOpacity);
    color = color + whiteSpecular;
  }

  return vec4f(mix(background, color, containerOpacity), 1.0);
}
`,
    je = `
${ue}

${at.wgsl("MetricsBounds")}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> shapes: array<ShapeData>;
@group(0) @binding(2) var metricsSampler: sampler;
@group(0) @binding(3) var blurredBackdrop: texture_2d<f32>;
@group(0) @binding(4) var<uniform> metricsBounds: MetricsBounds;

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let shapeCount = u32(globals.shape.z);
  let positionPx = mix(metricsBounds.bounds.xy, metricsBounds.bounds.zw, in.uv);
  let insideCanvas =
    all(positionPx >= vec2f(0.0)) &&
    all(positionPx <= globals.canvas.xy);
  let distance = sceneSdfSample(positionPx, shapeCount, globals.shape.x).distance;
  // This uses bezel width as the interior cutoff. For heavily fused shapes with
  // spacing wider than the bezel, the transition band can extend past this threshold,
  // but we accept that simplification for now because it does not occur in our target use cases.
  let isInterior = insideCanvas && distance <= -globals.shape.y;
  let color = textureSampleLevel(blurredBackdrop, metricsSampler, positionPx / globals.canvas.xy, 0.0).rgb;
  return vec4f(color, select(0.0, 1.0, isInterior));
}
`,
    Ze = `
${ot.wgsl("HtmlCompositeParams")}

@group(0) @binding(0) var compositeSampler: sampler;
@group(0) @binding(1) var sceneTexture: texture_2d<f32>;
@group(0) @binding(2) var htmlTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> params: HtmlCompositeParams;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(-1.0, 1.0),
    vec2f(3.0, 1.0),
  );

  let position = positions[vertexIndex];
  var output: VertexOutput;
  output.position = vec4f(position, 0.0, 1.0);
  output.uv = vec2f(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  return output;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let sceneColor = textureSampleLevel(sceneTexture, compositeSampler, in.uv, 0.0);
  let fragCoord = in.uv * params.canvas.xy;
  let localPos = vec2f(
    params.inverse0.x * fragCoord.x + params.inverse0.y * fragCoord.y + params.inverse0.z,
    params.inverse1.x * fragCoord.x + params.inverse1.y * fragCoord.y + params.inverse1.z,
  );
  let copiedSize = vec2f(params.inverse0.w, params.inverse1.w);

  if (
    any(params.canvas.zw <= vec2f(0.0)) ||
    any(copiedSize <= vec2f(0.0)) ||
    any(localPos < vec2f(0.0)) ||
    any(localPos > copiedSize)
  ) {
    return sceneColor;
  }

  let htmlColor = textureSampleLevel(htmlTexture, compositeSampler, localPos * params.canvas.zw, 0.0);
  let htmlAlpha = htmlColor.a * clamp(params.opacity.x, 0.0, 1.0);
  return vec4f(mix(sceneColor.rgb, htmlColor.rgb, htmlAlpha), 1.0);
}
`,
    E = { MAP_READ: 1, UNIFORM: 64, STORAGE: 128, COPY_DST: 8 },
    y = { COPY_SRC: 1, TEXTURE_BINDING: 4, COPY_DST: 2, RENDER_ATTACHMENT: 16 },
    lt = { r: 0, g: 0, b: 0, a: 1 };
  function D(e, t, n) {
    return e.createBindGroup({ layout: t.getBindGroupLayout(0), entries: n });
  }
  function Be(e, t, n = lt) {
    e.beginRenderPass({
      colorAttachments: [
        { clearValue: n, loadOp: "clear", storeOp: "store", view: t.createView() },
      ],
    }).end();
  }
  function M(e, { pipeline: t, bindGroup: n, target: r, clearValue: i = lt }) {
    let s = e.beginRenderPass({
      colorAttachments: [
        { clearValue: i, loadOp: "clear", storeOp: "store", view: r.createView() },
      ],
    });
    (s.setPipeline(t), s.setBindGroup(0, n), s.draw(3), s.end());
  }
  var _t = class {
      constructor(e, t) {
        ((this.device = e),
          (this.encoder = e.createCommandEncoder()),
          (this.currentTexture = t.sceneA),
          (this.nextTexture = t.sceneB),
          Be(this.encoder, this.currentTexture));
      }
      device;
      encoder;
      currentTexture;
      nextTexture;
      get current() {
        return this.currentTexture;
      }
      get next() {
        return this.nextTexture;
      }
      submitAndSwap() {
        (this.device.queue.submit([this.encoder.finish()]),
          (this.encoder = this.device.createCommandEncoder()));
        let e = this.currentTexture;
        ((this.currentTexture = this.nextTexture), (this.nextTexture = e));
      }
      submit() {
        this.device.queue.submit([this.encoder.finish()]);
      }
    },
    At = 6,
    ae = { r: 0, g: 0, b: 0, a: 0 };
  function Ht(e, t) {
    let n = Number.isFinite(t) ? Math.max(0, Math.floor(t)) : 0,
      r = Number.isFinite(e) ? Math.max(e, 0) : 0;
    if (r <= 0) return { skip: !0, level: 0, scale: 1, effectiveRadius: 0 };
    let i = Math.ceil(Math.log2(r / At)),
      s = Math.min(Math.max(i, 0), n),
      a = 2 ** s;
    return { skip: !1, level: s, scale: a, effectiveRadius: r / a };
  }
  function le(e, t) {
    let n = e.createShaderModule({ code: Dt }),
      r = e.createShaderModule({ code: Bt }),
      i = e.createShaderModule({ code: Mt }),
      s = E.UNIFORM | E.COPY_DST;
    return {
      pipelines: { downsample: Se(e, t, n), blur: Se(e, t, r), upsample: Se(e, t, i) },
      horizontalBuffer: new j(e, Me, s),
      verticalBuffer: new j(e, Me, s),
    };
  }
  function Z(e) {
    (e?.horizontalBuffer.destroy(), e?.verticalBuffer.destroy());
  }
  function J({
    device: e,
    sampler: t,
    encoder: n,
    source: r,
    radiusPx: i,
    chain: s,
    resources: a,
  }) {
    if (s.levels.length === 0) return r;
    let o = Ht(i, s.levels.length - 1);
    if (o.skip) return r;
    let l = r;
    for (let u = 1; u <= o.level; u += 1) {
      let p = s.levels[u],
        v = D(e, a.pipelines.downsample, [
          { binding: 0, resource: t },
          { binding: 1, resource: l.createView() },
        ]);
      (M(n, { pipeline: a.pipelines.downsample, bindGroup: v, target: p.ping, clearValue: ae }),
        (l = p.ping));
    }
    let d = s.levels[o.level];
    It(o.effectiveRadius, a.horizontalBuffer, a.verticalBuffer);
    let c = D(e, a.pipelines.blur, [
      { binding: 0, resource: t },
      { binding: 1, resource: l.createView() },
      { binding: 2, resource: a.horizontalBuffer.bindingResource },
    ]);
    M(n, { pipeline: a.pipelines.blur, bindGroup: c, target: d.pong, clearValue: ae });
    let f = D(e, a.pipelines.blur, [
      { binding: 0, resource: t },
      { binding: 1, resource: d.pong.createView() },
      { binding: 2, resource: a.verticalBuffer.bindingResource },
    ]);
    (M(n, { pipeline: a.pipelines.blur, bindGroup: f, target: d.ping, clearValue: ae }),
      (l = d.ping));
    for (let u = o.level - 1; u >= 0; u -= 1) {
      let p = s.levels[u],
        v = D(e, a.pipelines.upsample, [
          { binding: 0, resource: t },
          { binding: 1, resource: l.createView() },
        ]);
      (M(n, { pipeline: a.pipelines.upsample, bindGroup: v, target: p.pong, clearValue: ae }),
        (l = p.pong));
    }
    return l;
  }
  function Se(e, t, n) {
    return e.createRenderPipeline({
      layout: "auto",
      vertex: { module: n, entryPoint: "vertexMain" },
      fragment: { module: n, entryPoint: "fragmentMain", targets: [{ format: t }] },
      primitive: { topology: "triangle-list" },
    });
  }
  function It(e, t, n) {
    let r = Math.max(e, 0);
    (t.write({ params: { directionX: 1, directionY: 0, radius: r } }),
      n.write({ params: { directionX: 0, directionY: 1, radius: r } }));
  }
  function X(e, t, n, r) {
    return e.createTexture({
      size: { width: n, height: r, depthOrArrayLayers: 1 },
      format: t,
      usage: y.COPY_SRC | y.TEXTURE_BINDING | y.RENDER_ATTACHMENT | y.COPY_DST,
    });
  }
  function ee(e, t, n, r) {
    let i = [],
      s = Math.max(Math.floor(n), 1),
      a = Math.max(Math.floor(r), 1);
    for (
      ;
      i.push({ ping: X(e, t, s, a), pong: X(e, t, s, a), width: s, height: a }),
        !(s === 1 && a === 1);
    )
      ((s = Math.max(Math.ceil(s / 2), 1)), (a = Math.max(Math.ceil(a / 2), 1)));
    return { format: t, levels: i };
  }
  function R(e) {
    if (e) for (let t of e.levels) (t.ping.destroy(), t.pong.destroy());
  }
  function Je(e) {
    e &&
      (R(e.backdropBlur),
      R(e.displacementBlur),
      R(e.shadowBlur),
      e.sceneA.destroy(),
      e.sceneB.destroy());
  }
  function Y(e, t, n, r) {
    let i = Math.floor(r.width),
      s = Math.floor(r.height);
    return i <= 0 || s <= 0
      ? !1
      : (e.copyTextureToTexture(
          { texture: t, origin: { x: Math.floor(r.sourceX), y: Math.floor(r.sourceY), z: 0 } },
          {
            texture: n,
            origin: { x: Math.floor(r.destinationX), y: Math.floor(r.destinationY), z: 0 },
          },
          { width: i, height: s, depthOrArrayLayers: 1 },
        ),
        !0);
  }
  var et = 1e-4;
  function Ot(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  function Gt(e, t, n) {
    return (Math.abs(e) ** n + Math.abs(t) ** n) ** (1 / n);
  }
  function Lt(e, t, n, r, i, s) {
    let a = Math.min(n, r),
      o = Math.min(Math.max(i, 0), a),
      l = Math.abs(e) - n + o,
      d = Math.abs(t) - r + o,
      c = i > et ? Math.max(a / Math.max(i, et) - 1, 0) : 0,
      f = Math.min(Ot(s, 0, 1), c),
      u = Ne(f);
    return Gt(Math.max(l, 0), Math.max(d, 0), u) + Math.min(Math.max(l, d), 0) - o;
  }
  function tt(e) {
    return `matrix(${e.a}, ${e.b}, ${e.c}, ${e.d}, ${e.e}, ${e.f})`;
  }
  function kt(e) {
    let t = new Map(),
      n = [];
    for (let r = 0; r < e.length; r += 1) {
      let i = e[r];
      for (let s of ye(i.container)) {
        let a = s.glass;
        if (!a.pointerEvents || a.width <= 0 || a.height <= 0) continue;
        let o = F(i.transform, s.transform),
          l = $(o);
        if (!l) continue;
        let d = {
          glass: a,
          container: i.container,
          containerOrder: r,
          glassOrder: s.traversalIndex,
          transform: o,
          inverseTransform: l,
          halfWidth: a.width * 0.5,
          halfHeight: a.height * 0.5,
          cornerRadius: a.cornerRadius,
          cornerSmoothing: a.cornerSmoothing,
        };
        (t.set(a, d), n.push(d));
      }
    }
    return (
      n.sort((r, i) => r.containerOrder - i.containerOrder || r.glassOrder - i.glassOrder),
      { entriesByGlass: t, orderedEntries: n }
    );
  }
  function _e(e, t, n) {
    let r = W(e.inverseTransform, t, n),
      i = r.x - e.halfWidth,
      s = r.y - e.halfHeight;
    return {
      localX: r.x,
      localY: r.y,
      inside: Lt(i, s, e.halfWidth, e.halfHeight, e.cornerRadius, e.cornerSmoothing) <= 0,
    };
  }
  function Ce(e, t, n) {
    for (let r = e.length - 1; r >= 0; r -= 1) {
      let i = e[r];
      if (_e(i, t, n).inside) return i;
    }
    return null;
  }
  function Ae(e) {
    return Xe(e);
  }
  function Oe(e) {
    return ye(e);
  }
  function ct(e) {
    return Ue(e);
  }
  function zt(e) {
    return e
      .filter((t) => t.child instanceof L)
      .map((t) => ({ container: t.child, transform: t.transform }));
  }
  function Nt(e) {
    let t = new Map(),
      n = 1;
    for (let r of e) {
      if (r.child instanceof B) {
        r.child.width > 0 && r.child.height > 0 && (t.set(r.child, n), (n += 1));
        continue;
      }
      for (let i of Oe(r.child))
        for (let s of ct(i.glass)) {
          let a = s.html;
          a.width > 0 && a.height > 0 && (t.set(a, n), (n += 1));
        }
    }
    return t;
  }
  function nt(e, t) {
    for (let n of e) for (let r of t) if (n === r || r.contains(n)) return !0;
    return !1;
  }
  function rt(e, t, n, r) {
    (e.parentElement !== t && t.append(e),
      e.style.transform !== n && (e.style.transform = n),
      e.style.zIndex !== r && (e.style.zIndex = r));
  }
  function Ft(e, t) {
    let n = [...t.entries()]
        .sort((s, a) => s[1] - a[1])
        .map(([s]) => s.host)
        .filter((s) => s.parentElement === e),
      r = new Set(n),
      i = Array.from(e.children).filter((s) => r.has(s));
    if (!(i.length === n.length && i.every((s, a) => s === n[a]))) for (let s of n) e.append(s);
  }
  function ce(e, t, n) {
    return e <= 0 || t <= 0 || n <= 0 ? 0 : (e / t) * n;
  }
  function he(e, t, n) {
    return e <= 0 || t <= 0 || n <= 0 ? 0 : e / t / n;
  }
  var Wt = class {
    constructor(e) {
      this.options = e;
    }
    options;
    sceneHtmlHosts = new Set();
    glassContentHosts = new Set();
    device = null;
    presentationFormat = null;
    sceneHtmlEntries = new Map();
    glassContentEntries = new Map();
    glassContentRanges = new Map();
    glassContentOrder = [];
    needsSceneHtmlCopy = !1;
    needsSceneHtmlFilter = !1;
    needsContentCopy = !1;
    needsContentFilter = !1;
    contentEntriesBuffer = null;
    glassContentAtlas = null;
    glassContentAtlasWidth = 0;
    glassContentAtlasHeight = 0;
    sampler = null;
    htmlBlurResources = null;
    get atlasTexture() {
      return this.glassContentAtlas;
    }
    get contentEntriesBindingResource() {
      return this.contentEntriesBuffer?.buffer ? this.contentEntriesBuffer.bindingResource : null;
    }
    setDevice(e, t) {
      ((this.device = e),
        (this.presentationFormat = t),
        (this.sampler = e.createSampler({
          magFilter: "linear",
          minFilter: "linear",
          addressModeU: "clamp-to-edge",
          addressModeV: "clamp-to-edge",
        })),
        Z(this.htmlBlurResources),
        (this.htmlBlurResources = le(e, t)),
        this.contentEntriesBuffer?.destroy(),
        (this.contentEntriesBuffer = new De(e, Ie, E.STORAGE | E.COPY_DST)),
        this.contentEntriesBuffer.ensureCapacity(0));
    }
    destroy() {
      for (let e of this.sceneHtmlEntries.values())
        (e.texture?.destroy(), R(e.blurTargetChain), e.html.host.remove());
      (this.sceneHtmlEntries.clear(), this.sceneHtmlHosts.clear());
      for (let e of this.glassContentEntries.values())
        (e.sourceTexture?.destroy(), R(e.blurTargetChain), e.html.host.remove());
      (this.glassContentEntries.clear(),
        this.glassContentRanges.clear(),
        (this.glassContentOrder = []),
        this.glassContentHosts.clear(),
        this.glassContentAtlas?.destroy(),
        (this.glassContentAtlas = null),
        (this.glassContentAtlasWidth = 0),
        (this.glassContentAtlasHeight = 0),
        this.contentEntriesBuffer?.destroy(),
        (this.contentEntriesBuffer = null),
        Z(this.htmlBlurResources),
        (this.htmlBlurResources = null),
        (this.sampler = null));
    }
    handlePaintEvent(e) {
      if (!this.device) return;
      let t = e.changedElements,
        n = Array.isArray(t),
        r = this.needsSceneHtmlCopy || !n || nt(t, this.sceneHtmlHosts),
        i = this.needsContentCopy || !n || nt(t, this.glassContentHosts);
      (r && this.copySceneHtmlTextures(),
        this.needsSceneHtmlFilter && this.filterSceneHtmlTextures(),
        i && this.copyGlassContentAtlas(),
        this.needsContentFilter && this.filterGlassContentAtlas());
    }
    copyPending() {
      (this.needsSceneHtmlCopy && this.copySceneHtmlTextures(),
        this.needsSceneHtmlFilter && this.filterSceneHtmlTextures(),
        this.needsContentCopy && this.copyGlassContentAtlas(),
        this.needsContentFilter && this.filterGlassContentAtlas());
    }
    sync(e, t, n) {
      (this.syncSceneHtml(e, n), this.syncGlassContent(t, n), Ft(this.options.targetCanvas, n));
    }
    getSceneHtmlEntry(e) {
      return this.sceneHtmlEntries.get(e) ?? null;
    }
    getGlassContentRange(e) {
      return this.glassContentRanges.get(e) ?? null;
    }
    removeSceneHtmlEntry(e, t) {
      let n = this.sceneHtmlEntries.get(e);
      n &&
        (n.texture?.destroy(),
        R(n.blurTargetChain),
        this.sceneHtmlHosts.delete(e.host),
        this.sceneHtmlEntries.delete(e),
        t || e.host.remove());
    }
    removeGlassContentEntry(e, t) {
      let n = this.glassContentEntries.get(e);
      n &&
        (n.sourceTexture?.destroy(),
        R(n.blurTargetChain),
        this.glassContentHosts.delete(e.host),
        this.glassContentEntries.delete(e),
        t || e.host.remove());
    }
    syncSceneHtml(e, t) {
      let n = new Set(),
        r = !1,
        i = !1,
        s = this.options.getCurrentDpr();
      for (let a of e) {
        if (!(a.child instanceof B) || a.child.width <= 0 || a.child.height <= 0) continue;
        let o = a.child;
        n.add(o);
        let l = this.sceneHtmlEntries.get(o);
        (l ||
          ((l = {
            html: o,
            texture: null,
            filteredTexture: null,
            elementVersion: -1,
            blur: -1,
            width: -1,
            height: -1,
            deviceWidth: 0,
            deviceHeight: 0,
            copiedDeviceWidth: 0,
            copiedDeviceHeight: 0,
            textureWidth: 0,
            textureHeight: 0,
            blurTargetChain: null,
            transform: a.transform,
            inverseTransform: null,
          }),
          this.sceneHtmlEntries.set(o, l),
          (r = !0),
          (i = !0)),
          (l.transform = a.transform),
          (l.inverseTransform = $(be(a.transform, s))),
          l.elementVersion !== o._elementVersion &&
            ((l.elementVersion = o._elementVersion), (i = !0)),
          l.blur !== o.blur && ((l.blur = o.blur), (this.needsSceneHtmlFilter = !0)));
        let d = l.deviceWidth,
          c = l.deviceHeight,
          f = Math.max(1, Math.round(o.width * s)),
          u = Math.max(1, Math.round(o.height * s)),
          p = l.textureWidth,
          v = l.textureHeight,
          w = !1;
        this.device &&
          ((p = z(f, this.device.limits.maxTextureDimension2D)),
          (v = z(u, this.device.limits.maxTextureDimension2D)),
          (w = l.textureWidth !== p || l.textureHeight !== v));
        let x = l.deviceWidth !== f || l.deviceHeight !== u;
        if (
          ((l.width !== o.width || l.height !== o.height || x) &&
            ((l.width = o.width),
            (l.height = o.height),
            (l.deviceWidth = f),
            (l.deviceHeight = u),
            (r = !0),
            (i = !0)),
          this.device && this.presentationFormat && (!l.texture || w))
        ) {
          let g = l.texture,
            C = this.device.createTexture({
              size: { width: p, height: v, depthOrArrayLayers: 1 },
              format: this.presentationFormat,
              usage: y.COPY_SRC | y.TEXTURE_BINDING | y.COPY_DST | y.RENDER_ATTACHMENT,
            });
          if (g) {
            let h = this.device.createCommandEncoder(),
              _ = Math.min(l.copiedDeviceWidth, d, p),
              A = Math.min(l.copiedDeviceHeight, c, v);
            (Y(h, g, C, {
              sourceX: 0,
              sourceY: 0,
              destinationX: 0,
              destinationY: 0,
              width: _,
              height: A,
            }) && this.device.queue.submit([h.finish()]),
              (l.copiedDeviceWidth = _),
              (l.copiedDeviceHeight = A));
          } else ((l.copiedDeviceWidth = 0), (l.copiedDeviceHeight = 0));
          (g?.destroy(),
            R(l.blurTargetChain),
            (l.texture = C),
            (l.filteredTexture = null),
            (l.blurTargetChain = null),
            (l.textureWidth = p),
            (l.textureHeight = v),
            (r = !0),
            (i = !0));
        }
        l.texture &&
          (this.sceneHtmlHosts.add(o.host),
          rt(o.host, this.options.targetCanvas, tt(a.transform), String(t.get(o) ?? 0)));
      }
      for (let a of [...this.sceneHtmlEntries.keys()])
        n.has(a) || (this.removeSceneHtmlEntry(a, t.has(a)), (r = !0), (i = !0));
      if (n.size === 0) {
        ((this.needsSceneHtmlCopy = !1), (this.needsSceneHtmlFilter = !1));
        return;
      }
      (r || i) && (this.needsSceneHtmlCopy = !0);
    }
    syncGlassContent(e, t) {
      let n = new Set(),
        r = [],
        i = new Map(),
        s = this.glassContentAtlas,
        a = new Map(),
        o = this.options.getCurrentDpr(),
        l = !1,
        d = !1;
      if (s)
        for (let c of this.glassContentEntries.values())
          a.set(c.html, {
            copiedDeviceWidth: c.copiedDeviceWidth,
            copiedDeviceHeight: c.copiedDeviceHeight,
            atlasX: c.atlasX,
            atlasY: c.atlasY,
          });
      for (let c of e) {
        let f = c.transform;
        for (let u of Oe(c.container)) {
          let p = u.glass;
          if (p.width <= 0 || p.height <= 0) continue;
          let v = F(f, u.transform),
            w = r.length;
          for (let b of ct(p)) {
            let g = b.html;
            if (g.width <= 0 || g.height <= 0) continue;
            let C = $(b.transform);
            if (
              (this.glassContentHosts.add(g.host),
              rt(g.host, this.options.targetCanvas, tt(F(v, b.transform)), String(t.get(g) ?? 0)),
              !C)
            )
              continue;
            n.add(g);
            let h = this.glassContentEntries.get(g);
            (h ||
              ((h = {
                html: g,
                glass: p,
                elementVersion: -1,
                blur: -1,
                width: -1,
                height: -1,
                deviceWidth: 0,
                deviceHeight: 0,
                copiedDeviceWidth: 0,
                copiedDeviceHeight: 0,
                sourceTexture: null,
                sourceTextureWidth: 0,
                sourceTextureHeight: 0,
                filteredTexture: null,
                blurTargetChain: null,
                atlasX: 0,
                atlasY: 0,
                inverseTransform: C,
              }),
              this.glassContentEntries.set(g, h),
              (l = !0),
              (d = !0)),
              h.glass !== p && ((h.glass = p), (l = !0)),
              (h.inverseTransform = C),
              h.elementVersion !== g._elementVersion &&
                ((h.elementVersion = g._elementVersion), (d = !0)));
            let _ = Math.max(1, Math.round(g.width * o)),
              A = Math.max(1, Math.round(g.height * o)),
              H = h.sourceTextureWidth,
              G = h.sourceTextureHeight,
              V = !1;
            (this.device &&
              ((H = z(_, this.device.limits.maxTextureDimension2D)),
              (G = z(A, this.device.limits.maxTextureDimension2D)),
              (V = h.sourceTextureWidth !== H || h.sourceTextureHeight !== G)),
              (h.width !== g.width ||
                h.height !== g.height ||
                h.deviceWidth !== _ ||
                h.deviceHeight !== A) &&
                ((h.width = g.width),
                (h.height = g.height),
                (h.deviceWidth = _),
                (h.deviceHeight = A),
                (l = !0),
                (d = !0)),
              h.blur !== g.blur && ((h.blur = g.blur), (this.needsContentFilter = !0)),
              this.device &&
                this.presentationFormat &&
                (!h.sourceTexture || V) &&
                (h.sourceTexture?.destroy(),
                R(h.blurTargetChain),
                (h.sourceTexture = X(this.device, this.presentationFormat, H, G)),
                (h.sourceTextureWidth = H),
                (h.sourceTextureHeight = G),
                (h.filteredTexture = null),
                (h.blurTargetChain = null),
                (h.copiedDeviceWidth = 0),
                (h.copiedDeviceHeight = 0),
                (d = !0)),
              r.push(h));
          }
          let x = r.length - w;
          x > 0 && i.set(p, { start: w, count: x });
        }
      }
      for (let c of [...this.glassContentEntries.keys()])
        n.has(c) || (this.removeGlassContentEntry(c, t.has(c)), (l = !0), (d = !0));
      ((this.glassContentOrder = r), this.glassContentRanges.clear());
      for (let [c, f] of i) this.glassContentRanges.set(c, f);
      if (!this.device) {
        this.needsContentCopy = !1;
        return;
      }
      if (r.length === 0) {
        (this.glassContentAtlas?.destroy(),
          (this.glassContentAtlas = null),
          (this.glassContentAtlasWidth = 0),
          (this.glassContentAtlasHeight = 0),
          (this.needsContentCopy = !1),
          (this.needsContentFilter = !1));
        return;
      }
      if (l || !this.glassContentAtlas) {
        let c = Tt(r, this.device.limits.maxTextureDimension2D),
          f = c.width,
          u = c.height,
          p = this.glassContentAtlasWidth,
          v = this.glassContentAtlasHeight;
        if (
          !this.glassContentAtlas ||
          f !== this.glassContentAtlasWidth ||
          u !== this.glassContentAtlasHeight ||
          r.some((x) => {
            let b = c.rects.get(x.html);
            return x.atlasX !== b.x || x.atlasY !== b.y;
          })
        ) {
          let x = this.device.createTexture({
            size: { width: f, height: u, depthOrArrayLayers: 1 },
            format: this.presentationFormat ?? "bgra8unorm",
            usage: y.COPY_SRC | y.TEXTURE_BINDING | y.COPY_DST | y.RENDER_ATTACHMENT,
          });
          if (s) {
            let b = this.device.createCommandEncoder(),
              g = !1;
            for (let C of r) {
              let h = a.get(C.html),
                _ = c.rects.get(C.html);
              if (!h) {
                ((C.copiedDeviceWidth = 0), (C.copiedDeviceHeight = 0));
                continue;
              }
              let A = h.atlasX + T,
                H = h.atlasY + T,
                G = _.x + T,
                V = _.y + T,
                de = Math.min(h.copiedDeviceWidth, p - A, f - G),
                Le = Math.min(h.copiedDeviceHeight, v - H, u - V);
              ((g =
                Y(b, s, x, {
                  sourceX: A,
                  sourceY: H,
                  destinationX: G,
                  destinationY: V,
                  width: de,
                  height: Le,
                }) || g),
                (C.copiedDeviceWidth = Math.max(0, de)),
                (C.copiedDeviceHeight = Math.max(0, Le)));
            }
            g && this.device.queue.submit([b.finish()]);
          } else for (let b of r) ((b.copiedDeviceWidth = 0), (b.copiedDeviceHeight = 0));
          (s?.destroy(),
            (this.glassContentAtlas = x),
            (this.glassContentAtlasWidth = f),
            (this.glassContentAtlasHeight = u));
        }
        for (let x of r) {
          let b = c.rects.get(x.html);
          ((x.atlasX = b.x), (x.atlasY = b.y));
        }
        ((this.needsContentCopy = !0), (this.needsContentFilter = !0));
      } else d && (this.needsContentCopy = !0);
      this.writeContentEntries(r);
    }
    writeContentEntries(e) {
      if (this.contentEntriesBuffer) {
        this.contentEntriesBuffer.ensureCapacity(e.length);
        for (let t = 0; t < e.length; t += 1) {
          let n = e[t],
            r = n.inverseTransform;
          this.contentEntriesBuffer.writeAt(t, {
            inverse0: {
              a: r.a,
              c: r.c,
              e: r.e,
              copiedWidth: ce(n.copiedDeviceWidth, n.deviceWidth, n.width),
            },
            inverse1: {
              b: r.b,
              d: r.d,
              f: r.f,
              copiedHeight: ce(n.copiedDeviceHeight, n.deviceHeight, n.height),
            },
            atlasRect: {
              u: (n.atlasX + T) / this.glassContentAtlasWidth,
              v: (n.atlasY + T) / this.glassContentAtlasHeight,
              uScale: he(n.deviceWidth, n.width, this.glassContentAtlasWidth),
              vScale: he(n.deviceHeight, n.height, this.glassContentAtlasHeight),
            },
            opacity: { value: n.html.opacity },
          });
        }
        this.contentEntriesBuffer.upload(e.length);
      }
    }
    copySceneHtmlTextures() {
      if (!this.device || this.sceneHtmlEntries.size === 0)
        return ((this.needsSceneHtmlCopy = !1), !0);
      let e = !0,
        t = !1;
      for (let n of this.sceneHtmlEntries.values()) {
        if (!n.texture) {
          e = !1;
          continue;
        }
        try {
          (this.device.queue.copyElementImageToTexture(n.html.host, n.deviceWidth, n.deviceHeight, {
            texture: n.texture,
          }),
            (n.copiedDeviceWidth = n.deviceWidth),
            (n.copiedDeviceHeight = n.deviceHeight),
            (t = !0));
        } catch (r) {
          ((e = !1),
            (r instanceof DOMException && r.name === "InvalidStateError") || console.error(r));
        }
      }
      return (t && (this.needsSceneHtmlFilter = !0), (this.needsSceneHtmlCopy = !e), e);
    }
    filterSceneHtmlTextures() {
      if (!this.device || !this.sampler || !this.htmlBlurResources)
        return ((this.needsSceneHtmlFilter = !1), !0);
      let e = this.device.createCommandEncoder(),
        t = !1;
      for (let n of this.sceneHtmlEntries.values()) {
        if (
          ((n.filteredTexture = null),
          !n.texture || n.copiedDeviceWidth <= 0 || n.copiedDeviceHeight <= 0)
        )
          continue;
        let r = n.html.blur * this.options.getCurrentDpr();
        r <= 0 ||
          ((!n.blurTargetChain ||
            n.blurTargetChain.levels[0]?.width !== n.textureWidth ||
            n.blurTargetChain.levels[0]?.height !== n.textureHeight) &&
            (R(n.blurTargetChain),
            (n.blurTargetChain = ee(
              this.device,
              this.presentationFormat ?? "bgra8unorm",
              n.textureWidth,
              n.textureHeight,
            ))),
          (n.filteredTexture = J({
            device: this.device,
            sampler: this.sampler,
            encoder: e,
            source: n.texture,
            radiusPx: r,
            chain: n.blurTargetChain,
            resources: this.htmlBlurResources,
          })),
          (t = !0));
      }
      return (t && this.device.queue.submit([e.finish()]), (this.needsSceneHtmlFilter = !1), !0);
    }
    copyGlassContentAtlas() {
      if (!this.device || this.glassContentOrder.length === 0)
        return ((this.needsContentCopy = !1), !0);
      let e = !0,
        t = !1;
      for (let n of this.glassContentOrder) {
        if (!n.sourceTexture) {
          e = !1;
          continue;
        }
        try {
          (this.device.queue.copyElementImageToTexture(n.html.host, n.deviceWidth, n.deviceHeight, {
            texture: n.sourceTexture,
          }),
            (n.copiedDeviceWidth = n.deviceWidth),
            (n.copiedDeviceHeight = n.deviceHeight),
            (t = !0));
        } catch (r) {
          ((e = !1),
            (r instanceof DOMException && r.name === "InvalidStateError") || console.error(r));
        }
      }
      return (t && (this.needsContentFilter = !0), (this.needsContentCopy = !e), e);
    }
    filterGlassContentAtlas() {
      if (
        !this.device ||
        !this.sampler ||
        !this.htmlBlurResources ||
        !this.glassContentAtlas ||
        this.glassContentOrder.length === 0
      )
        return ((this.needsContentFilter = !1), !0);
      let e = this.device.createCommandEncoder(),
        t = !1;
      for (let n of this.glassContentOrder) {
        if (!n.sourceTexture || n.copiedDeviceWidth <= 0 || n.copiedDeviceHeight <= 0) continue;
        let r = n.sourceTexture,
          i = n.html.blur * this.options.getCurrentDpr();
        ((n.filteredTexture = null),
          i > 0 &&
            ((!n.blurTargetChain ||
              n.blurTargetChain.levels[0]?.width !== n.sourceTextureWidth ||
              n.blurTargetChain.levels[0]?.height !== n.sourceTextureHeight) &&
              (R(n.blurTargetChain),
              (n.blurTargetChain = ee(
                this.device,
                this.presentationFormat ?? "bgra8unorm",
                n.sourceTextureWidth,
                n.sourceTextureHeight,
              ))),
            (n.filteredTexture = J({
              device: this.device,
              sampler: this.sampler,
              encoder: e,
              source: n.sourceTexture,
              radiusPx: i,
              chain: n.blurTargetChain,
              resources: this.htmlBlurResources,
            })),
            (r = n.filteredTexture)),
          (t =
            Y(e, r, this.glassContentAtlas, {
              sourceX: 0,
              sourceY: 0,
              destinationX: n.atlasX + T,
              destinationY: n.atlasY + T,
              width: n.copiedDeviceWidth,
              height: n.copiedDeviceHeight,
            }) || t));
      }
      return (
        t &&
          (this.writeContentEntries(this.glassContentOrder),
          this.device.queue.submit([e.finish()])),
        (this.needsContentFilter = !1),
        !0
      );
    }
  };
  function st(e, t) {
    let n = e.composedPath();
    for (let r of t) if (n.includes(r)) return !0;
    return !1;
  }
  var Yt = class {
      constructor(e) {
        this.options = e;
      }
      options;
      glassInteractionEntries = new Map();
      glassInteractionOrder = [];
      pointerStates = new Map();
      handlePointerMove = (e) => {
        this.handleNativePointerEvent("pointermove", e);
      };
      handlePointerDown = (e) => {
        this.handleNativePointerEvent("pointerdown", e);
      };
      handlePointerUp = (e) => {
        this.handleNativePointerEvent("pointerup", e);
      };
      handlePointerCancel = (e) => {
        this.handleNativePointerEvent("pointercancel", e);
      };
      handlePointerLeave = (e) => {
        this.isTargetCanvasLeave(e) && this.handleNativePointerEvent("pointerleave", e);
      };
      syncInteractions(e) {
        let t = this.glassInteractionEntries,
          { entriesByGlass: n, orderedEntries: r } = kt(e);
        ((this.glassInteractionEntries = n),
          (this.glassInteractionOrder = r),
          this.handleRemovedInteractionTargets(t));
      }
      clear() {
        (this.glassInteractionEntries.clear(),
          (this.glassInteractionOrder = []),
          this.pointerStates.clear());
      }
      getPointerState(e) {
        let t = this.pointerStates.get(e);
        return (
          t ||
          ((t = {
            hoveredGlass: null,
            capturedGlass: null,
            capturedWithNativePointerCapture: !1,
            pressedGlass: null,
            lastSnapshot: null,
          }),
          this.pointerStates.set(e, t),
          t)
        );
      }
      createPointerSnapshot(e) {
        let t = this.options.targetCanvas.getBoundingClientRect();
        return { nativeEvent: e, canvasX: e.clientX - t.left, canvasY: e.clientY - t.top };
      }
      isTargetCanvasLeave(e) {
        if (e.target !== this.options.targetCanvas) return !1;
        let t = e.relatedTarget;
        return !(t instanceof Node && this.options.targetCanvas.contains(t));
      }
      dispatchGlassPointerEvent(e, t, n, r, i) {
        let s = n ? _e(n, r.canvasX, r.canvasY) : { localX: 0, localY: 0 },
          a = new wt(e, {
            glass: t,
            renderer: this.options.renderer,
            nativeEvent: r.nativeEvent,
            canvasX: r.canvasX,
            canvasY: r.canvasY,
            localX: s.localX,
            localY: s.localY,
            inside: i,
          });
        (t.dispatchEvent(a), a.defaultPrevented && r.nativeEvent.preventDefault());
      }
      updateHoveredGlass(e, t, n) {
        let r = e.hoveredGlass,
          i = t?.glass ?? null;
        if (r !== i) {
          if (r) {
            let s = this.glassInteractionEntries.get(r) ?? null;
            this.dispatchGlassPointerEvent("pointerleave", r, s, n, !1);
          }
          ((e.hoveredGlass = i),
            t && this.dispatchGlassPointerEvent("pointerenter", t.glass, t, n, !0));
        }
      }
      releaseNativePointerCapture(e) {
        if (this.options.targetCanvas.hasPointerCapture(e))
          try {
            this.options.targetCanvas.releasePointerCapture(e);
          } catch {}
      }
      cleanupPointerState(e, t) {
        t.hoveredGlass || t.capturedGlass || t.pressedGlass || this.pointerStates.delete(e);
      }
      finishPointerEvent(e, t) {
        (this.options.flushSceneContentSync(), this.cleanupPointerState(e, t));
      }
      handleRemovedInteractionTargets(e) {
        for (let [t, n] of this.pointerStates) {
          let r = n.lastSnapshot,
            i = n.capturedGlass;
          if (i && !this.glassInteractionEntries.has(i)) {
            let a = e.get(i) ?? null;
            (r && this.dispatchGlassPointerEvent("pointercancel", i, a, r, !1),
              (n.capturedGlass = null),
              (n.capturedWithNativePointerCapture = !1),
              (n.pressedGlass = null),
              this.releaseNativePointerCapture(t));
          }
          let s = n.hoveredGlass;
          if (s && !this.glassInteractionEntries.has(s)) {
            let a = e.get(s) ?? null;
            (r && this.dispatchGlassPointerEvent("pointerleave", s, a, r, !1),
              (n.hoveredGlass = null));
          }
          (!n.capturedGlass &&
            r &&
            this.updateHoveredGlass(n, Ce(this.glassInteractionOrder, r.canvasX, r.canvasY), r),
            this.cleanupPointerState(t, n));
        }
      }
      handleNativePointerEvent(e, t) {
        if (this.options.isDestroyed()) return;
        this.options.flushSceneContentSync();
        let n = this.getPointerState(t.pointerId),
          r = this.createPointerSnapshot(t);
        n.lastSnapshot = r;
        let i = n.capturedGlass
          ? (this.glassInteractionEntries.get(n.capturedGlass) ?? null)
          : null;
        if (i) {
          if (e === "pointerleave") {
            n.capturedWithNativePointerCapture ||
              (this.dispatchGlassPointerEvent("pointercancel", i.glass, i, r, !1),
              (n.capturedGlass = null),
              (n.capturedWithNativePointerCapture = !1),
              (n.pressedGlass = null),
              this.updateHoveredGlass(n, null, r),
              this.cleanupPointerState(t.pointerId, n));
            return;
          }
          let a = _e(i, r.canvasX, r.canvasY);
          (this.dispatchGlassPointerEvent(e, i.glass, i, r, a.inside),
            (e === "pointerup" || e === "pointercancel") &&
              (e === "pointerup" &&
                t.button === 0 &&
                n.pressedGlass === i.glass &&
                a.inside &&
                this.dispatchGlassPointerEvent("click", i.glass, i, r, !0),
              (n.capturedGlass = null),
              (n.capturedWithNativePointerCapture = !1),
              (n.pressedGlass = null),
              this.releaseNativePointerCapture(t.pointerId),
              this.updateHoveredGlass(n, Ce(this.glassInteractionOrder, r.canvasX, r.canvasY), r)),
            this.finishPointerEvent(t.pointerId, n));
          return;
        }
        if (e === "pointerleave") {
          if (n.hoveredGlass) {
            let a = this.glassInteractionEntries.get(n.hoveredGlass) ?? null;
            (this.dispatchGlassPointerEvent("pointerleave", n.hoveredGlass, a, r, !1),
              (n.hoveredGlass = null));
          }
          this.finishPointerEvent(t.pointerId, n);
          return;
        }
        let s = Ce(this.glassInteractionOrder, r.canvasX, r.canvasY);
        if (
          (this.updateHoveredGlass(n, s, r),
          s &&
            (this.dispatchGlassPointerEvent(e, s.glass, s, r, !0),
            e === "pointerdown" &&
              ((n.pressedGlass = s.glass),
              this.options.flushSceneContentSync(),
              this.glassInteractionEntries.has(s.glass) &&
                ((n.capturedGlass = s.glass),
                (n.capturedWithNativePointerCapture = !1),
                !st(t, this.options.getSceneHtmlHosts()) &&
                  !st(t, this.options.getGlassContentHosts())))))
        )
          try {
            (this.options.targetCanvas.setPointerCapture(t.pointerId),
              (n.capturedWithNativePointerCapture = !0));
          } catch {
            ((n.capturedGlass = null), (n.pressedGlass = null));
          }
        this.finishPointerEvent(t.pointerId, n);
      }
    },
    O = 32,
    Ge = 256,
    Xt = Ge * O;
  function Ut(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  function Vt() {
    return {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    };
  }
  function oe(e, t, n) {
    ((e.minX = Math.min(e.minX, t)),
      (e.minY = Math.min(e.minY, n)),
      (e.maxX = Math.max(e.maxX, t)),
      (e.maxY = Math.max(e.maxY, n)));
  }
  function qt(e) {
    return (
      Number.isFinite(e.minX) &&
      Number.isFinite(e.minY) &&
      Number.isFinite(e.maxX) &&
      Number.isFinite(e.maxY) &&
      e.maxX > e.minX &&
      e.maxY > e.minY
    );
  }
  function Ee(e, t) {
    if (e.length === 0) return 0;
    if (e.length === 1) return e[0];
    let n = Ut((e.length - 1) * t, 0, e.length - 1),
      r = Math.floor(n),
      i = Math.ceil(n),
      s = n - r;
    return e[r] + (e[i] - e[r]) * s;
  }
  function $t(e) {
    let t = new Uint8Array(e.getMappedRange()),
      n = [],
      r = 0,
      i = 0,
      s = 0;
    for (let o = 0; o < O; o += 1) {
      let l = o * Ge;
      for (let d = 0; d < O; d += 1) {
        let c = l + d * 4;
        if (t[c + 3] / 255 <= 0.5) continue;
        let u = t[c] / 255,
          p = t[c + 1] / 255,
          v = t[c + 2] / 255,
          w = u * 0.2126 + p * 0.7152 + v * 0.0722;
        ((r += u), (i += p), (s += v), n.push(w));
      }
    }
    if (n.length === 0) return null;
    n.sort((o, l) => o - l);
    let a = n.length;
    return {
      averageLinearColor: { r: r / a, g: i / a, b: s / a },
      averageLuminance: n.reduce((o, l) => o + l, 0) / a,
      luminanceP10: Ee(n, 0.1),
      luminanceP50: Ee(n, 0.5),
      luminanceP90: Ee(n, 0.9),
    };
  }
  var Kt = class {
    constructor(e) {
      this.isDestroyed = e;
    }
    isDestroyed;
    device = null;
    stateByContainer = new WeakMap();
    trackedContainers = new Set();
    pendingStates = new Set();
    setDevice(e) {
      this.device = e;
      for (let t of this.trackedContainers) {
        let n = this.stateByContainer.get(t);
        n && this.ensureResources(n);
      }
    }
    setTracking(e, t) {
      if (t) {
        let r = this.getOrCreateState(e);
        ((r.cleanupAfterPending = !1), this.trackedContainers.add(e), this.ensureResources(r));
        return;
      }
      this.trackedContainers.delete(e);
      let n = this.stateByContainer.get(e);
      if (n) {
        if (((n.metrics = null), (n.inScene = !1), n.pendingReadback)) {
          n.cleanupAfterPending = !0;
          return;
        }
        this.cleanupState(n);
      }
    }
    getMetrics(e) {
      if (!this.trackedContainers.has(e)) return null;
      let t = this.stateByContainer.get(e);
      return !t || !t.inScene ? null : t.metrics;
    }
    getTrackedState(e) {
      return this.trackedContainers.has(e) ? this.getOrCreateState(e) : null;
    }
    ensureResources(e) {
      !this.device ||
        e.readbackBuffer ||
        (e.readbackBuffer = this.device.createBuffer({ size: Xt, usage: E.MAP_READ | E.COPY_DST }));
    }
    markSceneMembership(e) {
      for (let t of this.trackedContainers) {
        let n = this.stateByContainer.get(t);
        n && ((n.inScene = e.has(t)), n.inScene || (n.metrics = null));
      }
    }
    scheduleReadback(e) {
      let t = e.readbackBuffer;
      !t ||
        e.pendingReadback ||
        ((e.pendingReadback = !0),
        this.pendingStates.add(e),
        t
          .mapAsync(GPUMapMode.READ)
          .then(() => {
            if (this.isDestroyed() || !this.trackedContainers.has(e.container) || !e.inScene) {
              e.metrics = null;
              return;
            }
            let n = $t(t);
            if (!n) {
              e.metrics = null;
              return;
            }
            e.metrics = n;
          })
          .catch((n) => {
            (!this.isDestroyed() && !e.cleanupAfterPending && console.error(n), (e.metrics = null));
          })
          .finally(() => {
            (t.mapState === "mapped" && t.unmap(),
              (e.pendingReadback = !1),
              this.pendingStates.delete(e),
              (this.isDestroyed() || e.cleanupAfterPending) && this.cleanupState(e));
          }));
    }
    destroy() {
      for (let e of this.trackedContainers) {
        let t = this.stateByContainer.get(e);
        t && (t.pendingReadback ? (t.cleanupAfterPending = !0) : this.cleanupState(t));
      }
      this.trackedContainers.clear();
      for (let e of this.pendingStates) e.cleanupAfterPending = !0;
    }
    getOrCreateState(e) {
      let t = this.stateByContainer.get(e);
      return (
        t ||
        ((t = {
          container: e,
          readbackBuffer: null,
          metrics: null,
          pendingReadback: !1,
          inScene: !1,
          cleanupAfterPending: !1,
        }),
        this.stateByContainer.set(e, t),
        t)
      );
    }
    cleanupState(e) {
      if (e.pendingReadback) {
        e.cleanupAfterPending = !0;
        return;
      }
      ((e.metrics = null),
        (e.inScene = !1),
        (e.cleanupAfterPending = !1),
        this.pendingStates.delete(e),
        e.readbackBuffer?.destroy(),
        (e.readbackBuffer = null));
    }
  };
  function Qt(e, t) {
    return e === "hairline" ? 1 : e * t;
  }
  var we = "rgba16float",
    Pe = "rgba8unorm";
  function jt(e) {
    return e === "convex" ? 0 : e === "concave" ? 1 : 2;
  }
  var Zt = class {
    backdropMetrics = new Kt(() => this.destroyed);
    destroyed = !1;
    currentDpr = 1;
    width = 1;
    height = 1;
    contentSource = null;
    device;
    format;
    globalsBuffer;
    shapesBuffer = null;
    backdropMetricsBoundsBuffer;
    htmlCompositeParamsBuffer;
    emptyContentEntriesBuffer;
    sampler;
    backdropBlurResources;
    displacementBlurResources;
    shadowBlurResources;
    displacementFieldPipeline;
    shadowMaskPipeline;
    shadowCompositePipeline;
    glassPipeline;
    htmlCompositePipeline;
    backdropMetricsPipeline;
    blitPipeline;
    targets = null;
    backdropMetricsTarget;
    constructor({ device: e, format: t }) {
      ((this.device = e),
        (this.format = t),
        (this.sampler = e.createSampler({
          magFilter: "linear",
          minFilter: "linear",
          addressModeU: "clamp-to-edge",
          addressModeV: "clamp-to-edge",
        })));
      let n = E.UNIFORM | E.COPY_DST;
      ((this.globalsBuffer = new j(e, He, n)),
        (this.backdropMetricsBoundsBuffer = new j(e, at, n)),
        (this.htmlCompositeParamsBuffer = new j(e, ot, n)),
        (this.emptyContentEntriesBuffer = new De(e, Ie, E.STORAGE | E.COPY_DST)),
        this.emptyContentEntriesBuffer.ensureCapacity(0),
        (this.backdropBlurResources = le(e, t)),
        (this.displacementBlurResources = le(e, we)),
        (this.shadowBlurResources = le(e, Pe)),
        (this.displacementFieldPipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: qe }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: qe }),
            entryPoint: "fragmentMain",
            targets: [{ format: we }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.glassPipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: Qe }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: Qe }),
            entryPoint: "fragmentMain",
            targets: [{ format: t }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.shadowMaskPipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: $e }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: $e }),
            entryPoint: "fragmentMain",
            targets: [{ format: Pe }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.shadowCompositePipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: Ke }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: Ke }),
            entryPoint: "fragmentMain",
            targets: [{ format: t }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.htmlCompositePipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: Ze }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: Ze }),
            entryPoint: "fragmentMain",
            targets: [{ format: t }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.backdropMetricsPipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: je }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: je }),
            entryPoint: "fragmentMain",
            targets: [{ format: "rgba8unorm" }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.blitPipeline = e.createRenderPipeline({
          layout: "auto",
          vertex: { module: e.createShaderModule({ code: Ve }), entryPoint: "vertexMain" },
          fragment: {
            module: e.createShaderModule({ code: Ve }),
            entryPoint: "fragmentMain",
            targets: [{ format: t }],
          },
          primitive: { topology: "triangle-list" },
        })),
        (this.backdropMetricsTarget = e.createTexture({
          size: { width: O, height: O, depthOrArrayLayers: 1 },
          format: "rgba8unorm",
          usage: y.RENDER_ATTACHMENT | y.COPY_SRC,
        })),
        this.backdropMetrics.setDevice(e));
    }
    setBackdropMetricsTracking(e, t) {
      this.backdropMetrics.setTracking(e, t);
    }
    getBackdropMetrics(e) {
      return this.backdropMetrics.getMetrics(e);
    }
    render(e) {
      if (this.destroyed) return;
      ((this.width = Math.max(1, Math.floor(e.width))),
        (this.height = Math.max(1, Math.floor(e.height))),
        (this.currentDpr = Math.max(e.dpr, 1e-4)),
        (this.contentSource = e.contentSource ?? null),
        this.syncTargets());
      let t = e.layers ?? (e.scene ? Ae(e.scene) : []);
      try {
        this.drawFrame(t, e.outputTexture, e.backdropTexture ?? null);
      } finally {
        this.contentSource = null;
      }
    }
    destroy() {
      this.destroyed ||
        ((this.destroyed = !0),
        Je(this.targets),
        (this.targets = null),
        this.backdropMetricsTarget.destroy(),
        this.globalsBuffer.destroy(),
        this.shapesBuffer?.destroy(),
        this.emptyContentEntriesBuffer.destroy(),
        Z(this.backdropBlurResources),
        Z(this.displacementBlurResources),
        Z(this.shadowBlurResources),
        this.backdropMetricsBoundsBuffer.destroy(),
        this.htmlCompositeParamsBuffer.destroy(),
        this.backdropMetrics.destroy());
    }
    syncTargets() {
      (this.targets &&
        this.targets.backdropBlur.levels[0]?.width === this.width &&
        this.targets.backdropBlur.levels[0]?.height === this.height) ||
        (Je(this.targets),
        (this.targets = {
          backdropBlur: ee(this.device, this.format, this.width, this.height),
          displacementBlur: ee(this.device, we, this.width, this.height),
          shadowBlur: ee(this.device, Pe, this.width, this.height),
          sceneA: X(this.device, this.format, this.width, this.height),
          sceneB: X(this.device, this.format, this.width, this.height),
        }));
    }
    ensureShapesBuffer(e) {
      (this.shapesBuffer || (this.shapesBuffer = new De(this.device, it, E.STORAGE | E.COPY_DST)),
        this.shapesBuffer.ensureCapacity(e));
    }
    writeGlobals(e, t) {
      let n = this.currentDpr;
      this.globalsBuffer.write({
        canvas: { width: this.width, height: this.height },
        container: { opacity: e.opacity },
        shape: {
          smoothing: e.spacing * n,
          bezelWidth: e.bezelWidth * n,
          shapeCount: t,
          surfaceProfile: jt(e.surfaceProfile),
        },
        sdf: {
          normalDivergenceBlendPower: e.normalDivergenceBlendPower,
          normalDivergenceBlendEnabled: e.normalDivergenceBlendEnabled ? 1 : 0,
        },
        glass: {
          thickness: e.thickness * n,
          displacementFactor: e.displacementFactor,
          ior: e.ior,
          dispersion: e.dispersion,
        },
        content: { ior: e.contentIor, depth: e.contentDepth * n },
        lighting: { x: Math.sin(e.lightDirection), y: -Math.cos(e.lightDirection) },
        specular: {
          strength: e.specularStrength,
          width: Qt(e.specularWidth, n),
          sharpness: e.specularSharpness,
          opacity: e.specularOpacity,
        },
        specularSecondary: {
          oppositeStrength: e.oppositeSpecularStrength,
          falloff: e.specularFalloff,
          reflectionOffset: e.reflectionOffset * n,
        },
        tint: { r: e.tint.r, g: e.tint.g, b: e.tint.b, a: e.tint.a },
        shadow: {
          offsetX: e.shadowOffsetX * n,
          offsetY: e.shadowOffsetY * n,
          spread: e.shadowSpread * n,
          blur: e.shadowBlur * n,
        },
        shadowColor: {
          r: e.shadowColor.r,
          g: e.shadowColor.g,
          b: e.shadowColor.b,
          a: e.shadowColor.a,
        },
        debug: { displacement: e.debugDisplacement ? 1 : 0 },
      });
    }
    writeBackdropMetricsBounds(e) {
      this.backdropMetricsBoundsBuffer.write({
        bounds: { minX: e.minX, minY: e.minY, maxX: e.maxX, maxY: e.maxY },
      });
    }
    packShapes(e, t) {
      let n = this.currentDpr,
        r = Oe(e),
        i = Vt(),
        s = 0;
      this.ensureShapesBuffer(r.length);
      let a = this.shapesBuffer;
      for (let o of r) {
        let l = o.glass;
        if (l.width <= 0 || l.height <= 0) continue;
        let d = F(t, o.transform),
          c = be(d, n),
          f = $(c);
        if (!f) continue;
        let u = W(c, 0, 0),
          p = W(c, l.width, 0),
          v = W(c, 0, l.height),
          w = W(c, l.width, l.height);
        (oe(i, u.x, u.y), oe(i, p.x, p.y), oe(i, v.x, v.y), oe(i, w.x, w.y));
        let x = this.contentSource?.getGlassContentRange?.(l),
          b = l.width * 0.5,
          g = l.height * 0.5;
        (a?.writeAt(s, {
          inverse0: { a: f.a, c: f.c, e: f.e, minimumScale: Fe(c) },
          inverse1: { b: f.b, d: f.d, f: f.f, cornerRadius: l.cornerRadius },
          geometry: { halfWidth: b, halfHeight: g, cornerSmoothing: l.cornerSmoothing },
          contentRange: { start: x?.start ?? 0, count: x?.count ?? 0 },
        }),
          (s += 1));
      }
      return (a?.upload(s), { shapeCount: s, bounds: qt(i) ? i : null });
    }
    renderDisplacementField(e, t) {
      if (!this.shapesBuffer?.buffer || !this.targets) return null;
      let n = this.targets.displacementBlur.levels[0],
        r = D(this.device, this.displacementFieldPipeline, [
          { binding: 0, resource: this.globalsBuffer.bindingResource },
          { binding: 1, resource: this.shapesBuffer.bindingResource },
        ]);
      return (
        M(e, {
          pipeline: this.displacementFieldPipeline,
          bindGroup: r,
          target: n.ping,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
        }),
        J({
          device: this.device,
          sampler: this.sampler,
          encoder: e,
          source: n.ping,
          radiusPx: t.displacementBlur * this.currentDpr,
          chain: this.targets.displacementBlur,
          resources: this.displacementBlurResources,
        })
      );
    }
    renderShadow(e, t, n, r) {
      if (r.opacity <= 0 || r.shadowColor.a <= 0 || !this.shapesBuffer?.buffer || !this.targets)
        return !1;
      let i = this.targets.shadowBlur.levels[0],
        s = D(this.device, this.shadowMaskPipeline, [
          { binding: 0, resource: this.globalsBuffer.bindingResource },
          { binding: 1, resource: this.shapesBuffer.bindingResource },
        ]);
      M(e, {
        pipeline: this.shadowMaskPipeline,
        bindGroup: s,
        target: i.ping,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
      });
      let a = J({
          device: this.device,
          sampler: this.sampler,
          encoder: e,
          source: i.ping,
          radiusPx: r.shadowBlur * this.currentDpr,
          chain: this.targets.shadowBlur,
          resources: this.shadowBlurResources,
        }),
        o = D(this.device, this.shadowCompositePipeline, [
          { binding: 0, resource: this.sampler },
          { binding: 1, resource: t.createView() },
          { binding: 2, resource: a.createView() },
          { binding: 3, resource: this.globalsBuffer.bindingResource },
        ]);
      return (M(e, { pipeline: this.shadowCompositePipeline, bindGroup: o, target: n }), !0);
    }
    shouldRenderShadow(e) {
      return e.opacity > 0 && e.shadowColor.a > 0 && !!this.shapesBuffer?.buffer && !!this.targets;
    }
    renderBackdropMetrics(e, t, n, r) {
      if (!this.shapesBuffer?.buffer || !n || t.pendingReadback)
        return (!n && !t.pendingReadback && (t.metrics = null), !1);
      if ((this.backdropMetrics.ensureResources(t), !t.readbackBuffer)) return !1;
      this.writeBackdropMetricsBounds(n);
      let i = D(this.device, this.backdropMetricsPipeline, [
        { binding: 0, resource: this.globalsBuffer.bindingResource },
        { binding: 1, resource: this.shapesBuffer.bindingResource },
        { binding: 2, resource: this.sampler },
        { binding: 3, resource: r.createView() },
        { binding: 4, resource: this.backdropMetricsBoundsBuffer.bindingResource },
      ]);
      return (
        M(e, {
          pipeline: this.backdropMetricsPipeline,
          bindGroup: i,
          target: this.backdropMetricsTarget,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
        }),
        e.copyTextureToBuffer(
          { texture: this.backdropMetricsTarget },
          { buffer: t.readbackBuffer, bytesPerRow: Ge, rowsPerImage: O },
          { width: O, height: O, depthOrArrayLayers: 1 },
        ),
        !0
      );
    }
    renderContainer(e, t, n, r, i) {
      if (!this.shapesBuffer?.buffer) return;
      let s =
          this.contentSource?.contentEntriesBindingResource ??
          this.emptyContentEntriesBuffer.bindingResource,
        a = this.contentSource?.atlasTexture ?? t,
        o = D(this.device, this.glassPipeline, [
          { binding: 0, resource: this.globalsBuffer.bindingResource },
          { binding: 1, resource: this.shapesBuffer.bindingResource },
          { binding: 2, resource: this.sampler },
          { binding: 3, resource: t.createView() },
          { binding: 4, resource: n.createView() },
          { binding: 5, resource: a.createView() },
          { binding: 6, resource: s },
          { binding: 7, resource: r.createView() },
        ]);
      M(e, { pipeline: this.glassPipeline, bindGroup: o, target: i });
    }
    writeHtmlCompositeParams(e) {
      if (!e.inverseTransform) return;
      let t = e.inverseTransform;
      this.htmlCompositeParamsBuffer.write({
        canvas: {
          width: this.width,
          height: this.height,
          uScale: he(e.deviceWidth, e.width, e.textureWidth),
          vScale: he(e.deviceHeight, e.height, e.textureHeight),
        },
        inverse0: {
          a: t.a,
          c: t.c,
          e: t.e,
          copiedWidth: ce(e.copiedDeviceWidth, e.deviceWidth, e.width),
        },
        inverse1: {
          b: t.b,
          d: t.d,
          f: t.f,
          copiedHeight: ce(e.copiedDeviceHeight, e.deviceHeight, e.height),
        },
        opacity: { value: e.html.opacity },
      });
    }
    compositeHtmlLayer(e, t, n, r) {
      if ((!r.filteredTexture && !r.texture) || !r.inverseTransform) return;
      this.writeHtmlCompositeParams(r);
      let i = D(this.device, this.htmlCompositePipeline, [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: t.createView() },
        { binding: 2, resource: (r.filteredTexture ?? r.texture).createView() },
        { binding: 3, resource: this.htmlCompositeParamsBuffer.bindingResource },
      ]);
      M(e, { pipeline: this.htmlCompositePipeline, bindGroup: i, target: n });
    }
    blitTexture(e, t, n) {
      let r = D(this.device, this.blitPipeline, [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: t.createView() },
      ]);
      M(e, { pipeline: this.blitPipeline, bindGroup: r, target: n });
    }
    drawFrame(e, t, n) {
      if (this.destroyed || !this.targets) return;
      let r = new Set(),
        i = new _t(this.device, this.targets);
      n && this.blitTexture(i.encoder, n, i.current);
      for (let s of e) {
        if (s.child instanceof B) {
          if (s.child.opacity <= 0) continue;
          let u = this.contentSource?.getSceneHtmlEntry?.(s.child);
          if (!u || !u.texture || !u.inverseTransform) continue;
          (this.compositeHtmlLayer(i.encoder, i.current, i.next, u), i.submitAndSwap());
          continue;
        }
        if (s.child.opacity <= 0) continue;
        let a = this.packShapes(s.child, s.transform);
        this.writeGlobals(s.child, a.shapeCount);
        let o = s.child.blur * this.currentDpr,
          l = J({
            device: this.device,
            sampler: this.sampler,
            encoder: i.encoder,
            source: i.current,
            radiusPx: o,
            chain: this.targets.backdropBlur,
            resources: this.backdropBlurResources,
          });
        o <= 0 &&
          this.shouldRenderShadow(s.child) &&
          ((l = this.targets.backdropBlur.levels[0].pong),
          this.blitTexture(i.encoder, i.current, l));
        let d = this.renderDisplacementField(i.encoder, s.child);
        if (!d) continue;
        let c = this.backdropMetrics.getTrackedState(s.child),
          f = !1;
        (c && (r.add(s.child), (f = this.renderBackdropMetrics(i.encoder, c, a.bounds, l))),
          this.renderShadow(i.encoder, i.current, i.next, s.child) && i.submitAndSwap(),
          this.renderContainer(i.encoder, i.current, l, d, i.next),
          i.submitAndSwap(),
          c && f && this.backdropMetrics.scheduleReadback(c));
      }
      (this.backdropMetrics.markSceneMembership(r),
        this.blitTexture(i.encoder, i.current, t),
        i.submit());
    }
  };
  var ht = class {
    scene;
    canvas;
    maxDpr;
    targetCanvas;
    domContent;
    pointerController;
    unsubscribeSceneMutations = null;
    initError = null;
    destroyed = !1;
    initialized = !1;
    pendingSceneContentSync = !0;
    sceneContentSyncQueued = !1;
    currentDpr = 1;
    resizeObserver = null;
    device = null;
    context = null;
    presentationFormat = null;
    core = null;
    canvasConfigured = !1;
    lastFrameTexture = null;
    handlePaintEvent = (e) => {
      this.destroyed || !this.core || this.domContent.handlePaintEvent(e);
    };
    handleSceneMutation = () => {
      this.queueSceneContentSync();
    };
    constructor(e = {}) {
      ((this.scene = e.scene ?? new k()),
        (this.maxDpr = e.maxDpr ?? 2),
        (this.targetCanvas = document.createElement("canvas")),
        this.targetCanvas.setAttribute("layoutsubtree", "true"),
        (this.targetCanvas.style.display = "block"),
        (this.domContent = new Wt({
          targetCanvas: this.targetCanvas,
          getCurrentDpr: () => this.currentDpr,
        })),
        (this.pointerController = new Yt({
          targetCanvas: this.targetCanvas,
          renderer: this,
          isDestroyed: () => this.destroyed,
          flushSceneContentSync: () => this.flushSceneContentSync(),
          getSceneHtmlHosts: () => this.domContent.sceneHtmlHosts,
          getGlassContentHosts: () => this.domContent.glassContentHosts,
        })),
        this.targetCanvas.addEventListener("paint", this.handlePaintEvent),
        this.targetCanvas.addEventListener(
          "pointermove",
          this.pointerController.handlePointerMove,
          !0,
        ),
        this.targetCanvas.addEventListener(
          "pointerdown",
          this.pointerController.handlePointerDown,
          !0,
        ),
        this.targetCanvas.addEventListener("pointerup", this.pointerController.handlePointerUp, !0),
        this.targetCanvas.addEventListener(
          "pointercancel",
          this.pointerController.handlePointerCancel,
          !0,
        ),
        this.targetCanvas.addEventListener(
          "pointerleave",
          this.pointerController.handlePointerLeave,
          !0,
        ),
        (this.unsubscribeSceneMutations = this.scene._subscribe(this.handleSceneMutation)),
        (this.canvas = this.targetCanvas),
        this.initialize().catch((t) => {
          ((this.initError = t), console.error(t));
        }));
    }
    setBackdropMetricsTracking(e, t) {
      this.core?.setBackdropMetricsTracking(e, t);
    }
    getBackdropMetrics(e) {
      return this.core?.getBackdropMetrics(e) ?? null;
    }
    render() {
      if (this.destroyed) return;
      if (this.initError) throw this.initError;
      let e = this.syncSceneNow();
      this.initialized && this.drawFrame(e);
    }
    destroy() {
      this.destroyed ||
        ((this.destroyed = !0),
        this.targetCanvas.removeEventListener("paint", this.handlePaintEvent),
        this.targetCanvas.removeEventListener(
          "pointermove",
          this.pointerController.handlePointerMove,
          !0,
        ),
        this.targetCanvas.removeEventListener(
          "pointerdown",
          this.pointerController.handlePointerDown,
          !0,
        ),
        this.targetCanvas.removeEventListener(
          "pointerup",
          this.pointerController.handlePointerUp,
          !0,
        ),
        this.targetCanvas.removeEventListener(
          "pointercancel",
          this.pointerController.handlePointerCancel,
          !0,
        ),
        this.targetCanvas.removeEventListener(
          "pointerleave",
          this.pointerController.handlePointerLeave,
          !0,
        ),
        this.unsubscribeSceneMutations?.(),
        (this.unsubscribeSceneMutations = null),
        this.resizeObserver?.disconnect(),
        this.core?.destroy(),
        (this.core = null),
        this.lastFrameTexture?.destroy(),
        (this.lastFrameTexture = null),
        this.domContent.destroy(),
        this.pointerController.clear());
    }
    async initialize() {
      let e = navigator;
      if (!e.gpu) throw new Error("WebGPU is not available in this browser.");
      let t = await e.gpu.requestAdapter();
      if (!t) throw new Error("No compatible GPU adapter was returned.");
      let n = await t.requestDevice(),
        r = this.targetCanvas.getContext("webgpu");
      if (!r) throw new Error("Unable to acquire a WebGPU canvas context.");
      let i = e.gpu.getPreferredCanvasFormat();
      ((this.device = n),
        (this.context = r),
        (this.presentationFormat = i),
        (this.core = new Zt({ device: n, format: i })),
        this.domContent.setDevice(n, i),
        (this.initialized = !0),
        this.syncCanvasSize(),
        (this.resizeObserver = new ResizeObserver(() => {
          this.syncCanvasSize();
        })),
        this.resizeObserver.observe(this.targetCanvas),
        this.queueSceneContentSync());
    }
    syncCanvasSize() {
      if (!this.device || !this.context || !this.presentationFormat) return;
      let e = this.targetCanvas.getBoundingClientRect(),
        t = Math.min(window.devicePixelRatio || 1, this.maxDpr),
        n = Math.max(1, Math.round(e.width * t)),
        r = Math.max(1, Math.round(e.height * t));
      if (
        ((this.currentDpr = t),
        !this.canvasConfigured || this.targetCanvas.width !== n || this.targetCanvas.height !== r)
      ) {
        let i = this.lastFrameTexture,
          s = this.targetCanvas.width,
          a = this.targetCanvas.height;
        ((this.targetCanvas.width = n),
          (this.targetCanvas.height = r),
          this.context.configure({
            device: this.device,
            format: this.presentationFormat,
            usage: y.RENDER_ATTACHMENT | y.COPY_SRC | y.COPY_DST,
            alphaMode: "opaque",
          }),
          (this.canvasConfigured = !0),
          (this.lastFrameTexture = X(this.device, this.presentationFormat, n, r)),
          this.preservePreviousFrameAfterResize(i, s, a),
          i?.destroy());
      }
      this.syncSceneNow();
    }
    preservePreviousFrameAfterResize(e, t, n) {
      if (!e || !this.device || !this.context || !this.lastFrameTexture || t <= 0 || n <= 0) return;
      let r = Math.min(t, this.targetCanvas.width),
        i = Math.min(n, this.targetCanvas.height),
        s = this.device.createCommandEncoder(),
        a = this.context.getCurrentTexture(),
        o = { sourceX: 0, sourceY: 0, destinationX: 0, destinationY: 0, width: r, height: i };
      (Be(s, this.lastFrameTexture),
        Be(s, a),
        Y(s, e, this.lastFrameTexture, o),
        Y(s, e, a, o),
        this.device.queue.submit([s.finish()]));
    }
    queueSceneContentSync() {
      ((this.pendingSceneContentSync = !0),
        !(this.sceneContentSyncQueued || this.destroyed) &&
          ((this.sceneContentSyncQueued = !0),
          queueMicrotask(() => {
            ((this.sceneContentSyncQueued = !1),
              !(this.destroyed || !this.pendingSceneContentSync) && this.syncSceneNow());
          })));
    }
    syncSceneNow() {
      let e = Ae(this.scene),
        t = zt(e),
        n = Nt(e);
      return (
        this.pointerController.syncInteractions(t),
        this.domContent.sync(e, t, n),
        this.domContent.copyPending(),
        (this.pendingSceneContentSync = !1),
        e
      );
    }
    flushSceneContentSync() {
      this.pendingSceneContentSync && this.syncSceneNow();
    }
    drawFrame(e = Ae(this.scene)) {
      if (
        this.destroyed ||
        !this.context ||
        !this.core ||
        !this.device ||
        !this.lastFrameTexture ||
        this.targetCanvas.width <= 0 ||
        this.targetCanvas.height <= 0
      )
        return;
      this.core.render({
        layers: e,
        width: this.targetCanvas.width,
        height: this.targetCanvas.height,
        dpr: this.currentDpr,
        outputTexture: this.lastFrameTexture,
        contentSource: this.domContent,
      });
      let t = this.device.createCommandEncoder();
      (Y(t, this.lastFrameTexture, this.context.getCurrentTexture(), {
        sourceX: 0,
        sourceY: 0,
        destinationX: 0,
        destinationY: 0,
        width: this.targetCanvas.width,
        height: this.targetCanvas.height,
      }),
        this.device.queue.submit([t.finish()]));
    }
  };
  return mt(Jt);
})();
