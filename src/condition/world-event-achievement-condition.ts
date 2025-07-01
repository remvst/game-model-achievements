import { WorldEvent } from "@remvst/game-model";
import { filter, Subscription } from "rxjs";
import { AchievementCondition } from "./achievement-condition";

export interface WorldEventMatcher {
    eventLabel: string;
    filterEvent(event: WorldEvent): boolean;
}

export class WorldEventAchievementCondition extends AchievementCondition {
    readonly matcher: WorldEventMatcher;
    readonly eventCount: number;

    private eventSubscription: Subscription;

    constructor(opts: { matcher: WorldEventMatcher; eventCount?: number }) {
        super();
        this.matcher = opts.matcher;
        this.eventCount = opts.eventCount === undefined ? 1 : opts.eventCount;
    }

    postBind(): void {
        this.eventSubscription = this.world.events
            .pipe(filter((event) => this.matcher.filterEvent(event)))
            .subscribe(() => {
                this.eventCounter.onEvent(this.matcher.eventLabel);

                const newCount = this.eventCounter.eventCount(
                    this.matcher.eventLabel,
                );
                if (newCount >= this.eventCount) {
                    this.unlocker.unlock();
                }
            });
    }

    unbind(): void {
        this.eventSubscription?.unsubscribe();
        this.eventSubscription = null;
    }
}
