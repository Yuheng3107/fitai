
export function timeSince(date: Date) {
    let now: Date = new Date();
    let difference = Number(now) - Number(date);
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    return `${days ? String(days).concat(" days") : String(hours % 24).concat("h")}`;
}