import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCountRecorder } from "./event-count-recorder";

export abstract class EventCounter {
    readonly eventId: string;

    protected world: World;
    protected unlocker: AchievementUnlocker;
    protected eventCountRecorder: EventCountRecorder;

    constructor(opts: { eventId: string }) {
        this.eventId = opts.eventId;
    }

    bind(world: World, eventCountRecorder: EventCountRecorder) {
        this.world = world;
        this.eventCountRecorder = eventCountRecorder;
    }

    postBind() {}

    unbind() {
        this.world = null;
        this.eventCountRecorder = null;
    }

    update() {}

    count() {
        this.eventCountRecorder.onEvent(this.eventId);
    }
}
