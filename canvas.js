/* ============================================================
   ZIME MAYEZA — Background Data Analytics Animation
   Canvas: animated data nodes, flowing lines, bar charts,
   floating numbers — all in purple / gold palette
   ============================================================ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, animId;
  let nodes = [], bars = [], floats = [], lines = [];

  const PURPLE = 'rgba(155,93,229,';
  const GOLD   = 'rgba(212,175,115,';
  const ROSE   = 'rgba(232,121,160,';

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  /* ── Data Nodes (pulsing circles = data points) ── */
  function makeNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 1,
      pulse: 0,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.6 ? GOLD : Math.random() > 0.5 ? ROSE : PURPLE,
      opacity: Math.random() * 0.6 + 0.2,
    };
  }

  /* ── Animated bar chart clusters ── */
  function makeBarGroup() {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const count = Math.floor(Math.random() * 5) + 3;
    const bars = [];
    for (let i = 0; i < count; i++) {
      bars.push({
        targetH: Math.random() * 50 + 10,
        currentH: 0,
        w: 5,
        gap: 8,
        speed: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.5 ? GOLD : PURPLE,
      });
    }
    return { x, y, bars, opacity: Math.random() * 0.18 + 0.06, life: 0, maxLife: 300 + Math.random() * 200 };
  }

  /* ── Floating data text ── */
  const DATA_STRINGS = [
    '99.8%','500+','▲ 20%','KPI','SQL','DAX',
    '0.01','∑ data','→ insight','audit ✓',
    'pivot','Excel','Power BI','XLOOKUP',
    '100%','records','validate','report',
  ];
  function makeFloat() {
    return {
      text: DATA_STRINGS[Math.floor(Math.random() * DATA_STRINGS.length)],
      x: Math.random() * W,
      y: Math.random() * H,
      vy: -(Math.random() * 0.3 + 0.1),
      opacity: 0,
      fadeIn: true,
      maxOpacity: Math.random() * 0.12 + 0.04,
      size: Math.random() * 3 + 9,
      color: Math.random() > 0.5 ? GOLD : PURPLE,
    };
  }

  /* ── Connection lines between nearby nodes ── */
  const MAX_DIST = 160;

  function init() {
    nodes = Array.from({ length: 55 }, makeNode);
    bars  = Array.from({ length: 6 },  makeBarGroup);
    floats= Array.from({ length: 18 }, makeFloat);
  }

  /* ── Draw functions ── */
  function drawNodes() {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;

      n.pulse += n.pulseSpeed;
      const pOp = (Math.sin(n.pulse) + 1) / 2;

      // glow
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8);
      grd.addColorStop(0, n.color + (n.opacity * pOp * 0.8) + ')');
      grd.addColorStop(1, n.color + '0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color + (n.opacity * pOp + 0.1) + ')';
      ctx.fill();
    });
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const op = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = PURPLE + op + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawBars() {
    bars.forEach((group, gi) => {
      group.life++;
      if (group.life > group.maxLife) {
        bars[gi] = makeBarGroup();
        return;
      }
      const fadeIn  = Math.min(group.life / 40, 1);
      const fadeOut = group.life > group.maxLife - 60 ? (group.maxLife - group.life) / 60 : 1;
      const alpha   = group.opacity * fadeIn * fadeOut;

      let xOff = 0;
      group.bars.forEach(b => {
        b.currentH += (b.targetH - b.currentH) * 0.04 * b.speed;
        ctx.fillStyle = b.color + alpha + ')';
        ctx.fillRect(group.x + xOff, group.y - b.currentH, b.w, b.currentH);

        // top cap line
        ctx.fillStyle = b.color + (alpha * 2.5) + ')';
        ctx.fillRect(group.x + xOff, group.y - b.currentH, b.w, 1.5);

        // baseline
        ctx.fillStyle = b.color + (alpha * 0.4) + ')';
        ctx.fillRect(group.x + xOff - 2, group.y, b.w + 4, 1);

        xOff += b.w + b.gap;
      });
    });
  }

  function drawFloats() {
    ctx.font = '';
    floats.forEach((f, fi) => {
      f.y += f.vy;
      if (f.fadeIn) {
        f.opacity += 0.003;
        if (f.opacity >= f.maxOpacity) f.fadeIn = false;
      } else {
        f.opacity -= 0.002;
      }
      if (f.opacity <= 0) { floats[fi] = makeFloat(); return; }

      ctx.font = `${f.size}px 'DM Mono', monospace`;
      ctx.fillStyle = f.color + f.opacity + ')';
      ctx.fillText(f.text, f.x, f.y);
    });
  }

  /* ── Animated line chart path ── */
  let lineT = 0;
  function drawLineChart() {
    lineT += 0.004;
    const points = 14;
    const xs = Array.from({length: points}, (_, i) => (W * 0.1) + (i / (points - 1)) * (W * 0.35));
    const ys = xs.map((_, i) => (H * 0.82) - Math.sin(i * 0.7 + lineT) * 30 - Math.sin(i * 1.3 + lineT * 1.5) * 18 - i * 3.5);

    ctx.beginPath();
    xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys[i]) : ctx.lineTo(x, ys[i]));
    ctx.strokeStyle = GOLD + '0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // dots on line
    xs.forEach((x, i) => {
      ctx.beginPath();
      ctx.arc(x, ys[i], 2, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + '0.15)';
      ctx.fill();
    });

    // second line (purple)
    const ys2 = xs.map((_, i) => (H * 0.82) - Math.cos(i * 0.9 + lineT * 0.8) * 25 - i * 2);
    ctx.beginPath();
    xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys2[i]) : ctx.lineTo(x, ys2[i]));
    ctx.strokeStyle = PURPLE + '0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /* ── Pie chart (static-ish arc) ── */
  let pieT = 0;
  function drawPie() {
    pieT += 0.006;
    const cx = W * 0.82, cy = H * 0.22, r = 40;
    const slices = [
      { start: 0, end: 2.2, color: GOLD },
      { start: 2.2, end: 4.0, color: PURPLE },
      { start: 4.0, end: 5.5, color: ROSE },
      { start: 5.5, end: Math.PI * 2, color: PURPLE },
    ];
    slices.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r + Math.sin(pieT) * 3, s.start + pieT * 0.05, s.end + pieT * 0.05);
      ctx.closePath();
      ctx.fillStyle = s.color + '0.07)';
      ctx.fill();
      ctx.strokeStyle = s.color + '0.12)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  }

  /* ── Main loop ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    drawNodes();
    drawBars();
    drawLineChart();
    drawPie();
    drawFloats();
    animId = requestAnimationFrame(draw);
  }

  /* ── Boot ── */
  window.addEventListener('resize', resize);
  resize();
  draw();
})();
