import React, { useEffect } from "react";
import VideoPlayer from "../../components/features/Lesson/VideoPlayer";
import LessonList from "../../components/features/Lesson/LessonList";

import Logo from "../../assets/logoacp.jpg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchCourseDetail } from "../../redux/slices/courseSlice";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  locked: boolean;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
  totalTime: string;
}

const UserLearning: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCourse, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  const courseId = id ?? "default-id";

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
  }, [dispatch, courseId]);

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

  const currentLesson = {
    id: 1,
    title: "Mô hình Client - Server là gì?",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  };

  return (
    <div className=" bg-white">
      {/* Thanh điều hướng */}
      <header className="bg-gray-800 sticky top-0 text-white px-4 flex items-center text-lg font-bold h-[54px]">
        <div className="pl-8">
          <div className="flex items-center">
            <img className="w-[30px] h-[30px] rounded-lg mr-3" src={Logo} alt="alt" />
            <p>Kiến Thức Nhập Môn IT</p>
          </div>
        </div>
        
      </header>

      <div className="flex flex-1">
        {/* Video chính */}
        <div className="flex-1 w-[80%]">
          <VideoPlayer
            videoUrl={currentLesson.videoUrl}
            title={currentLesson.title}
          />
        </div>

        {/* Danh sách bài học */}
        <div className="bg-gray-50  text-black w-[20%] border-l">
          <LessonList sections ={selectedCourse?.topics} />
        </div>
      </div>
      
      <div className="sticky bottom-0 w-full flex justify-between items-center h-[54px] px-6 bg-gray-200 z-50">
        <button className="bg-blue-600 text-white px-4 py-1.5 h-fit rounded hover:bg-blue-700">
          &lt; Bài trước
        </button>
        <button className="bg-blue-600 text-white px-4 py-1.5 h-fit rounded hover:bg-blue-700">
          Bài tiếp theo &gt;
        </button>
      </div>
    </div>
  );
};

export default UserLearning;
