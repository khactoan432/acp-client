import React, { useEffect, useRef, useState } from "react";

// import banner from "../../assets/banner1.jpg";
import banner3 from "../../assets/banner3.jpg";
import Advisory from "../../components/features/Advisory/Advisory";
import Exam from "../../components/features/Exam/Exam";
// import SideFilter from "../../components/features/SideFilter/SideFilter";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchUserExams } from "../../redux/slices/examSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserCategories } from "../../redux/slices/categorySlice";
import useFetchData from "../../hooks/useFetchData";

const UserExam: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const currentCategory = category ?? "default";

  const examsPerPage = 6;
  
  const [currentPage, setCurrentPage] = useState(1);

  // console.log(currentCategory);
  // Fetch user categories
  const { userCategories, loading: categoriesLoading, error: categoriesError } = useSelector(
    (state: RootState) => state.categories
  );
  console.log(categoriesLoading, categoriesError);
  useFetchData(fetchUserCategories);
  console.log(userCategories);

  const [filter, setFilter] = useState<{ type: string; value: string[] }[]>([]);
  console.log(filter);

  // Fetch user exams
  const { userExams, totalUser, loading: examsLoading, error: examsError } = useSelector(
    (state: RootState) => state.exams
  );
  console.log(examsLoading, examsError)
  useFetchData(() => fetchUserExams({ page: currentPage, limit: examsPerPage , filters: filter}), [filter, currentPage]);
  console.log(userExams);
  
  useEffect(() => {
    const categoryExists = userCategories.some((cat) =>
      cat.value.some(item => item.value === currentCategory)
    );

    setFilter((prevFilter) => {
      // Lọc các bộ lọc không phải "Danh mục"
      const nonCategoryFilters = prevFilter.filter(
        (filter) => filter.type !== "Danh mục"
      );

      // Tạo bộ lọc "Danh mục" mới (nếu hợp lệ)
      const categoryFilter = categoryExists
        ? [{ type: "Danh mục", value: [currentCategory] }]
        : [];

      // Kết hợp các bộ lọc
      return [...categoryFilter, ...nonCategoryFilters];
    });
  }, [currentCategory, userCategories]);

  // useEffect(() => {
  //   const filteredExams = userExams.filter((exam) =>
  //     userCategories.every((category) => {
  //       // Get filters relevant to the current category
  //       const relevantFilters = filter.filter((f) => f.type === category.option);

  //       // If no filters for this category, accept this category without filtering
  //       if (relevantFilters.length === 0) return true;

  //       // Otherwise, check if at least one filter matches the exam's tags
  //       return relevantFilters.some((f) =>
  //         exam.categories.some((tag) => tag.type === f.type && tag.value.includes(f.value))
  //       );
  //     })
  //   );
  //   setExamsFilter(filteredExams);
  // }, [filter, userCategories, userExams]);

  const changeFilter = (type: string, value: string, checked: boolean) => {
    setFilter((prevFilter) => {
      // Kiểm tra xem loại filter đã tồn tại trong filter chưa
      const existingFilter = prevFilter.find((filter) => filter.type === type);
  
      if (checked) {
        if (existingFilter) {
          // Nếu filter tồn tại rồi, kiểm tra value đã có trong values chưa
          if (!existingFilter.value.includes(value)) {
            // Nếu chưa có, thêm value vào values
            return prevFilter.map((filter) =>
              filter.type === type
                ? { ...filter, value: [...filter.value, value] }
                : filter
            );
          }
          // Nếu value đã tồn tại, không làm gì
          return prevFilter;
        } else {
          // Nếu filter chưa tồn tại, tạo mới với mảng values chứa giá trị
          return [...prevFilter, { type, value: [value] }];
        }
      } else {
        if (existingFilter) {
          // Nếu filter tồn tại và bỏ chọn, xóa giá trị khỏi mảng values
          const updatedFilter = {
            ...existingFilter,
            value: existingFilter.value.filter((v) => v !== value),
          };
  
          // Nếu mảng value rỗng sau khi xóa, xóa filter khỏi mảng
          if (updatedFilter.value.length === 0) {
            return prevFilter.filter((filter) => filter.type !== type);
          }
  
          // Nếu mảng value không rỗng, cập nhật filter
          return prevFilter.map((filter) =>
            filter.type === type ? updatedFilter : filter
          );
        } else {
          return prevFilter;
        }
      }
    });
  };

  const isChecked = (type: string, value: string): boolean => {
    return filter.some((f) => f.type === type && f.value.includes(value));
  };

  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);


  // Calculate indices for the exams to display
  // const indexOfLastExam = currentPage * examsPerPage;
  // const indexOfFirstExam = indexOfLastExam - examsPerPage;
  // const currentExams = examsFilter.slice(indexOfFirstExam, indexOfLastExam);

  // Calculate total pages
  const totalPages = Math.ceil(totalUser / examsPerPage);

  // Ref for scrolling
  const examListRef = useRef<HTMLDivElement>(null);

  const scrollToExams = () => {
    if (examListRef.current) {
      const offset = 100; // Desired offset from the top
      const topPosition =
        examListRef.current.getBoundingClientRect().top + window.pageYOffset;

      // Scroll smoothly to the correct position
      window.scrollTo({ top: topPosition - offset, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToExams(); // Scroll whenever page changes
  };

  return (
    <div>
      <div className="w-full mt-14">
        <div className="max-w-[1228px] mx-auto">
          <img src={banner3} alt="alt" />
        </div>
      </div>

      <div className="max-w-[1228px] mx-auto mt-20 text-[#00095B] pb-20">
        <p className="text-4xl mb-2">Đề thi online</p>
        <p className="text-base">
          Phần mềm và chương trình học online chất lượng cao của STUDY4 được
          thiết kế theo chương trình tiếng Anh chuẩn CEFR (A1 -C2) của đại học
          Cambridge và Oxford (Anh) với hệ thống bài giảng, bài tập phong phú đa
          dạng. Bạn có thể học thử miễn phí trước khi đặt mua sản phẩm.
        </p>

        <div className="flex pt-14">
          <div className="w-full max-w-[20%] lg:w-1/3 px-4 rounded-lg sticky top-[80px] h-max">
            {userCategories?.map((category, categoryId)=>(
              category.option==="Danh mục"
                ? <div className="mb-6" key={categoryId}>
                    <h3 className="font-bold text-lg mb-2">Tất Cả Danh Mục</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {category?.value?.map((value, index) => (
                        value.value === currentCategory ? 
                          <li className="text-red-500 font-medium cursor-pointer" key={index}>{value.value}</li>
                          : 
                          <li className="hover:text-blue-500 font-medium cursor-pointer" key={index} onClick={() => navigate(`/exams/${value.value}`)}>{value.value}</li>
                      ))}
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
                : ""
            ))}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Bộ Lọc Tìm Kiếm</h3>
              {userCategories?.map((category, categoryId)=>(
                category.option==="Danh mục"
                  ? ""
                  : <div className="mb-4" key={categoryId}>
                      {/* Category Filter */}
                      <h4 className="text-sm font-medium mb-2">{category?.option}</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {category?.value?.map((value, i)=>(
                          <li key={i}>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" className="mr-2" 
                                checked={isChecked(category.option, value.value)}
                                onChange={(e)=>changeFilter(category.option, value.value, e.target.checked)}
                              />
                              {value.value}
                            </label>
                          </li>
                        ))}
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
              ))}
            </div>
          </div>

          <div className="max-w-[80%] w-full flex flex-col mt-2 mb-8">
            <div
              className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 mx-3  flex-grow"
              ref={examListRef}
            >
              {userExams.map(( exam) => (
                <div key={exam._id}>
                  <Exam
                    _id={exam._id}
                    name={exam.name}
                    image={exam.image}
                    price={Number(exam.price)}
                    discount={Number(exam.discount)}
                    time={15}
                    rating={4.8}
                    rates={123}
                    problems={15}
                    users={234}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Section */}
            <div className="flex justify-center items-center mt-8">
              <button
                className={`px-4 py-2 mx-1 ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } rounded`}
                disabled={currentPage === 1}
                onClick={() => {
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                  } rounded`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className={`px-4 py-2 mx-1 ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } rounded`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Advisory />
    </div>
  );
};

export default UserExam;
