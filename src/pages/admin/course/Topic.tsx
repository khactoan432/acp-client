import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import ant
import { Button } from "antd";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";
// import components
import AdminHeader from "../../../components/layout/Admin/Header";
import Nav from "../../../components/layout/Admin/Nav";
import Table from "../../../components/table";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
// import icon react
import { FaChevronLeft } from "react-icons/fa6";
// import axios
import { postData, getData, deleteData, putData } from "../../../axios";
import { toast } from "react-toastify";

interface Topic {
  _id?: string;
  describe?: string;
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
  const { idCourse } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCreateTopic, setIsModalCreateTopic] = useState(false);
  const [isModalUpdateTopic, setIsModalUpdateTopic] = useState(false);

  //string
  const [idVideo, setIdVideo] = useState<string | string[]>("");
  // store
  const [data, setData] = useState<Topic[]>([]);
  const [selectedContent, setSelectedContent] = useState(null);
  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/topics/${idCourse}`, {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        // console.log("res.data:", res.data);
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
  let columnsCourse = ["name"];
  let fieldSearch = ["name"];

  const [structData, setStructData] = useState([]);
  useEffect(() => {
    let arrStruct = [
      {
        name: "name",
        placeholder: "Nhập tên chương học",
        label: "Tên chương học",
        value: "",
        type: "INPUT",
      },
    ];
    if (selectedContent) {
      arrStruct = structData.map((field) => {
        if (selectedContent.hasOwnProperty(field.name)) {
          return {
            ...field,
            value: selectedContent[field.name],
          };
        }
        return field;
      });
      setIsModalUpdateTopic(true);
    }
    setStructData(arrStruct);
  }, [isModalCreateTopic, selectedContent]);
  const styleAction = {
    marginRight: "8px",
    padding: "4px 8px",
    borderRadius: "4px",
  };

  const actions = [
    {
      title: "Nội dung",
      action: "CONTENT",
      icon: <FaPhotoVideo />,
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
  const batchExecution = [
    {
      value: "DELETE",
      icon: <MdOutlineDeleteOutline style={{ color: "red" }} />,
      content: "Xoá hàng đã chọn",
    },
    {
      value: "LOCK",
      icon: <PiLockKeyLight />,
      content: "Khoá các Khoá học",
    },
    {
      value: "UNLOCK",
      icon: <PiLockKeyOpen />,
      content: "Mở khoá Khoá học",
    },
  ];

  // structure data video exam
  let dataTopic = data;

  const funcCreate = async (data: any) => {
    // data: name: string
    setIsLoading(true);
    const id = idCourse;
    const { name } = data;

    const formData = new FormData();
    if (!id || !name) {
      console.error("Missing data");
      alert("Thiếu thông tin id || name");
      return;
    }
    formData.append("name", name);

    try {
      await postData(`/api/admin/topic/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Tạo mới chươgn học thành công!");
    } catch (error) {
      toast.error("Tạo mới chương học thất bại!", error.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };
  // update
  const funcUpdate = async (data: any) => {
    // name: string
    const id = idVideo;
    const { name } = data;
    if (!id || !name) {
      alert("Thiếu thông tin id || name");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      await putData(`/api/admin/topic/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Cập nhật tên chương học thành công!");
    } catch (e) {
      toast.error("Cập nhật tên chương học thất bại!", e.message);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdVideo("");
    }
  };
  // delete
  const funcDelete = async () => {
    setIsLoading(true);
    try {
      let listIdDeleted = Array.isArray(idVideo) ? idVideo : [idVideo];
      const results = await Promise.allSettled(
        listIdDeleted.map(async (element) =>
          deleteData(`/api/admin/topic/${element}`, {
            headers: {
              Authorization: `Bearer ${header}`,
            },
          })
        )
      );
      let failedItems = results
        .map((result, index) =>
          result.status === "rejected" ? listIdDeleted[index] : null
        )
        .filter(Boolean);
      if (failedItems.length > 0) {
        toast.error(`Xóa chương học thất bại cho ${failedItems.join(", ")}`);
        return;
      } else {
        toast.success("Xóa các chương học thành công!");
      }
    } catch (e) {
      toast.error("Xóa chương học thất bại!", e.message);
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
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdVideo(idDeleted);
        } else {
          const idOrder = row._id;
          setIdVideo(idOrder);
        }
        setIsModalVisible(true);
      }
    }
    if (type === "CONTENT") {
      navigate(`/admin/course/${idCourse}/topic/${row._id}/content`);
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
                onClick={() => navigate(`/admin/courses`)}
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
                <h2 className="font-size-20">Chương học: tên khoá học</h2>
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
                  onClick={() => setIsModalCreateTopic(true)}
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
              {dataTopic && (
                <Table
                  columns={columnsCourse}
                  data={dataTopic}
                  batchExecution={batchExecution}
                  handleAction={handleActions}
                  actions={actions}
                  topAcctions="-66"
                  fieldSearch={fieldSearch}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalCreateTopic && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreateTopic}
          onClose={() => {
            setIsModalCreateTopic(false);
          }}
          structData={structData}
          onSave={funcCreate}
          title="Tạo mới chương học"
        />
      )}
      {isModalUpdateTopic && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateTopic}
          onClose={() => {
            setIsModalUpdateTopic(false);
            setSelectedContent(null);
          }}
          structData={structData}
          onSave={funcUpdate}
          title="Cập nhật chương học"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title={
            Array.isArray(idVideo)
              ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
              : "Bạn có chắc chắn muốn xoá hàng dữ liệu này"
          }
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={funcDelete}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default ExamVideo;
