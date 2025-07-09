import { AchievementId, AchievementStatus } from "../model";

export interface AchievementStatusRecorder {
    setStatus(achievementId: AchievementId, status: AchievementStatus): void;
    status(achievementId: AchievementId): AchievementStatus;
}
