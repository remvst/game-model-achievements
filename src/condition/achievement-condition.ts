import { AchievementUnlocker } from "../persistence/achievement-unlocker";
import { ValueRecorder } from "../persistence/value-recorder";
import { AchievementProgress } from "../progress";

export abstract class AchievementCondition {
    protected countRecorder: ValueRecorder;
    protected unlocker: AchievementUnlocker;
    protected achievementId: string;

    bind(
        countRecorder: ValueRecorder,
        unlocker: AchievementUnlocker,
        achievementId: string,
    ): void {
        this.countRecorder = countRecorder;
        this.unlocker = unlocker;
        this.achievementId = achievementId;
    }

    postBind() {}

    progress(): AchievementProgress | null {
        return null;
    }

    abstract onEventCounted(valueId: string): void;
}
