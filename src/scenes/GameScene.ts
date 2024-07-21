import { calculateOffsets, CONST } from '../const';
import ExplodeEmitter from '../effect/ExplodeEmitter';
import BallTile from '../game-objects/BallTile';
import Milestone from '../ui/Milestone';
import PauseButton from '../ui/PauseButton';
import RocketTile from '../game-objects/RocketTile';
import Tile from '../game-objects/Tile';
import ScoreManager from '../manager/ScoreManager';
import DestroyState from '../states/DestroyState';
import FillState from '../states/FillState';
import IdleState from '../states/IdleState';
import MatchState from '../states/MatchState';
import PlayState from '../states/PlayState';
import ShuffleState from '../states/ShuffleState';
import StateMachine from '../states/StateMachine';
import SwapState from '../states/SwapState';
import LevelComplete from '../ui/LevelComplete';

class GameScene extends Phaser.Scene {
    // Variables
    public canPick: boolean
    private dragging: boolean
    public firstSelectedTile: Tile | undefined
    public secondSelectedTile: Tile | undefined
    public firstHintBox: Phaser.GameObjects.Graphics
    public secondHintBox: Phaser.GameObjects.Graphics
    public tileGrid: (Tile | undefined)[][]
    public tiles: (Tile | undefined)[]
    private swappingTiles: number
    private removeMap: number[][]
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    private selectionTween: Phaser.Tweens.Tween
    public stateMachine: StateMachine
    public scoreManager: ScoreManager
    private milestone: Milestone
    public levelComplete: LevelComplete
    // private pauseButton: PauseButton
    public isMatchSpecial: boolean

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

        CONST.backgroundWidth = background.displayWidth;
        CONST.backgroundHeight = background.displayHeight;
        CONST.backgroundX = background.x - background.displayWidth / 2;
        CONST.backgroundY = background.y - background.displayHeight / 2;

        const board = this.add.image(0, 0, 'board')
        board.setScale(0.75)
        board.setPosition(screenWidth / 2, screenHeight *3/5)

