export interface EventCountRecorder {
    eventCount(eventId: string): number;
    onEvent(eventId: string): void;
}
