import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../../components/button/plus";
import MSInput from "../../../components/input/MsInput";
import PopupNotification from "../../../components/popup/notify";
import Loading from "../../../components/loading";

//icon react
import { MdDeleteOutline } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
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

const IntroduceExam: React.FC = () => {
  const header = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { idExam } = useParams();
  // state string
  const [idDeleted, setIdDeleted] = useState<string>("");
  const [nameDeleted, setNameDeleted] = useState<string>("");

  //state boolean
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [addIntroduce, setAddIntroduce] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  //state file []

  //state array (store)
  const [listDesc, setListDesc] = useState<Desc[]>([]);
  const [dataDesc, setDataDesc] = useState<DataDesc[]>([]);
  const [dataEditDesc, setDataEditDesc] = useState<DataDesc>();

  //useRef
  // const introTitleRef = useRef<HTMLInputElement>(null);
  // const descInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const introTitleRef = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  const descInputRefs = useRef<
    {
      focus: () => void;
      getValue: () => string;
      setValue: (value: string) => void;
      clear: () => void;
    }[]
  >([]);

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
        console.log("data intro: ", res);
        const describes = res.data;
        console.log("desc: ", describes);
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

  // handle cancel

  const handleCancel = () => {
    setIsUpdate(false);
    setAddIntroduce(false);
    resetInputRefs([
      { state: listDesc, setState: setListDesc },
      { state: dataEditDesc, setState: setDataEditDesc },
      { ref: introTitleRef },
      { ref: descInputRefs },
    ]);
  };

  // handle add
  const hanleAddDesc = (): void => {
    const addDesc: Desc = {
      id: listDesc.length + 1,
      _id: "",
      desc: "",
    };
    setListDesc([...listDesc, addDesc]);
  };

  //handle save
  const createSaveIntroduce = async () => {
    setIsLoading(true);
    const introTitle = introTitleRef.current?.getValue() || "";
    const dataList = descInputRefs.current.map((cur) => cur?.getValue());
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
      console.log("dataList", dataList);

      dataList.forEach(async (data) => {
        console.log("data", data);
        try {
          await postData(
            "/api/admin/overview",
            {
              id_material: id_describe,
              type: "EXAM",
              desc: data,
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
      resetInputRefs([
        { state: listDesc, setState: setListDesc },
        {
          ref: introTitleRef,
        },
        { ref: descInputRefs },
      ]);
      setAddIntroduce(false);
      setIsFetchData(!isFetchData);
    }
  };
  const handleUpdate = async () => {
    const dataUpdate = dataEditDesc;
    const idIntro = dataUpdate?._id;

    setIsLoading(true);
    const introTitle = introTitleRef.current?.getValue() || "";
    const dataList = descInputRefs.current.map((cur, id) => ({
      id:
        dataUpdate && dataUpdate.overviews
          ? dataUpdate?.overviews[id]?._id
          : null,
      desc: cur?.getValue(),
    }));

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

      dataList.forEach(async (data) => {
        console.log("data", data);
        if (data.id && data.desc) {
          try {
            const update = await putData(
              `/api/admin/overview/${data.id}`,
              {
                desc: data.desc,
              },
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
            console.log("update: ", update);
          } catch (error) {
            console.error(`Error saving describe/overview}`, error);
          }
        } else if (!data.id && data.desc) {
          try {
            const res = await postData(
              "/api/admin/overview",
              {
                id_material: idIntro,
                type: "COURSE",
                desc: data.desc,
              },
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
            console.log("res: ", res);
          } catch (error) {
            console.error(`Error saving describe/overview}`, error);
          }
        } else if (data.id && !data.desc) {
          try {
            const deleteRes = await deleteData(
              `/api/admin/overview/${data.id}`,
              {
                headers: { Authorization: `Bearer ${header}` },
              }
            );
            console.log("deleteRes: ", deleteRes);
          } catch (error) {
            console.error(`Error saving describe/overview}`, error);
          }
        }
      });
    } catch (error) {
      console.error(`Error saving describe/describe`, error);
    } finally {
      setIsLoading(false);
      resetInputRefs([
        { state: listDesc, setState: setListDesc },
        {
          ref: introTitleRef,
        },
        { ref: descInputRefs },
      ]);
      setAddIntroduce(false);
      setIsFetchData(!isFetchData);
    }
  };
  // hanle edit
  const handleEditIntroduce = async (descs: any) => {
    console.log("describe", descs);
    setIsUpdate(true);
    setAddIntroduce(true);
    setDataEditDesc(descs);

    const dataOverview = descs.overviews || [];
    const descsIntro: Desc[] = dataOverview.map((item: any, index: number) => ({
      id: listDesc.length + index + 1,
      _id: item?._id || "",
      desc: item?.desc || "",
    }));

    setListDesc([...listDesc, ...descsIntro]);
  };

  // hanle delete

  const deleteFunc = () => {
    if (nameDeleted === "overview") {
      console.log("ID deleted overview: ", idDeleted);
      handleDeleteOverview();
    } else if (nameDeleted === "describe") {
      console.log("ID deleted describe: ", idDeleted);
      deleteIntro();
    }
  };

  const notifyDelete = (id: string, name: string) => {
    const idDeleted = id;
    const nameDeleted = name;

    setNameDeleted(nameDeleted);
    setIdDeleted(idDeleted);
    setIsModalVisible(true);
  };
  const handleClosePopup = () => {
    setIsModalVisible(false);
    setIdDeleted("");
  };

  const deleteIntro = async () => {
    setIsLoading(true);
    const id = idDeleted;
    try {
      const res = await deleteData(`/api/admin/describe/${id}`, {
        headers: {
          Authorization: `Bearer ${header}`,
        },
      });
      console.log("res: ", res);
    } catch (err) {
      console.error(`Error deleting describe`, err);
    } finally {
      setIdDeleted("");
      setIsLoading(false);
      setIsFetchData(!isFetchData);
      setIsModalVisible(false);
    }
  };
  const handleDeleteOverview = async () => {
    const id_Deleted = idDeleted;
    if (!id_Deleted) {
      console.error("idDeleted is undefined");
      return;
    }

    setIsLoading(true);

    try {
      const deleteRes = await deleteData(`/api/admin/overview/${idDeleted}`, {
        headers: { Authorization: `Bearer ${header}` },
      });
      console.log("deleteRes: ", deleteRes);
    } catch (error) {
      console.error(`Error deleting overview`, error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      setIsFetchData(!isFetchData);

      setListDesc((prevListDesc) =>
        prevListDesc.filter((item) => item._id !== idDeleted)
      );

      resetInputRefs([
        {
          ref: descInputRefs,
        },
      ]);

      // Cập nhật dataEditDesc
      setDataEditDesc((prevDataEditDesc) => {
        const prevDesc = prevDataEditDesc || { overviews: [] };

        const updatedOverviews = prevDesc?.overviews?.filter(
          (overview) => overview._id !== idDeleted
        );

        return {
          ...prevDesc,
          overviews: updatedOverviews,
        };
      });
    }
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full bg-white">
          <div className="mx-2 my-2 pt-8 pb-[10px] pl-8 bg-[rgba(255,246,244,1)] rounded-lg h-full">
            <Button
              className="mr-4 button-cancel mb-6"
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
            <h4 className="font-semibold primary-color-text uppercase pb-2">
              Giới thiệu đề thi
            </h4>
            <ButtonPlus
              content="Thêm giới thiệu"
              icon={CiCirclePlus}
              iconSize="text-[24px]"
              textSize="text-[12px]"
              height="h-[24px]"
              width="w-[36%]"
              paddingLeft="pl-7"
              paddingRight="pr-4"
              onClick={() => setAddIntroduce(!addIntroduce)}
            />
            {addIntroduce && (
              <div className="pr-8">
                <div className="flex flex-col mb-2 relative">
                  {/* <label className="text-[12px] text-[#5a607f]">Tiêu đề</label>
                  <input
                    ref={introTitleRef}
                    defaultValue={
                      dataEditDesc && dataEditDesc.desc ? dataEditDesc.desc : ""
                    }
                    placeholder="Bạn sẽ học được gì khi tham gia khoá học"
                    className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                  /> */}
                  <MSInput
                    ref={introTitleRef}
                    label="Tiêu đề"
                    placeholder="Bạn sẽ học được gì khi tham gia khoá học"
                    type="text"
                    required
                    defaultValue={
                      dataEditDesc && dataEditDesc.desc ? dataEditDesc.desc : ""
                    }
                  />
                </div>
                <div className="mb-2 pl-6 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                  {/* Đường line màu đỏ */}
                  <h4 className="font-semibold primary-color-text">
                    Thêm mô tả
                  </h4>
                  <ButtonPlus
                    content="Thêm mô tả"
                    icon={CiCirclePlus}
                    iconSize="text-[24px]"
                    textSize="text-[12px]"
                    height="h-[24px]"
                    width="w-[36%]"
                    paddingLeft="pl-7"
                    paddingRight="pr-4"
                    onClick={() => hanleAddDesc()}
                  />
                  {listDesc.length >= 1 &&
                    listDesc.map((desc, id) => (
                      <div key={id} className="flex flex-col mb-2 relative">
                        <MdDeleteOutline
                          onClick={() =>
                            isUpdate && desc.desc
                              ? notifyDelete(desc?._id, "overview")
                              : setListDesc(
                                  listDesc.filter((_, idx) => idx !== id)
                                )
                          }
                          className="absolute cursor-pointer top-1 right-2 text-red-500 hover:text-red-700"
                          title="Xoá mô tả"
                        />
                        <MSInput
                          ref={(el) => {
                            descInputRefs.current[id] = el!;
                          }}
                          label={`Mô tả ${id + 1}`}
                          placeholder="Thành thạo ngôn ngữ lập trình c#"
                          type="text"
                          required
                          defaultValue={
                            dataEditDesc?.overviews
                              ? dataEditDesc?.overviews[id]?.desc
                              : ""
                          }
                        />
                      </div>
                    ))}
                </div>
                {/* button save */}
                <div className="mt-2">
                  <Button
                    className="mr-4 button-cancel"
                    style={{
                      backgroundColor: "white",
                      color: "#1e2753",
                      borderColor: "#1e2753",
                    }}
                    ghost
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  {isUpdate === true ? (
                    <Button
                      className="button-save"
                      style={{
                        backgroundColor: "#00095b",
                        color: "white",
                        borderColor: "#00095b",
                      }}
                      onClick={handleUpdate}
                    >
                      Save update
                    </Button>
                  ) : (
                    <Button
                      className="button-save"
                      style={{
                        backgroundColor: "#00095b",
                        color: "white",
                        borderColor: "#00095b",
                      }}
                      onClick={createSaveIntroduce}
                    >
                      Save describe
                    </Button>
                  )}
                </div>
              </div>
            )}
            {/* show list desc */}
            <div className="py-2 my-8 px-4 mx-12 bg-white rounded-lg">
              {dataDesc && dataDesc.length > 0 ? (
                dataDesc.map((descs, id) => (
                  <div
                    key={id}
                    className="pl-6 my-6 pb-2 pt-6 pr-2 rounded-lg border-[0.4px] border-[#1e2753] relative"
                  >
                    <MdDeleteOutline
                      onClick={() =>
                        notifyDelete(
                          descs._id ? descs._id : "undefined",
                          "describe"
                        )
                      }
                      className="absolute cursor-pointer top-[4px] left-[24px] text-red-500 hover:text-red-700"
                      title="Xoá mô tả"
                    />
                    <MdEditSquare
                      onClick={() => handleEditIntroduce(descs)}
                      className="absolute cursor-pointer top-[4px] left-[42px] text-red-500 hover:text-red-700"
                      title="Chỉnh sửa mô tả"
                    />
                    <div className="mb-2 secondary-color-bg px-4 py-2 rounded-lg inline-block">
                      <h4 className="text-white">{descs?.desc}</h4>
                    </div>
                    <div className="mb-2">
                      {descs.overviews &&
                        descs?.overviews.map((desc, index) => (
                          <div key={index} className="flex items-center">
                            <FaCheck className="primary-color-text mr-2" />
                            <p>{desc.desc}</p>
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
