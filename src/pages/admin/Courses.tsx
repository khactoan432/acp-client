import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../components/button/plus";
import ImageUploader from "../../components/helps/dropImage";
import Loading from "../../components/loading";
import Table from "../../components/table";

// icon react
import { MdDeleteOutline } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";

//axios
import { postData, getData } from "../../axios";

interface Desc {
  id: number;
  content: string;
}

interface dataExercise {
  id: number;
  link: string;
  name: string;
}

interface ListLesson {
  id: number;
  lessonTitle: string;
  uploadedImages: File[];
  dataExercise: dataExercise[];
}

interface DataDesc {
  titleDesc: string;
  descriptions: Desc[];
}

interface DataTopics {
  topicTitle: string;
  dataListLesson: ListLesson[];
}

const AdminCourse: React.FC = () => {
  const header = localStorage.getItem("access_token");

  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDataCourse = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/courses", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        if (res) {
          setAllCourses(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataCourse();
  }, []);

  let columnsCourse = ["name", "image", "price", "discount"];
  let dataCourse = allCourses;

  const [uploadeVideoLesson, setUploadeVideoLesson] = useState<File[]>([]);
  const [uploadeVideoIntro, setUploadeVideoIntro] = useState<File[]>([]);
  const [imageIntroCourse, setImagesIntroCourse] = useState<File[]>([]);

  const handleVideoLessonChange = (files: File[]) => {
    console.log("file lesson: ", files);
    setUploadeVideoLesson(files);
  };
  const handleVideoIntroChange = (files: File[]) => {
    console.log("file video: ", files);

    setUploadeVideoIntro(files);
  };
  const handleImageIntroCourse = (files: File[]) => {
    console.log("file intro: ", files);

    setImagesIntroCourse(files);
  };

  const [addCourse, setAddCourse] = useState(false);
  const [addIntroduce, setAddIntroduce] = useState(false);
  const [addCourseContent, setAddCourseContent] = useState(false);
  const [showLesson, setShowLesson] = useState<{ [key: string]: boolean }>({});

  // data store
  const [dataEditCourse, setDataEditCourse] = useState<any>(null);

  const [dataDesc, setDataDesc] = useState<DataDesc[]>([]);
  const [dataTopic, setDataTopic] = useState<DataTopics[]>([]);
  const [dataListDesc, setDataListDesc] = useState<Desc[]>([]);
  const [dataLinkCodeFource, setDataLinkCodeFource] = useState<dataExercise[]>(
    []
  );
  const [dataListLesson, setDataListLesson] = useState<ListLesson[]>([]);

  // useRef input
  const courseTitleRef = useRef<HTMLInputElement>(null);
  const introTitleRef = useRef<HTMLInputElement>(null);
  const descInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const topicTitleRef = useRef<HTMLInputElement>(null);
  const lessonTitleRef = useRef<HTMLInputElement>(null);
  const linkExerciseRef = useRef<(HTMLInputElement | null)[]>([]);
  const nameExerciseRef = useRef<(HTMLInputElement | null)[]>([]);

  const oldPrice = useRef<HTMLInputElement>(null);
  const newPrice = useRef<HTMLInputElement>(null);

  // handle add

  const hanleAddDesc = (idCur: number): void => {
    const addDesc: Desc = {
      id: idCur + 1,
      content: "",
    };
    setDataListDesc([...dataListDesc, addDesc]);
  };
  const hanleAddLesson = (idCur: number): void => {};
  const hanleAddLinkCodeFource = (idCur: number): void => {
    console.log("idCur", idCur);
    const addLinkCodeFource: dataExercise = {
      id: idCur + 1,
      link: "",
      name: "",
    };
    setDataLinkCodeFource([...dataLinkCodeFource, addLinkCodeFource]);
  };
  // handle edit

  const handleOnRowEdit = (row: any) => {
    setAddCourse(true);
    setDataEditCourse(row);
    // fill out infor course

    console.log("Edit row:", row);
    // Implement logic to edit the row
  };

  // hanle delete

  const handleOnRowDelete = (row: any) => {
    console.log("Delete row:", row);
    // Implement logic to delete the row
  };

  // reset text inputRef
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

  // hanle save

  const handleSaveDesc = () => {
    const introTitle = introTitleRef.current?.value || "";
    const descriptions: Desc[] = dataListDesc.map((desc, id) => ({
      id: desc.id,
      content: descInputRefs.current[id]?.value || "",
    }));

    setDataDesc((prev) => [
      ...prev,
      { titleDesc: introTitle, descriptions: descriptions },
    ]);

    resetInputRefs([
      { ref: introTitleRef },
      { state: dataListDesc, setState: setDataListDesc },
    ]);
  };

  const [resetUploaderLesson, setResetUploaderLesson] = useState(false);

  const handleSaveLessons = () => {
    const allDataExercise: dataExercise[] = dataLinkCodeFource.map(
      (dataExercise, id) => ({
        id: dataExercise.id,
        link: linkExerciseRef.current[id]?.value || "",
        name: nameExerciseRef.current[id]?.value || "",
      })
    );
    const lessonTitle = lessonTitleRef.current?.value || "";
    setDataListLesson((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        lessonTitle: lessonTitle,
        dataExercise: allDataExercise || [],
        uploadedImages: uploadeVideoLesson,
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

  const hanleSaveTopics = () => {
    const topicTitle = topicTitleRef.current?.value || "";
    setDataTopic((prev) => [
      ...prev,
      {
        topicTitle: topicTitle,
        dataListLesson: dataListLesson,
      },
    ]);
    resetInputRefs([
      { ref: topicTitleRef },
      { state: dataListLesson, setState: setDataListLesson },
    ]);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      // save course
      const formData = new FormData();
      imageIntroCourse.forEach((file) => formData.append("fileImage", file));
      uploadeVideoIntro.forEach((file) => formData.append("fileImage", file));

      const nameCourse = courseTitleRef.current?.value || "";
      const priceCourse = oldPrice.current?.value || "";
      const discountCourse = newPrice.current?.value || "";

      formData.append("name", nameCourse);
      formData.append("price", priceCourse);
      formData.append("discount", discountCourse);

      const resCourse = await postData("/api/admin/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      const id_course = resCourse.data._id;

      // Function to handle describe and overview for one item
      const processDescribeAndOverview = async (item: any) => {
        try {
          // Post to /describe
          const resDescribe = await postData(
            "/api/admin/describe",
            {
              id_material: id_course,
              type: "COURSE",
              desc: item.titleDesc,
            },
            {
              headers: { Authorization: `Bearer ${header}` },
            }
          );
          console.log("resDescribe: ", resDescribe);
          const id_describe = resDescribe.data._id;

          // Post to /overview
          await postData(
            "/api/admin/overview",
            {
              id_material: id_describe,
              type: "COURSE",
              desc: item.descriptions,
            },
            {
              headers: { Authorization: `Bearer ${header}` },
            }
          );
        } catch (error) {
          console.error(`Error processing item: ${item.titleDesc}`, error);
        }
      };

      // Process all items concurrently
      const processAllDescAndOverview = async () => {
        await Promise.all(
          dataDesc.map((item) => processDescribeAndOverview(item))
        );
      };

      processAllDescAndOverview();
      // ----

      //send api create topic [id_course, name(topicTitle)]
      for (let i = 0; i < dataTopic.length; i++) {
        let nameTopic = dataTopic[i].topicTitle;
        const resTopic = await postData(
          "/api/admin/topic",
          { id_course: id_course, name: nameTopic },
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        console.log("resTopic: ", resTopic);
        // send api lesson id_topic, name(lessonTitleRef), video(uploadedImages), status("PRIVATE")
        const id_topic = resTopic.data._id;
        const arrListLesson = dataTopic[i].dataListLesson;
        for (let j = 0; j < arrListLesson.length; j++) {
          const name = arrListLesson[j].lessonTitle;
          const formDataLesson = new FormData();

          const video = arrListLesson[j].uploadedImages;
          const status = "PRIVATE";
          video.forEach((file) => formDataLesson.append("fileImage", file));

          formDataLesson.append("id_topic", id_topic);
          formDataLesson.append("name", name);
          formDataLesson.append("status", status);

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
          console.log("resLesson: ", resLesson);

          const id_lesson = resLesson.data._id;
          const arrLinkExercise = arrListLesson[j].dataExercise;
          const resExercise = await postData(
            "/api/admin/exercise",
            { id_lesson: id_lesson, dataExercise: arrLinkExercise },
            {
              headers: { Authorization: `Bearer ${header}` },
            }
          );
          console.log("resExercise: ", resExercise);
        }
      }

      // save describe and overview of describe course
    } catch (err) {
      console.log("error: ", err);
    } finally {
      setIsLoading(false);
    }
    console.log("Thông tin khoá học: ", courseTitleRef.current?.value);
    console.log("Image Introdu course: ", imageIntroCourse);
    console.log("Giới thiệu khoá học: ", dataDesc);
    console.log("Video giới thiệu khoá học: ", uploadeVideoIntro);
    console.log("oldPrice: ", oldPrice.current?.value);
    console.log("newPrice: ", newPrice.current?.value);
    console.log("dataTopic: ", dataTopic);
  };
  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full overflow-y-auto bg-[rgba(255,246,244,1)]">
          <div className="my-3">
            <div className="px-3 md:px-5">
              <div className="w-[30%] rounded-lg secondary-color-bg flex justify-center">
                <h4 className="text-white p-2">Thêm thông tin khoá học</h4>
              </div>
              {/* button them khoa hoc */}
              <ButtonPlus
                content="Thêm khoá học"
                icon={CiCirclePlus}
                iconSize="text-[32px]"
                textSize="text-[14px"
                height="h-[32px]"
                width="w-[22%]"
                onClick={() => setAddCourse(!addCourse)}
              />
              {/* add thong tin khoa hoc */}
              {addCourse && (
                <div className="flex justify-around w-full">
                  {/* thong tin khoa hoc */}
                  <div className="bg-white rounded-lg w-[60%] p-4">
                    <div className="mb-2">
                      <h4 className="font-semibold primary-color-text">
                        Thông tin khoá học
                      </h4>
                    </div>
                    <div className="flex flex-col mb-2">
                      <label className="text-[12px] text-[#5a607f]">
                        Tên khoá học
                      </label>
                      <input
                        ref={courseTitleRef}
                        defaultValue={dataEditCourse ? dataEditCourse.name : ""}
                        placeholder="Nhập tên khoá học"
                        className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                      />
                    </div>
                    <ImageUploader
                      titleBtn="Chọn ảnh đại diện khoá học"
                      typefile="image/*"
                      onImagesChange={handleImageIntroCourse}
                      urls={
                        dataEditCourse
                          ? Array.isArray(dataEditCourse.image)
                            ? dataEditCourse.image
                            : [dataEditCourse.image]
                          : []
                      }
                    />
                    <div className="mb-2">
                      <h4 className="font-semibold primary-color-text">
                        Giới thiệu khoá học
                      </h4>
                      <ButtonPlus
                        content="Thêm giới thiệu"
                        icon={CiCirclePlus}
                        iconSize="text-[24px]"
                        textSize="text-[12px]"
                        height="h-[24px]"
                        width="w-[36%]"
                        paddingLeft="pl-7"
                        paddingRight="pr-4"
                        onClick={() => setAddIntroduce(!addIntroduce)}
                      />
                      {addIntroduce && (
                        <div>
                          <div className="flex flex-col mb-2">
                            <label className="text-[12px] text-[#5a607f]">
                              Tiêu đề
                            </label>
                            <input
                              ref={introTitleRef}
                              placeholder="Bạn sẽ học được gì khi tham gia khoá học"
                              className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                            />
                          </div>
                          <div className="mb-2 pl-6 relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                            {/* Đường line màu đỏ */}
                            <h4 className="font-semibold primary-color-text">
                              Thêm mô tả
                            </h4>
                            <ButtonPlus
                              content="Thêm mô tả"
                              icon={CiCirclePlus}
                              iconSize="text-[24px]"
                              textSize="text-[12px]"
                              height="h-[24px]"
                              width="w-[36%]"
                              paddingLeft="pl-7"
                              paddingRight="pr-4"
                              onClick={() => hanleAddDesc(dataListDesc.length)}
                            />
                            {dataListDesc.length >= 1 &&
                              dataListDesc.map((desc, id) => (
                                <div
                                  key={id}
                                  className="flex flex-col mb-2 relative"
                                >
                                  <MdDeleteOutline
                                    onClick={() =>
                                      setDataListDesc(
                                        dataListDesc.filter(
                                          (_, idx) => idx !== id
                                        )
                                      )
                                    }
                                    className="absolute cursor-pointer top-1 right-2 text-red-500 hover:text-red-700"
                                    title="Xoá mô tả"
                                  />
                                  <label className="text-[12px] text-[#5a607f]">
                                    Mô tả {desc.id}
                                  </label>
                                  <input
                                    ref={(el) =>
                                      (descInputRefs.current[id] = el)
                                    }
                                    placeholder="Thành thạo ngôn ngữ lập trình c#"
                                    className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                                  />
                                </div>
                              ))}
                          </div>
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
                              onClick={handleSaveDesc}
                            >
                              Save describe
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* show list desc */}
                    {dataDesc &&
                      dataDesc.length > 0 &&
                      dataDesc.map((descs, id) => (
                        <div
                          key={id}
                          className="pl-6 my-6 py-2 pr-2 rounded-lg border-[0.4px] border-[#1e2753] relative"
                        >
                          <MdDeleteOutline
                            onClick={() =>
                              setDataListDesc(
                                dataListDesc.filter((_, idx) => idx !== id)
                              )
                            }
                            className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                            title="Xoá mô tả"
                          />
                          <MdEditSquare
                            onClick={() =>
                              setDataListDesc(
                                dataListDesc.filter((_, idx) => idx !== id)
                              )
                            }
                            className="absolute cursor-pointer -top-5 right-8 text-red-500 hover:text-red-700"
                            title="Chỉnh sửa mô tả"
                          />
                          <div className="mb-2 secondary-color-bg px-4 py-2 rounded-lg inline-block">
                            <h4 className="text-white">{descs.titleDesc}</h4>
                          </div>
                          <div className="mb-2">
                            {descs.descriptions.map((desc, index) => (
                              <div key={index} className="flex items-center">
                                <FaCheck className="primary-color-text mr-2" />
                                <p>{desc.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    {/* add image/ */}
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Video giới thiệu khoá học
                      </h4>
                      <ImageUploader
                        titleBtn="Chọn video"
                        typefile="image/*"
                        onImagesChange={handleVideoIntroChange}
                      />
                    </div>
                    {/* chi phí khoá học */}
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Giá khoá học
                      </h4>
                      <div className="flex justify-around">
                        <div className="flex flex-col">
                          <label className="text-[12px] text-[#5a607f]">
                            Giá gốc
                          </label>
                          <input
                            ref={oldPrice}
                            defaultValue={
                              dataEditCourse ? dataEditCourse.price : ""
                            }
                            placeholder="Nhập giá trước giảm"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[12px] text-[#5a607f]">
                            Giá đã giảm
                          </label>
                          <input
                            ref={newPrice}
                            defaultValue={
                              dataEditCourse ? dataEditCourse.discount : ""
                            }
                            placeholder="Nhập giá đã giảm"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Nội dung khoá học */}
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
                              onClick={() =>
                                hanleAddLesson(dataListLesson.length)
                              }
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
                                  hanleAddLinkCodeFource(
                                    dataLinkCodeFource.length
                                  )
                                }
                              />
                              {dataLinkCodeFource.length >= 1 &&
                                dataLinkCodeFource.map((link, id) => (
                                  <div
                                    key={id}
                                    className="flex flex-col mb-2 relative"
                                  >
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
                                      ref={(el) =>
                                        (nameExerciseRef.current[id] = el)
                                      }
                                      placeholder="Nhập tên bài tập"
                                      className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                                    />
                                    <input
                                      ref={(el) =>
                                        (linkExerciseRef.current[id] = el)
                                      }
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
                            {dataListLesson &&
                              dataListLesson.length > 0 &&
                              dataListLesson.map((lesson, id) => (
                                <div
                                  key={id}
                                  className="pl-6 my-6 py-2 pr-2 ml-6 relative"
                                  style={{ borderTop: "0.4px solid #1e2753" }}
                                >
                                  <MdDeleteOutline
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
                                      Bài {lesson.id}: {lesson.lessonTitle}
                                    </h4>
                                  </div>
                                  {showLesson[id] && (
                                    <div>
                                      <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                                        {lesson.uploadedImages.map(
                                          (image, index) => (
                                            <div
                                              key={index}
                                              className="relative w-full h-32 overflow-hidden rounded-lg border"
                                            >
                                              <img
                                                src={URL.createObjectURL(image)}
                                                alt="video"
                                                className="object-cover w-full h-full"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                      {lesson.dataExercise &&
                                        lesson.dataExercise.map((data) => (
                                          <div>
                                            <div className="mb-2 secondary-color-bg px-4 py-1 rounded-lg inline-block">
                                              <h4 className="text-white">
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
                              <h4 className="text-white">{topic.topicTitle}</h4>
                            </div>

                            {/* Hiển thị danh sách các lesson trong topic */}
                            {topic.dataListLesson &&
                              topic.dataListLesson.length > 0 &&
                              topic.dataListLesson.map((lesson, lessonId) => (
                                <div
                                  key={lessonId}
                                  className="pl-6 my-6 py-2 pr-2 ml-6 relative"
                                  style={{ borderTop: "0.4px solid #1e2753" }}
                                >
                                  <MdDeleteOutline
                                    onClick={() => {
                                      const updatedTopics = [...dataTopic];
                                      updatedTopics[topicId].dataListLesson =
                                        updatedTopics[
                                          topicId
                                        ].dataListLesson.filter(
                                          (_, idx) => idx !== lessonId
                                        );
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
                                      Bài {lesson.id}: {lesson.lessonTitle}
                                    </h4>
                                  </div>
                                  {showLesson[`${topicId}-${lessonId}`] && (
                                    <div>
                                      <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                                        {lesson.uploadedImages.map(
                                          (image, index) => (
                                            <div
                                              key={index}
                                              className="relative w-full h-32 overflow-hidden rounded-lg border"
                                            >
                                              <img
                                                src={URL.createObjectURL(image)}
                                                alt="video"
                                                className="object-cover w-full h-full"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                      {lesson.dataExercise &&
                                        lesson.dataExercise.map((data) => (
                                          <div>
                                            <div className="mb-2 secondary-color-bg px-4 py-1 rounded-lg inline-block">
                                              <h4 className="text-white">
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
                        ))}
                    </div>
                    {/* button save */}
                    <div className="mt-4 text-center">
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
                        onClick={handleSaveAll}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="w-[35%] bg-white rounded-lg p-4">
                    category
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* table course */}
          {dataCourse && (
            <Table
              columns={columnsCourse}
              data={dataCourse}
              onRowEdit={handleOnRowEdit}
              onRowDelete={handleOnRowDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourse;
