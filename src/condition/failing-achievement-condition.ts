import { AchievementUnlocker } from "../persistence/achievement-unlocker";
import { ValueRecorder } from "../persistence/value-recorder";
import { AchievementProgress } from "../progress";
import { AchievementCondition } from "./achievement-condition";

export class FailingAchievementCondition extends AchievementCondition {
    constructor(private readonly original: AchievementCondition) {
        super();
    }

    bind(
        countRecorder: ValueRecorder,
        unlocker: AchievementUnlocker,
        achievementId: string,
    ): void {
        super.bind(countRecorder, unlocker, achievementId);
        this.original.bind(
            countRecorder,
            {
                unlock: () => this.unlocker.fail(this.achievementId),
                fail: () => {},
                status: () => this.unlocker.status(this.achievementId),
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
