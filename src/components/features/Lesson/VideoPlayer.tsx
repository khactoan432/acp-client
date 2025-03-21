import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createProgress } from "../../../redux/slices/yourMaterialSlice";
import { AppDispatch } from "../../../redux/store";

interface VideoPlayerProps {
  currentLesson: {
    _id: string;
    video: string;
    name: string;
    isCompleted: boolean;
    exercises?: { name: string; link: string }[];
  };
  selectedCourseId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentLesson, selectedCourseId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  // const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(currentLesson.isCompleted);

  const handleCompleteLesson = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id || hasCompleted) return;

    dispatch(
      createProgress({
        id_user: user._id,
        id_course: selectedCourseId,
        id_lesson: currentLesson._id,
      })
    );

    setHasCompleted(true);
  }, [dispatch, currentLesson._id, selectedCourseId, hasCompleted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        const watchedPercentage = (video.currentTime / video.duration) * 100;
        // setProgress(watchedPercentage);

        if (watchedPercentage >= 80 && !hasCompleted) {
          handleCompleteLesson();
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [hasCompleted, handleCompleteLesson]);

  return (
    <div>
      <div className="bg-black flex justify-center">
        <video
          ref={videoRef}
          className="max-w-[1024px] w-full max-h-[640px] bg-black"
          src={currentLesson?.video}
          controls
        />
      </div>

      <div className="mx-auto pt-5 p-4 bg-white">
        <h1 className="text-3xl font-bold">{currentLesson?.name}</h1>

        {/* <p className="mt-4 text-lg">
          Tiến độ: {progress.toFixed(1)}%
          {hasCompleted && <span className="ml-2 text-green-600 font-bold">✅ Hoàn thành</span>}
        </p> */}

        <p className="mt-4">Bài tập:</p>
        <ul className="mt-4 list-disc pl-6">
          {currentLesson?.exercises?.map((exercise, index) => (
            <li key={index}>
              Bài {index + 1}: {" "}
              <a
                href={exercise.link}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {exercise.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;
