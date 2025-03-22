interface InputData {
    [key: string]: string | string[] | Record<string, any> | null | undefined;
}
declare const validateInput: (data: InputData) => boolean;
export default validateInput;
