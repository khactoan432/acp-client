import React, { useEffect, useRef, useState } from 'react';

import banner from '../../assets/banner1.jpg';
import banner3 from '../../assets/banner3.jpg';
import Advisory from '../../components/features/Advisory/Advisory';
import Exam from '../../components/features/Exam/Exam';
import SideFilter from '../../components/features/SideFilter/SideFilter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchUserExams } from '../../redux/slices/examSlice';
import { useNavigate, useParams } from 'react-router-dom';

const UserExam: React.FC = () => {
  const navigate = useNavigate();
  const { currentCategory } = useParams<{ category: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { userExams, loading, error } = useSelector((state: RootState) => state.exams);

  useEffect(() => {
    dispatch(fetchUserExams({ page: 1, limit: 4 }));
  }, [dispatch]);
  console.log(userExams);

  const [examsFilter, setExamsFilter ] = useState(exams);
  
  const [filter, setFilter] = useState(() => {
    const categoryExists = categories.some(cat => cat.values.includes(currentCategory));
  
    return [
      ...(categoryExists ? [{ type: "Danh mục", value: currentCategory }] : []),
      { type: "Theo độ khó", value: "Đề luyện tập" },
      { type: "Theo khu vực", value: "Hà Nội" },
      { type: "Theo khu vực", value: "Đà Nẵng" }
    ];
  });
  

  useEffect(() => {
    const filteredExams = exams.filter((exam) =>
      categories.every((category) => {
        // Get filters relevant to the current category
        const relevantFilters = filter.filter((f) => f.type === category.type);
  
        // If no filters for this category, accept this category without filtering
        if (relevantFilters.length === 0) return true;
  
        // Otherwise, check if at least one filter matches the exam's tags
        return relevantFilters.some((f) =>
          exam.tags.some((tag) => tag.type === f.type && tag.value === f.value)
        );
      })
    );
    setExamsFilter(filteredExams);
  }, [filter]);

  const changeFilter = (type: string, value: string, checked: boolean) => {
    setFilter((prevFilter) => {
      if (checked) {
        // Add filter if checked
        return [...prevFilter, { type, value }];
      } else {
        // Remove filter if unchecked
        return prevFilter.filter(
          (filter) => !(filter.type === type && filter.value === value)
        );
      }
    });
  };

  const isChecked = (type: string, value: string): boolean => {
    return filter.some((f) => f.type === type && f.value === value);
  };

  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 9;

  // Calculate indices for the exams to display
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = examsFilter.slice(indexOfFirstExam, indexOfLastExam);

  // Calculate total pages
  const totalPages = Math.ceil(examsFilter.length / examsPerPage);

  // Ref for scrolling
  const examListRef = useRef<HTMLDivElement>(null);

  const scrollToExams = () => {
    if (examListRef.current) {
      const offset = 100; // Desired offset from the top
      const topPosition =
        examListRef.current.getBoundingClientRect().top + window.pageYOffset;
  
      // Scroll smoothly to the correct position
      window.scrollTo({ top: topPosition - offset, behavior: 'smooth' });
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
        <p className="text-4xl font-semibold mb-2">Đề thi online</p>
        <p className="text-base">
          Phần mềm và chương trình học online chất lượng cao của STUDY4 được
          thiết kế theo chương trình tiếng Anh chuẩn CEFR (A1 -C2) của đại học
          Cambridge và Oxford (Anh) với hệ thống bài giảng, bài tập phong phú đa
          dạng. Bạn có thể học thử miễn phí trước khi đặt mua sản phẩm.
        </p>

        <div className="flex pt-14">
          <div className="w-full max-w-[20%] lg:w-1/3 px-4 rounded-lg sticky top-[80px] h-max">
            {categories?.map((category)=>(
              category.type==="Danh mục"
                ? <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Tất Cả Danh Mục</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {category?.values?.map((value) => (
                        value === currentCategory ? 
                          <li className="text-red-500 font-medium cursor-pointer">{value}</li>
                          : 
                          <li className="hover:text-blue-500 font-medium cursor-pointer" onClick={() => navigate(`/exam/${value}`)}>{value}</li>
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
              {categories?.map((category)=>(
                category.type==="Danh mục"
                  ? ""
                  : <div className="mb-4">
                      {/* Category Filter */}
                      <h4 className="text-sm font-medium mb-2">Theo Độ Khó</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {category?.values?.map((value)=>(
                          <li>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" className="mr-2" 
                                checked={isChecked(category.type, value)}
                                onChange={(e)=>changeFilter(category.type, value, e.target.checked)}
                              />
                              {value}
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
            {/* <div className="mb-6">
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

            <div>
              <h3 className="font-bold text-lg mb-2">Bộ Lọc Tìm Kiếm</h3>
              <div className="mb-4">
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
            </div> */}
          </div>

          <div className='max-w-[80%] w-full'>
            <div
              className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 mx-3"
              ref={examListRef}
            >
              {currentExams.map((exam) => (
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
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
                  } rounded`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className={`px-4 py-2 mx-1 ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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

const categories = [
  {
    type: "Danh mục" , 
    values: ["Đề ICPC", "Đề Tài năng tin học trẻ", "Đề Chuyên tin học THPT", "Đề Olympic tin học"]
  },
  {
    type: "Theo độ khó",
    values: ["Đề test khả năng mới học", "Đề ôn luyện", "Đề luyện tập", "Đề khó"]
  },
  {
    type: "Theo khu vực",
    values: ["Hà Nội", "Đà Nẵng", "Miền Bắc", "Miền trung"]
  }
]

const exams = [
 {'_id': '03afmstn',
  'name': 'Khóa học tin học 1',
  'image': banner,
  'price': 12773,
  'discount': 2888,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'xswshxz2',
  'name': 'Khóa học tin học 2',
  'image': banner,
  'price': 91086,
  'discount': 5941,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'evl96q24',
  'name': 'Khóa học tin học 3',
  'image': banner,
  'price': 63259,
  'discount': 8842,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'd0qcpcry',
  'name': 'Khóa học tin học 4',
  'image': banner,
  'price': 68535,
  'discount': 9117,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'rf3h7hha',
  'name': 'Khóa học tin học 5',
  'image': banner,
  'price': 11206,
  'discount': 9188,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': '7lb38g35',
  'name': 'Khóa học tin học 6',
  'image': banner,
  'price': 70340,
  'discount': 9155,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'tcgqw5dx',
  'name': 'Khóa học tin học 7',
  'image': banner,
  'price': 37046,
  'discount': 9997,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'c2bxh1of',
  'name': 'Khóa học tin học 8',
  'image': banner,
  'price': 98943,
  'discount': 3884,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'jsrvkn4w',
  'name': 'Khóa học tin học 9',
  'image': banner,
  'price': 75608,
  'discount': 1577,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': '3s8ca2he',
  'name': 'Khóa học tin học 10',
  'image': banner,
  'price': 42587,
  'discount': 6500,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'ohm5h71i',
  'name': 'Khóa học tin học 11',
  'image': banner,
  'price': 40864,
  'discount': 5490,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'tg05pbos',
  'name': 'Khóa học tin học 12',
  'image': banner,
  'price': 70566,
  'discount': 7210,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'k24z4y28',
  'name': 'Khóa học tin học 13',
  'image': banner,
  'price': 97078,
  'discount': 9173,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': '3xjbbv7d',
  'name': 'Khóa học tin học 14',
  'image': banner,
  'price': 53624,
  'discount': 3753,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'd2lwasm2',
  'name': 'Khóa học tin học 15',
  'image': banner,
  'price': 74464,
  'discount': 1775,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'qakugw3n',
  'name': 'Khóa học tin học 16',
  'image': banner,
  'price': 35599,
  'discount': 8730,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'pbpw9yus',
  'name': 'Khóa học tin học 17',
  'image': banner,
  'price': 88775,
  'discount': 1547,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'etju4znc',
  'name': 'Khóa học tin học 18',
  'image': banner,
  'price': 92490,
  'discount': 6998,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'cwpag8q4',
  'name': 'Khóa học tin học 19',
  'image': banner,
  'price': 39822,
  'discount': 1554,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'ihmsdngb',
  'name': 'Khóa học tin học 20',
  'image': banner,
  'price': 97005,
  'discount': 8344,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'p1813byl',
  'name': 'Khóa học tin học 21',
  'image': banner,
  'price': 96606,
  'discount': 3589,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'ioelh6dl',
  'name': 'Khóa học tin học 22',
  'image': banner,
  'price': 44428,
  'discount': 8315,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'g30dtmt8',
  'name': 'Khóa học tin học 23',
  'image': banner,
  'price': 61648,
  'discount': 4421,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'flaklc8u',
  'name': 'Khóa học tin học 24',
  'image': banner,
  'price': 37392,
  'discount': 1638,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'meecvn10',
  'name': 'Khóa học tin học 25',
  'image': banner,
  'price': 60565,
  'discount': 5114,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'ogqomd66',
  'name': 'Khóa học tin học 26',
  'image': banner,
  'price': 92249,
  'discount': 5787,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'jbv90kcy',
  'name': 'Khóa học tin học 27',
  'image': banner,
  'price': 15497,
  'discount': 7974,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'q6ew2pnp',
  'name': 'Khóa học tin học 28',
  'image': banner,
  'price': 13270,
  'discount': 8523,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': '5g7m40aj',
  'name': 'Khóa học tin học 29',
  'image': banner,
  'price': 50204,
  'discount': 1262,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': '8fxntf0o',
  'name': 'Khóa học tin học 30',
  'image': banner,
  'price': 46268,
  'discount': 9568,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'cgjcjbau',
  'name': 'Khóa học tin học 31',
  'image': banner,
  'price': 88549,
  'discount': 9985,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'y1pu1pka',
  'name': 'Khóa học tin học 32',
  'image': banner,
  'price': 53692,
  'discount': 1510,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': '6kxqq49x',
  'name': 'Khóa học tin học 33',
  'image': banner,
  'price': 42478,
  'discount': 5820,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': '9vu142a9',
  'name': 'Khóa học tin học 34',
  'image': banner,
  'price': 10263,
  'discount': 2923,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': '9ciyws97',
  'name': 'Khóa học tin học 35',
  'image': banner,
  'price': 24461,
  'discount': 8350,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'w8c82imp',
  'name': 'Khóa học tin học 36',
  'image': banner,
  'price': 77218,
  'discount': 8361,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'iar5pzwv',
  'name': 'Khóa học tin học 37',
  'image': banner,
  'price': 16083,
  'discount': 1130,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'bo1pp2lc',
  'name': 'Khóa học tin học 38',
  'image': banner,
  'price': 49034,
  'discount': 2274,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'gogxbdes',
  'name': 'Khóa học tin học 39',
  'image': banner,
  'price': 98852,
  'discount': 3052,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'bidkewgk',
  'name': 'Khóa học tin học 40',
  'image': banner,
  'price': 87499,
  'discount': 8613,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'qyehlglg',
  'name': 'Khóa học tin học 41',
  'image': banner,
  'price': 89335,
  'discount': 6271,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'efdf4fy3',
  'name': 'Khóa học tin học 42',
  'image': banner,
  'price': 16845,
  'discount': 6802,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'gfqlb2b9',
  'name': 'Khóa học tin học 43',
  'image': banner,
  'price': 82022,
  'discount': 8812,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'j5rq0ocd',
  'name': 'Khóa học tin học 44',
  'image': banner,
  'price': 29102,
  'discount': 4457,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': '0aok60bh',
  'name': 'Khóa học tin học 45',
  'image': banner,
  'price': 51224,
  'discount': 6436,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 'tgfs3cyz',
  'name': 'Khóa học tin học 46',
  'image': banner,
  'price': 73756,
  'discount': 8274,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Miền Bắc'}]},
 {'_id': 't8bte0n3',
  'name': 'Khóa học tin học 47',
  'image': banner,
  'price': 95503,
  'discount': 2956,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': '2apoenn1',
  'name': 'Khóa học tin học 48',
  'image': banner,
  'price': 55150,
  'discount': 1595,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': '2kgfxjh0',
  'name': 'Khóa học tin học 49',
  'image': banner,
  'price': 60832,
  'discount': 7196,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'csuzbo72',
  'name': 'Khóa học tin học 50',
  'image': banner,
  'price': 79758,
  'discount': 1150,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'tfzgk26v',
  'name': 'Khóa học tin học 51',
  'image': banner,
  'price': 45243,
  'discount': 4144,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': '9ki0c9ze',
  'name': 'Khóa học tin học 52',
  'image': banner,
  'price': 34866,
  'discount': 4638,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'lpmpo3cy',
  'name': 'Khóa học tin học 53',
  'image': banner,
  'price': 26099,
  'discount': 9935,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': 'hab539ua',
  'name': 'Khóa học tin học 54',
  'image': banner,
  'price': 91090,
  'discount': 6607,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'wx74fj06',
  'name': 'Khóa học tin học 55',
  'image': banner,
  'price': 45052,
  'discount': 9829,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề ôn luyện'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': '5aizgptz',
  'name': 'Khóa học tin học 56',
  'image': banner,
  'price': 51745,
  'discount': 8318,
  'tags': [{'type': 'Danh mục', 'value': 'Đề ICPC'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': '184g0hvy',
  'name': 'Khóa học tin học 57',
  'image': banner,
  'price': 31522,
  'discount': 9272,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]},
 {'_id': '1klginlw',
  'name': 'Khóa học tin học 58',
  'image': banner,
  'price': 60111,
  'discount': 7505,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Olympic tin học'},
   {'type': 'Theo độ khó', 'value': 'Đề test khả năng mới học'},
   {'type': 'Theo khu vực', 'value': 'Đà Nẵng'}]},
 {'_id': 'ttgwtn50',
  'name': 'Khóa học tin học 59',
  'image': banner,
  'price': 13677,
  'discount': 1929,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Tài năng tin học trẻ'},
   {'type': 'Theo độ khó', 'value': 'Đề luyện tập'},
   {'type': 'Theo khu vực', 'value': 'Miền trung'}]},
 {'_id': 'g4rfj1y5',
  'name': 'Khóa học tin học 60',
  'image': banner,
  'price': 97029,
  'discount': 9720,
  'tags': [{'type': 'Danh mục', 'value': 'Đề Chuyên tin học THPT'},
   {'type': 'Theo độ khó', 'value': 'Đề khó'},
   {'type': 'Theo khu vực', 'value': 'Hà Nội'}]}]

export default UserExam;
