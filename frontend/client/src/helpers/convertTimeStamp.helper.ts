export const convertTimeStamp = (orderDate: string) => {
    const date = new Date(orderDate);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${day >= 10 ? day : "0" + `${day}`}/${
        month >= 10 ? month : "0" + `${month}`
    }/${year} ${hour}:${minute}:${second}`;
};
