import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// import ant
import { Button, Select } from "antd";

// import components
import AdminHeader from "../../../components/layout/Admin/Header";
import Nav from "../../../components/layout/Admin/Nav";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
import SearchInput from "../../../components/input/SeachInput";
import MSInput from "../../../components/input/MsInput";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
import { TypeInput } from "../../../constants/TypeEnum";

// import icon react
import { CiEdit } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { FaChevronLeft } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { IoMdLink } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";
import { MdMenuBook } from "react-icons/md";

// import axios
import { postData, getData, deleteData, putData } from "../../../axios";
// interface
interface Lesson {
  exercises: Exercise[];
  id_topic?: string;
  name: string;
  status?: string;
  video?: File[];
  _id?: string;
  createdAt: string;
}
type CheckboxState = {
  lv1: boolean;
  lv2: { _id: string; status: boolean }[];
  lv3: { _idParent?: string; child: { _id?: string; status?: boolean }[] }[];
};
interface Deleted {
  lessons: {
    _id: string;
    exercises: { _id: string }[];
  }[];
}
interface Exercise {
  id_lesson?: string;
  link: string;
  name: string;
  _id: string;
  createdAt: string;
}
const { Option } = Select;
const Content: React.FC = () => {
  const navigate = useNavigate();
  const { idTopic } = useParams();
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
  // state string
  const [idUpdate, setIdUpdate] = useState<string>("");
  const [idDeleted, setIdDeleted] = useState<Deleted>();
  const [nameDeleted, setNameDeleted] = useState<string>("");
  // state boolean
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalUpdateExercise, setIsModalUpdateExercise] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isUpdateExercise, setIsUpdateExercise] = useState<
    Record<string, boolean>
  >({});
  //state array (store)
  const [dataLesson, setDataLesson] = useState<Lesson[]>([]);
  const [dataIdDeleted, setDataIdDeleted] = useState<Deleted>({
    lessons: [],
  });
  // state ref:
  const refValue = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);

  // structure
  const structData = [
    {
      name: "name",
      placeholder: "Nhập tên bài học",
      label: "Tên bài học",
      value: "",
      type: TypeInput.INPUT,
    },
    {
      name: "video",
      label: "Video",
      type: TypeInput.VIDEO,
      value: [],
    },
    {
      name: "exercise",
      placeholder: "Nhập tên bài tập",
      label: "Tên bài tập",
      value: "",
      type: TypeInput.INPUT,
    },
    {
      name: "link",
      placeholder: "Nhập đường dẫn bài tập",
      label: "Đường dẫn bài tập",
      value: "",
      type: TypeInput.INPUT,
    },
  ];

  const [structUpdateLesson, setStructUpdateLesson] = useState([
    {
      name: "name",
      placeholder: "Nhập tên bài học",
      label: "Tên bài học",
      value: "",
      type: TypeInput.INPUT,
    },
    {
      name: "video",
      label: "Video",
      type: TypeInput.VIDEO,
      value: [],
    },
  ]);

  const [structDataExercise, setStructDataExercise] = useState([
    {
      name: "name",
      placeholder: "Nhập tên bài tập",
      label: "Tên bài tập",
      value: "",
      type: TypeInput.INPUT,
    },
    {
      name: "link",
      placeholder: "Nhập đường dẫn đề thi",
      label: "Đường dẫn đề thi",
      value: "",
      type: TypeInput.INPUT,
    },
  ]);

  //   get data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData(`/api/admin/lessons/${idTopic}`, {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        console.log("res: ", res);
        setDataLesson(res.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isFetchData]);

  // func handle checkbox
  // struct checkbox
  const [checkboxState, setCheckboxState] = useState<CheckboxState>();
  useEffect(() => {
    if (dataLesson && dataLesson.length > 0) {
      setCheckboxState({
        lv1: false,
        lv2: dataLesson.map((item) => ({
          _id: item._id || "",
          status: false,
        })),
        lv3: dataLesson.map((item) => ({
          _idParent: item._id || "",
          child:
            item.exercises?.map((it) => ({
              _id: it._id || "",
              status: false,
            })) || [],
        })),
      });
    }
  }, [dataLesson]);
  //handle save
  const createLesson = async (data: any) => {
    console.log("data: ", data);
    const { name, link, exercise, video } = data;
    const dataExercise = [{ link: link, name: exercise }];
    setIsLoading(true);
    try {
      const formData = new FormData();
      video.forEach((file) => formData.append("fileVideo", file));
      formData.append("name", name);
      formData.append("status", "PRIVATE");

      const resLesson = await postData(
        `/api/admin/lesson/${idTopic}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${header}`,
          },
        }
      );
      const id_lesson = resLesson.data._id;
      try {
        await postData(
          `/api/admin/exercise/${id_lesson}`,
          {
            dataExercise,
          },
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
      } catch (error) {
        toast.error("Tạo mới bài tập!");
        console.error(`Error saving describe/overview}`, error);
      }

      toast.success("Tạo mới bài học thành công.");
    } catch (error) {
      toast.error("Tạo mới bài học sảy ra lỗi!");
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };
  // handle edit
  const handleEditLesson = async (lesson: any) => {
    setIsModalUpdate(true);
    setIdUpdate(lesson._id);

    const updatedStructData = structUpdateLesson.map((field) => {
      if (lesson.hasOwnProperty(field.name)) {
        return {
          ...field,
          value: lesson[field.name],
        };
      }
      return field;
    });
    setStructUpdateLesson(updatedStructData);
  };

  const updateLesson = async (data: any) => {
    const idIntro = idUpdate;
    const { name, video } = data;
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (video !== data.old_video.value) {
        video.forEach((file) => formData.append("fileVideo", file));
      } else {
        formData.append("video", video);
      }
      formData.append("name", name);
      await putData(`/api/admin/lesson/${idIntro}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Cập nhật bài học thành công.");
    } catch (error) {
      toast.error("Cập nhật bài học sảy ra lỗi!");
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdUpdate("");
    }
  };

  const handleEditExercise = (exercise: any) => {
    setIsModalUpdateExercise(true);
    setIdUpdate(exercise._id);

    const updatedStructData = structDataExercise.map((field) => {
      if (exercise.hasOwnProperty(field.name)) {
        return {
          ...field,
          value: exercise[field.name],
        };
      }
      return field;
    });
    setStructDataExercise(updatedStructData);
  };
  const updateExercise = async (data: any) => {
    const { name, link } = data;
    const id = idUpdate;
    setIsLoading(true);
    try {
      console.log("id: ", id);
      await putData(
        `/api/admin/exercise/${id}`,
        {
          name,
          link,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      toast.success("Cập nhậ bài tập thành công.");
      setIsModalUpdateExercise(false);
    } catch (e) {
      toast.error("Cập nhật đề thi thất bại", e.message);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIsUpdateExercise({});
      setIdUpdate("");
    }
  };
  // handle delete
  const deleteLesson = async () => {
    setIsLoading(true);
    const id_Deleted = idDeleted && idDeleted.lessons;
    if (!id_Deleted) {
      console.error("idDeleted is undefined");
      return;
    }
    try {
      if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
        for (const id of id_Deleted) {
          if (id._id) {
            await deleteData(`/api/admin/lesson/${id._id}`, {
              headers: { Authorization: `Bearer ${header}` },
            });
          } else if (typeof id === "string") {
            await deleteData(`/api/admin/lesson/${id}`, {
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
      toast.error("Xoá mô tả không thành công, ", err.message);

      console.error(`Error deleting describe`, err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIsModalVisible(false);
      setIdDeleted(undefined);
      setDataIdDeleted({ lessons: [] });
    }
  };

  const deleteExercise = async () => {
    const id_Deleted = idDeleted && idDeleted.lessons;
    console.log("delete here: ", id_Deleted);
    if (!id_Deleted) {
      console.error("idDeleted is undefined");
      return;
    }

    setIsLoading(true);
    try {
      if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
        for (const arrDelete of id_Deleted) {
          for (const id of arrDelete.exercises) {
            await deleteData(`/api/admin/overview/${id._id}`, {
              headers: { Authorization: `Bearer ${header}` },
            });
          }
        }
        toast.success("Xoá các exercises thành công!");
      } else {
        toast.warning("Xảy ra lỗi khi xoá exercises!");
      }
    } catch (error) {
      toast.error("Xoá mô tả không thành công, " + error.message);
      console.error(`Error deleting overview`, error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      setIsFetchData(!isFetchData);
      setIdDeleted(undefined);
      setDataIdDeleted({ lessons: [] });
    }
  };
  const deleteFunc = () => {
    if (nameDeleted === "exercises") {
      deleteExercise();
    } else if (nameDeleted === "lessons") {
      deleteLesson();
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
  // hành động hàng loạt
  const handleSelectActionMany = (value: string) => {
    if (value === "lessons") {
      const arrId = dataIdDeleted;
      notifyDelete("lessons", arrId);
    } else {
      const arrId = dataIdDeleted;
      notifyDelete("exercises", arrId);
    }
  };

  const handleCheckboxChange = (
    level: "lv1" | "lv2" | "lv3",
    curStatus: boolean,
    _id?: string
  ) => {
    setCheckboxState((prev) => {
      const newState = { ...prev };
      if (level === "lv1") {
        const allIdDelete = { ...dataIdDeleted };
        allIdDelete.lessons = [];

        // Duyệt qua dataLesson để lấy _id của từng describe và overview
        dataLesson.forEach((lesson: any) => {
          if (!curStatus) {
            // checked
            const itemDesc = {
              _id: lesson._id,
              exercises: lesson.exercises.map((item) => ({ _id: item._id })),
            };
            allIdDelete.lessons.push(itemDesc);
          } else {
            // unchecked
            allIdDelete.lessons = [];
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
          const itemDesc = dataLesson.find((desc) => desc._id === _id);

          if (itemDesc && itemDesc.exercises) {
            const exitDesc = allIdDelete.lessons.find(
              (item) => item._id === _id
            );
            if (!exitDesc) {
              const newItemDesc = {
                _id: _id,
                exercises: itemDesc.exercises.map((item) => ({
                  _id: item._id,
                })),
              };
              allIdDelete.lessons.push(newItemDesc);
            } else {
              const itemOverviews = dataLesson.find(
                (item) => item._id === _id
              )?.exercises;

              if (itemOverviews) {
                const targetDesc = allIdDelete.lessons.find(
                  (item) => item._id === _id
                );
                const arrID = itemOverviews.map((item) => ({ _id: item._id }));
                if (targetDesc) {
                  targetDesc.exercises = arrID;
                }
              }
            }
          }
        } else {
          // unchecked
          allIdDelete.lessons = allIdDelete.lessons.filter(
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
        const foundDesc = dataLesson.find(
          (desc) =>
            desc.exercises &&
            desc.exercises.some((overview) => overview._id === _id)
        );
        if (!curStatus) {
          // checked
          // find _id of describe with _id exercises

          const _idDesc = foundDesc ? foundDesc._id : undefined;
          if (foundDesc && foundDesc.exercises) {
            const itemDesc = {
              _id: _idDesc,
              exercises: [],
            };
            if (!allIdDelete.lessons.find((item) => item._id === _idDesc)) {
              allIdDelete.lessons.push(itemDesc);

              const targetDesc = allIdDelete.lessons.find(
                (item) => item._id === _idDesc
              );
              if (targetDesc) {
                targetDesc.exercises.push({ _id });
              }
            } else {
              const targetDesc = allIdDelete.lessons.find(
                (item) => item._id === _idDesc
              );
              if (targetDesc) {
                targetDesc.exercises.push({ _id });
              }
            }
          }
        } else {
          // unchecked

          if (foundDesc) {
            const targetDesc = allIdDelete.lessons.find(
              (item) => item._id === foundDesc._id
            );

            if (targetDesc) {
              // Lọc bỏ phần tử trong exercises có _id === _id
              targetDesc.exercises = targetDesc.exercises.filter(
                (exercise) => exercise._id !== _id
              );

              // Gán lại lessons với đối tượng đã được cập nhật
              allIdDelete.lessons = allIdDelete.lessons.map((item) =>
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

  const toggleUpdateExercise = (id: string) => {
    setIsUpdateExercise((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  // hanle search

  const [filteredData, setFilteredData] = useState<Lesson[]>([]);
  useEffect(() => {
    setFilteredData(dataLesson);
  }, [dataLesson]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;

    // Gọi hàm search
    const results = SearchInput(dataLesson, term, [
      "name",
      "exercises.link",
      "exercises.name",
    ]);
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
        return a.name.localeCompare(b.name);
      } else if (order === "desc_descs") {
        setIsAZDesc(true);

        return b.name.localeCompare(a.name);
      } else if (order === "asc_overviews") {
        setIsAZOverviews(false);
        const minOverviewA = a.exercises.length
          ? Math.min(...a.exercises.map((ov) => ov.name.localeCompare("")))
          : Infinity;
        const minOverviewB = b.exercises.length
          ? Math.min(...b.exercises.map((ov) => ov.name.localeCompare("")))
          : Infinity;
        return minOverviewA - minOverviewB;
      } else if (order === "desc_overviews") {
        setIsAZOverviews(true);

        const maxOverviewA = a.exercises.length
          ? Math.max(...a.exercises.map((ov) => ov.name.localeCompare("")))
          : -Infinity;
        const maxOverviewB = b.exercises.length
          ? Math.max(...b.exercises.map((ov) => ov.name.localeCompare("")))
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
          ...a.exercises.map((ov) => new Date(ov.createdAt).getTime())
        );
        const minTimeB = Math.min(
          ...b.exercises.map((ov) => new Date(ov.createdAt).getTime())
        );
        return minTimeA - minTimeB;
      } else if (order === "desc_timeoverviews") {
        setIsTimeOverviews(true);
        const maxTimeA = Math.max(
          ...a.exercises.map((ov) => new Date(ov.createdAt).getTime())
        );
        const maxTimeB = Math.max(
          ...b.exercises.map((ov) => new Date(ov.createdAt).getTime())
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
                onClick={() => navigate(`/admin/courses`)}
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
                <h2 className="font-size-20">Các bài học của chương 1</h2>
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
                      ) && <Option value="lessons">Xoá tất cả mô tả</Option>}
                    {checkboxState &&
                      checkboxState.lv3.some((item) =>
                        item.child?.some(
                          (childItem) => childItem.status === true
                        )
                      ) && (
                        <Option value="exercises">Xoá tất cả exercises</Option>
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
                  filteredData.map((lesson) => (
                    <div
                      key={lesson._id}
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
                                  (item) => item._id === lesson._id
                                )?.status) ||
                              false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                "lv2",
                                (checkboxState &&
                                  checkboxState.lv2.find(
                                    (item) => item._id === lesson._id
                                  )?.status) ||
                                  false,
                                lesson._id
                              )
                            }
                          />
                          <div>
                            <h4 className="bg-secondary px-4 py-2 rounded-lg inline-block leading-[normal] font-size-16 text-white">
                              {lesson?.name}
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
                                  onClick={() => handleEditLesson(lesson)}
                                >
                                  <CiEdit className="mr-2 color-edit" />
                                  <span
                                    className="text-color-primary "
                                    style={{
                                      fontSize: "12px",
                                      minWidth: "100px",
                                    }}
                                  >
                                    Sửa bài học
                                  </span>
                                </div>
                                <div
                                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                  onClick={() =>
                                    toggleUpdateExercise(
                                      lesson._id || "undefined"
                                    )
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
                                    {isUpdateExercise[lesson._id || "undefined"]
                                      ? "Huỷ sửa bài tập"
                                      : "Sửa bài tập"}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                  onClick={() =>
                                    notifyDelete("lessons", {
                                      lessons: [lesson._id],
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
                                    Xoá bài học
                                  </span>
                                </div>
                                {/* {dataIdDeleted?.lessons?.find(
                                  (item) => item._id === lesson._id
                                )?.exercises?.length > 0 && (
                                  <div
                                    className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                    onClick={() =>
                                      notifyDelete("exercises", {
                                        lessons: [
                                          dataIdDeleted.lessons.find(
                                            (item) => item._id === lesson._id
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
                                      Xoá bài tập đã chọn
                                    </span>
                                  </div>
                                )} */}
                              </div>
                              <style>{`
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
                        {lesson.exercises &&
                          lesson?.exercises.map((exercise) => (
                            <div
                              key={exercise._id}
                              className="flex items-center justify-between"
                            >
                              <div className="mb-2">
                                <div className="">
                                  <video
                                    src={String(lesson.video)}
                                    controls
                                    style={{
                                      width: "800px",
                                      height: "400px",
                                      marginRight: "8px",
                                    }}
                                  />
                                </div>
                                <div className="flex">
                                  {isUpdateExercise[
                                    lesson._id || "undefined"
                                  ] ? (
                                    <CiEdit
                                      style={{
                                        fontSize: "16px",
                                        width: "16px",
                                        height: "16px",
                                        flexShrink: 0,
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleEditExercise(exercise)
                                      }
                                      className="color-edit mt-1 mr-2 shake-animation"
                                    />
                                  ) : (
                                    <MdMenuBook
                                      style={{
                                        fontSize: "16px",
                                        width: "16px",
                                        height: "16px",
                                        flexShrink: 0,
                                      }}
                                      className="text-color-secondary mt-1 mr-2"
                                    />
                                  )}
                                  <div>
                                    <p>{exercise.name}</p>
                                    <div className="flex items-center text-color-secondary hover-primary">
                                      <IoMdLink className="mr-2" />
                                      <span className="">{exercise.link}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="flex flex-shrink-0 items-center justify-around min-w-[32px] mb-2 px-4">
                                <div className="flex justify-between items-center">
                                  <input
                                    type="checkbox"
                                    className="cursor-pointer w-4 h-4 mr-2"
                                    checked={
                                      (checkboxState &&
                                        checkboxState.lv3
                                          .find(
                                            (item) =>
                                              item._idParent === lesson._id
                                          )
                                          ?.child.find(
                                            (child) =>
                                              child._id === exercise._id
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
                                                item._idParent === lesson._id
                                            )
                                            ?.child.find(
                                              (child) =>
                                                child._id === exercise._id
                                            )?.status) ||
                                          false,
                                        exercise._id
                                      )
                                    }
                                  />
                                </div>
                              </div> */}
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
          onSave={createLesson}
          title="Tạo mới bài học"
        />
      )}
      {isModalUpdate && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdate}
          onClose={() => setIsModalUpdate(false)}
          structData={structUpdateLesson}
          onSave={updateLesson}
          title="Cập nhật bài học"
        />
      )}
      {isModalUpdateExercise && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateExercise}
          onClose={() => setIsModalUpdateExercise(false)}
          structData={structDataExercise}
          onSave={updateExercise}
          title="Cập nhật bài tập"
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

export default Content;
