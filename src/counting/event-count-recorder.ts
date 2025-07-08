export interface EventCountRecorder {
    eventCount(eventId: string): number;
    setEventCount(eventId: string, count: number): void;
}
