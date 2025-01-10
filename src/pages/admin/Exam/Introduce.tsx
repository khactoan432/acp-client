import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import ant
import { Button, Select } from "antd";

// import components
import AdminModalV2 from "../../../components/popup/AdminModalV2";
import PopupNotification from "../../../components/popup/notify";
import Loading from "../../../components/loading";

//icon react
import { FiTrash } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { FaChevronLeft } from "react-icons/fa6";

// import axios
import { postData, getData, deleteData, putData } from "../../../axios";

// interface
interface Desc {
  id: number;
  _id: string;
  desc: string;
}

interface DataDesc {
  _id?: string;
  desc?: string;
  id_material?: string;
  overviews?: Overview[];
  type?: string;
}

interface Overview {
  _id: string;
  desc: string;
  id_material: string;
  type: string;
}

const { Option } = Select;

type CheckboxState = {
  lv1: boolean;
  lv2: { _id: string; status: boolean }[];
  lv3: { _id: string; status: boolean }[];
  lv4: { _idParent?: string; child: { _id?: string; status?: boolean }[] }[];
};
interface Deleted {
  describes: string[];
  overviews: string[];
}
const IntroduceExam: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { idExam } = useParams();
  // state string
  const [idDeleted, setIdDeleted] = useState<Deleted>({
    describes: [],
    overviews: [],
  });
  const [idUpdate, setIdUpdate] = useState<string>("");
  const [nameDeleted, setNameDeleted] = useState<string>("");

  //state boolean
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  //state file []

  //state array (store)
  const [listDesc, setListDesc] = useState<Desc[]>([]);
  const [dataDesc, setDataDesc] = useState<DataDesc[]>([]);

  // structure
  const [structData, setStructData] = useState([
    {
      name: "desc",
      placeholder: "Nhập tiêu đề mô tả",
      label: "Mô tả video",
      value: "",
      type: "INPUT",
    },
    {
      name: "overviews",
      placeholder: "Nhập mô tả",
      label: "Thêm mô tả đề thi",
      type: "ARRAY",
      value: [],
    },
  ]);

  // get data
  useEffect(() => {
    const fetchDataIntroduce = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/describes/${idExam}`, {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        const describes = res.data;
        setDataDesc(describes);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataIntroduce();
  }, [isFetchData]);

  // reset input refs
  const resetInputRefs = (
    items: Array<{
      state?: any;
      setState?: (value: any) => void;
      ref?: React.RefObject<any>;
    }>
  ) => {
    items.forEach((item) => {
      if (item.state && item.setState) {
        // Reset state
        if (Array.isArray(item.state)) {
          item.setState([]); // Reset mảng về rỗng
        } else {
          item.setState(null); // Reset giá trị khác về null
        }
      } else if (item.ref) {
        // Reset ref
        const currentRef = item.ref.current;
        if (Array.isArray(currentRef)) {
          // Reset mỗi phần tử trong mảng ref
          currentRef.forEach((ref) => {
            if (ref && ref.value !== undefined) ref.value = "";
          });
        } else if (currentRef && currentRef.value !== undefined) {
          // Reset giá trị của input ref
          currentRef.value = "";
        }
      }
    });
  };

  //handle save
  const createIntro = async (data: any) => {
    setIsLoading(true);
    const introTitle = data.desc;
    const dataList = data.overviews;
    try {
      const resDescribe = await postData(
        "/api/admin/describe",
        {
          id_material: idExam,
          type: "EXAM",
          desc: introTitle,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );

      const id_describe = resDescribe.data._id;

      dataList.forEach(async (data: { _id?: string; value?: string }) => {
        const value = data.value;
        console.log(value);
        try {
          await postData(
            "/api/admin/overview",
            {
              id_material: id_describe,
              type: "EXAM",
              desc: value,
            },
            {
              headers: { Authorization: `Bearer ${header}` },
            }
          );
        } catch (error) {
          console.error(`Error saving describe/overview}`, error);
        }
      });
    } catch (error) {
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
      resetInputRefs([{ state: listDesc, setState: setListDesc }]);
      setIsFetchData(!isFetchData);
    }
  };
  const updateIntro = async (data: any) => {
    console.log("all data: ", data);
    const idIntro = idUpdate;

    const introTitle = data.desc;
    const dataList = data.overviews; // _id , value
    setIsLoading(true);

    try {
      const resDescribe = await putData(
        `/api/admin/describe/${idIntro}`,
        {
          desc: introTitle,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      console.log("resDescribe update: ", resDescribe);

      dataList.forEach(async (data: { _id?: string; value?: string }) => {
        const id = data._id || "";
        console.log("id: ", id);
        const value = data.value;
        if (id && value) {
          try {
            const update = await putData(
              `/api/admin/overview/${id}`,
              {
                desc: value,
              },
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
            console.log("update overview: ", update);
          } catch (error) {
            console.error(`Error saving describe/overview}`, error);
          }
        } else if (!id && value) {
          console.log("check");
          try {
            const res = await postData(
              "/api/admin/overview",
              {
                id_material: idIntro,
                type: "COURSE",
                desc: value,
              },
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
          } catch (error) {
            console.error(`Error saving describe/overview}`, error);
          }
        } else if (id && !value) {
          try {
            const deleteRes = await deleteData(`/api/admin/overview/${id}`, {
              headers: { Authorization: `Bearer ${header}` },
            });
            console.log("deleteRes overview when not value: ", deleteRes);
          } catch (error) {
            console.error(`Error saving describe/overview}`, error);
          }
        }
      });
    } catch (error) {
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
      resetInputRefs([{ state: listDesc, setState: setListDesc }]);
      setIsFetchData(!isFetchData);
    }
  };
  // hanle edit
  const handleEditIntroduce = async (descs: any) => {
    setIsModalUpdate(true);
    setIdUpdate(descs._id);

    const updatedStructData = structData.map((field) => {
      if (descs.hasOwnProperty(field.name)) {
        if (Array.isArray(descs[field.name])) {
          return {
            ...field,
            value: descs[field.name].map((item: any) => ({
              desc: item.desc,
              _id: item._id,
            })),
          };
        }
        return {
          ...field,
          value: descs[field.name],
        };
      }
      return field;
    });

    console.log("updatedStructData: ", updatedStructData);

    setStructData(updatedStructData);
  };

  // hanle delete

  // const deleteFunc = () => {
  //   if (nameDeleted === "overview") {
  //     console.log("ID deleted overview: ", idDeleted);
  //     handleDeleteOverview();
  //   } else if (nameDeleted === "describe") {
  //     console.log("ID deleted describe: ", idDeleted);
  //     deleteIntro();
  //   }
  // };

  // const notifyDelete = (id: string, name: string) => {
  //   const idDeleted = id;
  //   const nameDeleted = name;

  //   setNameDeleted(nameDeleted);
  //   setIdDeleted(idDeleted);
  //   setIsModalVisible(true);
  // };
  // const handleClosePopup = () => {
  //   setIsModalVisible(false);
  //   setIdDeleted();
  // };

  // const deleteIntro = async () => {
  //   setIsLoading(true);
  //   const id = idDeleted;
  //   try {
  //     const res = await deleteData(`/api/admin/describe/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${header}`,
  //       },
  //     });
  //     console.log("res: ", res);
  //   } catch (err) {
  //     console.error(`Error deleting describe`, err);
  //   } finally {
  //     setIsLoading(false);
  //     setIsFetchData(!isFetchData);
  //     setIsModalVisible(false);
  //   }
  // };

  // const handleDeleteOverview = async () => {
  //   const id_Deleted = idDeleted;
  //   if (!id_Deleted) {
  //     console.error("idDeleted is undefined");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const deleteRes = await deleteData(`/api/admin/overview/${idDeleted}`, {
  //       headers: { Authorization: `Bearer ${header}` },
  //     });
  //     console.log("deleteRes: ", deleteRes);
  //   } catch (error) {
  //     console.error(`Error deleting overview`, error);
  //   } finally {
  //     setIsLoading(false);
  //     setIsModalVisible(false);
  //     setIsFetchData(!isFetchData);

  //     setListDesc((prevListDesc) =>
  //       prevListDesc.filter((item) => item._id !== idDeleted)
  //     );
  //   }
  // };

  // func handle checkbox
  // struct checkbox
  const [checkboxState, setCheckboxState] = useState<CheckboxState>();
  useEffect(() => {
    if (dataDesc && dataDesc.length > 0) {
      setCheckboxState({
        lv1: false,
        lv2: dataDesc.map((item) => ({
          _id: item._id || "",
          status: false,
        })),
        lv3: dataDesc.map((item) => ({
          _id: item._id || "",
          status: false,
        })),
        lv4: dataDesc.map((item) => ({
          _idParent: item._id || "",
          child:
            item.overviews?.map((it) => ({
              _id: it._id || "",
              status: false,
            })) || [],
        })),
      });
    }
  }, [dataDesc]);

  const handleCheckboxChange = (
    level: "lv1" | "lv2" | "lv3" | "lv4",
    curStatus: boolean,
    _id?: string
  ) => {
    console.log("lv: ", level, "_id: ", _id, "curStatus: ", curStatus);
    setCheckboxState((prev) => {
      const newState = { ...prev };
      if (level === "lv1") {
        const allIdDelete = { ...idDeleted };

        // Duyệt qua dataDesc để lấy _id của từng describe và overview
        dataDesc.forEach((descs: any) => {
          // Thêm _id vào mảng describes nếu chưa có
          if (!allIdDelete.describes.includes(descs._id)) {
            allIdDelete.describes.push(descs._id);
          }

          // Duyệt qua mỗi overview và thêm _id vào mảng overviews nếu chưa có
          descs.overviews.forEach((overviews: any) => {
            if (!allIdDelete.overviews.includes(overviews._id)) {
              allIdDelete.overviews.push(overviews._id);
            }
          });
        });

        // Cập nhật lại state idDeleted
        setIdDeleted(allIdDelete);

        // Set lv1 to true
        newState.lv1 = !curStatus;

        // Set all lv2 to true
        console.log("newState.lv2: ", newState.lv2);
        newState.lv2 =
          newState.lv2 &&
          newState.lv2.map((item) => ({
            ...item,
            status: !curStatus,
          }));

        // Set lv3 to true
        newState.lv3 =
          newState.lv3 &&
          newState.lv3.map((item) => ({
            ...item,
            status: !curStatus,
          }));

        // Set all lv4 child status to true
        newState.lv4 =
          newState.lv4 &&
          newState.lv4.map((item) => ({
            ...item,
            child: item.child.map((child) => ({
              ...child,
              status: !curStatus,
            })),
          }));
      }
      if (level === "lv2" && _id) {
        // Update only the selected lv2 item
        newState.lv2 =
          newState.lv2 &&
          newState.lv2.map((item) =>
            item._id === _id ? { ...item, status: !curStatus } : item
          );
      }
      if (level === "lv3" && _id) {
        // Update lv3 status
        newState.lv3 =
          newState.lv3 &&
          newState.lv3.map(
            (item) =>
              item._id === _id
                ? { ...item, status: !curStatus } // Toggle the selected lv3 item
                : item // Keep the rest of the lv3 items unchanged
          );

        // Set all lv4 items with the same _idParent to the same status
        newState.lv4 =
          newState.lv4 &&
          newState.lv4.map((item) => {
            if (item._idParent === _id) {
              // Update the status of lv3 for this parent
              newState.lv3 =
                newState.lv3 &&
                newState.lv3.map((lv3Item) =>
                  lv3Item._id === _id
                    ? { ...lv3Item, status: !curStatus }
                    : lv3Item
                );
              return {
                ...item,
                child: item.child.map((child) => ({
                  ...child,
                  status: !curStatus, // Update status of each child
                })),
              };
            }
            return item; // Don't modify lv4 items with different _idParent
          });
      }
      if (level === "lv4" && _id) {
        newState.lv4 =
          newState.lv4 &&
          newState.lv4.map((item) => {
            const updatedChild = item.child.map((child) =>
              child._id === _id
                ? {
                    ...child,
                    status: !curStatus, // Toggle the status of the matched child
                  }
                : child
            );

            // Check if all lv4 child are checked
            const allChecked = updatedChild.every((child) => child.status);

            // If all lv4 child are checked, set the lv3 status to true
            if (allChecked) {
              newState.lv3 = newState.lv3.map((lv3Item) => {
                if (lv3Item._id === item._idParent) {
                  return { ...lv3Item, status: true }; // Check the parent lv3
                }
                return lv3Item;
              });
            }

            // If any lv4 child is unchecked, set the lv3 status to false
            if (!allChecked) {
              newState.lv3 = newState.lv3.map((lv3Item) => {
                if (lv3Item._id === item._idParent) {
                  return { ...lv3Item, status: false }; // Uncheck the parent lv3
                }
                return lv3Item;
              });
            }

            return { ...item, child: updatedChild };
          });
      }
      return newState;
    });
  };

  console.log("idDeleted: ", idDeleted);
  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full bg-white">
          <div className="m-2 h-full">
            <div className="bg-primary px-5 py-3 mb-2">
              <Button
                className="button-cancel px-5 py-3"
                style={{
                  backgroundColor: "white",
                  color: "#1e2753",
                  borderColor: "#1e2753",
                }}
                ghost
                onClick={() => navigate(`/admin/exams`)}
              >
                <FaChevronLeft />
                Back
              </Button>
            </div>
            <div className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2">
              <div className="left uppercase">
                <h2 className="font-size-20">Giới thiệu đề thi</h2>
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
            <div className="bg-primary">
              <div className="flex items-center justify-between border-line-bottom px-5 py-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer w-4 h-4 mr-2"
                    checked={
                      checkboxState && checkboxState.lv1
                        ? checkboxState.lv1
                        : false
                    }
                    onChange={() =>
                      handleCheckboxChange(
                        "lv1",
                        (checkboxState && checkboxState.lv1) || false
                      )
                    }
                  />
                  <Select
                    defaultValue="Thực hiện hàng loạt"
                    style={{ width: 180 }}
                  >
                    <Option value="value1">Xoá tất cả mô tả</Option>
                    <Option value="value2">Xoá tất cả overviews</Option>
                  </Select>
                </div>
              </div>
              {dataDesc && dataDesc.length > 0 ? (
                dataDesc.map((descs) => (
                  <div
                    key={descs._id}
                    className="border-[0.4px] border-line-bottom px-5 py-3"
                  >
                    <div className="flex justify-between border-line-bottom">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="cursor-pointer w-4 h-4 mr-2"
                          checked={
                            (checkboxState &&
                              checkboxState.lv2.find(
                                (item) => item._id === descs._id
                              )?.status) ||
                            false
                          }
                          onChange={() =>
                            handleCheckboxChange(
                              "lv2",
                              (checkboxState &&
                                checkboxState.lv2.find(
                                  (item) => item._id === descs._id
                                )?.status) ||
                                false,
                              descs._id
                            )
                          }
                        />
                        <div>
                          <h4 className="bg-secondary px-4 py-2 rounded-lg inline-block leading-[normal] font-size-16 text-white">
                            {descs?.desc}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-around bg-white min-w-[96px] mb-2 rounded-lg px-4">
                        <div className="flex justify-between items-center">
                          <input
                            type="checkbox"
                            className="cursor-pointer w-4 h-4 mr-2"
                            checked={
                              (checkboxState &&
                                checkboxState.lv3.find(
                                  (item) => item._id === descs._id
                                )?.status) ||
                              false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                "lv3",
                                (checkboxState &&
                                  checkboxState.lv3.find(
                                    (item) => item._id === descs._id
                                  )?.status) ||
                                  false,
                                descs._id
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      {descs.overviews &&
                        descs?.overviews.map((overview) => (
                          <div
                            key={overview._id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex">
                              <FaCheck className="primary-color-text mr-2 invisible" />
                              <p>{overview.desc}</p>
                            </div>
                            <div className="flex items-center justify-around min-w-[96px] mb-2 px-4">
                              <div className="flex justify-between items-center">
                                <input
                                  type="checkbox"
                                  className="cursor-pointer w-4 h-4 mr-2"
                                  checked={
                                    (checkboxState &&
                                      checkboxState.lv4
                                        .find(
                                          (item) => item._idParent === descs._id
                                        )
                                        ?.child.find(
                                          (child) => child._id === overview._id
                                        )?.status) ||
                                    false
                                  }
                                  onChange={() =>
                                    handleCheckboxChange(
                                      "lv4",
                                      (checkboxState &&
                                        checkboxState.lv4
                                          .find(
                                            (item) =>
                                              item._idParent === descs._id
                                          )
                                          ?.child.find(
                                            (child) =>
                                              child._id === overview._id
                                          )?.status) ||
                                        false,
                                      overview._id
                                    )
                                  }
                                />
                                <div className="relative group p-2 icon-dots invisible">
                                  <HiDotsVertical className="cursor-pointer" />
                                  <div
                                    className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10"
                                    style={{
                                      top: "100%",
                                      right: 0,
                                    }}
                                  >
                                    <div
                                      className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                      style={{ color: "red" }}
                                    >
                                      <FiTrash className="mr-2" />
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          minWidth: "32px",
                                        }}
                                      >
                                        Delete
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div>No data</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalCreate && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreate}
          onClose={() => setIsModalCreate(false)}
          structData={structData}
          onSave={createIntro}
          title="Tạo mới giới thiệu đề thi"
        />
      )}
      {isModalUpdate && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdate}
          onClose={() => setIsModalUpdate(false)}
          structData={structData}
          onSave={updateIntro}
          title="Cập nhât giới thiệu đề thi"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá?"
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={deleteFunc}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default IntroduceExam;
