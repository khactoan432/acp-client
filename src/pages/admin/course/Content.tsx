import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../../components/button/plus";
import MSInput from "../../../components/input/MsInput";
import ImageUploader from "../../../components/helps/dropImage";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";

// import icon react
import { MdDeleteOutline } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { MdCreateNewFolder } from "react-icons/md";

// import axios
import { postData, getData, deleteData, putData } from "../../../axios";

// interface
interface Lesson {
  id?: number;
  _id?: string;
  exercise?: Exercise[];
  id_topic?: string;
  name?: string;
  status?: string;
  video?: File[];
}
interface Topic {
  id_course?: string;
  name?: string;
  lessons?: Lesson[];
  _id?: string;
}
interface Exercise {
  id: number;
  _id: string;
  link: string;
  name: string;
}
const Content: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { idCourse } = useParams();
  const [idTopicCreated, setIdTopicCreated] = useState("");

  // state number
  const [indexDeleted, setIndexDeleted] = useState<number>(0);

  //state boolean
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);

  const [isUpdateLesson, setIsUpdateLesson] = useState(false);
  const [isOpenLesson, setIsOpenLesson] = useState(true);
  const [addLesson, setAddLesson] = useState(false);
  const [isCreateLesson, setIsCreateLesson] = useState(false);

  const [isOnlyTopicTitle, setIsOnlyTopicTitle] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateTitleTopic, setIsUpdateTitleTopic] = useState(false);
  const [addCourseContent, setAddCourseContent] = useState(false);
  const [resetUploaderLesson, setResetUploaderLesson] = useState(false);
  const [showLesson, setShowLesson] = useState<{ [key: string]: boolean }>({});

  // state string
  const [idDeleted, setIdDeleted] = useState("");
  const [nameDeleted, setNameDeleted] = useState("");
  const [editNameTopic, setEditNameTopic] = useState<string>("");

  //state file []
  const [uploadeVideoLesson, setUploadeVideoLesson] = useState<File[]>();

  //state array (store)
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [dataLinkCodeFource, setDataLinkCodeFource] = useState<Exercise[]>([]);
  const [dataTopic, setDataTopic] = useState<Topic[]>([]);
  const [editLesson, setEditLesson] = useState<Lesson>();
  const [editTopic, setEditTopic] = useState<Topic>();

  //useRef
  // const topicTitleRef = useRef<HTMLInputElement | null>(null);
  // const lessonTitleRef = useRef<HTMLInputElement | null>(null);
  // const nameExerciseRef = useRef<(HTMLInputElement | null)[]>([]);
  // const linkExerciseRef = useRef<(HTMLInputElement | null)[]>([]);

  const topicTitleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const lessonTitleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const nameExerciseRef = useRef<
    {
      focus: () => void;
      getValue: () => string;
      setValue: (value: string) => void;
      clear: () => void;
    }[]
  >([]);
  const linkExerciseRef = useRef<
    {
      focus: () => void;
      getValue: () => string;
      setValue: (value: string) => void;
      clear: () => void;
    }[]
  >([]);

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
        console.log("res: ", res);
        const topics = res.data.course.topics;
        setDataTopic(topics);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataIntroduce();
  }, [isFetchData]);

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
            if (ref && ref.clear) {
              ref.clear(); // Gọi phương thức clear nếu tồn tại
            } else if (ref && ref.value !== undefined) {
              ref.value = ""; // Reset giá trị của ref
            }
          });
        } else if (currentRef.clear) {
          currentRef.clear(); // Gọi phương thức clear nếu tồn tại
        } else if (currentRef.value !== undefined) {
          currentRef.value = ""; // Reset giá trị trực tiếp
        }
      }
    });
  };

  const hanleResetUrlsImage = () => {
    setEditLesson((prev) => ({
      ...prev,
      video: [],
    }));
  };

  //   handle upfile
  const handleVideoLessonChange = (files: File[]) => {
    console.log("file: ", files);
    setUploadeVideoLesson(files);
  };
  const hanleAddLinkCodeFource = (idCur: number): void => {
    const addLinkCodeFource: Exercise = {
      id: idCur + 1,
      _id: "",
      link: "",
      name: "",
    };
    setDataLinkCodeFource((prev) => [...(prev || []), addLinkCodeFource]);
    console.log("check link code");
  };
  // handle create

  const handleSaveLessonsStore = async () => {
    // console.log("data link: ", dataLinkCodeFource);
    const allDataExercise: Exercise[] = dataLinkCodeFource.map(
      (dataExercise, id) => ({
        id: dataExercise.id,
        _id: dataExercise._id,
        link: linkExerciseRef.current[id]?.getValue() || "",
        name: nameExerciseRef.current[id]?.getValue() || "",
      })
    );

    console.log("dataLink:", allDataExercise);

    const lessonTitle = lessonTitleRef.current?.getValue() || "";
    const video = uploadeVideoLesson;
    if (lessonTitle && uploadeVideoLesson) {
      setLessons((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: lessonTitle,
          exercise: allDataExercise || [],
          video: video,
        },
      ]);

      setResetUploaderLesson(true);
      setTimeout(() => setResetUploaderLesson(false), 0);
      resetInputRefs([
        { ref: lessonTitleRef },
        { ref: linkExerciseRef },
        { ref: nameExerciseRef },
        { state: dataLinkCodeFource, setState: setDataLinkCodeFource },
        { state: isUpdateLesson, setState: setIsUpdateLesson },
        { state: uploadeVideoLesson, setState: setUploadeVideoLesson },
      ]);
    } else {
      console.log("Missing data, cannot save lesson to store");
    }
  };
  const createTopics = async () => {
    const topicTitle = topicTitleRef.current?.getValue() || "";

    // Hàm lưu topics và lessons
    const createTopicsAndLessons = async () => {
      setIsLoading(true);
      try {
        // Gửi topic lên server
        const resTopic = await postData(
          "/api/admin/topic",
          { id_course: idCourse, name: topicTitle },
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        console.log("topic create");

        const id_topic = resTopic.data._id;

        // Gửi lessons liên quan tới topic
        const lessonPromises = lessons.map(async (lesson: any) => {
          console.log("lesson create");

          try {
            const formDataLesson = new FormData();
            lesson.video.forEach(
              (file: any) => formDataLesson.append("fileVideo", file)
              //test image repalece video when internet low
              // formDataLesson.append("fileImage", file)
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
            const exercises = lesson.exercise;
            if (exercises) {
              await postData(
                "/api/admin/exercise",
                { id_lesson: id_lesson, dataExercise: exercises },
                {
                  headers: { Authorization: `Bearer ${header}` },
                }
              );
            }
          } catch (error) {
            console.error(`Error saving lesson: ${lesson.name}`, error);
          }
        });
        await Promise.all(lessonPromises);
      } catch (error) {
        console.error("Error saving topics and lessons:", error);
      } finally {
        setIsFetchData(!isFetchData);
        setIsLoading(false);
      }
    };

    // Gọi hàm với `updatedTopics`
    await createTopicsAndLessons();

    // Reset input và data
    resetInputRefs([{ state: lessons, setState: setLessons }]);
    setAddCourseContent(false);
  };

  const handleShowAddLesson = (topic: Topic) => {
    //resetState
    const titleTopic = topic.name;
    const idTopic = topic._id;

    //reset state
    setAddCourseContent(true);
    setIsOnlyTopicTitle(false);
    setIsUpdateTitleTopic(false);
    setIsUpdateLesson(false);
    setIsOpenLesson(true);
    setIsCreateLesson(true);

    resetInputRefs([
      { ref: lessonTitleRef },
      { ref: linkExerciseRef },
      { ref: nameExerciseRef },
      { state: dataLinkCodeFource, setState: setDataLinkCodeFource },
      { state: uploadeVideoLesson, setState: setUploadeVideoLesson },
      { state: editLesson, setState: setEditLesson },
    ]);

    setIdTopicCreated(idTopic);
    setEditNameTopic(titleTopic);
  };

  const createLesson = async () => {
    console.log("idTopicCreated: ", idTopicCreated);

    const allDataExercise: Exercise[] = dataLinkCodeFource.map(
      (dataExercise, id) => ({
        id: dataExercise.id,
        _id: dataExercise._id,
        link: linkExerciseRef.current[id]?.getValue() || "",
        name: nameExerciseRef.current[id]?.getValue() || "",
      })
    );
    const formData = new FormData();

    const idTopic = idTopicCreated;
    const nameLesson = lessonTitleRef.current?.getValue() || "";
    const fileVideo = uploadeVideoLesson;

    if (fileVideo && nameLesson && allDataExercise && idTopic) {
      try {
        setIsLoading(true);
        fileVideo.forEach((file) => formData.append("fileVideo", file));
        formData.append("id_topic", idTopic);
        formData.append("name", nameLesson);
        formData.append("status", "PRIVATE");

        const resLesson = await postData("/api/admin/lesson", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${header}`,
          },
        });
        console.log("resLesson: ", resLesson);

        const id_lesson = resLesson.data._id;

        // Gửi exercises liên quan tới lesson
        const resExercise = await postData(
          "/api/admin/exercise",
          { id_lesson: id_lesson, dataExercise: allDataExercise },
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        console.log("resExercise: ", resExercise);
      } catch (err) {
        console.error("Error saving lesson: ", err);
      } finally {
        setIsFetchData(!isFetchData);
        setIsLoading(false);
        cancel();
      }
    } else {
      console.log("Video not found");
    }

    // setUploadeVideoLesson(lesson.video)
  };

  // handle edit(update)
  const fillEditLesson = (lesson: Lesson) => {
    handleVideoLessonChange(lesson.video || []);
    console.log("check null lessref: ", lessonTitleRef);
    if (lessonTitleRef.current) {
      lessonTitleRef.current.setValue(lesson.name || "");
    }
    setDataLinkCodeFource(lesson.exercise);
  };
  const updateTopic = async () => {
    // update only title topic
    if (isOnlyTopicTitle) {
      const title =
        topicTitleRef.current && topicTitleRef.current.getValue()
          ? topicTitleRef.current.getValue()
          : "";
      if (title) {
        setIsLoading(true);
        const _id = editTopic?._id;
        try {
          const res = await putData(
            `/api/admin/topic/${_id}`,
            { name: title },
            {
              headers: { Authorization: `Bearer ${header}` },
            }
          );
          console.log("res: ", res);
        } catch (error) {
          console.error("Error updating topic:", error);
        } finally {
          setIsLoading(false);
          setIsUpdateTitleTopic(false);
          setIsOpenLesson(true);
          setIsOnlyTopicTitle(false);
          setIsUpdateLesson(false);
          setAddCourseContent(false);
          setIsFetchData(!isFetchData);
        }
      }
    } else {
      const title =
        topicTitleRef.current && topicTitleRef.current.getValue()
          ? topicTitleRef.current.getValue()
          : "";
      if (title) {
        setIsLoading(true);

        const id = editLesson?.id_topic;
        try {
          const res = await putData(
            `/api/admin/topic/${id}`,
            { name: title },
            {
              headers: { Authorization: `Bearer ${header}` },
            }
          );
          await updateLesson("calledTopic");
        } catch (error) {
          console.error("Error updating topic:", error);
        }
      }
    }
  };

  const updateLesson = async (type: string) => {
    const idLessonUpdate =
      editLesson && editLesson._id ? editLesson._id : undefined;

    const video = editLesson && editLesson.video ? editLesson.video : undefined;

    const allDataExercise: Exercise[] = dataLinkCodeFource.map(
      (dataExercise, id) => ({
        id: dataExercise.id,
        _id: dataExercise._id,
        link: linkExerciseRef.current[id]?.getValue() || "",
        name: nameExerciseRef.current[id]?.getValue() || "",
      })
    );
    const lessonTitle = lessonTitleRef.current?.getValue() || "";
    console.log("lessonTitle", lessonTitle);
    const formData = new FormData();
    if (uploadeVideoLesson && uploadeVideoLesson[0]) {
      // formData.append("fileVideo", uploadeVideoLesson[0]); test for internet low
      formData.append("fileVideo", uploadeVideoLesson[0]);
    } else {
      formData.append("video", video);
    }

    formData.append("exercises", JSON.stringify(allDataExercise));
    formData.append("name", lessonTitle);

    setIsLoading(true);
    try {
      const resUpdate = await putData(
        `/api/admin/lesson/${idLessonUpdate}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${header}`,
          },
        }
      );
      console.log("resUpdate: ", resUpdate);
    } catch (err) {
      console.log(err);
    } finally {
      resetInputRefs([
        { state: uploadeVideoLesson, setState: setUploadeVideoLesson },
        { state: addCourseContent, setState: setAddCourseContent },
        { state: dataLinkCodeFource, setState: setDataLinkCodeFource },
        { state: isUpdateLesson, setState: setIsUpdateLesson },
        { ref: lessonTitleRef },
        { ref: linkExerciseRef },
        { ref: nameExerciseRef },
      ]);
      setIsFetchData(!isFetchData);
      setIsLoading(false);
    }
    if (type === "calledTopic") {
      setIsUpdateTitleTopic(false);
      setIsOpenLesson(true);
      setIsOnlyTopicTitle(false);
    }
  };

  const handleEdit = (dataEdit: any, nameTopic: string, type: string) => {
    setAddCourseContent(true);
    setEditNameTopic(nameTopic);
    if (type === "topic") {
      console.log("edit topic: ", dataEdit);
      setIsOpenLesson(false);
      setIsUpdateTitleTopic(true);
      setIsOnlyTopicTitle(true);
      setAddLesson(false);
      setEditTopic((prev) => ({
        ...prev,
        _id: dataEdit._id,
      }));
      resetInputRefs([
        { state: setDataLinkCodeFource, setState: setDataLinkCodeFource },
      ]);
    } else {
      const data = dataEdit;

      const exercises = dataEdit.exercise;
      const newEntries =
        exercises?.map((exercise: any) => ({
          id: exercise.id,
          link: exercise.link,
          name: exercise.name,
          _id: exercise._id,
        })) || [];

      setDataLinkCodeFource(() => [...newEntries]);
      if (lessonTitleRef.current) {
        lessonTitleRef.current.setValue(data.name);
      }
      setEditLesson(data);
    }

    setIsUpdateLesson(true);
  };
  // handle delete
  const deleteExercise = async () => {
    setIsLoading(true);

    try {
      const id_Deleted = idDeleted;
      const res = await deleteData(`/api/admin/exercise/${id_Deleted}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      console.log("res: ", res);
    } catch (err) {
      console.log("error: ", err);
    } finally {
      const idDeletedExercise = idDeleted;
      setDataLinkCodeFource(
        dataLinkCodeFource.filter((_, idx) => idx !== indexDeleted)
      );
      setEditLesson({
        ...editLesson,
        exercise:
          editLesson?.exercise?.filter(
            (exercise) => exercise._id !== idDeletedExercise
          ) || [],
      });
      // setDataLinkCodeFource(
      //   dataLinkCodeFource.filter((_, idx) => idx !== exer?.id)
      // );
      setIsModalVisible(false);
      setIsFetchData(!isFetchData);
      resetInputRefs([{ state: idDeleted, setState: setIdDeleted }]);
      setIndexDeleted(0);
    }
  };

  const deleteLesson = async () => {
    setIsLoading(true);
    try {
      const id_Deleted = idDeleted;
      const res = await deleteData(`/api/admin/lesson/${id_Deleted}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      console.log("res: ", res);
    } catch (err) {
      console.log("error: ", err);
    } finally {
      resetInputRefs([{ state: idDeleted, setState: setIdDeleted }]);
      setIsFetchData(!isFetchData);
      setIsModalVisible(false);
    }
  };

  const deleteTopic = async () => {
    setIsLoading(true);
    try {
      const id_Deleted = idDeleted;
      const res = await deleteData(`/api/admin/topic/${id_Deleted}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      console.log("res: ", res);
    } catch (err) {
      console.log("error: ", err);
    } finally {
      resetInputRefs([{ state: idDeleted, setState: setIdDeleted }]);
      setIsFetchData(!isFetchData);
      setIsModalVisible(false);
    }
  };

  // func other

  const deleteFunc = () => {
    if (nameDeleted === "lesson") {
      console.log("ID deleted lesson: ", idDeleted);
      deleteLesson();
    } else if (nameDeleted === "topic") {
      console.log("ID deleted topic: ", idDeleted);
      deleteTopic();
    } else if (nameDeleted === "exercise") {
      console.log("ID deleted exercise: ", idDeleted);
      deleteExercise();
    }
  };

  const notifyDelete = (id: string, name: string, index: number) => {
    if (index !== 0) {
      setIndexDeleted(index);
    }
    const idDeleted = id;
    console.log("ID deleted: ", idDeleted);
    const nameDeleted = name;
    setIdDeleted(idDeleted);
    setNameDeleted(nameDeleted);
    setIsModalVisible(true);
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdDeleted("");
  };

  // handle cancel

  const cancel = () => {
    setAddCourseContent(false);
    setIsUpdateLesson(false);
    setIsUpdateTitleTopic(false);
    setIsOnlyTopicTitle(false);
    setIsOpenLesson(false);
    setAddLesson(false);
    setIsModalVisible(false);
    setResetUploaderLesson(false);
    setShowLesson({});
    setIndexDeleted(0);

    setIdDeleted("");
    setNameDeleted("");
    setEditNameTopic("");

    resetInputRefs([
      { state: uploadeVideoLesson, setState: setUploadeVideoLesson },
      { state: dataLinkCodeFource, setState: setDataLinkCodeFource },
      { state: lessons, setState: setLessons },
      { state: editLesson, setState: setEditLesson },
      { state: editTopic, setState: setEditTopic },
      { ref: topicTitleRef },
      { ref: lessonTitleRef },
      { ref: linkExerciseRef },
      { ref: nameExerciseRef },
    ]);
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full bg-white">
          <div className="mx-2 my-2 pt-8 pb-[10px] pl-8 bg-[rgba(255,246,244,1)] rounded-lg h-full">
            <Button
              className="mr-4 button-cancel mb-6"
              style={{
                backgroundColor: "white",
                color: "#1e2753",
                borderColor: "#1e2753",
              }}
              ghost
              onClick={() => navigate(`/admin/courses`)}
            >
              <FaChevronLeft />
              Back
            </Button>
            <h4 className="font-size-18 primary-color-text uppercase pb-2">
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
              onClick={() => {
                setAddCourseContent(!addCourseContent);
                setIsUpdateTitleTopic(true);
                setAddLesson(true);
                setIsOpenLesson(true);
              }}
            />
            {addCourseContent && (
              <div className="pr-8">
                <div className="flex flex-col mb-2 relative">
                  {/* <label className="text-[12px] text-[#5a607f]">
                    Tiêu đề chương học
                  </label> */}
                  {/* {isUpdateLesson && !isOnlyTopicTitle && (
                    <MdEditSquare
                      onClick={() => {
                        setIsUpdateTitleTopic(true);
                        setAddLesson(false);
                        setIsUpdateLesson(false);
                      }}
                      className="absolute cursor-pointer top-[4px] right-8 text-red-500 hover:text-red-700"
                      title="Chỉnh sửa chương học"
                    />
                  )} */}
                  {/* <input
                    ref={topicTitleRef}
                    defaultValue={editNameTopic ? editNameTopic : ""}
                    disabled={!isUpdateTitleTopic}
                    placeholder="Kiểu dữ liệu, biến, vòng lặp"
                    className={`border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none ${
                      !isUpdateTitleTopic ? "blurred-input" : ""
                    }`}
                  /> */}
                  <MSInput
                    ref={topicTitleRef}
                    label="Tiêu đề chương học"
                    placeholder="Kiểu dữ liệu, biến, vòng lặp"
                    type="text"
                    required
                    defaultValue={editNameTopic ? editNameTopic : ""}
                  />
                </div>
                <div className="mb-2 pl-6 relative ml-6">
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
                    disabled={
                      (isUpdateTitleTopic === true &&
                        (!addLesson || isCreateLesson)) ||
                      isUpdateLesson === true
                    }
                    onClick={() => {
                      setIsOpenLesson(!isOpenLesson);
                    }}
                  />
                  {isOpenLesson && (
                    <div>
                      <div className="flex flex-col mb-2  pl-6 relative ml-6">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                        {/* <MdDeleteOutline
                          onClick={() =>
                            isUpdateLesson && lesson.name
                              ? notifyDelete(
                                  lesson._id ? lesson._id : "undifined"
                                )
                              : setLessons(
                                  lessons.filter((_, idx) => idx !== id)
                                )
                          }
                          className="absolute cursor-pointer top-1 right-2 text-red-500 hover:text-red-700"
                          title="Xoá mô tả"
                        /> */}
                        {/* <label className="text-[12px] text-[#5a607f]">
                          Tiêu đề bài học
                        </label>
                        <input
                          ref={lessonTitleRef}
                          defaultValue={editLesson?.name ? editLesson.name : ""}
                          placeholder="Hướng dẫn cài đặt vsCode"
                          className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                        /> */}
                        <MSInput
                          ref={lessonTitleRef}
                          label="Tiêu đề bài học"
                          placeholder="Hướng dẫn cài đặt vsCode"
                          type="text"
                          required
                          defaultValue={editLesson?.name ? editLesson.name : ""}
                        />
                        <div>
                          <ImageUploader
                            titleBtn="Chọn video"
                            typefile="video/*"
                            reset={resetUploaderLesson}
                            urls={editLesson?.video ? editLesson.video : ""}
                            filesParent={uploadeVideoLesson}
                            onImagesChange={handleVideoLessonChange}
                            onUrlsReset={hanleResetUrlsImage}
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
                            hanleAddLinkCodeFource(
                              dataLinkCodeFource
                                ? dataLinkCodeFource.length > 0
                                  ? dataLinkCodeFource.length
                                  : 0
                                : 0
                            )
                          }
                        />
                        {dataLinkCodeFource &&
                          dataLinkCodeFource.length >= 1 &&
                          dataLinkCodeFource.map((link, id) => (
                            <div
                              key={id}
                              className="flex flex-col mb-2 relative"
                            >
                              <MdDeleteOutline
                                onClick={() => {
                                  if (isUpdateLesson && link.link) {
                                    notifyDelete(
                                      link?._id || "",
                                      "exercise",
                                      id
                                    );
                                  } else {
                                    setDataLinkCodeFource(
                                      dataLinkCodeFource.filter(
                                        (_, idx) => idx !== id
                                      )
                                    );
                                  }
                                }}
                                className="absolute cursor-pointer top-1 right-2 text-red-500 hover:text-red-700"
                                title="Xoá mô tả"
                              />
                              {/* <label className="text-[12px] text-[#5a607f]">
                                Bài {id + 1}: Tên và link bài tập
                              </label>
                              <input
                                ref={(el) => (nameExerciseRef.current[id] = el)}
                                defaultValue={
                                  editLesson?.exercise
                                    ? editLesson.exercise[id]?.name
                                      ? editLesson.exercise[id].name
                                      : ""
                                    : dataLinkCodeFource[id]?.name
                                    ? dataLinkCodeFource[id].name
                                    : ""
                                }
                                placeholder="Nhập tên bài tập"
                                className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                              /> */}
                              <MSInput
                                ref={(el) => {
                                  linkExerciseRef.current[id] = el!;
                                }}
                                label={`Bài tập ${id + 1}`}
                                placeholder="Nhập tên bài tập"
                                type="text"
                                required
                                defaultValue={
                                  editLesson?.exercise
                                    ? editLesson.exercise[id]?.name
                                      ? editLesson.exercise[id].name
                                      : ""
                                    : dataLinkCodeFource[id]?.name
                                    ? dataLinkCodeFource[id].name
                                    : ""
                                }
                              />
                              {/* <input
                                ref={(el) => (linkExerciseRef.current[id] = el)}
                                defaultValue={
                                  editLesson?.exercise
                                    ? editLesson.exercise[id]?.link
                                      ? editLesson.exercise[id].link
                                      : ""
                                    : dataLinkCodeFource[id]?.link
                                    ? dataLinkCodeFource[id].link
                                    : ""
                                }
                                placeholder="Nhập link bài tập"
                                className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                              /> */}
                              <MSInput
                                ref={(el) => {
                                  linkExerciseRef.current[id] = el!;
                                }}
                                label={`Đường dẫn bài tập ${id + 1}`}
                                placeholder="Nhập đường dẫn bài tập"
                                type="text"
                                required
                                defaultValue={
                                  editLesson?.exercise
                                    ? editLesson.exercise[id]?.link
                                      ? editLesson.exercise[id].link
                                      : ""
                                    : dataLinkCodeFource[id]?.link
                                    ? dataLinkCodeFource[id].link
                                    : ""
                                }
                              />
                            </div>
                          ))}
                      </div>
                      {/* button save */}

                      {/* setIsUpdateTitleTopic(true);
                        setAddLesson(false);
                        setIsUpdateLesson(false); */}
                      {(isUpdateTitleTopic === false ||
                        addLesson === true ||
                        isUpdateLesson === true) && (
                        <div className="mt-8 pl-6">
                          {!addLesson && (
                            <Button
                              className="mr-4 button-cancel"
                              style={{
                                backgroundColor: "white",
                                color: "#1e2753",
                                borderColor: "#1e2753",
                              }}
                              ghost
                              onClick={() => cancel()}
                            >
                              Cancel
                            </Button>
                          )}
                          <Button
                            className="button-save"
                            style={{
                              backgroundColor: "#00095b",
                              color: "white",
                              borderColor: "#00095b",
                            }}
                            onClick={() =>
                              isUpdateLesson
                                ? updateLesson("")
                                : addLesson
                                ? handleSaveLessonsStore()
                                : isCreateLesson
                                ? createLesson()
                                : console.log("No thing")
                            }
                          >
                            {isUpdateLesson
                              ? "Update Lesson"
                              : addLesson
                              ? "Save Lesson"
                              : isCreateLesson
                              ? "Create Lesson"
                              : "No thing"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {lessons &&
                    lessons.length > 0 &&
                    lessons.map((lesson, id) => (
                      <div
                        key={id}
                        className="pl-6 my-6 py-2 pr-2 ml-6 relative"
                        style={{ borderTop: "0.4px solid #1e2753" }}
                      >
                        <MdDeleteOutline
                          className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                          onClick={() =>
                            setLessons((prev) =>
                              prev.filter((e) => e.id !== lesson.id)
                            )
                          }
                          title="Xoá lesson"
                        />
                        <MdEditSquare
                          className="absolute cursor-pointer -top-5 right-8 text-red-500 hover:text-red-700"
                          onClick={() => fillEditLesson(lesson)}
                          title="Chỉnh sửa lesson"
                        />
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
                          <div key={id}>
                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                              <div className="relative w-full h-32 overflow-hidden rounded-lg border">
                                {lesson.video && !isUpdateLesson ? (
                                  <video
                                    src={URL.createObjectURL(lesson.video[0])}
                                    controls
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  // cmt for test image when internet low
                                  // <img
                                  //   src={URL.createObjectURL(lesson.video[0])}
                                  //   alt="test image"
                                  //   className="object-cover w-full h-full"
                                  // />
                                  // <img
                                  //   src={
                                  //     editLesson && editLesson[0].video
                                  //       ? editLesson.video
                                  //       : ""
                                  //   }
                                  //   alt="test image"
                                  //   className="object-cover w-full h-full"
                                  // />
                                  <video
                                    src={
                                      editLesson && editLesson[0].video
                                        ? editLesson.video
                                        : ""
                                    }
                                    controls
                                    className="object-cover w-full h-full"
                                  />
                                )}
                              </div>
                            </div>
                            {lesson.exercise &&
                              lesson.exercise.map((data) => (
                                <div>
                                  <div className="mb-2 bg-secondary px-4 py-1 rounded-lg inline-block">
                                    <h4 className="font-size-18 text-white">
                                      {data.name}
                                    </h4>
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
            {((addCourseContent === true && isUpdateTitleTopic === true) ||
              (isUpdateLesson === true && isUpdateTitleTopic === true)) && (
              <div className="mt-8">
                <Button
                  className="mr-4 button-cancel"
                  style={{
                    backgroundColor: "white",
                    color: "#1e2753",
                    borderColor: "#1e2753",
                  }}
                  ghost
                  onClick={() => cancel()}
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
                  onClick={
                    isUpdateLesson === true && isUpdateTitleTopic === true
                      ? updateTopic
                      : createTopics
                  }
                >
                  {isUpdateTitleTopic === true
                    ? "Update Topic"
                    : "Create Topic"}
                </Button>
              </div>
            )}
            <div className="py-2 my-8 px-4 mx-12 bg-white rounded-lg">
              {dataTopic && dataTopic.length > 0 ? (
                dataTopic.map((topic, topicId) => (
                  <div
                    key={topicId}
                    className="my-6 px-4 pb-2 pt-6 pr-2 border-[0.4px] border-black rounded-lg max-h-[400px] overflow-y-auto relative"
                    // style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <MdDeleteOutline
                      className="absolute cursor-pointer top-[4px] left-[24px] text-red-500 hover:text-red-700"
                      onClick={() =>
                        notifyDelete(
                          topic && topic._id ? topic._id : "",
                          "topic",
                          0
                        )
                      }
                      title="Xoá chương học"
                    />
                    <MdEditSquare
                      onClick={() => handleEdit(topic, topic.name, "topic")}
                      className="absolute cursor-pointer top-[4px] left-[42px] text-red-500 hover:text-red-700"
                      title="Chỉnh sửa chương học"
                    />
                    <MdCreateNewFolder
                      className="absolute cursor-pointer top-[4px] left-[62px] text-red-500 hover:text-red-700"
                      title="Tạo mới bài học"
                      onClick={() => handleShowAddLesson(topic)}
                    />
                    {/* Hiển thị tiêu đề topic */}
                    <div className="mb-2 bg-secondary px-4 py-2 rounded-lg inline-block">
                      <h4 className="font-size-18 text-white">{topic.name}</h4>
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
                            className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                            onClick={() =>
                              notifyDelete(
                                lesson && lesson._id ? lesson._id : "",
                                "lesson",
                                0
                              )
                            }
                            title="Xoá bài học"
                          />
                          <MdEditSquare
                            onClick={() => {
                              handleEdit(lesson, topic.name, "");
                              setIsUpdateTitleTopic(false);
                              setIsOnlyTopicTitle(false);
                              setIsOpenLesson(true);
                              setIsUpdateLesson(true);
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
                                        <video
                                          src={video}
                                          controls
                                          className="object-cover w-full h-full"
                                        />
                                        {/* <img
                                          src={video}
                                          alt="test image"
                                          className="object-cover w-full h-full"
                                        /> */}
                                      </div>
                                    ))
                                  : lesson?.video && (
                                      // <div className="relative w-full h-32 overflow-hidden rounded-lg border">
                                      //   <video
                                      //     src={lesson.video}
                                      //     controls
                                      //     className="object-cover w-full h-full"
                                      //   />
                                      // </div>
                                      // cmt for tes internet low
                                      <div className="relative w-full h-32 overflow-hidden rounded-lg border">
                                        {/* <img
                                          src={lesson.video}
                                          alt="test image"
                                          className="object-cover w-full h-full"
                                        /> */}
                                        <video
                                          src={lesson.video}
                                          controls
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                    )}
                              </div>
                              {lesson.exercise &&
                                lesson.exercise.map((data) => (
                                  <div>
                                    <div className="mb-2 bg-secondary px-4 py-1 rounded-lg inline-block">
                                      <h4 className="font-size-18 text-white">
                                        {data.name}
                                      </h4>
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
                ))
              ) : (
                <div>No Data</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá?"
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={deleteFunc}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Content;
