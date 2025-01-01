import React, { useState, useEffect } from "react";
import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";
import Loading from "../../../components/loading";

// impoprt component
import Button from "../../../components/button/button";
import MSInput from "../../../components/input/MsInput";

import { getData, postData, putData, deleteData } from "../../../axios";

const AdminBanner: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="wrap-container_categories w-full m-2">
          <div className="header_categories flex justify-between items-center bg-primary px-5 py-3">
            <div className="left uppercase">
              <h2 className="font-size-20">Categories</h2>
            </div>
            <div className="right uppercase">
              <Button text="Thêm mới" bgColor="#2d3c88" />
            </div>
          </div>
          <div className="wrap-body-categories w-full overflow-auto bg-primary px-5 py-3 mt-2">
            <div className="flex body-categories">
              <div className="w-[32%] flex-shrink-0 box-shadow_primary bg-white pa-primary mr-2">
                <h3
                  className="mb-2 rounded-lg bg-secondary"
                  style={{ padding: "10px 12px", fontSize: "18px" }}
                >
                  Title Categories
                </h3>
                <div className="wrap-value">
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                </div>
              </div>
              <div className="w-[32%] flex-shrink-0 box-shadow_primary bg-white pa-primary mr-2">
                <h3
                  className="mb-2 rounded-lg bg-secondary"
                  style={{ padding: "10px 12px", fontSize: "18px" }}
                >
                  Title Categories
                </h3>
                <div className="wrap-value">
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                </div>
              </div>
              <div className="w-[32%] flex-shrink-0 box-shadow_primary bg-white pa-primary mr-2">
                <h3
                  className="mb-2 rounded-lg bg-secondary"
                  style={{ padding: "10px 12px", fontSize: "18px" }}
                >
                  Title Categories
                </h3>
                <div className="wrap-value">
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                </div>
              </div>
              <div className="w-[32%] flex-shrink-0 box-shadow_primary bg-white pa-primary mr-2">
                <h3
                  className="mb-2 rounded-lg bg-secondary"
                  style={{ padding: "10px 12px", fontSize: "18px" }}
                >
                  Title Categories
                </h3>
                <div className="wrap-value">
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                  <MSInput
                    type="text"
                    placeholder="Value categories"
                    className="mb-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBanner;
