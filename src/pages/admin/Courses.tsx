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
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";
// import components
import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";
import AdminModalV2 from "../../components/popup/AdminModalV2";
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
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state string
  const [idCourse, setIdCourse] = useState<string | string[]>("");
  // data store
  const [allCourse, setAllCourse] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  // State cho phân trang, lọc, sắp xếp, và tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filterValues, setFilterValues] = useState<
    Record<string, [number, number]>
  >({});
  const [filterRanges, setFilterRanges] = useState<
    Record<string, { min: number; max: number }>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // Thêm state để lưu giá trị ô tìm kiếm

  // Hàm so sánh sâu để kiểm tra object
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 == null ||
      obj2 == null
    )
      return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))
        return false;
    }
    return true;
  };

  // Handle Enter key press to trigger search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue); // Cập nhật searchTerm khi nhấn Enter
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchDataCourse = async () => {
      if (!header) {
        toast.error("Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }
      // Chỉ bật isLoading khi không tìm kiếm
      if (!searchTerm) {
        setIsLoading(true);
      }
      try {
        const queryParams = new URLSearchParams({
          skip: ((currentPage - 1) * rowsPerPage).toString(),
          limit: rowsPerPage.toString(),
          ...(sortConfig.key && {
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
          }),
          ...Object.entries(filterValues).reduce((acc, [key, [min, max]]) => {
            acc[`filter[${key}][min]`] = min.toString();
            acc[`filter[${key}][max]`] = max.toString();
            return acc;
          }, {} as Record<string, string>),
          ...(searchTerm && { search: searchTerm }),
        });
        const res = await getData(
          `/api/admin/courses?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        if (res && Array.isArray(res.data)) {
          setAllCourse(res.data);
          setTotalPages(res.totalPages || 1);
          // Tính toán filterRanges
          const numericFields = res.data.reduce(
            (fields: string[], item: any) => {
              Object.keys(item).forEach((key) => {
                if (typeof item[key] === "number" && !fields.includes(key)) {
                  fields.push(key);
                }
              });
              return fields;
            },
            []
          );
          const initialRanges = numericFields.reduce(
            (acc: Record<string, { min: number; max: number }>, field) => {
              const values = res.data
                .map((item: any) => item[field])
                .filter((v: any) => typeof v === "number");
              const min = values.length > 0 ? Math.min(...values) : 0;
              const max = values.length > 0 ? Math.max(...values) : 0;
              if (min !== max) {
                acc[field] = { min, max };
              }
              return acc;
            },
            {}
          );
          setFilterRanges((prev) => {
            if (!deepEqual(prev, initialRanges)) {
              return initialRanges;
            }
            return prev;
          });
          setFilterValues((prev) => {
            const newValues = {
              ...prev,
              ...Object.keys(initialRanges).reduce(
                (acc, field) => ({
                  ...acc,
                  [field]: prev[field] || [
                    initialRanges[field].min,
                    initialRanges[field].max,
                  ],
                }),
                {}
              ),
            };
            if (!deepEqual(prev, newValues)) {
              return newValues;
            }
            return prev;
          });
        } else {
          console.error("Dữ liệu API không đúng định dạng:", res);
          setAllCourse([]);
          setTotalPages(1);
          setFilterRanges({});
          setFilterValues({});
          toast.error("Không tìm thấy dữ liệu khóa học.");
        }
      } catch (error) {
        toast.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
        console.error("Error fetching data: ", error);
      } finally {
        if (!searchTerm) {
          setIsLoading(false);
        }
      }
    };
    fetchDataCourse();
  }, [
    isFetchData,
    currentPage,
    rowsPerPage,
    sortConfig,
    filterValues,
    searchTerm,
    header,
    navigate,
  ]);

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
        typeText: "money",
      },
      {
        name: "discount",
        placeholder: "Nhập giá ưu đãi",
        label: "Giá ưu đãi",
        value: "",
        type: "INPUT",
        typeText: "money",
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
            value:
              field.typeText === "money" &&
              typeof selectedContent[field.name] === "number"
                ? selectedContent[field.name].toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : selectedContent[field.name],
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
    console.log("arr: ", arrStruct);
    setStructData(arrStruct);
  }, [isModalCreate, selectedContent]);
  // fake frame course
  let columnsCourse = ["name", "price", "discount", "image", "video"];
  const fieldSearch = ["name"];
  let dataCourse = allCourse;

  // hanle create

  const funcCreate = async (data: any) => {
    const { name, price, discount, video, image } = data;
    setIsLoading(true);
    try {
      // Upload image & video lên GCS
      const uploadedImages = await Promise.all(
        image.map((file) => getSignedUrlAndUpload(file, "course/image"))
      );
      const uploadedVideos = await Promise.all(
        video.map((file) => getSignedUrlAndUpload(file, "course/video"))
      );

      await postData(
        "/api/admin/course",
        {
          name,
          price,
          discount,
          image: uploadedImages,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );

      toast.success("Tạo mới khoá học thành công.");
      setIsModalCreate(false);
    } catch (err) {
      toast.error("Tạo mới khóa học thất bại!", err.message);
      console.error("Error saving course:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  // hanle update
  const funcUpdate = async (data: any) => {
    const { name, price, discount, video, image } = data;
    const id = idCourse;
    setIsLoading(true);
    try {
      let uploadedImages;
      let uploadedVideos;

      if (video !== data.old_video.value) {
        // Upload image & video lên GCS
        uploadedVideos = await Promise.all(
          video.map((file) => getSignedUrlAndUpload(file, "course/video"))
        );
      } else {
        uploadedVideos = video;
      }
      if (image !== data.old_image.value) {
        uploadedImages = await Promise.all(
          image.map((file) => getSignedUrlAndUpload(file, "course/image"))
        );
      } else {
        uploadedImages = image;
      }

      await putData(
        `/api/admin/course/${id}`,
        {
          name,
          price,
          discount,
          image: uploadedImages,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );

      toast.success("Cập nhật khoá học thành công.");
      setIsModalUpdate(false);
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
  const funcDelete = async () => {
    setIsLoading(true);
    try {
      let listIdDeleted = Array.isArray(idCourse) ? idCourse : [idCourse];
      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/course/${element}`, {
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
        toast.error(`Xóa khoá học thất bại các ID ${failedItems.join(", ")}`);
      } else {
        toast.success("Xóa các khoá học thành công.");
      }
    } catch (err) {
      toast.error("Xóa khoá học thất bại!", err.message);
      console.log("Error deleting: ", err);
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
  // handle action
  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setIdCourse(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdCourse(idDeleted);
        } else {
          const idOrder = row._id;
          setIdCourse(idOrder);
        }
        setIsModalVisible(true);
      }
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

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <AdminHeader />
        <div className="wrap-container-table w-full h-full bg-white">
          {isLoading && <Loading message="Loading data..." size="large" />}
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
                  batchExecution={batchExecution}
                  handleAction={handleActions}
                  actions={actions}
                  topAcctions="-88"
                  filterPrice={true}
                  isAllowEpand={true}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  setCurrentPage={setCurrentPage}
                  setRowsPerPage={setRowsPerPage}
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  filterValues={filterValues}
                  setFilterValues={setFilterValues}
                  filterRanges={filterRanges}
                  searchTerm={inputValue} // Truyền inputValue thay vì searchTerm
                  setSearchTerm={setInputValue} // Cập nhật inputValue
                  onSearchKeyPress={handleSearchKeyPress} // Truyền hàm xử lý nhấn Enter
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
          onSave={funcUpdate}
          title="Cập nhật khoá học"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title={
            Array.isArray(idCourse)
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
