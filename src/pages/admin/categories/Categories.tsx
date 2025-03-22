import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

// import icon react
import { HiDotsVertical } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { FiTrash } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FaHandMiddleFinger } from "react-icons/fa6";

// import antd
import { Button } from "antd";

// impoprt component
import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";
import Loading from "../../../components/loading";
import MSInput from "../../../components/input/MsInput";
import ButtonPlus from "../../../components/button/plus";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
import { TypeInput } from "../../../constants/TypeEnum";

import { getData, postData, putData, deleteData } from "../../../axios";

interface CategoryType {
  _id?: string;
  option?: string;
  type?: string;
  categories?: Category[];
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
  const [isModalCreateCategoryType, setIsModalCreateCategoryType] =
    useState(false);
  const [isModalUpdateCategoryType, setIsModalUpdateCategoryType] =
    useState(false);
  const [isModalUpdateCategory, setIsModalUpdateCategory] = useState(false);

  // string state
  const [idCategoryType, setIdCategoryType] = useState<string>("");
  const [idCategory, setIdCategory] = useState<string>("");

  // state store
  const [categoryType, setCategoryType] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});

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
  const [structCategoryType, setStructCategoryType] = useState([
    {
      name: "option",
      placeholder: "Nhập danh mục tìm kiếm.",
      label: "Danh mục tìm kiếm.",
      value: "",
      type: TypeInput.INPUT,
    },
    {
      name: "type",
      label: "Chọn",
      options: [{ option: "CHECKBOX" }, { option: "STRING" }],
      value: "",
      type: TypeInput.OPTION,
    },
    {
      name: "categories",
      placeholder: "Nhập danh mục",
      label: "Thêm danh mục",
      value: [],
      type: TypeInput.ARRAY,
    },
  ]);

  const [structCategory, setStructCategory] = useState([
    {
      name: "value",
      placeholder: "Nhập vào danh mục",
      label: "Danh mục",
      value: "",
      type: TypeInput.INPUT,
    },
  ]);

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
    setIsLoading(true);
    try {
      const option = data.option || "";
      const type = data.type[0].type || "";
      const categories = data.categories.map((d) => ({
        _id: "",
        value: d.value,
      }));
      if (!option || !type || !categories[0].value) {
        toast.warning("Invalid input");
        return;
      }
      await postData(
        "/api/admin/categories",
        {
          option,
          type,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
          },
        }
      );
      toast.success("Tạo mới loại danh mục thành công");
    } catch (e) {
      toast.error("Tạo mới danh mục thất bại, kiểm tra lại!", e.message);
      console.log("Error create categories", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
    }
  };

  const createCategory = async (idex: string) => {
    const value = refCategories.current[idex].map((d) => d.getValue());

    const category = value.map((val) => ({
      _id: "",
      value: val,
    }));
    const id = idCategoryType;
    const check = !category.some((cate) => !cate.value);

    if (!id || !check) {
      toast.warning("Invalid input");
      return;
    }
    try {
      setIsLoading(true);
      await putData(
        `/api/admin/categories/${id}`,
        {
          categories: category,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      toast.success("Tạo mới danh mục thành công");
    } catch (e) {
      toast.error("Tạo mới danh mục thất bại, kiểm tra lại!", e.message);
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
    console.log("categoryType", categoryType);
    const id = categoryType._id ? categoryType._id : "";

    setIdCategoryType(id);
    setIsModalUpdateCategoryType(true);
    const updatedStructData = structCategoryType.map((field) => {
      if (categoryType.hasOwnProperty(field.name)) {
        if (Array.isArray(categoryType[field.name])) {
          return {
            ...field,
            value: categoryType[field.name].map((item: any) => ({
              desc: item.value,
              _id: item._id,
            })),
          };
        }
        return {
          ...field,
          value: categoryType[field.name],
        };
      }
      return field;
    });
    setStructCategoryType(updatedStructData);
  };

  const updateCategoryType = async (data: any) => {
    const id = idCategoryType;
    const type = data.allSelectedOption[0].type;
    const option = data.option;
    const value = data.categories;

    if (!type || !option) {
      toast.warning("Missing option || type");
      return;
    }
    try {
      setIsLoading(true);
      await putData(
        `/api/admin/categories/${id}`,
        {
          option: option,
          type: type,
          categories: value,
        },
        {
          headers: { Authorization: `Bearer ${header}` },
        }
      );
      toast.success("Cập nhật loại danh mục thành công");
    } catch (e) {
      toast.error("Cập nhật loại danh mục thất bại, kiểm tra lại!", e.message);
      console.log("Error update categoryType", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdCategoryType("");
    }
  };

  const handleUpdateCategory = (category: Category) => {
    const _id = category._id;
    setIdCategory(_id);

    setIsModalUpdateCategory(true);
    const updatedStructData = structCategory.map((field) => {
      if (category.hasOwnProperty(field.name)) {
        return {
          ...field,
          value: category[field.name],
        };
      }
      return field;
    });
    setStructCategory(updatedStructData);
  };

  const updateCategory = async (data: any) => {
    const id = idCategory;
    const value = data.value;
    setIsLoading(true);
    try {
      await putData(
        `/api/admin/category/${id}`,
        { value },
        { headers: { Authorization: `Bearer ${header}` } }
      );
      toast.success("Cập nhật danh mục thành công");
    } catch (e) {
      toast.error("Cập nhật danh mục thất bại, kiểm tra lại!", e.message);
      console.log("Error update category", e);
    } finally {
      setIsFetchData(!isFetchData);
      setIsLoading(false);
      setIdCategory("");
    }
  };

  // handle delete
  const deleteCategoryType = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteData(`/api/admin/categoryType/${id}`, {
        headers: { Authorization: `Bearer ${header}` },
      });
      toast.success("Xoá loại danh mục thành công");
    } catch (e) {
      toast.error("Xoá loại danh mục thất bại, kiểm tra lại!", e.message);
      console.log("Error delete categoryType", e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteData(`/api/admin/category/${id}`, {
        headers: { Authorization: `Bearer ${header}` },
      });
      toast.success("Xoá danh mục thành công");
    } catch (e) {
      toast.error("Xoá danh mục thất bại, kiểm tra lại!", e.message);
      console.log("Error delete category", e);
    } finally {
      setIsLoading(false);
      setIsFetchData(!isFetchData);
    }
  };

  // func other

  // get height element
  const headerRef = useRef<HTMLDivElement>(null); // Create a ref for the header div
  const [minHeight, setMinHeight] = useState(0); // State to store the height

  useEffect(() => {
    if (headerRef.current) {
      setMinHeight(headerRef.current.offsetHeight + 8);
    }
  }, []);
  console.log("categoryType: ", categoryType);
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
                  onClick={() => setIsModalCreateCategoryType(true)}
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
                                top: "32px",
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
                                      refCategories.current[typeId][index] =
                                        el!; // vscode ngu:)
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
                          {CT.categories && CT.categories.length > 0 ? (
                            CT.categories.map((value, idex) => (
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
                                  className="relative group p-2 icon-dots mb-2"
                                  style={{ width: "32px", flexShrink: 0 }}
                                >
                                  <HiDotsVertical className="cursor-pointer" />
                                  <div
                                    className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10"
                                    style={{
                                      top: "32px",
                                      right: 0,
                                    }}
                                  >
                                    <div
                                      className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                                      style={{ color: "red" }}
                                      onClick={() =>
                                        deleteCategory(
                                          value._id ? value._id : ""
                                        )
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
                                      onClick={() =>
                                        handleUpdateCategory(value)
                                      }
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
      </div>
      {isModalCreateCategoryType && (
        <AdminModalV2
          action="CREATE"
          isOpen={isModalCreateCategoryType}
          onClose={() => setIsModalCreateCategoryType(false)}
          structData={structCategoryType}
          onSave={createCategories}
          title="Tạo mới loại danh mục lọc"
        />
      )}
      {isModalUpdateCategoryType && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateCategoryType}
          onClose={() => setIsModalUpdateCategoryType(false)}
          structData={structCategoryType}
          onSave={updateCategoryType}
          title="Cập nhật loại danh mục lọc"
        />
      )}
      {isModalUpdateCategory && (
        <AdminModalV2
          action="UPDATE"
          isOpen={isModalUpdateCategory}
          onClose={() => setIsModalUpdateCategory(false)}
          structData={structCategory}
          onSave={updateCategory}
          title="Cập nhật danh mục lọc"
        />
      )}
    </div>
  );
};

export default AdminBanner;
