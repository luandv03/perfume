export const createWindow = (
    pageURL: string,
    pageTitle: string,
    popupWinWidth: number,
    popupWinHeight: number
) => {
    const left = (screen.width - popupWinWidth) / 2;
    const top = (screen.height - popupWinHeight) / 4;

    const myWindow = window.open(
        pageURL,
        pageTitle,
        "resizable=yes, width=" +
            popupWinWidth +
            ", height=" +
            popupWinHeight +
            ", top=" +
            top +
            ", left=" +
            left
    );

    return myWindow;
};
