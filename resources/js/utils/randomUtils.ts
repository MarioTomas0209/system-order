export const getRandomNumber = (start: number = 0, end: number = 1, decimal: boolean = false): number => {
    const random = Math.random() * (end - start) + start;
    return decimal ? random : Math.floor(random);
}

export const randomElement = <T>(array: T[]): T => {
    return array[getRandomNumber(0, array.length - 1)];
}

export const randomColorHex = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);

}

export function generateRandomString(length: number = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
