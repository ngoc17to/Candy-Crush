import GameScene from "../scenes/GameScene";

class ScoreManager {
    private score: number;
    private milestone: number;
    private scene: GameScene;

    constructor(scene: GameScene, initialMilestone: number) {
        this.scene = scene;
        this.score = 0;
        this.milestone = initialMilestone;
    }

    public addScore(points: number): void {
        console.log("addScore")
        this.score += points;
        this.checkMilestone();
    }

    private checkMilestone(): void {
        if (this.score >= this.milestone) {
            this.score = this.score % this.milestone;
            this.scene.events.emit('milestoneReached');
            // Increase milestone for next level or add any other logic
        }
    }

    public getScore(): number {
        return this.score;
    }

    public getMilestone(): number {
        return this.milestone;
    }
}

export default ScoreManager