import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../components/button/plus";
import ImageUploader from "../../components/helps/dropImage";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";

// icon react
import { CiCirclePlus } from "react-icons/ci";

//axios
import { postData, getData, deleteData, updateData } from "../../axios";

const AdminCourse: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  // state boolen
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCourses, setIsCreateCourses] = useState(false);

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
          setAllCourses(res);
          console.log("res course: ", res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataCourse();
  }, [isCreateCourses]);

  // state string
  const [idCourseDeleted, setIdCourseDeleted] = useState<string>("");
  // state file
  const [uploadeVideoIntro, setUploadeVideoIntro] = useState<File[]>([]);
  const [imageIntroCourse, setImagesIntroCourse] = useState<File[]>([]);
  // state boolean
  const [addCourse, setAddCourse] = useState(false);
  const [isModalVisible, setIdModalVisible] = useState(false);

  // data store
  const [allCourses, setAllCourses] = useState([]);
  const [dataEditCourse, setDataEditCourse] = useState<any>(null);

  // useRef input
  const courseTitleRef = useRef<HTMLInputElement>(null);
  const oldPrice = useRef<HTMLInputElement>(null);
  const newPrice = useRef<HTMLInputElement>(null);
  // fake frame course
  let columnsCourse = ["name", "image", "video", "price", "discount"];
  let dataCourse = allCourses;

  // handle
  const handleVideoIntroChange = (files: File[]) => {
    setUploadeVideoIntro(files);
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
    setImagesIntroCourse(files);
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

  const handleSaveAll = async () => {
    setIsLoading(true);

    try {
      // 1. Upload course information
      const formData = new FormData();
      imageIntroCourse.forEach((file) => formData.append("fileImage", file));
      uploadeVideoIntro.forEach((file) => formData.append("fileImage", file));

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
        { state: imageIntroCourse, setState: setImagesIntroCourse },
        { state: uploadeVideoIntro, setState: setUploadeVideoIntro },
        { ref: courseTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
      ]);
    } catch (err) {
      console.error("Error saving course:", err);
    } finally {
      setIsLoading(false);
      setIsCreateCourses(!isCreateCourses);
    }
  };
  // handle edit
  const handleOnRowEdit = (type: string, row: any) => {
    if (type === "COURSE") {
      setAddCourse(true);
      setIsUpdate(true);
      setDataEditCourse(row);
    }
    if (type === "INTRODUCE") {
      navigate(`/admin/course/${row._id}/introduce`);
    }
    if (type === "CONTENT") {
      navigate(`/admin/course/${row._id}/content`);
    }
    // fill out infor course

    console.log("Edit row:", row);
    // Implement logic to edit the row
  };

  // hanle delete

  const notifyDelete = (row: any) => {
    const id = row._id;
    setIdCourseDeleted(id);
    setIdModalVisible(true);
  };
  const handleClosePopup = () => {
    setIdModalVisible(false);
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
      setIdModalVisible(false);
      setIdCourseDeleted("");
    }
  };

  // hanle update
  const handleUpdate = async () => {
    setIsLoading(true);
    const idCourse = dataEditCourse._id;
    try {
      // 1. Upload course information
      const formData = new FormData();

      // imageIntroCourse || uploadeVideoIntro == [] thì lấy image và video cũ trong dataEditCourse
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

      if (uploadeVideoIntro && uploadeVideoIntro.length > 0) {
        uploadeVideoIntro.forEach((file) => formData.append("fileImage", file));
      } else {
        video = dataEditCourse.video;
        formData.append("video", video);
      }

      formData.append("name", courseTitleRef.current?.value || "");
      formData.append("price", oldPrice.current?.value || "");
      formData.append("discount", newPrice.current?.value || "");

      const resCourse = await updateData(
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
        { state: imageIntroCourse, setState: setImagesIntroCourse },
        { state: uploadeVideoIntro, setState: setUploadeVideoIntro },
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
      setIsCreateCourses(!isCreateCourses);
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
                      urls={dataEditCourse?.image ? dataEditCourse.image : ""}
                      onUrlsReset={hanleResetUrlsImage}
                    />
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Video giới thiệu khoá học
                      </h4>
                      <ImageUploader
                        titleBtn="Chọn video"
                        typefile="image/*"
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
                          Update
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
                          Save
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
              onRowEdit={handleOnRowEdit}
              onRowDelete={notifyDelete}
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

export default AdminCourse;
