import { World } from "@remvst/game-model";
import { EventCountRecorder } from "./event-count-recorder";

export abstract class EventCounter {
    readonly eventId: string;

    protected world: World;
    protected eventCountRecorder: EventCountRecorder;

    constructor(opts: { readonly eventId: string }) {
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

    incr(amount: number) {
        this.eventCountRecorder.setEventCount(
            this.eventId,
            this.eventCountRecorder.eventCount(this.eventId) + amount,
        );
    }
}
