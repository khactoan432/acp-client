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
    borderRadius: "4px",
  };

  const actions = [
    {
      title: "No action",
    },
  ];
  let columnsCourse = ["name", "phone_number", "email", "mindfulness_course"];
  let data = dataAdvisories;
  let fieldSearch = ["name", "phone_number", "email", "mindfulness_course"];

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdAdvisoryDeleted("");
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
