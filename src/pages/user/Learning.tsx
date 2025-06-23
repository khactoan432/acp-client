import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VideoPlayer from "../../components/features/Lesson/VideoPlayer";
import LessonList from "../../components/features/Lesson/LessonList";

import Logo from "../../assets/logoacp.jpg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchYourCourseDetail } from "../../redux/slices/yourMaterialSlice";

import { FaQuestionCircle } from "react-icons/fa";

// interface Lesson {
//   _id: string;
//   video: string;
//   name: string;  isCompleted: boolean;
//   exercises?: { name: string; link: string }[];
// };

// interface Section {
//   id: number;
//   title: string;
//   lessons: Lesson[];
//   totalLessons: number;
//   completedLessons: number;
//   totalTime: string;
// }

const UserLearning: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCourse, loading, error } = useSelector(
    (state: RootState) => state.yourMaterials
  );
  console.log(loading, error, selectedCourse);

  const [currentLesson, setCurrentLesson] = useState({
    _id : "",
    video: "",
    name:"",
    isCompleted: false
  });

  const id_course = id ?? "default-id";

  useEffect(() => {
    dispatch(fetchYourCourseDetail({id_user: JSON.parse(localStorage.getItem("user"))?._id ,id_course}));
  }, [dispatch, id_course]);

  console.log(selectedCourse);

  // Xử lý cập nhật bài học hiện tại khi selectedCourse thay đổi
  useEffect(() => {
    if (
      selectedCourse?.topics?.length > 0 &&
      selectedCourse?.topics[0]?.lessons?.length > 0
    ) {
      setCurrentLesson(selectedCourse?.topics[0].lessons[0]);
    }
  }, [selectedCourse]);

  const changeLesson = (topicId: string, lessonId: string) => {
    // Tìm topic có id khớp với topicId
    // console.log(selectedCourse);
    const selectedTopic = selectedCourse?.topics.find(
      (topic: { _id: string }) => topic._id === topicId
    );

  
    // Tìm lesson trong topic vừa tìm được
    const selectedLesson = selectedTopic?.lessons.find(
      (lesson: { _id: string }) => lesson._id === lessonId
    );

    // console.log(topicId,lessonId,selectedTopic, selectedLesson);
  
    // Nếu tìm thấy bài học, cập nhật state
    if (selectedLesson) {
      setCurrentLesson(selectedLesson);
    }
  };

  // console.log(currentLesson);

  // const sections: Section[] = [
  //     {
  //       id: 1,
  //       title: "Khái niệm kỹ thuật cần biết",
  //       lessons: [
  //         { id: 1, title: "Mô hình Client - Server là gì?", duration: "23:09", locked: false },
  //         { id: 2, title: "Domain là gì? Tên miền là gì?", duration: "10:34", locked: true },
  //         { id: 3, title: "Mua áo F8 | Đăng ký học Offline", duration: "01:00", locked: true },
  //       ],
  //       totalLessons: 3,
  //       completedLessons: 1,
  //       totalTime: "23:09",
  //     },
  //     {
  //       id: 2,
  //       title: "Môi trường, con người IT",
  //       lessons: [
  //         { id: 4, title: "Học IT cần tố chất gì?", duration: "24:10", locked: true },
  //         { id: 5, title: "Sinh viên IT đi thực tập tại doanh nghiệp cần biết những gì?", duration: "34:51", locked: true },
  //         { id: 6, title: "Trải nghiệm thực tế sau 2 tháng làm việc tại doanh nghiệp của học viên F8?", duration: "47:13", locked: true },
  //       ],
  //       totalLessons: 3,
  //       completedLessons: 0,
  //       totalTime: "1:46:14",
  //     },
  //     {
  //       id: 3,
  //       title: "Phương pháp, định hướng",
  //       lessons: [
  //         { id: 4, title: "Học IT cần tố chất gì?", duration: "24:10", locked: true },
  //         { id: 5, title: "Sinh viên IT đi thực tập tại doanh nghiệp cần biết những gì?", duration: "34:51", locked: true },
  //         { id: 6, title: "Trải nghiệm thực tế sau 2 tháng làm việc tại doanh nghiệp của học viên F8?", duration: "47:13", locked: true },
  //       ],
  //       totalLessons: 0,
  //       completedLessons: 0,
  //       totalTime: "1:04:27",
  //     },
  //   ];

  const circumference = 16 * 2 * Math.PI;

  return (
    <div className=" flex flex-col h-screen bg-white">
      {/* Thanh điều hướng */}
      <header className="bg-gray-800 sticky top-0 text-white px-4 flex items-center text-lg font-bold h-[54px]">
        <div className="px-8 flex items-center justify-between w-full">
          <div className="flex items-center">
            <img className="w-[30px] h-[30px] rounded-lg mr-3 cursor-pointer" src={Logo} alt="alt" onClick={()=>navigate("/")}/>
            <p>Kiến Thức Nhập Môn IT</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {/* Vòng tròn tiến độ */}
              <svg width="36" height="36" viewBox="0 0 36 36" className="relative">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="gray"
                  strokeWidth="3"
                  opacity="0.2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (selectedCourse?.courseProgress / 100) * circumference}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                >
                  {selectedCourse?.courseProgress}%
                </text>
              </svg>

              {/* Số bài học */}
              <span className="text-white text-sm">
                {selectedCourse?.totalCompletedLessons}/{selectedCourse?.totalLessons} bài học
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaQuestionCircle className="text-xl cursor-pointer" />
              {/* Số bài học */}
              <span className="text-white text-sm">
                Hướng dẫn
              </span>
            </div>
          </div>
          
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Video chính */}
        <div className="flex-1 w-[80%] h-full overflow-y-auto">
          <VideoPlayer
            currentLesson={currentLesson} selectedCourseId={selectedCourse?._id}
          />
        </div>

        {/* Danh sách bài học */}
        <div className="bg-gray-50  text-black w-[20%] border-l h-full overflow-y-auto">
          <LessonList sections ={selectedCourse?.topics} currentLesson={currentLesson} changeLesson={changeLesson} />
        </div>
      </div>
      
      {/* <div className="sticky bottom-0 w-full flex justify-between items-center h-[54px] px-6 bg-gray-200 z-50">
        <button className="bg-blue-600 text-white px-4 py-1.5 h-fit rounded hover:bg-blue-700">
          &lt; Bài trước
        </button>
        <button className="bg-blue-600 text-white px-4 py-1.5 h-fit rounded hover:bg-blue-700">
          Bài tiếp theo &gt;
        </button>
      </div> */}
    </div>
  );
};

export default UserLearning;
