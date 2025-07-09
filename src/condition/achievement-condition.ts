import { AchievementProgress } from "../model";
import { AchievementStatusRecorder } from "../persistence/achievement-status-recorder";
import { ValueRecorder } from "../persistence/value-recorder";

export abstract class AchievementCondition {
    protected countRecorder: ValueRecorder;
    protected achievementStatusRecorder: AchievementStatusRecorder;
    protected achievementId: string;

    bind(
        countRecorder: ValueRecorder,
        achievementStatusRecorder: AchievementStatusRecorder,
        achievementId: string,
    ): void {
        this.countRecorder = countRecorder;
        this.achievementStatusRecorder = achievementStatusRecorder;
        this.achievementId = achievementId;
    }

    postBind() {}

    progress(): AchievementProgress | null {
        return null;
    }

    abstract onEventCounted(valueId: string): void;
}
