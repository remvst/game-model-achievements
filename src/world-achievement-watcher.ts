import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "./achievement-unlocker";
import { Achievement } from "./achievement/achievement";
import { EventCountRecorder } from "./counting/event-count-recorder";
import { EventCounter } from "./counting/event-counter";

export class WorldAchievementWatcher implements EventCountRecorder {
    private world: World;

    private readonly counters: EventCounter[] = [];
    readonly achievements: Achievement[] = [];

    // Persistence
    readonly unlocker: AchievementUnlocker;
    readonly eventCountRecorder: EventCountRecorder;

    constructor(opts: {
        readonly unlocker: AchievementUnlocker;
        readonly eventCountRecorder: EventCountRecorder;
    }) {
        this.unlocker = opts.unlocker;
        this.eventCountRecorder = opts.eventCountRecorder;
    }

    addEventCounter(counter: EventCounter): this {
        this.counters.push(counter);
        return this;
    }

    addAchievement(achievement: Achievement): this {
        this.achievements.push(achievement);
        return this;
    }

    eventCount(eventId: string): number {
        return this.eventCountRecorder.eventCount(eventId);
    }

    setEventCount(eventId: string, count: number): void {
        this.eventCountRecorder.setEventCount(eventId, count);

        for (const achievement of this.achievements) {
            achievement.condition.onEventCounted(eventId);
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
