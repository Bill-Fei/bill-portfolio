const views = [...document.querySelectorAll('[data-view]')];
const routeLinks = [...document.querySelectorAll('[data-route-link]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reducedMotion ? 'auto' : 'smooth';
const defaultRoute = 'home';
function observeLayoutResize(target, callback) {
  let pendingFrame = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(callback);
  });
  observer.observe(target);
  return observer;
}
let replayHomeTitle = () => {};
const caseChapters = {
  workflow: [
    ['05-method', '01', '设计方法'], ['07-aui-evolution', '02', '交互演进'], ['08-aui-paradigm', '03', '服务转向'], ['06-aui-definition', '04', '设计理念'], ['09-native-interaction', '05', '自然交互'], ['09-aui-principles', '06', '设计原则'], ['10-companion-state', '07', '伴随态'], ['11-immersion-state', '08', '沉浸态'], ['11-cross-device', '09', '各端全景'], ['12-mobile-design-system', '10', '移动规范']
  ],
  paradigm: [
    ['05-why-generative-ui', '01', '为什么做生成式 UI'], ['06-aui-definition', '02', '核心矛盾'], ['07-generation-flow', '03', '生成链路'], ['08-cross-device-rendering', '04', '跨端渲染']
  ],
  aui: [
    ['10-companion-state', '10', '伴随态'], ['11-cross-device', '11', '各端全景'], ['12-in-context', '12', '原位伴随']
  ],
  legion: [
    ['01', '01', '改版目标'], ['03', '02', '设计方向'], ['04', '03', '沉浸问题'], ['05', '04', '门店类比'], ['06', '05', '设计原则'], ['07', '06', '原则落地'], ['11', '07', '视觉系统'], ['12', '08', '最终方案']
  ]
};
const legionChapterAliases = { '02': '01', '08': '07', '09': '07', '10': '11', '13': '12' };
const principleDetails = { boundaryless: '服务不被设备与页面边界截断；同一条意图可以从 Phone 延续到 Pad 与 PC。', anticipatory: '主动服务提前半步，但不越过用户；先让用户看见，再由用户确认执行。', adaptive: '内容决定界面；简单任务原位完成，复杂任务才升级为完整工作空间。' };
const evolutionDetails = { gui: ['被动交互 / 人适应系统', '用户寻找功能，界面等待操作。'], lui: ['自然交互 / 系统理解人', '用户表达意图，系统理解上下文。'], aui: ['主动交互 / 服务主动找人', '服务提前出现，界面随任务生成。'] };
const decisionDetails = { one: '利用自上而下的视觉动线，将问题置于下方、结果置于上方；层次分明，便于用户聚焦核心信息。', two: '简单任务原位完成，复杂任务再进入 App 深度处理；主动不等于打断，升级始终交给用户。' };
const companionAssets = { aipc: ['assets/shared/aui-roadmap-assets/aipc.png', 'AI PC 伴随态'], phone: ['assets/shared/aui-roadmap-assets/phone.png', 'AI 手机伴随态'], pad: ['assets/shared/aui-roadmap-assets/pad.png', 'AI 平板伴随态'], aiot: ['assets/shared/aui-roadmap-assets/aiot.png', 'AIoT 伴随态'] };
const modeDetails = { window: '用户主动与天禧交互后出现，适合从一句意图开始。', frame: '在当前应用原位出现，遵循系统分屏与尺寸逻辑，不把用户带离主任务。', platform: '天禧主动服务或提醒时出现，以轻 / 中 / 重三种介入距离承载提醒、反馈与入口引导。' };
const mobileSystemFrames = [
  { title: 'Color', label: '色彩与渐变', src: 'assets/figma-pages/12-mobile-color-3x.png?v=80', fullSrc: 'assets/figma-pages/12-mobile-color-3x.png?v=80' },
  { title: 'Voice', label: '语音交互', src: 'assets/figma-pages/12-mobile-voice-3x.png?v=80', fullSrc: 'assets/figma-pages/12-mobile-voice-3x.png?v=80' },
  { title: 'Text', label: '文本交互', src: 'assets/figma-pages/12-mobile-text-3x.png?v=84', fullSrc: 'assets/figma-pages/12-mobile-text-3x.png?v=84' },
  { title: 'Image', label: '图选交互', src: 'assets/figma-pages/12-mobile-image-3x.png?v=84', fullSrc: 'assets/figma-pages/12-mobile-image-3x.png?v=84' },
  { title: 'AI Components', label: 'AI 组件', src: 'assets/figma-pages/12-mobile-components-3x.png?v=80', fullSrc: 'assets/figma-pages/12-mobile-components-3x.png?v=80' }
];
const auiDesignFrames = [
  {
    title: 'Companion Home',
    meta: 'AUI HOME',
    alt: '天禧 AUI 首页主动聚合知识、天气与内容服务',
    ratio: 720 / 1764,
    src: 'assets/aui-marquee/04-companion-home.png?v=101'
  },
  {
    title: 'Morning Brief',
    meta: 'PROACTIVE BRIEF',
    alt: 'AUI 主动提供次日天气并协助设置出发闹钟',
    ratio: 824 / 1832,
    src: 'assets/aui-marquee/02-morning-brief.png?v=101'
  },
  {
    title: 'AI Podcast',
    meta: 'KNOWLEDGE AUDIO',
    alt: 'AI 播客基于文档、知识库或链接生成音频内容的主题选择界面',
    ratio: 1236 / 2742,
    src: 'assets/aui-marquee/07-ai-podcast.png?v=101'
  },
  {
    title: 'Travel Planning',
    meta: 'TRAVEL AGENT',
    alt: 'AUI 汇总航班、酒店与日程冲突的出差安排',
    ratio: 824 / 1832,
    src: 'assets/aui-marquee/03-travel-plan.png?v=101'
  },
  {
    title: 'Voice Composer',
    meta: 'VOICE FIRST',
    alt: '天禧 AUI 首页语音输入与实时声波反馈状态',
    ratio: 720 / 1764,
    src: 'assets/aui-marquee/05-voice-composer.png?v=101'
  },
  {
    title: 'Live Companion Call',
    meta: 'REAL-TIME COMPANION',
    alt: '天禧实时语音陪伴通话界面，支持字幕、麦克风、共享与视频控制',
    ratio: 1236 / 2742,
    src: 'assets/aui-marquee/06-live-companion-call.png?v=101'
  },
  {
    title: 'AI Image Studio',
    meta: 'GENERATIVE CREATION',
    alt: 'AI 修图首页展示创意模板、风格选择与图片生成输入',
    ratio: 1236 / 2736,
    src: 'assets/aui-marquee/08-ai-image-studio.png?v=101'
  },
  {
    title: 'Ambient Listening',
    meta: 'SYSTEM PRESENCE',
    alt: 'AUI 系统级倾听状态，主屏底部显示语音入口与我在听反馈',
    ratio: 824 / 1832,
    src: 'assets/aui-marquee/01-ambient-listening.png?v=101'
  },
  {
    title: 'Image Edit Composer',
    meta: 'MULTIMODAL EDITING',
    alt: 'AI 图片编辑界面通过灵感词、语音、图片和文本共同组织修图指令',
    ratio: 824 / 1824,
    src: 'assets/aui-marquee/09-image-edit-composer.png?v=101'
  }
];

