import { AchievementCondition } from "../condition/achievement-condition";

export class Achievement {
    readonly id: string;
    readonly label: string;
    readonly condition: AchievementCondition;
    readonly hideProgress: boolean;

    constructor(opts: {
        readonly id: string;
        readonly label: string;
        readonly condition: AchievementCondition;
        readonly hideProgress?: boolean;
    }) {
        this.id = opts.id;
        this.label = opts.label;
        this.condition = opts.condition;
        this.hideProgress = opts.hideProgress ?? false;
    }
}
