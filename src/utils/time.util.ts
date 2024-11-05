export function getTime(date: Date = new Date()): Date {
    return new Date(date.getTime() + 9 * 60 * 60 * 1000)
}
