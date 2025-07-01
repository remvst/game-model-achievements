import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCountRecorder } from "./event-count-recorder";

export abstract class EventCounter {
    readonly eventId: string;

    protected world: World;
    protected unlocker: AchievementUnlocker;
    protected eventCountRecoder: EventCountRecorder;

    constructor(opts: { eventId: string }) {
        this.eventId = opts.eventId;
    }

    bind(world: World, eventCountRecoder: EventCountRecorder) {
        this.world = world;
        this.eventCountRecoder = eventCountRecoder;
    }

    postBind() {}

    unbind() {
        this.world = null;
        this.eventCountRecoder = null;
    }

    update() {}

    count() {
        this.eventCountRecoder.onEvent(this.eventId);
    }
}
