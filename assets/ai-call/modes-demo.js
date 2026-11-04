/* Claude 对讲机 case, chapter 02 (三种用法): each way shown as a short live demo instead of a screenshot.
   talk    右 ⌘ 对讲: hold, ask once; Claude answers in voice + text, then the window closes.
   dictate 右 ⌥ 听写: speech lands in any input box as clean text; Claude does not answer.
   call    网页通话: no key, the turns keep going like a phone call.
   Chapter 03 adds the voice / speed / model picker and the daily Obsidian note.
   Each runs only while it is on screen; reduced motion shows the finished frame. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const SPARK = '<svg class="acd-spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"/></svg>';
  const WAVE = '<span class="acd-wave"><i></i><i></i><i></i><i></i><i></i></span>';
  const KEY = (sym, name) => `<span class="acd-keyrow"><span class="acd-key"><b>${sym}</b><small>${name}</small></span><span class="acd-hint"></span></span>`;
  async function type(el, text, ms) { el.textContent = ''; for (const ch of text) { el.textContent += ch; await wait(ms); } }

  const demos = {
    talk(box) {
      const Q = '“迭代”的英文怎么说来着？';
      const A = 'iteration。动词是 iterate，比如 iterate on the design。';
      box.innerHTML = `
        <span class="acd-float">${SPARK}<span class="acd-float-body"><span class="acd-status"><b></b>${WAVE}</span><span class="acd-q"></span><span class="acd-a"></span></span></span>
        ${KEY('⌘', 'command')}`;
      const q = s => box.querySelector(s);
      const ui = { float: q('.acd-float'), status: q('.acd-status b'), wave: q('.acd-wave'), q: q('.acd-q'), a: q('.acd-a'), key: q('.acd-key'), hint: q('.acd-hint') };
      return {
        final() { ui.float.classList.add('on'); ui.status.textContent = '在说…'; ui.q.textContent = Q; ui.a.textContent = A; ui.hint.textContent = '按一次，问一句'; },
        async run() {
          ui.float.classList.remove('on'); ui.q.textContent = ''; ui.a.textContent = ''; ui.wave.className = 'acd-wave';
          ui.hint.textContent = '按住右 ⌘ 说话';
          await wait(1100);
          ui.key.classList.add('down'); ui.float.classList.add('on'); ui.status.textContent = '在听…'; ui.wave.classList.add('in');
          await type(ui.q, Q, 90);
          await wait(350);
          ui.key.classList.remove('down'); ui.wave.className = 'acd-wave'; ui.status.textContent = '在想…'; ui.hint.textContent = '松手发送';
          await wait(800);
          ui.status.textContent = '在说… · Esc 停止'; ui.wave.classList.add('out');
          await type(ui.a, A, 75);
          ui.wave.className = 'acd-wave';
          await wait(1600);
          ui.float.classList.remove('on'); ui.hint.textContent = '说完就收起，再问再按';
          await wait(2000);
        }
      };
    },

    dictate(box) {
      const TOKS = [['嗯', 'f'], ['那个', 'f'], ['帮我把明天的会'], ['，', 'a'], ['就是', 'f'], ['改到下午三点'], ['。', 'a']];
      box.innerHTML = `
        <span class="acd-pill">${SPARK}<b>听写中</b></span>
        <span class="acd-app"><span class="acd-app-bar"><i></i><i></i><i></i><span>飞书 · 回复同事</span></span><span class="acd-field"><span class="acd-ph">输入消息…</span><span class="acd-words"></span><i class="acd-caret"></i></span></span>
        ${KEY('⌥', 'option')}`;
      const q = s => box.querySelector(s);
      const ui = { pill: q('.acd-pill'), pillText: q('.acd-pill b'), field: q('.acd-field'), ph: q('.acd-ph'), words: q('.acd-words'), key: q('.acd-key'), hint: q('.acd-hint') };
      const fill = () => {
        ui.words.innerHTML = TOKS.map(([w, k]) => `<span class="t${k ? ' ' + k : ''}">${w}</span>`).join('');
        const spans = [...ui.words.children];
        spans.forEach(el => { el.style.maxWidth = (el.classList.contains('a') ? 0 : el.scrollWidth + 2) + 'px'; });
        return spans;
      };
      return {
        final() { ui.ph.style.display = 'none'; ui.words.textContent = '帮我把明天的会，改到下午三点。'; ui.field.classList.add('clean'); ui.hint.textContent = '只填字，不回答'; },
        async run() {
          ui.field.className = 'acd-field'; ui.ph.style.display = ''; ui.words.className = 'acd-words';
          const spans = fill(); const of = k => spans.filter(el => el.classList.contains(k));
          ui.hint.textContent = '在输入框里按住右 ⌥';
          await wait(1100);
          ui.key.classList.add('down'); ui.pill.classList.add('on'); ui.pillText.textContent = '听写中'; ui.ph.style.display = 'none';
          for (const el of spans) { if (el.classList.contains('a')) continue; el.classList.add('on'); await wait(360); }
          await wait(300);
          ui.key.classList.remove('down'); ui.pillText.textContent = '润色中'; ui.hint.textContent = '松手';
          await wait(450);
          of('f').forEach((el, i) => setTimeout(() => el.classList.add('struck'), i * 140));
          await wait(900);
          of('f').forEach(el => el.classList.add('gone')); ui.words.classList.add('joined');
          await wait(600);
          of('a').forEach((el, i) => setTimeout(() => { el.style.maxWidth = el.scrollWidth + 2 + 'px'; el.classList.add('on'); }, i * 160));
          await wait(900);
          ui.field.classList.add('clean', 'landed'); ui.pill.classList.remove('on'); ui.hint.textContent = '只填字，不回答';
          await wait(700); ui.field.classList.remove('landed');
          await wait(2400);
        }
      };
    },

    call(box) {
      const TURNS = [
        ['you', '明天的面试，我有点紧张。'],
        ['claude', '很正常。我们先把开场练一遍？'],
        ['you', '好，那你来当面试官。'],
        ['claude', '好。先介绍一下你最近做的项目吧。'],
        ['you', '我最近做了一个语音工具……']
      ];
      box.innerHTML = `
        <span class="acd-top"><b class="acd-live"></b>通话中<span class="acd-time">00:42</span></span>
        <span class="acd-orb">${SPARK}<i></i><i></i></span>
        <span class="acd-who"></span>
        <span class="acd-line"></span>
        <span class="acd-turns">${'<i></i>'.repeat(TURNS.length)}</span>`;
      const q = s => box.querySelector(s);
      const ui = { time: q('.acd-time'), orb: q('.acd-orb'), who: q('.acd-who'), line: q('.acd-line'), dots: [...box.querySelectorAll('.acd-turns i')] };
      let sec = 42;
      const tick = () => { sec++; ui.time.textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; };
      const show = (who, text) => { ui.who.textContent = who === 'you' ? '你在说' : 'Claude 在说'; ui.line.className = 'acd-line ' + who; ui.orb.className = 'acd-orb ' + (who === 'you' ? 'listen' : 'speak'); return text; };
      return {
        final() { show('claude', ''); ui.line.textContent = TURNS[3][1]; ui.dots.slice(0, 4).forEach((d, i) => d.classList.add(TURNS[i][0])); },
        async run() {
          const timer = setInterval(tick, 1000);
          ui.dots.forEach(d => { d.className = ''; });
          for (let i = 0; i < TURNS.length; i++) {
            const [who, text] = TURNS[i];
            show(who, text); ui.dots[i].classList.add(who);
            await type(ui.line, text, who === 'you' ? 95 : 70);
            await wait(who === 'you' ? 500 : 900);
          }
          await wait(900);
          clearInterval(timer);
        }
      };
    }
  };

  function start(box) {
    const make = demos[box.dataset.acDemo];
    if (!make) return;
    const demo = make(box);
    if (reduced) { demo.final(); return; }
    let onScreen = false, running = false;
    const loop = async () => { running = true; while (onScreen) await demo.run(); running = false; };
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !running) loop();
    }, { threshold: .3 }).observe(box);
  }

  /* chapter 03: voice / speed / model chips you can click. The preview line is retyped at the picked
     speed and the wave follows it. Until someone clicks, it switches one setting by itself now and then. */
  function tune(box) {
    const say = box.querySelector('.act-say'), meta = box.querySelector('.act-meta-text'), wave = box.querySelector('.act-wave');
    const LINE = say.textContent;
    const rows = [...box.querySelectorAll('.act-row')];
    const picked = row => row.querySelector('[aria-pressed="true"]');
    let typing = 0, touched = false;
    async function refresh() {
      const [v, r, m] = rows.map(row => picked(row).dataset.v);
      meta.textContent = `${v} · ${r}× · ${m}`;
      wave.style.setProperty('--act-speed', (.7 / Number(r)).toFixed(2) + 's');
      if (reduced) return;
      const id = ++typing; say.textContent = '';
      for (const ch of LINE) { if (id !== typing) return; say.textContent += ch; await wait(95 / Number(r)); }
    }
    function choose(btn) {
      btn.closest('.act-chips').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      refresh();
    }
    box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; touched = true; choose(b); });
    if (reduced) return;
    let onScreen = false, timer = 0;
    const step = () => {
      if (touched || !onScreen) return;
      const row = rows[Math.floor(Math.random() * rows.length)];
      const btns = [...row.querySelectorAll('button')].filter(b => b !== picked(row));
      choose(btns[Math.floor(Math.random() * btns.length)]);
    };
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      clearInterval(timer);
      if (onScreen && !touched) { refresh(); timer = setInterval(step, 3200); }
    }, { threshold: .4 }).observe(box);
  }

  /* chapter 03: the daily note writes itself out, line by line, the first time it comes on screen. */
  function note(box) {
    const lines = [...box.querySelectorAll('.acn-body > *, .acn-body li')];
    if (reduced) { box.classList.add('done'); return; }
    lines.forEach((el, i) => el.style.setProperty('--d', (i * .16).toFixed(2) + 's'));
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { box.classList.add('done'); io.disconnect(); } }, { threshold: .35 });
    io.observe(box);
  }

  const init = () => {
    document.querySelectorAll('[data-ac-demo]').forEach(start);
    document.querySelectorAll('[data-ac-tune]').forEach(tune);
    document.querySelectorAll('[data-ac-note]').forEach(note);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
