var V=Object.defineProperty;var Q=(n,t,e)=>t in n?V(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var _=(n,t,e)=>(Q(n,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const h={baseUrl:"blanked_out",assetsPath:"assets",keys:{upKeys:["ArrowUp","KeyW"],downKeys:["ArrowDown","KeyS"],leftKeys:["ArrowLeft","KeyA"],rightKeys:["ArrowRight","KeyD"]},sizes:{gridSize:16,canvasWidth:320,canvasHeight:180}},D="LEFT",F="RIGHT",b="UP",x="DOWN",Z="Space",P={UP:h.keys.upKeys,DOWN:h.keys.downKeys,LEFT:h.keys.leftKeys,RIGHT:h.keys.rightKeys,SPACE:[Z]},S=[D,F,b,x];class tt{constructor(){this.heldDirections=[],this.keys={},this.lastKeys={},document.addEventListener("keydown",t=>{this.keys[t.code]=!0,this.getDirection(t.code,!0)}),document.addEventListener("keyup",t=>{this.keys[t.code]=!1,this.getDirection(t.code,!1)}),document.addEventListener("DOMContentLoaded",()=>{for(const t of Object.keys(P))for(const e of P[t]){const s=document.querySelectorAll(`.${e}.gameController`);for(const i of s)i.addEventListener("mousedown",()=>{S.includes(t)&&this.onKeyPressed(t),this.keys[e]=!0}),i.addEventListener("mouseup",()=>{S.includes(t)&&this.onKeyReleased(t),this.keys[e]=!1}),i.addEventListener("touchstart",r=>{r.preventDefault(),S.includes(t)&&this.onKeyPressed(t),this.keys[e]=!0}),i.addEventListener("touchend",r=>{r.preventDefault(),S.includes(t)&&this.onKeyReleased(t),this.keys[e]=!1})}})}get direction(){return this.heldDirections[0]}getDirection(t,e){for(const s of Object.keys(P))P[s].includes(t)&&S.includes(s)&&(e?this.onKeyPressed(s):this.onKeyReleased(s))}update(){this.lastKeys={...this.keys}}getActionJustPressed(t){let e=!1;return this.keys[t]&&!this.lastKeys[t]&&(e=!0),e}onKeyPressed(t){this.heldDirections.includes(t)||this.heldDirections.unshift(t)}onKeyReleased(t){const e=this.heldDirections.indexOf(t);e>-1&&this.heldDirections.splice(e,1)}}class o{constructor(t=0,e=0){this.x=t,this.y=e}duplicate(){return new o(this.x,this.y)}matches(t){return this.x===t.x&&this.y===t.y}toString(){return`Vector2(${this.x}, ${this.y})`}toNeighbor(t){let e=this.x,s=this.y;switch(t){case b:s-=h.sizes.gridSize;break;case x:s+=h.sizes.gridSize;break;case D:e-=h.sizes.gridSize;break;case F:e+=h.sizes.gridSize;break}if(e==this.x&&s==this.y)throw new Error("Invalid direction "+t+" for "+this.toString());return new o(e,s)}}class et{constructor(t,e){_(this,"mainLoop",t=>{if(!this.isRunning)return;let e=t-this.lastFrameTime;for(this.lastFrameTime=t,this.accumulatedTime+=e;this.accumulatedTime>=this.timeStep;)this.update(this.timeStep),this.accumulatedTime-=this.timeStep;this.render(),this.rafId=requestAnimationFrame(this.mainLoop)});this.lastFrameTime=0,this.accumulatedTime=0,this.timeStep=1e3/60,this.update=t,this.render=e,this.rafId=null,this.isRunning=!1}start(){this.isRunning||(this.isRunning=!0,this.rafId=requestAnimationFrame(this.mainLoop))}stop(){this.rafId||cancelAnimationFrame(this.rafId),this.isRunning=!1}}class st{constructor(){_(this,"callbacks",[]);_(this,"nextId",0)}emit(t,e){this.callbacks.forEach(s=>{s.eventName===t&&s.callback(e)})}on(t,e,s){return this.nextId++,this.callbacks.push({id:this.nextId,eventName:t,caller:e,callback:s}),this.nextId}off(t){this.callbacks=this.callbacks.filter(e=>e.id!==t)}unsubscribe(t){this.callbacks=this.callbacks.filter(e=>e.caller!==t)}}const c=new st;class y{constructor({position:t}){this.position=t??new o(0,0),this.children=[],this.parent=null,this.hasBeenInitiated=!1,this.isSolid=!1,this.drawLayer=null}stepEntry(t,e){this.children.forEach(s=>s.stepEntry(t,e)),this.hasBeenInitiated||(this.hasBeenInitiated=!0,this.onInit()),this.step(t,e)}onInit(){}step(t){}draw(t,e,s){const i=e+this.position.x,r=s+this.position.y;this.drawImage(t,i,r),this.getDrawChildrenOrdered().forEach(a=>a.draw(t,i,r))}getDrawChildrenOrdered(){return[...this.children].sort((t,e)=>e.drawLayer==="FLOOR"||t.position.y>e.position.y?1:-1)}drawImage(t,e,s){}destroy(){this.children.forEach(t=>t.destroy()),this.parent&&this.parent.removeChild(this)}addChild(t){t.parent=this,this.children.push(t)}removeChild(t){c.unsubscribe(t),this.children=this.children.filter(e=>e!==t)}}class it extends y{constructor(){super({}),this.offset=new o(0,0),this.onInit()}onInit(){c.on("HERO_POSITION",this,t=>{t.focus&&this.centerPositionOnTarget(t.position)}),c.on("CHANGE_LEVEL",this,t=>{this.centerPositionOnTarget(t.heroStartPosition)})}centerPositionOnTarget(t){this.position=new o(-t.x+152,-t.y+82)}}class nt{constructor(){this.flags=new Map}add(t){this.flags.set(t,!0)}remove(t){this.flags.delete(t)}getRelevantScenario(t=[]){return t.find(e=>{const s=e.bypass??[];for(let r=0;r<s.length;r++){const a=s[r];if(this.flags.has(a))return!1}const i=e.requires??[];for(let r=0;r<i.length;r++){const a=i[r];if(!this.flags.has(a))return!1}return!0})}}const v="TALKED_TO_A",I="TALKED_TO_B",R=new nt;class rt{constructor(){this.toLoad={hero:"sprites/hero-sheet.png",shadow:"sprites/shadow.png",rod:"sprites/rod.png",exit:"sprites/exit.png",sky:"sprites/sky.png",ground:"sprites/ground.png",cave:"sprites/cave.png",caveGround:"sprites/cave-ground.png",knight:"sprites/knight-sheet-1.png",textBox:"sprites/text-box.png",portraits:"sprites/portraits-sheet.png",fontWhite:"sprites/sprite-font-white.png"},this.images={};var t="";try{t="/"+h.baseUrl+"/"+h.assetsPath+"/"}catch(e){console.log(e),t="/"+h.baseUrl+"/"+h.assetsPath+"/"}console.log(`"${t}"`),Object.keys(this.toLoad).forEach(e=>{const s=new Image;s.src=t+this.toLoad[e],this.images[e]={image:s,isLoaded:!1},s.onload=()=>{this.images[e].isLoaded=!0}})}}const g=new rt;class m extends y{constructor({resource:t,frameSize:e,hFrames:s,vFrames:i,frame:r,scale:a,position:l,animations:f}){super({position:l??new o(0,0)}),this.resource=t,this.frameSize=e??new o(h.sizes.gridSize,h.sizes.gridSize),this.hFrames=s??1,this.vFrames=i??1,this.frame=r??0,this.frameMap=new Map,this.scale=a??1,this.position=l??new o(0,0),this.animations=f??null,this.buildFrameMap()}buildFrameMap(){let t=0;for(let e=0;e<this.vFrames;e++)for(let s=0;s<this.hFrames;s++)this.frameMap.set(t,new o(s*this.frameSize.x,e*this.frameSize.y)),t++}step(t){this.animations&&(this.animations.step(t),this.frame=this.animations.frame)}drawImage(t,e,s){if(!this.resource.isLoaded)return;let i=0,r=0;const a=this.frameMap.get(this.frame);a&&(i=a.x,r=a.y);const l=this.frameSize.x,f=this.frameSize.y;t.drawImage(this.resource.image,i,r,l,f,e,s,l*this.scale,f*this.scale)}}class ot extends y{constructor(){super({position:new o(0,1)}),this.items=[],this.drawLayer="HUD",this.nextId=0,this.renderInventory()}renderInventory(){this.children.forEach(t=>t.destroy()),this.items.forEach((t,e)=>{const s=new m({resource:t.image,position:new o(e*12,0)});this.addChild(s)})}removeFromInventory(t){this.items=this.items.filter(e=>e.id!==t),this.renderInventory()}onInit(){c.on("HERO_PICK_UP_ITEM",this,t=>{this.items.push({id:this.nextId++,image:t.image}),console.log(this.items),this.renderInventory()})}}const at=5,d=new Map;d.set("i",2);d.set("j",4);d.set("l",3);d.set("r",4);d.set("t",4);d.set("u",4);d.set("v",4);d.set("x",4);d.set("y",4);d.set("z",4);d.set("E",4);d.set("F",4);d.set("M",7);d.set("W",7);d.set(" ",3);d.set("'",2);d.set("!",1);const ht=n=>d.get(n)??at,U=new Map;["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789 __",".!-,?'"].join("").split("").forEach((n,t)=>{U.set(n,t)});const ct=n=>U.get(n)??null,dt=4,lt=1,ut=3,mt=20,ft=1,pt=1;class gt extends y{constructor(t={}){super({position:new o(32,108)}),this.drawLayer="HUD";const e=t.string??"Default Text";this.words=e.split(" ").map(s=>{let i=0;const r=s.split("").map(a=>{const l=ht(a);return i+=l,{width:l,sprite:new m({resource:g.images.fontWhite,hFrames:13,vFrames:6,frame:ct(a)})}});return{wordWidth:i,chars:r}}),this.backdrop=new m({resource:g.images.textBox,frameSize:new o(256,64)}),t.portraitFrame!==null&&t.portraitFrame!==void 0?this.portrait=new m({resource:g.images.portraits,hFrames:4,vFrames:1,frame:t.portraitFrame??0}):this.portrait=null,this.showingIndex=0,this.finalIndex=this.words.reduce((s,i)=>s+i.chars.length,0),this.textSpeed=mt,this.timeUntilNextShow=this.textSpeed}step(t,e){const s=e.input;if(s!=null&&s.getActionJustPressed("Space")){if(this.showingIndex<this.finalIndex){this.showingIndex=this.finalIndex;return}c.emit("END_TEXT_BOX")}this.timeUntilNextShow-=t,this.timeUntilNextShow<=0&&(this.showingIndex+=pt,this.timeUntilNextShow+=this.textSpeed)}drawImage(t,e,s){this.backdrop.drawImage(t,e,s),this.portrait&&this.portrait.drawImage(t,e+6,s+6);const a=7,l=7,f=240,B=14,X=18,q=2;let L=a,N=l;this.portrait&&(L+=X,N+=q);let E=e+L,H=s+N,K=0;this.words.forEach(M=>{e+f-E<M.wordWidth&&(E=e+L,H+=B),M.chars.forEach(j=>{if(K>this.showingIndex)return;const{sprite:Y,width:$}=j,J=E-dt;Y.draw(t,J,H),E+=$+lt,K+=ft}),E+=ut})}}class wt extends y{constructor(){super({}),this.level=null,this.input=new tt,this.camera=new it}onInit(){const t=new ot;this.addChild(t),c.on("CHANGE_LEVEL",this,e=>{this.setLevel(e)}),c.on("HERO_REQUESTS_ACTION",this,e=>{if(typeof e.getContent=="function"){const s=e.getContent();if(!s)return;s.addsFlags&&s.addsFlags.forEach(l=>{R.add(l)}),s.removesFlags&&s.removesFlags.forEach(l=>{R.remove(l)});const i={string:s.string,portraitFrame:s.portraitFrame??null};let r=null;r=new gt(i),this.addChild(r),c.emit("START_TEXT_BOX");const a=c.on("END_TEXT_BOX",this,()=>{r.destroy(),c.off(a)})}})}setLevel(t){this.level&&this.level.destroy(),this.level=t,this.addChild(this.level)}drawBackground(t){var e;(e=this.level)==null||e.background.drawImage(t,0,0)}drawObjects(t){this.children.forEach(e=>{e.drawLayer!=="HUD"&&e.draw(t,0,0)})}drawForeground(t){this.children.forEach(e=>{e.drawLayer==="HUD"&&e.draw(t,0,0)})}}class yt extends y{constructor(){super({}),this.background=null,this.walls=new Set}}const u=n=>n*h.sizes.gridSize,Tt=(n,t,e)=>{t=Math.round(t),e=Math.round(e);const s=`${t},${e}`;return!n.has(s)},z=(n,t)=>{const e=h.sizes.gridSize,s=Math.round(n/e)*e,i=Math.round(t/e)*e;return new o(s,i)};class It{constructor(t){this.patterns=t,this.activeKey=Object.keys(t)[0]}get frame(){return this.patterns[this.activeKey].frame}play(t,e=0){this.activeKey!==t&&(this.activeKey=t,this.patterns[this.activeKey].currentTime=e)}step(t){this.patterns[this.activeKey].step(t)}}const k=(n=0)=>({duration:400,frames:[{time:0,frame:n+1}]}),O=(n=0)=>({duration:400,frames:[{time:0,frame:n+1},{time:100,frame:n},{time:200,frame:n+1},{time:300,frame:n+2}]}),Et=k(0),St=k(3),vt=k(6),xt=k(9),_t=O(0),Pt=O(3),Dt=O(6),Ft=O(9),bt={duration:400,frames:[{time:0,frame:12}]};class w{constructor(t){this.currentTime=0,this.animationConfig=t,this.duration=t.duration}get frame(){const{frames:t}=this.animationConfig;for(let e=t.length-1;e>=0;e--)if(this.currentTime>=t[e].time)return t[e].frame;throw"Time is less than 0 in FrameIndexPattern"}step(t){this.currentTime+=t,this.currentTime=this.currentTime%this.duration}}function kt(n,t,e){let s=t.x-n.position.x,i=t.y-n.position.y,r=Math.sqrt(s**2+i**2);if(r===0)return r;if(r<=e)return n.position.x=t.x,n.position.y=t.y,0;{Math.abs(s)<=e&&(n.position.x=t.x),Math.abs(i)<=e&&(n.position.y=t.y);let a=s/r,l=i/r;n.position.x+=a*e,n.position.y+=l*e,s=t.x-n.position.x,i=t.y-n.position.y,r=Math.sqrt(s**2+i**2)}return r}function Ot(n,t,e=void 0,s=1){t.x=Math.round(t.x),t.y=Math.round(t.y),e||(e=t);const i=Math.round(t.x),r=Math.round(t.y);return Math.abs(n.x-i)<=s&&Math.abs(n.y-r)<=s&&Math.abs(n.y-r)<=Math.abs(n.y-e.y)&&Math.abs(n.x-i)<=Math.abs(n.x-e.x)}class G extends y{constructor({position:t,body:e,speed:s=null}){super({position:t}),this.movementSpeed=s;const i=new m({resource:g.images.shadow,position:new o(-8,-19),frameSize:new o(32,32)});this.addChild(i),this.body=e,this.addChild(this.body)}}class Lt extends G{constructor(t,e,s=!0){const i=new m({resource:g.images.hero,hFrames:3,vFrames:8,frame:1,frameSize:new o(32,32),position:new o(-8,-20),animations:new It({walkDown:new w(_t),walkUp:new w(Dt),walkLeft:new w(Ft),walkRight:new w(Pt),standDown:new w(Et),standUp:new w(vt),standLeft:new w(xt),standRight:new w(St),pickupDown:new w(bt)})});super({position:new o(t,e),body:i,speed:1}),this.focus=s,this.isSolid=!0,this.facingDirection=x,this.destinationPosition=this.position.duplicate(),this.itemPickupTime=0,this.itemPickupShell=null,this.isLocked=!1,c.on("HERO_PICK_UP_ITEM",this,r=>{this.onPickUpItem(r)})}onInit(){c.on("START_TEXT_BOX",this,t=>{this.isLocked=!0}),c.on("END_TEXT_BOX",this,t=>{this.isLocked=!1})}step(t,e){if(this.isLocked)return;if(this.itemPickupTime>0){this.workOnItemPickup(t);return}const s=e.input;if(s!=null&&s.getActionJustPressed("Space")){const r=this.parent.children.find(a=>a.position.matches(this.position.toNeighbor(this.facingDirection)));r&&c.emit("HERO_REQUESTS_ACTION",r)}let i=!0;this.movementSpeed!=null&&(i=kt(this,this.destinationPosition,this.movementSpeed)<=1),i&&this.tryMove(e),this.tryEmitPosition()}tryEmitPosition(){this.lastPosition&&this.lastPosition.x===this.position.x&&this.lastPosition.y===this.position.y||(c.emit("HERO_POSITION",{position:this.position,initialPosition:!this.lastPosition,focus:this.focus}),this.lastPosition=this.position.duplicate())}onPickUpItem({image:t,position:e}){const s=this.position.duplicate();this.position=z(s.x,s.y),this.destinationPosition=this.position.duplicate(),this.itemPickupTime=500,this.itemPickupShell=new y({}),this.itemPickupShell.addChild(new m({resource:t,position:new o(0,-18)})),this.addChild(this.itemPickupShell)}tryMove(t){const{input:e}=t;if(!e)return;if(!e.direction){this.facingDirection===D?this.body.animations.play("standLeft"):this.facingDirection===F?this.body.animations.play("standRight"):this.facingDirection===b?this.body.animations.play("standUp"):this.facingDirection===x&&this.body.animations.play("standDown");return}let s=this.destinationPosition.x,i=this.destinationPosition.y;s=Math.round(s),i=Math.round(i);const r=h.sizes.gridSize;e.direction===D?(s-=r,this.body.animations.play("walkLeft")):e.direction===F?(s+=r,this.body.animations.play("walkRight")):e.direction===b?(i-=r,this.body.animations.play("walkUp")):e.direction===x&&(i+=r,this.body.animations.play("walkDown")),this.facingDirection=e.direction??this.facingDirection,Tt(t.level.walls,s,i)&&(this.parent.children.find(f=>f.isSolid&&f.position.x===s&&f.position.y===i)||(this.destinationPosition=z(s,i)))}workOnItemPickup(t){this.itemPickupTime-=t,this.body.animations.play("pickupDown"),this.itemPickupTime<=0&&(this.removeChild(this.itemPickupShell),this.itemPickupShell=null)}}class A extends y{constructor(t,e){super({position:new o(t,e)}),this.position=new o(t,e);const s=new m({resource:g.images.rod,position:new o(0,-2)});this.addChild(s)}onInit(){c.on("HERO_POSITION",this,t=>{Ot(this.position,t.position)&&this.onCollideWithHero()})}onCollideWithHero(){c.emit("HERO_PICK_UP_ITEM",{position:this.position,image:g.images.rod}),this.destroy()}}class W extends G{constructor(t,e,s={}){const i=new m({resource:g.images.knight,frameSize:new o(32,32),hFrames:2,vFrames:1,position:new o(-8,-20)});super({position:new o(t,e),body:i,speed:null}),this.isSolid=!0,this.textContent=s.content??"Default Text",this.textPortraitFrame=s.portraitFrame??null}getContent(){const t=R.getRelevantScenario(this.textContent);if(!t)return console.warn("No match found for this scenario",this.textContent),null;if(e=this.textPortraitFrame,t.portraitFrame!=null)var e=t.portraitFrame;return{string:t.string,portraitFrame:e,addsFlags:t.addsFlags??null,removesFlags:t.removesFlags??null}}}const At=new o(u(10),u(4));class Rt extends yt{constructor(t={}){super({}),this.background=new m({resource:g.images.sky,frameSize:new o(h.sizes.canvasWidth,h.sizes.canvasHeight)});const e=new m({resource:g.images.ground,frameSize:new o(h.sizes.canvasWidth,h.sizes.canvasHeight)});this.addChild(e);const s=new A(u(11),u(3));this.addChild(s),this.addChild(new A(u(12),u(3))),this.addChild(new A(u(13),u(3)));const i=new W(u(6),u(3),{content:[{string:"Hallo mijn naam is Gamemeneer en in Minecraft bouw ik boten.",addsFlags:[v],bypass:[v]},{string:"Ik ben bruin, als ik door de modder rol.",requires:[v],addsFlags:[I],bypass:[I]},{string:"Slippers aan, voel me net een blinde mol.",requires:[I],removesFlags:[I]}],portraitFrame:1}),r=new W(u(7),u(2),{content:[{string:"You see a man who is waiting for the grass to grow.",portraitFrame:null,bypass:[v]},{string:"Jij bent mijn Henk!",requires:[v],bypass:[I],portraitFrame:0},{string:"...",requires:[I],portraitFrame:1}]});this.addChild(i),this.addChild(r),this.heroStartPosition=t.heroPosition??At;const a=new Lt(this.heroStartPosition.x,this.heroStartPosition.y,!0);this.addChild(a),this.walls.add("64,48"),this.walls.add("64,64"),this.walls.add("64,80"),this.walls.add("80,64"),this.walls.add("80,80"),this.walls.add("112,80"),this.walls.add("128,80"),this.walls.add("144,80"),this.walls.add("160,80")}onInit(){c.on("HERO_EXITS",this,()=>{c.emit("CHANGE_LEVEL",new CaveLevel1({heroPosition:new o(u(4),u(5))}))})}}const C=document.querySelector("#game-canvas"),T=C.getContext("2d"),p=new wt({position:new o(0,0)});p.setLevel(new Rt);const Ct=n=>{var t;p.stepEntry(n,p),(t=p.input)==null||t.update()},Nt=()=>{T.clearRect(0,0,C.width,C.height),p.drawBackground(T),T.save(),p.camera&&T.translate(p.camera.position.x,p.camera.position.y),p.drawObjects(T,0,0),T.restore(),p.drawForeground(T)},Ht=new et(Ct,Nt);Ht.start();
