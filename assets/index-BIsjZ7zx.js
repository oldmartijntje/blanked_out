var Z=Object.defineProperty;var V=(c,e,t)=>e in c?Z(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var o=(c,e,t)=>(V(c,typeof e!="symbol"?e+"":e,t),t);import tt from"https://esm.sh/mqtt@5.10.3";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const d={baseUrl:"blanked_out",assetsPath:"assets",keys:{upKeys:["ArrowUp","KeyW"],downKeys:["ArrowDown","KeyS"],leftKeys:["ArrowLeft","KeyA"],rightKeys:["ArrowRight","KeyD"],zoomMinus:["NumpadSubtract"],zoomPlus:["NumpadAdd"]},sizes:{gridSize:64,BackgroundWidth:1280,BackgroundHeight:1280},MQTT:{"brokerUrl+port":"test.mosquitto.org:8081",topicBase:"https://oldmartijntje.github.io/blanked_out/",lobbyTopic:"https://oldmartijntje.github.io/blanked_out/discovery"}};class et{constructor(){o(this,"callbacks",[]);o(this,"nextId",0)}emit(e,t){this.callbacks.forEach(s=>{s.eventName===e&&s.callback(t)})}on(e,t,s){return this.nextId++,this.callbacks.push({id:this.nextId,eventName:e,caller:t,callback:s}),this.nextId}off(e){this.callbacks=this.callbacks.filter(t=>t.id!==e)}unsubscribe(e){this.callbacks=this.callbacks.filter(t=>t.caller!==e)}}const h=new et;class a{}o(a,"PLAYER_PICK_UP_ITEM","PLAYER_PICK_UP_ITEM"),o(a,"CHANGE_SCENE","CHANGE_SCENE"),o(a,"START_TEXT_BOX","START_TEXT_BOX"),o(a,"END_TEXT_BOX","END_TEXT_BOX"),o(a,"CAMERA_POSITION","CAMERA_POSITION"),o(a,"DO_ACTION_ON_COORDINATE","DO_ACTION_ON_COORDINATE"),o(a,"USER_CLICK_CANVAS","USER_CLICK_CANVAS"),o(a,"USER_DOUBLE_CLICK_CANVAS","USER_DOUBLE_CLICK_CANVAS"),o(a,"LOBBY_FOUND","LOBBY_FOUND"),o(a,"SETUP_MQTT_CONNECTOR","SETUP_MQTT_CONNECTOR"),o(a,"CLOSE_MQTT_CONNECTOR","CLOSE_MQTT_CONNECTOR"),o(a,"SET_DATA","SET_DATA"),o(a,"GET_DATA","GET_DATA"),o(a,"SET_DEEP_DATA","SET_DEEP_DATA"),o(a,"GET_DEEP_DATA","GET_DEEP_DATA");const X="LEFT",Y="RIGHT",H="UP",K="DOWN",j="Space",k="ZOOM_MINUS",P="ZOOM_PLUS",M=.05,w=.25,B=3,O={UP:d.keys.upKeys,DOWN:d.keys.downKeys,LEFT:d.keys.leftKeys,RIGHT:d.keys.rightKeys,SPACE:[j],ZOOM_MINUS:d.keys.zoomMinus,ZOOM_PLUS:d.keys.zoomPlus},_=[X,Y,H,K,j,k,P];class st{constructor(){this.heldDirections=[],this.keys={},this.lastKeys={},this.camera,this.canvas,this.isDragging=!1,this.startX=0,this.startY=0,this.lastX=0,this.lastY=0,this.lastTouchDistance=0,this.isZoomLimitReached=!1,this.dragStartTime,document.addEventListener("keydown",e=>{this.keys[e.code]=!0,this.getDirection(e.code,!0)}),document.addEventListener("keyup",e=>{this.keys[e.code]=!1,this.getDirection(e.code,!1)}),document.addEventListener("DOMContentLoaded",()=>{for(const e of Object.keys(O))for(const t of O[e]){const s=document.querySelectorAll(`.${t}.gameController`);for(const i of s)i.addEventListener("mousedown",()=>{_.includes(e)&&this.onKeyPressed(e),this.keys[t]=!0}),i.addEventListener("mouseup",()=>{_.includes(e)&&this.onKeyReleased(e),this.keys[t]=!1}),i.addEventListener("touchstart",n=>{n.preventDefault(),_.includes(e)&&this.onKeyPressed(e),this.keys[t]=!0}),i.addEventListener("touchend",n=>{n.preventDefault(),_.includes(e)&&this.onKeyReleased(e),this.keys[t]=!1})}})}get direction(){return this.heldDirections[0]}getDirection(e,t){for(const s of Object.keys(O))O[s].includes(e)&&_.includes(s)&&(t?this.onKeyPressed(s):this.onKeyReleased(s))}update(){this.lastKeys={...this.keys},this.heldDirections.length>0&&(this.heldDirections[0]===k||this.heldDirections[0]===P)&&this.camera&&(this.heldDirections[0]===k&&this.camera.zoom>w?this.camera.zoom-=M/2:this.heldDirections[0]===P&&this.camera.zoom<B&&(this.camera.zoom+=M/2))}getActionJustPressed(e){let t=!1;return this.keys[e]&&!this.lastKeys[e]&&(t=!0),t}onKeyPressed(e){this.heldDirections.includes(e)||this.heldDirections.unshift(e)}onKeyReleased(e){const t=this.heldDirections.indexOf(e);t>-1&&this.heldDirections.splice(t,1)}onPointerDown(e){this.isDragging=!0,e.touches?(this.lastX=e.touches[0].clientX,this.lastY=e.touches[0].clientY):(this.lastX=e.clientX,this.lastY=e.clientY),this.dragStartTime=new Date().getTime()}onPointerMove(e,t){if(!this.isDragging)return;let s,i;e.touches?(s=e.touches[0].clientX,i=e.touches[0].clientY):(s=e.clientX,i=e.clientY);const n=(s-this.lastX)/t.zoom,r=(i-this.lastY)/t.zoom;t.position.x+=n,t.position.y+=r,this.lastX=s,this.lastY=i}onPointerUp(e,t){new Date().getTime()-this.dragStartTime<200&&!this.isZoomLimitReached&&this.handleClick(e,t),this.isDragging=!1}onWheel(e,t){e.preventDefault();const s=e.deltaY<0?1+M:1-M;t.zoom*=s,t.zoom=Math.max(w,Math.min(B,t.zoom))}onTouchStart(e){if(e.touches.length===2){e.preventDefault();const t=e.touches[0],s=e.touches[1];this.lastTouchDistance=Math.hypot(s.clientX-t.clientX,s.clientY-t.clientY)}else e.touches.length===1&&(this.isDragging=!0,this.lastX=e.touches[0].clientX,this.lastY=e.touches[0].clientY,this.dragStartTime=new Date().getTime())}onTouchMove(e,t){if(e.touches.length===2){e.preventDefault();const s=e.touches[0],i=e.touches[1],n=Math.hypot(i.clientX-s.clientX,i.clientY-s.clientY);if(this.lastTouchDistance>0){const r=n/this.lastTouchDistance,l=t.zoom*r;if(l>=w&&l<=B){canvas.getBoundingClientRect();const g=(s.clientX+i.clientX)/2,y=(s.clientY+i.clientY)/2,L=(g-canvas.width/2)/t.zoom+t.position.x,N=(y-canvas.height/2)/t.zoom+t.position.y;t.zoom=l;const I=(g-canvas.width/2)/t.zoom+t.position.x,D=(y-canvas.height/2)/t.zoom+t.position.y;t.position.x+=L-I,t.position.y+=N-D}}this.lastTouchDistance=n}else if(e.touches.length===1&&this.isDragging){const s=e.touches[0].clientX,i=e.touches[0].clientY,n=(s-this.lastX)/t.zoom,r=(i-this.lastY)/t.zoom;t.position.x+=n,t.position.y+=r,this.lastX=s,this.lastY=i}}onTouchEnd(e,t){e.touches.length<2&&(this.lastTouchDistance=0,this.isZoomLimitReached=!1),new Date().getTime()-this.dragStartTime<200&&!this.isZoomLimitReached&&e.touches.length===0&&this.handleClick(e,t),e.touches.length===0&&(this.isDragging=!1)}handleClick(e,t,s=a.USER_CLICK_CANVAS){if(!this.canvas)return;const i=this.canvas.getBoundingClientRect(),n=(e.clientX||e.touches[0].clientX)-i.left,r=(e.clientY||e.touches[0].clientY)-i.top,l=(n-this.canvas.width/2)/t.zoom-t.position.x,g=(r-this.canvas.height/2)/t.zoom-t.position.y;h.emit(s,{x:l,y:g})}registerMouseMovement(e,t){this.canvas=e,this.camera=t,e.addEventListener("mousedown",s=>{this.onPointerDown(s)}),e.addEventListener("mousemove",s=>{this.onPointerMove(s,t)}),e.addEventListener("mouseup",s=>{this.onPointerUp(s,t)}),e.addEventListener("mouseleave",s=>{this.onPointerUp(s,t)}),e.addEventListener("dblclick",s=>{this.handleClick(s,t,a.USER_DOUBLE_CLICK_CANVAS)}),e.addEventListener("wheel",s=>{this.onWheel(s,t)},{passive:!1}),e.addEventListener("touchstart",s=>{this.onTouchStart(s)},{passive:!1}),e.addEventListener("touchmove",s=>{this.onTouchMove(s,t)},{passive:!1}),e.addEventListener("touchend",s=>{this.onTouchEnd(s,t)})}}class m{constructor(e=0,t=0){this.x=e,this.y=t}duplicate(){return new m(this.x,this.y)}matches(e){return this.x===e.x&&this.y===e.y}toString(){return`Vector2(${this.x}, ${this.y})`}toNeighbor(e){let t=this.x,s=this.y;switch(e){case H:s-=d.sizes.gridSize;break;case K:s+=d.sizes.gridSize;break;case X:t-=d.sizes.gridSize;break;case Y:t+=d.sizes.gridSize;break}if(t==this.x&&s==this.y)throw new Error("Invalid direction "+e+" for "+this.toString());return new m(t,s)}}class it{constructor(e,t){o(this,"mainLoop",e=>{if(!this.isRunning)return;let t=e-this.lastFrameTime;for(this.lastFrameTime=e,this.accumulatedTime+=t;this.accumulatedTime>=this.timeStep;)this.update(this.timeStep),this.accumulatedTime-=this.timeStep;this.render(),this.rafId=requestAnimationFrame(this.mainLoop)});this.lastFrameTime=0,this.accumulatedTime=0,this.timeStep=1e3/60,this.update=e,this.render=t,this.rafId=null,this.isRunning=!1}start(){this.isRunning||(this.isRunning=!0,this.rafId=requestAnimationFrame(this.mainLoop))}stop(){this.rafId||cancelAnimationFrame(this.rafId),this.isRunning=!1}}class T{constructor({position:e}){this.position=e??new m(0,0),this.children=[],this.parent=null,this.hasBeenInitiated=!1,this.isSolid=!1,this.drawLayer=null}stepEntry(e,t){this.children.forEach(s=>s.stepEntry(e,t)),this.hasBeenInitiated||(this.hasBeenInitiated=!0,this.onInit()),this.step(e,t)}onInit(){}step(e,t){}draw(e,t,s){const i=t+this.position.x,n=s+this.position.y;this.drawImage(e,i,n),this.getDrawChildrenOrdered().forEach(r=>r.draw(e,i,n))}getDrawChildrenOrdered(){return[...this.children].sort((e,t)=>t.drawLayer==="FLOOR"||e.position.y>t.position.y?1:-1)}drawImage(e,t,s){}destroy(){this.children.forEach(e=>e.destroy()),this.parent&&this.parent.removeChild(this)}addChild(e){e.parent=this,this.children.push(e)}removeChild(e){h.unsubscribe(e),this.children=this.children.filter(t=>t!==e)}}class nt extends T{constructor(){super({});o(this,"zoom",1);this.zoom=.5,this.offset=new m(0,0),this.onInit()}onInit(){h.on(a.CAMERA_POSITION,this,t=>{t.focus&&this.centerPositionOnTarget(t.position)}),h.on(a.CHANGE_SCENE,this,t=>{this.centerPositionOnTarget(t.heroStartPosition)})}centerPositionOnTarget(t){this.position=new m(-t.x+632,-t.y+632)}}class ot{constructor(){this.flags=new Map}add(e){this.flags.set(e,!0)}remove(e){this.flags.delete(e)}getRelevantScenario(e=[]){return e.find(t=>{const s=t.bypass??[];for(let n=0;n<s.length;n++){const r=s[n];if(this.flags.has(r))return!1}const i=t.requires??[];for(let n=0;n<i.length;n++){const r=i[n];if(!this.flags.has(r))return!1}return!0})}}const U=new ot;class rt{constructor(){this.toLoad={hero:"sprites/hero-sheet.png",shadow:"sprites/shadow.png",rod:"sprites/rod.png",exit:"sprites/exit.png",sky:"sprites/sky.png",ground:"sprites/ground.png",cave:"sprites/cave.png",caveGround:"sprites/cave-ground.png",knight:"sprites/knight-sheet-1.png",textBox:"sprites/text-box.png",portraits:"sprites/portraits-sheet.png",fontWhite:"sprites/sprite-font-white.png"},this.images={};var e="";try{e="/"+d.baseUrl+"/"+d.assetsPath+"/"}catch(t){console.log(t),e="/"+d.baseUrl+"/"+d.assetsPath+"/"}console.log(`"${e}"`),Object.keys(this.toLoad).forEach(t=>{const s=new Image;s.src=e+this.toLoad[t],this.images[t]={image:s,isLoaded:!1},s.onload=()=>{this.images[t].isLoaded=!0}})}}const v=new rt;class S extends T{constructor({resource:e,frameSize:t,hFrames:s,vFrames:i,frame:n,scale:r,position:l,animations:g}){super({position:l??new m(0,0)}),this.resource=e,this.frameSize=t??new m(d.sizes.gridSize,d.sizes.gridSize),this.hFrames=s??1,this.vFrames=i??1,this.frame=n??0,this.frameMap=new Map,this.scale=r??1,this.position=l??new m(0,0),this.animations=g??null,this.buildFrameMap()}buildFrameMap(){let e=0;for(let t=0;t<this.vFrames;t++)for(let s=0;s<this.hFrames;s++)this.frameMap.set(e,new m(s*this.frameSize.x,t*this.frameSize.y)),e++}step(e){this.animations&&(this.animations.step(e),this.frame=this.animations.frame)}drawImage(e,t,s){if(!this.resource.isLoaded)return;let i=0,n=0;const r=this.frameMap.get(this.frame);r&&(i=r.x,n=r.y);const l=this.frameSize.x,g=this.frameSize.y;e.drawImage(this.resource.image,i,n,l,g,t,s,l*this.scale,g*this.scale)}}class at extends T{constructor(){super({position:new m(0,1)}),this.items=[],this.drawLayer="HUD",this.nextId=0,this.renderInventory()}renderInventory(){this.children.forEach(e=>e.destroy()),this.items.forEach((e,t)=>{const s=new S({resource:e.image,position:new m(t*12,0)});this.addChild(s)})}removeFromInventory(e){this.items=this.items.filter(t=>t.id!==e),this.renderInventory()}onInit(){h.on(a.PLAYER_PICK_UP_ITEM,this,e=>{this.items.push({id:this.nextId++,image:e.image}),console.log(this.items),this.renderInventory()})}}const ct=5,u=new Map;u.set("i",2);u.set("j",4);u.set("l",3);u.set("r",4);u.set("t",4);u.set("u",4);u.set("v",4);u.set("x",4);u.set("y",4);u.set("z",4);u.set("E",4);u.set("F",4);u.set("M",7);u.set("W",7);u.set(" ",3);u.set("'",2);u.set("!",1);const lt=c=>u.get(c)??ct,G=new Map;["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789 __",".!-,?'"].join("").split("").forEach((c,e)=>{G.set(c,e)});const ht=c=>G.get(c)??null,dt=4,ut=1,mt=3,gt=20,ft=1,pt=1;class Et extends T{constructor(e={}){super({position:new m(32,108)}),this.drawLayer="HUD";const t=e.string??"Default Text";this.words=t.split(" ").map(s=>{let i=0;const n=s.split("").map(r=>{const l=lt(r);return i+=l,{width:l,sprite:new S({resource:v.images.fontWhite,hFrames:13,vFrames:6,frame:ht(r)})}});return{wordWidth:i,chars:n}}),this.backdrop=new S({resource:v.images.textBox,frameSize:new m(256,64)}),e.portraitFrame!==null&&e.portraitFrame!==void 0?this.portrait=new S({resource:v.images.portraits,hFrames:4,vFrames:1,frame:e.portraitFrame??0}):this.portrait=null,this.showingIndex=0,this.finalIndex=this.words.reduce((s,i)=>s+i.chars.length,0),this.textSpeed=gt,this.timeUntilNextShow=this.textSpeed}step(e,t){const s=t.input;if(s!=null&&s.getActionJustPressed("Space")){if(this.showingIndex<this.finalIndex){this.showingIndex=this.finalIndex;return}h.emit(a.END_TEXT_BOX)}this.timeUntilNextShow-=e,this.timeUntilNextShow<=0&&(this.showingIndex+=pt,this.timeUntilNextShow+=this.textSpeed)}drawImage(e,t,s){this.backdrop.drawImage(e,t,s),this.portrait&&this.portrait.drawImage(e,t+6,s+6);const r=7,l=7,g=240,y=14,L=18,N=2;let I=r,D=l;this.portrait&&(I+=L,D+=N);let b=t+I,R=s+D,x=0;this.words.forEach(F=>{t+g-b<F.wordWidth&&(b=t+I,R+=y),F.chars.forEach(Q=>{if(x>this.showingIndex)return;const{sprite:q,width:$}=Q,J=b-dt;q.draw(e,J,R),b+=$+ut,x+=ft}),b+=mt})}}class Tt extends T{constructor(){super({}),this.level=null,this.input=new st,this.camera=new nt}onInit(){h.on(a.USER_CLICK_CANVAS,this,t=>{console.log(t,1)}),h.on(a.USER_DOUBLE_CLICK_CANVAS,this,t=>{console.log(t,2)});const e=new at;this.addChild(e),h.on(a.CHANGE_SCENE,this,t=>{this.setLevel(t)}),h.on(a.DO_ACTION_ON_COORDINATE,this,t=>{if(typeof t.getContent=="function"){const s=t.getContent();if(!s)return;s.addsFlags&&s.addsFlags.forEach(l=>{U.add(l)}),s.removesFlags&&s.removesFlags.forEach(l=>{U.remove(l)});const i={string:s.string,portraitFrame:s.portraitFrame??null};let n=null;n=new Et(i),this.addChild(n),h.emit(a.START_TEXT_BOX);const r=h.on(a.END_TEXT_BOX,this,()=>{n.destroy(),h.off(r)})}})}registerMouseMovement(e){this.input.registerMouseMovement(e,this.camera)}setLevel(e){this.level&&this.level.destroy(),this.level=e,this.addChild(this.level)}drawBackground(e){var t;(t=this.level)==null||t.background.drawImage(e,0,0)}drawObjects(e){this.children.forEach(t=>{t.drawLayer!=="HUD"&&t.draw(e,0,0)})}drawForeground(e){this.children.forEach(t=>{t.drawLayer==="HUD"&&t.draw(e,0,0)})}}class yt extends T{constructor(){super({}),this.background=null,this.walls=new Set}}class A{}o(A,"I_AM_A_LOBBY","Stone Age"),o(A,"CONNECTION_REQUEST","Getting an Upgrade");const It="wss://"+d.MQTT["brokerUrl+port"];class W{constructor(){o(this,"deviceIdentifier");o(this,"ALPHANUMERIC","ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");o(this,"client");o(this,"username","");o(this,"creationIdentifier",this.getRandomIdentifier(8));var e=localStorage.getItem("deviceIdentifier");e?this.deviceIdentifier=e:(this.deviceIdentifier=this.getRandomIdentifier(32),localStorage.setItem("deviceIdentifier",this.deviceIdentifier)),this.client=tt.connect(It),this.client.on("connect",()=>{console.log("Connected to MQTT broker")}),this.client.on("message",(t,s)=>{this.onReceivedMessage(t,s)}),h.emit(a.GET_DATA,{key:"username",onSuccess:t=>{this.username=t,console.log("Username:",this.username)},onError:()=>{this.username="Player"+(Math.floor(Math.random()*89999)+1e4),h.emit(a.SET_DATA,{key:"username",value:this.username})}})}onReceivedMessage(e,t){}getRandomIdentifier(e=8){return Array.from({length:e},()=>this.ALPHANUMERIC[Math.floor(Math.random()*this.ALPHANUMERIC.length)]).join("")}publishMessage(e,t){e=d.MQTT.topicBase+e,this.client.publish(e,t,{},s=>{s?console.error("Publish error:",s):console.log(`Message sent to ${e}: ${t}`)})}subscribeToTopic(e){e=d.MQTT.topicBase+e,this.client.subscribe(e,t=>{t?console.error("Subscribe error:",t):console.log(`Subscribed to topic: ${e}`)})}unsubscribeFromTopic(e){e=d.MQTT.topicBase+e,this.client.unsubscribe(e,t=>{t?console.error("Unsubscribe error:",t):console.log(`Unsubscribed from topic: ${e}`)})}resetMqtt(){}}class z extends W{constructor(){super();o(this,"openLobbies",{})}onReceivedMessage(t,s){try{var i=JSON.parse(s)}catch(n){console.log("Error parsing message:",n);return}i.Protocol==A.I_AM_A_LOBBY?(this.openLobbies[i.LobbyId]={date:new Date,...i},h.emit(a.LOBBY_FOUND,this.openLobbies)):i.Protocol==A.CONNECTION_REQUEST,console.log("Received message:",t,i)}discoveryTopic(t=!1){const s=d.MQTT.lobbyTopic;t?this.unsubscribeFromTopic(s):this.subscribeToTopic(s)}resetMqtt(){this.client.end()}}class bt extends W{constructor(){super();o(this,"openLobbies",{});o(this,"pingInterval");console.log(this.creationIdentifier),this.pingInterval=setInterval(()=>{console.log("Ping"),this.publishMessage(d.MQTT.lobbyTopic,JSON.stringify({Protocol:A.I_AM_A_LOBBY,LobbyId:this.creationIdentifier,Username:this.username,playersConnected:0,Settings:{}}))},5e3)}onReceivedMessage(t,s){try{var i=JSON.parse(s)}catch(n){console.log("Error parsing message:",n);return}}resetMqtt(){this.client.end(),clearInterval(this.pingInterval)}}class _t extends yt{constructor(t={}){super({});o(this,"menu");o(this,"campaignButton");o(this,"onlineButton");o(this,"offlineButton");o(this,"originalButton");o(this,"homeModal");o(this,"onlineMultiplayerModal");o(this,"lobbiesFound");o(this,"joinButton");o(this,"hostButton");o(this,"backButtons",[]);o(this,"joinModal");o(this,"hostModal");o(this,"usernameField");o(this,"client");o(this,"lobbyHostId");o(this,"amountOfLobbies",0);o(this,"lobbiesInDiscovery",{});o(this,"discoveryAccordion");this.background=new S({resource:v.images.sky,frameSize:new m(d.sizes.BackgroundWidth,d.sizes.BackgroundHeight),scale:8}),this.menu=document.getElementById("homeMenu"),this.menu.style.display="block",this.campaignButton=document.getElementById("campaignButton"),this.onlineButton=document.getElementById("onlineMultiplayerButton"),this.offlineButton=document.getElementById("offlineMultiplayerButton"),this.originalButton=document.getElementById("originalButton"),this.onlineButton.addEventListener("click",()=>{this.clickedButton("online")}),this.offlineButton.addEventListener("click",()=>{this.clickedButton("offline")}),this.originalButton.addEventListener("click",()=>{this.clickedButton("original")}),this.campaignButton.addEventListener("click",()=>{this.clickedButton("campaign")}),this.homeModal=document.getElementById("homeModal"),this.homeModal.style.display="block",this.onlineMultiplayerModal=document.getElementById("onlineMultiplayerModal"),this.onlineMultiplayerModal.style.display="none",this.lobbiesFound=document.getElementById("lobbiesFound"),this.joinButton=document.getElementById("joinButton"),this.hostButton=document.getElementById("hostButton"),this.joinButton.addEventListener("click",()=>{this.clickedButton("join")}),this.hostButton.addEventListener("click",()=>{this.clickedButton("host")}),this.backButtons=document.getElementsByClassName("backButton"),this.discoveryAccordion=document.getElementById("discoveryAccordion");for(let s=0;s<this.backButtons.length;s++)this.backButtons[s].addEventListener("click",()=>{this.clickedButton("back")});this.joinModal=document.getElementById("joinModal"),this.joinModal.style.display="none",this.hostModal=document.getElementById("hostModal"),this.hostModal.style.display="none",this.usernameField=document.getElementById("usernameField"),this.usernameField.addEventListener("change",()=>{this.changeUsername()}),this.lobbyHostId=document.getElementById("lobbyHostId")}changeUsername(){var t=this.usernameField.value;if(t.length>20){this.usernameField.value=this.client.username;return}else if(t.length<4){this.usernameField.value=this.client.username;return}this.client.username=t,h.emit(a.SET_DATA,{key:"username",value:this.client.username}),this.client.username=this.usernameField.value}onInit(){this.client=new z,this.client.discoveryTopic(),h.emit(a.SETUP_MQTT_CONNECTOR,this.client),h.on(a.LOBBY_FOUND,this,t=>{this.amountOfLobbies=Object.keys(t).length,this.lobbiesFound.innerHTML=this.amountOfLobbies,JSON.stringify(Object.keys(t))!==JSON.stringify(Object.keys(this.lobbiesInDiscovery))&&(this.lobbiesInDiscovery=t,this.discoveryAccordion.innerHTML="",Object.keys(t).forEach(s=>{var i=document.createElement("div");i.className="accordion-item";var n=document.createElement("h2");n.className="accordion-header";var r=document.createElement("button");r.className="accordion-button",r.type="button",r.setAttribute("data-bs-toggle","collapse"),r.setAttribute("data-bs-target","#collapse"+s),r.setAttribute("aria-controls","collapse"+s),r.innerHTML=`${t[s].Username} (${t[s].playersConnected}/2)`,n.appendChild(r),i.appendChild(n);var l=document.createElement("div");l.id="collapse"+s,l.className="accordion-collapse collapse",l.setAttribute("aria-labelledby","heading"+s),l.setAttribute("data-bs-parent","#discoveryAccordion");var g=document.createElement("div");g.className="accordion-body",g.innerHTML=`Host: ${t[s].Username}<br>Players: ${t[s].playersConnected}/2<br>Id: ${s}<br><button id="joinLobby${s}" class="btn btn-primary">Join</button>`,l.appendChild(g),i.appendChild(l),this.discoveryAccordion.appendChild(i);var y=document.getElementById("joinLobby"+s);y.addEventListener("click",()=>{})}))})}clickedButton(t){console.log(t),t==="online"?(this.usernameField.value=this.client.username,this.setModalAsActive("online")):t==="back"?(this.client=new z,this.client.discoveryTopic(),h.emit(a.SETUP_MQTT_CONNECTOR,this.client),this.setModalAsActive("home")):t==="host"?(this.client=new bt,this.lobbyHostId.innerHTML=this.client.creationIdentifier,h.emit(a.SETUP_MQTT_CONNECTOR,this.client),this.setModalAsActive("host")):t==="join"&&this.setModalAsActive("join")}setModalAsActive(t){t=="join"?this.joinModal.style.display="block":this.joinModal.style.display="none",t=="host"?this.hostModal.style.display="block":this.hostModal.style.display="none",t=="home"?this.homeModal.style.display="block":this.homeModal.style.display="none",t=="online"?this.onlineMultiplayerModal.style.display="block":this.onlineMultiplayerModal.style.display="none"}destroy(){this.children.forEach(t=>t.destroy()),this.parent&&this.parent.removeChild(this),this.menu.removeEventListener("click"),this.campaignButton.removeEventListener("click"),this.onlineButton.removeEventListener("click"),this.offlineButton.removeEventListener("click"),this.originalButton.removeEventListener("click")}}class St extends T{constructor(){super({});o(this,"data");o(this,"timeSinceLastSave",0);var t=localStorage.getItem("playerData");if(t)try{this.data=JSON.parse(t)}catch(s){console.error("Error parsing playerData:",s),this.data={}}else this.data={},localStorage.setItem("playerData",JSON.stringify(this.data))}onInit(){h.on(a.SET_DEEP_DATA,this,t=>{const s=t.key.split("."),i=t.value;let n=this.data;try{for(let r=0;r<s.length-1;r++)n[s[r]]||(n[s[r]]={}),n=n[s[r]];n[s[s.length-1]]=i,this.saveData()}catch(r){console.error("Error setting data:",r),t.onError&&t.onError()}}),h.on(a.GET_DEEP_DATA,this,t=>{const s=t.key.split(".");let i=this.data;try{for(let n=0;n<s.length;n++)i=i[s[n]];t.onSuccess&&t.onSuccess(i)}catch(n){console.error("Error getting data:",n),t.onError&&t.onError()}}),h.on(a.SET_DATA,this,t=>{this.data[t.key]=t.value,this.saveData()}),h.on(a.GET_DATA,this,t=>{this.data[t.key]?t.onSuccess(this.data[t.key]):t.onError&&t.onError()})}step(t){this.timeSinceLastSave++,this.timeSinceLastSave>1e3&&this.saveData()}saveData(){localStorage.setItem("playerData",JSON.stringify(this.data)),this.timeSinceLastSave=0}addData(t){this.data.push(t)}getData(){return this.data}}const E=document.querySelector("#game-canvas"),p=E.getContext("2d"),At=new St;var C=null;h.on(a.SETUP_MQTT_CONNECTOR,void 0,c=>{C&&C.resetMqtt(),C=c});h.on(a.CLOSE_MQTT_CONNECTOR,void 0,()=>{C.resetMqtt()});const f=new Tt({position:new m(0,0)});f.addChild(At);f.setLevel(new _t);f.registerMouseMovement(E);const Dt=c=>{var e;f.stepEntry(c,f),(e=f.input)==null||e.update()},Mt=()=>{p.clearRect(0,0,E.width,E.height),f.drawBackground(p),p.save(),f.camera&&(p.translate(E.width/2,E.height/2),p.scale(f.camera.zoom,f.camera.zoom),p.translate(-E.width/2+f.camera.position.x,-E.height/2+f.camera.position.y)),f.drawObjects(p,0,0),p.restore(),f.drawForeground(p)},Ot=new it(Dt,Mt);Ot.start();
