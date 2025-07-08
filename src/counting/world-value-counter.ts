import { World } from "@remvst/game-model";
import { EventCounter } from "./event-counter";

export type ComputeValue = (world: World) => number;

export class ValueCounter extends EventCounter {
    readonly computeValue: ComputeValue;
    readonly eventCount: number;

    constructor(opts: {
        readonly eventId: string;
        readonly computeValue: ComputeValue;
    }) {
        super({ eventId: opts.eventId });
        this.computeValue = opts.computeValue;
    }

    update(): void {
        const value = this.computeValue(this.world);
        this.eventCountRecorder.setEventCount(this.eventId, value);
    }
}
