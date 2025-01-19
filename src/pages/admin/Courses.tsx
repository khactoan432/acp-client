import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button } from "antd";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
import { MdAttractions } from "react-icons/md";
// import components
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";
import AdminModalV2 from "../../components/popup/AdminModalV2";
//axios
import { postData, getData, deleteData, putData } from "../../axios";

const AdminExam: React.FC = () => {
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
  const firstDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstDivRef.current) {
      setFirstHeight(firstDivRef.current.offsetHeight);
    }
  }, []);
  const navigate = useNavigate();
  // state boolen
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state string
  const [idCourse, setIdCourse] = useState<string>("");
  // data store
  const [allCourse, setAllCourse] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  // structure
  const [structData, setStructData] = useState([]);
  useEffect(() => {
    let arrStruct = [
      {
        name: "name",
        placeholder: "Nhập tên của khoá học",
        label: "Tên khoá học",
        value: "",
        type: "INPUT",
      },
      {
        name: "price",
        placeholder: "Nhập giá",
        label: "Giá khoá học",
        value: "",
        type: "INPUT",
        typeText: "number",
      },
      {
        name: "discount",
        placeholder: "Nhập giá ưu đãi",
        label: "Giá ưu đãi",
        value: "",
        type: "INPUT",
        typeText: "number",
      },
      {
        name: "image",
        label: "Image",
        type: "IMAGE",
        value: [],
      },
      {
        name: "video",
        label: "Video",
        type: "VIDEO",
        value: [],
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
        if (field.name === "type") {
          const arrValue: Record<string, any> = {};
          selectedContent.categories.forEach((element) => {
            arrValue[element.type] = element.value;
          });

          return {
            ...field,
            value: arrValue,
          };
        }
        return field;
      });
      setIsModalUpdate(true);
    }
    setStructData(arrStruct);
  }, [isModalCreate, selectedContent]);

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
          console.log("data course: ", res);
          setAllCourse(res);
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
  let columnsCourse = ["name", "price", "discount", "image", "video"];
  const fieldSearch = ["name"];
  let dataCourse = allCourse;
  // styles and action table
  const styleAction = {
    marginRight: "8px",
    padding: "4px 8px",
    borderRadius: "4px",
  };
  const actions = [
    {
      title: "Giới thiệu",
      action: "INTRODUCE",
      icon: <MdAttractions />,
      style: styleAction,
    },
    {
      title: "Chương học",
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

  // hanle create

  const createCourse = async (data: any) => {
    const { name, price, discount, video, image } = data;
    setIsLoading(true);
    try {
      const formData = new FormData();
      image.forEach((file) => formData.append("fileImage", file));
      video.forEach((file) => formData.append("fileVideo", file));

      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount);

      const res = await postData("/api/admin/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      toast.success("Tạo mới khoá học thành công.");
    } catch (err) {
      toast.error("Tạo mới khóa học thất bại!", err.message);
      console.error("Error saving course:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  // hanle update
  const updateCourse = async (data: any) => {
    const { name, price, discount, video, image } = data;
    const id = idCourse;
    setIsLoading(true);
    try {
      const formData = new FormData();

      if (video !== data.old_video.value) {
        video.forEach((file) => formData.append("fileVideo", file));
      } else {
        formData.append("video", video);
      }
      if (image !== data.old_image.value) {
        image.forEach((file) => formData.append("fileImage", file));
      } else {
        formData.append("image", image);
      }

      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount);

      const res = await putData(`/api/admin/course/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      toast.success("Cập nhật khoá học thành công.");
    } catch (err) {
      toast.error("Cập nhật khoá học thất bại!", err.message);
      console.error("Error saving course:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdCourse("");
    }
  };
  // hanle delete
  const handleDeleteCourse = async () => {
    setIsLoading(true);
    const id = idCourse;
    try {
      const res = await deleteData(`/api/admin/course/${id}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Xóa khoá học thành công.");
    } catch (err) {
      toast.error("Xóa khoá học thất bại!", err.message);
      console.log("Error deleting: ", err);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      setIdCourse("");
      setIsFetchData(!isFetchData);
    }
  };
  // handle action
  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setIdCourse(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      const id = row._id;
      setIdCourse(id);
      setIsModalVisible(true);
    }
    if (type === "INTRODUCE") {
      navigate(`/admin/course/${row._id}/introduce`);
    }
    if (type === "CONTENT") {
      navigate(`/admin/course/${row._id}/topics`);
    }
  };
  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdCourse("");
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
          <div style={{ height: `calc(100% - 8px)` }} className="m-2">
            <div
              ref={firstDivRef}
              className="flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Khoá học</h2>
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
                  onClick={() => setIsModalCreate(true)}
                >
                  Thêm mới
                </Button>
              </div>
            </div>
            <div
              className="bg-primary"
              style={{
                height: `calc(${screenHeight}px - ${firstHeight}px - 24px)`,
              }}
            >
              {dataCourse && (
                <Table
                  columns={columnsCourse}
                  fieldSearch={fieldSearch}
                  data={dataCourse}
                  handleAction={handleActions}
                  actions={actions}
                  filterPrice={true}
                  isAllowEpand={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalCreate && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreate}
          onClose={() => setIsModalCreate(false)}
          structData={structData}
          onSave={createCourse}
          title="Tạo mới khoá học"
        />
      )}
      {isModalUpdate && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdate}
          onClose={() => {
            setIsModalUpdate(false);
            setSelectedContent(null);
          }}
          structData={structData}
          onSave={updateCourse}
          title="Cập nhật khoá học"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá xoá học này?"
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
