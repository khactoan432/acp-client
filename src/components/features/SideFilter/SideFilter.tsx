import React, { useState } from "react";

const SideFilter: React.FC = () => {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div className="w-full lg:w-1/3 px-4 rounded-lg sticky top-[80px] h-max">
      {/* All Categories Section */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Tất Cả Danh Mục</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="text-red-500 font-medium">Đề ICPC</li>
          <li className="hover:text-blue-500 cursor-pointer">Đề Tài năng tin học trẻ</li>
          <li className="hover:text-blue-500 cursor-pointer">Đề Chuyên tin học THPT</li>
          <li className="hover:text-blue-500 cursor-pointer">Đề Olympic tin học</li>
          {showMoreCategories && (
            <li className="hover:text-blue-500 cursor-pointer">Danh Mục Khác</li>
          )}
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => setShowMoreCategories(!showMoreCategories)}
          >
            {showMoreCategories ? "Thu gọn" : "Thêm"}
          </li>
        </ul>
      </div>

      {/* Filter Section */}
      <div>
        <h3 className="font-bold text-lg mb-2">Bộ Lọc Tìm Kiếm</h3>
        <div className="mb-4">
          {/* Category Filter */}
          <h4 className="text-sm font-medium mb-2">Theo Độ Khó</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Đề test khả năng mới học
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Đề ôn luyện
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Đề luyện tập
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Đề khó
              </label>
            </li>
            {showMoreFilters && (
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Đề siêu khó
                </label>
              </li>
            )}
          </ul>
          <p
            className="text-blue-500 cursor-pointer mt-2 text-sm"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            {showMoreFilters ? "Thu gọn" : "Thêm"}
          </p>
        </div>

        {/* Location Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Theo khu vực</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Hà Nội
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Đà Nẵng
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Miền Bắc
              </label>
            </li>
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Miền trung
              </label>
            </li>
            <li>
              <p className="text-blue-500 cursor-pointer">Thêm</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideFilter;
