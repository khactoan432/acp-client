import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// import ant
import { Button, Select } from "antd";

// import components
import SearchInput from "../../../components/input/SeachInput";
import MSInput from "../../../components/input/MsInput";
import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
import PopupNotification from "../../../components/popup/notify";
import Loading from "../../../components/loading";

//icon react
import { CiEdit } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { FaChevronLeft } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";

// import axios
import { postData, getData, deleteData, putData } from "../../../axios";

// interface
interface DataDesc {
  _id?: string;
  desc: string;
  id_material?: string;
  overviews: Overview[];
  type?: string;
  createdAt: string;
}
interface Overview {
  _id: string;
  desc: string;
  id_material: string;
  type: string;
  createdAt: string;
}
type CheckboxState = {
  lv1: boolean;
  lv2: { _id: string; status: boolean }[];
  lv3: { _idParent?: string; child: { _id?: string; status?: boolean }[] }[];
};
interface Deleted {
  describes: {
    _id: string;
    overviews: { _id: string }[];
  }[];
}
const { Option } = Select;
const IntroduceExam: React.FC = () => {
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
  // get height element
  const firstDivRef = useRef<HTMLDivElement>(null);
  const secondDivRef = useRef<HTMLDivElement>(null);
  const thirdDivRef = useRef<HTMLDivElement>(null);
  const [firstHeight, setFirstHeight] = useState<number>(0);
  const [secondHeight, setSecondHeight] = useState<number>(0);
  const [thirdHeight, setThirdHeight] = useState<number>(0);

  useEffect(() => {
    if (firstDivRef.current) {
      setFirstHeight(firstDivRef.current.offsetHeight);
    }
    if (secondDivRef.current) {
      setSecondHeight(secondDivRef.current.offsetHeight);
    }
    if (thirdDivRef.current) {
      setThirdHeight(thirdDivRef.current.offsetHeight);
    }
  }, []);
  const navigate = useNavigate();
  const { idExam } = useParams();
  // state string
  const [idUpdate, setIdUpdate] = useState<string>("");
  const [idDeleted, setIdDeleted] = useState<Deleted>();
  const [nameDeleted, setNameDeleted] = useState<string>("");

  //state boolean
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalUpdateOverview, setIsModalUpdateOverview] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isUpdateOverview, setIsUpdateOverview] = useState<
    Record<string, boolean>
  >({});
  //state array (store)
  const [dataDesc, setDataDesc] = useState<DataDesc[]>([]);
  const [dataIdDeleted, setDataIdDeleted] = useState<Deleted>({
    describes: [],
  });

  // state ref:
  const refValue = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);

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

  const [structDataOverview, setStructDataOverview] = useState([
    {
      name: "desc",
      placeholder: "Nhập mô tả",
      label: "Mô tả đề thi",
      value: "",
      type: "INPUT",
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

      for (const data of dataList) {
        const value = data.value;
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
          toast.error("Tạo mới overview sảy ra lỗi!");

          console.error(`Error saving describe/overview}`, error);
        }
      }
      toast.success("Tạo mới thành công mô tả đề thi");
    } catch (error) {
      toast.error("Tạo mới mô tả đề thi sảy ra lỗi!");
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
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
    setStructData(updatedStructData);
  };

  const updateIntro = async (data: any) => {
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

      for (const data of dataList) {
        const id = data._id || "";
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
          } catch (error) {
            toast.error("Cập nhật overview sảy ra lỗi!");
            console.error(`Error saving describe/overview}`, error);
          }
        } else if (!id && value) {
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
            toast.error("Tạo mới overview sảy ra lỗii!");
            console.error(`Error saving describe/overview}`, error);
          }
        } else if (id && !value) {
          try {
            const deleteRes = await deleteData(`/api/admin/overview/${id}`, {
              headers: { Authorization: `Bearer ${header}` },
            });
            toast.warning("Bạn vừa xoá overviews do không truyền dữ liệu");
          } catch (error) {
            toast.error("Xoá overview sảy ra lỗi!");
            console.error(`Error saving describe/overview}`, error);
          }
        }
      }
      toast.success("Cập nhật thành công mô tả đề thi");
    } catch (error) {
      toast.error("Cập nhật mô tả đề thi sảy ra lỗi!");
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  const handleEditOverview = (overview: any) => {
    setIsModalUpdateOverview(true);
    setIdUpdate(overview._id);

    const updatedStructData = structDataOverview.map((field) => {
      if (overview.hasOwnProperty(field.name)) {
        return {
          ...field,
          value: overview[field.name],
        };
      }
      return field;
    });
    setStructDataOverview(updatedStructData);
  };
  const updateOverview = async (data: any) => {
    setIsLoading(true);
    try {
      const desc = data.desc;
      const id = idUpdate;
      if (!desc || !id) {
        toast.warning("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      const res = await putData(
        `/api/admin/overview/${id}`,
        {
          desc,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      toast.success("Cập nhật thành công overview");
      setIsModalUpdateOverview(false);
    } catch (e) {
      console.error("Error deleting overview: ", e);
      toast.error("Error deleting overview: ");
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIsUpdateOverview({});
      setIdUpdate("");
    }
  };

  // hanle delete

  const deleteFunc = () => {
    if (nameDeleted === "overviews") {
      deleteOverview();
    } else if (nameDeleted === "describes") {
      deleteIntro();
    }
  };

  const notifyDelete = (name: string, id: any) => {
    const id_deleted = id;
    const nameDeleted = name;
    setNameDeleted(nameDeleted);
    setIdDeleted(id_deleted);
    setIsModalVisible(true);
  };
  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdDeleted(undefined);
  };

  const deleteIntro = async () => {
    setIsLoading(true);
    const id_Deleted = idDeleted && idDeleted.describes;
    if (!id_Deleted) {
      console.error("idDeleted is undefined");
      return;
    }
    try {
      if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
        for (const id of id_Deleted) {
          if (id._id) {
            const deleteRes = await deleteData(
              `/api/admin/describe/${id._id}`,
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
          } else if (typeof id === "string") {
            const deleteRes = await deleteData(`/api/admin/describe/${id}`, {
              headers: { Authorization: `Bearer ${header}` },
            });
          } else {
            toast.warning("Xảy ra lỗi khi xoá mô tả!");
          }
        }
        toast.success("Xoá các mô tả thành công!");
      } else {
        toast.warning("Xảy ra lỗi khi xoá mô tả!");
      }
    } catch (err) {
      toast.error("Xoá mô tả không thành công, " + err.message);

      console.error(`Error deleting describe`, err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIsModalVisible(false);
      setIdDeleted(undefined);
      setDataIdDeleted({ describes: [] });
    }
  };

  const deleteOverview = async () => {
    const id_Deleted = idDeleted && idDeleted.describes;
    console.log("delete here: ", id_Deleted);
    if (!id_Deleted) {
      console.error("idDeleted is undefined");
      return;
    }

    setIsLoading(true);
    try {
      if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
        for (const arrDelete of id_Deleted) {
          for (const id of arrDelete.overviews) {
            const deleteRes = await deleteData(
              `/api/admin/overview/${id._id}`,
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
          }
        }
        toast.success("Xoá các overviews thành công!");
      } else {
        toast.warning("Xảy ra lỗi khi xoá overviews!");
      }
    } catch (error) {
      toast.error("Xoá mô tả không thành công, " + error.message);
      console.error(`Error deleting overview`, error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      setIsFetchData(!isFetchData);
      setIdDeleted(undefined);
      setDataIdDeleted({ describes: [] });
    }
  };

  // hành động hàng loạt
  const handleSelectActionMany = (value: string) => {
    if (value === "describes") {
      const arrId = dataIdDeleted;
      notifyDelete("describes", arrId);
    } else {
      const arrId = dataIdDeleted;
      notifyDelete("overviews", arrId);
    }
  };

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
    level: "lv1" | "lv2" | "lv3",
    curStatus: boolean,
    _id?: string
  ) => {
    setCheckboxState((prev) => {
      const newState = { ...prev };
      if (level === "lv1") {
        const allIdDelete = { ...dataIdDeleted };
        allIdDelete.describes = [];

        // Duyệt qua dataDesc để lấy _id của từng describe và overview
        dataDesc.forEach((descs: any) => {
          if (!curStatus) {
            // checked
            const itemDesc = {
              _id: descs._id,
              overviews: descs.overviews.map((item) => ({ _id: item._id })),
            };
            allIdDelete.describes.push(itemDesc);
          } else {
            // unchecked
            allIdDelete.describes = [];
          }
        });

        // Cập nhật lại state dataIdDeleted
        setDataIdDeleted(allIdDelete);

        // Set lv1 to true
        newState.lv1 = !curStatus;

        // Set all lv2 to true
        newState.lv2 =
          newState.lv2 &&
          newState.lv2.map((item) => ({
            ...item,
            status: !curStatus,
          }));

        // Set all lv3 child status to true
        newState.lv3 =
          newState.lv3 &&
          newState.lv3.map((item) => ({
            ...item,
            child: item.child.map((child) => ({
              ...child,
              status: !curStatus,
            })),
          }));
      }
      if (level === "lv2" && _id) {
        const allIdDelete = { ...dataIdDeleted };

        if (!curStatus) {
          // checked
          const itemDesc = dataDesc.find((desc) => desc._id === _id);

          if (itemDesc && itemDesc.overviews) {
            const exitDesc = allIdDelete.describes.find(
              (item) => item._id === _id
            );
            if (!exitDesc) {
              const newItemDesc = {
                _id: _id,
                overviews: itemDesc.overviews.map((item) => ({
                  _id: item._id,
                })),
              };
              allIdDelete.describes.push(newItemDesc);
            } else {
              const itemOverviews = dataDesc.find(
                (item) => item._id === _id
              )?.overviews;

              if (itemOverviews) {
                const targetDesc = allIdDelete.describes.find(
                  (item) => item._id === _id
                );
                const arrID = itemOverviews.map((item) => ({ _id: item._id }));
                if (targetDesc) {
                  targetDesc.overviews = arrID;
                }
              }
            }
          }
        } else {
          // unchecked
          allIdDelete.describes = allIdDelete.describes.filter(
            (item) => item._id !== _id
          );
        }

        // Cập nhật lại dataIdDeleted
        setDataIdDeleted(allIdDelete);

        // Update only the selected lv2 item
        newState.lv2 =
          newState.lv2 &&
          newState.lv2.map((item) =>
            item._id === _id ? { ...item, status: !curStatus } : item
          );

        newState.lv3 =
          newState.lv3 &&
          newState.lv3.map((item) => {
            if (item._idParent === _id) {
              // Update the status of lv3 for this parent
              newState.lv2 =
                newState.lv2 &&
                newState.lv2.map((lv3Item) =>
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
            return item; // Don't modify lv3 items with different _idParent
          });
      }
      if (level === "lv3" && _id) {
        const allIdDelete = { ...dataIdDeleted };
        const foundDesc = dataDesc.find(
          (desc) =>
            desc.overviews &&
            desc.overviews.some((overview) => overview._id === _id)
        );
        if (!curStatus) {
          // checked
          // find _id of describe with _id overviews

          const _idDesc = foundDesc ? foundDesc._id : undefined;
          if (foundDesc && foundDesc.overviews) {
            const itemDesc = {
              _id: _idDesc,
              overviews: [],
            };
            if (!allIdDelete.describes.find((item) => item._id === _idDesc)) {
              allIdDelete.describes.push(itemDesc);

              const targetDesc = allIdDelete.describes.find(
                (item) => item._id === _idDesc
              );
              if (targetDesc) {
                targetDesc.overviews.push({ _id });
              }
            } else {
              const targetDesc = allIdDelete.describes.find(
                (item) => item._id === _idDesc
              );
              if (targetDesc) {
                targetDesc.overviews.push({ _id });
              }
            }
          }
        } else {
          // unchecked

          if (foundDesc) {
            const targetDesc = allIdDelete.describes.find(
              (item) => item._id === foundDesc._id
            );

            if (targetDesc) {
              // Lọc bỏ phần tử trong overviews có _id === _id
              targetDesc.overviews = targetDesc.overviews.filter(
                (overview) => overview._id !== _id
              );

              // Gán lại describes với đối tượng đã được cập nhật
              allIdDelete.describes = allIdDelete.describes.map((item) =>
                item._id === foundDesc._id ? targetDesc : item
              );
            }
          }
        }
        // Cập nhật lại state dataIdDeleted
        setDataIdDeleted(allIdDelete);

        newState.lv3 =
          newState.lv3 &&
          newState.lv3.map((item) => {
            const updatedChild = item.child.map((child) =>
              child._id === _id
                ? {
                    ...child,
                    status: !curStatus, // Toggle the status of the matched child
                  }
                : child
            );

            // Check if all lv3 child are checked
            const allChecked = updatedChild.every((child) => child.status);

            // If any lv3 child is unchecked, set the lv3 status to false
            if (!allChecked) {
              newState.lv2 =
                newState.lv2 &&
                newState.lv2.map((lv3Item) => {
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

  const toggleUpdateOverview = (id: string) => {
    setIsUpdateOverview((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // hanle search

  const [filteredData, setFilteredData] = useState<DataDesc[]>([]);
  useEffect(() => {
    setFilteredData(dataDesc);
  }, [dataDesc]);

  const handleSearch = (e) => {
    const term = e.target.value;

    // Gọi hàm search
    const results = SearchInput(dataDesc, term, ["desc", "overviews.desc"]);
    setFilteredData(results);
  };

  // filter
  const [isAZDesc, setIsAZDesc] = useState(true);
  const [isAZOverviews, setIsAZOverviews] = useState(true);
  const [isTimeDesc, setIsTimeDesc] = useState(true);
  const [isTimeOverviews, setIsTimeOverviews] = useState(true);

  const handleSort = (order: string) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (order === "asc_descs") {
        setIsAZDesc(false);
        return a.desc.localeCompare(b.desc);
      } else if (order === "desc_descs") {
        setIsAZDesc(true);

        return b.desc.localeCompare(a.desc);
      } else if (order === "asc_overviews") {
        setIsAZOverviews(false);
        const minOverviewA = a.overviews.length
          ? Math.min(...a.overviews.map((ov) => ov.desc.localeCompare("")))
          : Infinity;
        const minOverviewB = b.overviews.length
          ? Math.min(...b.overviews.map((ov) => ov.desc.localeCompare("")))
          : Infinity;
        return minOverviewA - minOverviewB;
      } else if (order === "desc_overviews") {
        setIsAZOverviews(true);

        const maxOverviewA = a.overviews.length
          ? Math.max(...a.overviews.map((ov) => ov.desc.localeCompare("")))
          : -Infinity;
        const maxOverviewB = b.overviews.length
          ? Math.max(...b.overviews.map((ov) => ov.desc.localeCompare("")))
          : -Infinity;
        return maxOverviewB - maxOverviewA;
      } else if (order === "asc_timedescribe") {
        setIsTimeDesc(false);
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (order === "desc_timedescribe") {
        setIsTimeDesc(true);
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (order === "asc_timeoverviews") {
        setIsTimeOverviews(false);
        const minTimeA = Math.min(
          ...a.overviews.map((ov) => new Date(ov.createdAt).getTime())
        );
        const minTimeB = Math.min(
          ...b.overviews.map((ov) => new Date(ov.createdAt).getTime())
        );
        return minTimeA - minTimeB;
      } else if (order === "desc_timeoverviews") {
        setIsTimeOverviews(true);
        const maxTimeA = Math.max(
          ...a.overviews.map((ov) => new Date(ov.createdAt).getTime())
        );
        const maxTimeB = Math.max(
          ...b.overviews.map((ov) => new Date(ov.createdAt).getTime())
        );
        return maxTimeB - maxTimeA;
      }
      return 0;
    });

    setFilteredData(sortedData);
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
            <div ref={firstDivRef} className="bg-primary px-5 py-3 mb-2">
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
            <div
              ref={secondDivRef}
              className="header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2"
            >
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
            <div
              className="bg-primary"
              style={{
                height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 32px)`,
              }}
            >
              <div
                ref={thirdDivRef}
                className="batch_execution flex items-center justify-between border-line-bottom px-5 py-3"
              >
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
                    onChange={handleSelectActionMany}
                  >
                    {checkboxState &&
                      checkboxState.lv2.some(
                        (item) => item.status === true
                      ) && <Option value="describes">Xoá tất cả mô tả</Option>}
                    {checkboxState &&
                      checkboxState.lv3.some((item) =>
                        item.child?.some(
                          (childItem) => childItem.status === true
                        )
                      ) && (
                        <Option value="overviews">Xoá tất cả overviews</Option>
                      )}
                  </Select>
                </div>
                {/* bộ lọc và tìm kiếm */}
                <div className="flex items-center gap-2">
                  <MSInput
                    ref={refValue}
                    placeholder="Tìm kiếm..."
                    type="text"
                    leftIcon={HiOutlineSearch}
                    onChangeInput={handleSearch}
                  />
                  {/* bộ lọc filter */}
                  <Select
                    defaultValue="Lọc tìm kiếm"
                    onChange={handleSort}
                    style={{ width: 200 }}
                  >
                    {isAZDesc ? (
                      <Option value="asc_descs">A-Z (D)</Option>
                    ) : (
                      <Option value="desc_descs">Z-A (D)</Option>
                    )}
                    {isAZOverviews ? (
                      <Option value="asc_overviews">A-Z (O)</Option>
                    ) : (
                      <Option value="desc_overviews">Z-A (O)</Option>
                    )}
                    {isTimeDesc ? (
                      <Option value="asc_timedescribe">sớm(D)</Option>
                    ) : (
                      <Option value="desc_timedescribe">muộn((D))</Option>
                    )}
                    {isTimeOverviews ? (
                      <Option value="asc_timeoverviews">sớm(O)</Option>
                    ) : (
                      <Option value="desc_timeoverviews">muộn((O))</Option>
                    )}
                  </Select>
                </div>
              </div>
              <div
                style={{
                  height: `calc(100% - ${thirdHeight}px)`,
                }}
                className="overflow-y-auto"
              >
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((descs) => (
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
                        <div className="flex items-center justify-around min-w-[32px] mb-2 rounded-lg px-4">
                          <div className="flex justify-between items-center rounded-full bg-[#e1e1e1]">
                            <div className="relative group p-2 icon-dots">
                              <HiDotsVertical className="cursor-pointer" />
                              <div
                                className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10"
                                style={{
                                  top: "36px",
                                  right: "-20px",
                                }}
                              >
                                <div
                                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                  onClick={() => handleEditIntroduce(descs)}
                                >
                                  <CiEdit className="mr-2 color-edit" />
                                  <span
                                    className="text-color-primary "
                                    style={{
                                      fontSize: "12px",
                                      minWidth: "100px",
                                    }}
                                  >
                                    Sửa giới thiệu
                                  </span>
                                </div>
                                <div
                                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                  onClick={() =>
                                    toggleUpdateOverview(descs._id)
                                  }
                                >
                                  <CiEdit className="mr-2 color-edit" />
                                  <span
                                    className="text-color-primary "
                                    style={{
                                      fontSize: "12px",
                                      minWidth: "100px",
                                    }}
                                  >
                                    {isUpdateOverview[descs._id]
                                      ? "Huỷ sửa overview"
                                      : "Sửa overviews"}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                  onClick={() =>
                                    notifyDelete("describes", {
                                      describes: [descs._id],
                                    })
                                  }
                                >
                                  <FiTrash2
                                    className="mr-2"
                                    style={{ color: "red" }}
                                  />
                                  <span
                                    className="text-color-primary "
                                    style={{
                                      fontSize: "12px",
                                      minWidth: "100px",
                                    }}
                                  >
                                    Xoá giới thiệu
                                  </span>
                                </div>
                                {dataIdDeleted?.describes?.find(
                                  (item) => item._id === descs._id
                                )?.overviews?.length > 0 && (
                                  <div
                                    className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                    onClick={() =>
                                      notifyDelete("overviews", {
                                        describes: [
                                          dataIdDeleted.describes.find(
                                            (item) => item._id === descs._id
                                          ),
                                        ],
                                      })
                                    }
                                  >
                                    <FiTrash2
                                      className="mr-2"
                                      style={{ color: "red" }}
                                    />
                                    <span
                                      className="text-color-primary "
                                      style={{
                                        fontSize: "12px",
                                        minWidth: "100px",
                                      }}
                                    >
                                      Xoá mô tả đã chọn
                                    </span>
                                  </div>
                                )}
                              </div>
                              <style jsx="true">{`
                                .group:hover::before {
                                  content: "";
                                  position: absolute;
                                  top: 32px;
                                  right: 0px;
                                  width: 96px;
                                  height: 20px;
                                  transform: translateY(-50%);
                                  z-index: 0;
                                }
                              `}</style>
                            </div>
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
                              <div className="flex mb-2">
                                {isUpdateOverview[descs._id] ? (
                                  <CiEdit
                                    style={{
                                      fontSize: "16px",
                                      width: "16px",
                                      height: "16px",
                                      flexShrink: 0,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEditOverview(overview)}
                                    className="color-edit mt-1 mr-2 shake-animation"
                                  />
                                ) : (
                                  <IoMdCheckmarkCircleOutline
                                    style={{
                                      fontSize: "16px",
                                      width: "16px",
                                      height: "16px",
                                      flexShrink: 0,
                                    }}
                                    className="text-color-secondary mt-1 mr-2"
                                  />
                                )}
                                <p>{overview.desc}</p>
                              </div>
                              <div className="flex flex-shrink-0 items-center justify-around min-w-[32px] mb-2 px-4">
                                <div className="flex justify-between items-center">
                                  <input
                                    type="checkbox"
                                    className="cursor-pointer w-4 h-4 mr-2"
                                    checked={
                                      (checkboxState &&
                                        checkboxState.lv3
                                          .find(
                                            (item) =>
                                              item._idParent === descs._id
                                          )
                                          ?.child.find(
                                            (child) =>
                                              child._id === overview._id
                                          )?.status) ||
                                      false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        "lv3",
                                        (checkboxState &&
                                          checkboxState.lv3
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
      {isModalUpdateOverview && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateOverview}
          onClose={() => setIsModalUpdateOverview(false)}
          structData={structDataOverview}
          onSave={updateOverview}
          title="Cập nhật overview đề thi"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá giới thiệu của đề thi này?"
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
