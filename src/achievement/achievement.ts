import { AchievementCondition } from "../condition/achievement-condition";
import { AchievementProgressType } from "../progress";

export class Achievement {
    readonly id: string;
    readonly label: string;
    readonly condition: AchievementCondition;
    readonly hideProgress: boolean;
    readonly progressType: AchievementProgressType;

    constructor(opts: {
        readonly id: string;
        readonly label: string;
        readonly condition: AchievementCondition;
        readonly hideProgress?: boolean;
        readonly progressType?: AchievementProgressType;
    }) {
        this.id = opts.id;
        this.label = opts.label;
        this.condition = opts.condition;
        this.hideProgress = opts.hideProgress ?? false;
        this.progressType = opts.progressType ?? AchievementProgressType.COUNT;
    }
}
