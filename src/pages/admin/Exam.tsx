import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import ant
import { Button, Select } from "antd";

// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdAttractions } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";

// import components
import ButtonPlus from "../../components/button/plus";
import MSInput from "../../components/input/MsInput";
import ImageUploader from "../../components/helps/dropImage";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";

// icon react
import { CiCirclePlus } from "react-icons/ci";

//axios
import { postData, getData, deleteData, putData } from "../../axios";

const AdminExam: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const { Option } = Select;
  const navigate = useNavigate();
  // state boolen
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);

  // state string
  const [idExam, setIdExam] = useState<string>("");
  // state file
  const [uploadVideo, setUploadVideo] = useState<File[]>([]);
  const [imageExam, setImageExam] = useState<File[]>([]);
  // state boolean
  const [addExam, setAddExam] = useState(false);
  const [isModalVisible, setIdModalVisible] = useState(false);

  // data store
  const [allExam, setAllExam] = useState([]);
  const [selectedItems, setSelectedItems] = useState<
    { id: string; label: string }[]
  >([]);
  const [dataEditExam, setDataEditExam] = useState<any>(null);
  const [categoryType, setCategoryType] = useState<any>(null);
  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedItemsByOption, setSelectedItemsByOption] = useState<
    Record<string, any[]>
  >({});
  const [currentOption, setCurrentOption] = useState<string | null>(null);

  // useRef input
  const ExamTitleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const linkExam = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const oldPrice = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const newPrice = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);

  // get data

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/categories", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        setCategoryType(res.data);
      } catch (e) {
        console.log("Error fetch categories", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDataExam = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/exams", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        if (res) {
          setAllExam(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataExam();
  }, [isFetchData]);
  // fake frame exam
  let columnsExam = ["name", "link", "price", "discount", "image", "video"];
  let dataExam = allExam;
  // action table

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
      title: "Video đề thi",
      action: "VIDEO",
      icon: <FaPhotoVideo />,
      style: styleAction,
    },
    {
      title: "Giới thiệu đề thi",
      action: "INTRODUCE",
      icon: <MdAttractions />,
      style: styleAction,
    },
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
  // handle
  const handleVideoExam = (files: File[]) => {
    setUploadVideo(files);
  };
  const hanleResetUrlsImage = () => {
    setDataEditExam((prev) => ({
      ...prev,
      image: "",
    }));
  };
  const hanleResetUrlsVideo = () => {
    // dataEditExam.video = "";
    setDataEditExam((prev) => ({
      ...prev,
      video: "",
    }));
  };
  const handleImageExam = (files: File[]) => {
    setImageExam(files);
  };

  // reset text inputRef
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
            ref.clear();
          });
        } else {
          if (currentRef.clear) {
            currentRef.clear();
          }
        }
      }
    });
  };

  // hanle save

  const createExam = async () => {
    // setIsLoading(true);

    try {
      // 1. Upload exam information
      const formData = new FormData();
      imageExam.forEach((file) => formData.append("fileImage", file));
      uploadVideo.forEach((file) => formData.append("fileVideo", file));
      // tranfer
      const allCategories = Object.entries(selectedItemsByOption).map(
        ([type, value]) => ({
          type,
          value,
        })
      );
      const name = ExamTitleRef.current?.getValue() || "";
      const price = oldPrice.current?.getValue() || "";
      const discount = newPrice.current?.getValue() || "";
      const link = linkExam.current?.getValue() || "";

      formData.append("categories", JSON.stringify(allCategories));
      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("link", link);

      const resExam = await postData("/api/admin/exam", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      console.log("Exam saved successfully.", resExam);
      resetInputRefs([
        { state: imageExam, setState: setImageExam },
        { state: uploadVideo, setState: setUploadVideo },
        { ref: ExamTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
        { ref: linkExam },
      ]);
    } catch (err) {
      console.error("Error saving exam:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };
  // handle edit
  const handleActions = (type: string, row: any) => {
    if (type === "DELETE") {
      const id = row._id;
      setIdExam(id);
      setIdModalVisible(true);
    }
    if (type === "EDIT") {
      const id = row._id;
      setIdExam(id);
      setAddExam(true);
      setDataEditExam(row);
      setIsUpdate(true);
      console.log("current: ", currentOption);
      if (row.categories.value) {
        const updatedSelectedItems: Record<string, any[]> = {};

        categoryType.forEach((CT) => {
          const matchingItems = CT.value
            .map((item: any) => item.value)
            .filter((value: string) => row.categories.value.includes(value));

          if (matchingItems.length > 0) {
            updatedSelectedItems[CT.option] = matchingItems;
          }
        });

        setSelectedItemsByOption(updatedSelectedItems);
      }
    }
    if (type === "INTRODUCE") {
      navigate(`/admin/exam/${row._id}/introduce`);
    }

    if (type === "VIDEO") {
      navigate(`/admin/exam/${row._id}/videos`);
    }

    console.log("Edit row:", row);
    // Implement logic to edit the row
  };
  const handleClosePopup = () => {
    setIdModalVisible(false);
    setIdExam("");
  };
  const handleDeleteExam = async () => {
    try {
      setIsLoading(true);
      const idDeleted = JSON.parse(JSON.stringify(idExam));
      const examDeleted = await deleteData(`/api/admin/exam/${idDeleted}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      console.log(examDeleted, "Exam deleted");
    } catch (err) {
      console.log("Error deleting: ", err);
    } finally {
      setIsLoading(false);
      setIdModalVisible(false);
      setIdExam("");
      setIsFetchData(!isFetchData);
    }
  };

  // hanle update
  const updateExam = async () => {
    setIsLoading(true);
    const idExam = dataEditExam._id;
    try {
      // 1. Upload exam information
      const formData = new FormData();

      // imageExam || uploadVideo == [] thì lấy image và video cũ trong dataEditExam
      // nếu image và video cũ sẽ là chuỗi string, nếu không nó sẽ là file và be phải chuyển qua string url để lưu
      let image = "";
      let video = "";

      const allCategories = Object.entries(selectedItemsByOption).map(
        ([type, value]) => ({
          type,
          value,
        })
      );
      const name = ExamTitleRef.current?.getValue() || "";
      const price = oldPrice.current?.getValue() || "";
      const discount = newPrice.current?.getValue() || "";
      const link = linkExam.current?.getValue() || "";

      if (imageExam && imageExam.length > 0) {
        imageExam.forEach((file) => formData.append("fileImage", file));
      } else {
        console.log("check image here");
        image = dataEditExam.image;
        formData.append("image", image);
      }

      if (uploadVideo && uploadVideo.length > 0) {
        uploadVideo.forEach((file) => formData.append("fileVideo", file));
      } else {
        video = dataEditExam.video;
        formData.append("video", video);
      }

      console.log("name: ", name, "price: ", price, " discount: ", discount);

      formData.append("categories", JSON.stringify(allCategories));
      formData.append("name", name);
      formData.append("link", link);
      formData.append("price", price);
      formData.append("discount", discount);

      const resExam = await putData(`/api/admin/exam/${idExam}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${header}`,
        },
      });

      console.log("Exam update successfully.", resExam);
      resetInputRefs([
        { state: imageExam, setState: setImageExam },
        { state: uploadVideo, setState: setUploadVideo },
        { state: dataEditExam, setState: setDataEditExam },
        { ref: ExamTitleRef },
        { ref: oldPrice },
        { ref: newPrice },
        { ref: linkExam },
      ]);
      setIsUpdate(false);
      setAddExam(false);
      hanleResetUrlsVideo();
      hanleResetUrlsImage();
    } catch (err) {
      console.error("Error saving exam:", err);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  // func other
  const handleSelectCategoryType = (value: string, option: any) => {
    setCurrentOption(value);
    setSelectedContent(option.content);

    if (!selectedItemsByOption[value]) {
      setSelectedItemsByOption((prev) => ({ ...prev, [value]: [] }));
    }
  };

  //--_-- Khi checkbox thay đổi
  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    setSelectedItemsByOption((prev) => {
      const currentItems = prev[currentOption!] || [];
      const updatedItems = checked
        ? [...currentItems, value]
        : currentItems.filter((item) => item !== value);

      return { ...prev, [currentOption!]: updatedItems };
    });
  };
  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full overflow-y-auto bg-primary">
          <div className="my-3">
            <div className="px-3 md:px-5">
              <div className="w-[30%] rounded-lg bg-secondary flex justify-center">
                <h4 className="font-size-18 text-white p-2 uppercase">
                  Đề thi
                </h4>
              </div>
              {/* button them khoa hoc */}
              <ButtonPlus
                content="Thêm đề thi mới"
                icon={CiCirclePlus}
                iconSize="text-[30px]"
                textSize="text-[14px"
                height="h-[32px]"
                width="w-[17%]"
                onClick={() => setAddExam(!addExam)}
              />
              {/* add thong tin khoa hoc */}
              {addExam && (
                <div className="flex justify-around w-full">
                  {/* thong tin khoa hoc */}
                  <div className="bg-white rounded-lg w-[60%] p-4">
                    <div className="mb-2">
                      <h4 className="font-size-18 primary-color-text">
                        Thông tin đề thi
                      </h4>
                    </div>
                    <div className="flex flex-col mb-2">
                      <MSInput
                        ref={ExamTitleRef}
                        label="Tên đề thi"
                        placeholder="Nhập tên đề thi"
                        type="text"
                        required
                        defaultValue={dataEditExam ? dataEditExam.name : ""}
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <MSInput
                        ref={linkExam}
                        label="Đường dẫn đề thi"
                        placeholder="Nhập đường dẫn đề thi"
                        type="text"
                        required
                        defaultValue={dataEditExam ? dataEditExam.link : ""}
                      />
                    </div>
                    <ImageUploader
                      titleBtn="Chọn ảnh đại diện đề thi"
                      typefile="image/*"
                      onImagesChange={handleImageExam}
                      urls={dataEditExam?.image ? dataEditExam.image : ""}
                      onUrlsReset={hanleResetUrlsImage}
                    />
                    <div>
                      <h4 className="font-size-18 primary-color-text">
                        Video chữa đề thi
                      </h4>
                      <ImageUploader
                        titleBtn="Chọn video"
                        typefile="video/*"
                        onImagesChange={handleVideoExam}
                        urls={dataEditExam?.video ? dataEditExam.video : ""}
                        onUrlsReset={hanleResetUrlsVideo}
                      />
                    </div>
                    {/* chi phí khoá học */}
                    <div>
                      <h4 className="font-size-18 primary-color-text">
                        Giá đề thi
                      </h4>
                      <div className="flex justify-around">
                        <div className="flex flex-col">
                          <MSInput
                            ref={oldPrice}
                            label="Giá đề thi"
                            placeholder="Nhập giá"
                            type="number"
                            validate="number"
                            required
                            defaultValue={
                              dataEditExam ? dataEditExam.price : ""
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <MSInput
                            ref={newPrice}
                            label="Giá ưu đãi"
                            placeholder="Nhập giá"
                            type="number"
                            validate="number"
                            required
                            defaultValue={
                              dataEditExam ? dataEditExam.discount : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* button save */}
                    <div className="mt-4 text-center">
                      <Button
                        className="mr-4 button-cancel"
                        style={{
                          backgroundColor: "white",
                          color: "#1e2753",
                          borderColor: "#1e2753",
                        }}
                        ghost
                      >
                        Huỷ
                      </Button>
                      {isUpdate === true ? (
                        <Button
                          className="button-save"
                          style={{
                            backgroundColor: "#00095b",
                            color: "white",
                            borderColor: "#00095b",
                          }}
                          onClick={updateExam}
                        >
                          Cập nhật
                        </Button>
                      ) : (
                        <Button
                          className="button-save"
                          style={{
                            backgroundColor: "#00095b",
                            color: "white",
                            borderColor: "#00095b",
                          }}
                          onClick={createExam}
                        >
                          Tạo mới
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="w-[35%] bg-white rounded-lg p-4">
                    <div className="w-full h-[400px] max-h-[400px] overflow-hidden border-line-bottom my-2 py-2">
                      <Select
                        placeholder="Chọn danh mục"
                        style={{ width: 200 }}
                        onChange={handleSelectCategoryType}
                        className="mb-3"
                      >
                        {categoryType.map((CT, idex) => (
                          <Option
                            key={idex}
                            value={CT.option}
                            content={CT.value}
                          >
                            {CT.option}
                          </Option>
                        ))}
                      </Select>
                      <div className="w-full  h-[340px] max-h-[340px]  h-full overflow-y-auto pb-2">
                        {selectedContent.length > 0 &&
                          selectedContent.map((content, idex1) => (
                            <div
                              key={idex1}
                              className="flex items-center ml-1 mb-1"
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  value={content.value}
                                  onChange={handleCheckbox}
                                  checked={
                                    selectedItemsByOption[
                                      currentOption!
                                    ]?.includes(content.value) || false
                                  }
                                  style={{
                                    transform: "scale(1.5)",
                                    marginRight: "8px",
                                  }}
                                />
                                {content.value}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* table exam */}
          {dataExam && (
            <Table
              columns={columnsExam}
              data={dataExam}
              handleAction={handleActions}
              actions={actions}
            />
          )}
        </div>
      </div>
      {isModalVisible && (
        <PopupNotification
          title="Bạn có chắc chắn muốn xoá?"
          status="error"
          buttonText="Xoá ngay"
          onButtonClick={handleDeleteExam}
          buttonClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default AdminExam;
