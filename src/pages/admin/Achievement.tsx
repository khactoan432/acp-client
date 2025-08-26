import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
// import component
import AdminModalV2 from "../../components/popup/AdminModalV2";
import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import Table from "../../components/table";
import Loading from "../../components/loading";
import PopupNotification from "../../components/popup/notify";
// help func
import { getSignedUrlAndUpload } from "../../helpers/reqSignedUrlAndUpload";

// import antd
import { Button } from "antd";
// import axios
import { postData, getData, deleteData, putData } from "../../axios";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";

interface Achievement {
  _id: string;
  image: string;
  email_user: string;
  prize: string;
  competition: string;
}

const AdminAchievement: React.FC = () => {
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
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);

  // state string
  const [idAchivement, setIdAchivement] = useState<string | string[]>("");

  // state store
  const [data, setData] = useState<Achievement[]>([]);
  const [selectedContent, setSelectedContent] = useState(null);

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
          page: currentPage.toString(),
          limit: rowsPerPage.toString(),
          ...(sortConfig.key && {
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
          }),
          ...(searchTerm && { search: searchTerm }),
        });
        const res = await getData(
          `/api/admin/achievements?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        if (res && Array.isArray(res.data)) {
          setData(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          console.error("Dữ liệu API không đúng định dạng:", res);
          setData([]);
          setTotalPages(1);
          toast.error("Không tìm thấy dữ liệu thành tích.");
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

  let columns = ["email_user", "prize", "competition", "image"];

  // structure data video exam
  // console.log(data);
  let fieldSearch = ["email_user", "prize", "competition"];

  const [structData, setStructData] = useState([]);

  useEffect(() => {
    let arrStruct = [
      {
        name: "email_user",
        placeholder: "Nhập email",
        label: "Email",
        value: "",
        type: "INPUT",
      },
      {
        name: "prize",
        placeholder: "Nhập giải thưởng",
        label: "Giải thưởng",
        value: "",
        type: "INPUT",
      },
      {
        name: "competition",
        placeholder: "Nhập tên cuộc thi",
        label: "Tên cuộc thi",
        value: "",
        type: "INPUT",
      },
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
      setIsModalUpdate(true);
    }
    setStructData(arrStruct);
  }, [isModalCreate, selectedContent]);

  // handle create
  const funcCreate = async (data: any) => {
    // data: image : [File], //describe: string (chưa có)
    setIsLoading(true);
    const { email_user, prize, competition, image } = data;

    // Upload image & video lên GCS
    const uploadedImages = await Promise.all(
      image.map((file) => getSignedUrlAndUpload(file, "achievement/image"))
    );
    try {
      await postData(
        `/api/admin/achievement`,
        {
          email_user,
          prize,
          competition,
          image: uploadedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Tạo mới học sinh xuất sắc thành công!");
      setIsModalCreate(false);
    } catch (e) {
      toast.error("Tạo mới học sinh xuất sắc thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  // handle update
  const funcUpdate = async (data: any) => {
    //image: string | [File], //describe: string (chưa có)
    const { email_user, prize, competition, image } = data;
    const _id = idAchivement;
    setIsLoading(true);
    try {
      // Upload image & video lên GCS
      let uploadedImages;
      if (image !== data.old_image.value) {
        uploadedImages = await Promise.all(
          image.map((file) => getSignedUrlAndUpload(file, "achievement/image"))
        );
      } else {
        uploadedImages = image;
      }

      await putData(
        `/api/admin/achievement/${_id}`,
        {
          email_user,
          prize,
          competition,
          image: uploadedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Cập nhật học sinh xuất sắc thất thành công!");
      setIsModalUpdate(false);
    } catch (e) {
      toast.error("Cập nhật học sinh xuất sắc thất thất bại!", e.message);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdAchivement("");
    }
  };

  // handle deleteFunc
  const funcDelete = async () => {
    setIsLoading(true);
    try {
      let listIdDeleted = Array.isArray(idAchivement)
        ? idAchivement
        : [idAchivement];
      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/achievement/${element}`, {
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
          `Xóa học sinh suất sắc thất bại các ID ${failedItems.join(", ")}`
        );
      } else {
        toast.success("Xóa các học sinh xuất sắc thành công.");
      }
    } catch (e) {
      toast.error("Xóa học sinh xuất sắc thất thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      handleClosePopup();
      setIsModalVisible(false);
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
      content: "Khoá các thành thích",
    },
    {
      value: "UNLOCK",
      icon: <PiLockKeyOpen />,
      content: "Mở khoá thành tích",
    },
  ];

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const idAchivement = row._id;
      setIdAchivement(idAchivement);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdAchivement(idDeleted);
        } else {
          const idOrder = row._id;
          setIdAchivement(idOrder);
        }
        setIsModalVisible(true);
      }
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdAchivement("");
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
              ref={secondDivRef}
              className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Danh sách học sinh xuất sắc</h2>
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
                height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 24px)`,
              }}
            >
              {data && (
                <Table
                  columns={columns}
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

          {isModalCreate && (
            <AdminModalV2
              action="CREATE"
              isOpen={isModalCreate}
              onClose={() => {
                setIsModalCreate(false);
              }}
              structData={structData}
              onSave={funcCreate}
              title="Tạo mới học sinh xuất sắc"
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
              title="Cập nhật học sinh xuất sắc"
            />
          )}
          {isModalVisible && (
            <PopupNotification
              title={
                Array.isArray(idAchivement)
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
      </div>
    </div>
  );
};

export default AdminAchievement;
