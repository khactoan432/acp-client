import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button } from "antd";
// import components
import AdminHeader from "../../../components/layout/Admin/Header";
import Nav from "../../../components/layout/Admin/Nav";
import Table from "../../../components/table";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
// import helps fun
import { getSignedUrlAndUpload } from "../../../helpers/reqSignedUrlAndUpload";
// import icon react
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";
// import axios
import { postData, getData, deleteData, putData } from "../../../axios";

interface VideoExam {
  _id?: string;
  describe?: string;
  video?: File[];
}

const ExamVideo: React.FC = () => {
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

  const navigate = useNavigate();
  const { idExam } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCreateVideoExam, setIsModalCreateVideoExam] = useState(false);
  const [isModalUpdateVideoExam, setIsModalUpdateVideoExam] = useState(false);

  //string
  const [idVideo, setIdVideo] = useState<string>("");

  const [data, setData] = useState<VideoExam[]>([]);
  const [selectedContent, setSelectedContent] = useState(null);

  // Thêm state cho phân trang, lọc, và sắp xếp
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filterValues, setFilterValues] = useState<
    Record<string, [number, number]>
  >({});
  const [filterRanges, setFilterRanges] = useState<
    Record<string, { min: number; max: number }>
  >({});

  // Hàm so sánh sâu để kiểm tra object
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 == null ||
      obj2 == null
    )
      return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))
        return false;
    }
    return true;
  };
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!header) {
        toast.error("Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: rowsPerPage.toString(),
          ...(sortConfig.key && {
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
          }),
          ...Object.entries(filterValues).reduce((acc, [key, [min, max]]) => {
            acc[`filter[${key}][min]`] = min.toString();
            acc[`filter[${key}][max]`] = max.toString();
            return acc;
          }, {} as Record<string, string>),
        });
        const res = await getData(
          `/api/admin/exam/videos/${idExam}?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${header}` },
          }
        );
        if (res && Array.isArray(res.data)) {
          setData(res.data);
          setTotalPages(res.totalPages || 1);
          // Tính toán filterRanges
          const numericFields = res.data.reduce(
            (fields: string[], item: any) => {
              Object.keys(item).forEach((key) => {
                if (typeof item[key] === "number" && !fields.includes(key)) {
                  fields.push(key);
                }
              });
              return fields;
            },
            []
          );
          const initialRanges = numericFields.reduce(
            (acc: Record<string, { min: number; max: number }>, field) => {
              const values = res.data
                .map((item: any) => item[field])
                .filter((v: any) => typeof v === "number");
              const min = values.length > 0 ? Math.min(...values) : 0;
              const max = values.length > 0 ? Math.max(...values) : 0;
              if (min !== max) {
                acc[field] = { min, max };
              }
              return acc;
            },
            {}
          );
          setFilterRanges((prev) => {
            if (!deepEqual(prev, initialRanges)) {
              return initialRanges;
            }
            return prev;
          });
          setFilterValues((prev) => {
            const newValues = {
              ...prev,
              ...Object.keys(initialRanges).reduce(
                (acc, field) => ({
                  ...acc,
                  [field]: prev[field] || [
                    initialRanges[field].min,
                    initialRanges[field].max,
                  ],
                }),
                {}
              ),
            };
            if (!deepEqual(prev, newValues)) {
              return newValues;
            }
            return prev;
          });
        } else {
          console.error("Dữ liệu API không đúng định dạng:", res);
          setData([]);
          setTotalPages(1);
          setFilterRanges({});
          setFilterValues({});
          toast.error("Không tìm thấy dữ liệu video đề thi.");
        }
      } catch (error) {
        toast.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [
    isFetchData,
    currentPage,
    rowsPerPage,
    sortConfig,
    filterValues,
    header,
    navigate,
    idExam,
  ]);

  // define table header
  let columnsCourse = ["describe", "video"];
  let fieldSearch = ["describe"];

  const [structData, setStructData] = useState([]);

  useEffect(() => {
    let arrStruct = [
      {
        name: "describe",
        placeholder: "Nhập mô tả video",
        label: "Mô tả video",
        value: "",
        type: "INPUT",
      },
      {
        name: "video",
        label: "Video",
        type: "VIDEO",
        value: [],
      },
    ];
    if (selectedContent) {
      // console.log("selectedContent", selectedContent);
      arrStruct = structData.map((field) => {
        if (selectedContent.hasOwnProperty(field.name)) {
          return {
            ...field,
            value: selectedContent[field.name],
          };
        }
        return field;
      });
      setIsModalUpdateVideoExam(true);
    }
    setStructData(arrStruct);
  }, [isModalCreateVideoExam, selectedContent]);

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
  const batchExecution = [
    {
      value: "DELETE",
      icon: <MdOutlineDeleteOutline style={{ color: "red" }} />,
      content: "Xoá hàng đã chọn",
    },
    {
      value: "LOCK",
      icon: <PiLockKeyLight />,
      content: "Khoá các thành thích",
    },
    {
      value: "UNLOCK",
      icon: <PiLockKeyOpen />,
      content: "Mở khoá thành tích",
    },
  ];

  // structure data video exam
  let dataExamVideo = data;

  const createVideo = async (data: any) => {
    // data: video : [File], describe: string
    setIsLoading(true);
    const id = idExam;
    const { describe, video } = data;

    // Upload image & video lên GCS
    const uploadedVideos = await Promise.all(
      video.map((file) => getSignedUrlAndUpload(file, "exams/video/introduce"))
    );

    if (!id || !video || !describe) {
      console.error("Missing data");
      alert("Thiếu thông tin id || describe || video ");
      return;
    }

    try {
      await postData(
        `/api/admin/exam/video/${id}`,
        {
          describe,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Tạo mới video đề thi thành công!");
      setIsModalCreateVideoExam(false);
    } catch (error) {
      toast.error("Tạo mới video đề thi thất bại!", error.message);
      console.error("Error saving data: ", error);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };
  // update
  const updateVideoExam = async (data: any) => {
    //video: string | file, describe: string
    const id = idVideo;
    const { video, describe } = data;
    if (!id || !describe || !video) {
      alert("Thiếu thông tin id || describe || video ");
      return;
    }
    setIsLoading(true);
    try {
      let uploadedVideos;
      if (video !== data.old_video.value) {
        uploadedVideos = await Promise.all(
          video.map((file) =>
            getSignedUrlAndUpload(file, "exams/video/introduce")
          )
        );
      } else {
        uploadedVideos = video;
      }

      await putData(
        `/api/admin/exam/video/${id}`,
        {
          describe,
          video: uploadedVideos,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      setIsModalUpdateVideoExam(false);
      toast.success("Cập nhật video đề thi thành công!");
    } catch (e) {
      toast.error("Cập nhật video đề thi thất bại!", e.message);
      console.error(`Error updating video`, e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIdVideo("");
    }
  };
  // delete
  const deleteVideo = async () => {
    setIsLoading(true);
    const id = idVideo;
    try {
      await deleteData(`/api/admin/exam/video/${id}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      toast.success("Xóa video đề thi thành công!");
    } catch (e) {
      toast.error("Xóa video đề thi thất bại!", e.message);
      console.error("Error deleting data: ", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdVideo("");
      setIsModalVisible(false);
    }
  };

  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdVideo("");
  };

  // handle action table

  const handleActions = (type: string, row: any) => {
    if (type === "EDIT") {
      const id = row._id;
      setIdVideo(id);
      setSelectedContent(row);
    }
    if (type === "DELETE") {
      const id = row._id;
      setIdVideo(id);
      setIsModalVisible(true);
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
          <div style={{ height: `calc(100% - 8px)` }} className="m-2 h-full">
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
                <h2 className="font-size-20">Video đề thi</h2>
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
                  onClick={() => setIsModalCreateVideoExam(true)}
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
              {dataExamVideo && (
                <Table
                  columns={columnsCourse}
                  data={dataExamVideo}
                  handleAction={handleActions}
                  actions={actions}
                  batchExecution={batchExecution}
                  fieldSearch={fieldSearch}
                  filterPrice={false} // Không có trường số trong video
                  isAllowEpand={true}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  setCurrentPage={setCurrentPage}
                  setRowsPerPage={setRowsPerPage}
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  filterValues={filterValues}
                  setFilterValues={setFilterValues}
                  filterRanges={filterRanges}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalCreateVideoExam && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreateVideoExam}
          onClose={() => {
            setIsModalCreateVideoExam(false);
          }}
          structData={structData}
          onSave={createVideo}
          title="Tạo mới video"
        />
      )}
      {isModalUpdateVideoExam && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateVideoExam}
          onClose={() => {
            setIsModalUpdateVideoExam(false);
            setSelectedContent(null);
          }}
          structData={structData}
          onSave={updateVideoExam}
          title="Cập nhật video"
        />
      )}
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá video đề thi này?"
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={deleteVideo}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default ExamVideo;