function initSpectralClouds() {
  const canvas = document.querySelector('#spectral-clouds');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const palette = [
    [69, 94, 135],
    [91, 119, 153],
    [113, 91, 139],
    [139, 165, 185],
    [87, 116, 127]
  ];
  const clusters = [
    [0.79, 0.22, 0.18],
    [0.65, 0.46, 0.24],
    [0.84, 0.59, 0.25],
    [0.58, 0.78, 0.19],
    [0.96, 0.39, 0.17]
  ];
  let seed = 7281;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const clouds = Array.from({ length: 54 }, (_, index) => {
    const cluster = clusters[index % clusters.length];
    const angle = random() * Math.PI * 2;
    const spread = Math.sqrt(random()) * cluster[2];
    return {
      x: cluster[0] + Math.cos(angle) * spread,
      y: cluster[1] + Math.sin(angle) * spread * 0.72,
      radius: 0.065 + random() * 0.115,
      stretch: 0.48 + random() * 0.48,
      rotation: (random() - 0.5) * 0.45,
      phase: random() * Math.PI * 2,
      speed: 0.45 + random() * 0.65,
      depth: 0.42 + random() * 0.58,
      color: palette[Math.floor(random() * palette.length)]
    };
  });

  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let lastFrame = 0;
  let animationFrame = 0;

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const mobile = bounds.width < 760;
    const quality = mobile ? 0.56 : 0.72;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
    width = Math.max(1, Math.round(bounds.width * quality * pixelRatio));
    height = Math.max(1, Math.round(bounds.height * quality * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      draw(performance.now(), true);
    }
  }

  function ellipseGlow(x, y, radius, stretch, rotation, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, stretch);
    const gradient = ctx.createRadialGradient(-radius * 0.15, -radius * 0.12, radius * 0.04, 0, 0, radius);
    gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`);
    gradient.addColorStop(0.34, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.82})`);
    gradient.addColorStop(0.72, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.22})`);
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function draw(time, force = false) {
    if (!width || !height) return;
    if (!force && (document.hidden || document.body.dataset.route !== 'home')) return;

    const slowTime = reducedMotion ? 0 : time * 0.000055;
    pointerX += (targetPointerX - pointerX) * 0.018;
    pointerY += (targetPointerY - pointerY) * 0.018;
    ctx.clearRect(0, 0, width, height);

    const atmosphere = ctx.createRadialGradient(width * 0.76, height * 0.48, 0, width * 0.76, height * 0.48, width * 0.62);
    atmosphere.addColorStop(0, 'rgba(88, 109, 146, .12)');
    atmosphere.addColorStop(0.42, 'rgba(52, 68, 100, .055)');
    atmosphere.addColorStop(1, 'rgba(5, 7, 11, 0)');
    ctx.fillStyle = atmosphere;
    ctx.fillRect(0, 0, width, height);

    const count = width < 700 ? 32 : clouds.length;
    ctx.globalCompositeOperation = 'screen';
    for (let index = 0; index < count; index += 1) {
      const cloud = clouds[index];
      const driftX = Math.sin(slowTime * cloud.speed + cloud.phase) * 0.027;
      const driftY = Math.cos(slowTime * cloud.speed * 0.72 + cloud.phase) * 0.018;
      const x = (cloud.x + driftX + pointerX * (0.006 + cloud.depth * 0.008)) * width;
      const y = (cloud.y + driftY + pointerY * (0.005 + cloud.depth * 0.006)) * height;
      const radius = cloud.radius * Math.max(width, height) * (0.88 + Math.sin(slowTime * 0.9 + cloud.phase) * 0.06);
      const edgeFade = Math.max(0.25, Math.min(1, (cloud.x - 0.28) / 0.28));
      ellipseGlow(x, y, radius, cloud.stretch, cloud.rotation, cloud.color, (0.07 + cloud.depth * 0.10) * edgeFade);
    }

    ctx.globalCompositeOperation = 'soft-light';
    for (let index = 3; index < count; index += 7) {
      const cloud = clouds[index];
      const x = (cloud.x + Math.sin(slowTime * cloud.speed + cloud.phase) * 0.02) * width;
      const y = (cloud.y + Math.cos(slowTime * 0.7 + cloud.phase) * 0.014) * height;
      const silver = [180, 202, 218];
      ellipseGlow(x, y, cloud.radius * Math.max(width, height) * 0.57, cloud.stretch * 0.72, cloud.rotation, silver, 0.10 * cloud.depth);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function tick(time) {
    const frameInterval = 1000 / 30;
    if (reducedMotion) {
      draw(0, true);
      return;
    }
    if (time - lastFrame >= frameInterval) {
      draw(time);
      lastFrame = time;
    }
    animationFrame = requestAnimationFrame(tick);
  }

  window.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 760) return;
    targetPointerX = event.clientX / window.innerWidth - 0.5;
    targetPointerY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) draw(performance.now(), true);
  });
  window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });

  resize();
  if (reducedMotion) draw(0, true);
  else animationFrame = requestAnimationFrame(tick);
}

function parseHash() {
  const raw = (window.location.hash.replace(/^#/, '') || defaultRoute).split('?')[0];
  const parts = raw.split('/').filter(Boolean);
  const requestedRoute = parts[0] || defaultRoute;
  if (requestedRoute === 'index') return { route: 'home', chapter: 'works' };
  if (requestedRoute === 'career') return { route: 'home', chapter: 'career' };
  if (requestedRoute === 'contact') return { route: 'home', chapter: 'contact' };
  if (requestedRoute === 'about') return { route: 'home', chapter: '' };
  return { route: views.some((view) => view.dataset.view === requestedRoute) ? requestedRoute : defaultRoute, chapter: parts[1] || '' };
}
function renderCaseNav(view, route, activeChapter) {
  const nav = view.querySelector('[data-case-nav]');
  if (!nav || !caseChapters[route]) return;
  nav.innerHTML = `<p>ON THIS CASE</p>${caseChapters[route].map(([id, num, label]) => `<a class="${id === activeChapter ? 'active' : ''}" href="#${view.dataset.view}/${id}"><span>${num}</span>${label}<b>↗</b></a>`).join('')}`;
}
function setNavLinkState(link, isActive) {
  link.classList.toggle('active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
}
function setHomeNavState(section = '') {
  routeLinks.forEach((link) => {
    const linkRoute = link.dataset.routeLink;
    setNavLinkState(link,
      (linkRoute === 'home' && !section)
      || (linkRoute === 'index' && (section === 'works' || section === 'archive'))
      || (linkRoute === 'career' && section === 'career')
    );
  });
}

function syncAuiFilmPlayback() {
  const caseView = document.querySelector('.case-aui-one');
  const heroFilm = caseView?.querySelector('[data-aui-hero-film]');
  const fullFilm = caseView?.querySelector('[data-aui-full-film]');
  const caseIsActive = caseView?.classList.contains('is-active');
  const heroIsVisible = heroFilm?.dataset.inViewport !== 'false';
  const canPlayHero = caseIsActive && heroIsVisible && !document.hidden && !reducedMotion;

  if (heroFilm) {
    if (canPlayHero) {
      heroFilm.muted = true;
      heroFilm.defaultMuted = true;
      const playPromise = heroFilm.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    } else {
      heroFilm.pause();
    }
  }
  if (fullFilm && (!caseIsActive || document.hidden)) fullFilm.pause();
}

function jumpToPageTop() {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
}

function setRoute() {
  if (document.querySelector('#image-lightbox')?.classList.contains('is-open')) closeLightbox();
  const { route, chapter } = parseHash();
  const target = views.find((view) => view.dataset.view === route) || views[0];
  document.title = route.startsWith('case-') ? `${target.dataset.caseTheme === 'blue' ? 'Tianxi AUI 1.0 Experience Design' : target.dataset.caseTheme === 'purple' ? 'Tianxi Generative UI' : target.dataset.caseTheme === 'legion' ? 'Legion Zone Gaming Experience' : 'Tianxi AUI'} · Bill Wang` : 'Bill Wang · AI Native Experience Design';
  views.forEach((view) => view.classList.toggle('is-active', view === target));
  const homeSection = route === 'home' ? chapter : '';
  if (route === 'home') setHomeNavState(homeSection);
  else routeLinks.forEach((link) => setNavLinkState(link, (route.startsWith('case-') || route === 'archive') && link.dataset.routeLink === 'index'));
  document.body.dataset.route = route;
  document.querySelectorAll('[data-view] video').forEach((video) => {
    if (video.closest('[data-view]') !== target) video.pause();
  });
  const legionHero = target.querySelector('.legion-cover-media video');
  if (legionHero && !reducedMotion && !document.hidden) legionHero.play()?.catch(() => {});
  if (route !== 'case-legion') document.querySelector('.legion-supplement-video video')?.pause();
  syncAuiFilmPlayback();
  let actualChapter = route === 'case-legion' ? (legionChapterAliases[chapter] || chapter) : chapter;
  if (target.classList.contains('case-view')) {
    const navKey = target.querySelector('[data-case-nav]')?.dataset.caseNav;
    const bodyKey = target.querySelector('[data-case-body]')?.dataset.caseBody;
    const caseKey = navKey || bodyKey;
    const chapters = caseChapters[caseKey] || [];
    const legionSections = ['overview', 'pc', 'motion', 'phone'];
    if (!chapters.some(([id]) => id === actualChapter) && !(caseKey === 'legion' && legionSections.includes(actualChapter))) actualChapter = target.dataset.caseStart || chapters[0]?.[0];
    const isScrollCase = target.classList.contains('case-scroll');
    target.querySelectorAll('.chapter-panel').forEach((panel) => panel.classList.toggle('is-current', isScrollCase || panel.dataset.chapter === actualChapter));
    renderCaseNav(target, caseKey, actualChapter);
    target.querySelector('.case-body')?.setAttribute('data-current-chapter', actualChapter);
    if (isScrollCase && chapter) target.dataset.scrollTarget = actualChapter;
    else delete target.dataset.scrollTarget;
  }
  const embeddedTarget = route === 'home'
    ? (chapter === 'works' ? document.querySelector('#selected-works') : chapter === 'career' ? document.querySelector('#career') : ['contact', 'archive'].includes(chapter) ? document.querySelector('#contact') : null)
    : null;
  if (!embeddedTarget) jumpToPageTop();
  requestAnimationFrame(() => {
    if (embeddedTarget) {
      embeddedTarget.scrollIntoView({ block: 'start', behavior: 'auto' });
      setTimeout(() => embeddedTarget.scrollIntoView({ block: 'start', behavior: 'auto' }), 80);
    } else if (target.classList.contains('case-scroll') && target.dataset.scrollTarget) {
      const section = target.querySelector(`[data-scroll-chapter="${target.dataset.scrollTarget}"]`);
      const destination = section?.closest('[data-legion-cylinder]') || section;
      if (destination) requestAnimationFrame(() => destination.scrollIntoView({ block: 'start', behavior: 'instant' }));
      delete target.dataset.scrollTarget;
    }
    target.querySelectorAll('.reveal').forEach((node, index) => {
      if (reducedMotion) node.classList.add('is-visible');
      else setTimeout(() => node.classList.add('is-visible'), Math.min(index * 35, 240));
    });
    if (route === 'home') setTimeout(replayHomeTitle, reducedMotion ? 0 : 90);
  });
}

function wireAuiFilms() {
  const heroFilm = document.querySelector('[data-aui-hero-film]');
  const heroShell = heroFilm?.closest('.aui-hero-film');
  const heroSource = heroFilm?.querySelector('[data-aui-hero-source]');
  const caption = heroShell?.querySelector('[data-aui-film-caption]');
  const options = {
    preview: {
      src: 'assets/video/aui-hero-intent-loop.mp4',
      poster: 'assets/video/aui-hero-intent-poster.jpg',
      title: '从一句意图，到主动服务',
      meta: '06s PREVIEW → FULL EFFECT · 自动切换',
      label: '从用户意图到 AUI 主动服务的项目影片预告',
      loop: true,
      progressDuration: 6
    },
    effect: {
      src: 'assets/video/aui-effect-showcase.mp4',
      poster: 'assets/video/aui-effect-showcase-poster.jpg',
      title: 'AUI 让服务主动抵达',
      meta: '00:10 AUI EFFECT · 完整播放',
      label: 'AUI 效果展示视频，完整播放',
      loop: false,
      progressDuration: 10
    }
  };
  const buttons = [...(heroShell?.querySelectorAll('[data-aui-film-option]') || [])];
  let transitionPending = false;
  let transitionTimer = 0;
  let progressFrame = 0;
  let playRetryTimer = 0;
  const playHeroWhenReady = () => {
    if (!heroFilm || reducedMotion || document.hidden
      || document.body.dataset.route !== 'case-workflow'
      || heroFilm.dataset.inViewport === 'false') return;
    window.clearTimeout(playRetryTimer);
    heroFilm.muted = true;
    heroFilm.defaultMuted = true;
    if (heroFilm.readyState < 3) {
      playRetryTimer = window.setTimeout(playHeroWhenReady, 180);
      return;
    }
    const playPromise = heroFilm.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  };
  const stopFilmProgress = () => {
    if (progressFrame) window.cancelAnimationFrame(progressFrame);
    progressFrame = 0;
  };
  const updateFilmProgress = () => {
    if (!heroFilm) return;
    const key = heroFilm.dataset.auiFilm || 'preview';
    const option = options[key] || options.preview;
    const mediaDuration = key === 'preview'
      ? option.progressDuration
      : (Number.isFinite(heroFilm.duration) && heroFilm.duration > 0 ? heroFilm.duration : option.progressDuration);
    const progress = Math.min(1, Math.max(0, (heroFilm.currentTime || 0) / mediaDuration));
    heroShell?.style.setProperty('--aui-film-progress', progress.toFixed(4));
    buttons.forEach((button) => {
      const active = button.dataset.auiFilmOption === key;
      button.classList.toggle('is-counting-down', active && !heroFilm.paused && !document.hidden);
    });
  };
  const filmProgressTick = () => {
    updateFilmProgress();
    if (heroFilm && !heroFilm.paused && !document.hidden) progressFrame = window.requestAnimationFrame(filmProgressTick);
    else progressFrame = 0;
  };
  const startFilmProgress = () => {
    if (!progressFrame) progressFrame = window.requestAnimationFrame(filmProgressTick);
  };
  const applyOption = (key, shouldPlay = true) => {
    const option = options[key] || options.preview;
    if (!heroFilm || !heroSource) return;
    stopFilmProgress();
    heroFilm.pause();
    heroFilm.currentTime = 0;
    heroSource.src = option.src;
    heroFilm.poster = option.poster;
    heroFilm.loop = option.loop;
    heroFilm.load();
    heroFilm.dataset.auiFilm = key;
    updateFilmProgress();
    if (heroShell) heroShell.setAttribute('aria-label', option.label);
    if (caption) {
      const title = caption.querySelector('span');
      const meta = caption.querySelector('small');
      if (title) title.textContent = option.title;
      if (meta) meta.textContent = option.meta;
    }
    buttons.forEach((button) => {
      const active = button.dataset.auiFilmOption === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    if (shouldPlay && !reducedMotion) playHeroWhenReady();
  };
  const transitionTo = (key, shouldPlay = true) => {
    if (!heroFilm || !heroShell || heroFilm.dataset.auiFilm === key || transitionPending) return;
    transitionPending = true;
    heroShell.classList.add('is-film-transitioning');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      applyOption(key, shouldPlay);
      heroShell.classList.remove('is-film-transitioning');
      transitionPending = false;
    }, reducedMotion ? 0 : 360);
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.auiFilmOption;
    if (heroFilm?.dataset.auiFilm === key) {
      if (heroFilm.ended) heroFilm.currentTime = 0;
      playHeroWhenReady();
      return;
    }
    transitionTo(key);
  }));
  heroFilm?.addEventListener('timeupdate', () => {
    updateFilmProgress();
    startFilmProgress();
    if (heroFilm.dataset.auiFilm === 'preview' && heroFilm.currentTime >= options.preview.progressDuration) transitionTo('effect');
  });
  ['loadedmetadata', 'durationchange', 'seeking', 'seeked'].forEach((eventName) => {
    heroFilm?.addEventListener(eventName, updateFilmProgress);
  });
  ['loadeddata', 'canplay'].forEach((eventName) => {
    heroFilm?.addEventListener(eventName, () => {
      updateFilmProgress();
      syncAuiFilmPlayback();
      if (document.body.dataset.route === 'case-workflow' && heroFilm.dataset.inViewport !== 'false') playHeroWhenReady();
    });
  });
  heroFilm?.addEventListener('play', startFilmProgress);
  heroFilm?.addEventListener('pause', () => {
    stopFilmProgress();
    updateFilmProgress();
  });
  heroFilm?.addEventListener('ended', () => {
    stopFilmProgress();
    updateFilmProgress();
    if (heroFilm.dataset.auiFilm === 'effect') transitionTo('preview');
  });
  if (heroFilm && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      heroFilm.dataset.inViewport = entry.isIntersecting ? 'true' : 'false';
      syncAuiFilmPlayback();
      updateFilmProgress();
      if (entry.isIntersecting) playHeroWhenReady();
    }, { threshold: .12 });
    observer.observe(heroFilm);
  }
  applyOption(heroFilm?.dataset.auiFilm || 'effect', false);
  updateFilmProgress();
  window.setTimeout(() => {
    if (document.body.dataset.route === 'case-workflow') playHeroWhenReady();
  }, 0);
  document.addEventListener('visibilitychange', () => {
    syncAuiFilmPlayback();
    if (document.hidden) stopFilmProgress();
    else if (heroFilm && !heroFilm.paused) startFilmProgress();
    updateFilmProgress();
  });
}

function setScrollCaseNavActive(view, chapterId, updateHistory = true) {
  const nav = view.querySelector('[data-case-nav]');
  let activeLink = null;
  nav?.querySelectorAll('a').forEach((link) => {
    const active = link.getAttribute('href') === `#${view.dataset.view}/${chapterId}`;
    link.classList.toggle('active', active);
    if (active) {
      activeLink = link;
      link.setAttribute('aria-current', 'location');
    }
    else link.removeAttribute('aria-current');
  });
  if (nav && activeLink && nav.scrollWidth > nav.clientWidth) {
    nav.scrollTo({
      left: Math.max(0, activeLink.offsetLeft - (nav.clientWidth - activeLink.offsetWidth) / 2),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }
  view.querySelector('.case-body')?.setAttribute('data-current-chapter', chapterId);
  if (updateHistory && document.body.dataset.route === view.dataset.view) {
    history.replaceState(null, '', `#${view.dataset.view}/${chapterId}`);
  }
}

function initScrollCaseNavigation() {
  const caseViews = [...document.querySelectorAll('.case-scroll')];
  caseViews.forEach((view) => {
    view.addEventListener('click', (event) => {
      const link = event.target.closest('[data-case-nav] a, .legion-contents a');
      if (!link || !view.contains(link)) return;
      const chapterId = link.getAttribute('href')?.split('/')[1];
      const section = chapterId && view.querySelector(`[data-scroll-chapter="${chapterId}"]`);
      if (!section) return;
      event.preventDefault();
      const accordion = section.closest('[data-legion-cylinder]');
      if (accordion) {
        setScrollCaseNavActive(view, chapterId, false);
        section.focus({ preventScroll: true });
        accordion.scrollIntoView({ behavior: link.closest('.legion-contents') ? 'instant' : scrollBehavior, block: 'start' });
        return;
      }
      setScrollCaseNavActive(view, chapterId);
      section.scrollIntoView({ behavior: link.closest('.legion-contents') ? 'instant' : scrollBehavior, block: 'start' });
    });

    const accordion = view.querySelector('[data-legion-cylinder]');
    const accordionLead = accordion?.querySelector('[data-scroll-chapter]');
    const sections = [...view.querySelectorAll('[data-scroll-chapter]')]
      .filter((section) => !accordion?.contains(section) || section === accordionLead);
    if (!sections.length) return;
    let activeId = '';
    const updateByReadingLine = () => {
      if (document.body.dataset.route !== view.dataset.view) return;
      const readingLine = Math.max(118, window.innerHeight * .24);
      const firstSection = sections[0];
      if (firstSection.getBoundingClientRect().top > readingLine) {
        activeId = '';
        return;
      }
      let current = firstSection;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section;
        else break;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections.at(-1);
      }
      const id = current === accordionLead
        ? accordion.querySelector('[data-cylinder-card].is-active')?.dataset.scrollChapter || current.dataset.scrollChapter
        : current.dataset.scrollChapter;
      if (id && id !== activeId) {
        activeId = id;
        setScrollCaseNavActive(view, id);
      }
    };
    let frame = 0;
    window.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; updateByReadingLine(); });
    }, { passive: true });
    window.addEventListener('resize', updateByReadingLine, { passive: true });
    window.addEventListener('hashchange', () => {
      activeId = '';
      requestAnimationFrame(updateByReadingLine);
    });
  });
}

