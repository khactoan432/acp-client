import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import ant
import { Button } from "antd";

// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
import { MdAttractions } from "react-icons/md";

// import components
import ButtonPlus from "../../components/button/plus";
import MSInput from "../../components/input/MsInput";
import ImageUploader from "../../components/helps/dropImage";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";

// icon react
import { CiCirclePlus } from "react-icons/ci";

//axios
import { postData, getData, deleteData, putData } from "../../axios";

const AdminExam: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  // state boolen
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);

  // state string
  const [idCourseDeleted, setIdCourseDeleted] = useState<string>("");
  // state file
  const [uploadVideo, setUploadVideoIntro] = useState<File[]>([]);
  const [imageIntroCourse, setImageIntroCourse] = useState<File[]>([]);
  // state boolean
  const [addCourse, setAddCourse] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // data store
  const [allCourse, setAllCourse] = useState([]);
  const [dataEditCourse, setDataEditCourse] = useState<any>(null);

  // useRef input
  // const courseTitleRef = useRef<HTMLInputElement>(null);
  // const oldPrice = useRef<HTMLInputElement>(null);
  // const newPrice = useRef<HTMLInputElement>(null);

  const courseTitleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const oldPrice = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const newPrice = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);

  // get data
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
          setAllCourse(res);
          console.log("res exam: ", res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataCourse();
  }, [isFetchData]);
  // fake frame course
  let columnsCourse = ["name", "image", "video", "price", "discount"];
  let dataCourse = allCourse;

  const styleAction = {
    marginRight: "8px",
    padding: "4px 8px",
    color: "black",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const actions = [
    {
      title: "Giới thiệu khoá học",
      action: "INTRODUCE",
      icon: <MdAttractions />,
      style: styleAction,
    },
    {
      title: "Sửa nội dung",
      action: "CONTENT",
      icon: <MdContentPaste />,
      style: styleAction,
    },
    {
      title: "Chỉnh sửa",
      action: "EDIT",
      icon: <FaRegEdit />,
      style: { ...styleAction, color: "#f7bb0a" },
    },
    {
      title: "Xoá",
      action: "DELETE",
      icon: <MdOutlineDeleteOutline />,
      style: { ...styleAction, color: "red" },
    },
  ];

  // handle
  const handleVideoIntroChange = (files: File[]) => {
    setUploadVideoIntro(files);
  };
  const hanleResetUrlsImage = () => {
    setDataEditCourse((prev) => ({
      ...prev,
      image: "",
    }));
  };
  const hanleResetUrlsVideo = () => {
    // dataEditCourse.video = "";
    setDataEditCourse((prev) => ({
      ...prev,
      video: "",
    }));
  };
  const handleImageIntroCourse = (files: File[]) => {
    setImageIntroCourse(files);
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

  // hanle save

  const handleSaveAll = async () => {
    setIsLoading(true);

    try {
      // 1. Upload course information
      const formData = new FormData();
      imageIntroCourse.forEach((file) => formData.append("fileImage", file));
      uploadVideo.forEach((file) => formData.append("fileVideo", file));

      formData.append("name", courseTitleRef.current?.value || "");
      formData.append("price", oldPrice.current?.value || "");
      formData.append("discount", newPrice.current?.value || "");

      const resCourse = await postData("/api/admin/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      console.log("Course saved successfully.", resCourse);
      resetInputRefs([
        { state: imageIntroCourse, setState: setImageIntroCourse },
        { state: uploadVideo, setState: setUploadVideoIntro },
        { ref: courseTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
      ]);
    } catch (err) {
      console.error("Error saving course:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };
  // handle edit

  const handleActions = (type: string, row: any) => {
    console.log("type: ", type);
    console.log("row: ", row);
    if (type === "EDIT") {
      setAddCourse(true);
      setIsUpdate(true);
      setDataEditCourse(row);
    }
    if (type === "DELETE") {
      const id = row._id;
      setIdCourseDeleted(id);
      setIsModalVisible(true);
    }
    if (type === "INTRODUCE") {
      navigate(`/admin/course/${row._id}/introduce`);
    }
    if (type === "CONTENT") {
      navigate(`/admin/course/${row._id}/content`);
    }
  };

  // hanle delete

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdCourseDeleted("");
  };
  const handleDeleteCourse = async () => {
    try {
      setIsLoading(true);
      const idDeleted = JSON.parse(JSON.stringify(idCourseDeleted));
      const courseDeleted = await deleteData(`/api/admin/course/${idDeleted}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      console.log(courseDeleted, "course deleted");
    } catch (err) {
      console.log("Error deleting: ", err);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      setIdCourseDeleted("");
      setIsFetchData(!isFetchData);
    }
  };

  // hanle update
  const handleUpdate = async () => {
    setIsLoading(true);
    const idCourse = dataEditCourse._id;
    try {
      // 1. Upload course information
      const formData = new FormData();

      // imageIntroCourse || uploadVideo == [] thì lấy image và video cũ trong dataEditCourse
      // nếu image và video cũ sẽ là chuỗi string, nếu không nó sẽ là file và be phải chuyển qua string url để lưu
      let image = "";
      let video = "";

      if (imageIntroCourse && imageIntroCourse.length > 0) {
        imageIntroCourse.forEach((file) => formData.append("fileImage", file));
      } else {
        console.log("check image here");
        image = dataEditCourse.image;
        formData.append("image", image);
      }

      if (uploadVideo && uploadVideo.length > 0) {
        uploadVideo.forEach((file) => formData.append("fileVideo", file));
      } else {
        video = dataEditCourse.video;
        formData.append("video", video);
      }

      formData.append("name", courseTitleRef.current?.value || "");
      formData.append("price", oldPrice.current?.value || "");
      formData.append("discount", newPrice.current?.value || "");

      const resCourse = await putData(
        `/api/admin/course/${idCourse}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${header}`,
          },
        }
      );

      console.log("Course update successfully.", resCourse);
      resetInputRefs([
        { state: imageIntroCourse, setState: setImageIntroCourse },
        { state: uploadVideo, setState: setUploadVideoIntro },
        { state: dataEditCourse, setState: setDataEditCourse },
        { ref: courseTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
      ]);
      setIsUpdate(false);
      setAddCourse(false);
      hanleResetUrlsVideo();
      hanleResetUrlsImage();
    } catch (err) {
      console.error("Error saving course:", err);
    } finally {
      setIsLoading(false);
    }
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
                <h4 className="text-white p-2 uppercase">Khoá học</h4>
              </div>
              {/* button them khoa hoc */}
              <ButtonPlus
                content="Thêm khoá học mới"
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
                      {/* <label className="text-[12px] text-[#5a607f]">
                        Tên khoá học
                      </label>
                      <input
                        ref={courseTitleRef}
                        defaultValue={dataEditCourse ? dataEditCourse.name : ""}
                        placeholder="Nhập tên khoá học"
                        className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                      /> */}
                      <MSInput
                        ref={courseTitleRef}
                        label="Tên khoá học"
                        placeholder="Nhập tên khoá học"
                        type="text"
                        required
                        defaultValue={dataEditCourse ? dataEditCourse.name : ""}
                      />
                    </div>
                    <ImageUploader
                      titleBtn="Chọn ảnh đại diện khoá học"
                      typefile="image/*"
                      onImagesChange={handleImageIntroCourse}
                      urls={dataEditCourse?.image ? dataEditCourse.image : ""}
                      onUrlsReset={hanleResetUrlsImage}
                    />
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Video giới thiệu khoá học
                      </h4>
                      <ImageUploader
                        titleBtn="Chọn video"
                        typefile="video/*"
                        onImagesChange={handleVideoIntroChange}
                        urls={dataEditCourse?.video ? dataEditCourse.video : ""}
                        onUrlsReset={hanleResetUrlsVideo}
                      />
                    </div>
                    {/* chi phí khoá học */}
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Giá khoá học
                      </h4>
                      <div className="flex justify-around">
                        <div className="flex flex-col">
                          {/* <label className="text-[12px] text-[#5a607f]">
                            Giá gốc
                          </label>
                          <input
                            ref={oldPrice}
                            defaultValue={
                              dataEditCourse ? dataEditCourse.price : ""
                            }
                            placeholder="Nhập giá trước giảm"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          /> */}
                          <MSInput
                            ref={oldPrice}
                            label="Giá khoá học"
                            placeholder="Nhập giá khoá học"
                            type="number"
                            validate="number"
                            required
                            defaultValue={
                              dataEditCourse ? dataEditCourse.price : ""
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          {/* <label className="text-[12px] text-[#5a607f]">
                            Giá đã giảm
                          </label>
                          <input
                            ref={newPrice}
                            defaultValue={
                              dataEditCourse ? dataEditCourse.discount : ""
                            }
                            placeholder="Nhập giá đã giảm"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          /> */}
                          <MSInput
                            ref={newPrice}
                            label="Giá ưu đãi"
                            placeholder="Nhập ưu đãi"
                            type="number"
                            validate="number"
                            required
                            defaultValue={
                              dataEditCourse ? dataEditCourse.discount : ""
                            }
                          />
                        </div>
                      </div>
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
                        Huỷ
                      </Button>
                      {isUpdate === true ? (
                        <Button
                          className="button-save"
                          style={{
                            backgroundColor: "#00095b",
                            color: "white",
                            borderColor: "#00095b",
                          }}
                          onClick={handleUpdate}
                        >
                          Cập nhật
                        </Button>
                      ) : (
                        <Button
                          className="button-save"
                          style={{
                            backgroundColor: "#00095b",
                            color: "white",
                            borderColor: "#00095b",
                          }}
                          onClick={handleSaveAll}
                        >
                          Tạo mới
                        </Button>
                      )}
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
              handleAction={handleActions}
              actions={actions}
            />
          )}
        </div>
      </div>
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá?"
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={handleDeleteCourse}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default AdminExam;
