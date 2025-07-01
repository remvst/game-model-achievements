import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCountRecorder } from "../counting/event-count-recorder";
import { AchievementCondition } from "./achievement-condition";

export class MultiAchievementCondition extends AchievementCondition {
    private readonly conditions = new Set<AchievementCondition>();
    private readonly failed = new Set<AchievementCondition>();
    private readonly succeeded = new Set<AchievementCondition>();

    constructor(conditions: AchievementCondition[]) {
        super();
        this.conditions = new Set(conditions);
    }

    bind(
        countRecorder: EventCountRecorder,
        unlocker: AchievementUnlocker,
        achievementId: string,
    ): void {
        super.bind(countRecorder, unlocker, achievementId);

        for (const condition of this.conditions) {
            condition.bind(
                countRecorder,
                {
                    unlock: () => {
                        this.succeeded.add(condition);

                        if (
                            this.succeeded.size === this.conditions.size &&
                            this.failed.size === 0
                        ) {
                            unlocker.unlock(this.achievementId);
                        }
                    },
                    fail: () => {
                        this.failed.add(condition);
                        unlocker.fail(this.achievementId);
                    },
                },
                achievementId,
            );
        }
    }

    postBind(): void {
        super.postBind();

        for (const condition of this.conditions) {
            condition.postBind();
        }

        this.failed.clear();
        this.succeeded.clear();
    }

    onEventCounted(eventId: string): void {
        for (const condition of this.conditions) {
            condition.onEventCounted(eventId);
        }
    }
}
