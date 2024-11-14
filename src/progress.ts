import { Achievement } from "./achievement/achievement";
import { ActionAchievement } from "./achievement/action-achievement";
import { WorldEventAchievement } from "./achievement/world-event-achievement";
import { EventCounter } from "./event-counter";

export function achievementProgress(
    eventCounter: EventCounter,
    achievement: Achievement,
): number {
    if (achievement instanceof ActionAchievement) {
        return (
            eventCounter.eventCount(achievement.eventLabel) /
            achievement.eventCount
        );
    } else if (achievement instanceof WorldEventAchievement) {
        return (
            eventCounter.eventCount(achievement.matcher.eventLabel) /
            achievement.eventCount
        );
    }

    return 0;
}
