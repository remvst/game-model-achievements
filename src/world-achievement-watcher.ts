import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "./achievement-unlocker";
import { Achievement } from "./achievement/achievement";
import { EventCountRecorder } from "./counting/event-count-recorder";
import { EventCounter } from "./counting/event-counter";

export class WorldAchievementWatcher implements EventCountRecorder {
    private world: World;

    private readonly counters: EventCounter[];
    private readonly achievements: Achievement[];
    private readonly unlocker: AchievementUnlocker;
    private readonly eventCountRecorder: EventCountRecorder;

    constructor(opts: {
        readonly counters: EventCounter[];
        readonly achievements: Achievement[];
        readonly unlocker: AchievementUnlocker;
        readonly eventCountRecorder: EventCountRecorder;
    }) {
        this.counters = opts.counters;
        this.achievements = opts.achievements;
        this.unlocker = opts.unlocker;
        this.eventCountRecorder = opts.eventCountRecorder;
    }

    eventCount(eventId: string): number {
        return this.eventCountRecorder.eventCount(eventId);
    }

    onEvent(eventId: string): void {
        this.eventCountRecorder.onEvent(eventId);

        for (const achievement of this.achievements) {
            achievement.condition.onEventCounted(eventId);
        }
    }

    bind(world: World) {
        this.world = world;

        for (const counter of this.counters) {
            counter.bind(world, this.eventCountRecorder);
        }

        for (const achievement of this.achievements) {
            achievement.condition.bind(
                this.eventCountRecorder,
                this.unlocker,
                achievement.id,
            );
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
