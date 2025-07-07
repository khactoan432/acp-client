import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button } from "antd";
// import components
import AdminHeader from "../../../components/layout/Admin/Header";
import Nav from "../../../components/layout/Admin/Nav";
import Table from "../../../components/table";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
// import helps fun
import { getSignedUrlAndUpload } from "../../../helpers/reqSignedUrlAndUpload";
// import icon react
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";
// import axios
import { postData, getData, deleteData, putData } from "../../../axios";

interface VideoExam {
  _id?: string;
  describe?: string;
  video?: File[];
}

const ExamVideo: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const [screenHeight, setScreenHeight] = useState(window.innerHeight - 56);
  const updateScreenHeight = () => {
    setScreenHeight(window.innerHeight - 56);
  };
  useEffect(() => {
    window.addEventListener("resize", updateScreenHeight);
    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, []);

  const [firstHeight, setFirstHeight] = useState<number>(0);
  const [secondHeight, setSeconHeight] = useState<number>(0);
  const firstDivRef = useRef<HTMLDivElement>(null);
  const secondDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstDivRef.current) {
      setFirstHeight(firstDivRef.current.offsetHeight);
    }
    if (secondDivRef.current) {
      setSeconHeight(secondDivRef.current.offsetHeight);
    }
  }, []);

  const navigate = useNavigate();
  const { idExam } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCreateVideoExam, setIsModalCreateVideoExam] = useState(false);
  const [isModalUpdateVideoExam, setIsModalUpdateVideoExam] = useState(false);

  //string
  const [idVideo, setIdVideo] = useState<string>("");
  // store
  const [data, setData] = useState<VideoExam[]>([]);
  const [selectedContent, setSelectedContent] = useState(null);
  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/exam/videos/${idExam}`, {
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
  let fieldSearch = ["describe"];

  const [structData, setStructData] = useState([]);

  useEffect(() => {
    let arrStruct = [
      {
        name: "describe",
        placeholder: "Nhập mô tả video",
        label: "Mô tả video",
        value: "",
        type: "INPUT",
      },
      {
        name: "video",
        label: "Video",
        type: "VIDEO",
        value: [],
      },
    ];
    if (selectedContent) {
      // console.log("selectedContent", selectedContent);
      arrStruct = structData.map((field) => {
        if (selectedContent.hasOwnProperty(field.name)) {
          return {
            ...field,
            value: selectedContent[field.name],
          };
        }
        return field;
      });
      setIsModalUpdateVideoExam(true);
    }
    setStructData(arrStruct);
  }, [isModalCreateVideoExam, selectedContent]);

  const styleAction = {
    marginRight: "8px",
    padding: "4px 8px",
    borderRadius: "4px",
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
  const batchExecution = [
    {
      value: "DELETE",
      icon: <MdOutlineDeleteOutline style={{ color: "red" }} />,
      content: "Xoá hàng đã chọn",
    },
    {
      value: "LOCK",
      icon: <PiLockKeyLight />,
      content: "Khoá các thành thích",
    },
    {
      value: "UNLOCK",
      icon: <PiLockKeyOpen />,
      content: "Mở khoá thành tích",
    },
  ];

  // structure data video exam
  let dataExamVideo = data;

  const createVideo = async (data: any) => {
    // data: video : [File], describe: string
    setIsLoading(true);
    const id = idExam;
    const { describe, video } = data;

    // Upload image & video lên GCS
    const uploadedVideos = await Promise.all(
      video.map((file) => getSignedUrlAndUpload(file, "exams/video/introduce"))
    );

    if (!id || !video || !describe) {
      console.error("Missing data");
      alert("Thiếu thông tin id || describe || video ");
      return;
    }

    try {
      await postData(
        `/api/admin/exam/video/${id}`,
        {
          describe,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Tạo mới video đề thi thành công!");
      setIsModalCreateVideoExam(false);
    } catch (error) {
      toast.error("Tạo mới video đề thi thất bại!", error.message);
      console.error("Error saving data: ", error);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };
  // update
  const updateVideoExam = async (data: any) => {
    //video: string | file, describe: string
    const id = idVideo;
    const { video, describe } = data;
    if (!id || !describe || !video) {
      alert("Thiếu thông tin id || describe || video ");
      return;
    }
    setIsLoading(true);
    try {
      let uploadedVideos;
      if (video !== data.old_video.value) {
        uploadedVideos = await Promise.all(
          video.map((file) =>
            getSignedUrlAndUpload(file, "exams/video/introduce")
          )
        );
      } else {
        uploadedVideos = video;
      }

      await putData(
        `/api/admin/exam/video/${id}`,
        {
          describe,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      setIsModalUpdateVideoExam(false);
      toast.success("Cập nhật video đề thi thành công!");
    } catch (e) {
      toast.error("Cập nhật video đề thi thất bại!", e.message);
      console.error(`Error updating video`, e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdVideo("");
    }
  };
  // delete
  const deleteVideo = async () => {
    setIsLoading(true);
    const id = idVideo;
    try {
      await deleteData(`/api/admin/exam/video/${id}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Xóa video đề thi thành công!");
    } catch (e) {
      toast.error("Xóa video đề thi thất bại!", e.message);
      console.error("Error deleting data: ", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdVideo("");
      setIsModalVisible(false);
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdVideo("");
  };

  // handle action table

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setIdVideo(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      const id = row._id;
      setIdVideo(id);
      setIsModalVisible(true);
    }
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="w-full h-full bg-white">
          <div style={{ height: `calc(100% - 8px)` }} className="m-2 h-full">
            <div ref={firstDivRef} className="bg-primary px-5 py-3 mb-2">
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
            <div
              ref={secondDivRef}
              className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
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
            <div
              className="bg-primary"
              style={{
                height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 32px)`,
              }}
            >
              {dataExamVideo && (
                <Table
                  columns={columnsCourse}
                  data={dataExamVideo}
                  handleAction={handleActions}
                  actions={actions}
                  batchExecution={batchExecution}
                  fieldSearch={fieldSearch}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalCreateVideoExam && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreateVideoExam}
          onClose={() => {
            setIsModalCreateVideoExam(false);
          }}
          structData={structData}
          onSave={createVideo}
          title="Tạo mới video"
        />
      )}
      {isModalUpdateVideoExam && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateVideoExam}
          onClose={() => {
            setIsModalUpdateVideoExam(false);
            setSelectedContent(null);
          }}
          structData={structData}
          onSave={updateVideoExam}
          title="Cập nhật video"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá video đề thi này?"
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
