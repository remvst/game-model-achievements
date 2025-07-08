export enum AchievementProgressType {
    COUNT = "count",
    TIME = "time",
}

export interface AchievementProgress {
    type: AchievementProgressType;
    current: number;
    target: number;
}
