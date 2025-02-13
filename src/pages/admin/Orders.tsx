import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
// import component
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
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
