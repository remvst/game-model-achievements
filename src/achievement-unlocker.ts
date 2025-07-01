export interface AchievementUnlocker {
    unlock(achievementId: string): void;
    fail(achievementId: string): void;
}
