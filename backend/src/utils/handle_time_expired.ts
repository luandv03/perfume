// convert 2023/08/16 => 20230826 (Number)
export const handleTimeExpired = (time: string | Date): Number => {
    const timeDate = new Date(time);

    const yearStartTime = timeDate.getFullYear();
    const monthStartTime: string =
        timeDate.getMonth() + 1 >= 10
            ? (timeDate.getMonth() + 1).toString()
            : "0" + (timeDate.getMonth() + 1).toString();
    const dayStartTime: string =
        timeDate.getDate() >= 10
            ? timeDate.getDate().toString()
            : "0" + timeDate.getDate().toString();

    const timeString = yearStartTime
        .toString()
        .concat(monthStartTime.toString())
        .concat(dayStartTime.toString());

    return Number(timeString);
};
