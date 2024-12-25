import React from "react";

interface VideoPlayerProps {
  currentLesson: {
    video: string;
    name: string;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentLesson }) => {
  return (
    <div>
      <div className="bg-black flex justify-center">
        <video
          className="max-w-[1024px] w-full max-h-[640px] bg-black"
          src={currentLesson?.video}
          controls
        />
      </div>
      
      <div className=" mx-auto pt-5 p-4 bg-white">
        <h1 className="text-3xl font-bold">{currentLesson?.name}</h1>
        <p className="text-gray-500 mt-2">Cập nhật tháng 11 năm 2022</p>
        <p className="mt-4">
          Bài tập:
        </p>

        <ul className="mt-4 list-disc pl-6">
          {currentLesson?.exercise?.map((exercise, index)=>(
            <li>
            Bài {index+1}:{" "}
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
        
          {/* <li>
            Bài 1:{" "}
            <a
              href="https://www.facebook.com/f8vnofficial"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.facebook.com/f8vnofficial
            </a>
          </li>
          <li>
            Bài 2:{" "}
            <a
              href="https://www.facebook.com/groups/649972919142215"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.facebook.com/groups/649972919142215
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;