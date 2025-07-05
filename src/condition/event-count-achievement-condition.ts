import { EventCountRecorder } from "../counting/event-count-recorder";
import { AchievementCondition } from "./achievement-condition";

export class EventCountAchievementCondition extends AchievementCondition {
    readonly eventId: string;
    readonly count: number;

    constructor(opts: { readonly eventId: string; readonly count: number }) {
        super();
        this.eventId = opts.eventId;
        this.count = opts.count;
    }

    onEventCounted(eventId: string): void {
        if (eventId !== this.eventId) return;

        const count = this.countRecorder.eventCount(eventId);
        if (count >= this.count) {
            this.unlocker.unlock(this.achievementId);
        }
    }

    progress(countRecorder: EventCountRecorder): number | null {
        const count = countRecorder.eventCount(this.eventId);
        return count / this.count;
    }
}
