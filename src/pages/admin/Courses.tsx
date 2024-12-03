import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef } from "react";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../components/button/plus";
import ImageUploader from "../../components/helps/dropImage";
// icon react
import { MdDeleteOutline } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";

interface Desc {
  id: number;
  content: string;
}

interface ListLession {
  id: number;
  lessionTitleRef: string;
  uploadedImages: ImageFile[];
  linkExercise: string;
}

interface DataDesc {
  titleDesc: string;
  descriptions: Desc[];
}

interface ImageFile {
  name: string;
  url: string;
}

const AdminCourse: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);

  const handleImagesChange = (images: ImageFile[]) => {
    setUploadedImages(images);
  };

  const [addCourse, setAddCourse] = useState(false);
  const [addIntroduce, setAddIntroduce] = useState(false);
  const [addCourseContent, setAddCourseContent] = useState(false);
  const [showLession, setShowLession] = useState<{ [key: number]: boolean }>(
    {}
  );

  // data store

  const [dataDesc, setDataDesc] = useState<DataDesc[]>([]);

  const [listDesc, setListDesc] = useState<Desc[]>([]);

  const [listLession, setListLession] = useState<ListLession[]>([]);

  // useRef input
  const courseTitleRef = useRef<HTMLInputElement>(null);
  const introTitleRef = useRef<HTMLInputElement>(null);
  const descInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const chapterTitleRef = useRef<HTMLInputElement>(null);
  const lessionTitleRef = useRef<HTMLInputElement>(null);
  const linkExercise = useRef<HTMLInputElement>(null);

  const oldPrice = useRef<HTMLInputElement>(null);
  const newPrice = useRef<HTMLInputElement>(null);

  // handle add

  const hanleAddDesc = (idCur: number): void => {
    const addDesc: Desc = {
      id: idCur + 1,
      content: "",
    };
    setListDesc([...listDesc, addDesc]);
  };
  const hanleAddLession = (idCur: number): void => {};

  // reset text inputRef
  const resetInputRefs = (refs: any) => {
    refs.forEach((ref: any) => {
      if (ref.current) {
        console.log("check ref.cur");
        ref.current.value = "";
      } else if (ref.length > 0) {
        console.log("check child ");

        ref.forEach((child: any) => {
          child = "";
        });
      }
    });
  };
  // hanle save

  const handleSaveDesc = () => {
    const introTitle = introTitleRef.current?.value || "";
    const descriptions: Desc[] = listDesc.map((desc, id) => ({
      id: desc.id,
      content: descInputRefs.current[id]?.value || "",
    }));

    setDataDesc((prev) => [
      ...prev,
      { titleDesc: introTitle, descriptions: descriptions },
    ]);

    resetInputRefs([introTitleRef, listDesc]);
  };

  const handleSaveLessions = () => {
    setListLession((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        lessionTitleRef: lessionTitleRef.current?.value || "",
        linkExercise: linkExercise.current?.value || "",
        uploadedImages: uploadedImages,
      },
    ]);

    resetInputRefs([lessionTitleRef, linkExercise, uploadedImages]); // Reset input
  };
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full overflow-y-auto bg-[rgba(255,246,244,1)]">
          <div className="my-3">
            <div className="px-3 md:px-5">
              <div className="w-[30%] rounded-lg secondary-color-bg flex justify-center">
                <h4 className="text-white p-2">Thêm thông tin khoá học</h4>
              </div>
              {/* button them khoa hoc */}
              <ButtonPlus
                content="Thêm khoá học"
                icon={CiCirclePlus}
                iconSize="text-[32px]"
                textSize="text-[14px"
                height="h-[32px]"
                width="w-[22%]"
                onClick={() => setAddCourse(!addCourse)}
              />
              {/* add thong tin khoa hoc */}
              {addCourse && (
                <div className="flex justify-around w-full">
                  {/* thong tin khoa hoc */}
                  <div className="bg-white rounded-lg w-[60%] p-4">
                    <div className="mb-2">
                      <h4 className="font-semibold primary-color-text">
                        Thông tin khoá học
                      </h4>
                    </div>
                    <div className="flex flex-col mb-2">
                      <label className="text-[12px] text-[#5a607f]">
                        Tên khoá học
                      </label>
                      <input
                        ref={courseTitleRef}
                        placeholder="Nhập tên khoá học"
                        className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                      />
                    </div>
                    <div className="mb-2">
                      <h4 className="font-semibold primary-color-text">
                        Giới thiệu khoá học
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
                        <div>
                          <div className="flex flex-col mb-2">
                            <label className="text-[12px] text-[#5a607f]">
                              Tiêu đề
                            </label>
                            <input
                              ref={introTitleRef}
                              placeholder="Bạn sẽ học được gì khi tham gia khoá học"
                              className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
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
                              onClick={() => hanleAddDesc(listDesc.length)}
                            />
                            {listDesc.length >= 1 &&
                              listDesc.map((desc, id) => (
                                <div
                                  key={id}
                                  className="flex flex-col mb-2 relative"
                                >
                                  <MdDeleteOutline
                                    onClick={() =>
                                      setListDesc(
                                        listDesc.filter((_, idx) => idx !== id)
                                      )
                                    }
                                    className="absolute cursor-pointer top-1 right-2 text-red-500 hover:text-red-700"
                                    title="Xoá mô tả"
                                  />
                                  <label className="text-[12px] text-[#5a607f]">
                                    Mô tả {desc.id}
                                  </label>
                                  <input
                                    ref={(el) =>
                                      (descInputRefs.current[id] = el)
                                    }
                                    placeholder="Thành thạo ngôn ngữ lập trình c#"
                                    className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
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
                            >
                              Cancel
                            </Button>
                            <Button
                              className="button-save"
                              style={{
                                backgroundColor: "#00095b",
                                color: "white",
                                borderColor: "#00095b",
                              }}
                              onClick={handleSaveDesc}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* show list desc */}
                    {dataDesc &&
                      dataDesc.length > 0 &&
                      dataDesc.map((descs, id) => (
                        <div
                          key={id}
                          className="pl-6 my-6 py-2 pr-2 rounded-lg border-[0.4px] border-[#1e2753] relative"
                        >
                          <MdDeleteOutline
                            onClick={() =>
                              setListDesc(
                                listDesc.filter((_, idx) => idx !== id)
                              )
                            }
                            className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                            title="Xoá mô tả"
                          />
                          <MdEditSquare
                            onClick={() =>
                              setListDesc(
                                listDesc.filter((_, idx) => idx !== id)
                              )
                            }
                            className="absolute cursor-pointer -top-5 right-8 text-red-500 hover:text-red-700"
                            title="Chỉnh sửa mô tả"
                          />
                          <div className="mb-2 secondary-color-bg px-4 py-2 rounded-lg inline-block">
                            <h4 className="text-white">{descs.titleDesc}</h4>
                          </div>
                          <div className="mb-2">
                            {descs.descriptions.map((desc, index) => (
                              <div key={index} className="flex items-center">
                                <FaCheck className="primary-color-text mr-2" />
                                <p>{desc.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    {/* add image/ */}
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Video giới thiệu khoá học
                      </h4>
                      <ImageUploader titleBtn="Chọn video" />
                    </div>
                    {/* chi phí khoá học */}
                    <div>
                      <h4 className="font-semibold primary-color-text">
                        Giá khoá học
                      </h4>
                      <div className="flex justify-around">
                        <div className="flex flex-col">
                          <label className="text-[12px] text-[#5a607f]">
                            Giá gốc
                          </label>
                          <input
                            ref={oldPrice}
                            placeholder="Nhập giá trước giảm"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[12px] text-[#5a607f]">
                            Giá đã giảm
                          </label>
                          <input
                            ref={newPrice}
                            placeholder="Nhập giá đã giảm"
                            className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Nội dung khoá học */}
                    <div className="mb-2 mt-2">
                      <h4 className="font-semibold primary-color-text">
                        Nội dung khoá học
                      </h4>
                      <ButtonPlus
                        content="Thêm chương học"
                        icon={CiCirclePlus}
                        iconSize="text-[24px]"
                        textSize="text-[12px]"
                        height="h-[24px]"
                        width="w-[36%]"
                        paddingLeft="pl-7"
                        paddingRight="pr-4"
                        onClick={() => setAddCourseContent(!addCourseContent)}
                      />
                      {addCourseContent && (
                        <div>
                          <div className="flex flex-col mb-2">
                            <label className="text-[12px] text-[#5a607f]">
                              Tiêu đề chương học
                            </label>
                            <input
                              ref={chapterTitleRef}
                              placeholder="Kiểu dữ liệu, biến, vòng lặp"
                              className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                            />
                          </div>
                          <div className="mb-2 pl-6 relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                            <ButtonPlus
                              content="Thêm bài học"
                              icon={CiCirclePlus}
                              iconSize="text-[24px]"
                              textSize="text-[12px]"
                              height="h-[24px]"
                              width="w-[36%]"
                              paddingLeft="pl-7"
                              paddingRight="pr-4"
                              onClick={() =>
                                hanleAddLession(listLession.length)
                              }
                            />
                            <div className="flex flex-col mb-2  pl-6 relative">
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[100%] w-[0.2px] bg-[#1e2753]"></div>{" "}
                              <label className="text-[12px] text-[#5a607f]">
                                Tiêu đề bài học
                              </label>
                              <input
                                ref={lessionTitleRef}
                                placeholder="Hướng dẫn cài đặt vsCode"
                                className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                              />
                              {/* add video */}
                              {/* <ButtonPlus
                                content="Thêm video"
                                icon={CiCirclePlus}
                                iconSize="text-[24px]"
                                textSize="text-[12px]"
                                height="h-[24px]"
                                width="w-[36%]"
                                paddingLeft="pl-7"
                                paddingRight="pr-4"
                                disabled={true}
                              /> */}
                              <div>
                                <ImageUploader
                                  titleBtn="Chọn video"
                                  onImagesChange={handleImagesChange}
                                />
                              </div>
                              {/* add link bài tập */}
                              {/* <ButtonPlus
                                content="Thêm bài tập"
                                icon={CiCirclePlus}
                                iconSize="text-[24px]"
                                textSize="text-[12px]"
                                height="h-[24px]"
                                width="w-[36%]"
                                paddingLeft="pl-7"
                                paddingRight="pr-4"
                                disabled={true}
                              /> */}
                              <label className="text-[12px] text-[#5a607f]">
                                Link bài tập từ codeforce
                              </label>
                              <input
                                ref={linkExercise}
                                placeholder="Nhập link bài tập"
                                className="border border-[#f3f3f3] rounded-[4px] p-1 mt-1 focus:border-[#1e2753] focus:outline-none"
                              />
                            </div>
                            {/* button save */}
                            <div className="mt-2 pl-6">
                              <Button
                                className="mr-4 button-cancel"
                                style={{
                                  backgroundColor: "white",
                                  color: "#1e2753",
                                  borderColor: "#1e2753",
                                }}
                                ghost
                              >
                                Cancel
                              </Button>
                              <Button
                                className="button-save"
                                style={{
                                  backgroundColor: "#00095b",
                                  color: "white",
                                  borderColor: "#00095b",
                                }}
                                onClick={handleSaveLessions}
                              >
                                Save
                              </Button>
                            </div>
                            {listLession &&
                              listLession.length > 0 &&
                              listLession.map((lession, id) => (
                                <div
                                  key={id}
                                  className="pl-6 my-6 py-2 pr-2 ml-6 relative"
                                  style={{ borderTop: "0.4px solid #1e2753" }}
                                >
                                  <MdDeleteOutline
                                    onClick={() =>
                                      setListDesc(
                                        listDesc.filter((_, idx) => idx !== id)
                                      )
                                    }
                                    className="absolute cursor-pointer -top-5 right-2 text-red-500 hover:text-red-700"
                                    title="Xoá mô tả"
                                  />
                                  <MdEditSquare
                                    onClick={() =>
                                      setListDesc(
                                        listDesc.filter((_, idx) => idx !== id)
                                      )
                                    }
                                    className="absolute cursor-pointer -top-5 right-8 text-red-500 hover:text-red-700"
                                    title="Chỉnh sửa mô tả"
                                  />
                                  <div
                                    className="flex items-center primary-color-text inline-block cursor-pointer border border-transparent hover:border-[#1e2753] hover:rounded-lg transition-all duration-300 p-1"
                                    onClick={() =>
                                      setShowLession((prev) => ({
                                        ...prev,
                                        [id]: !prev[id],
                                      }))
                                    }
                                  >
                                    <FaRegCirclePlay className="mr-4" />
                                    <h4>
                                      Bài {lession.id}:{" "}
                                      {lession.lessionTitleRef}
                                    </h4>
                                  </div>
                                  {showLession[id] && (
                                    <div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {lession.uploadedImages.map(
                                          (image, index) => (
                                            <div
                                              key={index}
                                              className="relative w-full h-32 overflow-hidden rounded-lg border"
                                            >
                                              <img
                                                src={image.url}
                                                alt={image.name}
                                                className="object-cover w-full h-full"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                      <a
                                        href={lession.linkExercise}
                                        className="primary-color-text"
                                      >
                                        Link bài tập: {lession.linkExercise}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-[35%] bg-white rounded-lg p-4">
                    category
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourse;
