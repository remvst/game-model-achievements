import { AchievementProgress, AchievementStatus } from "../model";
import { AchievementStatusRecorder } from "../persistence/achievement-status-recorder";
import { ValueRecorder } from "../persistence/value-recorder";
import { AchievementCondition } from "./achievement-condition";

export class MultiAchievementCondition extends AchievementCondition {
    private readonly statuses = new Map<
        AchievementCondition,
        AchievementStatus
    >();

    constructor(
        readonly conditions: AchievementCondition[],
        readonly status: (statuses: AchievementStatus[]) => AchievementStatus,
    ) {
        super();
    }

    private onStatusUpdate() {
        const statuses = this.conditions.map(
            (condition) =>
                this.statuses.get(condition) || AchievementStatus.IN_PROGRESS,
        );
        const status = this.status(statuses);
        this.achievementStatusRecorder.setStatus(this.achievementId, status);
    }

    bind(
        countRecorder: ValueRecorder,
        achievementStatusRecorder: AchievementStatusRecorder,
        achievementId: string,
    ): void {
        super.bind(countRecorder, achievementStatusRecorder, achievementId);

        for (const condition of this.conditions) {
            condition.bind(
                countRecorder,
                {
                    setStatus: (_, status) => {
                        const oldStatus = this.statuses.get(condition);
                        if (oldStatus === status) return;

                        this.statuses.set(condition, status);
                        this.onStatusUpdate();
                    },
                    status: () =>
                        achievementStatusRecorder.status(this.achievementId),
                },
                achievementId,
            );
        }
    }

    postBind(): void {
        super.postBind();

        for (const condition of this.conditions) {
            condition.postBind();
            this.statuses.set(condition, AchievementStatus.IN_PROGRESS);
        }
    }

    onEventCounted(valueId: string): void {
        for (const condition of this.conditions) {
            condition.onEventCounted(valueId);
        }
    }

    progress(): AchievementProgress | null {
        const acc: AchievementProgress = {
            current: 0,
            target: 0,
        };
        for (const condition of this.conditions) {
            const progress = condition.progress();
            if (progress === null) return null;
            acc.current += progress.current;
            acc.target += progress.target;
        }
        return acc;
    }
}

export function succeedIfAll(...conditions: AchievementCondition[]) {
    return combineConditions(conditions, (statuses) => {
        if (statuses.some((status) => status === AchievementStatus.FAILED))
            return AchievementStatus.FAILED;
        if (statuses.every((status) => status === AchievementStatus.UNLOCKED))
            return AchievementStatus.UNLOCKED;
        return AchievementStatus.IN_PROGRESS;
    });
}

export function succeedIfAny(...conditions: AchievementCondition[]) {
    return combineConditions(conditions, (statuses) => {
        if (statuses.some((status) => status === AchievementStatus.FAILED))
            return AchievementStatus.FAILED;
        if (statuses.some((status) => status === AchievementStatus.UNLOCKED))
            return AchievementStatus.UNLOCKED;
        return AchievementStatus.IN_PROGRESS;
    });
}

export function combineConditions(
    conditions: AchievementCondition[],
    mapper: (statuses: AchievementStatus[]) => AchievementStatus,
) {
    return new MultiAchievementCondition(conditions, mapper);
}