function activateWithin(group, button) { group?.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button)); }
function initMobileSystemCarousel() {
  const root = document.querySelector('[data-mobile-system-showcase]');
  const viewport = root?.querySelector('[data-mobile-system-viewport]');
  const status = root?.querySelector('[data-mobile-system-status]');
  if (!root || !viewport || !status) return;

  const slides = mobileSystemFrames.map(({ title, label, src, fullSrc }, index) => {
    const slide = document.createElement('article');
    slide.className = 'mobile-system-slide';
    slide.dataset.index = String(index);

    const artwork = document.createElement('div');
    artwork.className = 'mobile-system-slide-artwork';

    const image = document.createElement('img');
    image.className = 'mobile-system-slide-board';
    image.src = fullSrc;
    image.dataset.lightboxSrc = fullSrc;
    image.dataset.lightboxGroup = 'mobile-system-pages';
    image.sizes = '(max-width: 620px) 77vw, (max-width: 900px) 54vw, 460px';
    image.alt = `AUI 移动端设计规范：${label}`;
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `查看${label}高清大图`);
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    artwork.appendChild(image);

    const caption = document.createElement('div');
    caption.className = 'mobile-system-slide-caption';
    caption.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><b>${title}</b><small>${label}</small>`;

    const card = document.createElement('div');
    card.className = 'mobile-system-slide-card';
    card.append(artwork, caption);
    slide.appendChild(card);
    viewport.appendChild(slide);
    return slide;
  });

  let current = 0;
  let autoTimer = 0;
  let isInView = false;
  const schedule = () => {
    window.clearTimeout(autoTimer);
    if (reducedMotion || document.hidden || !isInView) return;
    autoTimer = window.setTimeout(() => render(current + 1, 1), 4600);
  };
  const render = (next, direction = 1) => {
    current = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      let offset = index - current;
      const midpoint = Math.floor(slides.length / 2);
      if (offset > midpoint) offset -= slides.length;
      if (offset < -midpoint) offset += slides.length;
      const isHidden = Math.abs(offset) > 1;
      slide.classList.toggle('is-active', offset === 0);
      slide.classList.toggle('is-prev', offset === -1);
      slide.classList.toggle('is-next', offset === 1);
      slide.classList.toggle('is-hidden', isHidden);
      slide.classList.toggle('is-hidden-left', offset < -1);
      slide.classList.toggle('is-hidden-right', offset > 1);
      slide.style.setProperty('--slide-direction', direction);
      slide.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
    });
    const { title, label } = mobileSystemFrames[current];
    status.textContent = `${String(current + 1).padStart(2, '0')} — ${title.toUpperCase()} / ${label}`;
    schedule();
  };

  root.querySelector('[data-mobile-system-prev]')?.addEventListener('click', () => render(current - 1, -1));
  root.querySelector('[data-mobile-system-next]')?.addEventListener('click', () => render(current + 1, 1));
  viewport.addEventListener('click', (event) => {
    const slide = event.target.closest('.mobile-system-slide');
    if (!slide || slide.classList.contains('is-active')) return;
    if (slide.classList.contains('is-prev')) {
      event.preventDefault();
      event.stopPropagation();
      render(current - 1, -1);
    } else if (slide.classList.contains('is-next')) {
      event.preventDefault();
      event.stopPropagation();
      render(current + 1, 1);
    }
  });
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      render(current - 1, -1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      render(current + 1, 1);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      const focusedSlide = event.target.closest('.mobile-system-slide');
      event.preventDefault();
      if (focusedSlide?.classList.contains('is-prev')) render(current - 1, -1);
      else if (focusedSlide?.classList.contains('is-next')) render(current + 1, 1);
      else {
        const image = viewport.querySelector('.mobile-system-slide.is-active img');
        if (image) openLightbox(image);
      }
    }
  });
  root.addEventListener('pointerenter', () => window.clearTimeout(autoTimer));
  root.addEventListener('pointerleave', schedule);
  document.addEventListener('visibilitychange', schedule);
  const observer = new IntersectionObserver(([entry]) => {
    isInView = entry.isIntersecting && entry.intersectionRatio > 0.18;
    if (isInView) schedule();
    else window.clearTimeout(autoTimer);
  }, { threshold: [0, 0.18, 0.5] });
  observer.observe(root);
  viewport.tabIndex = 0;
  render(0);
}


function initAuiDesignMarquee() {
  const root = document.querySelector('[data-aui-design-marquee]');
  const stage = root?.querySelector('[data-aui-marquee-stage]');
  const track = root?.querySelector('[data-aui-marquee-track]');
  if (!root || !stage || !track || !auiDesignFrames.length) return;

  const cards = [...auiDesignFrames, ...auiDesignFrames].map((frame, index) => {
    const figure = document.createElement('figure');
    figure.className = 'aui-design-marquee-card';
    figure.setAttribute('aria-hidden', index >= auiDesignFrames.length ? 'true' : 'false');
    figure.style.setProperty('--frame-ratio', String(frame.ratio || .445));

    const image = document.createElement('img');
    image.src = frame.src;
    image.alt = index < auiDesignFrames.length ? frame.alt : '';
    image.loading = index < 3 ? 'eager' : 'lazy';
    image.decoding = 'async';
    image.draggable = false;

    const caption = document.createElement('figcaption');
    caption.innerHTML = `<span>${String((index % auiDesignFrames.length) + 1).padStart(2, '0')}</span><b>${frame.title}</b><small>${frame.meta}</small>`;
    figure.append(image, caption);
    track.appendChild(figure);
    return figure;
  });

  let position = 0;
  let loopWidth = 0;
  let velocity = 0;
  let pointerId = null;
  let lastPointerX = 0;
  let lastPointerTime = 0;
  let isDragging = false;
  let isHovered = false;
  let isInView = false;
  let animationFrame = 0;
  let lastFrameTime = 0;
  const autoSpeed = -0.46;

  const measure = () => {
    const first = cards[0];
    const duplicate = cards[auiDesignFrames.length];
    if (!first || !duplicate) return;
    loopWidth = duplicate.offsetLeft - first.offsetLeft;
    normalizePosition();
    render();
  };
  const normalizePosition = () => {
    if (!loopWidth) return;
    while (position <= -loopWidth) position += loopWidth;
    while (position > 0) position -= loopWidth;
  };
  const render = () => {
    track.style.transform = `translate3d(${position}px, -50%, 0)`;
  };
  const stopAnimation = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrameTime = 0;
  };
  const tick = (time) => {
    animationFrame = 0;
    if (!isInView || document.hidden) return;
    const frameScale = lastFrameTime ? Math.min(2.4, (time - lastFrameTime) / (1000 / 60)) : 1;
    lastFrameTime = time;

    if (!isDragging) {
      if (Math.abs(velocity) > 0.08) {
        position += velocity * frameScale;
        velocity *= Math.pow(0.945, frameScale);
      } else {
        velocity = 0;
        if (!reducedMotion && !isHovered) position += autoSpeed * frameScale;
      }
      normalizePosition();
      render();
    }
    animationFrame = requestAnimationFrame(tick);
  };
  const startAnimation = () => {
    if (!animationFrame && isInView && !document.hidden) animationFrame = requestAnimationFrame(tick);
  };
  const finishDrag = (event) => {
    if (!isDragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
    if (pointerId !== null && stage.hasPointerCapture?.(pointerId)) stage.releasePointerCapture(pointerId);
    pointerId = null;
    startAnimation();
  };

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || isDragging) return;
    pointerId = event.pointerId;
    isDragging = true;
    velocity = 0;
    lastPointerX = event.clientX;
    lastPointerTime = performance.now();
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(pointerId);
  });
  stage.addEventListener('pointermove', (event) => {
    if (!isDragging || event.pointerId !== pointerId) return;
    const now = performance.now();
    const deltaX = event.clientX - lastPointerX;
    const deltaTime = Math.max(8, now - lastPointerTime);
    position += deltaX;
    velocity = Math.max(-28, Math.min(28, (deltaX / deltaTime) * (1000 / 60)));
    lastPointerX = event.clientX;
    lastPointerTime = now;
    normalizePosition();
    render();
  });
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
  stage.addEventListener('lostpointercapture', (event) => {
    if (isDragging && event.pointerId === pointerId) finishDrag(event);
  });
  stage.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') isHovered = true;
  });
  stage.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') isHovered = false;
  });
  stage.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    velocity = event.key === 'ArrowLeft' ? 9 : -9;
    startAnimation();
  });
  stage.addEventListener('dragstart', (event) => event.preventDefault());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });
  const observer = new IntersectionObserver(([entry]) => {
    isInView = entry.isIntersecting && entry.intersectionRatio > 0.08;
    if (isInView) startAnimation();
    else stopAnimation();
  }, { threshold: [0, 0.08, 0.35] });
  observer.observe(root);

  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
  else window.addEventListener('resize', measure, { passive: true });
  requestAnimationFrame(measure);
}


function wireInteractiveStates() {
  document.addEventListener('click', (event) => {
    const principle = event.target.closest('[data-principle]');
    if (principle) { activateWithin(principle.closest('.principle-tabs'), principle); const out = document.querySelector('#principle-detail'); if (out) out.textContent = principleDetails[principle.dataset.principle]; return; }
    const evolution = event.target.closest('[data-evolution]');
    if (evolution) { activateWithin(evolution.closest('.evolution-tabs'), evolution); const [title, body] = evolutionDetails[evolution.dataset.evolution]; const out = document.querySelector('#evolution-output'); if (out) out.innerHTML = `<b>${title}</b><p>${body}</p>`; return; }
    const decision = event.target.closest('[data-decision]');
    if (decision) { activateWithin(decision.closest('.decision-switch'), decision); const out = decision.closest('.chapter-panel')?.querySelector('.decision-output'); if (out) out.textContent = decisionDetails[decision.dataset.decision]; return; }
    const companion = event.target.closest('[data-companion]');
    if (companion) { activateWithin(companion.closest('.companion-list'), companion); const asset = companionAssets[companion.dataset.companion]; const image = document.querySelector('#companion-visual'); if (image && asset) { image.src = asset[0]; image.alt = asset[1]; } return; }
    const mode = event.target.closest('[data-device-mode]');
    if (mode) { activateWithin(mode.closest('.device-mode-grid'), mode); const out = document.querySelector('#mode-output'); if (out) out.textContent = modeDetails[mode.dataset.deviceMode]; return; }
    const supplementButton = event.target.closest('.legion-supplement-zoom');
    if (supplementButton) { openLightbox(supplementButton.querySelector('img')); return; }
    const image = event.target.closest('.chapter-image img, .aui-figma-frame img, .proof-image img, .large-proof img, .presence-visual img, .about-focus img, .legion-figure img, .mobile-system-slide-board, .gen-component-translation-stage img, .gen-component-library-stage img, .gen-implementation-output img');
    if (image) openLightbox(image);
  });
}

function initSideRays() {
  const activeRoute = document.body.dataset.route || parseHash().route;
  const rayScenes = [
    {
      canvas: document.querySelector('#side-rays-canvas'),
      containerSelector: '.side-rays-container',
      route: 'home',
      minWidth: 901,
      maxPixelRatio: 1.35,
      fps: 30,
      speed: 0.46,
      color1: [0.831, 0.886, 0.957],
      color2: [0.463, 0.435, 0.612],
      intensity: 2.05,
      spread: 1.62,
      tilt: -10,
      saturation: 0.68,
      blend: 0.64,
      falloff: 1.82,
      opacity: 0.78
    },
    {
      canvas: document.querySelector('#gen-hero-side-rays'),
      containerSelector: '.gen-hero-laser',
      route: 'case-paradigm',
      minWidth: 0,
      maxPixelRatio: window.innerWidth <= 700 ? 1 : 1.35,
      fps: window.innerWidth <= 700 ? 24 : 30,
      speed: 2.5,
      color1: [234 / 255, 179 / 255, 8 / 255],
      color2: [150 / 255, 200 / 255, 255 / 255],
      intensity: 2,
      spread: 2,
      tilt: 0,
      saturation: 1.5,
      blend: 0.75,
      falloff: 1.6,
      opacity: 1
    }
  ];

  rayScenes.forEach(config => {
  const canvas = config.canvas;
  if (!canvas || canvas.dataset.sideRaysInitialized === 'true' || activeRoute !== config.route || window.innerWidth < config.minWidth) return;
  canvas.dataset.sideRaysInitialized = 'true';

  const container = canvas.closest(config.containerSelector);
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) {
    container?.classList.add('is-unavailable');
    return;
  }

  const vertexSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision highp float;

    uniform float iTime;
    uniform vec2 iResolution;
    uniform float iSpeed;
    uniform vec3 iRayColor1;
    uniform vec3 iRayColor2;
    uniform float iIntensity;
    uniform float iSpread;
    uniform float iFlipX;
    uniform float iFlipY;
    uniform float iTilt;
    uniform float iSaturation;
    uniform float iBlend;
    uniform float iFalloff;
    uniform float iOpacity;

    const float PI = 3.14159265;

    mat2 rotate2d(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat2(c, -s, s, c);
    }

    float rayStrength(
      vec2 raySource,
      vec2 rayRefDirection,
      vec2 coord,
      float width,
      float seedA,
      float seedB,
      float speed
    ) {
      vec2 sourceToCoord = coord - raySource;
      float distanceFromSource = length(sourceToCoord);
      vec2 direction = normalize(sourceToCoord);
      float alignment = clamp(dot(direction, normalize(rayRefDirection)), -1.0, 1.0);
      float angle = acos(alignment);
      float beam = exp(-pow(angle / width, 2.0));
      float innerShaft = exp(-pow(angle / (width * 0.34), 2.0));
      float movement =
        0.80 +
        0.11 * sin(angle * seedA + iTime * speed) +
        0.09 * cos(distanceFromSource * seedB - iTime * speed * 0.28);
      float distanceFade = exp(-distanceFromSource * (0.32 + iFalloff * 0.08));
      return (beam * 0.72 + innerShaft * 0.58) * movement * distanceFade;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
      if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

      vec2 uv = fragCoord / iResolution;
      float aspect = iResolution.x / max(iResolution.y, 1.0);
      vec2 coord = vec2(uv.x * aspect, uv.y);
      vec2 rayPos = vec2(1.08 * aspect, 1.12);

      float tiltRad = iTilt * PI / 180.0;
      float separation = clamp(iSpread, 0.5, 2.5);
      vec2 rayRefDir1 = rotate2d(tiltRad) * normalize(vec2(-0.96 * aspect, -0.56 - separation * 0.035));
      vec2 rayRefDir2 = rotate2d(tiltRad) * normalize(vec2(-0.58 * aspect, -0.92 + separation * 0.025));

      float ray1 = rayStrength(
        rayPos, rayRefDir1, coord,
        0.22 + separation * 0.014,
        36.2214, 7.4, iSpeed
      );
      float ray2 = rayStrength(
        rayPos, rayRefDir2, coord,
        0.18 + separation * 0.012,
        22.3991, 6.2, iSpeed * 0.44
      );

      vec3 color =
        iRayColor1 * ray1 * (1.0 - iBlend) +
        iRayColor2 * ray2 * iBlend;

      float sourceGlow = exp(-length(coord - rayPos) * 3.2) * 0.24;
      color += mix(iRayColor1, iRayColor2, iBlend) * sourceGlow;
      color *= iIntensity;

      float gray = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(gray), color, iSaturation);
      color = 1.0 - exp(-color * 1.18);

      /* Protect the identity and title while allowing the shafts to reach mid-frame. */
      float titleSafeFade = smoothstep(0.12, 0.47, uv.x);
      float edgeFade = smoothstep(0.0, 0.08, uv.y) * (1.0 - smoothstep(0.93, 1.0, uv.y));
      color *= mix(0.18, 1.0, titleSafeFade) * edgeFade;

      float alpha = clamp(max(color.r, max(color.g, color.b)) * iOpacity, 0.0, 0.92);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'Unable to compile Side Rays shader.');
    }
    return shader;
  };

  let program;
  try {
    program = gl.createProgram();
    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Unable to link Side Rays shader.');
    }
  } catch (error) {
    console.warn('Side Rays unavailable:', error);
    container?.classList.add('is-unavailable');
    return;
  }

  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time: gl.getUniformLocation(program, 'iTime'),
    resolution: gl.getUniformLocation(program, 'iResolution'),
    speed: gl.getUniformLocation(program, 'iSpeed'),
    color1: gl.getUniformLocation(program, 'iRayColor1'),
    color2: gl.getUniformLocation(program, 'iRayColor2'),
    intensity: gl.getUniformLocation(program, 'iIntensity'),
    spread: gl.getUniformLocation(program, 'iSpread'),
    flipX: gl.getUniformLocation(program, 'iFlipX'),
    flipY: gl.getUniformLocation(program, 'iFlipY'),
    tilt: gl.getUniformLocation(program, 'iTilt'),
    saturation: gl.getUniformLocation(program, 'iSaturation'),
    blend: gl.getUniformLocation(program, 'iBlend'),
    falloff: gl.getUniformLocation(program, 'iFalloff'),
    opacity: gl.getUniformLocation(program, 'iOpacity')
  };

  gl.uniform1f(uniforms.speed, config.speed);
  gl.uniform3f(uniforms.color1, ...config.color1);
  gl.uniform3f(uniforms.color2, ...config.color2);
  gl.uniform1f(uniforms.intensity, config.intensity);
  gl.uniform1f(uniforms.spread, config.spread);
  gl.uniform1f(uniforms.flipX, 0.0);
  gl.uniform1f(uniforms.flipY, 0.0);
  gl.uniform1f(uniforms.tilt, config.tilt);
  gl.uniform1f(uniforms.saturation, config.saturation);
  gl.uniform1f(uniforms.blend, config.blend);
  gl.uniform1f(uniforms.falloff, config.falloff);
  gl.uniform1f(uniforms.opacity, config.opacity);

  gl.clearColor(0, 0, 0, 0);
  gl.disable(gl.BLEND);

  let width = 1;
  let height = 1;
  let frame = 0;
  let lastFrame = 0;
  let visible = true;
  let disposed = false;
  let contextLost = false;
  const startedAt = performance.now();

  const isActiveRoute = () => (document.body.dataset.route || parseHash().route) === config.route;
  const canAnimate = () => !disposed && !contextLost && visible && !document.hidden && isActiveRoute();

  const draw = elapsed => {
    if (contextLost || disposed) return;
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const resize = () => {
    const bounds = container?.getBoundingClientRect() || canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, config.maxPixelRatio);
    width = Math.max(1, Math.round(bounds.width * pixelRatio));
    height = Math.max(1, Math.round(bounds.height * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    draw(reducedMotion ? 0 : (performance.now() - startedAt) * 0.001);
  };

  const loop = now => {
    frame = 0;
    if (!canAnimate() || reducedMotion) return;
    if (now - lastFrame >= 1000 / config.fps) {
      draw((now - startedAt) * 0.001);
      lastFrame = now;
    }
    frame = requestAnimationFrame(loop);
  };

  const start = () => {
    if (reducedMotion) {
      draw(0);
      return;
    }
    if (canAnimate() && !frame) frame = requestAnimationFrame(loop);
  };

  const onRouteOrVisibility = () => {
    if (canAnimate()) start();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const onContextLost = event => {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    container?.classList.add('is-unavailable');
  };

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    onRouteOrVisibility();
  }, { threshold: 0.02 });

  resizeObserver.observe(container || canvas);
  intersectionObserver.observe(canvas);
  window.addEventListener('hashchange', onRouteOrVisibility);
  document.addEventListener('visibilitychange', onRouteOrVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost, false);

  resize();
  start();

  window.addEventListener('pagehide', () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  }, { once: true });
  });

  if (!initSideRays.routeListenerBound) {
    initSideRays.routeListenerBound = true;
    window.addEventListener('hashchange', () => requestAnimationFrame(initSideRays));
  }
}


function initHomeStrands() {
  const canvas = document.querySelector('#home-strands-canvas');
  if (!canvas || window.innerWidth <= 900) return;

  const container = canvas.closest('.home-strands-field');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) {
    container?.classList.add('is-unavailable');
    return;
  }

  const vertexSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColors[4];
    uniform float uSpeed;
    uniform float uAmplitude;
    uniform float uWaviness;
    uniform float uThickness;
    uniform float uGlow;
    uniform float uTaper;
    uniform float uSpread;
    uniform float uHueShift;
    uniform float uIntensity;
    uniform float uOpacity;
    uniform float uScale;
    uniform float uSaturation;

    const float PI = 3.14159265;
    const int STRAND_COUNT = 8;

    vec3 samplePalette(float t) {
      float scaled = fract(t) * 4.0;
      if (scaled < 1.0) return mix(uColors[0], uColors[1], scaled);
      if (scaled < 2.0) return mix(uColors[1], uColors[2], scaled - 1.0);
      if (scaled < 3.0) return mix(uColors[2], uColors[3], scaled - 2.0);
      return mix(uColors[3], uColors[0], scaled - 3.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
      uv /= max(uScale, 0.0001);

      float energy = 0.06 + uIntensity * 0.94;
      float envelope = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);
      vec3 color = vec3(0.0);

      for (int i = 0; i < STRAND_COUNT; i++) {
        float fi = float(i);
        float phase = fi * 1.7 * uSpread;
        float frequency = (2.0 + fi * 0.35) * uWaviness;
        float strandSpeed = 1.4 + fi * 1.2;
        float time = uTime * uSpeed;
        float wave = sin(uv.x * frequency + time * strandSpeed + phase) * 0.60
          + sin(uv.x * frequency * 1.1 - time * strandSpeed * 0.7 + phase * 1.7) * 0.40;

        float amplitude = (0.1 + 0.02 * energy) * envelope * uAmplitude;
        float y = wave * amplitude;
        float distanceToStrand = abs(uv.y - y);
        float thickness = (0.001 + 0.05 * energy) * (0.35 + envelope) * uThickness;
        float glow = thickness / (distanceToStrand + thickness * 0.45);
        glow *= glow;

        float hue = fi / float(STRAND_COUNT) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
        color += samplePalette(hue) * glow * envelope;
      }

      color *= 0.45 + 0.7 * energy;
      color = 1.0 - exp(-color * uGlow);
      float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = max(mix(vec3(gray), color, uSaturation), 0.0);
      float luminance = max(max(color.r, color.g), color.b);
      float alpha = clamp(luminance, 0.0, 1.0) * uOpacity;
      gl_FragColor = vec4(color * uOpacity, alpha);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'Unable to compile Strands shader.');
    }
    return shader;
  };

  let program;
  try {
    program = gl.createProgram();
    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Unable to link Strands shader.');
    }
  } catch (error) {
    console.warn('Home Strands unavailable:', error);
    container?.classList.add('is-unavailable');
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time: gl.getUniformLocation(program, 'uTime'),
    resolution: gl.getUniformLocation(program, 'uResolution'),
    colors: gl.getUniformLocation(program, 'uColors[0]'),
    speed: gl.getUniformLocation(program, 'uSpeed'),
    amplitude: gl.getUniformLocation(program, 'uAmplitude'),
    waviness: gl.getUniformLocation(program, 'uWaviness'),
    thickness: gl.getUniformLocation(program, 'uThickness'),
    glow: gl.getUniformLocation(program, 'uGlow'),
    taper: gl.getUniformLocation(program, 'uTaper'),
    spread: gl.getUniformLocation(program, 'uSpread'),
    hueShift: gl.getUniformLocation(program, 'uHueShift'),
    intensity: gl.getUniformLocation(program, 'uIntensity'),
    opacity: gl.getUniformLocation(program, 'uOpacity'),
    scale: gl.getUniformLocation(program, 'uScale'),
    saturation: gl.getUniformLocation(program, 'uSaturation')
  };

  gl.uniform3fv(uniforms.colors, new Float32Array([
    0.835, 0.886, 0.949,
    0.553, 0.651, 0.780,
    0.467, 0.443, 0.561,
    0.204, 0.267, 0.361
  ]));
  gl.uniform1f(uniforms.speed, 0.31);
  gl.uniform1f(uniforms.amplitude, 1.12);
  gl.uniform1f(uniforms.waviness, 0.86);
  gl.uniform1f(uniforms.thickness, 0.42);
  gl.uniform1f(uniforms.glow, 1.9);
  gl.uniform1f(uniforms.taper, 2.45);
  gl.uniform1f(uniforms.spread, 0.92);
  gl.uniform1f(uniforms.hueShift, 0.04);
  gl.uniform1f(uniforms.intensity, 0.56);
  gl.uniform1f(uniforms.opacity, 0.68);
  gl.uniform1f(uniforms.scale, 1.16);
  gl.uniform1f(uniforms.saturation, 0.58);

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let width = 1;
  let height = 1;
  let frame = 0;
  let lastFrame = 0;
  let visible = true;
  let disposed = false;
  let contextLost = false;
  const startedAt = performance.now();

  const isHome = () => (document.body.dataset.route || parseHash().route) === 'home';
  const canAnimate = () => !disposed && !contextLost && visible && !document.hidden && isHome();

  const draw = elapsed => {
    if (disposed || contextLost) return;
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const resize = () => {
    const bounds = container?.getBoundingClientRect();
    if (!bounds?.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.2);
    width = Math.max(1, Math.round(bounds.width * pixelRatio));
    height = Math.max(1, Math.round(bounds.height * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    draw(reducedMotion ? 0 : (performance.now() - startedAt) * 0.001);
  };

  const loop = now => {
    frame = 0;
    if (!canAnimate() || reducedMotion) return;
    if (now - lastFrame >= 1000 / 28) {
      draw((now - startedAt) * 0.001);
      lastFrame = now;
    }
    frame = requestAnimationFrame(loop);
  };

  const start = () => {
    if (reducedMotion) {
      draw(0);
      return;
    }
    if (canAnimate() && !frame) frame = requestAnimationFrame(loop);
  };

  const onRouteOrVisibility = () => {
    if (canAnimate()) start();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const onContextLost = event => {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    container?.classList.add('is-unavailable');
  };

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    onRouteOrVisibility();
  }, { threshold: 0.02 });

  resizeObserver.observe(container);
  intersectionObserver.observe(container);
  window.addEventListener('hashchange', onRouteOrVisibility);
  document.addEventListener('visibilitychange', onRouteOrVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost, false);

  resize();
  start();

  window.addEventListener('pagehide', () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  }, { once: true });
}

function initWarpText() {
  const container = document.querySelector('.warp-text');
  if (!container) return;

  const fallback = container.querySelector('.warp-text-fallback');
  let introTimer = 0;
  let introComplete = reducedMotion;
  let refreshWarp = () => {};

  if (fallback) {
    let charIndex = 0;
    [...fallback.children].forEach(line => {
      const text = line.textContent || '';
      line.textContent = '';
      Array.from(text).forEach(char => {
        const glyph = document.createElement('span');
        glyph.className = 'stagger-char';
        glyph.textContent = char === ' ' ? '\u00a0' : char;
        glyph.style.setProperty('--char-index', charIndex++);
        line.appendChild(glyph);
      });
      const baseline = document.createElement('span');
      baseline.className = 'warp-text-baseline';
      line.appendChild(baseline);
    });
  }

  const markWarpRendered = () => {
    container.classList.add('is-warp-rendered');
    if (introComplete) container.classList.add('is-warp-ready');
  };

  replayHomeTitle = () => {
    window.clearTimeout(introTimer);
    requestAnimationFrame(refreshWarp);
    container.classList.remove('is-staggered-in', 'is-warp-ready');
    introComplete = reducedMotion;
    if (reducedMotion) {
      container.classList.add('is-staggered-in');
      if (container.classList.contains('is-warp-rendered')) container.classList.add('is-warp-ready');
      return;
    }
    void container.offsetWidth;
    requestAnimationFrame(() => container.classList.add('is-staggered-in'));
    introTimer = window.setTimeout(() => {
      introComplete = true;
      if (container.classList.contains('is-warp-rendered')) container.classList.add('is-warp-ready');
    }, 1280);
  };

  const vertexSource = `#version 300 es
    in vec2 aPosition;
    out vec2 vUv;
    void main() {
      vUv = aPosition * .5 + .5;
      gl_Position = vec4(aPosition, 0., 1.);
    }
  `;
  const fragmentSource = `#version 300 es
    precision highp float;
    uniform sampler2D uTextTexture;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uPointerActive;
    uniform float uTime;
    uniform float uMotion;
    in vec2 vUv;
    out vec4 fragColor;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3. - 2. * f);
      float a = hash(i);
      float b = hash(i + vec2(1., 0.));
      float c = hash(i + vec2(0., 1.));
      float d = hash(i + vec2(1., 1.));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    float fbm(vec2 p) {
      float value = 0.;
      float amplitude = .5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.02;
        amplitude *= .5;
      }
      return value;
    }
    vec4 sampleText(vec2 uv) {
      if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return vec4(0.);
      return texture(uTextTexture, uv);
    }
    void main() {
      vec2 uv = vUv;
      float aspect = uResolution.x / max(uResolution.y, 1.);
      float time = uTime * .42;
      vec2 drift = vec2(time * .055, -time * .045);
      float n1 = fbm(uv * 4.5 + drift);
      float n2 = fbm((uv + 19.17) * 4.9 - drift.yx);
      vec2 ambient = (vec2(n1, n2) - .5) * .0024 * uMotion;

      vec2 delta = uv - uPointer;
      vec2 aspectDelta = vec2(delta.x * aspect, delta.y);
      float dist = length(aspectDelta);
      float radius = .33;
      float t = clamp(dist / radius, 0., 1.);
      float lens = smoothstep(radius, 0., dist) * uPointerActive;
      float bulge = t * (1. - t) * (1. - t) * 6.75 * uPointerActive;
      vec2 dir = dist > .0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.);
      float ripple = sin(dist * 30. - time * 4.2) * .5;
      vec2 pointerWarp = -dir * bulge * .0105;
      pointerWarp += dir * ripple * bulge * .0018;

      // Fade deformation near the texture boundary instead of shifting the
      // text inward. The intro DOM title and the settled canvas title can then
      // share one baseline without edge pixels being pushed out of bounds.
      float edgeX = smoothstep(0., .04, uv.x) * smoothstep(0., .04, 1. - uv.x);
      float edgeY = smoothstep(0., .05, uv.y) * smoothstep(0., .05, 1. - uv.y);
      float edgeGuard = edgeX * edgeY;
      ambient *= edgeGuard;
      pointerWarp *= edgeGuard;

      vec2 displaced = uv + ambient + pointerWarp;
      vec2 splitDir = ambient + pointerWarp;
      float splitLen = length(splitDir);
      splitDir = splitLen > .00001 ? splitDir / splitLen : vec2(.7071);
      vec2 split = splitDir * .0015 * (.35 + lens * 1.45) * edgeGuard;

      vec4 base = sampleText(displaced);
      vec4 plus = sampleText(displaced + split);
      vec4 minus = sampleText(displaced - split);
      float alpha = max(max(plus.a, base.a), minus.a);
      vec3 color = vec3(plus.r, base.g, minus.b);
      color += lens * base.a * vec3(.035, .045, .07);
      fragColor = vec4(color, alpha);
    }
  `;

  let gl;
  let canvas;
  let program;
  let texture;
  let frame = 0;
  let visible = true;
  let pageVisible = !document.hidden;
  let contextLost = false;
  let disposed = false;
  let resizeObserver;
  let intersectionObserver;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const pointer = { x: .5, y: .5, tx: .5, ty: .5, active: 0, target: 0 };
  const startedAt = performance.now();

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'WarpText shader compilation failed');
    }
    return shader;
  };

  const measureLine = (ctx, text, spacing) => Array.from(text).reduce((width, char, index, chars) => width + ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0), 0);
  const boundsContext = document.createElement('canvas').getContext('2d');
  const reserveTextBounds = () => {
    if (!fallback || !boundsContext || window.matchMedia('(max-width: 620px)').matches) {
      container.style.removeProperty('--warp-bottom-padding');
      return;
    }
    const computed = getComputedStyle(container);
    const fontSize = parseFloat(computed.fontSize);
    boundsContext.font = `${computed.fontWeight} ${fontSize}px ${computed.fontFamily}`;
    boundsContext.textBaseline = 'alphabetic';
    const fallbackRect = fallback.getBoundingClientRect();
    let inkBottom = 0;
    let lineBottom = 0;
    for (const line of fallback.children) {
      const marker = line.querySelector('.warp-text-baseline');
      if (!marker) continue;
      const baseline = marker.getBoundingClientRect().top - fallbackRect.top;
      const descent = Math.max(...Array.from(line.textContent, char => boundsContext.measureText(char).actualBoundingBoxDescent));
      inkBottom = Math.max(inkBottom, baseline + descent);
      lineBottom = Math.max(lineBottom, line.getBoundingClientRect().bottom - fallbackRect.top);
    }
    const safety = fontSize * .195 + 2;
    const padding = Math.ceil(Math.max(fontSize * .12, inkBottom + safety - lineBottom));
    if (Math.abs(parseFloat(getComputedStyle(fallback).paddingBottom) - padding) > .5) {
      container.style.setProperty('--warp-bottom-padding', `${padding}px`);
    }
  };
  const drawLine = (ctx, text, x, y, spacing) => {
    let cursor = x;
    Array.from(text).forEach((char, index, chars) => {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0);
    });
  };

  const buildTextTexture = (width, height, dpr) => {
    const source = document.createElement('canvas');
    source.width = Math.max(1, Math.round(width * dpr));
    source.height = Math.max(1, Math.round(height * dpr));
    const ctx = source.getContext('2d');
    const computed = getComputedStyle(container);
    const configuredLines = (container.dataset.warpText || 'AI Native\\nExperience Design').split('\\n');
    const lines = width < 520 ? ['AI Native', 'Experience', 'Design'] : configuredLines;
    let fontSize = parseFloat(computed.fontSize) || 120;
    let lineHeight = fontSize * (width < 520 ? .86 : .92);
    let spacing = fontSize * -.055;
    const family = computed.fontFamily || 'sans-serif';
    const weight = computed.fontWeight || '700';
    // Read the intro DOM padding as the alignment source. Edge safety is
    // handled by the shader, so the canvas no longer needs a visible inset.
    const fallbackComputed = fallback ? getComputedStyle(fallback) : null;
    const left = fallbackComputed ? (parseFloat(fallbackComputed.paddingLeft) || 0) : Math.max(2, width * .002);
    const right = fallbackComputed ? (parseFloat(fallbackComputed.paddingRight) || 0) : Math.max(8, width * .008);
    const top = fallbackComputed ? (parseFloat(fallbackComputed.paddingTop) || 0) : Math.max(2, height * .015);
    const bottom = fallbackComputed ? (parseFloat(fallbackComputed.paddingBottom) || 0) : Math.max(4, height * .025);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const setFont = () => { ctx.font = `${weight} ${fontSize}px ${family}`; };
    setFont();

    // The intro uses DOM text and then crossfades to this canvas. Keep the
    // font size at 1:1 and match each settled canvas line to the corresponding
    // DOM line width. The previous global metricScale could only shrink the
    // canvas, which caused a visible size drop at the end of the intro.
    const domLines = fallback ? [...fallback.children] : [];
    const containerTop = container.getBoundingClientRect().top;
    const lineMetrics = lines.map((line, index) => {
      const domLine = domLines[index];
      const domText = (domLine?.textContent || '').replace(/ /g, ' ');
      const domRect = domLine?.getBoundingClientRect();
      const measuredWidth = measureLine(ctx, line, spacing);
      const domWidth = domText === line ? (domRect?.width || domLine?.scrollWidth || 0) : 0;
      const baselineRect = domLine?.querySelector('.warp-text-baseline')?.getBoundingClientRect();
      const baseline = domText === line && baselineRect ? baselineRect.top - containerTop : null;
      return { measuredWidth, targetWidth: domWidth > 0 ? domWidth : measuredWidth, baseline };
    });

    const widest = Math.max(...lineMetrics.map(({ targetWidth }) => targetWidth));
    const horizontalFit = (width - left - right) / widest;
    // Desktop keeps the same two flowing DOM lines, so its container already
    // has the correct height. Only the compact three-line canvas fallback needs
    // vertical fitting; applying it on desktop introduced a rounding shrink.
    const verticalFit = width < 520
      ? (height - top - bottom) / (lineHeight * lines.length)
      : 1;
    const fit = Math.min(1, horizontalFit, verticalFit);
    fontSize *= fit;
    lineHeight *= fit;
    spacing *= fit;
    setFont();
    const fontMetrics = ctx.measureText('Hg');
    const ascent = fontMetrics.fontBoundingBoxAscent ?? fontMetrics.actualBoundingBoxAscent;
    const descent = fontMetrics.fontBoundingBoxDescent ?? fontMetrics.actualBoundingBoxDescent;
    const baselineOffset = (lineHeight - ascent - descent) / 2 + ascent;

    lines.forEach((line, index) => {
      const y = top + index * lineHeight;
      const baseline = lineMetrics[index].baseline;
      const baselineY = baseline === null ? y + baselineOffset : top + (baseline - top) * fit;
      const measuredWidth = measureLine(ctx, line, spacing);
      const targetWidth = lineMetrics[index].targetWidth * fit;
      const lineScaleX = measuredWidth > 0 ? targetWidth / measuredWidth : 1;
      const gradient = ctx.createLinearGradient(left, y, Math.min(width, left + targetWidth), y + lineHeight);
      if (index === 0) {
        gradient.addColorStop(0, '#f6f9ff');
        gradient.addColorStop(.42, '#dfe8f6');
        gradient.addColorStop(1, '#b8c7dc');
      } else {
        gradient.addColorStop(0, '#bac9df');
        gradient.addColorStop(.5, '#9fb3d0');
        gradient.addColorStop(1, '#778ead');
      }
      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(15, 25, 45, .48)';
      ctx.shadowBlur = fontSize * .08;
      ctx.shadowOffsetY = fontSize * .035;
      ctx.save();
      ctx.translate(left, baselineY);
      ctx.scale(lineScaleX, 1);
      drawLine(ctx, line, 0, 0, spacing);
      ctx.restore();
    });
    return source;
  };

  const initCanvas2DFallback = () => {
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    container.appendChild(canvas);
    let sourceCanvas;
    let fallbackFrame = 0;
    let fallbackVisible = true;
    const fallbackPointer = { x: .5, y: .5, tx: .5, ty: .5, active: 0, target: 0 };
    const fallbackStarted = performance.now();

    const resizeFallback = async () => {
      if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
      reserveTextBounds();
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceCanvas = buildTextTexture(rect.width, rect.height, dpr);
      markWarpRendered();
    };

    const drawFallback = now => {
      if (!sourceCanvas || !fallbackVisible || document.hidden) { fallbackFrame = requestAnimationFrame(drawFallback); return; }
      const rect = container.getBoundingClientRect();
      const elapsed = (now - fallbackStarted) * .001;
      const idleX = .5 + Math.sin(elapsed * .28) * .11;
      const idleY = .5 + Math.cos(elapsed * .23) * .08;
      fallbackPointer.x += ((fallbackPointer.target ? fallbackPointer.tx : idleX) - fallbackPointer.x) * (fallbackPointer.target ? .1 : .028);
      fallbackPointer.y += ((fallbackPointer.target ? fallbackPointer.ty : idleY) - fallbackPointer.y) * (fallbackPointer.target ? .1 : .028);
      // No idle lens: the title must keep its settled scale after the intro.
      fallbackPointer.active += (((fallbackPointer.target ? 1 : 0) - fallbackPointer.active) * .055);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const slices = coarsePointer || reducedMotion ? 1 : 44;
      const sourceWidth = sourceCanvas.width;
      const sourceHeight = sourceCanvas.height;
      const sliceSourceHeight = sourceHeight / slices;
      const sliceDestHeight = rect.height / slices;
      for (let index = 0; index < slices; index += 1) {
        const yNorm = (index + .5) / slices;
        const distanceY = Math.abs(yNorm - fallbackPointer.y);
        const influence = Math.max(0, 1 - distanceY / .34) * fallbackPointer.active;
        const ambient = Math.sin(elapsed * .72 + index * .31) * 1.15 * (reducedMotion ? 0 : 1);
        const lens = (yNorm - fallbackPointer.y) * -13 * influence;
        const shift = ambient + lens;
        ctx.drawImage(sourceCanvas, 0, index * sliceSourceHeight, sourceWidth, sliceSourceHeight + 1, shift, index * sliceDestHeight, rect.width, sliceDestHeight + 1);
      }
      fallbackFrame = requestAnimationFrame(drawFallback);
    };
    const onFallbackMove = event => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      fallbackPointer.tx = (event.clientX - rect.left) / rect.width;
      fallbackPointer.ty = (event.clientY - rect.top) / rect.height;
      fallbackPointer.target = 1;
    };
    canvas.addEventListener('pointermove', onFallbackMove, { passive: true });
    canvas.addEventListener('pointerleave', () => { fallbackPointer.target = 0; });
    const fallbackResizeObserver = observeLayoutResize(container, resizeFallback);
    const fallbackIntersectionObserver = new IntersectionObserver(([entry]) => { fallbackVisible = entry.isIntersecting; });
    fallbackIntersectionObserver.observe(container);
    resizeFallback();
    fallbackFrame = requestAnimationFrame(drawFallback);
    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(fallbackFrame);
      fallbackResizeObserver.disconnect();
      fallbackIntersectionObserver.disconnect();
    }, { once: true });
  };

  try {
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) { initCanvas2DFallback(); return; }
    container.appendChild(canvas);

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'WarpText program link failed');
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, 'uTextTexture'), 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  } catch (error) {
    console.warn('WarpText: WebGL could not be initialized. Using Canvas 2D fallback.', error);
    canvas?.remove();
    initCanvas2DFallback();
    return;
  }

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    active: gl.getUniformLocation(program, 'uPointerActive'),
    time: gl.getUniformLocation(program, 'uTime'),
    motion: gl.getUniformLocation(program, 'uMotion')
  };

  const render = (elapsed = 0) => {
    if (disposed || contextLost) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.active, pointer.active);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.motion, reducedMotion || coarsePointer ? 0 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const rasterize = async () => {
    if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
    if (disposed || contextLost) return;
    reserveTextBounds();
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = Math.min(devicePixelRatio || 1, coarsePointer ? 1.35 : 1.75);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildTextTexture(rect.width, rect.height, dpr));
    render(0);
    markWarpRendered();
  };

  refreshWarp = () => {
    if (document.body.dataset.route !== 'home' || disposed || contextLost) return;
    rasterize();
    if (pageVisible && visible && !frame) frame = requestAnimationFrame(loop);
  };

  const onPointerMove = event => {
    if (event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    pointer.tx = (event.clientX - rect.left) / rect.width;
    pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
    pointer.target = 1;
  };
  const onPointerLeave = () => { pointer.target = 0; };
  const onContextLost = event => {
    event.preventDefault();
    contextLost = true;
    container.classList.remove('is-warp-ready', 'is-warp-rendered');
    cancelAnimationFrame(frame);
  };
  const onVisibility = () => {
    pageVisible = !document.hidden;
    if (pageVisible && visible && !frame) frame = requestAnimationFrame(loop);
    if (!pageVisible && frame) { cancelAnimationFrame(frame); frame = 0; }
  };
  const loop = now => {
    if (disposed || contextLost) return;
    const elapsed = (now - startedAt) * .001;
    const idleX = .5 + Math.sin(elapsed * .28) * .11;
    const idleY = .5 + Math.cos(elapsed * .23) * .085;
    const targetX = pointer.target ? pointer.tx : idleX;
    const targetY = pointer.target ? pointer.ty : idleY;
    const damping = pointer.target ? .1 : .028;
    pointer.x += (targetX - pointer.x) * damping;
    pointer.y += (targetY - pointer.y) * damping;
    // Keep the settled title at 1:1 scale. Lens distortion begins only
    // after an actual pointer interaction, never automatically after intro.
    pointer.active += (((pointer.target ? 1 : 0) - pointer.active) * .055);
    render(reducedMotion ? 0 : elapsed);
    frame = requestAnimationFrame(loop);
  };

  resizeObserver = observeLayoutResize(container, rasterize);
  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && pageVisible && !frame) frame = requestAnimationFrame(loop);
    if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
  });
  intersectionObserver.observe(container);
  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('webglcontextlost', onContextLost, false);
  document.addEventListener('visibilitychange', onVisibility);
  rasterize();
  frame = requestAnimationFrame(loop);
  window.addEventListener('pagehide', () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
  }, { once: true });
}

function initLegionCylinder() {
  const gallery = document.querySelector('[data-legion-cylinder]');
  if (!gallery) return;

  const caseView = gallery.closest('.case-scroll');
  const cards = [...gallery.querySelectorAll('[data-cylinder-card]')];
  const statusLinks = [...gallery.querySelectorAll('.legion-cylinder-status a')];
  const label = gallery.querySelector('[data-cylinder-label]');
  const count = gallery.querySelector('[data-cylinder-count]');
  if (!cards.length) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const chapterForCard = (card) => card?.dataset.scrollChapter || card?.dataset.chapter || '01';
  const displayForCard = (card, index) => card?.dataset.displayChapter || String(index + 1).padStart(2, '0');
  const findCardIndex = (chapter) => {
    const normalizedChapter = legionChapterAliases[chapter] || chapter;
    const index = cards.findIndex((card) => chapterForCard(card) === normalizedChapter);
    return index >= 0 ? index : 0;
  };
  const initialHash = parseHash();
  const initialIndex = initialHash.route === 'case-legion' ? findCardIndex(initialHash.chapter) : 0;
  let activeIndex = initialIndex;

  const setActive = (index, updateHash = false) => {
    const nextIndex = clamp(index, 0, cards.length - 1);
    activeIndex = nextIndex;
    const card = cards[nextIndex];
    const chapter = chapterForCard(card);
    const displayChapter = displayForCard(card, nextIndex);
    const chapterLabel = card?.dataset.cylinderLabel || 'DESIGN REASONING';

    gallery.style.setProperty('--legion-active-index', String(nextIndex));
    if (label) label.textContent = `${displayChapter} / ${chapterLabel}`;
    if (count) count.textContent = `${displayChapter} / ${String(cards.length).padStart(2, '0')}`;

    cards.forEach((card, cardIndex) => {
      const active = cardIndex === nextIndex;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-current', active ? 'true' : 'false');
      card.style.setProperty('--legion-card-distance', String(Math.abs(cardIndex - nextIndex)));
      card.style.setProperty('--legion-card-direction', String(Math.sign(cardIndex - nextIndex)));
    });

    statusLinks.forEach((link, linkIndex) => {
      const active = linkIndex === nextIndex;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    if (caseView) setScrollCaseNavActive(caseView, chapter, false);

    if (updateHash && document.body.dataset.route === 'case-legion') {
      history.replaceState(null, '', `#case-legion/${chapter}`);
    }
  };

  cards.forEach((card, index) => {
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      setActive(index, true);
    });
    card.addEventListener('focus', () => setActive(index, true));
    card.addEventListener('click', (event) => {
      if (event.target.closest('img') && index === activeIndex) return;
      event.preventDefault();
      event.stopPropagation();
      setActive(index, true);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = (activeIndex + 1) % cards.length;
        setActive(next, true);
        cards[next].focus({ preventScroll: true });
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = (activeIndex - 1 + cards.length) % cards.length;
        setActive(next, true);
        cards[next].focus({ preventScroll: true });
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(index, true);
        const image = card.querySelector('img');
        if (index === activeIndex && image) openLightbox(image);
      }
    });
  });

  statusLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setActive(index, true);
      cards[index]?.focus({ preventScroll: true });
    });
  });

  gallery.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') return;
    setActive(activeIndex, false);
  });

  window.addEventListener('hashchange', () => {
    const nextHash = parseHash();
    if (nextHash.route !== 'case-legion') return;
    const parsedIndex = findCardIndex(nextHash.chapter);
    if (chapterForCard(cards[parsedIndex]) === (legionChapterAliases[nextHash.chapter] || nextHash.chapter)) {
      setActive(parsedIndex, false);
    }
  });

  if (reducedMotion) gallery.classList.add('is-reduced-motion');
  setActive(initialIndex, false);
}

