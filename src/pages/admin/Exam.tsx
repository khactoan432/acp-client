import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import ant
import { Button } from "antd";

// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";

// import components
import ButtonPlus from "../../components/button/plus";
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
  const [idExamDeleted, setIdExamDeleted] = useState<string>("");
  // state file
  const [uploadVideo, setUploadVideo] = useState<File[]>([]);
  const [imageExam, setImageExam] = useState<File[]>([]);
  // state boolean
  const [addExam, setAddExam] = useState(false);
  const [isModalVisible, setIdModalVisible] = useState(false);

  // data store
  const [allExam, setAllExam] = useState([]);
  const [dataEditExam, setDataEditExam] = useState<any>(null);

  // useRef input
  const ExamTitleRef = useRef<HTMLInputElement>(null);
  const linkExam = useRef<HTMLInputElement>(null);
  const oldPrice = useRef<HTMLInputElement>(null);
  const newPrice = useRef<HTMLInputElement>(null);

  // get data
  useEffect(() => {
    const fetchDataExam = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/exams", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        console.log("res: ", res);
        if (res) {
          setAllExam(res);
          console.log("res exams: ", res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataExam();
  }, [isFetchData]);
  // fake frame exam
  let columnsExam = ["name", "link", "price", "discount", "image", "video"];
  let dataExam = allExam;
  // action table

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
  const handleVideoExam = (files: File[]) => {
    setUploadVideo(files);
  };
  const hanleResetUrlsImage = () => {
    setDataEditExam((prev) => ({
      ...prev,
      image: "",
    }));
  };
  const hanleResetUrlsVideo = () => {
    // dataEditExam.video = "";
    setDataEditExam((prev) => ({
      ...prev,
      video: "",
    }));
  };
  const handleImageExam = (files: File[]) => {
    setImageExam(files);
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
      // 1. Upload exam information
      const formData = new FormData();
      imageExam.forEach((file) => formData.append("fileImage", file));
      uploadVideo.forEach((file) => formData.append("fileVideo", file));

      const name = ExamTitleRef.current?.value || "";
      const price = oldPrice.current?.value || "";
      const discount = newPrice.current?.value || "";
      const link = linkExam.current?.value || "";

      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("link", link);

      const resExam = await postData("/api/admin/exam", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      console.log("Exam saved successfully.", resExam);
      resetInputRefs([
        { state: imageExam, setState: setImageExam },
        { state: uploadVideo, setState: setUploadVideo },
        { ref: ExamTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
        { ref: linkExam },
      ]);
    } catch (err) {
      console.error("Error saving exam:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };
  // handle edit
  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      setAddExam(true);
      setIsUpdate(true);
      setDataEditExam(row);
      console.log("row edit: ", row);
    }
    if (type === "DELETE") {
      const id = row._id;
      setIdExamDeleted(id);
      setIdModalVisible(true);
    }

    console.log("Edit row:", row);
    // Implement logic to edit the row
  };
  const handleClosePopup = () => {
    setIdModalVisible(false);
    setIdExamDeleted("");
  };
  const handleDeleteExam = async () => {
    try {
      setIsLoading(true);
      const idDeleted = JSON.parse(JSON.stringify(idExamDeleted));
      const examDeleted = await deleteData(`/api/admin/exam/${idDeleted}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      console.log(examDeleted, "Exam deleted");
    } catch (err) {
      console.log("Error deleting: ", err);
    } finally {
      setIsLoading(false);
      setIdModalVisible(false);
      setIdExamDeleted("");
      setIsFetchData(!isFetchData);
    }
  };

  // hanle update
  const handleUpdate = async () => {
    setIsLoading(true);
    const idExam = dataEditExam._id;
    try {
      // 1. Upload exam information
      const formData = new FormData();

      // imageExam || uploadVideo == [] thì lấy image và video cũ trong dataEditExam
      // nếu image và video cũ sẽ là chuỗi string, nếu không nó sẽ là file và be phải chuyển qua string url để lưu
      let image = "";
      let video = "";
      const name = ExamTitleRef.current?.value || "";
      const price = oldPrice.current?.value || "";
      const discount = newPrice.current?.value || "";
      const link = linkExam.current?.value || "";

      if (imageExam && imageExam.length > 0) {
        imageExam.forEach((file) => formData.append("fileImage", file));
      } else {
        console.log("check image here");
        image = dataEditExam.image;
        formData.append("image", image);
      }

      if (uploadVideo && uploadVideo.length > 0) {
        uploadVideo.forEach((file) => formData.append("fileVideo", file));
      } else {
        video = dataEditExam.video;
        formData.append("video", video);
      }

      formData.append("name", name);
      formData.append("link", link);
      formData.append("price", price);
      formData.append("discount", discount);

      const resExam = await putData(`/api/admin/exam/${idExam}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      console.log("Exam update successfully.", resExam);
      resetInputRefs([
        { state: imageExam, setState: setImageExam },
        { state: uploadVideo, setState: setUploadVideo },
        { state: dataEditExam, setState: setDataEditExam },
        { ref: ExamTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
        { ref: linkExam },
      ]);
      setIsUpdate(false);
      setAddExam(false);
      hanleResetUrlsVideo();
      hanleResetUrlsImage();
    } catch (err) {
      console.error("Error saving exam:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
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
                <h4 className="text-white p-2 uppercase">Đề thi</h4>
              </div>
              {/* button them khoa hoc */}
              <ButtonPlus
                content="Thêm đề thi mới"
                icon={CiCirclePlus}
                iconSize="text-[32px]"
                textSize="text-[14px"
                height="h-[32px]"
                width="w-[22%]"
                onClick={() => setAddExam(!addExam)}
              />
              {/* add thong tin khoa hoc */}
              {addExam && (
                <div className="flex justify-around w-full">
                  {/* thong tin khoa hoc */}
                  <div className="bg-white rounded-lg w-[60%] p-4">
                    <div className="mb-2">
                      <h4 className="font-semibold primary-color-text">
                        Thông tin đề thi
                      </h4>
                    </div>
                    <div className="flex flex-col mb-2">
                      <label className="text-[12px] text-[#5a607f]">
                        Tên đề thi
                      </label>
                      <input
                        ref={ExamTitleRef}
                        defaultValue={dataEditExam ? dataEditExam.name : ""}
                        placeholder="Nhập tên đề thi"
                        className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <label className="text-[12px] text-[#5a607f]">
                        Link đề thi
                      </label>
                      <input
                        ref={linkExam}
                        defaultValue={dataEditExam ? dataEditExam.link : ""}
                        placeholder="Nhập đường dẫn đề thi"
                        className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                      />
                    </div>
                    <ImageUploader
                      titleBtn="Chọn ảnh đại diện đề thi"
                      typefile="image/*"
                      onImagesChange={handleImageExam}
                      urls={dataEditExam?.image ? dataEditExam.image : ""}
                      onUrlsReset={hanleResetUrlsImage}
                    />
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Video chữa đề thi
                      </h4>
                      <ImageUploader
                        titleBtn="Chọn video"
                        typefile="video/*"
                        onImagesChange={handleVideoExam}
                        urls={dataEditExam?.video ? dataEditExam.video : ""}
                        onUrlsReset={hanleResetUrlsVideo}
                      />
                    </div>
                    {/* chi phí khoá học */}
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Giá đề thi
                      </h4>
                      <div className="flex justify-around">
                        <div className="flex flex-col">
                          <label className="text-[12px] text-[#5a607f]">
                            Giá gốc
                          </label>
                          <input
                            ref={oldPrice}
                            defaultValue={
                              dataEditExam ? dataEditExam.price : ""
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
                              dataEditExam ? dataEditExam.discount : ""
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
          {/* table exam */}
          {dataExam && (
            <Table
              columns={columnsExam}
              data={dataExam}
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
          onButtonClick={handleDeleteExam}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default AdminExam;
