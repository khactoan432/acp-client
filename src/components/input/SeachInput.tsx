import Fuse from "fuse.js";
import removeAccents from "remove-accents";

/**
 * Hàm tìm kiếm dữ liệu dựa trên từ khóa không dấu.
 * @param {Array} data - Dữ liệu nguồn cần tìm kiếm.
 * @param {string} searchTerm - Từ khóa tìm kiếm.
 * @param {Array} keys - Các trường trong dữ liệu cần tìm kiếm.
 * @param {number} threshold - Độ chính xác khi tìm kiếm (0.0 đến 1.0).
 * @returns {Array} - Danh sách kết quả tìm kiếm đã được sắp xếp theo độ phù hợp.
 */
const normalizeString = (str: string) => {
  // Loại bỏ dấu và khoảng trắng thừa
  return removeAccents(str.toLowerCase().trim().replace(/\s+/g, " "));
};

const SearchInput = (data: any[], searchTerm: string, keys: string[]) => {
  if (!searchTerm || !data || !Array.isArray(data)) {
    return data;
  }

  // Chuẩn hóa từ khóa tìm kiếm
  const normalizedSearchTerm = normalizeString(searchTerm);

  // Chuẩn hóa dữ liệu đầu vào
  const normalizedData = data.map((item) => {
    const newItem = { ...item };
    keys.forEach((key) => {
      // Hỗ trợ nested keys như "overviews.desc"
      const keysPath = key.split(".");
      let value = newItem;

      keysPath.forEach((path) => {
        value = value[path];
      });

      // Chuẩn hóa chuỗi trong dữ liệu
      if (typeof value === "string") {
        let target = newItem;
        for (let i = 0; i < keysPath.length - 1; i++) {
          target = target[keysPath[i]];
        }
        target[keysPath[keysPath.length - 1]] = normalizeString(value);
      }
    });
    return newItem;
  });

  const options = {
    keys,
    threshold: 0.4, // Tăng ngưỡng để khớp linh hoạt hơn
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 1, // Cho phép so khớp từ khóa ngắn
  };

  const fuse = new Fuse(normalizedData, options);
  const results = fuse.search(normalizedSearchTerm);

  return results.map((result) => result.item);
};

export default SearchInput;
