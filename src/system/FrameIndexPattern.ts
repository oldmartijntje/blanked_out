export class FrameIndexPattern {
    constructor(animationConfig) {
        this.currentTime = 0;
        this.animationConfig = animationConfig;
        this.duration = animationConfig.duration;
    }

    get frame() {
        const { frames } = this.animationConfig;
        for (let i = frames.length - 1; i >= 0; i--) {
            if (this.currentTime >= frames[i].time) {
                return frames[i].frame;
            }
        }
        throw "Time is less than 0 in FrameIndexPattern";
    }

    step(deltaTime) {
        this.currentTime += deltaTime;
        this.currentTime = this.currentTime % this.duration;
    }


}