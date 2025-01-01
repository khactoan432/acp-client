import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import banner from "../../../assets/banner1.jpg";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserCourses } from "../../../redux/slices/courseSlice";

interface Course {
  id: string;
  name: string;
  image: string;
  progress: number; // Tiến độ khóa học (0-100)
}

interface ExamResult {
  id: string;
  name: string;
  image: string;
  score: number; // Điểm thi (0-100)
}

// const sampleCourses: Course[] = [
//   {
//     id: '1',
//     name: 'Khóa học lập trình cơ bản',
//     image: banner,
//     progress: 45, // Tiến độ 45%
//   },
//   {
//     id: '2',
//     name: 'Khóa học JavaScript nâng cao',
//     image: banner,
//     progress: 80, // Tiến độ 80%
//   },
// ];

const sampleExamResults: ExamResult[] = [
  {
    id: "1",
    name: "Bài thi thử lập trình cơ bản",
    image: banner,
    score: 85, // Điểm số 85
  },
  {
    id: "2",
    name: "Bài thi thử JavaScript",
    image: banner,
    score: 42, // Điểm số 72
  },
  {
    id: "2",
    name: "Bài thi thử JavaScript nâng cao",
    image: banner,
    score: null, // Điểm số 72
  },
];

const ProfileTabs: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"courses" | "results">("courses");

  const dispatch = useDispatch<AppDispatch>();
  const { userCourses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchUserCourses({ page: 1, limit: 100 }));
  }, [dispatch]);

  return (
    <div className="">
      {/* Tabs Header */}
      <div className="pt-4 flex justify-center border-b border-gray-300 bg-white">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 ${
            activeTab === "courses"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "primary-color-text"
          }`}
        >
          Khóa học
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2 ${
            activeTab === "results"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "primary-color-text"
          }`}
        >
          Kết quả luyện thi
        </button>
      </div>

      {/* Tabs Content */}
      <div className="py-8">
        {activeTab === "courses" ? (
          userCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white shadow-md rounded-lg flex flex-col items-center"
                >
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="w-full p-4">
                    <h3 className="text-lg mb-2">{course.name}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-[10px] mb-2">
                      <div
                        className="bg-blue-600 rounded-full h-[10px]"
                        style={{ width: `${10}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 pb-3">Tiến độ: {10}%</p>

                    <Button
                      onClick={() => navigate("/learning/" + course._id)}
                      className="w-full"
                    >
                      {"Tiếp tục"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Bạn chưa đăng ký học khóa học nào!
            </p>
          )
        ) : sampleExamResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sampleExamResults.map((exam) => (
              <div
                key={exam.id}
                className="bg-white shadow-md rounded-lg flex flex-col items-center"
              >
                <img
                  src={exam.image}
                  alt={exam.name}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="w-full p-4">
                  <h3 className="text-lg mb-2">{exam.name}</h3>
                  <p
                    className={`text-lg font-bold pb-3 ${
                      !exam.score
                        ? "text-yellow-600"
                        : exam.score >= 50
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Điểm: {exam.score ? exam.score : "Chưa thi thử"}
                  </p>

                  <Button
                    onClick={() => alert(`Added ${name} to cart!`)}
                    className="w-full"
                  >
                    {exam.score ? "Làm lại" : "Bắt đầu"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Không có kết quả luyện thi nào!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
