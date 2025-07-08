import { AchievementStatus, AchievementUnlocker } from "./achievement-unlocker";
import { EventCountRecorder } from "./counting/event-count-recorder";

export class InMemoryAchievementPersistence
    implements AchievementUnlocker, EventCountRecorder
{
    private readonly achievementStatuses = new Map<string, AchievementStatus>();
    private readonly eventCounts = new Map<string, number>();

    unlock(achievementId: string): void {
        this.achievementStatuses.set(achievementId, AchievementStatus.UNLOCKED);
    }

    fail(achievementId: string): void {
        this.achievementStatuses.set(achievementId, AchievementStatus.FAILED);
    }

    status(achievementId: string): AchievementStatus {
        return (
            this.achievementStatuses.get(achievementId) ||
            AchievementStatus.IN_PROGRESS
        );
    }

    setEventCount(eventId: string, count: number): void {
        this.eventCounts.set(eventId, count);
    }

    incrEvent(eventId: string, amount: number): void {
        this.eventCounts.set(
            eventId,
            (this.eventCounts.get(eventId) || 0) + amount,
        );
    }

    eventCount(eventId: string): number {
        return this.eventCounts.get(eventId) || 0;
    }
}
