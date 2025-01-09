import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";

// import icon react
import { MdOutlineDeleteOutline } from "react-icons/md";

import { getData, deleteData } from "../../axios";

import React, { useState, useEffect, useRef } from "react";

interface Advirory {
  _id?: string;
  name?: string;
  phone_number?: string;
  email?: string;
  mindfulness_course?: string;
}

const Schedules = () => {
  const header = localStorage.getItem("access_token");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state string
  const [idAdvisoryDeleted, setIdAdvisoryDeleted] = useState("");

  const [dataAdvisories, setDataAdvisories] = useState<Advirory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/advisories", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        setDataAdvisories(res.data);
        console.log("res: ", res);
      } catch (e) {
        console.log("Error fetching data: ", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isFetchData]);

  const handleDeleteAdvisory = async () => {
    try {
      setIsLoading(true);
      const idDeleted = JSON.parse(JSON.stringify(idAdvisoryDeleted));
      const advisoryDeleted = await deleteData(
        `/api/admin/advisories/${idDeleted}`,
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      console.log(advisoryDeleted, "course deleted");
    } catch (err) {
      console.log("Error deleting: ", err);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      setIdAdvisoryDeleted("");
      setIsFetchData(!isFetchData);
    }
  };

  const handleActions = (type: string, row: any) => {
    console.log("type: ", type);
    console.log("row: ", row);
    if (type === "DELETE") {
      const id = row._id;
      setIdAdvisoryDeleted(id);
      setIsModalVisible(true);
    }
  };

  const styleAction = {
    marginRight: "8px",
    padding: "4px 8px",
    color: "black",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const actions = [
    {
      title: "Xoá",
      action: "DELETE",
      icon: <MdOutlineDeleteOutline />,
      style: { ...styleAction, color: "red" },
    },
  ];
  let columnsCourse = ["name", "phone_number", "email", "mindfulness_course"];
  let data = dataAdvisories;

  // get height element
  const headerRef = useRef<HTMLDivElement>(null); // Create a ref for the header div
  const [minHeight, setMinHeight] = useState(0); // State to store the height

  useEffect(() => {
    if (headerRef.current) {
      setMinHeight(headerRef.current.offsetHeight + 8);
    }
  }, []);

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdAdvisoryDeleted("");
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        {/* content */}
        <div className="wrap-container_categories w-full m-2">
          <div
            ref={headerRef}
            className="header_categories w-full bg-primary px-5 py-3"
          >
            <div className="left uppercase">
              <h2 className="font-size-20">Advisories</h2>
            </div>
          </div>
          <div
            style={{ minHeight: `calc(100% - ${minHeight + "px"})` }}
            className="wrap-body-categories w-full overflow-auto bg-primary px-5 py-3 mt-2"
          >
            <div className="flex body-categories">
              {data && (
                <Table
                  columns={columnsCourse}
                  data={data}
                  handleAction={handleActions}
                  actions={actions}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá?"
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
