import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ant
import { Button } from "antd";
// import icon
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { MdContentPaste } from "react-icons/md";
// import { MdAttractions } from "react-icons/md";
// import { PiLockKeyLight } from "react-icons/pi";
// import { PiLockKeyOpen } from "react-icons/pi";
// import components
import AdminHeader from "../../../components/layout/Admin/Header";
import Nav from "../../../components/layout/Admin/Nav";
// import Loading from "../../../components/loading";
// import Table from "../../../components/table";
// import PopupNotification from "../../../components/popup/notify";
// import AdminModalV2 from "../../../components/popup/AdminModalV2";
// help func
// import { getSignedUrlAndUpload } from "../../../helpers/reqSignedUrlAndUpload";
//axios
// import { postData, getData, deleteData, putData } from "../../../axios";

const InfoStudent: React.FC = () => {
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

  // const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <AdminHeader />
        <div className="w-full h-full bg-white">
          <div style={{ height: `calc(100% - 8px)` }} className="m-2">
            <div
              ref={firstDivRef}
              className="flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
              <div className="left uppercase">
                <h2 className="font-size-20">Thông tin học sinh</h2>
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
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStudent;