function initLegionPrinciples() {
  const sections = [...document.querySelectorAll('[data-legion-principles]')];
  sections.forEach((section) => {
    const tabs = [...section.querySelectorAll('[data-principle-tab]')];
    const panels = [...section.querySelectorAll('[data-principle-panel]')];
    const current = section.querySelector('[data-principle-current]');
    const label = section.querySelector('[data-principle-label]');
    const labels = ['VISUAL TENSION', 'SPATIAL FLOW', 'PERSONAL SERVICE'];
    if (!tabs.length || tabs.length !== panels.length) return;
    let activeIndex = 0;

    const setActive = (index, focusTab = false) => {
      const nextIndex = (index + tabs.length) % tabs.length;
      activeIndex = nextIndex;
      section.dataset.activePrinciple = String(nextIndex);
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === nextIndex;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel, panelIndex) => {
        const distance = Math.abs(panelIndex - nextIndex);
        const direction = Math.sign(panelIndex - nextIndex);
        panel.classList.toggle('is-active', panelIndex === nextIndex);
        panel.setAttribute('aria-hidden', String(panelIndex !== nextIndex));
        panel.style.setProperty('--principle-x', `${direction * distance * 30}px`);
        panel.style.setProperty('--principle-y', `${distance * 18}px`);
        panel.style.setProperty('--principle-z', `${distance * -46}px`);
        panel.style.setProperty('--principle-scale', String(1 - distance * .04));
        panel.style.setProperty('--principle-rotate', `${direction * -1.8}deg`);
        panel.style.setProperty('--principle-opacity', String(Math.max(.12, .42 - distance * .16)));
        panel.style.zIndex = String(10 - distance);
      });
      if (current) current.textContent = String(nextIndex + 1).padStart(2, '0');
      if (label) label.textContent = labels[nextIndex] || labels[0];
      if (focusTab) tabs[nextIndex].focus({ preventScroll: true });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => setActive(index));
      tab.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') setActive(index);
      });
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') setActive(0, true);
        else if (event.key === 'End') setActive(tabs.length - 1, true);
        else setActive(activeIndex + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1), true);
      });
    });
    setActive(0);
  });
}

