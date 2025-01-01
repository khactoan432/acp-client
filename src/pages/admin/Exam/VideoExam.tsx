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
  const [resetUploaderVideo, setResetUploaderVideo] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateVideo, setIsUpdateVideo] = useState(false);
  const [idDeleted, setIdDeleted] = useState<string>("");
  const [uploadeVideo, setUploadeVideo] = useState<File[]>([]);
  const [data, setData] = useState<VideoExam[]>([]);
  const [editVideoExam, setEditVideoExam] = useState<VideoExam>();

  const titleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);

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

  const hanleResetUrls = () => {
    setEditVideoExam((prev) => ({
      ...prev,
      video: [],
    }));
  };

  const handleVideoChange = (files: File[]) => {
    setUploadeVideo(files);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    const id = idExam;
    const desc = titleRef.current?.getValue() || "";
    const formData = new FormData();
    uploadeVideo.forEach((file) => formData.append("fileVideo", file));
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

  const deleteVideo = async () => {
    setIsLoading(true);
    try {
      const res = await deleteData(`/api/admin/exam/video/${idDeleted}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      setIsFetchData(!isFetchData);
    } catch (error) {
      console.error("Error deleting data: ", error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdDeleted("");
  };

  const cancel = () => {
    resetInputRefs([
      { state: uploadeVideo, setState: setUploadeVideo },
      { ref: titleRef },
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
              onClick={() => navigate(`/admin/exams`)}
            >
              <FaChevronLeft />
              Back
            </Button>
            <h4 className="font-semibold primary-color-text uppercase pb-2">
              Video sửa đề thi
            </h4>
            <MSInput
              ref={titleRef}
              label="Tiêu đề"
              placeholder="Câu 1 - 20"
              type="text"
              defaultValue={editVideoExam?.describe}
            />
            <ImageUploader
              titleBtn="Chọn video"
              typefile="video/*"
              reset={resetUploaderVideo}
              urls={editVideoExam?.video || ""}
              filesParent={uploadeVideo}
              onImagesChange={handleVideoChange}
              onUrlsReset={hanleResetUrls}
            />
            <div className="mt-4 text-center">
              <Button
                className="mr-4 button-cancel"
                style={{
                  backgroundColor: "white",
                  color: "#1e2753",
                  borderColor: "#1e2753",
                }}
                ghost
                onClick={cancel}
              >
                Huỷ
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
                Tạo mới
              </Button>
            </div>
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
    </div>
  );
};

export default ExamVideo;
