import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
// import component
import AdminModalV2 from "../../components/popup/AdminModalV2";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
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
  const [id, setId] = useState("");

  // state store
  const [data, setData] = useState<Achievement[]>([]);
  const [selectedContent, setSelectedContent] = useState(null);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/achievements`, {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isFetchData]);

  let columns = ["email_user", "prize", "competition", "image"];

  // structure data video exam
  console.log(data);
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
  const create = async (data: any) => {
    // data: image : [File], //describe: string (chưa có)
    setIsLoading(true);
    const { email_user, prize, competition, image } = data;

    const formData = new FormData();
    image.forEach((file) => formData.append("fileImage", file));
    formData.append("email_user", email_user);
    formData.append("prize", prize);
    formData.append("competition", competition);
    try {
      const res = await postData(`/api/admin/achievement`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Tạo mới học sinh xuất sắc thành công!");
    } catch (e) {
      toast.error("Tạo mới học sinh xuất sắc thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  // handle update
  const update = async (data: any) => {
    //image: string | [File], //describe: string (chưa có)
    const { email_user, prize, competition, image } = data;
    const _id = id;
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (image !== data.old_image.value) {
        image.forEach((file) => formData.append("fileImage", file));
      } else {
        formData.append("image", image);
      }

      formData.append("email_user", email_user);
      formData.append("prize", prize);
      formData.append("competition", competition);

      const res = await putData(`/api/admin/achievement/${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Cập nhật học sinh xuất sắc thất thành công!");
    } catch (e) {
      toast.error("Cập nhật học sinh xuất sắc thất thất bại!", e.message);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setId("");
    }
  };

  // handle deleteFunc
  const deleteFunc = async () => {
    setIsLoading(true);
    const _id = id;
    try {
      const res = await deleteData(`/api/admin/achievement/${_id}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Xóa học sinh xuất sắc thất thành công!");
    } catch (e) {
      toast.error("Xóa học sinh xuất sắc thất thất bại!", e.message);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setId("");
      setIsModalVisible(false);
    }
  };

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setId(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      const id = row._id;
      setId(id);
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

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setId("");
  };

  if (isLoading) {
    return <Loading message="Loading data..." size="large" />;
  }

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="w-full h-full bg-white">
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
                  handleAction={handleActions}
                  actions={actions}
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
              onSave={create}
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
              onSave={update}
              title="Cập nhật học sinh xuất sắc"
            />
          )}
          {isModalVisible && (
            <PopupNotification
              title="Bạn có chắc chắn muốn xoá học sinh này?"
              status="error"
              buttonText="Xoá ngay"
              onButtonClick={deleteFunc}
              buttonClose={handleClosePopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAchievement;
