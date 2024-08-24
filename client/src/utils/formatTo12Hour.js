export function formatTo12Hour(dateString) {
    const format = (string) => {
        const date = new Date(string);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Add a leading zero to minutes if necessary
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;

    }
    const [start, end] = dateString.split('-')
    const s = format(start)
    const e = format(end)

    return `${s} - ${e}`
}
