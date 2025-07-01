import { World } from "@remvst/game-model";
import { EventCounter } from "./event-counter";

export type WorldStatePredicate = (world: World) => boolean;

export class WorldStateCounter extends EventCounter {
    readonly predicate: WorldStatePredicate;
    readonly eventCount: number;

    private inState = false;

    constructor(opts: { eventId: string; predicate: WorldStatePredicate }) {
        super({ eventId: opts.eventId });
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
            this.count();
        }

        this.inState = inState;
    }
}
