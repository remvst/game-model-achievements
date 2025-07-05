import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCountRecorder } from "../counting/event-count-recorder";
import { AchievementCondition } from "./achievement-condition";

export class FailingAchievementCondition extends AchievementCondition {
    constructor(private readonly original: AchievementCondition) {
        super();
    }

    bind(
        countRecorder: EventCountRecorder,
        unlocker: AchievementUnlocker,
        achievementId: string,
    ): void {
        super.bind(countRecorder, unlocker, achievementId);
        this.original.bind(
            countRecorder,
            {
                unlock: () => this.unlocker.fail(this.achievementId),
                fail: () => {},
            },
            achievementId,
        );
    }

    postBind(): void {
        super.postBind();
        this.original.postBind();
    }

    onEventCounted(eventId: string): void {
        this.original.onEventCounted(eventId);
    }

    progress(countRecorder: EventCountRecorder): number | null {
        const progress = this.original.progress(countRecorder);
        if (progress === null) return null;
        return 1 - progress;
    }
}
