var Z=Object.defineProperty;var q=(r,t,e)=>t in r?Z(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var a=(r,t,e)=>(q(r,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();const c={baseUrl:"blanked_out",assetsPath:"assets",keys:{upKeys:["ArrowUp","KeyW"],downKeys:["ArrowDown","KeyS"],leftKeys:["ArrowLeft","KeyA"],rightKeys:["ArrowRight","KeyD"],zoomMinus:["NumpadSubtract"],zoomPlus:["NumpadAdd"]},sizes:{gridSize:64,BackgroundWidth:1280,BackgroundHeight:1280},MQTT:{"brokerUrl+port":"test.mosquitto.org:8081",topicBase:"https://oldmartijntje.github.io/blanked_out/"}};class V{constructor(){a(this,"callbacks",[]);a(this,"nextId",0)}emit(t,e){this.callbacks.forEach(s=>{s.eventName===t&&s.callback(e)})}on(t,e,s){return this.nextId++,this.callbacks.push({id:this.nextId,eventName:t,caller:e,callback:s}),this.nextId}off(t){this.callbacks=this.callbacks.filter(e=>e.id!==t)}unsubscribe(t){this.callbacks=this.callbacks.filter(e=>e.caller!==t)}}const g=new V;class l{}a(l,"PLAYER_PICK_UP_ITEM","PLAYER_PICK_UP_ITEM"),a(l,"CHANGE_SCENE","CHANGE_SCENE"),a(l,"START_TEXT_BOX","START_TEXT_BOX"),a(l,"END_TEXT_BOX","END_TEXT_BOX"),a(l,"CAMERA_POSITION","CAMERA_POSITION"),a(l,"DO_ACTION_ON_COORDINATE","DO_ACTION_ON_COORDINATE"),a(l,"USER_CLICK_CANVAS","USER_CLICK_CANVAS"),a(l,"USER_DOUBLE_CLICK_CANVAS","USER_DOUBLE_CLICK_CANVAS");const z="LEFT",F="RIGHT",X="UP",U="DOWN",Y="Space",v="ZOOM_MINUS",N="ZOOM_PLUS",L=.05,k=.25,B=3,A={UP:c.keys.upKeys,DOWN:c.keys.downKeys,LEFT:c.keys.leftKeys,RIGHT:c.keys.rightKeys,SPACE:[Y],ZOOM_MINUS:c.keys.zoomMinus,ZOOM_PLUS:c.keys.zoomPlus},T=[z,F,X,U,Y,v,N];class ${constructor(){this.heldDirections=[],this.keys={},this.lastKeys={},this.camera,this.canvas,this.isDragging=!1,this.startX=0,this.startY=0,this.lastX=0,this.lastY=0,this.lastTouchDistance=0,this.isZoomLimitReached=!1,this.dragStartTime,document.addEventListener("keydown",t=>{this.keys[t.code]=!0,this.getDirection(t.code,!0)}),document.addEventListener("keyup",t=>{this.keys[t.code]=!1,this.getDirection(t.code,!1)}),document.addEventListener("DOMContentLoaded",()=>{for(const t of Object.keys(A))for(const e of A[t]){const s=document.querySelectorAll(`.${e}.gameController`);for(const i of s)i.addEventListener("mousedown",()=>{T.includes(t)&&this.onKeyPressed(t),this.keys[e]=!0}),i.addEventListener("mouseup",()=>{T.includes(t)&&this.onKeyReleased(t),this.keys[e]=!1}),i.addEventListener("touchstart",n=>{n.preventDefault(),T.includes(t)&&this.onKeyPressed(t),this.keys[e]=!0}),i.addEventListener("touchend",n=>{n.preventDefault(),T.includes(t)&&this.onKeyReleased(t),this.keys[e]=!1})}})}get direction(){return this.heldDirections[0]}getDirection(t,e){for(const s of Object.keys(A))A[s].includes(t)&&T.includes(s)&&(e?this.onKeyPressed(s):this.onKeyReleased(s))}update(){this.lastKeys={...this.keys},this.heldDirections.length>0&&(this.heldDirections[0]===v||this.heldDirections[0]===N)&&this.camera&&(this.heldDirections[0]===v&&this.camera.zoom>k?this.camera.zoom-=L/2:this.heldDirections[0]===N&&this.camera.zoom<B&&(this.camera.zoom+=L/2))}getActionJustPressed(t){let e=!1;return this.keys[t]&&!this.lastKeys[t]&&(e=!0),e}onKeyPressed(t){this.heldDirections.includes(t)||this.heldDirections.unshift(t)}onKeyReleased(t){const e=this.heldDirections.indexOf(t);e>-1&&this.heldDirections.splice(e,1)}onPointerDown(t){this.isDragging=!0,t.touches?(this.lastX=t.touches[0].clientX,this.lastY=t.touches[0].clientY):(this.lastX=t.clientX,this.lastY=t.clientY),this.dragStartTime=new Date().getTime()}onPointerMove(t,e){if(!this.isDragging)return;let s,i;t.touches?(s=t.touches[0].clientX,i=t.touches[0].clientY):(s=t.clientX,i=t.clientY);const n=(s-this.lastX)/e.zoom,o=(i-this.lastY)/e.zoom;e.position.x+=n,e.position.y+=o,this.lastX=s,this.lastY=i}onPointerUp(t,e){new Date().getTime()-this.dragStartTime<200&&!this.isZoomLimitReached&&this.handleClick(t,e),this.isDragging=!1}onWheel(t,e){t.preventDefault();const s=t.deltaY<0?1+L:1-L;e.zoom*=s,e.zoom=Math.max(k,Math.min(B,e.zoom))}onTouchStart(t){if(t.touches.length===2){t.preventDefault();const e=t.touches[0],s=t.touches[1];this.lastTouchDistance=Math.hypot(s.clientX-e.clientX,s.clientY-e.clientY)}else t.touches.length===1&&(this.isDragging=!0,this.lastX=t.touches[0].clientX,this.lastY=t.touches[0].clientY,this.dragStartTime=new Date().getTime())}onTouchMove(t,e){if(t.touches.length===2){t.preventDefault();const s=t.touches[0],i=t.touches[1],n=Math.hypot(i.clientX-s.clientX,i.clientY-s.clientY);if(this.lastTouchDistance>0){const o=n/this.lastTouchDistance,h=e.zoom*o;if(h>=k&&h<=B){canvas.getBoundingClientRect();const f=(s.clientX+i.clientX)/2,S=(s.clientY+i.clientY)/2,C=(f-canvas.width/2)/e.zoom+e.position.x,O=(S-canvas.height/2)/e.zoom+e.position.y;e.zoom=h;const I=(f-canvas.width/2)/e.zoom+e.position.x,D=(S-canvas.height/2)/e.zoom+e.position.y;e.position.x+=C-I,e.position.y+=O-D}}this.lastTouchDistance=n}else if(t.touches.length===1&&this.isDragging){const s=t.touches[0].clientX,i=t.touches[0].clientY,n=(s-this.lastX)/e.zoom,o=(i-this.lastY)/e.zoom;e.position.x+=n,e.position.y+=o,this.lastX=s,this.lastY=i}}onTouchEnd(t,e){t.touches.length<2&&(this.lastTouchDistance=0,this.isZoomLimitReached=!1),new Date().getTime()-this.dragStartTime<200&&!this.isZoomLimitReached&&t.touches.length===0&&this.handleClick(t,e),t.touches.length===0&&(this.isDragging=!1)}handleClick(t,e,s=l.USER_CLICK_CANVAS){if(!this.canvas)return;const i=this.canvas.getBoundingClientRect(),n=(t.clientX||t.touches[0].clientX)-i.left,o=(t.clientY||t.touches[0].clientY)-i.top,h=(n-this.canvas.width/2)/e.zoom-e.position.x,f=(o-this.canvas.height/2)/e.zoom-e.position.y;g.emit(s,{x:h,y:f})}registerMouseMovement(t,e){this.canvas=t,this.camera=e,t.addEventListener("mousedown",s=>{this.onPointerDown(s)}),t.addEventListener("mousemove",s=>{this.onPointerMove(s,e)}),t.addEventListener("mouseup",s=>{this.onPointerUp(s,e)}),t.addEventListener("mouseleave",s=>{this.onPointerUp(s,e)}),t.addEventListener("dblclick",s=>{this.handleClick(s,e,l.USER_DOUBLE_CLICK_CANVAS)}),t.addEventListener("wheel",s=>{this.onWheel(s,e)},{passive:!1}),t.addEventListener("touchstart",s=>{this.onTouchStart(s)},{passive:!1}),t.addEventListener("touchmove",s=>{this.onTouchMove(s,e)},{passive:!1}),t.addEventListener("touchend",s=>{this.onTouchEnd(s,e)})}}class u{constructor(t=0,e=0){this.x=t,this.y=e}duplicate(){return new u(this.x,this.y)}matches(t){return this.x===t.x&&this.y===t.y}toString(){return`Vector2(${this.x}, ${this.y})`}toNeighbor(t){let e=this.x,s=this.y;switch(t){case X:s-=c.sizes.gridSize;break;case U:s+=c.sizes.gridSize;break;case z:e-=c.sizes.gridSize;break;case F:e+=c.sizes.gridSize;break}if(e==this.x&&s==this.y)throw new Error("Invalid direction "+t+" for "+this.toString());return new u(e,s)}}class J{constructor(t,e){a(this,"mainLoop",t=>{if(!this.isRunning)return;let e=t-this.lastFrameTime;for(this.lastFrameTime=t,this.accumulatedTime+=e;this.accumulatedTime>=this.timeStep;)this.update(this.timeStep),this.accumulatedTime-=this.timeStep;this.render(),this.rafId=requestAnimationFrame(this.mainLoop)});this.lastFrameTime=0,this.accumulatedTime=0,this.timeStep=1e3/60,this.update=t,this.render=e,this.rafId=null,this.isRunning=!1}start(){this.isRunning||(this.isRunning=!0,this.rafId=requestAnimationFrame(this.mainLoop))}stop(){this.rafId||cancelAnimationFrame(this.rafId),this.isRunning=!1}}class E{constructor({position:t}){this.position=t??new u(0,0),this.children=[],this.parent=null,this.hasBeenInitiated=!1,this.isSolid=!1,this.drawLayer=null}stepEntry(t,e){this.children.forEach(s=>s.stepEntry(t,e)),this.hasBeenInitiated||(this.hasBeenInitiated=!0,this.onInit()),this.step(t,e)}onInit(){}step(t){}draw(t,e,s){const i=e+this.position.x,n=s+this.position.y;this.drawImage(t,i,n),this.getDrawChildrenOrdered().forEach(o=>o.draw(t,i,n))}getDrawChildrenOrdered(){return[...this.children].sort((t,e)=>e.drawLayer==="FLOOR"||t.position.y>e.position.y?1:-1)}drawImage(t,e,s){}destroy(){this.children.forEach(t=>t.destroy()),this.parent&&this.parent.removeChild(this)}addChild(t){t.parent=this,this.children.push(t)}removeChild(t){g.unsubscribe(t),this.children=this.children.filter(e=>e!==t)}}class Q extends E{constructor(){super({});a(this,"zoom",1);this.zoom=.5,this.offset=new u(0,0),this.onInit()}onInit(){g.on(l.CAMERA_POSITION,this,e=>{e.focus&&this.centerPositionOnTarget(e.position)}),g.on(l.CHANGE_SCENE,this,e=>{this.centerPositionOnTarget(e.heroStartPosition)})}centerPositionOnTarget(e){this.position=new u(-e.x+632,-e.y+632)}}class tt{constructor(){this.flags=new Map}add(t){this.flags.set(t,!0)}remove(t){this.flags.delete(t)}getRelevantScenario(t=[]){return t.find(e=>{const s=e.bypass??[];for(let n=0;n<s.length;n++){const o=s[n];if(this.flags.has(o))return!1}const i=e.requires??[];for(let n=0;n<i.length;n++){const o=i[n];if(!this.flags.has(o))return!1}return!0})}}const b=new tt;class et{constructor(){this.toLoad={hero:"sprites/hero-sheet.png",shadow:"sprites/shadow.png",rod:"sprites/rod.png",exit:"sprites/exit.png",sky:"sprites/sky.png",ground:"sprites/ground.png",cave:"sprites/cave.png",caveGround:"sprites/cave-ground.png",knight:"sprites/knight-sheet-1.png",textBox:"sprites/text-box.png",portraits:"sprites/portraits-sheet.png",fontWhite:"sprites/sprite-font-white.png"},this.images={};var t="";try{t="/"+c.baseUrl+"/"+c.assetsPath+"/"}catch(e){console.log(e),t="/"+c.baseUrl+"/"+c.assetsPath+"/"}console.log(`"${t}"`),Object.keys(this.toLoad).forEach(e=>{const s=new Image;s.src=t+this.toLoad[e],this.images[e]={image:s,isLoaded:!1},s.onload=()=>{this.images[e].isLoaded=!0}})}}const M=new et;class _ extends E{constructor({resource:t,frameSize:e,hFrames:s,vFrames:i,frame:n,scale:o,position:h,animations:f}){super({position:h??new u(0,0)}),this.resource=t,this.frameSize=e??new u(c.sizes.gridSize,c.sizes.gridSize),this.hFrames=s??1,this.vFrames=i??1,this.frame=n??0,this.frameMap=new Map,this.scale=o??1,this.position=h??new u(0,0),this.animations=f??null,this.buildFrameMap()}buildFrameMap(){let t=0;for(let e=0;e<this.vFrames;e++)for(let s=0;s<this.hFrames;s++)this.frameMap.set(t,new u(s*this.frameSize.x,e*this.frameSize.y)),t++}step(t){this.animations&&(this.animations.step(t),this.frame=this.animations.frame)}drawImage(t,e,s){if(!this.resource.isLoaded)return;let i=0,n=0;const o=this.frameMap.get(this.frame);o&&(i=o.x,n=o.y);const h=this.frameSize.x,f=this.frameSize.y;t.drawImage(this.resource.image,i,n,h,f,e,s,h*this.scale,f*this.scale)}}class st extends E{constructor(){super({position:new u(0,1)}),this.items=[],this.drawLayer="HUD",this.nextId=0,this.renderInventory()}renderInventory(){this.children.forEach(t=>t.destroy()),this.items.forEach((t,e)=>{const s=new _({resource:t.image,position:new u(e*12,0)});this.addChild(s)})}removeFromInventory(t){this.items=this.items.filter(e=>e.id!==t),this.renderInventory()}onInit(){g.on(l.PLAYER_PICK_UP_ITEM,this,t=>{this.items.push({id:this.nextId++,image:t.image}),console.log(this.items),this.renderInventory()})}}const it=5,d=new Map;d.set("i",2);d.set("j",4);d.set("l",3);d.set("r",4);d.set("t",4);d.set("u",4);d.set("v",4);d.set("x",4);d.set("y",4);d.set("z",4);d.set("E",4);d.set("F",4);d.set("M",7);d.set("W",7);d.set(" ",3);d.set("'",2);d.set("!",1);const nt=r=>d.get(r)??it,K=new Map;["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789 __",".!-,?'"].join("").split("").forEach((r,t)=>{K.set(r,t)});const ot=r=>K.get(r)??null,rt=4,at=1,ht=3,lt=20,ct=1,dt=1;class ut extends E{constructor(t={}){super({position:new u(32,108)}),this.drawLayer="HUD";const e=t.string??"Default Text";this.words=e.split(" ").map(s=>{let i=0;const n=s.split("").map(o=>{const h=nt(o);return i+=h,{width:h,sprite:new _({resource:M.images.fontWhite,hFrames:13,vFrames:6,frame:ot(o)})}});return{wordWidth:i,chars:n}}),this.backdrop=new _({resource:M.images.textBox,frameSize:new u(256,64)}),t.portraitFrame!==null&&t.portraitFrame!==void 0?this.portrait=new _({resource:M.images.portraits,hFrames:4,vFrames:1,frame:t.portraitFrame??0}):this.portrait=null,this.showingIndex=0,this.finalIndex=this.words.reduce((s,i)=>s+i.chars.length,0),this.textSpeed=lt,this.timeUntilNextShow=this.textSpeed}step(t,e){const s=e.input;if(s!=null&&s.getActionJustPressed("Space")){if(this.showingIndex<this.finalIndex){this.showingIndex=this.finalIndex;return}g.emit(l.END_TEXT_BOX)}this.timeUntilNextShow-=t,this.timeUntilNextShow<=0&&(this.showingIndex+=dt,this.timeUntilNextShow+=this.textSpeed)}drawImage(t,e,s){this.backdrop.drawImage(t,e,s),this.portrait&&this.portrait.drawImage(t,e+6,s+6);const o=7,h=7,f=240,S=14,C=18,O=2;let I=o,D=h;this.portrait&&(I+=C,D+=O);let w=e+I,x=s+D,P=0;this.words.forEach(R=>{e+f-w<R.wordWidth&&(w=e+I,x+=S),R.chars.forEach(H=>{if(P>this.showingIndex)return;const{sprite:W,width:j}=H,G=w-rt;W.draw(t,G,x),w+=j+at,P+=ct}),w+=ht})}}class mt extends E{constructor(){super({}),this.level=null,this.input=new $,this.camera=new Q}onInit(){g.on(l.USER_CLICK_CANVAS,this,e=>{console.log(e,1)}),g.on(l.USER_DOUBLE_CLICK_CANVAS,this,e=>{console.log(e,2)});const t=new st;this.addChild(t),g.on(l.CHANGE_SCENE,this,e=>{this.setLevel(e)}),g.on(l.DO_ACTION_ON_COORDINATE,this,e=>{if(typeof e.getContent=="function"){const s=e.getContent();if(!s)return;s.addsFlags&&s.addsFlags.forEach(h=>{b.add(h)}),s.removesFlags&&s.removesFlags.forEach(h=>{b.remove(h)});const i={string:s.string,portraitFrame:s.portraitFrame??null};let n=null;n=new ut(i),this.addChild(n),g.emit(l.START_TEXT_BOX);const o=g.on(l.END_TEXT_BOX,this,()=>{n.destroy(),g.off(o)})}})}registerMouseMovement(t){this.input.registerMouseMovement(t,this.camera)}setLevel(t){this.level&&this.level.destroy(),this.level=t,this.addChild(this.level)}drawBackground(t){var e;(e=this.level)==null||e.background.drawImage(t,0,0)}drawObjects(t){this.children.forEach(e=>{e.drawLayer!=="HUD"&&e.draw(t,0,0)})}drawForeground(t){this.children.forEach(e=>{e.drawLayer==="HUD"&&e.draw(t,0,0)})}}class gt extends E{constructor(){super({}),this.background=null,this.walls=new Set}}class ft extends gt{constructor(e={}){super({});a(this,"menu");a(this,"campaignButton");a(this,"onlineButton");a(this,"offlineButton");a(this,"originalButton");a(this,"homeModal");a(this,"onlineMultiplayerModal");a(this,"lobbiesFound");a(this,"joinButton");a(this,"hostButton");a(this,"backButtons",[]);a(this,"joinModal");a(this,"hostModal");this.background=new _({resource:M.images.sky,frameSize:new u(c.sizes.BackgroundWidth,c.sizes.BackgroundHeight),scale:8}),this.menu=document.getElementById("homeMenu"),this.menu.style.display="block",this.campaignButton=document.getElementById("campaignButton"),this.onlineButton=document.getElementById("onlineMultiplayerButton"),this.offlineButton=document.getElementById("offlineMultiplayerButton"),this.originalButton=document.getElementById("originalButton"),this.onlineButton.addEventListener("click",()=>{this.clickedButton("online")}),this.offlineButton.addEventListener("click",()=>{this.clickedButton("offline")}),this.originalButton.addEventListener("click",()=>{this.clickedButton("original")}),this.campaignButton.addEventListener("click",()=>{this.clickedButton("campaign")}),this.homeModal=document.getElementById("homeModal"),this.homeModal.style.display="block",this.onlineMultiplayerModal=document.getElementById("onlineMultiplayerModal"),this.onlineMultiplayerModal.style.display="none",this.lobbiesFound=document.getElementById("lobbiesFound"),this.joinButton=document.getElementById("joinButton"),this.hostButton=document.getElementById("hostButton"),this.joinButton.addEventListener("click",()=>{this.clickedButton("join")}),this.hostButton.addEventListener("click",()=>{this.clickedButton("host")}),this.backButtons=document.getElementsByClassName("backButton");for(let s=0;s<this.backButtons.length;s++)this.backButtons[s].addEventListener("click",()=>{this.clickedButton("back")});this.joinModal=document.getElementById("joinModal"),this.joinModal.style.display="none",this.hostModal=document.getElementById("hostModal"),this.hostModal.style.display="none"}onInit(){}clickedButton(e){console.log(e),e==="online"?this.setModalAsActive("online"):e==="back"?this.setModalAsActive("home"):e==="host"?this.setModalAsActive("host"):e==="join"&&this.setModalAsActive("join")}setModalAsActive(e){e=="join"?this.joinModal.style.display="block":this.joinModal.style.display="none",e=="host"?this.hostModal.style.display="block":this.hostModal.style.display="none",e=="home"?this.homeModal.style.display="block":this.homeModal.style.display="none",e=="online"?this.onlineMultiplayerModal.style.display="block":this.onlineMultiplayerModal.style.display="none"}destroy(){this.children.forEach(e=>e.destroy()),this.parent&&this.parent.removeChild(this),this.menu.removeEventListener("click"),this.campaignButton.removeEventListener("click"),this.onlineButton.removeEventListener("click"),this.offlineButton.removeEventListener("click"),this.originalButton.removeEventListener("click")}}const y=document.querySelector("#game-canvas"),p=y.getContext("2d"),m=new mt({position:new u(0,0)});m.setLevel(new ft);m.registerMouseMovement(y);const pt=r=>{var t;m.stepEntry(r,m),(t=m.input)==null||t.update()},yt=()=>{p.clearRect(0,0,y.width,y.height),m.drawBackground(p),p.save(),m.camera&&(p.translate(y.width/2,y.height/2),p.scale(m.camera.zoom,m.camera.zoom),p.translate(-y.width/2+m.camera.position.x,-y.height/2+m.camera.position.y)),m.drawObjects(p,0,0),p.restore(),m.drawForeground(p)},Et=new J(pt,yt);Et.start();
