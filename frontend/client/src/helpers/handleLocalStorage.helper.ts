export const getItemLocalStorage = <T>(key: string) => {
    return JSON.parse(localStorage.getItem(key) as string) as T;
};
