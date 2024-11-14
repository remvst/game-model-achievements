export interface AchievementUnlocker {
    isUnlocked(achievementId: string): boolean;
    unlock(achievementId: string): void;
}
