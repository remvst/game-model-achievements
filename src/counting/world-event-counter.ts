import { WorldEvent } from "@remvst/game-model";
import { filter, Subscription } from "rxjs";
import { ValueCounter } from "./value-counter";

export type WorldEventPredicate = (event: WorldEvent) => boolean;

export class WorldEventCounter extends ValueCounter {
    readonly predicate: WorldEventPredicate;
    readonly eventCount: number;

    private eventSubscription: Subscription;

    constructor(opts: {
        readonly valueId: string;
        readonly predicate: WorldEventPredicate;
    }) {
        super({ valueId: opts.valueId });
        this.predicate = opts.predicate;
    }

    postBind(): void {
        this.eventSubscription = this.world.events
            .pipe(filter((event) => this.predicate(event)))
            .subscribe(() => this.incr(1));
    }

    unbind(): void {
        this.eventSubscription?.unsubscribe();
        this.eventSubscription = null;
    }
}
