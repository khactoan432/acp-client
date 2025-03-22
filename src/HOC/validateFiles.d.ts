/**
 * Kiểm tra xem mảng files có chứa tệp ảnh hoặc video hay không.
 * @param {File[][] | undefined} files - Mảng các mảng tệp để kiểm tra.
 * @returns {boolean} - True nếu có ít nhất một tệp ảnh hoặc video, ngược lại False.
 */
declare function ValidateFiles(files: File[][] | undefined): boolean;
export default ValidateFiles;
