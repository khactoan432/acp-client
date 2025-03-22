import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createProgress } from "../../../redux/slices/yourMaterialSlice";
const VideoPlayer = ({ currentLesson, selectedCourseId }) => {
    const videoRef = useRef(null);
    const dispatch = useDispatch();
    // const [progress, setProgress] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(currentLesson.isCompleted);
    const handleCompleteLesson = useCallback(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?._id || hasCompleted)
            return;
        dispatch(createProgress({
            id_user: user._id,
            id_course: selectedCourseId,
            id_lesson: currentLesson._id,
        }));
        setHasCompleted(true);
    }, [dispatch, currentLesson._id, selectedCourseId, hasCompleted]);
    useEffect(() => {
        const video = videoRef.current;
        if (!video)
            return;
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
    return (_jsxs("div", { children: [_jsx("div", { className: "bg-black flex justify-center", children: _jsx("video", { ref: videoRef, className: "max-w-[1024px] w-full max-h-[640px] bg-black", src: currentLesson?.video, controls: true }) }), _jsxs("div", { className: "mx-auto pt-5 p-4 bg-white", children: [_jsx("h1", { className: "text-3xl font-bold", children: currentLesson?.name }), _jsx("p", { className: "mt-4", children: "B\u00E0i t\u1EADp:" }), _jsx("ul", { className: "mt-4 list-disc pl-6", children: currentLesson?.exercises?.map((exercise, index) => (_jsxs("li", { children: ["B\u00E0i ", index + 1, ": ", " ", _jsx("a", { href: exercise.link, className: "text-blue-600 hover:underline", target: "_blank", rel: "noopener noreferrer", children: exercise.name })] }, index))) })] })] }));
};
export default VideoPlayer;
