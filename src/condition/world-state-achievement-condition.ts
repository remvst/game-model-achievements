import { World } from "@remvst/game-model";
import { AchievementCondition } from "./achievement-condition";

export interface WorldStateMatcher {
    eventLabel?: string;
    isInState(world: World): boolean;
}

export class WorldStateAchievementCondition extends AchievementCondition {
    readonly matcher: WorldStateMatcher;
    readonly eventCount: number;

    private inState = false;

    constructor(opts: { matcher: WorldStateMatcher; eventCount?: number }) {
        super();
        this.matcher = opts.matcher;
        this.eventCount = opts.eventCount === undefined ? 1 : opts.eventCount;
    }

    postBind(): void {
        super.postBind();
        this.inState = false;
    }

    update(): void {
        const inState = this.matcher.isInState(this.world);
        if (inState === this.inState) return;

        if (inState) {
            this.eventCounter.onEvent(this.matcher.eventLabel);

            const newCount = this.eventCounter.eventCount(
                this.matcher.eventLabel,
            );
            if (newCount >= this.eventCount) {
                this.unlocker.unlock();
            }
        }

        this.inState = inState;
    }
}
