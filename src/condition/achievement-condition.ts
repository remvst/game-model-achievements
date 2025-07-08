import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCountRecorder } from "../counting/event-count-recorder";

export abstract class AchievementCondition {
    protected countRecorder: EventCountRecorder;
    protected unlocker: AchievementUnlocker;
    protected achievementId: string;

    bind(
        countRecorder: EventCountRecorder,
        unlocker: AchievementUnlocker,
        achievementId: string,
    ): void {
        this.countRecorder = countRecorder;
        this.unlocker = unlocker;
        this.achievementId = achievementId;
    }

    postBind() {}

    progress(): number | null {
        return null;
    }

    abstract onEventCounted(eventId: string): void;
}
