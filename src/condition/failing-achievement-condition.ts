import { AchievementProgress, AchievementStatus } from "../model";
import { AchievementStatusRecorder } from "../persistence/achievement-status-recorder";
import { ValueRecorder } from "../persistence/value-recorder";
import { AchievementCondition } from "./achievement-condition";

export class FailingAchievementCondition extends AchievementCondition {
    constructor(private readonly original: AchievementCondition) {
        super();
    }

    bind(
        countRecorder: ValueRecorder,
        achievementStatusRecorder: AchievementStatusRecorder,
        achievementId: string,
    ): void {
        super.bind(countRecorder, achievementStatusRecorder, achievementId);
        this.original.bind(
            countRecorder,
            {
                setStatus: () =>
                    this.achievementStatusRecorder.setStatus(
                        this.achievementId,
                        AchievementStatus.FAILED,
                    ),
                status: () =>
                    this.achievementStatusRecorder.status(this.achievementId),
            },
            achievementId,
        );
    }

    postBind(): void {
        super.postBind();
        this.original.postBind();
    }

    onEventCounted(valueId: string): void {
        this.original.onEventCounted(valueId);
    }

    progress(): AchievementProgress | null {
        const progress = this.original.progress();
        if (progress === null) return null;
        progress.current = progress.target - progress.current;
        return progress;
    }
}

export function failIf(
    condition: AchievementCondition,
): FailingAchievementCondition {
    return new FailingAchievementCondition(condition);
}
