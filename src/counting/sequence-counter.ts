import { ValueCounter } from "./value-counter";

export class SequenceCounter extends ValueCounter {
    private readonly eventSequence: string[];
    private readonly resetEvent: string;

    private currentEventIndex = 0;
    private expectedEventCount = 0;
    private resetEventCount = 0;

    constructor(opts: {
        readonly valueId: string;
        readonly eventSequence: string[];
        readonly resetEvent: string;
    }) {
        super({ valueId: opts.valueId });
        this.eventSequence = opts.eventSequence;
        this.resetEvent = opts.resetEvent;
    }

    private resetSequence() {
        this.currentEventIndex = 0;
        this.expectedEventCount = this.eventCountRecorder.getValue(
            this.eventSequence[0],
        );
        this.resetEventCount = this.eventCountRecorder.getValue(
            this.resetEvent,
        );
    }

    postBind(): void {
        super.postBind();
        this.resetSequence();
    }

    update(): void {
        super.update();

        const currentResetCount = this.eventCountRecorder.getValue(
            this.resetEvent,
        );
        if (currentResetCount > this.resetEventCount) {
            this.resetSequence();
        }

        const { expectedvalueId } = this;
        if (!expectedvalueId) return;

        const currentEventCount =
            this.eventCountRecorder.getValue(expectedvalueId);
        if (currentEventCount > this.expectedEventCount) {
            this.currentEventIndex++;

            const nextExpectedvalueId =
                this.eventSequence[this.currentEventIndex];
            if (nextExpectedvalueId) {
                this.expectedEventCount =
                    this.eventCountRecorder.getValue(nextExpectedvalueId);
            } else {
                this.incr(1);
            }
        }
    }

    private get expectedvalueId(): string | undefined {
        return this.eventSequence[this.currentEventIndex];
    }
}
