import { World } from "@remvst/game-model";
import { ValueCounter } from "./value-counter";

export type WorldStatePredicate = (world: World) => boolean;

export class WorldStateCounter extends ValueCounter {
    readonly predicate: WorldStatePredicate;
    readonly eventCount: number;

    private inState = false;

    constructor(opts: {
        readonly valueId: string;
        readonly predicate: WorldStatePredicate;
    }) {
        super({ valueId: opts.valueId });
        this.predicate = opts.predicate;
    }

    postBind(): void {
        super.postBind();
        this.inState = false;
    }

    update(): void {
        const inState = this.predicate(this.world);
        if (inState === this.inState) return;

        if (inState) {
            this.incr(1);
        }

        this.inState = inState;
    }
}
