import { AchievementCondition } from "../condition/achievement-condition";
import { AchievementId, ValueType } from "../model";

export class Achievement {
    readonly id: AchievementId;
    readonly label: string;
    readonly condition: AchievementCondition;
    readonly hideProgress: boolean;
    readonly valueType: ValueType;

    constructor(opts: {
        readonly id: AchievementId;
        readonly label: string;
        readonly condition: AchievementCondition;
        readonly hideProgress?: boolean;
        readonly valueType?: ValueType;
    }) {
        this.id = opts.id;
        this.label = opts.label;
        this.condition = opts.condition;
        this.hideProgress = opts.hideProgress ?? false;
        this.valueType = opts.valueType ?? ValueType.COUNT;
    }
}
