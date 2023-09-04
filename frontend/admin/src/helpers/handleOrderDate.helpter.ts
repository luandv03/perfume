export const handleOrderDate = (orderDate: string) => {
    const date = new Date(orderDate);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day >= 10 ? day : "0" + `${day}`}/${
        month >= 10 ? month : "0" + `${month}`
    }/${year}`;
};
