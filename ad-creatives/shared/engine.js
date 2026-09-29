// Deterministic timeline engine for Flip ad creatives.
// Every page exposes window.__seek(t) and window.__duration so render.mjs can
// capture any moment frame-perfectly. Statics just seek to the end.

(() => {
  const params = new URLSearchParams(location.search);
  const format = params.get("format") || document.body.dataset.format || "feed";
  document.body.classList.add(format);

  const tracks = [];
  const F = {
    format,
    clamp: (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
    // progress of t through [start, start + dur], 0..1
    p(t, start, dur) { return F.clamp((t - start) / dur); },
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inCubic: (x) => x * x * x,
    outBack: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    lerp: (a, b, x) => a + (b - a) * x,
    track(fn) { tracks.push(fn); return fn; },
    // Fade + rise an element in over [start, start+dur]
    reveal(el, start, dur = 0.5, dy = 40) {
      F.track((t) => {
        const x = F.outCubic(F.p(t, start, dur));
        el.style.opacity = x;
        el.style.transform = `translateY(${(1 - x) * dy}px)`;
      });
    },
    // Split an element's words into spans that pop in one after another.
    words(el, start, stagger = 0.12) {
      const html = el.innerHTML;
      el.innerHTML = html.replace(/(<em>)?([^\s<]+)(<\/em>)?/g, (m, a, w, b) => `<span class="w">${a || ""}${w}${b || ""}</span>`);
      const ws = [...el.querySelectorAll(".w")];
      F.track((t) => ws.forEach((w, i) => {
        const x = F.p(t, start + i * stagger, 0.35);
        w.style.opacity = F.clamp(x * 2);
        w.style.transform = `translateY(${(1 - F.outBack(x)) * 50}px) scale(${F.lerp(0.85, 1, F.outBack(x))})`;
      }));
      return ws.length * stagger + 0.35;
    },
    // Show an element only during [a, b) with quick fades.
    window(el, a, b = 1e9, fade = 0.25) {
      F.track((t) => {
        const x = Math.min(F.p(t, a, fade), 1 - F.p(t, b - fade, fade));
        el.style.opacity = x;
        el.style.visibility = x <= 0 ? "hidden" : "visible";
      });
    },
    money(n, dp = 2) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }); },
  };

  // Build an iMessage-style thread. items: [{ at, me|flip|other|stamp|typing, who, html }]
  // Flip messages get an automatic typing indicator for `think` seconds beforehand.
  F.chat = (thread, items, { think = 0.9 } = {}) => {
    const nodes = items.map((it) => {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.flexDirection = "column";
      wrap.style.overflow = "visible";
      let el;
      if (it.stamp) {
        el = document.createElement("div"); el.className = "stamp"; el.textContent = it.stamp;
      } else {
        el = document.createElement("div");
        const kind = it.me != null ? "me" : it.flip != null ? "flip" : "other";
        el.className = `b ${kind} ${it.cls || ""}`;
        el.innerHTML = it.me ?? it.flip ?? it.other;
        if (it.who) {
          const who = document.createElement("div"); who.className = "who"; who.textContent = it.who;
          wrap.appendChild(who);
        }
      }
      wrap.appendChild(el);
      thread.appendChild(wrap);

      let typing = null;
      if (it.flip != null && it.at > 0 && think > 0) {
        typing = document.createElement("div");
        typing.className = "typing";
        typing.innerHTML = "<i></i><i></i><i></i>";
        thread.insertBefore(typing, wrap);
      }
      return { it, wrap, el, typing, h: 0 };
    });

    // measure natural heights once fonts are ready
    const measure = () => nodes.forEach((n) => { n.wrap.style.height = "auto"; n.h = n.wrap.offsetHeight; });

    const seek = (t) => {
      if (!nodes[0].h) measure();
      nodes.forEach((n) => {
        const at = n.it.at || 0;
        if (n.typing) {
          const on = t >= at - think && t < at;
          n.typing.style.display = on ? "flex" : "none";
          if (on) n.typing.querySelectorAll("i").forEach((d, i) => {
            d.style.opacity = 0.35 + 0.65 * Math.max(0, Math.sin((t * 7) - i * 0.9));
          });
        }
        const x = F.p(t, at, 0.38);
        if (t < at) { n.wrap.style.display = "none"; return; }
        n.wrap.style.display = "flex";
        n.wrap.style.height = x >= 1 ? "auto" : `${n.h * F.outCubic(x)}px`;
        n.el.style.opacity = F.clamp(x * 2.2);
        n.el.style.transform = `scale(${F.lerp(0.72, 1, F.outBack(x))})`;
      });
    };
    F.track(seek);
    return { seek, nodes };
  };

  window.F = F;
  window.__duration = 0;
  window.__seek = (t) => tracks.forEach((fn) => fn(t));
  window.__ready = document.fonts.ready.then(() => {
    const ts = params.get("t");
    window.__seek(ts != null ? parseFloat(ts) : 1e6);
    return true;
  });
})();
