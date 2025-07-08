import { EventCounter } from "./event-counter";

export class SequenceEventCounter extends EventCounter {
    private readonly eventSequence: string[];
    private readonly resetEvent: string;

    private currentEventIndex = 0;
    private expectedEventCount = 0;
    private resetEventCount = 0;

    constructor(opts: {
        readonly eventId: string;
        readonly eventSequence: string[];
        readonly resetEvent: string;
    }) {
        super({ eventId: opts.eventId });
        this.eventSequence = opts.eventSequence;
        this.resetEvent = opts.resetEvent;
    }

    private resetSequence() {
        this.currentEventIndex = 0;
        this.expectedEventCount = this.eventCountRecorder.eventCount(
            this.eventSequence[0],
        );
        this.resetEventCount = this.eventCountRecorder.eventCount(
            this.resetEvent,
        );
    }

    postBind(): void {
        super.postBind();
        this.resetSequence();
    }

    update(): void {
        super.update();

        const currentResetCount = this.eventCountRecorder.eventCount(
            this.resetEvent,
        );
        if (currentResetCount > this.resetEventCount) {
            this.resetSequence();
        }

        const { expectedEventId } = this;
        if (!expectedEventId) return;

        const currentEventCount =
            this.eventCountRecorder.eventCount(expectedEventId);
        if (currentEventCount > this.expectedEventCount) {
            this.currentEventIndex++;

            const nextExpectedEventId =
                this.eventSequence[this.currentEventIndex];
            if (nextExpectedEventId) {
                this.expectedEventCount =
                    this.eventCountRecorder.eventCount(nextExpectedEventId);
            } else {
                this.incr(1);
            }
        }
    }

    private get expectedEventId(): string | undefined {
        return this.eventSequence[this.currentEventIndex];
    }
}