function initLegionPrologue() {
  const panels = [...document.querySelectorAll('.legion-prologue')];
  if (!panels.length) return;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    panels.forEach((panel) => panel.classList.add('is-in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '-8% 0px -12%', threshold: .12 });
  panels.forEach((panel) => observer.observe(panel));
}

const lightboxState = { items: [], index: 0, zoomed: false, previousFocus: null };
function resetLightboxZoom() {
  const box = document.querySelector('#image-lightbox');
  const button = document.querySelector('[data-lightbox-zoom]');
  const icon = button?.querySelector('span');
  lightboxState.zoomed = false;
  box?.classList.remove('is-zoomed');
  button?.setAttribute('aria-pressed', 'false');
  button?.setAttribute('aria-label', '放大图片');
  if (icon) icon.textContent = '⤢';
}
function toggleLightboxZoom() {
  const box = document.querySelector('#image-lightbox');
  const button = document.querySelector('[data-lightbox-zoom]');
  const icon = button?.querySelector('span');
  if (!box || !button) return;
  lightboxState.zoomed = !lightboxState.zoomed;
  box.classList.toggle('is-zoomed', lightboxState.zoomed);
  button.setAttribute('aria-pressed', String(lightboxState.zoomed));
  button.setAttribute('aria-label', lightboxState.zoomed ? '缩小图片' : '放大图片');
  if (icon) icon.textContent = lightboxState.zoomed ? '⤡' : '⤢';
}
function getLightboxItems(image) {
  const group = image.dataset.lightboxGroup;
  const images = group
    ? [...document.querySelectorAll('[data-lightbox-group]')].filter((item) => item.dataset.lightboxGroup === group)
    : [image];
  return images.map((item) => ({
    image: item,
    src: item.dataset.lightboxSrc || item.currentSrc || item.src,
    alt: item.alt || 'IMAGE DETAIL',
    caption: item.closest('figure')?.querySelector('figcaption')?.textContent || item.alt || 'IMAGE DETAIL'
  }));
}
function renderLightboxItem(index) {
  const target = document.querySelector('#lightbox-image');
  const caption = document.querySelector('#lightbox-caption');
  const count = document.querySelector('#lightbox-count');
  const prev = document.querySelector('[data-lightbox-prev]');
  const next = document.querySelector('[data-lightbox-next]');
  const item = lightboxState.items[index];
  if (!target || !item) return;
  resetLightboxZoom();
  lightboxState.index = index;
  target.src = item.src;
  target.alt = item.alt;
  if (caption) caption.textContent = item.caption;
  if (count) count.textContent = lightboxState.items.length > 1
    ? `${String(index + 1).padStart(2, '0')} / ${String(lightboxState.items.length).padStart(2, '0')}`
    : '';
  const hasMultiple = lightboxState.items.length > 1;
  [prev, next].forEach((button) => { if (button) button.hidden = !hasMultiple; });
}
function stepLightbox(direction) {
  if (lightboxState.items.length < 2) return;
  const nextIndex = (lightboxState.index + direction + lightboxState.items.length) % lightboxState.items.length;
  renderLightboxItem(nextIndex);
}
function openLightbox(image) {
  const box = document.querySelector('#image-lightbox');
  if (!box) return;
  lightboxState.previousFocus = image.closest('button, a, [tabindex]') || document.activeElement;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', '作品图片预览');
  lightboxState.items = getLightboxItems(image);
  lightboxState.index = Math.max(0, lightboxState.items.findIndex((item) => item.image === image));
  renderLightboxItem(lightboxState.index);
  box.classList.add('is-open');
  box.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  document.querySelector('#app').inert = true;
  box.querySelector('.lightbox-close').focus({ preventScroll: true });
}
function closeLightbox() {
  const box = document.querySelector('#image-lightbox');
  if (!box) return;
  box.classList.remove('is-open');
  box.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  document.querySelector('#app').inert = false;
  lightboxState.previousFocus?.focus({ preventScroll: true });
  lightboxState.previousFocus = null;
  lightboxState.items = [];
  lightboxState.index = 0;
  resetLightboxZoom();
}
function wireLightbox() {
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  document.querySelector('[data-lightbox-zoom]')?.addEventListener('click', toggleLightboxZoom);
  document.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => stepLightbox(-1));
  document.querySelector('[data-lightbox-next]')?.addEventListener('click', () => stepLightbox(1));
  document.querySelector('#image-lightbox')?.addEventListener('click', (event) => { if (event.target.id === 'image-lightbox') closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    const box = document.querySelector('#image-lightbox');
    if (!box?.classList.contains('is-open')) return;
    if (event.key === 'Tab') {
      const buttons = [...box.querySelectorAll('button')].filter((button) => !button.disabled && button.getClientRects().length);
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') { event.preventDefault(); stepLightbox(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); stepLightbox(1); }
  });
}

let homeScrollFrame = 0;
window.addEventListener('scroll', () => {
  if (document.body.dataset.route !== 'home' || homeScrollFrame) return;
  homeScrollFrame = requestAnimationFrame(() => {
    homeScrollFrame = 0;
    const works = document.querySelector('#selected-works');
    const career = document.querySelector('#career');
    if (!works || !career) return;
    const readingLine = window.scrollY + Math.min(window.innerHeight * .3, 260);
    const section = readingLine >= works.offsetTop ? 'works' : readingLine >= career.offsetTop ? 'career' : '';
    setHomeNavState(section);
  });
}, { passive: true });

window.addEventListener('hashchange', setRoute);
document.querySelector('.skip-content')?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector('#app');
  main.setAttribute('tabindex', '-1');
  main.focus({ preventScroll: true });
});
document.addEventListener('visibilitychange', () => {
  const hero = document.querySelector('.legion-cover-media video');
  if (document.hidden) document.querySelectorAll('video').forEach((video) => video.pause());
  else if (hero && document.body.dataset.route === 'case-legion' && !reducedMotion) hero.play()?.catch(() => {});
});
window.addEventListener('mousemove', (event) => { document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`); document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`); });
function initCaseBorderGlow() {
  const cards = [...document.querySelectorAll('.home-works .case-entry')];
  const supportsPointerGlow = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!cards.length || !supportsPointerGlow || reducedMotion) return;

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
      const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;

      card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--edge-proximity', '0');
    });
  });
}

