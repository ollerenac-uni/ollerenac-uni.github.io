(() => {
  'use strict';
  const root = document.querySelector('.course-module');
  const {meta, scenes, overview, components, edges, motionSequences, stepNarratives} = window.BlueTeamModule;
  const one = selector => root.querySelector(selector);
  const all = selector => Array.from(root.querySelectorAll(selector));
  function routeValue() {
    const match = /^#escena-(\d+)$/.exec(window.location.hash);
    if(match && Number(match[1])>=1 && Number(match[1])<=scenes.length) return String(Number(match[1])-1);
    return window.location.hash === '#vista-general' ? 'overview' : '0';
  }
  let current = routeValue();
  let selected = null;
  let activeTab = 'description';
  const node = id => one(`[data-node="${id}"]`);
  const svg = one('.connections');
  const edgeLayer = one('.edge-layer');
  const ns = 'http://www.w3.org/2000/svg';
  const data = () => current === 'overview' ? overview : scenes[Number(current)];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const packet = one('.motion-packet');
  const motionButton = one('.motion-toggle');
  const motionControls = one('.motion-controls');
  const nextModuleHref = one('.module-next')?.dataset.moduleHref;
  const supportsMotion = typeof packet.animate === 'function';
  const SCENE_DURATION_MS = 10000;
  const motion = {phase:0,state:'idle',animation:null,version:0};
  // Each scene supplies steps to the same player; new modules can use this format.
  const sequence = () => current === 'overview' ? null : motionSequences[Number(current)];
  let descriptionKey = null;
  const focusElement = id => node(id) || one(`[data-focus="${id}"]`);
  const baseNodeViews = new Map(all('[data-node]').map(button=>[button.dataset.node,[button.querySelector('span').firstChild.textContent,button.querySelector('small').textContent,button.querySelector('use').getAttribute('href').slice(1)]]));
  const baseOriginLabels = new Map(all('.verification-pair>p').map(element=>[element,element.querySelector('small').textContent]));

  function applyNodeViews(views={}) {
    baseNodeViews.forEach((initial,id)=>{
      const [label,detail,icon] = views[id] || initial;
      const button=node(id);button.querySelector('span').firstChild.textContent=label;
      button.querySelector('small').textContent=detail;button.querySelector('use').setAttribute('href',`#${icon}`);
    });
  }

  function markMotionStage() {
    const config=sequence();if(!config) return;
    const stage=config.steps[motion.phase];
    all('[data-node],[data-focus]').forEach(element=>element.classList.toggle('is-current-step',Boolean(stage?.nodes.includes(element.dataset.node || element.dataset.focus))));
    all('[data-edge]').forEach(path=>path.classList.toggle('is-current-step',path.dataset.edge === stage?.edge));
    if(one('.run-badge')) one('.run-badge').hidden = config.runAfter === undefined || motion.phase < config.runAfter;
    applyNodeViews(stage ? stage.view || {} : config.endView || {});
    all('.verification-matrix tr').forEach(row=>Array.from(row.children).forEach((cell,index)=>cell.classList.toggle('is-current-column',index===stage?.column)));
    baseOriginLabels.forEach((label,element)=>{
      const expectation=stage?.expectations?.[element.dataset.focus];
      if(expectation) element.dataset.expectation=expectation;else delete element.dataset.expectation;
      element.querySelector('small').textContent=expectation ? `Criterio: ${expectation==='blocked' ? 'bloqueo' : 'acceso'}` : label;
      element.querySelector('use').setAttribute('href',expectation==='allowed' ? '#icon-check' : expectation==='blocked' ? '#icon-block' : element.dataset.focus==='authorized' ? '#icon-check' : '#icon-block');
    });
    const type=edges.find(edge=>edge.id===stage?.edge)?.type || config.type || 'control';
    packet.dataset.type=type;one('.map-panel').dataset.motionType=type;
  }

  function showMotionStage() {
    const config=sequence();if(!config) return;
    const stage=config.steps[motion.phase];
    const title=document.createElement('strong');title.className='motion-step';
    title.textContent=stage ? `Recorrido ilustrado · ${motion.phase+1}/${config.steps.length} · ${stage.title}` : `Recorrido ilustrado · ${config.endTitle}`;
    one('.diagram-caption').replaceChildren(title);
    const action={playing:'Pausar recorrido',paused:'Reproducir recorrido',stepped:'Siguiente paso',finished:Number(current)===scenes.length-1 ? (nextModuleHref ? 'Continuar al siguiente módulo' : 'Repetir recorrido') : 'Continuar recorrido'}[motion.state];
    motionButton.querySelector('use').setAttribute('href',motion.state==='playing' ? '#icon-pause' : '#icon-play');
    motionButton.querySelector('.sr-only').textContent=action;
    motionButton.setAttribute('aria-label',`${action}. Escena ${Number(current)+1}`);
    motionButton.title=`${action} (10 s por escena). Flechas izquierda y derecha: pasos internos`;
    motionButton.disabled=false;
    one('.motion-previous').disabled=Number(current)===0;
    one('.motion-next').disabled=Number(current)===scenes.length-1;
    root.dataset.motionState=motion.state;root.dataset.motionPhase=stage ? String(motion.phase+1) : 'complete';
    markMotionStage();
    syncDescription();
  }

  function syncDescription() {
    const config=sequence();if(!config) return;
    const key=`${current}:${motion.phase}`;if(descriptionKey===key) return;
    descriptionKey=key;
    const stage=config.steps[motion.phase];
    one('.narrative-context').textContent=`Escena ${Number(current)+1} de ${scenes.length} · ${stage ? `Paso ${motion.phase+1} de ${config.steps.length}` : 'Recorrido de la escena finalizado'}`;
    one('.narrative-title').textContent=stage ? stage.title : config.endTitle;
    const paragraph=document.createElement('p');
    paragraph.textContent=stage ? stepNarratives[Number(current)][motion.phase] : config.endDetail;
    one('.narrative-body').replaceChildren(paragraph);
    one('.description-panel').scrollTop=0;
  }

  function animateMotionLeg(elapsed=0) {
    const config=sequence(),stage=config?.steps[motion.phase];
    if(!stage || !['playing','paused'].includes(motion.state)) return;
    const version=++motion.version;motion.animation?.cancel();
    const duration=SCENE_DURATION_MS/config.steps.length;
    let target,frames;
    if(stage.edge) {
      const path=one(`[data-edge="${stage.edge}"]`),length=path.getTotalLength();
      // Sample the existing curve once; native interpolation does the frame work.
      frames=Array.from({length:33},(_,index)=>{
        const progress=index/32,point=path.getPointAtLength(length*(stage.reverse ? 1-progress : progress));
        return {transform:`translate(${point.x}px,${point.y}px)`,opacity:1,offset:.08+progress*.65};
      });
      frames=[{transform:frames[0].transform,opacity:0,offset:0},...frames,{transform:frames[32].transform,opacity:0,offset:1}];
      target=packet;
    } else {
      const element=focusElement(stage.nodes[0]);target=element.querySelector('.node-icon,.icon') || element;
      frames=[{transform:'scale(1)',offset:0},{transform:'scale(1.12)',offset:.2},{transform:'scale(1)',offset:.45},{transform:'scale(1)',offset:1}];
    }
    const animation=target.animate(frames,{duration,fill:'both',easing:'linear'});motion.animation=animation;
    animation.currentTime=Math.min(elapsed,duration);
    if(motion.state==='paused') animation.pause();
    animation.finished.then(()=>{
      if(version!==motion.version || !sequence() || motion.state!=='playing') return;
      motion.animation=null;animation.cancel();motion.phase++;
      if(motion.phase===config.steps.length) {
        motion.state='finished';
        if(Number(current)<scenes.length-1) {
          go(String(Number(current)+1),{autoplay:true,replace:true});
          return;
        }
        if(nextModuleHref) {
          window.location.assign(nextModuleHref);
          return;
        }
      }
      showMotionStage();if(motion.state==='playing') animateMotionLeg();
    }).catch(()=>{}); // Resize, scene changes and accessibility settings cancel normally.
  }

  function stopMotion() {
    descriptionKey=null;
    motion.version++;motion.animation?.cancel();motion.animation=null;motion.state='idle';
    one('.map-panel').classList.remove('is-animated');delete one('.map-panel').dataset.motionType;
    // Keep module navigation available in overview; only scene playback is idle.
    motionControls.hidden=false;one('.topology-label').hidden=true;
    all('.motion-previous,.motion-toggle,.motion-next').forEach(button=>{button.disabled=true;});
    motionButton.querySelector('use').setAttribute('href','#icon-play');
    motionButton.setAttribute('aria-label','Reproducir recorrido. Selecciona una escena');
    motionButton.querySelector('.sr-only').textContent='Selecciona una escena';
    motionButton.title='Selecciona una escena para reproducir';
    if(one('.run-badge')) one('.run-badge').hidden=true;
    all('.is-current-step,.is-current-column').forEach(element=>element.classList.remove('is-current-step','is-current-column'));
    applyNodeViews();baseOriginLabels.forEach((label,element)=>{element.querySelector('small').textContent=label;delete element.dataset.expectation;});
    delete root.dataset.motionState;delete root.dataset.motionPhase;
  }

  function startMotion(autoplay=true) {
    if(!sequence()) return;
    stopMotion();one('.map-panel').classList.add('is-animated');
    motionControls.hidden=false;one('.topology-label').hidden=true;motion.phase=0;
    motion.state=motionPreference.matches || !supportsMotion ? 'stepped' : document.hidden || !autoplay ? 'paused' : 'playing';
    showMotionStage();fitMap();
  }

  function pauseMotion() {
    if(motion.state!=='playing') return;
    motion.state='paused';motion.animation?.pause();showMotionStage();
  }

  function advanceMotionStep() {
    moveMotionStep(1);
  }

  function moveMotionStep(direction) {
    const config=sequence();if(!config || motion.state==='finished' && direction>0) return;
    motion.version++;motion.animation?.cancel();motion.animation=null;motion.phase=Math.max(0,motion.phase+direction);
    motion.state=motion.phase===config.steps.length ? 'finished' : motionPreference.matches || !supportsMotion ? 'stepped' : 'paused';
    showMotionStage();fitMap();
  }

  function selectTab(value) {
    activeTab = value;
    all('[data-tab]').forEach(button => {
      const active = button.dataset.tab === activeTab;
      button.setAttribute('aria-selected',String(active));
      button.tabIndex = active ? 0 : -1;
      one(`#${button.getAttribute('aria-controls')}`).hidden = !active;
    });
  }

  function fitMap() {
    const viewport = one('.map-viewport');
    const content = one('.map-content');
    const available = viewport.getBoundingClientRect();
    const width = Math.max(660,available.width-4);
    content.style.width = `${width}px`;
    content.style.transform = 'none';
    drawConnections();
    const scale = Math.max(0,Math.min(1,(available.width-4)/width,(available.height-4)/content.scrollHeight));
    content.style.transform = `scale(${scale})`;
    content.style.left = `${Math.max(2,(available.width-width*scale)/2)}px`;
    content.style.top = `${Math.max(2,(available.height-content.scrollHeight*scale)/2)}px`;
    if(sequence() && motion.state !== 'idle') {
      markMotionStage();animateMotionLeg(motion.animation?.currentTime || 0);
    }
  }

  function showDetails() {
    const content = data();
    const item = selected ? components[selected] : null;
    one('.scene-context').textContent = item ? 'Elemento seleccionado' : content.context;
    one('.event-title').textContent = item ? item[0] : content.title;
    one('.event-description').textContent = item ? item[1] : content.description;
    one('.event-evidence').textContent = item ? item[2] : content.evidence;
    const records = one('.evidence-records');
    records.replaceChildren();
    for(const record of item ? [] : content.records || []) {
      const label = document.createElement('dt');label.textContent=record.source;
      const detail = document.createElement('dd');detail.textContent=record.detail;
      records.append(label,detail);
    }
    records.hidden = !records.childElementCount;
    one('.event-evidence').hidden = Boolean(records.childElementCount);
    one('.event-boundary').textContent = content.boundary;
    one('.return-to-scene').hidden = !selected;
    all('[data-node]').forEach(button => {
      button.classList.toggle('is-selected',button.dataset.node === selected);
      button.setAttribute('aria-pressed',String(button.dataset.node === selected));
    });
  }

  function drawConnections() {
    const area = one('.diagram').getBoundingClientRect();
    if(!area.width || !area.height) return;
    svg.setAttribute('viewBox',`0 0 ${area.width} ${area.height}`);
    edgeLayer.replaceChildren();
    const bounds = id => {
      const b = node(id).getBoundingClientRect();
      return {left:b.left-area.left,right:b.right-area.left,top:b.top-area.top,bottom:b.bottom-area.top,x:b.left+b.width/2-area.left,y:b.top+b.height/2-area.top};
    };
    for(const edge of edges) {
      const a = bounds(edge.from), b = bounds(edge.to);
      let path;
      if(edge.id === 'instructor-control') {
        const x = Math.max(3,Math.min(a.left,b.left)-12);
        path = `M${a.left},${a.y} H${x} V${b.y} H${b.left}`;
      } else if(['emulation','shipping','policy'].includes(edge.id) || edge.route === 'across') {
        const goesRight = a.x < b.x;
        const ax = goesRight ? a.right : a.left, bx = goesRight ? b.left : b.right;
        const bend = (ax+bx)/2+(edge.id === 'policy'?10:0);
        path = `M${ax},${a.y} C${bend},${a.y} ${bend},${b.y} ${bx},${b.y}`;
      } else if(edge.route === 'side') {
        const lane=Math.min(area.width-3,Math.max(a.right,b.right)+12);
        path=`M${a.right},${a.y} H${lane} V${b.y} H${b.right}`;
      } else if(edge.route === 'under') {
        const lane=Math.max(a.bottom,b.bottom)+16;
        path=`M${a.x},${a.bottom} V${lane} H${b.x} V${b.bottom}`;
      } else if(edge.id === 'compare' || edge.route === 'horizontal') {
        path = `M${a.left},${a.y} H${b.right}`;
      } else {
        const down = a.y < b.y;
        const startY = down ? a.bottom : a.top, endY = down ? b.top : b.bottom;
        const middle = (startY+endY)/2;
        path = `M${a.x},${startY} C${a.x},${middle} ${b.x},${middle} ${b.x},${endY}`;
      }
      const element = document.createElementNS(ns,'path');
      const emphasized = current === 'overview' || data().edges.includes(edge.id);
      element.setAttribute('d',path);
      element.setAttribute('class',`edge ${edge.type}${emphasized?'':' is-muted'}${data().gap && edge.id==='compare'?' has-gap':''}`);
      element.setAttribute('data-edge',edge.id);
      element.setAttribute('marker-end',`url(#arrow-${edge.type})`);
      if(edge.both) element.setAttribute('marker-start',`url(#arrow-${edge.type})`);
      const title = document.createElementNS(ns,'title');
      title.textContent = edge.label;
      element.append(title);
      edgeLayer.append(element);
    }
  }

  function render({autoplay=false}={}) {
    stopMotion();
    const content = data();
    one('.narrative-context').textContent = current === 'overview' ? 'Vista general' : `Escena ${Number(current)+1} de ${scenes.length}`;
    one('.narrative-title').textContent = content.name || content.title;
    const narrative = one('.narrative-body');
    narrative.replaceChildren();
    for(const text of content.narrative) {
      const paragraph = document.createElement('p');paragraph.textContent=text;narrative.append(paragraph);
    }
    all('[data-scene]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.scene === current)));
    all('[data-node]').forEach(button => button.classList.toggle('is-active',current !== 'overview' && content.nodes.includes(button.dataset.node)));
    one('.learner-action').textContent = content.action;
    const questions = one('.learner-questions');
    questions.replaceChildren();
    for(const question of content.questions || []) {
      const item = document.createElement('li');
      item.textContent = question;
      questions.append(item);
    }
    questions.hidden = !questions.childElementCount;
    one('.learner-result').textContent = content.result;
    one('.diagram-caption').textContent = content.caption;
    if(one('.linux-practice')) one('.linux-practice').hidden = !content.linux;
    one('.map-panel').classList.toggle('is-linux',Boolean(content.linux));
    one('#map-title').textContent = content.mapTitle || meta.mapTitle;
    one('.scene-position').textContent = current === 'overview' ? `Vista general · recorrido de ${scenes.length} escenas` : `Escena ${Number(current)+1} de ${scenes.length} · ${content.name}`;
    one('.scene-select').value = current;
    all('.detail-panel').forEach(panel=>{panel.scrollTop=0;});
    showDetails();
    fitMap();
    if(sequence()) startMotion(autoplay);
  }

  function go(value,{autoplay=false,replace=false}={}) {
    current = value;
    selected = null;
    render({autoplay});
    const hash = current === 'overview' ? '#vista-general' : `#escena-${Number(current)+1}`;
    if(window.location.hash !== hash) {
      if(replace) window.history.replaceState(null,'',hash);
      else window.location.hash=hash;
    }
  }
  all('[data-module-href]').forEach(button => button.addEventListener('click',()=>window.location.assign(button.dataset.moduleHref)));
  all('[data-scene]').forEach(button => button.addEventListener('click',()=>go(button.dataset.scene)));
  one('.scene-select').addEventListener('change',event=>go(event.target.value));
  motionButton.addEventListener('click',()=>{
    if(motion.state === 'finished') {
      if(Number(current)===scenes.length-1 && nextModuleHref) return window.location.assign(nextModuleHref);
      return go(Number(current)===scenes.length-1 ? '0' : String(Number(current)+1),{autoplay:true});
    }
    if(motion.state === 'playing') return pauseMotion();
    if(motion.state === 'paused') {
      motion.state='playing';showMotionStage();motion.animation?.play();
      return;
    }
    if(motion.state === 'stepped') {
      advanceMotionStep();
    }
  });
  motionButton.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight' || event.key==='ArrowLeft') {
      event.preventDefault();moveMotionStep(event.key==='ArrowRight' ? 1 : -1);
    }
  });
  one('.motion-previous').addEventListener('click',()=>go(String(Number(current)-1)));
  one('.motion-next').addEventListener('click',()=>go(String(Number(current)+1)));
  document.addEventListener('visibilitychange',()=>{if(document.hidden) pauseMotion();});
  motionPreference.addEventListener('change',()=>{
    if(!sequence() || motion.state === 'finished') return;
    const elapsed=motion.animation?.currentTime || 0;
    motion.version++;motion.animation?.cancel();motion.animation=null;
    motion.state=motionPreference.matches || !supportsMotion ? 'stepped' : 'paused';
    showMotionStage();animateMotionLeg(elapsed);
  });
  all('[data-tab]').forEach((button,index,tabs)=>{
    button.addEventListener('click',()=>selectTab(button.dataset.tab));
    button.addEventListener('keydown',event=>{
      const keys = {ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1};
      if(!(event.key in keys)) return;
      event.preventDefault();
      const target = tabs[keys[event.key]];selectTab(target.dataset.tab);target.focus();
    });
  });
  document.addEventListener('click',event=>{
    if(!one('.module-switcher').contains(event.target)) one('.module-switcher').open=false;
  });
  document.addEventListener('keydown',event=>{
    if(event.key === 'Escape' && one('.module-switcher').open) {
      one('.module-switcher').open=false;one('.module-switcher>summary').focus();
    }
  });
  window.addEventListener('hashchange',()=>{
    const value = routeValue();
    if(value !== current) { current=value; selected=null; render(); }
  });
  all('[data-node]').forEach(button => button.addEventListener('click',()=>{
    pauseMotion();
    selected = selected === button.dataset.node ? null : button.dataset.node;
    showDetails();
    selectTab('evidence');
    one('.event-panel').scrollTop=0;
  }));
  one('.return-to-scene').addEventListener('click',()=>{selected=null;showDetails();});
  new ResizeObserver(fitMap).observe(one('.map-viewport'));
  selectTab(activeTab);
  render({autoplay:true});
})();