        calculateOffsets(window.innerWidth, window.innerHeight)
        // this.pauseButton = new PauseButton(this, 500, 50)
        this.canPick = true;
        this.dragging = false;
        this.firstSelectedTile = undefined;
        this.secondSelectedTile = undefined;
        this.scoreManager = new ScoreManager(this, 1000); // Set initial milestone
        this.milestone = new Milestone(this);
        this.tiles = []
        this.levelComplete = new LevelComplete(this, screenWidth/2, screenHeight/2)
        this.isMatchSpecial = false
        this.firstHintBox = this.add.graphics()
        this.firstHintBox.lineStyle(3, 0x009F7F)
        this.firstHintBox.strokeRect(0, 0, CONST.tileWidth - 5, CONST.tileHeight - 5)
        this.firstHintBox.setVisible(false)
        this.secondHintBox = this.add.graphics()
        this.secondHintBox.lineStyle(3, 0x009F7F)
        this.secondHintBox.strokeRect(0, 0, CONST.tileWidth - 5, CONST.tileHeight - 5)
        this.secondHintBox.setVisible(false)
        this.tweens.add({
            targets: this.firstHintBox,
            alpha: 0,
            ease: 'Sine.easeInOut',
            duration: 700,
            repeat: -1,
            yoyo: true,
        })
        this.tweens.add({
            targets: this.secondHintBox,
            alpha: 0,
            ease: 'Sine.easeInOut',
            duration: 700,
            repeat: -1,
            yoyo: true,
        })
        this.drawField();
        this.stateMachine = new StateMachine('play', {
            play: new PlayState(this),
            shuffle: new ShuffleState(this),
            match: new MatchState(this),
            fill: new FillState(this),
        })
        this.input.on("gameobjectdown", this.tileSelect, this);
        this.input.on("gameobjectmove", this.startSwipe, this);
        this.input.on("pointerup", this.stopSwipe, this);
    }

    update(time: number, delta: number): void {
        this.stateMachine.update(time, delta);
        this.milestone.update();

    }
    
    public shuffleTiles(): void {
        const flattenedTiles = this.tileGrid.flat().filter(tile => tile !== undefined);
        Phaser.Utils.Array.Shuffle(flattenedTiles);
    
        let index = 0;
        for (let y = 0; y < CONST.gridHeight; y++) {
            for (let x = 0; x < CONST.gridWidth; x++) {
                if (this.tileGrid[y][x] !== undefined) {
                    this.tileGrid[y][x] = flattenedTiles[index];
                    index++;
                }
            }
        }
        this.tiles = flattenedTiles;
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
                        // Destroy the previous tile if it exists and matches
                        if (this.tileGrid[y][x]) {
                            this.tileGrid[y][x]!.destroy();
                        }
    
                    // Get a random tile
                    let randomTileType = CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)];
    
                    tile = new Tile(this, posX, posY, randomTileType);
                    tile.state = 'replenished'
                    this.tileGrid[y][x] = tile;
                    this.tiles.push(tile)
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

        this.tileGrid[tile1Pos.y][tile1Pos.x] = tile2;
        this.tileGrid[tile2Pos.y][tile2Pos.x] = tile1;

        this.tweenTile(tile1, tile2, swapBack);
        if(this.selectionTween){
            this.selectionTween.destroy()
        }
    }

    public tweenTile(tile1: Tile | undefined, tile2: Tile | undefined, swapBack: boolean){
        const tile1Pos = this.getTilePos(this.tileGrid, tile1)
        const tile2Pos = this.getTilePos(this.tileGrid, tile2)

        this.tweens.add({
            targets: this.tileGrid[tile1Pos.y][tile1Pos.x],
            x: tile2?.x,
            y: tile2?.y,
            duration: CONST.swapSpeed,
            onComplete: () => {
                this.swappingTiles--;
            }
        });
        this.tweens.add({
            targets: this.tileGrid[tile2Pos.y][tile2Pos.x],
            x: tile1?.x,
            y: tile1?.y,
            duration: CONST.swapSpeed,
            callbackScope: this,
            onComplete: () => {
                this.swappingTiles--;
                if(this.swappingTiles == 0){
                    if (tile1 instanceof RocketTile && tile2 instanceof RocketTile) {
                        tile1.swapWithRocket(tile2);
                    } else if (tile1 instanceof RocketTile && tile2 instanceof BallTile) {
                        tile1.swapWithBall(tile2);
                    } else if (tile1 instanceof BallTile && tile2 instanceof RocketTile) {
                        tile2.swapWithBall(tile1);
                    } else if (tile1 instanceof BallTile && tile2 instanceof BallTile) {
                        tile1.swapWithBall(tile2);
                    }
                    else{
                        if(!this.matchInBoard() && swapBack){
                            this.swapTiles(tile1, tile2, false);
                        }
                        else{
                            this.stateMachine.transition('match')
                        }
                    }
                }
            }
        });
    }
    public matchInBoard(){
        if(this.firstSelectedTile instanceof RocketTile || 
            this.secondSelectedTile instanceof RocketTile ||
            this.firstSelectedTile instanceof BallTile || 
            this.secondSelectedTile instanceof BallTile
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
        console.log('handle match')

        this.isMatchSpecial = false

        this.removeMap = [];
        for(let y = 0; y < CONST.gridHeight; y++){
            this.removeMap[y] = [];
            for(let x = 0; x < CONST.gridWidth; x ++){
                this.removeMap[y].push(0);
            }
        }

        // Kiểm tra match đặc biệt (T hoặc L)
        for(let y = 0; y < CONST.gridHeight; y++){
            for(let x = 0; x < CONST.gridWidth; x++){
                const { isMatch, tilesToRemove } = this.checkTLMatch(y, x);
                if (isMatch) {
                    this.createBallTile(y, x, tilesToRemove);
                    return;
                }
            }
        }
        if(this.firstSelectedTile instanceof RocketTile || 
            this.secondSelectedTile instanceof RocketTile ||
            this.firstSelectedTile instanceof BallTile || 
            this.secondSelectedTile instanceof BallTile
        ) {
            console.log('match special')
            if(this.firstSelectedTile instanceof RocketTile || this.firstSelectedTile instanceof BallTile)
            {
                const pos = this.getTilePos(this.tileGrid, this.firstSelectedTile)
                this.removeMap[pos.y][pos.x]++;
            }
            if(this.secondSelectedTile instanceof RocketTile || this.secondSelectedTile instanceof BallTile)
            {
                const pos = this.getTilePos(this.tileGrid, this.secondSelectedTile)
                this.removeMap[pos.y][pos.x]++;
            }
        }
        else{
            this.markMatches('HORIZONTAL');
            this.markMatches('VERTICAL');
        }

        this.destroyTiles()
    }

    public checkTLMatch(row: number, col: number): { isMatch: boolean, tilesToRemove: {row: number, col: number}[] } {
        const currentType = this.tileGrid[row][col]?.texture.key;
        if (!currentType) return { isMatch: false, tilesToRemove: [] };
    
        let tilesToRemove: {row: number, col: number}[] = [];
    
        const checkDirection = (r: number, c: number, dr: number, dc: number): number => {
            let count = 0;
            while (this.matchType(r + dr * count, c + dc * count, currentType)) {
                count++;
            }
            return count - 1;
        };
    
        const up = checkDirection(row, col, -1, 0);
        const down = checkDirection(row, col, 1, 0);
        const left = checkDirection(row, col, 0, -1);
        const right = checkDirection(row, col, 0, 1);
    
        const vertical = up + down + 1;
        const horizontal = left + right + 1;
    
        // Check for T shape
        if ((vertical >= 3 && horizontal >= 3) && (vertical + horizontal >= 7)) {
            tilesToRemove.push({row, col});
            for (let i = 1; i <= up; i++) tilesToRemove.push({row: row - i, col});
            for (let i = 1; i <= down; i++) tilesToRemove.push({row: row + i, col});
            for (let i = 1; i <= left; i++) tilesToRemove.push({row, col: col - i});
            for (let i = 1; i <= right; i++) tilesToRemove.push({row, col: col + i});
            
            return { isMatch: true, tilesToRemove };
        }

        // Check for L shape
        const lShapes = [
            { v: up, h: right },    // Top-Right L
            { v: up, h: left },     // Top-Left L
            { v: down, h: right },  // Bottom-Right L
            { v: down, h: left }    // Bottom-Left L
        ];
    
        for (const {v, h} of lShapes) {
            if (v + 1 >= 3 && h + 1 >= 3) {
                tilesToRemove.push({row, col}); // Tile gốc
                const dr = v === up ? -1 : 1;
                const dc = h === right ? 1 : -1;
                // Thêm tiles theo chiều dọc
                for (let i = 1; i <= v; i++) tilesToRemove.push({row: row + i * dr, col});
                // Thêm tiles theo chiều ngang
                for (let i = 1; i <= h; i++) tilesToRemove.push({row, col: col + i * dc});
                return { isMatch: true, tilesToRemove };
            }
        }
    
        return { isMatch: false, tilesToRemove: [] };
    }
    public createBallTile(row: number, col: number, tilesToRemove: {row: number, col: number}[]) {
        const posX = col * CONST.tileWidth + CONST.GRID_OFFSET_X;
        const posY = row * CONST.tileHeight + CONST.GRID_OFFSET_Y;
        let tilesToDestroy = tilesToRemove.length;
        this.scoreManager.addScore(tilesToDestroy*100)
        tilesToRemove.forEach(({row: r, col: c}) => {
            if (this.tileGrid[r] && this.tileGrid[r][c]) {
                this.tweens.add({
                    targets: this.tileGrid[r][c],
                    x: posX,
                    y: posY,
                    duration: CONST.swapSpeed,
                    onComplete: () => {
                        this.tileGrid[r][c]?.destroy();
                        this.tileGrid[r][c] = undefined;
                        tilesToDestroy--;
                        if (tilesToDestroy === 0) {
                            this.tileGrid[row][col] = new BallTile(this, posX, posY);
                            this.tileGrid[row][col]!.state = 'replenished';
                            this.isMatchSpecial = true;
                            this.stateMachine.transition('fill');
                        }
                    }
                });
            }
        });
    }

    public markMatches(direction: 'HORIZONTAL' | 'VERTICAL') {
        console.log('markMatches')
        if(direction === 'HORIZONTAL'){
            for(let row = 0; row < CONST.gridHeight; row++){
                let typeStreak = 1;
                let currentType = '';
                let startStreak = 0;
                let typeToWatch = '';
                for(let col = 0; col < CONST.gridWidth; col++){
                    if (this.tileGrid[row][col]) {
                        typeToWatch = this.tileGrid[row][col]!.texture.key;
                    } else {
                        typeToWatch = ''; 
                    }

                    if(typeToWatch == currentType){
                        typeStreak ++;
                    }
                    if(typeToWatch != currentType || col == CONST.gridWidth - 1){
                        if(typeStreak >= 3 && (currentType !== 'horizontalRocket' && 'horizontalRocket' && 'lightBall')){
                            this.handleMatchStreak(startStreak, col, row, typeStreak, direction);
                        }
                        startStreak = col;
                        typeStreak = 1;
                        currentType = typeToWatch;
                    }
                }
            }
        }
        else{
            for(let col = 0; col < CONST.gridWidth; col++){
                let typeStreak = 1;
                let currentType = '';
                let startStreak = 0;
                let typeToWatch = '';
                for(let row = 0; row < CONST.gridHeight; row ++){
                    if (this.tileGrid[row][col]) {
                        typeToWatch = this.tileGrid[row][col]!.texture.key;
                    } else {
                        typeToWatch = '';
                    }
                    
                    if(typeToWatch == currentType){
                        typeStreak ++;
                    }
                    if(typeToWatch != currentType || row == CONST.gridHeight - 1){
                        if(typeStreak >= 3 && (currentType !== 'horizontalRocket' && 'horizontalRocket' && 'lightBall')){
                            this.handleMatchStreak(startStreak, row, col, typeStreak, direction);
                        }
                        startStreak = row;
                        typeStreak = 1;
                        currentType = typeToWatch;
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

            // Kiểm tra nếu selectedTile nằm trong chuỗi streak
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
        console.log('handleMatchStreak')
        if (streak >= 4) {
            this.isMatchSpecial = true
            const {row, col} = this.specialTileAppearancePosition(start, end, fixed, streak, direction);
            const posX = col * CONST.tileWidth + CONST.GRID_OFFSET_X;
            const posY = row * CONST.tileHeight + CONST.GRID_OFFSET_Y;
    
            // Destroy all tiles in the streak
            let tilesToDestroy = streak;
            this.scoreManager.addScore(tilesToDestroy*100)

            for (let i = 0; i < streak; i++) {
                const tileRow = direction === 'HORIZONTAL' ? fixed : start + i;
                const tileCol = direction === 'HORIZONTAL' ? start + i : fixed;
                if (this.tileGrid[tileRow][tileCol]) {
                    this.tweens.add({
                        targets: this.tileGrid[tileRow][tileCol],
                        x: direction === 'HORIZONTAL' ? posX : this.tileGrid[tileRow][tileCol]!.x,
                        y: direction === 'HORIZONTAL' ? this.tileGrid[tileRow][tileCol]!.y : posY,
                        duration: CONST.swapSpeed,
                        onComplete: () => {
                            this.tileGrid[tileRow][tileCol]?.destroy();
                            this.tileGrid[tileRow][tileCol] = undefined;
                            tilesToDestroy--;
                            if (tilesToDestroy === 0) {
                                // Create the special tile after all others are destroyed
                                if (streak === 4) {
                                    this.tileGrid[row][col] = new RocketTile(this, posX, posY, direction);
                                } else {
                                    this.tileGrid[row][col] = new BallTile(this, posX, posY);
                                }
                                this.tileGrid[row][col]!.state = 'replenished'
                                this.stateMachine.transition('fill');
                            }
                        }
                    });
                }
            }

        } else {
            for (let i = 0; i < streak; i++) {
                if (direction === 'HORIZONTAL') {
                    this.removeMap[fixed][start + i]++;
                } else {
                    this.removeMap[start + i][fixed]++;
                }
            }
        }

    }

    public matchType(row: number, col: number, typeToWatch: string): boolean {
        if (col < 0 || col >= CONST.gridWidth || row < 0 || row >= CONST.gridHeight) return false;
        if(this.tileGrid[row][col] && this.tileGrid[row][col]!.texture.key === typeToWatch)
            return true
        else return false
    }
    
    public destroyTiles(): void {
        let isDestroySpecial = false;
        for(let y = 0; y < CONST.gridHeight; y ++){
            for(let x = 0; x < CONST.gridWidth; x ++){
                if(this.removeMap[y][x] > 0){
                    const destroyTile = this.tileGrid[y][x]
                    if(destroyTile instanceof RocketTile || destroyTile instanceof BallTile) isDestroySpecial=true
                    destroyTile?.destroyTile();
                    this.tileGrid[y][x] = undefined
                }
            }
        }
        this.firstSelectedTile = undefined;
        this.secondSelectedTile = undefined;
        if(!isDestroySpecial && !this.isMatchSpecial) {
            this.stateMachine.transition('fill')
        }
        this.scoreManager.update()
    }
    public getHint(): { x1: number; x2: number; y1: number; y2: number }[] {
        const hint: { x1: number; x2: number; y1: number; y2: number }[] = []
        for (let y = 0; y < CONST.gridHeight; y++) {
            for (let x = 0; x < CONST.gridWidth; x++) {
                if (x < CONST.gridWidth - 1) {
                    let temp = this.tileGrid[y][x]
                    this.tileGrid[y][x] = this.tileGrid[y][x + 1]
                    this.tileGrid[y][x + 1] = temp
                    if (this.matchInBoard()) {
                        hint.push({ x1: x, x2: x + 1, y1: y, y2: y })
                    }
                    temp = this.tileGrid[y][x]
                    this.tileGrid[y][x] = this.tileGrid[y][x + 1]
                    this.tileGrid[y][x + 1] = temp
                }
                if (y < CONST.gridHeight - 1) {
                    let temp = this.tileGrid[y][x]
                    this.tileGrid[y][x] = this.tileGrid[y + 1][x]
                    this.tileGrid[y + 1][x] = temp
                    if (this.matchInBoard()) {
                        hint.push({ x1: x, x2: x, y1: y, y2: y + 1 })
                    }
                    temp = this.tileGrid[y][x]
                    this.tileGrid[y][x] = this.tileGrid[y + 1][x]
                    this.tileGrid[y + 1][x] = temp
                }
            }
        }
        return hint
    }

    public makeTilesFall(): void {
        console.log("makeTilesFall")
        //xét từ dưới lên trên từ trái qua phải
        for(let y = CONST.gridHeight - 2; y >= 0; y--){
            for(let x = 0; x < CONST.gridWidth; x++){
                if(this.tileGrid[y][x]){
                    let fallTiles = this.holesBelow(y, x);
                    if(fallTiles > 0){
                        this.tileGrid[y][x]!.state = 'moved'
                        this.tweens.add({
                            targets: this.tileGrid[y][x],
                            y: this.tileGrid[y][x]!.y + fallTiles * CONST.tileHeight,
                            duration: CONST.fallSpeed * fallTiles,
                            onComplete: () => {
                                this.tileGrid[y][x]!.state = 'replenished'
                                this.tileGrid[y + fallTiles][x]!.state = 'replenished'

                            },
                            onStart: () => {
                                this.tileGrid[y][x]!.state = 'moving'
                            }
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
    public async replenishField(): Promise<void> {
        console.log("replenishField")
        this.firstSelectedTile = undefined;
        this.secondSelectedTile = undefined;
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
                    let fallSpeed = CONST.fallSpeed * emptySpots
                    if(fallSpeed > 1000) fallSpeed = 1000;
                    this.tweens.add({
                        targets: this.tileGrid[y][x],
                        y: CONST.tileHeight * y + CONST.GRID_OFFSET_Y,
                        duration: fallSpeed,
                        callbackScope: this,
                        onUpdate: () => {
                            // Make tile visible once it starts entering the board
                            if (this.tileGrid[y][x]!.y >= CONST.GRID_OFFSET_Y) {
                                this.tileGrid[y][x]!.visible = true;
                            }
                        },
                        onComplete: () => {
                            this.tileGrid[y][x]!.state = 'replenished'
                        }
                    });
                }
            }
        }
    }
}

export default GameScene