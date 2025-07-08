import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "./achievement-unlocker";
import { Achievement } from "./achievement/achievement";
import { ValueCounter } from "./counting/value-counter";
import { ValueRecorder } from "./persistence/value-recorder";

export class WorldAchievementWatcher implements ValueRecorder {
    private world: World;

    private readonly counters: ValueCounter[] = [];
    readonly achievements: Achievement[] = [];

    // Persistence
    readonly unlocker: AchievementUnlocker;
    readonly recorder: ValueRecorder;

    constructor(opts: {
        readonly unlocker: AchievementUnlocker;
        readonly recorder: ValueRecorder;
    }) {
        this.unlocker = opts.unlocker;
        this.recorder = opts.recorder;
    }

    addEventCounter(counter: ValueCounter): this {
        this.counters.push(counter);
        return this;
    }

    addAchievement(achievement: Achievement): this {
        this.achievements.push(achievement);
        return this;
    }

    getValue(valueId: string): number {
        return this.recorder.getValue(valueId);
    }

    setValue(valueId: string, count: number): void {
        this.recorder.setValue(valueId, count);

        for (const achievement of this.achievements) {
            achievement.condition.onEventCounted(valueId);
        }
    }

    bind(world: World) {
        this.world = world;

        for (const counter of this.counters) {
            counter.bind(world, this);
        }

        for (const achievement of this.achievements) {
            achievement.condition.bind(this, this.unlocker, achievement.id);
        }
    }

    postBind() {
        for (const counter of this.counters) {
            counter.postBind();
        }

        for (const achievement of this.achievements) {
            achievement.condition.postBind();
        }
    }

    update() {
        for (const counter of this.counters) {
            counter.update();
        }
    }
}
