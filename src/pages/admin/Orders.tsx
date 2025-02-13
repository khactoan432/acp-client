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
// import icon react
import { FaRegEdit } from "react-icons/fa";
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
  const [data, setData] = useState<Order[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/orders?type=COURSE", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        setData(res.data);
      } catch (e) {
        console.log("Error fetching data: ", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isFetchData]);

  const columns = [
    "code",
    "createdAt",
    "userEmail",
    "materialName",
    "type",
    "payment_status",
    "amount"
  ];

  // structure data
  console.log(data);
  const fieldSearch = [
    "code",
    "createdAt",
    "userEmail",
    "materialName",
    "type",
    "payment_status",
    "amount"
  ];

  // handle action
  const handleActions = (type: string, row: any) => {
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
  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="w-full h-full bg-white">
          <div
            ref={secondDivRef}
            className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2"
          >
            <div className="left uppercase">
              <h2 className="font-size-20">Thông tin khoá học đã bán</h2>
            </div>
            <div className="right uppercase"></div>
          </div>

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

      {/* <AdminModal
        isOpen={isModalSaveOpen}
        multiple={false}
        onClose={() => setIsModalSaveOpen(false)}
        fields={fields}
        enableImageUpload={true}
        onSave={handleSave}
        data={{}}
        title="Upload New Order"
      /> */}

      {/* <AdminModal
        isOpen={isModalUpdateOpen}
        multiple={false}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setCurrentEdit(null);
        }}
        fields={fields}
        enableImageUpload={true}
        onSave={handleUpdate}
        data={getDataForEdit(currentEdit)}
        title="Edit Order"
      /> */}
    </div>
  );
};

export default AdminOrder;
