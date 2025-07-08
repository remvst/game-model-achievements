import { World } from "@remvst/game-model";
import { ValueCounter } from "./value-counter";

export type ComputeValue = (world: World) => number;

export class WorldValueCounter extends ValueCounter {
    readonly computeValue: ComputeValue;
    readonly eventCount: number;

    constructor(opts: {
        readonly valueId: string;
        readonly computeValue: ComputeValue;
    }) {
        super({ valueId: opts.valueId });
        this.computeValue = opts.computeValue;
    }

    update(): void {
        const value = this.computeValue(this.world);
        this.eventCountRecorder.setValue(this.valueId, value);
    }
}
