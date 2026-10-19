// Agent Island case: web rebuilds of the app's notch states and approval card.
// Geometry, springs and colours follow the product site (site/island.js) and the
// SwiftUI sources (IslandMotion.swift, ApprovalReviewView.swift). No dependencies.
(() => {
  'use strict';

  const roots = document.querySelectorAll('[data-ai-stage], [data-ai-demo], [data-ai-approval], [data-ai-loop]');
  if (!roots.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ICONS = {
    claude: 'assets/agent-island-v2/icons/claude.png',
    codex: 'assets/agent-island-v2/icons/codex.png',
    doubao: 'assets/agent-island-v2/icons/doubao.png',
    workbuddy: 'assets/agent-island-v2/icons/workbuddy.png'
  };
  const ICON = k => ICONS[k];
  const COLOR = { attn: '#e8b080', info: '#8aaee8', ok: '#87c7ab' };
  const EVENTS = [
    { agent: 'claude', stack: ['claude', 'codex', 'doubao'], title: '重构登录模块', status: '已完成', color: COLOR.ok, glow: 'rgba(135,199,171,.28)' },
    { agent: 'codex', stack: ['codex', 'claude', 'workbuddy'], title: '数据库迁移', status: '等你批准', color: COLOR.attn, glow: 'rgba(232,176,128,.28)' }
  ];
  // The hero's loop: a finished task, then a request that grows into the approval card.
  const LIVE = {
    done: { agent: 'codex', stack: ['codex', 'claude', 'doubao'], title: '数据库迁移', status: '已完成', color: COLOR.ok, glow: 'rgba(135,199,171,.28)' },
    ask: { agent: 'claude', stack: ['claude', 'codex', 'workbuddy'], title: '重构登录模块', status: '等你批准', color: COLOR.attn, glow: 'rgba(232,176,128,.28)' },
    running: { agent: 'claude', stack: ['claude', 'codex', 'workbuddy'], title: '重构登录模块', status: '正在执行', color: COLOR.info, glow: 'rgba(138,174,232,.26)' },
    handedBack: { agent: 'claude', stack: ['claude', 'codex', 'workbuddy'], title: '重构登录模块', status: '在 Claude 里处理', color: COLOR.attn, glow: 'rgba(232,176,128,.2)' }
  };
  // App points: bar states sit beside the notch, the panel opens below it.
  const SHAPES = {
    small: { w: 290, h: 34, r: 12, sh: 7 },
    med: { w: 520, h: 34, r: 12, sh: 7 },
    panel: { w: 640, h: 452, r: 30, sh: 10 },
    approval: { w: 362, h: 196, r: 28, sh: 9 }
  };

  const MARK = '<svg class="p-mark" style="--d:0" viewBox="0 0 40 40"><path d="M1.6 10Q6.02 10 6.02 14.42L6.02 23Q6.02 30 13.02 30L26.98 30Q33.98 30 33.98 23L33.98 14.42Q33.98 10 38.4 10Z" fill="#0a0c0d" stroke="#c9cec9" stroke-width="2.4" stroke-linejoin="round"/><rect x="13" y="17.92" width="2.8" height="6.4" rx="1.4" fill="#79f2b5"/><rect x="18.6" y="16.12" width="2.8" height="10" rx="1.4" fill="#f7f7f4"/><rect x="24.2" y="18.72" width="2.8" height="4.8" rx="1.4" fill="#84dbf3"/></svg>';

  const BODY = `
    <div class="i-small">
      <img class="i-small-icon" src="${ICON('claude')}" alt="">
      <span class="i-pill"><span class="i-bars"><i></i><i></i><i></i></span><b>4</b></span>
    </div>
    <div class="i-med">
      <span class="i-stack"><img alt=""><img alt=""><img alt=""></span>
      <span class="i-med-title"></span>
      <span class="i-med-status"><i></i><span></span></span>
    </div>
    <div class="i-panel">
      ${MARK}
      <span class="p-title" style="--d:0">Agent 灵动岛</span>
      <span class="p-sub" style="--d:0">你的 Agent 管家</span>
      <span class="p-count" style="--d:0;left:428px;--c:#8aaee8"><b>2</b>活跃</span>
      <span class="p-count" style="--d:0;left:476px;--c:#e6e8e4"><b>1</b>待更新</span>
      <span class="p-count" style="--d:0;left:524px;--c:#e8b080"><b>1</b>待处理</span>
      <span class="p-collapse" style="--d:0"></span>
      <span class="p-rule" style="--d:0;top:100px"></span>
      <span class="p-today" style="--d:1">今日活跃 · 12 轮</span>
      <span class="p-bar" style="--d:1"><i style="width:199px;background:#7aa8ff"></i><i style="width:159px;background:#ad7dff"></i><i style="width:80px;background:#33d69e"></i><i style="width:40px;background:#ff6e47"></i></span>
      <span class="p-legend" style="--d:1">
        <span><i style="background:#7aa8ff"></i>Codex<b>5</b></span>
        <span><i style="background:#ad7dff"></i>Claude<b>4</b></span>
        <span><i style="background:#33d69e"></i>Work Buddy<b>2</b></span>
        <span><i style="background:#ff6e47"></i>豆包<b>1</b></span>
      </span>
      <span class="p-rule" style="--d:1;top:160px"></span>
      <span class="p-vrule" style="--d:1"></span>
      <span class="p-list-head" style="--d:2"><span>最近 24 小时</span><span>进行中优先</span></span>
      <span class="p-card is-current" style="--d:3;top:196px"><img src="${ICON('codex')}" alt=""><b>Codex</b><span>数据库迁移脚本</span><small>A41C02&ensp;21:04</small><em style="color:${COLOR.attn}">等你批准</em></span>
      <span class="p-card" style="--d:4;top:280px"><img src="${ICON('workbuddy')}" alt=""><b>Work Buddy</b><span>整理本周周报素材</span><small>7F2E91&ensp;20:58</small><em style="color:${COLOR.info}">正在执行</em></span>
      <span class="p-card" style="--d:5;top:364px"><img src="${ICON('claude')}" alt=""><b>Claude</b><span>重构登录模块</span><small>C93B07&ensp;20:41</small><em style="color:${COLOR.ok}">已完成</em></span>
      <span class="p-detail" style="--d:5"><img src="${ICON('codex')}" alt=""><b>Codex</b><span class="p-open">打开应用</span></span>
      <span class="p-heading" style="--d:5">数据库迁移脚本</span>
      <span class="p-status" style="--d:6"><em>等你批准</em><time>21:04</time></span>
      <span class="p-hair" style="--d:6"></span>
      <span class="p-outcome" style="--d:7"><span>Codex 等你批准 · 请在 Codex 里处理</span><b>查看</b></span>
      <span class="p-tiles-head" style="--d:8">已完成的步骤</span>
      <span class="p-tiles" style="--d:9"><span><b>1</b>改文件</span><span><b>2</b>跑命令</span><span><b>3</b>读文件</span></span>
      <span class="p-foot" style="--d:10">网页还原，演示数据</span>
    </div>
    <div class="i-approval"></div>`;

  function notchPath(w, h, sh, r) {
    // Same construction as the app: concave shoulders into the top edge, rounded bottom corners.
    const maxX = w + 2 * sh, left = sh, right = w + sh, top = -1;
    r = Math.min(r, h - sh, w / 2);
    return `M0 ${top}Q${left} ${top} ${left} ${top + sh}L${left} ${h - r}Q${left} ${h} ${left + r} ${h}` +
      `L${right - r} ${h}Q${right} ${h} ${right} ${h - r}L${right} ${top + sh}Q${right} ${top} ${maxX} ${top}Z`;
  }

  function makeIsland(state, live) {
    const el = document.createElement('div');
    el.className = 'aiv-island' + (live ? '' : ' is-static');
    el.dataset.state = state;
    el.innerHTML = `<div class="island-glow"></div><svg class="island-shape" aria-hidden="true"><path/></svg><div class="island-body" aria-hidden="true">${BODY}</div>`;
    return {
      el,
      shape: el.querySelector('.island-shape'),
      path: el.querySelector('.island-shape path'),
      body: el.querySelector('.island-body'),
      glow: el.querySelector('.island-glow'),
      smallIcon: el.querySelector('.i-small-icon'),
      stack: el.querySelectorAll('.i-stack img'),
      medTitle: el.querySelector('.i-med-title'),
      medStatus: el.querySelector('.i-med-status')
    };
  }

  function paint(p, { w, h, r, sh }) {
    const W = w + 2 * sh;
    p.shape.setAttribute('width', W.toFixed(2));
    p.shape.setAttribute('height', (h + 1).toFixed(2));
    p.path.setAttribute('d', notchPath(w, h, sh, r));
    const k = Math.max(0, Math.min(1, (h - 40) / 120));
    p.shape.style.filter = k > 0 ? `drop-shadow(0 ${18 * k}px ${46 * k}px rgba(4,20,22,${.36 * k}))` : '';
    if (p.body) {
      p.body.style.left = sh + 'px';
      p.body.style.width = w + 'px';
      p.body.style.height = h + 'px';
      p.body.style.borderRadius = `0 0 ${r}px ${r}px`;
    }
    if (p.glow) p.glow.style.left = W / 2 + 'px';
    p.el.style.width = W + 'px';
    p.el.style.height = h + 'px';
  }

  function showEvent(p, e) {
    p.stack.forEach((img, i) => { img.src = ICON(e.stack[i]); });
    p.medTitle.textContent = e.title;
    p.medStatus.querySelector('span').textContent = e.status;
    p.medStatus.style.setProperty('--ev', e.color);
    p.glow.style.background = `radial-gradient(320px 320px at 50% 30px, ${e.glow}, transparent 70%)`;
    p.smallIcon.src = ICON(e.agent);
  }

  /* ---------- approval card content (shared by the hero and the still cards) ---------- */

  const APPROVALS = {
    live: {
      title: '重构登录模块', summary: '要在终端运行命令',
      command: 'npm test -- auth/login.spec.ts', meta: '~/projects/web-app', risky: false
    },
    normal: {
      title: '重构登录模块', summary: '要在终端运行命令',
      command: 'npm test -- auth/login.spec.ts', meta: '~/projects/web-app', risky: false
    },
    risky: {
      title: '清理发布分支', summary: '要在终端运行命令',
      command: '<mark>git push origin release --force</mark>', meta: '高风险：强制推送', risky: true
    }
  };
  const HOLD_MS = 600, TOTAL_S = 45;

  const approvalBody = d => `
      <div class="a-body">
        <div class="a-head">
          <img src="${ICON('claude')}" alt="">
          <div><b>${d.title}</b><span>${d.summary}</span></div>
          <span class="a-ring" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.75"/><circle class="a-ring-left" cx="12" cy="12" r="10.75" pathLength="1"/></svg><i>45</i></span>
        </div>
        <div class="a-command"><code>${d.command}</code><small>${d.risky ? '<em>⚠︎</em> ' : ''}${d.meta}</small></div>
        <div class="a-actions">
          <button type="button" class="a-deny">✕ 拒绝 <kbd>⌘⌫</kbd></button>
          ${d.risky
            ? '<button type="button" class="a-allow a-hold"><span class="a-fill"></span><span class="a-label">长按允许</span></button>'
            : '<button type="button" class="a-allow">✓ 允许 <kbd>⌘↩</kbd></button>'}
        </div>
        <p class="a-result" role="status"></p>
      </div>`;

  // Buttons, press-and-hold and the countdown ring. onDecide('allow' | 'deny') replaces the
  // default "show the result, then reset" behaviour when the card lives inside the hero island.
  function wireApproval(body, d, onDecide) {
    const result = body.querySelector('.a-result');
    let resetTimer = 0;
    const decide = tone => {
      if (body.dataset.decided) return;
      clearTimeout(resetTimer);
      body.dataset.decided = tone;
      result.textContent = tone === 'allow' ? '已允许 · 只放行这一次' : '已拒绝，Claude 会换个做法';
      if (onDecide) onDecide(tone);
      else resetTimer = setTimeout(reset, 2400);
    };
    const reset = () => { delete body.dataset.decided; result.textContent = ''; t0 = performance.now(); tick(); };
    body.querySelector('.a-deny').addEventListener('click', e => { e.stopPropagation(); decide('deny'); });

    const allow = body.querySelector('.a-allow');
    if (!d.risky) {
      allow.addEventListener('click', e => { e.stopPropagation(); decide('allow'); });
    } else {
      // Fills left to right while held; letting go early means no decision.
      const label = allow.querySelector('.a-label');
      let holdTimer = 0;
      const start = e => {
        if (body.dataset.decided) return;
        e.preventDefault();
        allow.classList.add('is-holding');
        label.textContent = '继续按住…';
        holdTimer = setTimeout(() => { stop(); decide('allow'); }, HOLD_MS);
      };
      const stop = () => {
        clearTimeout(holdTimer);
        allow.classList.remove('is-holding');
        label.textContent = '长按允许';
      };
      allow.addEventListener('pointerdown', start);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => allow.addEventListener(t, stop));
      allow.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start(e); });
      allow.addEventListener('keyup', stop);
    }

    // Countdown ring: amber, red for the last ten seconds; restarts so the picture stays alive.
    const ring = body.querySelector('.a-ring');
    const left = ring.querySelector('.a-ring-left');
    const num = ring.querySelector('i');
    let t0 = performance.now();
    const tick = () => {
      let remaining = TOTAL_S - (performance.now() - t0) / 1000;
      if (remaining <= 0) { t0 = performance.now(); remaining = TOTAL_S; }
      left.style.strokeDashoffset = String(1 - remaining / TOTAL_S);
      num.textContent = Math.ceil(remaining);
      ring.classList.toggle('is-late', remaining <= 10);
    };
    tick();
    if (!reduced.matches) setInterval(tick, 500);
    return { reset, setRemaining: sec => { t0 = performance.now() - (TOTAL_S - sec) * 1000; tick(); } };
  }

  /* ---------- hero: a live island on a Mac screen ---------- */

  function initStage(stage) {
    const view = stage.querySelector('.aiv-screen-view');
    const live = makeIsland('small', true);
    const root = live.el;
    root.tabIndex = 0;
    root.setAttribute('role', 'button');
    root.setAttribute('aria-expanded', 'false');
    root.setAttribute('aria-label', 'Agent 灵动岛演示：悬停 0.2 秒或按回车展开任务总览，内容为演示数据');
    view.appendChild(root);
    showEvent(live, EVENTS[0]);
    const askLayer = root.querySelector('.i-approval');
    askLayer.innerHTML = approvalBody(APPROVALS.live);
    const askBody = askLayer.querySelector('.a-body');

    // Drawn as a 14" MacBook screen (1512 pt wide); phones get a closer crop so the island stays legible.
    let K = 1;
    const fit = () => {
      const W = view.clientWidth;
      if (!W) return; // case view hidden by the router; measure again once shown
      K = W / (W < 640 ? 720 : 1280);
      view.style.setProperty('--k', K);
    };
    // The card is small at true size; let it read a little larger, within the screen.
    const approvalScale = () => view.clientWidth ? Math.min(1.15, (view.clientHeight - 10) / (SHAPES.approval.h * K)) : 1;
    const panelScale = () => view.clientWidth ? Math.min(1, (view.clientWidth - 16) / (660 * K), (view.clientHeight - 6) / (452 * K)) : 1;

    const keys = ['w', 'h', 'r', 'sh', 's'];
    const cur = { ...SHAPES.small, s: 1 };
    const vel = { w: 0, h: 0, r: 0, sh: 0, s: 0 };
    let target = { ...cur }, raf = 0, last = 0;

    const draw = () => {
      paint(live, cur);
      root.style.transform = `translateX(-50%) scale(${K * cur.s})`;
    };
    function step(now) {
      const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
      last = now;
      let moving = false;
      for (const key of keys) {
        // Stiffness / damping land with a small overshoot, like the app's spring.
        const k = key === 'h' ? 210 : 260, c = 2 * Math.sqrt(k) * (key === 'h' ? .8 : .68);
        vel[key] += (-k * (cur[key] - target[key]) - c * vel[key]) * dt;
        cur[key] += vel[key] * dt;
        if (Math.abs(vel[key]) > .01 || Math.abs(cur[key] - target[key]) > .01) moving = true;
      }
      if (!moving) for (const key of keys) { cur[key] = target[key]; vel[key] = 0; }
      draw();
      raf = moving ? requestAnimationFrame(step) : 0;
    }
    // The expanded bar never covers the screen's own menu: it takes the room left between them.
    const menuLeft = view.querySelector('.aiv-menu > span:first-child');
    const menuRight = view.querySelector('.aiv-menu > span:last-child');
    function medWidth() {
      const box = view.getBoundingClientRect();
      if (!box.width) return SHAPES.med.w;
      const clear = Math.max(menuLeft.getBoundingClientRect().right - box.left, box.right - menuRight.getBoundingClientRect().left) + 10;
      return Math.max(290, Math.min(520, (box.width - 2 * clear) / K - 14));
    }
    function goTo(name) {
      target = { ...SHAPES[name], s: name === 'panel' ? panelScale() : name === 'approval' ? approvalScale() : 1 };
      if (name === 'med') target.w = medWidth();
      if (reduced.matches) { Object.assign(cur, target); draw(); return; }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    }

    let state = 'small';
    const setState = name => {
      state = name;
      root.dataset.state = name;
      root.setAttribute('aria-expanded', String(name === 'panel'));
      stage.classList.toggle('is-open', name === 'panel' || name === 'approval');
      goTo(name);
    };

    /* Idle loop: done → quiet → a request that grows into the approval card.
       The card waits for the visitor; left alone, it hands the request back, as the app does. */
    let cycleTimer = 0, onScreen = false, phase = 0;
    const later = (fn, ms) => { clearTimeout(cycleTimer); if (!reduced.matches) cycleTimer = setTimeout(fn, ms); };
    const say = (e, next, ms) => { showEvent(live, e); setState('med'); later(next, ms); };
    const quiet = (next, ms) => { setState('small'); later(next, ms); };
    const ask = () => {
      approval.reset();
      approval.setRemaining(3);
      setState('approval');
      later(() => say(LIVE.handedBack, () => quiet(loop, 5000), 3600), 3000);
    };
    const loop = () => {
      if (state === 'panel' || !onScreen) return;
      phase = (phase + 1) % 2;
      if (phase === 1) say(LIVE.done, () => quiet(loop, 3200), 4200);
      else say(LIVE.ask, ask, 1800);
    };
    const scheduleCycle = delay => later(loop, delay);
    const approval = wireApproval(askBody, APPROVALS.live, tone => {
      later(() => {
        if (tone === 'allow') say(LIVE.running, () => quiet(loop, 5000), 3400);
        else quiet(loop, 5000);
      }, 1100);
    });

    // Hover 0.2 s to open, leave to close — the app's rule. Click / Enter for touch and keyboard.
    let hoverTimer = 0, closeTimer = 0;
    const open = () => { if (state === 'approval') return; clearTimeout(cycleTimer); clearTimeout(closeTimer); if (state !== 'panel') setState('panel'); };
    const close = () => {
      clearTimeout(hoverTimer);
      if (state !== 'panel') return;
      root.dataset.state = 'closing';
      closeTimer = setTimeout(() => { setState('small'); scheduleCycle(3000); }, 90);
    };
    root.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(closeTimer); hoverTimer = setTimeout(open, 200); } });
    root.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { clearTimeout(hoverTimer); close(); } });
    root.addEventListener('click', () => { if (state !== 'approval') state === 'panel' ? close() : open(); });
    root.addEventListener('keydown', e => {
      if (e.target !== root) return; // keys on the card's own buttons
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state === 'panel' ? close() : open(); }
      if (e.key === 'Escape') close();
    });
    document.addEventListener('pointerdown', e => { if (!root.contains(e.target)) close(); });

    new IntersectionObserver(([entry]) => {
      const was = onScreen;
      onScreen = entry.isIntersecting;
      if (onScreen && !was && state === 'small') scheduleCycle(1600);
      if (!onScreen) { clearTimeout(cycleTimer); if (state !== 'small') setState('small'); }
    }, { threshold: .35 }).observe(stage);

    const relayout = () => { fit(); goTo(state === 'closing' ? 'small' : state); };
    fit();
    Object.assign(cur, target); draw();
    new ResizeObserver(relayout).observe(view);
  }

  /* ---------- still pictures of each state ---------- */

  function initDemo(box) {
    if (box.hasAttribute('data-ai-float')) return initFloat(box);
    const name = box.dataset.aiDemo;
    const card = box.closest('.case-entry');
    const p = makeIsland(name, false);
    box.appendChild(p.el);
    showEvent(p, EVENTS[name === 'small' ? 0 : 1]);
    const fit = () => {
      const W = box.clientWidth;
      if (!W) return;
      const g = { ...SHAPES[name] };
      let k;
      if (card && name === 'panel') {
        // Selected Works card: the panel hangs from the card's top edge; the card makes room for it.
        k = Math.min(.7, (W - 72) / (g.w + 2 * g.sh));
        card.style.setProperty('--hang', g.h * k + 'px');
      } else if (name === 'panel') {
        k = Math.min(1, W / (W < 500 ? 680 : 760));
        box.style.height = (g.h + 56) * k + 'px';
      } else {
        k = Math.min(1, W / 420);
        if (name === 'med') g.w = Math.min(520, W / k - 48);
      }
      box.style.setProperty('--k', k);
      paint(p, g);
    };
    fit();
    new ResizeObserver(fit).observe(box);
  }

  /* ---------- Selected Works card: the overview floats on the wallpaper ----------
     Rounded all round (no notch shoulders). While the card is on screen it replays the
     app's opening every few seconds: a bar that grows into the panel, content landing in turn. */

  function initFloat(box) {
    const p = makeIsland('idle', true);
    p.el.classList.add('is-float');
    box.appendChild(p.el);
    showEvent(p, EVENTS[1]);
    const FROM = { w: 290, h: 34, r: 17 };
    const TO = { w: SHAPES.panel.w, h: SHAPES.panel.h, r: 22 };
    const HOLD = 3000, GAP = 700;
    const cur = { ...FROM }, vel = { w: 0, h: 0, r: 0 };
    let target = FROM, k = 1, raf = 0, last = 0, timer = 0, onScreen = false;
    const draw = () => {
      paint(p, { ...cur, sh: 0 });
      p.body.style.borderRadius = cur.r + 'px';
      p.el.style.transform = `translateX(-50%) scale(${k})`;
    };
    const fit = () => {
      const W = box.clientWidth, H = box.clientHeight;
      if (!W) return;
      k = Math.min(.74, (W * .84) / TO.w, (H * .86) / TO.h);
      p.el.style.top = Math.max(0, (H - TO.h * k) / 2) + 'px';
      draw();
    };
    const step = now => {
      const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
      last = now;
      let moving = false;
      for (const key of ['w', 'h', 'r']) {
        const kk = key === 'h' ? 150 : 190, c = 2 * Math.sqrt(kk) * (key === 'h' ? .86 : .74);
        vel[key] += (-kk * (cur[key] - target[key]) - c * vel[key]) * dt;
        cur[key] += vel[key] * dt;
        if (Math.abs(vel[key]) > .01 || Math.abs(cur[key] - target[key]) > .01) moving = true;
      }
      if (!moving) Object.assign(cur, target);
      draw();
      raf = moving ? requestAnimationFrame(step) : 0;
    };
    const go = (to, state) => {
      target = to;
      p.el.dataset.state = state;
      if (reduced.matches) { Object.assign(cur, to); draw(); return; }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    };
    // Open, hold, fold back into the bar, open again — only while the card is visible.
    const open = () => { go(TO, 'panel'); if (!reduced.matches) timer = setTimeout(close, HOLD + 900); };
    const close = () => {
      p.el.dataset.state = 'closing';
      timer = setTimeout(() => { go(FROM, 'idle'); timer = setTimeout(() => onScreen && open(), GAP + 500); }, 120);
    };
    fit();
    new ResizeObserver(fit).observe(box);
    new IntersectionObserver(([entry]) => {
      const was = onScreen;
      onScreen = entry.isIntersecting && box.clientWidth > 0;
      if (onScreen && !was) { clearTimeout(timer); timer = setTimeout(open, 250); }
      if (!onScreen && was) { clearTimeout(timer); }
    }, { threshold: .5 }).observe(box);
  }

  /* ---------- approval card, grown from the notch ---------- */

  function initApproval(box) {
    const d = APPROVALS[box.dataset.aiApproval];
    const card = document.createElement('div');
    card.className = 'aiv-approval' + (d.risky ? ' is-risky' : '');
    card.innerHTML = `<svg class="island-shape" aria-hidden="true"><path/></svg>${approvalBody(d)}`;
    box.appendChild(card);
    paint({ el: card, shape: card.querySelector('.island-shape'), path: card.querySelector('path') }, SHAPES.approval);
    wireApproval(card.querySelector('.a-body'), d);

    const fit = () => {
      if (!box.clientWidth) return;
      const k = Math.min(1.25, box.clientWidth / 420);
      box.style.setProperty('--k', k);
      box.style.height = (SHAPES.approval.h + 40) * k + 'px';
    };
    fit();
    new ResizeObserver(fit).observe(box);
  }

  /* ---------- Selected Works card films: muted loops that only play while on screen ---------- */

  function initLoop(video) {
    if (reduced.matches) return; // the poster stays as a still
    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden && document.body.dataset.route === 'home') {
        if (!video.src) video.src = video.dataset.aiLoop;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }, { threshold: .4 }).observe(video);
    // The page pauses every video when the tab is hidden; pick the loop back up on return.
    document.addEventListener('visibilitychange', sync);
    // The shared media loader may call load() after the first IntersectionObserver play.
    // Retry once media is ready, and after route transitions have settled their pause pass.
    video.addEventListener('loadeddata', sync);
    window.addEventListener('hashchange', () => requestAnimationFrame(sync));
  }

  document.querySelectorAll('[data-ai-stage]').forEach(initStage);
  document.querySelectorAll('[data-ai-loop]').forEach(initLoop);
  document.querySelectorAll('[data-ai-demo]').forEach(initDemo);
  document.querySelectorAll('[data-ai-approval]').forEach(initApproval);
})();
