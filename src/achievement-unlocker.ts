export enum AchievementStatus {
    IN_PROGRESS = "in_progress",
    UNLOCKED = "unlocked",
    FAILED = "failed",
}

export interface AchievementUnlocker {
    unlock(achievementId: string): void;
    fail(achievementId: string): void;
    status(achievementId: string): AchievementStatus;
}
