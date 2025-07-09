export type ValueId = string;

export enum ValueType {
    COUNT = "count",
    TIME = "time",
}

export type AchievementId = string;

export enum AchievementStatus {
    IN_PROGRESS = "in_progress",
    UNLOCKED = "unlocked",
    FAILED = "failed",
}

export interface AchievementProgress {
    current: number;
    target: number;
}
