import { AchievementId, AchievementStatus } from "../model";
import { AchievementStatusRecorder } from "./achievement-status-recorder";
import { ValueRecorder } from "./value-recorder";

export class InMemoryAchievementPersistence
    implements AchievementStatusRecorder, ValueRecorder
{
    private readonly statuses = new Map<string, AchievementStatus>();
    private readonly values = new Map<string, number>();

    setStatus(achievementId: AchievementId, status: AchievementStatus): void {
        this.statuses.set(achievementId, status);
    }

    status(achievementId: AchievementId): AchievementStatus {
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
