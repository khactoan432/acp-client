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
import { useNavigate } from "react-router-dom";

interface Teacher {
  _id: string;
  image: string;
  name: string;
  email: string;
  password: string;
  repassword: string;
  codeforce_name: string;
  phone_number: string;
}

const AdminTeacher: React.FC = () => {
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
  const [idTeacher, setIdTeacher] = useState<string | string[]>("");

  // state store
  const [data, setData] = useState<Teacher[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  // State cho phân trang, sắp xếp, và tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
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
        navigate("/login");
        return;
      }
      if (!searchTerm) {
        setIsLoading(true);
      }
      try {
        const queryParams = new URLSearchParams({
          role: "TEACHER",
          page: currentPage.toString(),
          limit: rowsPerPage.toString(),
          ...(sortConfig.key && {
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
          }),
          ...(searchTerm && { search: searchTerm }),
        });
        const res = await getData(
          `/api/admin/users?${queryParams.toString()}`,
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
          toast.error("Không tìm thấy dữ liệu giảng viên.");
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
  }, [
    isFetchData,
    currentPage,
    rowsPerPage,
    sortConfig,
    searchTerm,
    header,
    navigate,
  ]);

  let columns = ["name", "email", "codeforce_name", "phone_number", "image"];

  // structure data video exam
  let fieldSearch = ["name", "email", "codeforce_name", "phone_number"];

  const [structData, setStructData] = useState<any>([]);

  useEffect(() => {
    let arrStruct = [
      {
        name: "name",
        placeholder: "Nhập tên giáo viên",
        label: "Tên giáo viên",
        value: "",
        type: "INPUT",
      },
      {
        name: "email",
        placeholder: "Nhập email",
        label: "Email",
        value: "",
        type: "INPUT",
      },
      {
        name: "password",
        placeholder: "Nhập mật khẩu",
        label: "Mật khẩu",
        value: "",
        type: "INPUT",
        hidden: true,
      },
      {
        name: "repassword",
        placeholder: "Nhập lại mật khẩu",
        label: "Nhập lại mật khẩu",
        value: "",
        type: "INPUT",
        hidden: true,
      },

      {
        name: "codeforce_name",
        placeholder: "Nhập tên tài khoản codeforce",
        label: "Tên tài khoản codeforce",
        value: "",
        type: "INPUT",
      },
      {
        name: "phone_number",
        placeholder: "Nhập số điện thoại",
        label: "Số điện thoại",
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
      // Loại bỏ các trường `password` và `repassword` trước khi xử lý
      arrStruct = structData
        .filter(
          (field: any) =>
            field.name !== "password" && field.name !== "repassword"
        )
        .map((field: any) => {
          // console.log("field.name: ", field.name);
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

    // console.log("arrStruct: ", arrStruct);
    setStructData(arrStruct);
  }, [isModalCreate, selectedContent]);

  // handle create
  const funcCreate = async (data: any) => {
    setIsLoading(true);
    const {
      name,
      email,
      password,
      repassword,
      codeforce_name,
      phone_number,
      image,
    } = data;

    // Upload image & video lên GCS
    const uploadedImages = await Promise.all(
      image.map((file) => getSignedUrlAndUpload(file, "teacher/image"))
    );

    try {
      await postData(
        `/api/admin/user`,
        {
          name,
          email,
          password,
          repassword,
          codeforce_name,
          phone_number,
          role: "TEACHER",
          image: uploadedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Tạo mới giáo viên thành công!");
      setIsModalCreate(false);
    } catch (e) {
      toast.error("Tạo mới giáo viên thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  // handle update
  const funcUpdate = async (data: any) => {
    const { name, email, codeforce_name, phone_number, image } = data;
    const _id = idTeacher;
    setIsLoading(true);
    try {
      let uploadedImages;
      if (image !== data.old_image.value) {
        // Upload image & video lên GCS
        uploadedImages = await Promise.all(
          image.map((file) => getSignedUrlAndUpload(file, "teacher/image"))
        );
      } else {
        uploadedImages = image;
      }

      await putData(
        `/api/admin/user/${_id}`,
        {
          name,
          email,
          codeforce_name,
          phone_number,
          role: "TEACHER",
          image: uploadedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Cập nhật giáo viên thành công!");
      setIsModalUpdate(false);
    } catch (e) {
      toast.error("Cập nhật giáo viên thất bại!", e.message);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdTeacher("");
    }
  };

  // handle deleteFunc
  const funcDelete = async () => {
    setIsLoading(true);
    // const _id = idTeacher;
    try {
      let listIdDeleted = Array.isArray(idTeacher) ? idTeacher : [idTeacher];
      const results = await Promise.allSettled(
        listIdDeleted.map((element) =>
          deleteData(`/api/admin/user/${element}`, {
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
        toast.error(`Xóa giảng viên thất bại các ID ${failedItems.join(", ")}`);
      } else {
        toast.success("Xóa các giảng viên thành công.");
      }
    } catch (e) {
      toast.error("Xóa giáo viên thất bại!", e.message);
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
      content: "Khoá các Khoá học",
    },
    {
      value: "UNLOCK",
      icon: <PiLockKeyOpen />,
      content: "Mở khoá Khoá học",
    },
  ];

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const idTeacher = row._id;
      setIdTeacher(idTeacher);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      if (type === "DELETE") {
        if (Array.isArray(row)) {
          const idDeleted = row.map((item) => item._id);
          setIdTeacher(idDeleted);
        } else {
          const idOrder = row._id;
          setIdTeacher(idOrder);
        }
        setIsModalVisible(true);
      }
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdTeacher("");
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
              ref={secondDivRef}
              className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Danh sách giáo viên</h2>
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
              title="Tạo mới giáo viên"
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
              title="Cập nhật giáo viên"
            />
          )}
          {isModalVisible && (
            <PopupNotification
              title={
                Array.isArray(idTeacher)
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

export default AdminTeacher;
