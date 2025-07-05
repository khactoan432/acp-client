import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button } from "antd";

// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdAttractions } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";

// import components
import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import AdminModalV2 from "../../components/popup/AdminModalV2";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";
// import validation
// help func
import { getSignedUrlAndUpload } from "../../helpers/reqSignedUrlAndUpload";

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

  // state string
  const [idExam, setIdExam] = useState<string | string[]>("");
  // state boolean
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // data store
  const [allExam, setAllExam] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [categoryType, setCategoryType] = useState<any>(null);

  // structure
  const [structData, setStructData] = useState([]);
  useEffect(() => {
    let arrOption = [];
    if (categoryType && categoryType.length > 0) {
      arrOption = categoryType.map(
        (CT: { option: string; categories: string[] }) => ({
          option: CT.option,
          value: CT.categories,
        })
      );
    }

    let arrStruct = [
      {
        name: "name",
        placeholder: "Nhập tên đề thi",
        label: "Thông tin đề thi",
        value: "",
        type: "INPUT",
      },
      {
        name: "link",
        placeholder: "Nhập đường dẫn đề thi",
        label: "Đường dẫn đề thi",
        value: "",
        type: "INPUT",
      },
      {
        name: "price",
        placeholder: "Nhập giá",
        label: "Giá đề thi",
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
      {
        name: "type",
        label: "Chọn",
        options: arrOption,
        value: {},
        type: "OPTION",
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
  }, [isModalCreate, selectedContent, categoryType]);

  // get data
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/categories", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        setCategoryType(res.data);
      } catch (e) {
        console.log("Error fetch categories", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchDataExam = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/exams", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        if (res) {
          setAllExam(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataExam();
  }, [isFetchData]);
  // data table exam
  const columnsExam = ["name", "link", "price", "discount", "image", "video"];
  const fieldSearch = ["name", "link"];
  const dataExam = allExam;

  // save
  const funcCreate = async (data: any) => {
    const { name, link, price, discount, video, image, type } = data;
    setIsLoading(true);
    try {
      // Upload image & video lên GCS
      const uploadedImages = await Promise.all(
        image.map((file) => getSignedUrlAndUpload(file, "exams/image"))
      );
      const uploadedVideos = await Promise.all(
        video.map((file) => getSignedUrlAndUpload(file, "exams/video"))
      );

      // console.log({
      //   name,
      //   link,
      //   price,
      //   discount,
      //   type,
      //   image: uploadedImages,
      //   video: uploadedVideos,
      // })

      // Gửi dữ liệu metadata lên backend
      await postData(
        "/api/admin/exam",
        {
          name,
          link,
          price,
          discount,
          categories: JSON.stringify(type),
          image: uploadedImages,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );

      toast.success("Tạo mới video đề thi thành công");
      setIsModalCreate(false);
    } catch (err) {
      toast.error(`Tạo mới video đề thi thất bại: ${err.message}`);
      console.error(`Error saving exam:, ${err}`);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };
  // hanle update
  const funcUpdate = async (data: any) => {
    const { name, link, price, discount, video, image, type } = data;
    setIsLoading(true);
    const id = idExam;

    try {
      const uploadIfChanged = async (fileOrUrl, folder) => {
        if (fileOrUrl instanceof File) {
          return getSignedUrlAndUpload(fileOrUrl, folder);
        }
        return fileOrUrl; // giữ nguyên URL cũ
      };

      const uploadedImages = await Promise.all(
        image.map((item) => uploadIfChanged(item, "exams/image"))
      );
      const uploadedVideos = await Promise.all(
        video.map((item) => uploadIfChanged(item, "exams/video"))
      );

      await putData(
        `/api/admin/exam/${id}`,
        {
          name,
          link,
          price,
          discount,
          type,
          image: uploadedImages,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );

      toast.success("Cập nhật đề thi thành công");
    } catch (err) {
      toast.error("Cập nhật đề thi thất bại", err.message);
      console.error("Error saving exam:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdExam("");
    }
  };
  // handle delete
  const funcDelete = async () => {
    setIsLoading(true);
    try {
      const listIdDeleted = Array.isArray(idExam) ? idExam : [idExam];
      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/exam/${element}`, {
            headers: {
              Authorization: `Bearer ${header}`,
            },
          })
        )
      );
      const failedItems = results
        .map((result, index) =>
          result.status === "rejected" ? listIdDeleted[index] : null
        )
        .filter(Boolean);

      if (failedItems.length > 0) {
        toast.error(`Xóa đề thi thất bại các ID ${failedItems.join(", ")}`);
      } else {
        toast.success("Xóa các đề thi thành công.");
      }
    } catch (err) {
      toast.error("Xoá đề thi thất bại ", err.message);
    } finally {
      setIsLoading(false);
      handleClosePopup();
      setIsFetchData(!isFetchData);
    }
  };
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
  // func other
  const handleActions = (type: string, row: any) => {
    if (type === "DELETE") {
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdExam(idDeleted);
        } else {
          const idOrder = row._id;
          setIdExam(idOrder);
        }
        setIsModalVisible(true);
      }
    }
    if (type === "EDIT") {
      const id = row._id;
      setIdExam(id);
      setSelectedContent(row);
    }
    if (type === "INTRODUCE") {
      navigate(`/admin/exam/${row._id}/introduce`);
    }

    if (type === "CONTENT") {
      navigate(`/admin/exam/${row._id}/videos`);
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdExam("");
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
                <h2 className="font-size-20">Đề thi</h2>
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
              {/* table exam */}
              {dataExam && (
                <Table
                  columns={columnsExam}
                  fieldSearch={fieldSearch}
                  data={dataExam}
                  batchExecution={batchExecution}
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
          onSave={funcCreate}
          title="Tạo mới đề thi"
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
          onSave={funcUpdate}
          title="Cập nhật đề thi"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title={
            Array.isArray(idExam)
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

export default AdminExam;
