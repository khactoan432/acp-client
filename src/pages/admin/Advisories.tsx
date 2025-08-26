import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";

// import icon react
import { MdOutlineDeleteOutline } from "react-icons/md";

import { getData, deleteData } from "../../axios";

interface Advirory {
  _id?: string;
  name?: string;
  phone_number?: string;
  email?: string;
  mindfulness_course?: string;
}

const Schedules = () => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state string
  const [idAdvisory, setIdAdvisory] = useState<string | string[]>("");

  const [dataAdvisories, setDataAdvisories] = useState<Advirory[]>([]);

  // State cho phân trang, sắp xếp, và tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Handle Enter key press to trigger search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue); // Cập nhật searchTerm khi nhấn Enter
    }
  };

  // Callback khi tìm kiếm hoàn tất
  const handleSearchComplete = () => {
    // Không làm gì ở đây, chỉ để truyền vào Table
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!header) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }
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
          ...(searchTerm && { search: searchTerm }),
        });
        const res = await getData(
          `/api/admin/advisories?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        if (res && Array.isArray(res.data)) {
          setDataAdvisories(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          console.error("Dữ liệu API không đúng định dạng:", res);
          setDataAdvisories([]);
          setTotalPages(1);
          toast.error("Không tìm thấy dữ liệu lịch hẹn tư vấn.");
        }
      } catch (error) {
        toast.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
        console.error("Error fetching data: ", error);
      } finally {
        if (!searchTerm) {
          setIsLoading(false);
        }
        handleSearchComplete();
      }
    };
    fetchData();
  }, [isFetchData, currentPage, rowsPerPage, sortConfig, searchTerm, header]);
  // fake frame course
  let columnsCourse = ["name", "phone_number", "email", "mindfulness_course"];
  let data = dataAdvisories;
  let fieldSearch = ["name", "phone_number", "email", "mindfulness_course"];

  const handleDeleteAdvisory = async () => {
    setIsLoading(true);
    try {
      let listIdDeleted = Array.isArray(idAdvisory) ? idAdvisory : [idAdvisory];
      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/advisories/${element}`, {
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
        toast.error(
          `Xóa lịch hẹn tư vấn thất bại các ID ${failedItems.join(", ")}`
        );
      } else {
        toast.success("Xóa các lịch hẹn tư vấn thành công.");
      }
    } catch (err) {
      console.log("Error deleting: ", err);
    } finally {
      setIsLoading(false);
      handleClosePopup();
      setIsFetchData(!isFetchData);
    }
  };

  const handleActions = (type: string, row: any) => {
    if (type === "DELETE") {
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdAdvisory(idDeleted);
        } else {
          const idOrder = row._id;
          setIdAdvisory(idOrder);
        }
        setIsModalVisible(true);
      }
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
  ];

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdAdvisory("");
  };

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <AdminHeader />
        <div className="wrap-container-table w-full h-full bg-white">
          {isLoading && <Loading message="Đang tải dữ liệu..." size="large" />}
          <div style={{ height: `calc(100% - 8px)` }} className="m-2">
            <div
              ref={firstDivRef}
              className="flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Lịch hẹn tư vấn</h2>
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
                  columns={columnsCourse}
                  fieldSearch={fieldSearch}
                  data={data}
                  batchExecution={batchExecution}
                  handleAction={handleActions}
                  actions={actions}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  setCurrentPage={setCurrentPage}
                  setRowsPerPage={setRowsPerPage}
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  filterValues={{}} // Không hỗ trợ lọc giá
                  setFilterValues={() => {}} // Không hỗ trợ lọc giá
                  filterRanges={{}} // Không hỗ trợ lọc giá
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
            Array.isArray(idAdvisory)
              ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
              : "Bạn có chắc chắn muốn xoá hàng dữ liệu này"
          }
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={handleDeleteAdvisory}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Schedules;
