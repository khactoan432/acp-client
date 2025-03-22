/**
 * Kiểm tra xem mảng files có chứa tệp ảnh hoặc video hay không.
 * @param {File[][] | undefined} files - Mảng các mảng tệp để kiểm tra.
 * @returns {boolean} - True nếu có ít nhất một tệp ảnh hoặc video, ngược lại False.
 */
function ValidateFiles(files) {
    console.log("ValidateFiles: ", files);
    if (!files || files.length === 0) {
        return false; // Không có tệp nào.
    }
    // Kiểm tra từng mảng con và từng tệp trong các mảng con
    return files.some((fileArray) => fileArray.some((file) => file.type.startsWith("image/") || file.type.startsWith("video/")));
}
export default ValidateFiles;
