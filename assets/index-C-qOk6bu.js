var G=Object.defineProperty;var U=(n,e,t)=>e in n?G(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var u=(n,e,t)=>(U(n,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const o={baseUrl:"blanked_out",assetsPath:"assets",keys:{upKeys:["ArrowUp","KeyW"],downKeys:["ArrowDown","KeyS"],leftKeys:["ArrowLeft","KeyA"],rightKeys:["ArrowRight","KeyD"]},sizes:{gridSize:64,canvasWidth:1280,canvasHeight:720}},P="LEFT",C="RIGHT",R="UP",L="DOWN",B="Space",_={UP:o.keys.upKeys,DOWN:o.keys.downKeys,LEFT:o.keys.leftKeys,RIGHT:o.keys.rightKeys,SPACE:[B]},E=[P,C,R,L];class X{constructor(){this.heldDirections=[],this.keys={},this.lastKeys={},document.addEventListener("keydown",e=>{this.keys[e.code]=!0,this.getDirection(e.code,!0)}),document.addEventListener("keyup",e=>{this.keys[e.code]=!1,this.getDirection(e.code,!1)}),document.addEventListener("DOMContentLoaded",()=>{for(const e of Object.keys(_))for(const t of _[e]){const s=document.querySelectorAll(`.${t}.gameController`);for(const i of s)i.addEventListener("mousedown",()=>{E.includes(e)&&this.onKeyPressed(e),this.keys[t]=!0}),i.addEventListener("mouseup",()=>{E.includes(e)&&this.onKeyReleased(e),this.keys[t]=!1}),i.addEventListener("touchstart",r=>{r.preventDefault(),E.includes(e)&&this.onKeyPressed(e),this.keys[t]=!0}),i.addEventListener("touchend",r=>{r.preventDefault(),E.includes(e)&&this.onKeyReleased(e),this.keys[t]=!1})}})}get direction(){return this.heldDirections[0]}getDirection(e,t){for(const s of Object.keys(_))_[s].includes(e)&&E.includes(s)&&(t?this.onKeyPressed(s):this.onKeyReleased(s))}update(){this.lastKeys={...this.keys}}getActionJustPressed(e){let t=!1;return this.keys[e]&&!this.lastKeys[e]&&(t=!0),t}onKeyPressed(e){this.heldDirections.includes(e)||this.heldDirections.unshift(e)}onKeyReleased(e){const t=this.heldDirections.indexOf(e);t>-1&&this.heldDirections.splice(t,1)}}class c{constructor(e=0,t=0){this.x=e,this.y=t}duplicate(){return new c(this.x,this.y)}matches(e){return this.x===e.x&&this.y===e.y}toString(){return`Vector2(${this.x}, ${this.y})`}toNeighbor(e){let t=this.x,s=this.y;switch(e){case R:s-=o.sizes.gridSize;break;case L:s+=o.sizes.gridSize;break;case P:t-=o.sizes.gridSize;break;case C:t+=o.sizes.gridSize;break}if(t==this.x&&s==this.y)throw new Error("Invalid direction "+e+" for "+this.toString());return new c(t,s)}}class q{constructor(e,t){u(this,"mainLoop",e=>{if(!this.isRunning)return;let t=e-this.lastFrameTime;for(this.lastFrameTime=e,this.accumulatedTime+=t;this.accumulatedTime>=this.timeStep;)this.update(this.timeStep),this.accumulatedTime-=this.timeStep;this.render(),this.rafId=requestAnimationFrame(this.mainLoop)});this.lastFrameTime=0,this.accumulatedTime=0,this.timeStep=1e3/60,this.update=e,this.render=t,this.rafId=null,this.isRunning=!1}start(){this.isRunning||(this.isRunning=!0,this.rafId=requestAnimationFrame(this.mainLoop))}stop(){this.rafId||cancelAnimationFrame(this.rafId),this.isRunning=!1}}class Y{constructor(){u(this,"callbacks",[]);u(this,"nextId",0)}emit(e,t){this.callbacks.forEach(s=>{s.eventName===e&&s.callback(t)})}on(e,t,s){return this.nextId++,this.callbacks.push({id:this.nextId,eventName:e,caller:t,callback:s}),this.nextId}off(e){this.callbacks=this.callbacks.filter(t=>t.id!==e)}unsubscribe(e){this.callbacks=this.callbacks.filter(t=>t.caller!==e)}}const m=new Y;class l{}u(l,"PLAYER_PICK_UP_ITEM","PLAYER_PICK_UP_ITEM"),u(l,"CHANGE_SCENE","CHANGE_SCENE"),u(l,"START_TEXT_BOX","START_TEXT_BOX"),u(l,"END_TEXT_BOX","END_TEXT_BOX"),u(l,"CAMERA_POSITION","CAMERA_POSITION"),u(l,"DO_ACTION_ON_COORDINATE","DO_ACTION_ON_COORDINATE");class w{constructor({position:e}){this.position=e??new c(0,0),this.children=[],this.parent=null,this.hasBeenInitiated=!1,this.isSolid=!1,this.drawLayer=null}stepEntry(e,t){this.children.forEach(s=>s.stepEntry(e,t)),this.hasBeenInitiated||(this.hasBeenInitiated=!0,this.onInit()),this.step(e,t)}onInit(){}step(e){}draw(e,t,s){const i=t+this.position.x,r=s+this.position.y;this.drawImage(e,i,r),this.getDrawChildrenOrdered().forEach(a=>a.draw(e,i,r))}getDrawChildrenOrdered(){return[...this.children].sort((e,t)=>t.drawLayer==="FLOOR"||e.position.y>t.position.y?1:-1)}drawImage(e,t,s){}destroy(){this.children.forEach(e=>e.destroy()),this.parent&&this.parent.removeChild(this)}addChild(e){e.parent=this,this.children.push(e)}removeChild(e){m.unsubscribe(e),this.children=this.children.filter(t=>t!==e)}}class j extends w{constructor(){super({});u(this,"zoom",1);this.zoom=1,this.offset=new c(0,0),this.onInit()}onInit(){m.on(l.CAMERA_POSITION,this,t=>{t.focus&&this.centerPositionOnTarget(t.position)}),m.on(l.CHANGE_SCENE,this,t=>{this.centerPositionOnTarget(t.heroStartPosition)})}centerPositionOnTarget(t){this.position=new c(-t.x+152,-t.y+82)}}class ${constructor(){this.flags=new Map}add(e){this.flags.set(e,!0)}remove(e){this.flags.delete(e)}getRelevantScenario(e=[]){return e.find(t=>{const s=t.bypass??[];for(let r=0;r<s.length;r++){const a=s[r];if(this.flags.has(a))return!1}const i=t.requires??[];for(let r=0;r<i.length;r++){const a=i[r];if(!this.flags.has(a))return!1}return!0})}}const v=new $;class J{constructor(){this.toLoad={hero:"sprites/hero-sheet.png",shadow:"sprites/shadow.png",rod:"sprites/rod.png",exit:"sprites/exit.png",sky:"sprites/sky.png",ground:"sprites/ground.png",cave:"sprites/cave.png",caveGround:"sprites/cave-ground.png",knight:"sprites/knight-sheet-1.png",textBox:"sprites/text-box.png",portraits:"sprites/portraits-sheet.png",fontWhite:"sprites/sprite-font-white.png"},this.images={};var e="";try{e="/"+o.baseUrl+"/"+o.assetsPath+"/"}catch(t){console.log(t),e="/"+o.baseUrl+"/"+o.assetsPath+"/"}console.log(`"${e}"`),Object.keys(this.toLoad).forEach(t=>{const s=new Image;s.src=e+this.toLoad[t],this.images[t]={image:s,isLoaded:!1},s.onload=()=>{this.images[t].isLoaded=!0}})}}const T=new J;class I extends w{constructor({resource:e,frameSize:t,hFrames:s,vFrames:i,frame:r,scale:a,position:d,animations:g}){super({position:d??new c(0,0)}),this.resource=e,this.frameSize=t??new c(o.sizes.gridSize,o.sizes.gridSize),this.hFrames=s??1,this.vFrames=i??1,this.frame=r??0,this.frameMap=new Map,this.scale=a??1,this.position=d??new c(0,0),this.animations=g??null,this.buildFrameMap()}buildFrameMap(){let e=0;for(let t=0;t<this.vFrames;t++)for(let s=0;s<this.hFrames;s++)this.frameMap.set(e,new c(s*this.frameSize.x,t*this.frameSize.y)),e++}step(e){this.animations&&(this.animations.step(e),this.frame=this.animations.frame)}drawImage(e,t,s){if(!this.resource.isLoaded)return;let i=0,r=0;const a=this.frameMap.get(this.frame);a&&(i=a.x,r=a.y);const d=this.frameSize.x,g=this.frameSize.y;e.drawImage(this.resource.image,i,r,d,g,t,s,d*this.scale,g*this.scale)}}class Q extends w{constructor(){super({position:new c(0,1)}),this.items=[],this.drawLayer="HUD",this.nextId=0,this.renderInventory()}renderInventory(){this.children.forEach(e=>e.destroy()),this.items.forEach((e,t)=>{const s=new I({resource:e.image,position:new c(t*12,0)});this.addChild(s)})}removeFromInventory(e){this.items=this.items.filter(t=>t.id!==e),this.renderInventory()}onInit(){m.on(l.PLAYER_PICK_UP_ITEM,this,e=>{this.items.push({id:this.nextId++,image:e.image}),console.log(this.items),this.renderInventory()})}}const V=5,h=new Map;h.set("i",2);h.set("j",4);h.set("l",3);h.set("r",4);h.set("t",4);h.set("u",4);h.set("v",4);h.set("x",4);h.set("y",4);h.set("z",4);h.set("E",4);h.set("F",4);h.set("M",7);h.set("W",7);h.set(" ",3);h.set("'",2);h.set("!",1);const Z=n=>h.get(n)??V,F=new Map;["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789 __",".!-,?'"].join("").split("").forEach((n,e)=>{F.set(n,e)});const ee=n=>F.get(n)??null,te=4,se=1,ie=3,re=20,ne=1,ae=1;class oe extends w{constructor(e={}){super({position:new c(32,108)}),this.drawLayer="HUD";const t=e.string??"Default Text";this.words=t.split(" ").map(s=>{let i=0;const r=s.split("").map(a=>{const d=Z(a);return i+=d,{width:d,sprite:new I({resource:T.images.fontWhite,hFrames:13,vFrames:6,frame:ee(a)})}});return{wordWidth:i,chars:r}}),this.backdrop=new I({resource:T.images.textBox,frameSize:new c(256,64)}),e.portraitFrame!==null&&e.portraitFrame!==void 0?this.portrait=new I({resource:T.images.portraits,hFrames:4,vFrames:1,frame:e.portraitFrame??0}):this.portrait=null,this.showingIndex=0,this.finalIndex=this.words.reduce((s,i)=>s+i.chars.length,0),this.textSpeed=re,this.timeUntilNextShow=this.textSpeed}step(e,t){const s=t.input;if(s!=null&&s.getActionJustPressed("Space")){if(this.showingIndex<this.finalIndex){this.showingIndex=this.finalIndex;return}m.emit(l.END_TEXT_BOX)}this.timeUntilNextShow-=e,this.timeUntilNextShow<=0&&(this.showingIndex+=ae,this.timeUntilNextShow+=this.textSpeed)}drawImage(e,t,s){this.backdrop.drawImage(e,t,s),this.portrait&&this.portrait.drawImage(e,t+6,s+6);const a=7,d=7,g=240,b=14,k=18,z=2;let O=a,N=d;this.portrait&&(O+=k,N+=z);let y=t+O,A=s+N,D=0;this.words.forEach(x=>{t+g-y<x.wordWidth&&(y=t+O,A+=b),x.chars.forEach(H=>{if(D>this.showingIndex)return;const{sprite:K,width:W}=H,M=y-te;K.draw(e,M,A),y+=W+se,D+=ne}),y+=ie})}}class he extends w{constructor(){super({}),this.level=null,this.input=new X,this.camera=new j}onInit(){const e=new Q;this.addChild(e),m.on(l.CHANGE_SCENE,this,t=>{this.setLevel(t)}),m.on(l.DO_ACTION_ON_COORDINATE,this,t=>{if(typeof t.getContent=="function"){const s=t.getContent();if(!s)return;s.addsFlags&&s.addsFlags.forEach(d=>{v.add(d)}),s.removesFlags&&s.removesFlags.forEach(d=>{v.remove(d)});const i={string:s.string,portraitFrame:s.portraitFrame??null};let r=null;r=new oe(i),this.addChild(r),m.emit(l.START_TEXT_BOX);const a=m.on(l.END_TEXT_BOX,this,()=>{r.destroy(),m.off(a)})}})}setLevel(e){this.level&&this.level.destroy(),this.level=e,this.addChild(this.level)}drawBackground(e){var t;(t=this.level)==null||t.background.drawImage(e,0,0)}drawObjects(e){this.children.forEach(t=>{t.drawLayer!=="HUD"&&t.draw(e,0,0)})}drawForeground(e){this.children.forEach(t=>{t.drawLayer==="HUD"&&t.draw(e,0,0)})}}class ce extends w{constructor(){super({}),this.background=null,this.walls=new Set}}class de extends ce{constructor(e={}){super({}),this.background=new I({resource:T.images.sky,frameSize:new c(o.sizes.canvasWidth,o.sizes.canvasHeight)});const t=new I({resource:T.images.ground,frameSize:new c(o.sizes.canvasWidth,o.sizes.canvasHeight)});this.addChild(t)}onInit(){}}const S=document.querySelector("#game-canvas"),p=S.getContext("2d"),f=new he({position:new c(0,0)});f.setLevel(new de);const le=n=>{var e;f.stepEntry(n,f),(e=f.input)==null||e.update()},ue=()=>{p.clearRect(0,0,S.width,S.height),f.drawBackground(p),p.save(),f.camera&&p.translate(f.camera.position.x,f.camera.position.y),f.drawObjects(p,0,0),p.restore(),f.drawForeground(p)},fe=new q(le,ue);fe.start();
