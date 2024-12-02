import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import React, { useState, useRef } from "react";

// import ant
import { Button } from "antd";

// import components
import ButtonPlus from "../../components/button/plus";
import { MdDeleteOutline } from "react-icons/md";
// icon react
import { CiCirclePlus } from "react-icons/ci";

interface Desc {
  id: number;
  content: string;
}

const AdminCourse: React.FC = () => {
  const [addCourse, setAddCourse] = useState(false);
  const [addIntroduce, setAddIntroduce] = useState(false);

  const [descCourse, setDescCourse] = useState<Desc[]>([]);

  const courseTitleRef = useRef<HTMLInputElement>(null);
  const introTitleRef = useRef<HTMLInputElement>(null);
  const descInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const hanleAddDesc = (idCur: number): void => {
    const fakeDesc: Desc = {
      id: idCur + 1,
      content: "",
    };
    setDescCourse([...descCourse, fakeDesc]);
  };

  const handleSave = () => {
    const courseTitle = courseTitleRef.current?.value || "";
    const introTitle = introTitleRef.current?.value || "";
    const descriptions = descCourse.map(
      (_, index) => descInputRefs.current[index]?.value || ""
    );

    const courseInfo = {
      courseTitle,
      introTitle,
      descriptions,
    };

    // Hiển thị thông tin khoá học
    console.log("Saved course info: ", courseInfo);
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="w-full h-full overflow-y-auto bg-[rgba(255,246,244,1)]">
          <div className="my-3">
            <div className="px-3 md:px-5">
              <div className="w-[30%] rounded-lg primary-color-background flex justify-center">
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
                              onClick={() => hanleAddDesc(descCourse.length)}
                            />
                            {descCourse.length >= 1 &&
                              descCourse.map((desc, id) => (
                                <div
                                  key={id}
                                  className="flex flex-col mb-2 relative"
                                >
                                  <MdDeleteOutline
                                    onClick={() =>
                                      setDescCourse(
                                        descCourse.filter(
                                          (_, idx) => idx !== id
                                        )
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
                                backgroundColor: "#1e2753",
                                color: "white",
                                borderColor: "#1e2753",
                              }}
                              onClick={handleSave}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="mb-2">
                        <h4>{introTitleRef.current?.value}</h4>
                      </div>

                      <div className="mb-2">
                        {descCourse.map((desc, index) => (
                          <div key={index}>
                            <p>
                              Mô tả {desc.id}:{" "}
                              {descInputRefs.current[index]?.value}
                            </p>
                          </div>
                        ))}
                      </div>
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
