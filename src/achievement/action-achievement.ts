import { Achievement } from "./achievement";

export class ActionAchievement extends Achievement {
    readonly id: string;
    readonly label: string;
    readonly eventLabel: string;
    readonly eventCount: number;

    constructor(
        opts: Readonly<{
            id: string;
            label: string;
            eventLabel: string;
            eventCount: number;
        }>,
    ) {
        super();
        this.id = opts.id;
        this.label = opts.label;
        this.eventLabel = opts.eventLabel;
        this.eventCount = opts.eventCount;
    }
}