function initGeneratedHomeFocusHover() {
  const stages = [...document.querySelectorAll('.case-paradigm .gen-story-home-stage')];
  if (!stages.length) return;

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const setHover = (stage, active) => {
    stage.querySelector('.gen-story-focus-hitarea')?.classList.toggle('is-hovering', active);
  };

  stages.forEach((stage) => {
    const hitarea = stage.querySelector('.gen-story-focus-hitarea');
    if (!hitarea) return;

    let baseRect = null;
    const edgeInset = 18;

    const updateBaseRect = () => {
      const stageRect = stage.getBoundingClientRect();
      const focus = stage.querySelector('.gen-story-focus');
      if (!focus || stageRect.width === 0 || stageRect.height === 0) return false;

      const wasHovering = hitarea.classList.contains('is-hovering');
      if (wasHovering) setHover(stage, false);
      const focusRect = focus.getBoundingClientRect();
      if (wasHovering) setHover(stage, true);

      baseRect = {
        left: focusRect.left - stageRect.left,
        right: focusRect.right - stageRect.left,
        top: focusRect.top - stageRect.top,
        bottom: focusRect.bottom - stageRect.top
      };
      return true;
    };

    const isNearEdge = (x, y) => {
      if (!baseRect) return false;
      const withinExpandedRect = (
        x >= baseRect.left - edgeInset &&
        x <= baseRect.right + edgeInset &&
        y >= baseRect.top - edgeInset &&
        y <= baseRect.bottom + edgeInset
      );
      if (!withinExpandedRect) return false;

      return (
        x <= baseRect.left + edgeInset ||
        x >= baseRect.right - edgeInset ||
        y <= baseRect.top + edgeInset ||
        y >= baseRect.bottom - edgeInset
      );
    };

    const onPointerMove = (event) => {
      if (!supportsHover.matches || event.pointerType === 'touch') {
        setHover(stage, false);
        return;
      }

      if (!baseRect && !updateBaseRect()) return;
      const stageRect = stage.getBoundingClientRect();
      const x = event.clientX - stageRect.left;
      const y = event.clientY - stageRect.top;
      setHover(stage, isNearEdge(x, y));
    };

    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', () => {
      setHover(stage, false);
    });
    window.addEventListener('resize', () => {
      baseRect = null;
      setHover(stage, false);
      updateBaseRect();
    }, { passive: true });

    const image = stage.querySelector('img');
    image?.addEventListener('load', () => {
      baseRect = null;
      updateBaseRect();
    }, { once: true });
  });
}

