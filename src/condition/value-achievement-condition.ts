import { AchievementProgress } from "../progress";
import { AchievementCondition } from "./achievement-condition";

export class ValueAchievementCondition extends AchievementCondition {
    readonly valueId: string;
    readonly count: number;

    constructor(opts: { readonly valueId: string; readonly count: number }) {
        super();
        this.valueId = opts.valueId;
        this.count = opts.count;
    }

    onEventCounted(valueId: string): void {
        if (valueId !== this.valueId) return;

        const count = this.countRecorder.getValue(valueId);
        if (count >= this.count) {
            this.unlocker.unlock(this.achievementId);
        }
    }

    progress(): AchievementProgress | null {
        return {
            current: this.countRecorder.getValue(this.valueId),
            target: this.count,
        };
    }
}

export function valueIsEqualOrGreaterThan(
    valueId: string,
    count: number,
): ValueAchievementCondition {
    return new ValueAchievementCondition({ valueId, count });
}
