import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import ant
import { Button } from "antd";

// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
import { MdAttractions } from "react-icons/md";

// import components
import ButtonPlus from "../../../components/button/plus";
import Table from "../../../components/table";
import MSInput from "../../../components/input/MsInput";
import ImageUploader from "../../../components/helps/dropImage";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
import AdminModal from "../../../components/popup/AdminModal";

// import icon react
import { FaChevronLeft } from "react-icons/fa6";
import {
  MdDeleteOutline,
  MdEditSquare,
  MdCreateNewFolder,
} from "react-icons/md";

// import axios
import { postData, getData, deleteData, putData } from "../../../axios";

interface VideoExam {
  _id?: string;
  describe?: string;
  video?: File[];
}

const ExamVideo: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { idExam } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCreateVideoExam, setIsModalCreateVideoExam] = useState(false);
  const [isModalUpdateVideoExam, setIsModalUpdateVideoExam] = useState(false);

  //string
  const [idUpdated, setIdUpdated] = useState<string>("");
  const [idDeleted, setIdDeleted] = useState<string>("");
  // store
  const [data, setData] = useState<VideoExam[]>([]);
  const [editVideoExam, setEditVideoExam] = useState<VideoExam>();

  // struct data
  const fieldVideoExam = [
    {
      name: "describe",
      placeholder: "Nhập mô tả video",
      label: "Mô tả video",
    },
  ];

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/exam/videos`, {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isFetchData]);

  // define table header
  let columnsCourse = ["describe", "video"];

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

  const titleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);

  // structure data video exam
  let dataExamVideo = data;

  const resetInputRefs = (items: Array<any>) => {
    items.forEach((item) => {
      if (item.state && item.setState) {
        item.setState(Array.isArray(item.state) ? [] : null);
      } else if (item.ref && item.ref.current) {
        const ref = item.ref.current;
        if (ref.clear) ref.clear();
        else if (ref.value !== undefined) ref.value = "";
      }
    });
  };

  const createVideo = async (data: any) => {
    setIsLoading(true);
    const id = idExam;
    const uploadedVideo = data.video;
    const desc = data.describe;
    const formData = new FormData();
    if (!id || !uploadedVideo || !desc) {
      console.error("Missing data");
      alert("Thiếu thông tin id || describe || video ");
      return;
    }
    // append form
    uploadedVideo.forEach((file) => formData.append("fileVideo", file));
    formData.append("describe", desc);

    try {
      const res = await postData(`/api/admin/exam/video/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      console.log("res", res);
      setIsFetchData(!isFetchData);
    } catch (error) {
      console.error("Error saving data: ", error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      resetInputRefs([{ ref: titleRef }]);
    }
  };
  // update
  const updateVideoExam = async (data: any) => {
    console.log(data);
    const id = idUpdated;
    const describe = data.describe;
    const formData = new FormData();
    // append form data
    let video = "";
    console.log(data.video.length);
    if (Array.isArray(data.video) && data.video.length > 0) {
      console.log(data.video);
      data.video.forEach((file) => formData.append("fileVideo", file));
    } else {
      console.log(data.video);
      video = data.video;
      formData.append("video", video);
    }
    formData.append("describe", describe);

    if (!id || !describe || !video) {
      alert("Thiếu thông tin id || describe || video ");
      return;
    }
    setIsLoading(true);
    try {
      const res = await putData(
        `/api/admin/exam/video/${id}`,
        {
          video,
          describe,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${header}`,
          },
        }
      );
      console.log("res", res);
    } catch (e) {
      console.error(`Error updating video`, e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdUpdated("");
    }
  };
  // delete
  const deleteVideo = async () => {
    setIsLoading(true);
    try {
      const res = await deleteData(`/api/admin/exam/video/${idDeleted}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      console.log("res", res);
    } catch (error) {
      console.error("Error deleting data: ", error);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdDeleted("");
      setIsModalVisible(false);
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdDeleted("");
  };

  // handle action table

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setIdUpdated(id);
      setIsModalUpdateVideoExam(true);
      const dataEdit = {
        describe: row.describe,
        video: row.video,
      };
      setEditVideoExam(dataEdit);
    }
    if (type === "DELETE") {
      const id = row._id;
      setIdDeleted(id);
      setIsModalVisible(true);
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
        <div className="w-full h-full bg-white">
          <div className="m-2 h-full">
            <div className="bg-primary px-5 py-3 mb-2">
              <Button
                className="button-cancel px-5 py-3"
                style={{
                  backgroundColor: "white",
                  color: "#1e2753",
                  borderColor: "#1e2753",
                }}
                ghost
                onClick={() => navigate(`/admin/exams`)}
              >
                <FaChevronLeft />
                Back
              </Button>
            </div>
            <div className="header_categories flex justify-between items-center bg-primary px-5 py-3">
              <div className="left uppercase">
                <h2 className="font-size-20">Video đề thi</h2>
              </div>
              <div className="right uppercase">
                <Button
                  className="button-save box-shadow-btn-save"
                  style={{
                    backgroundColor: "#2d3c88",
                    color: "white",
                    borderColor: "#4558b7",
                    borderWidth: "0.1px",
                  }}
                  onClick={() => setIsModalCreateVideoExam(true)}
                >
                  Thêm mới
                </Button>
              </div>
            </div>
            {dataExamVideo && (
              <Table
                columns={columnsCourse}
                data={dataExamVideo}
                handleAction={handleActions}
                actions={actions}
              />
            )}
          </div>
        </div>
      </div>
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá?"
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={deleteVideo}
          buttonClose={handleClosePopup}
        />
      )}
      {isModalCreateVideoExam && (
        <AdminModal
          isOpen={isModalCreateVideoExam}
          multiple={false}
          onClose={() => setIsModalCreateVideoExam(false)}
          fields={fieldVideoExam}
          enableImageUpload={false}
          enableVideoUpload={true}
          data={{}}
          onSave={createVideo}
          title="Tạo mới video"
        />
      )}
      {isModalUpdateVideoExam && (
        <AdminModal
          isOpen={isModalUpdateVideoExam}
          multiple={false}
          onClose={() => setIsModalUpdateVideoExam(false)}
          fields={fieldVideoExam}
          enableImageUpload={false}
          enableVideoUpload={true}
          data={editVideoExam}
          onSave={updateVideoExam}
          title="Cập nhật video"
        />
      )}
    </div>
  );
};

export default ExamVideo;
