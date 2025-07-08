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

    progress(): number | null {
        const count = this.countRecorder.getValue(this.valueId);
        return count / this.count;
    }
}

export function valueEquals(
    valueId: string,
    count: number = 1,
): ValueAchievementCondition {
    return new ValueAchievementCondition({ valueId, count });
}
