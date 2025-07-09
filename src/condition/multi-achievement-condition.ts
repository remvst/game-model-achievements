import { AchievementStatus } from "../model";
import { AchievementStatusRecorder } from "../persistence/achievement-status-recorder";
import { ValueRecorder } from "../persistence/value-recorder";
import { AchievementProgress } from "../progress";
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
        countRecorder: ValueRecorder,
        achievementStatusRecorder: AchievementStatusRecorder,
        achievementId: string,
    ): void {
        super.bind(countRecorder, achievementStatusRecorder, achievementId);

        for (const condition of this.conditions) {
            condition.bind(
                countRecorder,
                {
                    setStatus: (_, status) => {
                        if (status === AchievementStatus.UNLOCKED) {
                            this.succeeded.add(condition);

                            if (
                                this.succeeded.size === this.conditions.size &&
                                this.failed.size === 0
                            ) {
                                achievementStatusRecorder.setStatus(
                                    this.achievementId,
                                    AchievementStatus.UNLOCKED,
                                );
                            }
                        } else if (status === AchievementStatus.FAILED) {
                            this.failed.add(condition);
                            achievementStatusRecorder.setStatus(
                                this.achievementId,
                                AchievementStatus.FAILED,
                            );
                        }
                    },
                    status: () =>
                        achievementStatusRecorder.status(this.achievementId),
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

    onEventCounted(valueId: string): void {
        for (const condition of this.conditions) {
            condition.onEventCounted(valueId);
        }
    }

    progress(): AchievementProgress | null {
        const acc = {
            current: 0,
            target: 0,
        };
        for (const condition of this.conditions) {
            const progress = condition.progress();
            if (progress === null) return null;
            acc.current += progress.current;
            acc.target += progress.target;
        }
        return acc;
    }
}

export function succeedIfAll(
    ...conditions: AchievementCondition[]
): MultiAchievementCondition {
    return new MultiAchievementCondition(conditions);
}
