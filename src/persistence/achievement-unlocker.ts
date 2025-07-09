import { AchievementId } from "../model";

export enum AchievementStatus {
    IN_PROGRESS = "in_progress",
    UNLOCKED = "unlocked",
    FAILED = "failed",
}

export interface AchievementUnlocker {
    unlock(achievementId: AchievementId): void;
    fail(achievementId: AchievementId): void;
    status(achievementId: AchievementId): AchievementStatus;
}
