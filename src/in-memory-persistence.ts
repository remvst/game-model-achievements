import { AchievementStatus, AchievementUnlocker } from "./achievement-unlocker";
import { ValueRecorder } from "./persistence/value-recorder";

export class InMemoryAchievementPersistence
    implements AchievementUnlocker, ValueRecorder
{
    private readonly statuses = new Map<string, AchievementStatus>();
    private readonly values = new Map<string, number>();

    unlock(achievementId: string): void {
        this.statuses.set(achievementId, AchievementStatus.UNLOCKED);
    }

    fail(achievementId: string): void {
        this.statuses.set(achievementId, AchievementStatus.FAILED);
    }

    status(achievementId: string): AchievementStatus {
        return (
            this.statuses.get(achievementId) || AchievementStatus.IN_PROGRESS
        );
    }

    setValue(valueId: string, count: number): void {
        this.values.set(valueId, count);
    }

    getValue(valueId: string): number {
        return this.values.get(valueId) || 0;
    }
}
