import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCounter } from "../event-counter";
import { AchievementCondition } from "./achievement-condition";

export class MultiAchievementCondition extends AchievementCondition {
    private readonly remainingConditions = new Set<AchievementCondition>();
    private readonly failedConditions = new Set<AchievementCondition>();

    constructor(private readonly conditions: AchievementCondition[]) {
        super();
    }

    bind(
        world: World,
        unlocker: AchievementUnlocker,
        eventCounter: EventCounter,
    ) {
        super.bind(world, unlocker, eventCounter);

        for (const condition of this.conditions) {
            this.remainingConditions.add(condition);

            condition.bind(
                world,
                {
                    unlock: () => {
                        this.remainingConditions.delete(condition);

                        if (
                            this.remainingConditions.size === 0 &&
                            this.failedConditions.size === 0
                        ) {
                            this.unlocker.unlock();
                        }
                    },
                    fail: () => {
                        this.failedConditions.add(condition);
                        this.unlocker.fail();
                    },
                },
                eventCounter,
            );
        }
    }

    postBind() {
        super.postBind();
        for (const condition of this.conditions) {
            condition.postBind();
        }
    }

    unbind() {
        super.unbind();
        for (const condition of this.conditions) {
            condition.unbind();
        }
    }

    update() {
        super.update();
        for (const condition of this.conditions) {
            condition.update();
        }
    }
}
