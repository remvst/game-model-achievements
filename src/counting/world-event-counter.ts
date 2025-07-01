import { WorldEvent } from "@remvst/game-model";
import { filter, Subscription } from "rxjs";
import { EventCounter } from "./event-counter";

export type WorldEventPredicate = (event: WorldEvent) => boolean;

export class WorldEventCounter extends EventCounter {
    readonly predicate: WorldEventPredicate;
    readonly eventCount: number;

    private eventSubscription: Subscription;

    constructor(opts: { eventId: string; predicate: WorldEventPredicate }) {
        super({ eventId: opts.eventId });
        this.predicate = opts.predicate;
    }

    postBind(): void {
        this.eventSubscription = this.world.events
            .pipe(filter((event) => this.predicate(event)))
            .subscribe(() => this.count());
    }

    unbind(): void {
        this.eventSubscription?.unsubscribe();
        this.eventSubscription = null;
    }
}
