export const handleOrderDate = (orderDate: string) => {
    const date = new Date(orderDate);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${second >= 10 ? second : "0" + `${second}`}:${
        minute >= 10 ? minute : "0" + `${minute}`
    }:${hour >= 10 ? hour : "0" + `${hour}`} 
    ${day >= 10 ? day : "0" + `${day}`}/ ${
        month >= 10 ? month : "0" + `${month}`
    }/${year}`;
};
