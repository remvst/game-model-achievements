import { World } from "@remvst/game-model";
import { ValueRecorder } from "../persistence/value-recorder";

export abstract class ValueCounter {
    readonly valueId: string;

    protected world: World;
    protected eventCountRecorder: ValueRecorder;

    constructor(opts: { readonly valueId: string }) {
        this.valueId = opts.valueId;
    }

    bind(world: World, eventCountRecorder: ValueRecorder) {
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
        this.eventCountRecorder.setValue(
            this.valueId,
            this.eventCountRecorder.getValue(this.valueId) + amount,
        );
    }
}
