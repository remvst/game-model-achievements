import { AchievementCondition } from "../condition/achievement-condition";

export class Achievement {
    readonly id: string;
    readonly label: string;
    readonly condition: AchievementCondition;

    constructor(opts: {
        readonly id: string;
        readonly label: string;
        readonly condition: AchievementCondition;
    }) {
        this.id = opts.id;
        this.label = opts.label;
        this.condition = opts.condition;
    }
}
