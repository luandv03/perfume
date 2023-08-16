// convert 2023/08/16 => 20230826 (Number)
export const handleTimeExpired = (time: string | Date): Number => {
    const timeDate = new Date(time);

    const yearStartTime = timeDate.getFullYear();
    const monthStartTime = timeDate.getMonth() + 1;
    const dayStartTime = timeDate.getDate();

    const timeString = yearStartTime
        .toString()
        .concat(monthStartTime.toString())
        .concat(dayStartTime.toString());

    return Number(timeString);
};