function initCaseTopbarVisibility() {
  const cases = [...document.querySelectorAll('.case-aui-one, .case-paradigm, .case-legion')]
    .map((caseView) => ({
      caseView,
      topbar: caseView.querySelector('.case-topbar')
    }))
    .filter(({ topbar }) => topbar);
  if (!cases.length) return;

  let settleTimer = 0;
  const supportsScrollEnd = 'onscrollend' in window;

  const isActive = ({ caseView }) => document.body.dataset.route === caseView.dataset.view
    && caseView.classList.contains('is-active');
  const isPastFirstScreen = () => window.scrollY >= window.innerHeight;

  const setVisible = ({ topbar }, visible) => {
    topbar.classList.toggle('is-topbar-visible', visible);
    topbar.classList.toggle('is-topbar-hidden', !visible);
    topbar.setAttribute('aria-hidden', String(!visible));
    topbar.inert = !visible;
  };

  const clearSettleTimer = () => {
    window.clearTimeout(settleTimer);
    settleTimer = 0;
  };

  const updateVisibility = () => {
    clearSettleTimer();
    const shouldShow = isPastFirstScreen();
    cases.forEach((item) => setVisible(item, isActive(item) && shouldShow));
  };

  const scheduleVisibilityUpdate = () => {
    clearSettleTimer();
    settleTimer = window.setTimeout(updateVisibility, 1500);
  };

  const onScroll = () => {
    // V285: keep the fixed glass navigation painted while scrolling.
    // Repeated opacity toggles caused Chromium to drop and rebuild the backdrop layer.
    updateVisibility();
  };

  const onScrollEnd = () => {
    updateVisibility();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  if (supportsScrollEnd) window.addEventListener('scrollend', onScrollEnd, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  window.addEventListener('hashchange', () => {
    clearSettleTimer();
    cases.forEach((item) => setVisible(item, false));
    window.requestAnimationFrame(updateVisibility);
  });
  updateVisibility();
}

function initArchiveCarousel() {
  const carousel = document.querySelector('[data-archive-carousel]');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('.archive-orbit-card')];
  const titles = ['AI Image Studio', '跨端场景', 'Legion Zone', 'Image Composer', 'Agent → UI'];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pauseButton = carousel.querySelector('[data-archive-pause]');
  let activeIndex = 0;
  let userPaused = false;
  let hovered = false;
  let visible = false;
  let timer = 0;
  const render = () => {
    cards.forEach((card, index) => {
      const offset = (index - activeIndex + cards.length) % cards.length;
      card.dataset.slot = String(offset > 2 ? offset - cards.length : offset);
      card.tabIndex = offset === 0 ? 0 : -1;
      card.setAttribute('aria-hidden', String(offset !== 0));
    });
    carousel.querySelector('[data-archive-count]').textContent = `${String(activeIndex + 1).padStart(2, '0')} / 05`;
    carousel.querySelector('[data-archive-title]').textContent = titles[activeIndex];
  };
  const sync = () => {
    window.clearTimeout(timer);
    const paused = userPaused || motionPreference.matches;
    pauseButton.textContent = paused ? '▷' : 'Ⅱ';
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.disabled = motionPreference.matches;
    pauseButton.setAttribute('aria-label', motionPreference.matches ? '减少动态已开启，使用左右按钮切换' : paused ? '播放自动轮转' : '暂停自动轮转');
    if (paused || hovered || !visible || document.hidden || document.body.dataset.route !== 'home' || carousel.contains(document.activeElement)) return;
    timer = window.setTimeout(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      render();
      sync();
    }, 4200);
  };
  const step = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    render();
    sync();
  };
  carousel.querySelector('[data-archive-prev]').addEventListener('click', () => step(-1));
  carousel.querySelector('[data-archive-next]').addEventListener('click', () => step(1));
  pauseButton.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  carousel.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') { hovered = true; sync(); } });
  carousel.addEventListener('pointerleave', () => { hovered = false; sync(); });
  carousel.addEventListener('focusin', sync);
  carousel.addEventListener('focusout', () => window.setTimeout(sync, 0));
  carousel.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const cardFocused = document.activeElement?.classList.contains('archive-orbit-card');
    step(event.key === 'ArrowRight' ? 1 : -1);
    if (cardFocused) cards[activeIndex].focus({ preventScroll: true });
  });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .25 }).observe(carousel);
  window.addEventListener('hashchange', sync);
  document.addEventListener('visibilitychange', sync);
  motionPreference.addEventListener('change', sync);
  window.addEventListener('pagehide', () => window.clearTimeout(timer));
  render();
  sync();
}

wireInteractiveStates(); wireLightbox(); wireAuiFilms(); initMobileSystemCarousel(); initAuiDesignMarquee(); initLegionCylinder(); initScrollCaseNavigation(); initWarpText(); initSpectralClouds(); initSideRays(); initHomeStrands(); initCaseBorderGlow(); initGeneratedHomeFocusHover(); initLegionPrinciples(); initLegionPrologue(); setRoute(); initCaseTopbarVisibility(); initArchiveCarousel();
