import React from "react";
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
declare const LessonList: React.FC<LessonListProps>;
export default LessonList;
