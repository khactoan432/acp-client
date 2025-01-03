import React, { useState, useEffect, useRef } from "react";
import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";
import Loading from "../../../components/loading";
import { HiDotsVertical } from "react-icons/hi";

// import icon react
import { CiCirclePlus } from "react-icons/ci";
import { FiTrash } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FaHandMiddleFinger } from "react-icons/fa6";

// import antd
import { Button } from "antd";

// impoprt component
import MSInput from "../../../components/input/MsInput";
import ButtonPlus from "../../../components/button/plus";
import AdminModal from "../../../components/popup/AdminModal";

import { getData, postData, putData, deleteData } from "../../../axios";

interface CategoryType {
  _id?: string;
  option?: string;
  type?: string;
  value?: Category[];
}
interface Category {
  id?: number;
  _id?: string;
  category_type_id?: string;
  value?: string;
}
const AdminBanner: React.FC = () => {
  const header = localStorage.getItem("access_token");

  // state boolean
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState(false);
  const [add, setAdd] = useState(false);
  const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
  const [isModelUpdateCategoryType, setIsModelUpdateCategoryType] =
    useState(false);
  const [isModelUpdateCategory, setIsModelUpdateCategory] = useState(false);

  // string state
  const [idCategoryType, setIdCategoryType] = useState<string>("");
  const [idCategory, setIdCategory] = useState<string>("");

  // state store
  const [categoryType, setCategoryType] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [editCategoryType, setEditCategoryType] = useState<CategoryType>();
  const [editCategory, setEditCategory] = useState<Category>();

  // state ref
  const refCategories: React.MutableRefObject<
    Record<
      string,
      React.RefObject<{
        focus: () => void;
        getValue: () => string;
        setValue: (value: string) => void;
        clear: () => void;
      }>[]
    >
  > = useRef({});
  // structure store
  const fieldCategories = [
    {
      name: "option",
      placeholder: "Nhập danh mục tìm kiếm.",
      label: "Danh mục tìm kiếm.",
    },
    { type: "OPTION", value: ["CHECKBOX", "STRING"], label: "Chọn" },
    { type: "ARRAY", placeholder: "List value ..." },
  ];
  const fieldCategoryType = [
    {
      name: "option",
      placeholder: "Nhập danh mục tìm kiếm.",
      label: "Danh mục tìm kiếm.",
    },
    { type: "OPTION", value: ["CHECKBOX", "STRING"], label: "Chọn" },
  ];
  const fileCategory = [
    { name: "value", placeholder: "Nhập vào danh mục", label: "Danh mục" },
  ];

  // fetch data

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData("/api/admin/categories", {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        });
        console.log("res: ", res);
        setCategoryType(res.data);
      } catch (e) {
        console.log("Error fetch categories", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isFetchData]);

  // handle add

  const handleAdd = (_id: string, id: string) => {
    setIdCategoryType(_id);
    const newCategory: Category = {
      id: (categories[id]?.length || 0) + 1,
      value: "",
    };

    setCategories((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newCategory],
    }));
  };

  // handle save

  const createCategories = async (data: any) => {
    console.log("create categories: ", data);
    setIsLoading(true);
    try {
      const option = data.option || "";
      const type = data.type || "";
      const value = data.arrayValue.map((d) => d.getValue());
      const res = await postData(
        "/api/admin/categories",
        {
          option,
          type,
          value,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      console.log("res: ", res);
    } catch (e) {
      console.log("Error create categories", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
    }
  };

  const createCategory = async (idex: string) => {
    const value = refCategories.current[idex].map((d) => d.getValue()); //vscode ngu:)
    const id = idCategoryType;
    try {
      setIsLoading(true);
      const res = await putData(
        `/api/admin/categories/${id}`,
        {
          value: value,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      console.log("res: ", res);
    } catch (e) {
      console.log("Error update categoryType", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdCategoryType("");
      setCategories((prev) => ({ ...prev, [idex]: [] }));
      refCategories.current[idex].map((d) => d.clear()); // vscode ngu:)
    }
  };

  // handle update
  const handleUpdateCategoryType = (categoryType: CategoryType) => {
    const id = categoryType._id ? categoryType._id : "";
    setIdCategoryType(id);
    const dataEdit = { option: categoryType.option, type: categoryType.type };
    setEditCategoryType(dataEdit);
    setIsModelUpdateCategoryType(true);
  };

  const updateCategoryType = async (data: any) => {
    const id = idCategoryType;
    console.log("update: ", data);
    const option = data.option;
    const type = data.type;
    if (!type || !option) {
      alert("Missing option || type");
      return;
    }
    try {
      setIsLoading(true);
      const res = await putData(
        `/api/admin/categories/${id}`,
        {
          option: data.option,
          type: data.type,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      console.log("res: ", res);
    } catch (e) {
      console.log("Error update categoryType", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdCategoryType("");
      setEditCategoryType({});
    }
  };

  const handleUpdateCategory = (value: Category) => {
    const _id = value._id;
    setIdCategory(_id);
    setIsModelUpdateCategory(true);
    console.log("val: ", value.value);
    setEditCategory({ value: value.value });
  };

  const updateCategory = async (data: any) => {
    const id = idCategory;
    const value = data.value;
    console.log("value input: ", data);

    setIsLoading(true);
    try {
      const res = await putData(
        `/api/admin/category/${id}`,
        { value },
        { headers: { Authorization: `Bearer ${header}` } }
      );
      console.log("res: ", res);
    } catch (e) {
      console.log("Error update category", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdCategory("");
      setEditCategory({});
    }
  };

  // handle delete
  const deleteCategoryType = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await deleteData(`/api/admin/categoryType/${id}`, {
        headers: { Authorization: `Bearer ${header}` },
      });
      console.log("res: ", res);
    } catch (e) {
      console.log("Error delete categoryType", e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await deleteData(`/api/admin/category/${id}`, {
        headers: { Authorization: `Bearer ${header}` },
      });
      console.log("res delete category: ", res);
    } catch (e) {
      console.log("Error delete category", e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };
  // func reset input

  // func other
  // const checkTextInput = () => {
  //   console.log("check", refCategories.current);
  //   return refCategories.current.some((input) => input.getValue() === "");
  // };

  // get height element
  const headerRef = useRef<HTMLDivElement>(null); // Create a ref for the header div
  const [minHeight, setMinHeight] = useState(0); // State to store the height

  useEffect(() => {
    if (headerRef.current) {
      setMinHeight(headerRef.current.offsetHeight + 8);
    }
  }, []);
  console.log("minHeight: ", minHeight);
  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        <div className="wrap-container_categories w-full m-2">
          <div
            ref={headerRef}
            className="header_categories flex justify-between items-center bg-primary px-5 py-3"
          >
            <div className="left uppercase">
              <h2 className="font-size-20">Categories</h2>
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
                onClick={() => setIsModalSaveOpen(true)}
              >
                Thêm mới
              </Button>
            </div>
          </div>
          <div
            style={{ minHeight: `calc(100% - ${minHeight + "px"})` }}
            className="wrap-body-categories w-full overflow-auto bg-primary px-5 py-3 mt-2"
          >
            <div className="flex body-categories">
              {categoryType &&
                categoryType.length > 0 &&
                categoryType.map((CT, id) => {
                  const typeId = id.toString();

                  if (!refCategories.current[typeId]) {
                    refCategories.current[typeId] = [];
                  }
                  return (
                    <div
                      key={id}
                      className="w-[32%] flex-shrink-0 box-shadow_primary bg-white pa-primary mr-2"
                    >
                      <div className="flex justify-center items-center mb-2">
                        <h3
                          className="rounded-lg bg-secondary flex-grow mr-1"
                          style={{
                            padding: "4px 12px",
                            fontSize: "18px",
                            maxWidth: "calc(100% - 36px)",
                          }}
                        >
                          {CT.option ? CT.option : "none"}
                        </h3>
                        <div
                          className="relative group p-2 icon-dots"
                          style={{ width: "32px", flexShrink: 0 }}
                        >
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
                              onClick={() =>
                                deleteCategoryType(CT._id ? CT._id : "")
                              }
                            >
                              <FiTrash className="mr-2" />
                              <span
                                style={{ fontSize: "12px", minWidth: "32px" }}
                              >
                                Delete
                              </span>
                            </div>
                            <div
                              className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                              style={{ color: "#eda22e" }}
                              onClick={() => handleUpdateCategoryType(CT)}
                            >
                              <CiEdit className="mr-2" />
                              <span
                                style={{ fontSize: "12px", minWidth: "32px" }}
                              >
                                Edit
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="wrap-add-new border-line-bottom mb-2 pb-4">
                        <div className="action flex w-full justify-between items-center">
                          <ButtonPlus
                            content="Thêm mới"
                            icon={CiCirclePlus}
                            iconSize="text-[22px]"
                            textSize="text-[12px]"
                            height="h-[24px]"
                            width="w-[32%]"
                            paddingLeft="pl-6"
                            paddingRight="pr-4"
                            onClick={() =>
                              handleAdd(CT._id ? CT._id : "", id.toString())
                            }
                          />
                          {categories[id] && categories[id].length > 0 && (
                            <Button
                              className="button-save box-shadow-btn-save"
                              style={{
                                backgroundColor: "#2d3c88",
                                color: "white",
                                borderColor: "#4558b7",
                                borderWidth: "0.1px",
                              }}
                              onClick={() => createCategory(id.toString())}
                            >
                              Lưu
                            </Button>
                          )}
                        </div>
                        <div className="wrap-input-categories max-h-[300px] overflow-y-auto pr-2">
                          {categories[id] &&
                            categories[id].map((category, index) => (
                              <div key={index}>
                                <MSInput
                                  ref={(el) => {
                                    if (!refCategories.current[typeId]) {
                                      refCategories.current[typeId] = [];
                                    }
                                    while (
                                      refCategories.current[typeId].length <=
                                      index
                                    ) {
                                      refCategories.current[typeId].push(
                                        React.createRef<{
                                          focus: () => void;
                                          getValue: () => string;
                                          setValue: (value: string) => void;
                                          clear: () => void;
                                        }>()
                                      );
                                    }
                                    refCategories.current[typeId][index] = el!; // vscode ngu:)
                                  }}
                                  label={`Category: ${category.id}`}
                                  placeholder="Enter a category"
                                  type="text"
                                  required
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="wrap-value pt-4">
                        {CT.value && CT.value.length > 0 ? (
                          CT.value.map((value, idex) => (
                            <div
                              key={idex}
                              className="flex justify-center items-center"
                            >
                              {CT.type === "CHECKBOX" && (
                                <input
                                  type="checkbox"
                                  checked
                                  disabled
                                  style={{
                                    transform: "scale(1.5)",
                                    marginRight: "8px",
                                  }}
                                />
                              )}
                              <MSInput
                                className="mb-2 mr-1"
                                type="text"
                                placeholder="Value categories"
                                defaultValue={
                                  value.value ? value.value : "None value"
                                }
                                disabled
                              />
                              <div
                                className="relative group p-2 icon-dots"
                                style={{ width: "32px", flexShrink: 0 }}
                              >
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
                                    onClick={() =>
                                      deleteCategory(value._id ? value._id : "")
                                    }
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
                                  <div
                                    className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                    style={{ color: "#eda22e" }}
                                    onClick={() => handleUpdateCategory(value)}
                                  >
                                    <CiEdit className="mr-2" />
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        minWidth: "32px",
                                      }}
                                    >
                                      Edit
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>
                            Chưa có danh mục nào! <FaHandMiddleFinger />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {isModalSaveOpen && (
        <AdminModal
          isOpen={isModalSaveOpen}
          multiple={false}
          onClose={() => setIsModalSaveOpen(false)}
          fields={fieldCategories}
          enableImageUpload={false}
          onSave={createCategories}
          data={{}}
          title="Create Categories"
        />
      )}
      {isModelUpdateCategoryType && (
        <AdminModal
          isOpen={isModelUpdateCategoryType}
          multiple={false}
          onClose={() => setIsModelUpdateCategoryType(false)}
          fields={fieldCategoryType}
          enableImageUpload={false}
          onSave={updateCategoryType}
          data={editCategoryType}
          title="Update CategoryType"
        />
      )}
      {isModelUpdateCategory && (
        <AdminModal
          isOpen={isModelUpdateCategory}
          multiple={false}
          onClose={() => setIsModelUpdateCategory(false)}
          fields={fileCategory}
          enableImageUpload={false}
          onSave={updateCategory}
          data={editCategory}
          title="Update Category"
        />
      )}
    </div>
  );
};

export default AdminBanner;
