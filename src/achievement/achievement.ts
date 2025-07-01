import { AchievementCondition } from "../condition/achievement-condition";

export interface Achievement {
    readonly id: string;
    readonly label: string;
    readonly matcher: AchievementCondition;
}
