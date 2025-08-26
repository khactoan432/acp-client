import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import component
import AdminModalV2 from "../../components/popup/AdminModalV2";
import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import Table from "../../components/table";
import Loading from "../../components/loading";
import PopupNotification from "../../components/popup/notify";
// import antd
import { Button } from "antd";
// import axios
import { postData, getData, deleteData, putData } from "../../axios";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";

interface Banner {
  _id: string;
  image: string;
}

const AdminBanner: React.FC = () => {
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

  // state boolean
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCreateBanner, setIsModalCreateBanner] = useState(false);
  const [isModalUpdateBanner, setIsModalUpdateBanner] = useState(false);

  // state string
  const [idBanner, setIdBanner] = useState<string | string[]>("");
  const navigate = useNavigate();

  // state store
  const [data, setData] = useState<Banner[]>([]);
  const [selectedContent, setSelectedContent] = useState(null);
  // get data
  // State cho phân trang, lọc, và sắp xếp
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!header) {
        toast.error("Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
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
        });
        const res = await getData(
          `/api/admin/banners?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        if (res && Array.isArray(res.data)) {
          setData(res.data);
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
          setData([]);
          setTotalPages(1);
          setFilterRanges({});
          setFilterValues({});
          toast.error("Không tìm thấy dữ liệu banner.");
        }
      } catch (error) {
        toast.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [
    isFetchData,
    currentPage,
    rowsPerPage,
    sortConfig,
    filterValues,
    header,
    navigate,
  ]);

  let columnsBanner = ["image"];

  // structure data video exam
  let dataBanner = data;
  // console.log(dataBanner);
  const [structData, setStructData] = useState([]);

  useEffect(() => {
    let arrStruct = [
      {
        name: "image",
        label: "Image",
        type: "IMAGE",
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
        return field;
      });
      setIsModalUpdateBanner(true);
    }
    setStructData(arrStruct);
  }, [isModalCreateBanner, selectedContent]);

  // handle create
  const funcCreate = async (data: any) => {
    // data: image : [File], //describe: string (chưa có)
    setIsLoading(true);
    const { image } = data;

    const formData = new FormData();
    image.forEach((file) => formData.append("fileImage", file));

    try {
      await postData(`/api/admin/banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Tạo mới banner thành công!");
    } catch (e) {
      toast.error("Tạo mới banner thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  // handle update
  const funcUpdate = async (data: any) => {
    //image: string | [File], //describe: string (chưa có)
    const { image } = data;
    const id = idBanner;
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (image !== data.old_image.value) {
        image.forEach((file) => formData.append("fileImage", file));
      } else {
        formData.append("image", image);
      }

      await putData(`/api/admin/banner/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Cập nhật banner thành công!");
    } catch (e) {
      toast.error("Cập nhật banner thất bại!", e.message);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdBanner("");
    }
  };

  // handle delete
  const funcDelete = async () => {
    setIsLoading(true);
    try {
      let listIdDeleted = Array.isArray(idBanner) ? idBanner : [idBanner];
      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/banner/${element}`, {
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
        toast.error(`Xóa banner thất bại các ID ${failedItems.join(", ")}`);
      } else {
        toast.success("Xóa các banner thành công.");
      }
    } catch (e) {
      toast.error("Xóa banner thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdBanner("");
      setIsModalVisible(false);
    }
  };

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setIdBanner(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdBanner(idDeleted);
        } else {
          const idOrder = row._id;
          setIdBanner(idOrder);
        }
        setIsModalVisible(true);
      }
    }
  };
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
      content: "Khoá các banner",
    },
    {
      value: "UNLOCK",
      icon: <PiLockKeyOpen />,
      content: "Mở khoá các banner",
    },
  ];

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdBanner("");
  };

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="wrap-container-table w-full h-full bg-white">
          {isLoading && <Loading message="Loading data..." size="large" />}
          <div style={{ height: `calc(100% - 8px)` }} className="m-2">
            <div
              ref={firstDivRef}
              className="flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Danh sách Banner </h2>
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
                  onClick={() => setIsModalCreateBanner(true)}
                >
                  Thêm mới
                </Button>
              </div>
            </div>
            <div
              className="bg-primary"
              style={{
                height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 24px)`,
              }}
            >
              {dataBanner && (
                <Table
                  columns={columnsBanner}
                  data={dataBanner}
                  batchExecution={batchExecution}
                  handleAction={handleActions}
                  actions={actions}
                  filterPrice={false} // Không có trường số
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalCreateBanner && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreateBanner}
          onClose={() => {
            setIsModalCreateBanner(false);
          }}
          structData={structData}
          onSave={funcCreate}
          title="Tạo mới banner"
        />
      )}
      {isModalUpdateBanner && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateBanner}
          onClose={() => {
            setIsModalUpdateBanner(false);
            setSelectedContent(null);
          }}
          structData={structData}
          onSave={funcUpdate}
          title="Cập nhật banner"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title={
            Array.isArray(idBanner)
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

export default AdminBanner;
