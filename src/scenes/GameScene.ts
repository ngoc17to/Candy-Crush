import { calculateOffsets, CONST } from '../const';
import ExplodeEmitter from '../effect/ExplodeEmitter';
import BallTile from '../game-objects/BallTile';
import MilestoneBar from '../game-objects/MilestoneBar';
import RocketTile from '../game-objects/RocketTile';
import Tile from '../game-objects/Tile';
import ScoreManager from '../manager/ScoreManager';
import DestroyState from '../states/DestroyState';
import FillState from '../states/FillState';
import IdleState from '../states/IdleState';
import PlayState from '../states/PlayState';
import ShuffleState from '../states/ShuffleState';
import StateMachine from '../states/StateMachine';
import SwapState from '../states/SwapState';

class GameScene extends Phaser.Scene {
    // Variables
    private canPick: boolean
    private dragging: boolean
    public firstSelectedTile: Tile | undefined
    public secondSelectedTile: Tile | undefined
    public tileGrid: (Tile | undefined)[][]
    public tiles: Phaser.GameObjects.Group
    private swappingTiles: number
    private removeMap: number[][]
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    private selectionTween: Phaser.Tweens.Tween
    public stateMachine: StateMachine
    private scoreManager: ScoreManager
    private milestoneBar: MilestoneBar

    constructor() {
        super({
            key: 'GameScene'
        })
    }

    create(){
        const screenHeight = this.cameras.main.height
        const screenWidth = this.cameras.main.width

        const background = this.add.image(0, 0, 'background')
        const scale = screenHeight / background.height
        background.setScale(0.5, scale)
        background.setPosition(screenWidth / 2, screenHeight / 2)

        const board = this.add.image(0, 0, 'board')
        board.setScale(0.75)
        board.setPosition(screenWidth / 2, screenHeight *3/5)

        this.canPick = true;
        this.dragging = false;
        this.firstSelectedTile = undefined;
        this.secondSelectedTile = undefined;
        this.scoreManager = new ScoreManager(this, 1000); // Set initial milestone
        this.milestoneBar = new MilestoneBar(this, this.scoreManager);
        this.tiles = this.add.group();

 
        calculateOffsets(window.innerWidth, window.innerHeight)
        this.drawField();
        this.stateMachine = new StateMachine('play', {
            play: new PlayState(this),
            idle: new IdleState(this),
            shuffle: new ShuffleState(this),
            swap: new SwapState(this),
            fill: new FillState(this),
            destroy: new DestroyState(this),
        })
        this.input.on("gameobjectdown", this.tileSelect, this);
        this.input.on("gameobjectdown", ()=>{this.stateMachine.transition('play')}, this);
        this.input.on("gameobjectmove", this.startSwipe, this);
        this.input.on("pointerup", this.stopSwipe, this);
        // this.events.on('milestoneReached', this.handleMilestoneReached, this);

    }

    update(time: number, delta: number): void {
        this.stateMachine.update(time, delta);
        this.milestoneBar.updateMilestoneBar();

    }

    public handleMilestoneReached(): void {
        // Chuyển tất cả các tile hiện tại vào một mảng tạm
        let tiles: Tile[] = [];
        for (let y = 0; y < CONST.gridHeight; y++) {
            for (let x = 0; x < CONST.gridWidth; x++) {
                if (this.tileGrid[y][x]) {
                    tiles.push(this.tileGrid[y][x] as Tile);
                }
            }
        }
    
        Phaser.Utils.Array.Shuffle(tiles);
    
        // Gán lại các tile vào lưới theo thứ tự ngẫu nhiên
        for (let y = 0; y < CONST.gridHeight; y++) {
            for (let x = 0; x < CONST.gridWidth; x++) {
                if (tiles.length > 0) {
                    this.tileGrid[y][x] = tiles.pop();
                    let posX = x * CONST.tileWidth + CONST.GRID_OFFSET_X;
                    let posY = y * CONST.tileHeight + CONST.GRID_OFFSET_Y
                    this.tileGrid[y][x]?.setPosition(posX, posY);
                }
            }
        }
    
        // Optionally: Tạo tween để tạo hiệu ứng trộn lại các tile
        // this.tweens.add({
        //     targets: this.tileGrid,
        //     duration: 500,
        //     ease: 'Power2',
        //     onComplete: () => {
        //         console.log('Tiles shuffled');
        //     }
        // });
        this.stateMachine.transition('shuffle');
        // this.confetti.playConfetti();
        // this.time.delayedCall(2000, () => {
        //     this.confetti.stopConfetti();
        // });
    

    }

