import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../../components/button/plus";
import ImageUploader from "../../../components/helps/dropImage";
import Loading from "../../../components/loading";

// import icon react
import { MdDeleteOutline } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegCirclePlay } from "react-icons/fa6";

// import axios
import { postData, getData, deleteData } from "../../../axios";

// interface
interface ListLesson {
  id: number;
  name: string;
  video: File[];
  exercies: dataExercise[];
}
interface DataTopics {
  name: string;
  lessons: ListLesson[];
}
interface dataExercise {
  id: number;
  link: string;
  name: string;
}
const Content: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { idCourse } = useParams();

  //state boolean
  const [isLoading, setIsLoading] = useState(false);
  const [addCourseContent, setAddCourseContent] = useState(false);
  const [resetUploaderLesson, setResetUploaderLesson] = useState(false);
  const [showLesson, setShowLesson] = useState<{ [key: string]: boolean }>({});

  //state file []
  const [uploadeVideoLesson, setUploadeVideoLesson] = useState<File[]>([]);

  //state array (store)
  const [lessons, setLessons] = useState<ListLesson[]>([]);
  const [dataLinkCodeFource, setDataLinkCodeFource] = useState<dataExercise[]>(
    []
  );
  const [dataTopic, setDataTopic] = useState<DataTopics[]>([]);

  //useRef
  const topicTitleRef = useRef<HTMLInputElement>(null);
  const lessonTitleRef = useRef<HTMLInputElement>(null);
  const nameExerciseRef = useRef<(HTMLInputElement | null)[]>([]);
  const linkExerciseRef = useRef<(HTMLInputElement | null)[]>([]);

  //   get data
  useEffect(() => {
    const fetchDataIntroduce = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/course-detail/${idCourse}`, {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        const topics = res.data.course.topics;
        console.log(topics);
        setDataTopic(topics);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataIntroduce();
  }, []);

  // reset input refs
  const resetInputRefs = (
    items: Array<{
      state?: any;
      setState?: (value: any) => void;
      ref?: React.RefObject<any>;
    }>
  ) => {
    items.forEach((item) => {
      if (item.state && item.setState) {
        // Reset state
        if (Array.isArray(item.state)) {
          item.setState([]); // Reset mảng về rỗng
        } else {
          item.setState(null); // Reset giá trị khác về null
        }
      } else if (item.ref) {
        // Reset ref
        const currentRef = item.ref.current;
        if (Array.isArray(currentRef)) {
          // Reset mỗi phần tử trong mảng ref
          currentRef.forEach((ref) => {
            if (ref && ref.value !== undefined) ref.value = "";
          });
        } else if (currentRef && currentRef.value !== undefined) {
          // Reset giá trị của input ref
          currentRef.value = "";
        }
      }
    });
  };

  //   handle upfile
  const handleVideoLessonChange = (files: File[]) => {
    setUploadeVideoLesson(files);
  };

  // handle add
  const hanleAddLesson = (idCur: number): void => {};
  const hanleAddLinkCodeFource = (idCur: number): void => {
    const addLinkCodeFource: dataExercise = {
      id: idCur + 1,
      link: "",
      name: "",
    };
    setDataLinkCodeFource([...dataLinkCodeFource, addLinkCodeFource]);
  };
  // handle save
  const handleSaveLessons = () => {
    const allDataExercise: dataExercise[] = dataLinkCodeFource.map(
      (dataExercise, id) => ({
        id: dataExercise.id,
        link: linkExerciseRef.current[id]?.value || "",
        name: nameExerciseRef.current[id]?.value || "",
      })
    );
    const lessonTitle = lessonTitleRef.current?.value || "";
    setLessons((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: lessonTitle,
        exercies: allDataExercise || [],
        video: uploadeVideoLesson,
      },
    ]);
    setResetUploaderLesson(true);
    setTimeout(() => setResetUploaderLesson(false), 0);

    resetInputRefs([
      { ref: lessonTitleRef },
      { ref: linkExerciseRef },
      { ref: nameExerciseRef },
      { state: dataLinkCodeFource, setState: setDataLinkCodeFource },
      { state: uploadeVideoLesson, setState: setUploadeVideoLesson },
    ]);
  };
  const hanleSaveTopics = async () => {
    const topicTitle = topicTitleRef.current?.value || "";

    // Tạo danh sách topics mới
    const updatedTopics = [
      ...dataTopic,
      { name: topicTitle, lessons: lessons },
    ];

    // Cập nhật state (dùng biến tạm để tránh lỗi bất đồng bộ)
    setDataTopic(updatedTopics);

    // Hàm lưu topics và lessons
    const saveTopicsAndLessons = async (topics: any) => {
      setIsLoading(true);
      console.log("Topics to save: ", topics);

      try {
        const topicPromises = topics.map(async (topic: any) => {
          try {
            // Gửi topic lên server
            const resTopic = await postData(
              "/api/admin/topic",
              { id_course: idCourse, name: topic.name },
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );

            const id_topic = resTopic.data._id;

            // Gửi lessons liên quan tới topic
            const lessonPromises = topic.lessons.map(async (lesson: any) => {
              try {
                const formDataLesson = new FormData();
                lesson.video.forEach((file: any) =>
                  formDataLesson.append("fileImage", file)
                );

                formDataLesson.append("id_topic", id_topic);
                formDataLesson.append("name", lesson.name);
                formDataLesson.append("status", "PRIVATE");

                const resLesson = await postData(
                  "/api/admin/lesson",
                  formDataLesson,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${header}`,
                    },
                  }
                );

                const id_lesson = resLesson.data._id;

                // Gửi exercises liên quan tới lesson
                await postData(
                  "/api/admin/exercise",
                  { id_lesson: id_lesson, dataExercise: lesson.dataExercise },
                  {
                    headers: { Authorization: `Bearer ${header}` },
                  }
                );
              } catch (error) {
                console.error(`Error saving lesson: ${lesson.name}`, error);
              }
            });

            await Promise.all(lessonPromises);
          } catch (error) {
            console.error(`Error saving topic: ${topic.topicTitle}`, error);
          }
        });

        await Promise.all(topicPromises);
      } catch (error) {
        console.error("Error saving topics and lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Gọi hàm với `updatedTopics`
    await saveTopicsAndLessons(updatedTopics);

    // Reset input và data
    resetInputRefs([{ state: lessons, setState: setLessons }]);
    setAddCourseContent(false);
  };

  // handle edit

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full overflow-y-auto bg-[rgba(255,246,244,1)]">
          <div className="mb-2 mt-2">
            <h4 className="font-semibold primary-color-text">
              Nội dung khoá học
            </h4>
            <ButtonPlus
              content="Thêm chương học"
              icon={CiCirclePlus}
              iconSize="text-[24px]"
              textSize="text-[12px]"
              height="h-[24px]"
              width="w-[36%]"
              paddingLeft="pl-7"
              paddingRight="pr-4"
              onClick={() => setAddCourseContent(!addCourseContent)}
            />
            {addCourseContent && (
              <div>
                <div className="flex flex-col mb-2">
                  <label className="text-[12px] text-[#5a607f]">
                    Tiêu đề chương học
                  </label>
                  <input
                    ref={topicTitleRef}
                    placeholder="Kiểu dữ liệu, biến, vòng lặp"
                    className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                  />
                </div>
                <div className="mb-2 pl-6 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                  <ButtonPlus
                    content="Thêm bài học"
                    icon={CiCirclePlus}
                    iconSize="text-[24px]"
                    textSize="text-[12px]"
                    height="h-[24px]"
                    width="w-[36%]"
                    paddingLeft="pl-7"
                    paddingRight="pr-4"
                    onClick={() => hanleAddLesson(lessons.length)}
                  />
                  <div className="flex flex-col mb-2  pl-6 relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                    <label className="text-[12px] text-[#5a607f]">
                      Tiêu đề bài học
                    </label>
                    <input
                      ref={lessonTitleRef}
                      placeholder="Hướng dẫn cài đặt vsCode"
                      className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                    />
                    {/* add video */}
                    {/* <ButtonPlus
                                content="Thêm video"
                                icon={CiCirclePlus}
                                iconSize="text-[24px]"
                                textSize="text-[12px]"
                                height="h-[24px]"
                                width="w-[36%]"
                                paddingLeft="pl-7"
                                paddingRight="pr-4"
                                disabled={true}
                              /> */}
                    <div>
                      <ImageUploader
                        titleBtn="Chọn video"
                        typefile="image/*"
                        reset={resetUploaderLesson}
                        onImagesChange={handleVideoLessonChange}
                      />
                    </div>
                    {/* add link bài tập */}
                    <ButtonPlus
                      content="Thêm bài tập"
                      icon={CiCirclePlus}
                      iconSize="text-[24px]"
                      textSize="text-[12px]"
                      height="h-[24px]"
                      width="w-[36%]"
                      paddingLeft="pl-7"
                      paddingRight="pr-4"
                      onClick={() =>
                        hanleAddLinkCodeFource(dataLinkCodeFource.length)
                      }
                    />
                    {dataLinkCodeFource.length >= 1 &&
                      dataLinkCodeFource.map((link, id) => (
                        <div key={id} className="flex flex-col mb-2 relative">
                          <MdDeleteOutline
                            onClick={() =>
                              setDataLinkCodeFource(
                                dataLinkCodeFource.filter(
                                  (_, idx) => idx !== id
                                )
                              )
                            }
                            className="absolute cursor-pointer top-1 right-2 text-red-500 hover:text-red-700"
                            title="Xoá mô tả"
                          />
                          <label className="text-[12px] text-[#5a607f]">
                            Bài {link.id}: Tên và link bài tập
                          </label>
                          <input
                            ref={(el) => (nameExerciseRef.current[id] = el)}
                            placeholder="Nhập tên bài tập"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          />
                          <input
                            ref={(el) => (linkExerciseRef.current[id] = el)}
                            placeholder="Nhập link bài tập"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          />
                        </div>
                      ))}
                  </div>
                  {/* button save */}
                  <div className="mt-2 pl-6">
                    <Button
                      className="mr-4 button-cancel"
                      style={{
                        backgroundColor: "white",
                        color: "#1e2753",
                        borderColor: "#1e2753",
                      }}
                      ghost
                    >
                      Cancel
                    </Button>
                    <Button
                      className="button-save"
                      style={{
                        backgroundColor: "#00095b",
                        color: "white",
                        borderColor: "#00095b",
                      }}
                      onClick={handleSaveLessons}
                    >
                      Save Lesson
                    </Button>
                  </div>
                  {lessons &&
                    lessons.length > 0 &&
                    lessons.map((lesson, id) => (
                      <div
                        key={id}
                        className="pl-6 my-6 py-2 pr-2 ml-6 relative"
                        style={{ borderTop: "0.4px solid #1e2753" }}
                      >
                        {/* <MdDeleteOutline
                                    onClick={() =>
                                      setDataListDesc(
                                        dataListDesc.filter(
                                          (_, idx) => idx !== id
                                        )
                                      )
                                    }
                                    className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                                    title="Xoá mô tả"
                                  />
                                  <MdEditSquare
                                    onClick={() =>
                                      setDataListDesc(
                                        dataListDesc.filter(
                                          (_, idx) => idx !== id
                                        )
                                      )
                                    }
                                    className="absolute cursor-pointer -top-5 right-8 text-red-500 hover:text-red-700"
                                    title="Chỉnh sửa mô tả"
                                  /> */}
                        <div
                          className="flex items-center primary-color-text inline-block cursor-pointer border border-transparent hover:border-[#1e2753] hover:rounded-lg transition-all duration-300 p-1"
                          onClick={() =>
                            setShowLesson((prev) => ({
                              ...prev,
                              [id]: !prev[id],
                            }))
                          }
                        >
                          <FaRegCirclePlay className="mr-4" />
                          <h4>
                            Bài {lesson.id}: {lesson.name}
                          </h4>
                        </div>
                        {showLesson[id] && (
                          <div>
                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                              {Array.isArray(lesson.video)
                                ? lesson.video.map((video, index) => (
                                    <div
                                      key={index}
                                      className="relative w-full h-32 overflow-hidden rounded-lg border"
                                    >
                                      <img
                                        src={URL.createObjectURL(video)}
                                        alt={`video-${index}`}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  ))
                                : lesson.video && (
                                    <div className="relative w-full h-32 overflow-hidden rounded-lg border">
                                      <img
                                        src={URL.createObjectURL(lesson.video)}
                                        alt="video"
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  )}
                            </div>
                            {lesson.exercies &&
                              lesson.exercies.map((data) => (
                                <div>
                                  <div className="mb-2 secondary-color-bg px-4 py-1 rounded-lg inline-block">
                                    <h4 className="text-white">{data.name}</h4>
                                  </div>
                                  <p>
                                    <a
                                      href={data.link}
                                      className="primary-color-text"
                                    >
                                      Link bài tập: {data.link}
                                    </a>
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {/* button save */}
            <div className="mt-2">
              <Button
                className="mr-4 button-cancel"
                style={{
                  backgroundColor: "white",
                  color: "#1e2753",
                  borderColor: "#1e2753",
                }}
                ghost
              >
                Cancel
              </Button>
              <Button
                className="button-save"
                style={{
                  backgroundColor: "#00095b",
                  color: "white",
                  borderColor: "#00095b",
                }}
                onClick={hanleSaveTopics}
              >
                Save Topics
              </Button>
            </div>
            {dataTopic &&
              dataTopic.length > 0 &&
              dataTopic.map((topic, topicId) => (
                <div key={topicId} className="my-6">
                  {/* Hiển thị tiêu đề topic */}
                  <div className="mb-2 secondary-color-bg px-4 py-2 rounded-lg inline-block">
                    <h4 className="text-white">{topic.name}</h4>
                  </div>

                  {/* Hiển thị danh sách các lesson trong topic */}
                  {topic.lessons &&
                    topic.lessons.length > 0 &&
                    topic.lessons.map((lesson, lessonId) => (
                      <div
                        key={lessonId}
                        className="pl-6 my-6 py-2 pr-2 ml-6 relative"
                        style={{ borderTop: "0.4px solid #1e2753" }}
                      >
                        <MdDeleteOutline
                          onClick={() => {
                            const updatedTopics = [...dataTopic];
                            updatedTopics[topicId].lessons = updatedTopics[
                              topicId
                            ].lessons.filter((_, idx) => idx !== lessonId);
                            setDataTopic(updatedTopics);
                          }}
                          className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                          title="Xoá bài học"
                        />
                        <MdEditSquare
                          onClick={() => {
                            // Xử lý chỉnh sửa mô tả bài học tại đây
                          }}
                          className="absolute cursor-pointer -top-5 right-8 text-red-500 hover:text-red-700"
                          title="Chỉnh sửa bài học"
                        />
                        <div
                          className="flex items-center primary-color-text inline-block cursor-pointer border border-transparent hover:border-[#1e2753] hover:rounded-lg transition-all duration-300 p-1"
                          onClick={() =>
                            setShowLesson((prev) => ({
                              ...prev,
                              [`${topicId}-${lessonId}`]:
                                !prev[`${topicId}-${lessonId}`],
                            }))
                          }
                        >
                          <FaRegCirclePlay className="mr-4" />
                          <h4>
                            Bài {lesson.id}: {lesson.name}
                          </h4>
                        </div>
                        {showLesson[`${topicId}-${lessonId}`] && (
                          <div>
                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                              {Array.isArray(lesson?.video)
                                ? lesson.video.map((video, index) => (
                                    <div
                                      key={index}
                                      className="relative w-full h-32 overflow-hidden rounded-lg border"
                                    >
                                      <img
                                        src={video}
                                        alt={`video-${index}`}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  ))
                                : lesson?.video && (
                                    <div className="relative w-full h-32 overflow-hidden rounded-lg border">
                                      <img
                                        src={lesson.video}
                                        alt="video"
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  )}
                            </div>
                            {lesson.exercies &&
                              lesson.exercies.map((data) => (
                                <div>
                                  <div className="mb-2 secondary-color-bg px-4 py-1 rounded-lg inline-block">
                                    <h4 className="text-white">{data.name}</h4>
                                  </div>
                                  <p>
                                    <a
                                      href={data.link}
                                      className="primary-color-text"
                                    >
                                      Link bài tập: {data.link}
                                    </a>
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
