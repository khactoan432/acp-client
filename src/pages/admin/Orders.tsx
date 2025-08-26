import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import component
import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import Table from "../../components/table";
import Loading from "../../components/loading";
import PopupNotification from "../../components/popup/notify";
// import axios
import { getData, deleteData } from "../../axios";
// import icon react
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Order {
  order: string;
  data: string;
  customer: string;
  product: string;
  payment_status: string;
  order_status: string;
  total: string;
}
const AdminOrder = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
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

  // state boolean
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state string
  const [idOrder, setIdOrder] = useState<string | string[]>("");

  // state store
  const [data, setData] = useState<Order[]>([]);
  // const [selectedContent, setSelectedContent] = useState<any>(null);

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
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho tìm kiếm
  const [inputValue, setInputValue] = useState("");

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
      setSearchTerm(inputValue); // Update searchTerm only on Enter
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!header) {
        toast.error("Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }
      if (!searchTerm) {
        setIsLoading(true);
      }
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
          ...(searchTerm && { search: searchTerm }),
        });
        const res = await getData(
          `/api/admin/orders?${queryParams.toString()}`,
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
          toast.error("Không tìm thấy dữ liệu đơn hàng.");
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
    searchTerm,
    header,
    navigate,
  ]);

  const columns = [
    "code",
    "createdAt",
    "userEmail",
    "materialName",
    "type",
    "payment_status",
    "amount",
  ];

  // structure data
  const fieldSearch = [
    "code",
    "createdAt",
    "userEmail",
    "materialName",
    "type",
    "payment_status",
  ];

  // handle action
  const handleActions = (type: string, row: any) => {
    if (type === "DELETE") {
      if (Array.isArray(row)) {
        const idDeleted = row.map((item) => item._id);
        setIdOrder(idDeleted);
      } else {
        const idOrder = row._id;
        setIdOrder(idOrder);
      }
      setIsModalVisible(true);
    }
  };
  const styleAction = {
    marginRight: "8px",
    padding: "4px 8px",
    borderRadius: "4px",
  };
  const actions = [
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
      icon: <MdOutlineDeleteOutline />,
      content: "Xoá hàng đã chọn",
    },
  ];
  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdOrder("");
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      let listIdDeleted = Array.isArray(idOrder) ? idOrder : [idOrder];

      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/order/${element}`, {
            headers: { Authorization: `Bearer ${header}` },
          })
        )
      );

      // Kiểm tra lỗi
      const failedItems = results
        .map((result, index) =>
          result.status === "rejected" ? listIdDeleted[index] : null
        )
        .filter(Boolean);

      if (failedItems.length > 0) {
        toast.error(`Không thể xoá các ID sau: ${failedItems.join(", ")}`);
      } else {
        toast.success("Xoá thành công!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra khi xoá!");
      console.error(`Error deleting data`, e);
    } finally {
      setIsLoading(false);
      handleClosePopup();
      setIsFetchData((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="wrap-container-table w-full h-full bg-white">
          {isLoading && <Loading message="Đang tải dữ liệu..." size="large" />}
          <div style={{ height: `calc(100% - 8px)` }} className="m-2">
            <div
              ref={firstDivRef}
              className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Thông tin khoá học đã bán</h2>
              </div>
              <div className="right uppercase"></div>
            </div>
            <div
              className="bg-primary"
              style={{
                height: `calc(${screenHeight}px - ${firstHeight}px - 24px)`,
              }}
            >
              {data && (
                <Table
                  columns={columns}
                  fieldSearch={fieldSearch}
                  filterPrice={true}
                  data={data}
                  batchExecution={batchExecution}
                  handleAction={handleActions}
                  actions={actions}
                  topAcctions="-10"
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
                  searchTerm={inputValue}
                  setSearchTerm={setInputValue}
                  onSearchKeyPress={handleSearchKeyPress}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <PopupNotification
          title={
            Array.isArray(idOrder)
              ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
              : "Bạn có chắc chắn muốn xoá hàng dữ liệu này"
          }
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={() => handleDelete()}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default AdminOrder;