    public drawField(): void{
        this.tileGrid = [];
        for(let y = 0; y < CONST.gridHeight; y++){
            this.tileGrid[y] = [];
            for(let x = 0; x < CONST.gridWidth; x ++){
                let posX = x * CONST.tileWidth + CONST.GRID_OFFSET_X;
                let posY = y * CONST.tileHeight + CONST.GRID_OFFSET_Y
                let tile: Tile;
                do {
                    if(this.tiles.getLength() > 0){
                            
                        // Destroy the previous tile if it exists and matches
                        if (this.tileGrid[y][x]) {
                            this.tileGrid[y][x]!.destroyTile();
                        }
                    }
    
                    // Get a random tile
                    let randomTileType = CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)];
    
                    tile = new Tile(this, posX, posY, randomTileType);
                    this.tileGrid[y][x] = tile;
                    this.tiles.add(tile)
                } while (this.isMatch(y, x));
            }
        }
    }

    public isMatch(row: number, col: number){
        return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }

    public isHorizontalMatch(row: number, col: number){
        return this.tileAt(row, col)?.texture.key == this.tileAt(row, col - 1)?.texture.key 
                && this.tileAt(row, col)?.texture.key == this.tileAt(row, col - 2)?.texture.key
    }

    public isVerticalMatch(row: number, col: number){
        return this.tileAt(row, col)?.texture.key == this.tileAt(row - 1, col)?.texture.key 
                && this.tileAt(row, col)?.texture.key == this.tileAt(row - 2, col)?.texture.key
    }

    public tileAt(row: number, col: number): Tile | undefined {
        if(row < 0 || row >= CONST.gridHeight || col < 0 || col >= CONST.gridWidth){
            return
        }
        return this.tileGrid[row][col];
    }

    public tileSelect(pointer: any, gameobject: any, event: any){
        if(this.canPick){
            this.dragging = true;
            let pickedTile = gameobject
            //pickedTile is the tile is selected this time
            if(pickedTile){
                if(this.selectionTween){
                    this.selectionTween.destroy()
                }
                this.selectionTween = this.tweens.add({
                    targets: pickedTile,
                    scale: 0.75,
                    duration: 300,
                    yoyo: true,
                    repeat: -1,
                });
                if(!this.firstSelectedTile){
                    pickedTile.setDepth(1);
                    this.firstSelectedTile = pickedTile;
                }
                else{
                    if(this.areTheSame(pickedTile, this.firstSelectedTile)){
                        if(this.selectionTween){
                            this.selectionTween.destroy()
                        }
                        this.firstSelectedTile.setScale(0.7);
                        this.firstSelectedTile = undefined;
                    }
                    else{
                        if(this.areNext(pickedTile, this.firstSelectedTile)){
                            this.firstSelectedTile.setScale(0.7);
                            this.secondSelectedTile = pickedTile;
                            // this.stateMachine.transition('swap', this.firstSelectedTile, this.secondSelectedTile, true)
                            this.swapTiles(this.firstSelectedTile, this.secondSelectedTile, true);
                        }
                        else{
                            this.firstSelectedTile.setScale(0.7);
                            this.firstSelectedTile = pickedTile;
                        }
                    }
                }
            }
        }
    }

    public startSwipe(pointer: any, gameobject: any, event: any){
        if(this.dragging && this.firstSelectedTile != null){
            let deltaX = pointer.downX - pointer.x;
            let deltaY = pointer.downY - pointer.y;
            let deltaRow = 0;
            let deltaCol = 0;
            if(deltaX > CONST.tileWidth / 2 && Math.abs(deltaY) < CONST.tileHeight / 4){
                deltaCol = -1;
            }
            if(deltaX < -CONST.tileWidth / 2 && Math.abs(deltaY) < CONST.tileHeight / 4){
                deltaCol = 1;
            }
            if(deltaY > CONST.tileWidth / 2 && Math.abs(deltaX) < CONST.tileHeight / 4){
                deltaRow = -1;
            }
            if(deltaY < -CONST.tileWidth / 2 && Math.abs(deltaX) < CONST.tileHeight / 4){
                deltaRow = 1;
            }
            if(deltaRow + deltaCol != 0){
                const firstSelectedTilePos = this.getTilePos(this.tileGrid, this.firstSelectedTile)
                this.secondSelectedTile = this.tileAt(firstSelectedTilePos.y + deltaRow, firstSelectedTilePos.x + deltaCol);
                if(this.secondSelectedTile){
                    // this.stateMachine.transition('swap', this.firstSelectedTile, this.secondSelectedTile, true)
                    this.swapTiles(this.firstSelectedTile, this.secondSelectedTile, true);
                    this.dragging = false;
                }
            }
            this.firstSelectedTile.setScale(0.7);
        }
    }
    public stopSwipe(){
        this.dragging = false;
    }
    public areTheSame(tile1: Tile | undefined, tile2: Tile | undefined){
        const tile1Pos = this.getTilePos(this.tileGrid, tile1)
        const tile2Pos = this.getTilePos(this.tileGrid, tile2)
        return tile1Pos.x == tile2Pos.x && tile1Pos.y == tile2Pos.y
    }

    public areNext(tile1: Tile | undefined, tile2: Tile | undefined){
        const tile1Pos = this.getTilePos(this.tileGrid, tile1)
        const tile2Pos = this.getTilePos(this.tileGrid, tile2)
        return Math.abs(tile1Pos.x - tile2Pos.x) + Math.abs(tile1Pos.y - tile2Pos.y) == 1;
    }

    public getTilePos(tileGrid: (Tile | undefined)[][], tile: Tile | undefined): {x: number, y: number} {
       // return position of tile in tileGrid (row, column), if tile is undefined return {-1,-1}
        let pos = { x: -1, y: -1 };

        for (let y = 0; y < tileGrid.length; y++) {
            for (let x = 0; x < tileGrid[y].length; x++) {
                if (tile === tileGrid[y][x]) {
                    pos.x = x;
                    pos.y = y;
                    break;
                }
            }
        }

        return pos;
    }

    public swapTiles(tile1: Tile | undefined, tile2: Tile | undefined, swapBack: boolean) {
        this.swappingTiles = 2;
        this.canPick = false;
        const tile1Pos = this.getTilePos(this.tileGrid, tile1)
        const tile2Pos = this.getTilePos(this.tileGrid, tile2)

        // Swap them in our grid with the tiles
        this.tileGrid[tile1Pos.y][tile1Pos.x] = tile2;
        this.tileGrid[tile2Pos.y][tile2Pos.x] = tile1;

        this.tweenTile(tile1, tile2, swapBack);
        this.tweenTile(tile2, tile1, swapBack);
        if(this.selectionTween){
            this.selectionTween.destroy()
        }
    }

    public tweenTile(tile1: Tile | undefined, tile2: Tile | undefined, swapBack: boolean){
        const tile1Pos = this.getTilePos(this.tileGrid, tile1)

        this.tweens.add({
            targets: this.tileGrid[tile1Pos.y][tile1Pos.x],
            x: tile2?.x,
            y: tile2?.y,
            duration: CONST.swapSpeed,
            // ease: 'Back.Out',
            callbackScope: this,
            onComplete: () => {
                this.swappingTiles--;
                if(this.swappingTiles == 0){
                    // if(this.firstSelectedTile instanceof RocketTile || 
                    //     this.secondSelectedTile instanceof RocketTile)
                    // {
                    //     if(this.firstSelectedTile instanceof RocketTile){
                    //         (this.firstSelectedTile as RocketTile).destroyTile();
                    //         this.firstSelectedTile = undefined

                    //     }
                    //     if(this.secondSelectedTile instanceof RocketTile){
                    //         (this.secondSelectedTile as RocketTile).destroyTile();
                    //         this.secondSelectedTile = undefined
                    //     }

                    // }
                    // else{
                        if(!this.matchInBoard() && swapBack){
                            // this.stateMachine.transition('swap', tile1, tile2, false)
                            this.swapTiles(tile1, tile2, false);
                        }
                        else{
                            if(this.matchInBoard()){
                                this.handleMatches();
                            }
                            else{
                                this.canPick = true;
                                this.firstSelectedTile = undefined;
                                this.secondSelectedTile = undefined;
                            }
                        }
                    // }
                }
            }
        });
    }
    public matchInBoard(){
        if(this.firstSelectedTile instanceof RocketTile || 
            this.secondSelectedTile instanceof RocketTile
        ) return true;

        for(let y = 0; y < CONST.gridHeight; y++){
            for(let x = 0; x < CONST.gridWidth; x ++){
                if(this.isMatch(y, x)){
                    return true;
                }
            }
        }
        return false;
    }
    public handleMatches(){
        this.removeMap = [];
        for(let y = 0; y < CONST.gridHeight; y++){
            this.removeMap[y] = [];
            for(let x = 0; x < CONST.gridWidth; x ++){
                this.removeMap[y].push(0);
            }
        }
        console.log("handleMatches")
        if(this.firstSelectedTile instanceof RocketTile || 
            this.secondSelectedTile instanceof RocketTile)
        {
            if(this.firstSelectedTile instanceof RocketTile)
            {
                const pos = this.getTilePos(this.tileGrid, this.firstSelectedTile)
                this.removeMap[pos.y][pos.x]++;
            }
            if(this.secondSelectedTile instanceof RocketTile)
            {
                const pos = this.getTilePos(this.tileGrid, this.secondSelectedTile)
                this.removeMap[pos.y][pos.x]++;
            }
        }
        else{
                
            this.markMatches('HORIZONTAL');
            this.markMatches('VERTICAL');
        }
        // this.destroyTiles();
        this.stateMachine.transition('destroy');
    }
    public markMatches(direction: 'HORIZONTAL' | 'VERTICAL') {
        // hàm này chỉ gọi khi đã kiểm tra match in board
        // ( hàm match in board trả về true nếu có 1 trong 2 selectedTile là rocket )
        // nên trong hàm này chỉ cần xét selectedTile có phải rocket ko
        // nếu đúng là rocket thì rocket này sẽ được thêm vào remove map để destroyed
        // nếu ko phải rocket thì chỉ cần kiểm tra như bình thường
        // trong destroy state chỉ cần kiếm trong remove map để gọi destroy

        if(direction === 'HORIZONTAL'){
            for(let y = 0; y < CONST.gridHeight; y++){
                let colorStreak = 1;
                let currentColor = '';
                let startStreak = 0;
                let colorToWatch = 'blueItem';
                for(let x = 0; x < CONST.gridWidth; x ++){
                    colorToWatch = this.tileGrid[y][x]!.texture.key
                    if(colorToWatch == currentColor){
                        colorStreak ++;
                    }
                    if(colorToWatch != currentColor || x == CONST.gridWidth - 1){
                        if(colorStreak >= 3){
                            this.handleMatchStreak(startStreak, x, y, colorStreak, direction);
                        }
                        startStreak = x;
                        colorStreak = 1;
                        currentColor = colorToWatch;
                    }
                }
            }
        }
        else{
            for(let y = 0; y < CONST.gridWidth; y++){
                let colorStreak = 1;
                let currentColor = '';
                let startStreak = 0;
                let colorToWatch = 'blueItem';
                for(let x = 0; x < CONST.gridHeight; x ++){
                    colorToWatch = this.tileGrid[x][y]!.texture.key
                    if(colorToWatch == currentColor){
                        colorStreak ++;
                    }
                    if(colorToWatch != currentColor || x == CONST.gridHeight - 1){
                        if(colorStreak >= 3){
                            this.handleMatchStreak(startStreak, x, y, colorStreak, direction);
                        }
                        startStreak = x;
                        colorStreak = 1;
                        currentColor = colorToWatch;
                    }
                }
            }
        }


    }
    
    public specialTileAppearancePosition(start: number, end: number, fixed: number, streak: number, direction: 'HORIZONTAL' | 'VERTICAL'): { row: number, col: number } {
        if (this.firstSelectedTile === undefined) {
            if (direction === 'HORIZONTAL') {
                return { row: fixed, col: start };
            } else {
                return { row: start, col: fixed };
            }
        } else {
            const firstTilePos = this.getTilePos(this.tileGrid, this.firstSelectedTile);
            const secondTilePos = this.getTilePos(this.tileGrid, this.secondSelectedTile);

            // Kiểm tra nếu firstSelectedTile nằm trong chuỗi streak
            if (direction === 'HORIZONTAL') {
                if (firstTilePos.y === fixed) {
                    return { row: fixed, col: firstTilePos.x };
                }
                else if (secondTilePos.y === fixed) {
                    return { row: fixed, col: secondTilePos.x };

                }
            } else {
                if (firstTilePos.x === fixed) {
                    return { row: firstTilePos.y, col: fixed };
                }
                else if (secondTilePos.x === fixed) {
                    return { row: secondTilePos.y, col: fixed };
                }
            }

            if (direction === 'HORIZONTAL') {
                return { row: fixed, col: start };
            } else {
                return { row: start, col: fixed };
            }
        }
    }
    
    public handleMatchStreak(start: number, end: number, fixed: number, streak: number, direction: 'HORIZONTAL' | 'VERTICAL') {
        if (streak >= 4) {
            const {row, col} = this.specialTileAppearancePosition(start, end, fixed, streak, direction)
            const posX = col * CONST.tileWidth + CONST.GRID_OFFSET_X;
            const posY = row * CONST.tileHeight + CONST.GRID_OFFSET_Y;

            //trường hợp này destroy khác mấy cái bình thường nên tạm để destroy riêng
            // Di chuyển các tile còn lại về phía special tile
            let destroy = streak - 1
            for (let i = 0; i < streak; i++) {
                if (direction === 'HORIZONTAL') {
                    if (start + i !== col) {
                        this.tweens.add({
                            targets: this.tileGrid[fixed][start + i],
                            x: posX,
                            duration: CONST.swapSpeed,
                            onComplete: () => {
                                destroy--;
                                this.tileGrid[fixed][start + i]?.destroyTile();
                                this.tileGrid[fixed][start + i] = undefined;
                                if(destroy === 0){
                                    this.stateMachine.transition('fill')
                                    // this.makeTilesFall();
                                    // this.replenishField();
                                }
                            }
                        });
                    }
                } else {
                    if (start + i !== row) {
                        this.tweens.add({
                            targets: this.tileGrid[start + i][fixed],
                            y: posY,
                            duration: CONST.swapSpeed,
                            onComplete: () => {
                                destroy--;
                                this.tileGrid[start + i][fixed]?.destroyTile();
                                this.tileGrid[start + i][fixed] = undefined;
                                if(destroy === 0){
                                    this.stateMachine.transition('fill')
                                    // this.makeTilesFall();
                                    // this.replenishField();
                                }
                            }
                        });
                    }
                }
            }
            this.tileGrid[row][col]?.destroyTile()
            this.tileGrid[row][col] = undefined;
            if(streak === 4) this.tileGrid[row][col] = new RocketTile(this, posX, posY, direction);
            else this.tileGrid[row][col] = new BallTile(this, posX, posY);
        } 
        else{
            for (let i = 0; i < streak; i++) {
                if (direction === 'HORIZONTAL') {
                    this.removeMap[fixed][start + i]++;
                } else {
                    this.removeMap[start + i][fixed]++;
                }
            }
        }
    }

    public destroyTiles(): void {
        this.firstSelectedTile = undefined;
        this.secondSelectedTile = undefined;
        let isDestroyRocket = false;
        for(let y = 0; y < CONST.gridHeight; y ++){
            for(let x = 0; x < CONST.gridWidth; x ++){
                if(this.removeMap[y][x] > 0){
                    const destroyTile = this.tileGrid[y][x]
                    if(destroyTile instanceof RocketTile) isDestroyRocket=true
                    this.scoreManager.addScore(100);
                    destroyTile?.destroyTile();
                    this.tileGrid[y][x] = undefined
                }
            }
        }
        if(!isDestroyRocket) this.stateMachine.transition('fill')

    }

    public makeTilesFall(){
        console.log("makeTilesFall")
        //xét từ dưới lên trên từ trái qua phải
        for(let y = CONST.gridHeight - 2; y >= 0; y--){
            for(let x = 0; x < CONST.gridWidth; x++){
                if(this.tileGrid[y][x]){
                    let fallTiles = this.holesBelow(y, x);
                    if(fallTiles > 0){
                        this.tweens.add({
                            targets: this.tileGrid[y][x],
                            y: this.tileGrid[y][x]!.y + fallTiles * CONST.tileHeight,
                            duration: CONST.fallSpeed * fallTiles
                        });
                        this.tileGrid[y + fallTiles][x] = this.tileGrid[y][x]
                        this.tileGrid[y][x] = undefined;
                    }
                }
            }
        }
    }
    public holesBelow(row: number, col: number){
        let result = 0;
        for(let y = row + 1; y < CONST.gridHeight; y++){
            if(this.tileGrid[y][col] === undefined){
                result ++;

            }
        }
        return result;
    }
    public holesInCol(col: number){
        var result = 0;
        for(let y = 0; y< CONST.gridHeight; y++){
            if(this.tileGrid[y][col] == undefined){
                result ++;
            }
        }
        return result;
    }
    public replenishField(): Promise<void> {
        return new Promise((resolve) => {
            console.log("replenishField")
            let replenished = 0;
            for(let x = 0; x < CONST.gridWidth; x ++){
                let emptySpots = this.holesInCol(x);
                if(emptySpots > 0){
                    for(let y = 0; y < emptySpots; y++){
                        replenished++;
                        let randomTileType = CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)];                    
                        this.tileGrid[y][x] = new Tile(this, x, y, randomTileType);
                        this.tileGrid[y][x]!.x = CONST.tileWidth * x + CONST.GRID_OFFSET_X;
                        this.tileGrid[y][x]!.y = - (emptySpots - y) * CONST.tileHeight + CONST.GRID_OFFSET_Y;
                        this.tileGrid[y][x]!.visible = false; // Hide the tile initially

                        this.tweens.add({
                            targets: this.tileGrid[y][x],
                            y: CONST.tileHeight * y + CONST.GRID_OFFSET_Y,
                            duration: CONST.fallSpeed * emptySpots ,
                            callbackScope: this,
                            onUpdate: () => {
                                // Make tile visible once it starts entering the board
                                if (this.tileGrid[y][x]!.y >= CONST.GRID_OFFSET_Y) {
                                    this.tileGrid[y][x]!.visible = true;
                                }
                            },
                            onComplete: () => {
                                replenished--;
                                if(replenished == 0){
                                    if(this.matchInBoard()){
                                        this.time.addEvent({
                                            delay: 250,
                                            callback: this.handleMatches,
                                            callbackScope: this
                                        });
                                    }
                                    else{
                                        this.canPick = true;
                                        this.firstSelectedTile = undefined;
                                        this.secondSelectedTile = undefined;
                                    }
                                }
                            }
                        });
                    }
                }
            }
            resolve();
        });
    }
}

export default GameScene