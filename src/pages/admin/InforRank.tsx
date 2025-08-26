import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
//import component
import AdminHeader from "../../components/layout/Admin/Header";
import Nav from "../../components/layout/Admin/Nav";
import Table from "../../components/table";
// import Loading from "../../components/loading";
// import ant
import { Button } from "antd";

// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
// import { MdAttractions } from "react-icons/md";
// import { FaPhotoVideo } from "react-icons/fa";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";

// interface Order {
//   _id: string;
//   image: string;
//   name: string;
//   email: string;
//   rank: string;
//   score: string;
// }
const Ranks = () => {
  // const header = localStorage.getItem("access_token");
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
  // const [isLoading, setIsLoading] = useState(false);
  // const [isFetchData, setIsFetchData] = useState(false);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  // const [isModalUpdate, setIsModalUpdate] = useState(false);

  // state string
  // const [id, setId] = useState("");

  // state store
  const data = [];
  const [selectedContent, setSelectedContent] = useState<any>(null);

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

      // setIsModalUpdate(true);
    }

    // console.log("arrStruct: ", arrStruct);
    setStructData(arrStruct);
  }, [isModalCreate, selectedContent]);

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      // const id = row._id;
      // setId(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      // const id = row._id;
      // setId(id);
      // setIsModalVisible(true);
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

  // const handleClosePopup = () => {
  //   setIsModalVisible(false);
  //   setId("");
  // };

  // if (isLoading) {
  //   return <Loading message="Loading data..." size="large" />;
  // }

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
                <h2 className="font-size-20">Xếp hạng học sinh</h2>
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
              {/* {data && (
                <Table
                  columns={columns}
                  fieldSearch={fieldSearch}
                  data={data}
                  handleAction={handleActions}
                  actions={actions}
                  batchExecution={batchExecution}
                />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranks;
