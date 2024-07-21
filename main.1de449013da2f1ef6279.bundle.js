(()=>{"use strict";var e,t={809:(e,t,i)=>{i(440);class s extends Phaser.Scene{constructor(){super({key:"BootScene"})}preload(){this.cameras.main.setBackgroundColor(10016391),this.createLoadingbar(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(16774867,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)})),this.load.on("complete",(()=>{this.progressBar.destroy(),this.loadingBar.destroy()})),this.load.pack("preload","./assets/pack.json","preload"),this.load.pack("explodeParticle","./assets/explodePack.json","explodeParticle"),this.load.image("smokeParticle","./assets/images/Particle Effect Textures/smoke.png"),this.load.image("LineWithBluredEdges","./assets/images/Particle Effect Textures/LineWithBluredEdges.png"),this.load.image("background","./assets/images/BackgroundWithThrone.jpg"),this.load.image("board","./assets/images/Level1-Board.png"),this.load.image("particle","./assets/images/CircleWithOutwardsLines.png"),this.load.image("singleRocket","./assets/images/Boosters/SingleRocket.png"),this.load.image("horizontalRocket","./assets/images/Boosters/HorizontalRocket.png"),this.load.image("verticalRocket","./assets/images/Boosters/VerticalRocket.png"),this.load.image("lightBall","./assets/images/Boosters/Light Ball.png"),this.load.image("tileOutline","./assets/images/tileOutline.png"),this.load.image("canon","./assets/images/canonUI.png"),this.load.image("progressBar","./assets/images/ui/bar_1.png"),this.load.image("progressFill","./assets/images/ui/bar_2.png"),this.load.image("menu","./assets/images/ui/f.png"),this.load.spritesheet("confetti","./assets/images/confetti.png",{frameWidth:16,frameHeight:16})}update(){this.scene.start("GameScene")}createLoadingbar(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(6139463,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}let l={score:0,highscore:0,boardTileSize:0,gridWidth:8,gridHeight:10,tileWidth:48,tileHeight:48,swapSpeed:200,destroySpeed:100,fallSpeed:200,TRANSITION_DELAY:8e3,HINT_APPEAR:5e3,candyTypes:["blueItem","greenItem","redItem","purpleItem","yellowItem"],GRID_OFFSET_X:0,GRID_OFFSET_Y:0,backgroundWidth:0,backgroundHeight:0,backgroundX:0,backgroundY:0};const r={blueItem:"blueExplode",greenItem:"greenExplode",redItem:"redExplode",purpleItem:"purpleExplode",yellowItem:"yellowExplode"},o=class{constructor(e){this.scene=e}createExplosionParticles(e,t,i){const s=r[i];this.scene.add.particles(e,t,s,{angle:{min:0,max:360},lifespan:1e3,speed:150,gravityY:800,scale:{start:.05,end:0,ease:"Sine.easeInOut"}}).explode(7)}};class n extends Phaser.GameObjects.Sprite{constructor(e,t,i,s){super(e,t,i,s),this.explodeEmitter=new o(e),this.currentScene=e,this.setOrigin(0,0),this.setInteractive(),this.setSize(l.tileWidth,l.tileHeight),this.setScale(.7),this.scene.add.existing(this)}destroyTile(){this.destroyTween(),this.destroy(),this.currentScene.scoreManager.addScore(100)}destroyTween(){const e=this.scene;if(void 0!==this){const{x:t,y:i}=e.getTilePos(e.tileGrid,this);e.add.particles(0,0,"particle",{x:e.tileGrid[i][t].x+l.tileWidth/2,y:e.tileGrid[i][t].y+l.tileHeight/2,angle:{min:0,max:360},lifespan:250,speed:100,quantity:10,gravityY:150,scale:{start:.15,end:.02,ease:"Sine.easeInOut"},duration:10}),this.explodeEmitter.createExplosionParticles(e.tileGrid[i][t].x+l.tileWidth/2,e.tileGrid[i][t].y+l.tileHeight/2,e.tileGrid[i][t].texture.key)}}}const h=n;class a extends h{constructor(e,t,i,s){super(e,t,i,"HORIZONTAL"===s?"horizontalRocket":"verticalRocket"),this.firstTweens=[],this.secondTweens=[],this.smokeEmitter=null,this.direction=s}destroyTile(){this.destroyRocket()}destroyRocket(){var e;const t=this.currentScene,{x:i,y:s}=t.getTilePos(t.tileGrid,this);if(this.explodeEffect(),"HORIZONTAL"===this.direction){const e={value:l.gridWidth-1};for(let r=1;r<l.gridWidth;r++)this.addDestroyTweens(t,this.secondTweens,s,i+r,e),this.addDestroyTweens(t,this.firstTweens,s,i-r,e)}else if("VERTICAL"===this.direction){const e={value:l.gridHeight-1};for(let r=1;r<l.gridHeight;r++)this.addDestroyTweens(t,this.secondTweens,s+r,i,e),this.addDestroyTweens(t,this.firstTweens,s-r,i,e)}this.firstTweens.length>0&&t.tweens.chain({tweens:this.firstTweens,loop:!1}),this.secondTweens.length>0&&t.tweens.chain({tweens:this.secondTweens,loop:!1}),null===(e=t.tileGrid[s][i])||void 0===e||e.destroy()}addDestroyTweens(e,t,i,s,l){var r,o;if(this.isPosValid(i,s)){const n=e.tileGrid[i][s];n&&t.push({targets:e.tileGrid[i][s],x:null===(r=e.tileGrid[i][s])||void 0===r?void 0:r.x,y:null===(o=e.tileGrid[i][s])||void 0===o?void 0:o.y,duration:100,onComplete:()=>{n instanceof g?l.value--:n instanceof a&&n.direction===this.direction?(l.value--,n.destroy(),e.tileGrid[i][s]=void 0):n instanceof a&&n.direction!==this.direction?(null==n||n.destroyTile(),e.tileGrid[i][s]=void 0):(l.value--,null==n||n.destroyTile(),e.tileGrid[i][s]=void 0),0===l.value&&e.stateMachine.transition("fill")}})}}isPosValid(e,t){return!(e<0||e>=l.gridHeight||t<0||t>=l.gridWidth)}explodeEffect(){const e=this.scene,{x:t,y:i}=e.getTilePos(e.tileGrid,this);this.createSingleRocket(t,i,-1),this.createSingleRocket(t,i,1),this.destroy()}createSingleRocket(e,t,i){const s=this.scene,r=e*l.tileWidth+l.GRID_OFFSET_X+l.tileWidth/2,o=t*l.tileHeight+l.GRID_OFFSET_Y+l.tileHeight/2,n=s.add.image(r,o,"singleRocket");let h,a,d;n.setScale(1,.55),n.setOrigin(.5),"HORIZONTAL"===this.direction?(h=i>0?s.cameras.main.width:0,a=o,d=i>0?180:0):(h=r,a=i>0?s.cameras.main.height:0,d=i>0?270:90),n.setAngle(d);const c=s.add.particles(r,o,"smokeParticle",{colorEase:"quad.out",speed:{min:10,max:50},scale:{start:.6,end:0,ease:"sine.in"},angle:d,quantity:.5});s.tweens.add({targets:n,x:h,y:a,duration:800,ease:"Linear",onUpdate:(e,t)=>{let s=t.x,r=t.y;"HORIZONTAL"===this.direction?s=i>0?t.x-22:t.x+22:r=i>0?t.y-22:t.y+22,c.setPosition(s,r),(s<l.backgroundX||s>l.backgroundX+l.backgroundWidth||r<l.backgroundY||r>l.backgroundY+l.backgroundHeight)&&(n.destroy(),c.destroy(),e.stop())},onComplete:()=>{n.destroy(),c.destroy()}})}swapWithRocket(e){const t=this.currentScene;this.explodeCross(),t.time.delayedCall(600,(()=>{t.stateMachine.transition("fill")}))}swapWithBall(e){const t=this.currentScene,{x:i,y:s}=t.getTilePos(t.tileGrid,this);this.explodeEffect(),"HORIZONTAL"===this.direction?this.explodeRows(s-1,s+1):this.explodeColumns(i-1,i+1),e.destroy(),t.time.delayedCall(600,(()=>{t.stateMachine.transition("fill")}))}explodeCross(){const e=this.currentScene,{x:t,y:i}=e.getTilePos(e.tileGrid,this);this.explodeRow(i),this.explodeColumn(t)}explodeRows(e,t){for(let i=e;i<=t;i++)i>=0&&i<l.gridHeight&&this.explodeRow(i)}explodeColumns(e,t){for(let i=e;i<=t;i++)i>=0&&i<l.gridWidth&&this.explodeColumn(i)}explodeRow(e){const t=this.currentScene;for(let i=0;i<l.gridWidth;i++){const s=t.tileGrid[e][i];s instanceof a||s instanceof g?(s.destroy(),t.tileGrid[e][i]=void 0):s&&(s.destroyTile(),t.tileGrid[e][i]=void 0)}}explodeColumn(e){const t=this.currentScene;for(let i=0;i<l.gridHeight;i++){const s=t.tileGrid[i][e];s instanceof a||s instanceof g?(s.destroy(),t.tileGrid[i][e]=void 0):s&&(s.destroyTile(),t.tileGrid[i][e]=void 0)}}}const d=a;class c extends h{constructor(e,t,i){super(e,t,i,"lightBall"),this.connections=[]}destroyTile(){const e=this.scene,t=e.firstSelectedTile instanceof c?e.secondSelectedTile:e.firstSelectedTile;console.trace(),t?this.destroyMatchingTiles(t.texture.key):super.destroyTile()}destroyMatchingTiles(e){const t=this.findMatchingTiles(e);this.createConnectionEffects(t)}findMatchingTiles(e){const t=this.scene,i=[];for(let s=0;s<l.gridHeight;s++)for(let r=0;r<l.gridWidth;r++){const l=t.tileGrid[s][r];l&&l.texture.key===e&&i.push(l)}return i}createConnectionEffects(e){const t=this.scene,i=[];e.forEach(((s,l)=>{const r=t.add.line(0,0,this.x+16,this.y+16,s.x+16,s.y+16,16777215);r.setOrigin(0,0),r.setAlpha(0),r.setLineWidth(2),this.connections.push(r),i.push({targets:r,alpha:1,duration:50,onComplete:()=>{l===e.length-1&&this.createExplosionEffects(e)}})})),t.tweens.chain({tweens:i})}createExplosionEffects(e){const t=this.scene;e.forEach((e=>{const i=t.getTilePos(t.tileGrid,e);e.destroyTile(),t.tileGrid[i.y][i.x]=void 0})),this.destroy(),this.connections.forEach((e=>e.destroy())),t.time.delayedCall(600,(()=>{t.stateMachine.transition("fill")}))}swapWithBall(e){this.explodeAll(),e.destroy()}explodeAll(){const e=this.currentScene;for(let t=0;t<l.gridHeight;t++)for(let i=0;i<l.gridWidth;i++){const s=e.tileGrid[t][i];s instanceof d||s instanceof c?(s.destroy(),e.tileGrid[t][i]=void 0):s&&(s.destroyTile(),e.tileGrid[t][i]=void 0)}e.time.delayedCall(600,(()=>{e.stateMachine.transition("fill")}))}}const g=c;class p extends Phaser.GameObjects.Container{constructor(e){super(e),this.scoreManager=e.scoreManager;const t=this.scoreManager.getMilestone();this.scoreManager.getScore(),this.milestoneText=e.add.text(l.GRID_OFFSET_X,l.GRID_OFFSET_Y-100,`TARGET: ${t}`,{fontSize:"36px",color:"#000",fontStyle:"bold"}),this.progressBar=this.scene.add.image(l.GRID_OFFSET_X,l.GRID_OFFSET_Y-50,"progressBar"),this.progressBar.setOrigin(0),this.progressBar.setScale(.25),this.progressFill=this.scene.add.image(l.GRID_OFFSET_X-3,l.GRID_OFFSET_Y-50,"progressFill"),this.progressFill.setOrigin(0),this.progressFill.setScale(.25),this.cropRect=new Phaser.Geom.Rectangle(0,0,0,this.progressFill.height),this.progressFill.setCrop(this.cropRect),Phaser.Display.Align.In.LeftCenter(this.progressFill,this.progressBar,-3,0),this.add(this.milestoneText),this.add(this.progressBar),this.add(this.progressFill),e.add.existing(this)}update(){const e=this.scoreManager.getMilestone(),t=this.scoreManager.getScore();this.scene.tweens.add({targets:this.cropRect,width:this.progressFill.width*(t%e/e),duration:100,yoyo:!0,repeat:0}),this.progressFill.setCrop(this.cropRect),this.milestoneText.setText(`TARGET: ${e}`)}}const f=p,u=class{constructor(e,t){this.scene=e,this.score=0,this.scoreText=this.scene.add.text(l.GRID_OFFSET_X+320,l.GRID_OFFSET_Y-40,`${this.score}`,{fontSize:"48px",color:"#000",fontStyle:"bold",align:"center"}),this.scoreText.setOrigin(.5),this.milestone=t}addScore(e){this.score+=e,this.scene.tweens.add({targets:this.scoreText,scale:1.2,duration:100,yoyo:!0,repeat:0})}getMilestone(){return this.milestone}setMilestone(e){this.milestone=e}getScore(){return this.score}update(){this.scoreText.setText(`${this.score}`)}},T=class{},m=class extends T{constructor(e){super(),this.scene=e,this.isFilled=!1}enter(){console.log("FillState"),this.scene.makeTilesFall(),this.scene.replenishField()}exit(){this.isFilled=!1}execute(e,t){this.scene.tileGrid.every((e=>e.every((e=>e&&"replenished"==e.state))))&&this.stateMachine.transition("match")}},y=class extends T{constructor(e){super(),this.scene=e}enter(){console.log("MatchState"),this.scene.matchInBoard()?this.scene.handleMatches():(this.scene.canPick=!0,this.scene.firstSelectedTile=void 0,this.scene.secondSelectedTile=void 0,this.stateMachine.transition("play"))}exit(){}execute(e,t){}},x=class extends T{constructor(e){super(),this.elapsedTime=0,this.scene=e,this.elapsedTime=0,this.scene.input.on("gameobjectdown",(()=>{this.elapsedTime=0}),this)}enter(){console.log("PlayState"),this.elapsedTime=0,this.scene.canPick=!0,this.scene.scoreManager.getScore()>=this.scene.scoreManager.getMilestone()&&(this.scene.scoreManager.setMilestone(this.scene.scoreManager.getMilestone()+5e3),this.stateMachine.transition("shuffle"));const e=this.scene.getHint();if(0===e.length)this.stateMachine.transition("shuffle");else{const t=e[Phaser.Math.Between(0,e.length-1)],i=this.scene.firstHintBox,s=this.scene.secondHintBox;i.x=t.x1*l.tileWidth+l.GRID_OFFSET_X,i.y=t.y1*l.tileHeight+l.GRID_OFFSET_Y,s.x=t.x2*l.tileWidth+l.GRID_OFFSET_X,s.y=t.y2*l.tileHeight+l.GRID_OFFSET_Y}}exit(){this.elapsedTime=0,this.scene.firstHintBox.setVisible(!1),this.scene.secondHintBox.setVisible(!1)}execute(e,t){if(this.elapsedTime>l.HINT_APPEAR&&(this.scene.firstHintBox.setVisible(!0),this.scene.secondHintBox.setVisible(!0)),this.elapsedTime>=l.TRANSITION_DELAY){const e=this.scene.tileGrid;for(let t=0;t<e.length;t++)for(let i=0;i<e[t].length;i++)e[t][i]&&this.scene.tweens.add({targets:e[t][i],displayWidth:l.tileWidth,displayHeight:l.tileHeight,ease:"Sine.easeInOut",duration:200,delay:50*t+50*i,yoyo:!0,repeat:0});this.elapsedTime=0}else this.elapsedTime+=t}},S=class extends T{constructor(e){super(),this.scene=e,this.tiles=e.tiles,this.setupConfetti()}setupConfetti(){this.confetti=this.scene.add.particles(0,0,"confetti",{frequency:10,lifespan:{min:8e3,max:12e3},speedY:{min:-4e3,max:-2e3},speedX:{min:-400,max:400},angle:{min:-85,max:-95},gravityY:2e3,frame:{frames:[0,2,4,6,8,10,12,14,16],cycle:!0},quantity:{min:80,max:120},emitting:!1,scale:{start:.8,end:.2},scaleX:{onEmit:()=>1,onUpdate:e=>Math.cos(2*Math.PI*8*e.lifeT)},rotate:{onEmit:()=>0,onUpdate:e=>1440*Math.sign(e.velocityX)*e.lifeT},accelerationX:{onEmit:()=>0,onUpdate:e=>-e.velocityX*Phaser.Math.Between(0,1)},accelerationY:{onEmit:()=>0,onUpdate:e=>-e.velocityY*Phaser.Math.Between(3,4)}}),this.confetti.setDepth(1e3)}enter(){console.log("Shuffle State"),this.showLevelCompleteMessage(),this.explodeConfetti(),this.scene.shuffleTiles(),this.scene.canPick=!1,this.animateTilesCircle()}explodeConfetti(){const{width:e,height:t}=this.scene.cameras.main;this.confetti.explode(200,e/2,t)}showLevelCompleteMessage(){const{levelComplete:e,tweens:t}=this.scene;e.setVisible(!0).setAlpha(0),t.add({targets:e,alpha:1,scale:1,duration:300,ease:"Quint.easeIn",onComplete:()=>{this.scene.time.delayedCall(1500,(()=>{t.add({targets:e,alpha:0,scale:.5,duration:300,ease:"Quint.easeIn",onComplete:()=>e.setVisible(!1).setActive(!1)})}))}})}animateTilesCircle(){const e=this.scene.tiles,{width:t,height:i}=this.scene.cameras.main,s=t/2-20,l=i/2+50,r=Math.min(t,i)/5,o=new Phaser.Geom.Circle(s,l,r);Phaser.Actions.PlaceOnCircle(e,o),this.scene.tweens.add({targets:o,radius:r,ease:"Quintic.easeInOut",duration:2e3,yoyo:!1,repeat:1,onUpdate:()=>{Phaser.Actions.RotateAroundDistance(e,o,.02,o.radius)},onComplete:()=>this.moveTilesToNewPositions()})}moveTilesToNewPositions(){const e=this.scene.tiles;e.forEach(((t,i)=>{const s=t,r=i%l.gridWidth,o=Math.floor(i/l.gridWidth),n=r*l.tileWidth+l.GRID_OFFSET_X,h=o*l.tileHeight+l.GRID_OFFSET_Y;this.scene.tweens.add({targets:s,x:n,y:h,duration:1e3,ease:"Power2",onComplete:()=>{i===e.length-1&&(this.scene.stateMachine.transition("match"),this.scene.canPick=!0)}})}))}exit(){}execute(e,t){}},w=class{constructor(e,t={},i=[]){this.initialState=e,this.possibleStates=t,this.stateArgs=i,this.state=null;for(const e of Object.values(this.possibleStates))e.stateMachine=this}update(e,t){null===this.state&&(this.state=this.initialState,this.possibleStates[this.state].enter()),this.possibleStates[this.state].execute(e,t)}transition(e,...t){this.state&&this.possibleStates[this.state].exit(),this.state=e,this.possibleStates[this.state].enter()}getState(){return this.state}};class G extends Phaser.GameObjects.Container{constructor(e,t,i){super(e,t,i),this.background=e.add.sprite(0,0,"menu").setScale(.25,.2),this.levelCompleteText=e.add.text(0,0,"Level Complete!!!",{font:"36px Arial",color:"#e67300"}),Phaser.Display.Align.In.Center(this.levelCompleteText,this.background,0,0),this.add([this.background,this.levelCompleteText]),this.setVisible(!1),this.setSize(this.background.displayWidth,this.background.displayHeight),this.setDepth(2),e.add.existing(this)}}const v=G;class M extends Phaser.Scene{constructor(){super({key:"GameScene"})}create(){const e=this.cameras.main.height,t=this.cameras.main.width,i=this.add.image(0,0,"background"),s=e/i.height;i.setScale(.5,s),i.setPosition(t/2,e/2),l.backgroundWidth=i.displayWidth,l.backgroundHeight=i.displayHeight,l.backgroundX=i.x-i.displayWidth/2,l.backgroundY=i.y-i.displayHeight/2;const r=this.add.image(0,0,"board");r.setScale(.75),r.setPosition(t/2,3*e/5),function(e,t){const i=window.innerWidth/2-199.5,s=3*window.innerHeight/5-247.5,r=l.gridWidth*l.tileWidth,o=l.gridHeight*l.tileHeight;l.GRID_OFFSET_X=i+(399-r)/2+2,l.GRID_OFFSET_Y=s+(495-o)/2+2,l.boardTileSize=384/l.gridWidth}(),this.canPick=!0,this.dragging=!1,this.firstSelectedTile=void 0,this.secondSelectedTile=void 0,this.scoreManager=new u(this,1e3),this.milestone=new f(this),this.tiles=[],this.levelComplete=new v(this,t/2,e/2),this.isMatchSpecial=!1,this.firstHintBox=this.add.graphics(),this.firstHintBox.lineStyle(3,40831),this.firstHintBox.strokeRect(0,0,l.tileWidth-5,l.tileHeight-5),this.firstHintBox.setVisible(!1),this.secondHintBox=this.add.graphics(),this.secondHintBox.lineStyle(3,40831),this.secondHintBox.strokeRect(0,0,l.tileWidth-5,l.tileHeight-5),this.secondHintBox.setVisible(!1),this.tweens.add({targets:this.firstHintBox,alpha:0,ease:"Sine.easeInOut",duration:700,repeat:-1,yoyo:!0}),this.tweens.add({targets:this.secondHintBox,alpha:0,ease:"Sine.easeInOut",duration:700,repeat:-1,yoyo:!0}),this.drawField(),this.stateMachine=new w("play",{play:new x(this),shuffle:new S(this),match:new y(this),fill:new m(this)}),this.input.on("gameobjectdown",this.tileSelect,this),this.input.on("gameobjectmove",this.startSwipe,this),this.input.on("pointerup",this.stopSwipe,this)}update(e,t){this.stateMachine.update(e,t),this.milestone.update()}shuffleTiles(){const e=this.tileGrid.flat().filter((e=>void 0!==e));Phaser.Utils.Array.Shuffle(e);let t=0;for(let i=0;i<l.gridHeight;i++)for(let s=0;s<l.gridWidth;s++)void 0!==this.tileGrid[i][s]&&(this.tileGrid[i][s]=e[t],t++);this.tiles=e}drawField(){this.tileGrid=[];for(let e=0;e<l.gridHeight;e++){this.tileGrid[e]=[];for(let t=0;t<l.gridWidth;t++){let i,s=t*l.tileWidth+l.GRID_OFFSET_X,r=e*l.tileHeight+l.GRID_OFFSET_Y;do{this.tileGrid[e][t]&&this.tileGrid[e][t].destroy();let o=l.candyTypes[Phaser.Math.RND.between(0,l.candyTypes.length-1)];i=new h(this,s,r,o),i.state="replenished",this.tileGrid[e][t]=i,this.tiles.push(i)}while(this.isMatch(e,t))}}}isMatch(e,t){return this.isHorizontalMatch(e,t)||this.isVerticalMatch(e,t)}isHorizontalMatch(e,t){var i,s,l,r;return(null===(i=this.tileAt(e,t))||void 0===i?void 0:i.texture.key)==(null===(s=this.tileAt(e,t-1))||void 0===s?void 0:s.texture.key)&&(null===(l=this.tileAt(e,t))||void 0===l?void 0:l.texture.key)==(null===(r=this.tileAt(e,t-2))||void 0===r?void 0:r.texture.key)}isVerticalMatch(e,t){var i,s,l,r;return(null===(i=this.tileAt(e,t))||void 0===i?void 0:i.texture.key)==(null===(s=this.tileAt(e-1,t))||void 0===s?void 0:s.texture.key)&&(null===(l=this.tileAt(e,t))||void 0===l?void 0:l.texture.key)==(null===(r=this.tileAt(e-2,t))||void 0===r?void 0:r.texture.key)}tileAt(e,t){if(!(e<0||e>=l.gridHeight||t<0||t>=l.gridWidth))return this.tileGrid[e][t]}tileSelect(e,t,i){if(this.canPick){this.dragging=!0;let e=t;e&&(this.selectionTween&&this.selectionTween.destroy(),this.selectionTween=this.tweens.add({targets:e,scale:.75,duration:300,yoyo:!0,repeat:-1}),this.firstSelectedTile?this.areTheSame(e,this.firstSelectedTile)?(this.selectionTween&&this.selectionTween.destroy(),this.firstSelectedTile.setScale(.7),this.firstSelectedTile=void 0):this.areNext(e,this.firstSelectedTile)?(this.firstSelectedTile.setScale(.7),this.secondSelectedTile=e,this.swapTiles(this.firstSelectedTile,this.secondSelectedTile,!0)):(this.firstSelectedTile.setScale(.7),this.firstSelectedTile=e):(e.setDepth(1),this.firstSelectedTile=e))}}startSwipe(e,t,i){if(this.dragging&&null!=this.firstSelectedTile){let t=e.downX-e.x,i=e.downY-e.y,s=0,r=0;if(t>l.tileWidth/2&&Math.abs(i)<l.tileHeight/4&&(r=-1),t<-l.tileWidth/2&&Math.abs(i)<l.tileHeight/4&&(r=1),i>l.tileWidth/2&&Math.abs(t)<l.tileHeight/4&&(s=-1),i<-l.tileWidth/2&&Math.abs(t)<l.tileHeight/4&&(s=1),s+r!=0){const e=this.getTilePos(this.tileGrid,this.firstSelectedTile);this.secondSelectedTile=this.tileAt(e.y+s,e.x+r),this.secondSelectedTile&&(this.swapTiles(this.firstSelectedTile,this.secondSelectedTile,!0),this.dragging=!1)}this.firstSelectedTile.setScale(.7)}}stopSwipe(){this.dragging=!1}areTheSame(e,t){const i=this.getTilePos(this.tileGrid,e),s=this.getTilePos(this.tileGrid,t);return i.x==s.x&&i.y==s.y}areNext(e,t){const i=this.getTilePos(this.tileGrid,e),s=this.getTilePos(this.tileGrid,t);return Math.abs(i.x-s.x)+Math.abs(i.y-s.y)==1}getTilePos(e,t){let i={x:-1,y:-1};for(let s=0;s<e.length;s++)for(let l=0;l<e[s].length;l++)if(t===e[s][l]){i.x=l,i.y=s;break}return i}swapTiles(e,t,i){this.swappingTiles=2,this.canPick=!1;const s=this.getTilePos(this.tileGrid,e),l=this.getTilePos(this.tileGrid,t);this.tileGrid[s.y][s.x]=t,this.tileGrid[l.y][l.x]=e,this.tweenTile(e,t,i),this.selectionTween&&this.selectionTween.destroy()}tweenTile(e,t,i){const s=this.getTilePos(this.tileGrid,e),r=this.getTilePos(this.tileGrid,t);this.tweens.add({targets:this.tileGrid[s.y][s.x],x:null==t?void 0:t.x,y:null==t?void 0:t.y,duration:l.swapSpeed,onComplete:()=>{this.swappingTiles--}}),this.tweens.add({targets:this.tileGrid[r.y][r.x],x:null==e?void 0:e.x,y:null==e?void 0:e.y,duration:l.swapSpeed,callbackScope:this,onComplete:()=>{this.swappingTiles--,0==this.swappingTiles&&(e instanceof d&&t instanceof d?e.swapWithRocket(t):e instanceof d&&t instanceof g?e.swapWithBall(t):e instanceof g&&t instanceof d?t.swapWithBall(e):e instanceof g&&t instanceof g?e.swapWithBall(t):!this.matchInBoard()&&i?this.swapTiles(e,t,!1):this.stateMachine.transition("match"))}})}matchInBoard(){if(this.firstSelectedTile instanceof d||this.secondSelectedTile instanceof d||this.firstSelectedTile instanceof g||this.secondSelectedTile instanceof g)return!0;for(let e=0;e<l.gridHeight;e++)for(let t=0;t<l.gridWidth;t++)if(this.isMatch(e,t))return!0;return!1}handleMatches(){console.log("handle match"),this.isMatchSpecial=!1,this.removeMap=[];for(let e=0;e<l.gridHeight;e++){this.removeMap[e]=[];for(let t=0;t<l.gridWidth;t++)this.removeMap[e].push(0)}for(let e=0;e<l.gridHeight;e++)for(let t=0;t<l.gridWidth;t++){const{isMatch:i,tilesToRemove:s}=this.checkTLMatch(e,t);if(i)return void this.createBallTile(e,t,s)}if(this.firstSelectedTile instanceof d||this.secondSelectedTile instanceof d||this.firstSelectedTile instanceof g||this.secondSelectedTile instanceof g){if(console.log("match special"),this.firstSelectedTile instanceof d||this.firstSelectedTile instanceof g){const e=this.getTilePos(this.tileGrid,this.firstSelectedTile);this.removeMap[e.y][e.x]++}if(this.secondSelectedTile instanceof d||this.secondSelectedTile instanceof g){const e=this.getTilePos(this.tileGrid,this.secondSelectedTile);this.removeMap[e.y][e.x]++}}else this.markMatches("HORIZONTAL"),this.markMatches("VERTICAL");this.destroyTiles()}checkTLMatch(e,t){var i;const s=null===(i=this.tileGrid[e][t])||void 0===i?void 0:i.texture.key;if(!s)return{isMatch:!1,tilesToRemove:[]};let l=[];const r=(e,t,i,l)=>{let r=0;for(;this.matchType(e+i*r,t+l*r,s);)r++;return r-1},o=r(e,t,-1,0),n=r(e,t,1,0),h=r(e,t,0,-1),a=r(e,t,0,1),d=o+n+1,c=h+a+1;if(d>=3&&c>=3&&d+c>=7){l.push({row:e,col:t});for(let i=1;i<=o;i++)l.push({row:e-i,col:t});for(let i=1;i<=n;i++)l.push({row:e+i,col:t});for(let i=1;i<=h;i++)l.push({row:e,col:t-i});for(let i=1;i<=a;i++)l.push({row:e,col:t+i});return{isMatch:!0,tilesToRemove:l}}const g=[{v:o,h:a},{v:o,h},{v:n,h:a},{v:n,h}];for(const{v:i,h:s}of g)if(i+1>=3&&s+1>=3){l.push({row:e,col:t});const r=i===o?-1:1,n=s===a?1:-1;for(let s=1;s<=i;s++)l.push({row:e+s*r,col:t});for(let i=1;i<=s;i++)l.push({row:e,col:t+i*n});return{isMatch:!0,tilesToRemove:l}}return{isMatch:!1,tilesToRemove:[]}}createBallTile(e,t,i){const s=t*l.tileWidth+l.GRID_OFFSET_X,r=e*l.tileHeight+l.GRID_OFFSET_Y;let o=i.length;this.scoreManager.addScore(100*o),i.forEach((({row:i,col:n})=>{this.tileGrid[i]&&this.tileGrid[i][n]&&this.tweens.add({targets:this.tileGrid[i][n],x:s,y:r,duration:l.swapSpeed,onComplete:()=>{var l;null===(l=this.tileGrid[i][n])||void 0===l||l.destroy(),this.tileGrid[i][n]=void 0,o--,0===o&&(this.tileGrid[e][t]=new g(this,s,r),this.tileGrid[e][t].state="replenished",this.isMatchSpecial=!0,this.stateMachine.transition("fill"))}})}))}markMatches(e){if(console.log("markMatches"),"HORIZONTAL"===e)for(let t=0;t<l.gridHeight;t++){let i=1,s="",r=0,o="";for(let n=0;n<l.gridWidth;n++)o=this.tileGrid[t][n]?this.tileGrid[t][n].texture.key:"",o==s&&i++,o==s&&n!=l.gridWidth-1||(i>=3&&"horizontalRocket"!==s&&this.handleMatchStreak(r,n,t,i,e),r=n,i=1,s=o)}else for(let t=0;t<l.gridWidth;t++){let i=1,s="",r=0,o="";for(let n=0;n<l.gridHeight;n++)o=this.tileGrid[n][t]?this.tileGrid[n][t].texture.key:"",o==s&&i++,o==s&&n!=l.gridHeight-1||(i>=3&&"horizontalRocket"!==s&&this.handleMatchStreak(r,n,t,i,e),r=n,i=1,s=o)}}specialTileAppearancePosition(e,t,i,s,l){if(void 0===this.firstSelectedTile)return"HORIZONTAL"===l?{row:i,col:e}:{row:e,col:i};{const t=this.getTilePos(this.tileGrid,this.firstSelectedTile),s=this.getTilePos(this.tileGrid,this.secondSelectedTile);if("HORIZONTAL"===l){if(t.y===i)return{row:i,col:t.x};if(s.y===i)return{row:i,col:s.x}}else{if(t.x===i)return{row:t.y,col:i};if(s.x===i)return{row:s.y,col:i}}return"HORIZONTAL"===l?{row:i,col:e}:{row:e,col:i}}}handleMatchStreak(e,t,i,s,r){if(console.log("handleMatchStreak"),s>=4){this.isMatchSpecial=!0;const{row:o,col:n}=this.specialTileAppearancePosition(e,t,i,s,r),h=n*l.tileWidth+l.GRID_OFFSET_X,a=o*l.tileHeight+l.GRID_OFFSET_Y;let c=s;this.scoreManager.addScore(100*c);for(let t=0;t<s;t++){const p="HORIZONTAL"===r?i:e+t,f="HORIZONTAL"===r?e+t:i;this.tileGrid[p][f]&&this.tweens.add({targets:this.tileGrid[p][f],x:"HORIZONTAL"===r?h:this.tileGrid[p][f].x,y:"HORIZONTAL"===r?this.tileGrid[p][f].y:a,duration:l.swapSpeed,onComplete:()=>{var e;null===(e=this.tileGrid[p][f])||void 0===e||e.destroy(),this.tileGrid[p][f]=void 0,c--,0===c&&(this.tileGrid[o][n]=4===s?new d(this,h,a,r):new g(this,h,a),this.tileGrid[o][n].state="replenished",this.stateMachine.transition("fill"))}})}}else for(let t=0;t<s;t++)"HORIZONTAL"===r?this.removeMap[i][e+t]++:this.removeMap[e+t][i]++}matchType(e,t,i){return!(t<0||t>=l.gridWidth||e<0||e>=l.gridHeight||!this.tileGrid[e][t]||this.tileGrid[e][t].texture.key!==i)}destroyTiles(){let e=!1;for(let t=0;t<l.gridHeight;t++)for(let i=0;i<l.gridWidth;i++)if(this.removeMap[t][i]>0){const s=this.tileGrid[t][i];(s instanceof d||s instanceof g)&&(e=!0),null==s||s.destroyTile(),this.tileGrid[t][i]=void 0}this.firstSelectedTile=void 0,this.secondSelectedTile=void 0,e||this.isMatchSpecial||this.stateMachine.transition("fill"),this.scoreManager.update()}getHint(){const e=[];for(let t=0;t<l.gridHeight;t++)for(let i=0;i<l.gridWidth;i++){if(i<l.gridWidth-1){let s=this.tileGrid[t][i];this.tileGrid[t][i]=this.tileGrid[t][i+1],this.tileGrid[t][i+1]=s,this.matchInBoard()&&e.push({x1:i,x2:i+1,y1:t,y2:t}),s=this.tileGrid[t][i],this.tileGrid[t][i]=this.tileGrid[t][i+1],this.tileGrid[t][i+1]=s}if(t<l.gridHeight-1){let s=this.tileGrid[t][i];this.tileGrid[t][i]=this.tileGrid[t+1][i],this.tileGrid[t+1][i]=s,this.matchInBoard()&&e.push({x1:i,x2:i,y1:t,y2:t+1}),s=this.tileGrid[t][i],this.tileGrid[t][i]=this.tileGrid[t+1][i],this.tileGrid[t+1][i]=s}}return e}makeTilesFall(){console.log("makeTilesFall");for(let e=l.gridHeight-2;e>=0;e--)for(let t=0;t<l.gridWidth;t++)if(this.tileGrid[e][t]){let i=this.holesBelow(e,t);i>0&&(this.tileGrid[e][t].state="moved",this.tweens.add({targets:this.tileGrid[e][t],y:this.tileGrid[e][t].y+i*l.tileHeight,duration:l.fallSpeed*i,onComplete:()=>{this.tileGrid[e][t].state="replenished",this.tileGrid[e+i][t].state="replenished"},onStart:()=>{this.tileGrid[e][t].state="moving"}}),this.tileGrid[e+i][t]=this.tileGrid[e][t],this.tileGrid[e][t]=void 0)}}holesBelow(e,t){let i=0;for(let s=e+1;s<l.gridHeight;s++)void 0===this.tileGrid[s][t]&&i++;return i}holesInCol(e){var t=0;for(let i=0;i<l.gridHeight;i++)null==this.tileGrid[i][e]&&t++;return t}replenishField(){return e=this,t=void 0,s=function*(){console.log("replenishField"),this.firstSelectedTile=void 0,this.secondSelectedTile=void 0;for(let e=0;e<l.gridWidth;e++){let t=this.holesInCol(e);if(t>0)for(let i=0;i<t;i++){let s=l.candyTypes[Phaser.Math.RND.between(0,l.candyTypes.length-1)];this.tileGrid[i][e]=new h(this,e,i,s),this.tileGrid[i][e].x=l.tileWidth*e+l.GRID_OFFSET_X,this.tileGrid[i][e].y=-(t-i)*l.tileHeight+l.GRID_OFFSET_Y,this.tileGrid[i][e].visible=!1;let r=l.fallSpeed*t;r>1e3&&(r=1e3),this.tweens.add({targets:this.tileGrid[i][e],y:l.tileHeight*i+l.GRID_OFFSET_Y,duration:r,callbackScope:this,onUpdate:()=>{this.tileGrid[i][e].y>=l.GRID_OFFSET_Y&&(this.tileGrid[i][e].visible=!0)},onComplete:()=>{this.tileGrid[i][e].state="replenished"}})}}},new((i=void 0)||(i=Promise))((function(l,r){function o(e){try{h(s.next(e))}catch(e){r(e)}}function n(e){try{h(s.throw(e))}catch(e){r(e)}}function h(e){var t;e.done?l(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(o,n)}h((s=s.apply(e,t||[])).next())}));var e,t,i,s}}const H=M,k={type:Phaser.AUTO,width:window.innerWidth,height:window.innerHeight,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,parent:"game",width:window.innerWidth,height:window.innerHeight},physics:{default:"arcade",arcade:{gravity:{x:0,y:250},debug:!0}},scene:[s,H]};new Phaser.Game(k)}},i={};function s(e){var l=i[e];if(void 0!==l)return l.exports;var r=i[e]={exports:{}};return t[e].call(r.exports,r,r.exports,s),r.exports}s.m=t,e=[],s.O=(t,i,l,r)=>{if(!i){var o=1/0;for(d=0;d<e.length;d++){for(var[i,l,r]=e[d],n=!0,h=0;h<i.length;h++)(!1&r||o>=r)&&Object.keys(s.O).every((e=>s.O[e](i[h])))?i.splice(h--,1):(n=!1,r<o&&(o=r));if(n){e.splice(d--,1);var a=l();void 0!==a&&(t=a)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[i,l,r]},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={792:0};s.O.j=t=>0===e[t];var t=(t,i)=>{var l,r,[o,n,h]=i,a=0;if(o.some((t=>0!==e[t]))){for(l in n)s.o(n,l)&&(s.m[l]=n[l]);if(h)var d=h(s)}for(t&&t(i);a<o.length;a++)r=o[a],s.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return s.O(d)},i=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var l=s.O(void 0,[96],(()=>s(809)));l=s.O(l)})();