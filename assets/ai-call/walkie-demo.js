/* Claude 对讲机 home card: the dictation demo from the product site, rebuilt small.
   On a warm backdrop: the right-hand end of a Mac keyboard on the left, the Claude window on the right.
   Hold right ⌥ -> words come in -> fillers struck and removed -> Claude fills the gaps
   -> the clean line lands in the input box. Runs only while the card is on screen. */
(() => {
  const TOKS = [['嗯', 'f'], ['那个', 'f'], ['帮我把明天下午两点的面试'], ['，', 'a'], ['就是', 'f'], ['提前十分钟提醒我测'], ['试', 'a'], ['一下设备'], ['。', 'a']];
  const CLEAN = '帮我把明天下午两点的面试，提前十分钟提醒我测试一下设备。';
  // right-hand end of the keyboard, cropped on the left; [label, flex, modifier]
  const ROWS = [
    [['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], ['delete', 1.6, 'r']],
    [['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['return', 1.6, 'r']],
    [['M', 1], [',', 1], ['.', 1], ['/', 1], ['shift', 2.2, 'r']],
    [['⌘', 1.6, 'm'], ['opt', 1.3], ['◀', 1], ['▲▼', 1, 'ud'], ['▶', 1]]
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function build(box) {
    const key = ([t, f, k]) => t === 'opt'
      ? `<span class="wk-k wk-opt" style="flex:${f}"><b>⌥</b><small>option</small><em class="wk-tip">按住说话</em></span>`
      : `<span class="wk-k${k ? ' wk-' + k : ''}" style="flex:${f}">${t}</span>`;
    box.innerHTML = `
      <span class="wk-kbd">${ROWS.map(r => `<span class="wk-row">${r.map(key).join('')}</span>`).join('')}</span>
      <span class="wk-win">
        <span class="wk-bar"><i></i><i></i><i></i><span>Claude</span><span class="wk-pill"><b class="wk-spark"></b><span class="wk-pill-text">听写中</span></span></span>
        <span class="wk-body">
          <span class="wk-heard"></span>
          <span class="wk-input"><span class="wk-ph">回复 Claude…</span><span class="wk-typed"></span><i class="wk-caret"></i></span>
        </span>
      </span>`;
    const q = s => box.querySelector(s);
    return { heard: q('.wk-heard'), input: q('.wk-input'), ph: q('.wk-ph'), typed: q('.wk-typed'),
      pill: q('.wk-pill'), pillText: q('.wk-pill-text'), opt: q('.wk-opt'), tip: q('.wk-tip') };
  }

  function start(box) {
    const ui = build(box);
    if (reduced) { ui.ph.style.display = 'none'; ui.typed.textContent = CLEAN; return; }
    let onScreen = false, running = false;
    async function loop() {
      running = true;
      while (onScreen) {
        ui.typed.textContent = ''; ui.ph.style.display = ''; ui.input.classList.remove('landed');
        ui.heard.className = 'wk-heard'; ui.heard.style.opacity = 1;
        ui.heard.innerHTML = TOKS.map(([w, k]) => `<span class="t${k ? ' ' + k : ''}">${w}</span>`).join('');
        const spans = [...ui.heard.children];
        const of = k => spans.filter(el => el.classList.contains(k));
        spans.forEach(el => { el.style.maxWidth = (el.classList.contains('a') ? 0 : el.scrollWidth + 2) + 'px'; });
        ui.tip.textContent = '按住说话'; ui.opt.classList.remove('down');
        await wait(1200);
        ui.opt.classList.add('down'); ui.tip.textContent = '按住…正在听';
        ui.pill.classList.add('on'); ui.pillText.textContent = '听写中';
        for (const el of spans) { if (el.classList.contains('a')) continue; el.classList.add('on'); await wait(340); }
        await wait(250);
        ui.opt.classList.remove('down'); ui.tip.textContent = '松手';
        ui.pillText.textContent = '润色中';
        await wait(400);
        of('f').forEach((el, i) => setTimeout(() => el.classList.add('struck'), i * 130));
        await wait(850);
        of('f').forEach(el => el.classList.add('gone'));
        ui.heard.classList.add('joined');
        await wait(600);
        of('a').forEach((el, i) => setTimeout(() => { el.style.maxWidth = el.scrollWidth + 2 + 'px'; el.classList.add('on'); }, i * 150));
        await wait(950);
        of('a').forEach(el => el.classList.add('settle'));
        await wait(600);
        ui.pill.classList.remove('on');
        ui.heard.style.opacity = 0;
        await wait(250);
        ui.ph.style.display = 'none'; ui.typed.textContent = CLEAN; ui.input.classList.add('landed');
        ui.tip.textContent = '已填进输入框';
        await wait(600); ui.input.classList.remove('landed');
        await wait(2400);
      }
      running = false;
    }
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !running) loop();
    }, { threshold: .25 }).observe(box);
  }

  const init = () => document.querySelectorAll('[data-wk-demo]').forEach(start);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
