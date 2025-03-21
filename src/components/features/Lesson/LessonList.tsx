import React, { useState } from "react";
import play from "../../../assets/play.png";

interface Lesson {
  _id: string;
  name: string;
  video: string;
  isCompleted?: boolean;
}

interface Section {
  _id: string;
  name: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
  totalTime: string;
}

interface LessonListProps {
  sections: Section[];
  currentLesson: Lesson;
  changeLesson: (topicId: string, lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({
  sections,
  currentLesson,
  changeLesson,
}) => {
  const [activeSections, setActiveSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setActiveSections((prev) =>
      prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]
    );
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold p-3">Nội dung khóa học</h2>
      {sections?.map((section) => (
        <div key={section._id} className="">
          <button
            onClick={() => toggleSection(section._id)}
            className="w-full px-4 py-3 bg-[#eeeeee] text-left text-black border-b-[0.3px] border-solid border-gray-300 hover:bg-gray-200"
          >
            <p>{section.name}</p>
            <p className="font-extralight text-xs text-black">
              ({section.completedLessons}/{section.totalLessons}) | {"23:09"}
            </p>
          </button>
          {activeSections.includes(section._id) && (
            <ul className="bg-gray-100 rounded-lg">
              {section.lessons.length > 0 ? (
                section.lessons.map((lesson) => (
                  <li
                    key={lesson._id}
                    className={`flex justify-between items-center pl-8 pr-4 py-3 rounded cursor-pointer ${
                      lesson._id === currentLesson._id
                        ? "bg-blue-100 text-black"
                        : "bg-gray-50 text-color-secondary hover:bg-gray-200"
                    }`}
                    onClick={() => changeLesson(section._id, lesson._id)}
                  >
                    <div className="">
                      <span className="pr-2">{lesson.name}</span>
                      <div className="flex justify-start gap-1 items-center">
                        <img className="w-[13px] h-[13px]" src={play} alt="play" />
                        <span className="text-xs">{"23:09"}</span>
                      </div>
                    </div>
                    {lesson.isCompleted && (
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                          <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
                          <path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
                        </svg>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-color-secondary italic text-sm ml-3">Không có bài học nào.</p>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonList;
