import React, { useState } from "react";

interface Lesson {
  _id: number;
  title: string;
  duration: string;
  locked: boolean;
}

interface Section {
  _id: number;
  name: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
  totalTime: string;
}

interface LessonListProps {
  sections: Section[];
}

const LessonList: React.FC<LessonListProps> = ({ sections }) => {
  

  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (id: number) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold p-3">Nội dung khóa học</h2>
      {sections?.map((section) => (
        <div key={section._id} className="">
          <button
            onClick={() => toggleSection(section._id)}
            className="w-full justify-between items-center px-4 py-3 bg-gray-100 text-left text-black font-semibold border-b-[0.3px] border-solid border-gray-300 hover:bg-gray-200"
          >
            <p>
               {section.name} 
            </p>
            <p className="font-extralight text-xs text-black">({0}/{3}) | {"23:09"}</p>
          </button>
          {activeSection === section._id && (
            <ul className="bg-gray-100 rounded-lg">
              {section?.lessons?.map((lesson) => (
                <li
                  key={lesson._id}
                  className={`flex justify-between items-center px-4 py-3 rounded ${
                    lesson.locked ?  "bg-blue-100 text-black":"bg-gray-50 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <span className="pr-2"> {lesson.name}</span>
                  <span>{"23:09"}</span>
                </li>
              ))}
              {section.lessons.length === 0 && (
                <p className="text-gray-500 italic text-sm">Không có bài học nào.</p>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonList;
