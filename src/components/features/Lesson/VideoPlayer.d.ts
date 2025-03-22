import React from "react";
interface VideoPlayerProps {
    currentLesson: {
        _id: string;
        video: string;
        name: string;
        isCompleted: boolean;
        exercises?: {
            name: string;
            link: string;
        }[];
    };
    selectedCourseId: string;
}
declare const VideoPlayer: React.FC<VideoPlayerProps>;
export default VideoPlayer;
