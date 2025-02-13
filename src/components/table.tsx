import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Select,
  Modal,
  Dropdown,
  Slider,
  InputNumber,
  Space,
} from "antd";

// import component
import MSInput from "./input/MsInput";
import SearchInput from "./input/SeachInput";

// import icons react
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { IoCaretDownOutline } from "react-icons/io5";
import { IoCaretUpOutline } from "react-icons/io5";
import { TbFilterDollar } from "react-icons/tb";
import { HiDotsVertical } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineSearch } from "react-icons/hi";

import "../styles/table.scss";

const { Option } = Select;

interface Action {
  title: string;
  action: string;
  icon: JSX.Element;
  style: React.CSSProperties;
}

interface batchExecution {
  value: string;
  icon?: JSX.Element;
  content: string;
}

interface TableProps<T> {
  columns: string[];
  fieldSearch?: string[];
  filterPrice?: boolean;
  isAllowEpand?: boolean;
  data: T[];
  handleAction?: (type: string, row: T | T[]) => void;
  actions: Action[];
  topAcctions?: string;
  batchExecution: batchExecution[];
  maxRow?: number;
}

const Table = <T extends Record<string, any>>({
  columns,
  fieldSearch,
  filterPrice = false,
  isAllowEpand = false,
  data,
  handleAction = () => {},
  actions,
  topAcctions,
  batchExecution,
  maxRow = 8,
}: TableProps<T>) => {
  // format data
  const [formatData, setFormatData] = useState<T[]>(data);
  useEffect(() => {
    const updatedData = data.map((d) => {
      const updatedObj: Record<string, any> = {};
      Object.entries(d).forEach(([key, value]) => {
        if (typeof value === "string" && !isNaN(Number(value))) {
          updatedObj[key] = Number(value);
        } else {
          updatedObj[key] = value;
        }
      });

      return updatedObj as T;
    });

    setFormatData(updatedData);
  }, [data]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sliderValues, setSliderValues] = useState<
    Record<string, [number, number]>
  >({});
  const [rowsPerPage, setRowsPerPage] = useState(maxRow);
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const totalPages = Math.ceil(formatData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const [showWidthPopup, setShowWidthPopup] = useState(false);
  const [currentData, setCurrentData] = useState<T[]>([]);

  // state ref:
  const refValue = useRef<{
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
  }>(null);
  // dựa vào data đã format kiểm tra có bao nhiêu trường là number để tiến hành viết chức năng lọc khoảng giá,
  //  mỗi trường dạng number sẽ có riêng một cái lọc khoảng giá
  const [filterRanges, setFilterRanges] = useState<
    Record<string, { min: number; max: number }>
  >({});

  useEffect(() => {
    const numericFields = formatData.reduce<string[]>((fields, item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === "number" && !fields.includes(key)) {
          fields.push(key);
        }
      });
      return fields;
    }, []);
    console.log("numeric: ", numericFields);

    const initialRanges = numericFields.reduce((acc: any, field) => {
      const values = formatData
        .map((item) => item[field])
        .filter((v) => typeof v === "number") as number[];
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (min !== max) {
        acc[field] = { min, max };
      }

      return acc;
    }, {});

    setFilterRanges(initialRanges);
    const initialSliders = Object.keys(initialRanges).reduce(
      (acc, field) => ({
        ...acc,
        [field]: [initialRanges[field].min, initialRanges[field].max],
      }),
      {}
    );

    setSliderValues(initialSliders);
  }, [formatData]);
  console.log("fillter: ", filterRanges);
  const handleSliderChange = (field: string, value: [number, number]) => {
    setSliderValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const filteredData = formatData.filter((item) => {
      return Object.entries(sliderValues).every(([key, range]) => {
        const value = item[key];
        return (
          typeof value !== "number" || (value >= range[0] && value <= range[1])
        );
      });
    });

    setCurrentData(filteredData.slice(startIndex, startIndex + rowsPerPage));
  }, [rowsPerPage, sliderValues, formatData, startIndex]);

  useEffect(() => {
    const filteredData = formatData.filter((item) => {
      return Object.entries(filterRanges).every(([key, range]) => {
        const value = item[key];
        return (
          typeof value !== "number" ||
          (value >= range.min && value <= range.max)
        );
      });
    });

    setCurrentData(filteredData.slice(startIndex, startIndex + rowsPerPage));
  }, [filterRanges, formatData, startIndex]);

  useEffect(() => {
    setCurrentData(formatData.slice(startIndex, startIndex + rowsPerPage));
  }, [startIndex]);

  const formatColumnName = (col: string) => {
    return col
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .trim();
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const handleSort = (columnKey: string) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key: columnKey, direction });

    const sortedData =
      currentData &&
      [...currentData].sort((a, b) => {
        const aValue = a[columnKey];
        const bValue = b[columnKey];

        // Kiểm tra kiểu dữ liệu là số hay chuỗi
        if (typeof aValue === "number" && typeof bValue === "number") {
          return direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Xử lý sắp xếp chuỗi
        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue < bValue) {
            return direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return direction === "asc" ? 1 : -1;
          }
        }

        return 0; // Trường hợp bằng nhau
      });

    setCurrentData(sortedData);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // hành động hàng loạt
  const handleSelectActionMany = (value: string) => {
    if (value === "DELETE") {
      console.log("check delete");
      handleAction(value, selectedBox);
    } else {
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const dataSearch = formatData.slice(startIndex, startIndex + rowsPerPage);
    if (fieldSearch && fieldSearch.length > 0) {
      const results = SearchInput(dataSearch, term, fieldSearch);
      setCurrentData(results);
    } else {
      return;
    }
  };

  const handleRowsPerPageChange = (event: string) => {
    const selectedValue = event;
    setRowsPerPage(
      selectedValue === "all" ? formatData.length : parseInt(selectedValue)
    );
  };

  // get height element
  const firstDivRef = useRef<HTMLDivElement>(null);
  const secondDivRef = useRef<HTMLDivElement>(null);
  const [firstHeight, setFirstHeight] = useState<number>(0);
  const [secondHeight, setSecondHeight] = useState<number>(0);

  useEffect(() => {
    if (firstDivRef.current) {
      setFirstHeight(firstDivRef.current.offsetHeight);
    }
    if (secondDivRef.current) {
      setSecondHeight(secondDivRef.current.offsetHeight);
    }
  }, []);
  const [selectedBox, setSelectedBox] = useState<T[]>([]);
  const handleCheckAll = (checkedAll: boolean) => {
    setSelectedBox(checkedAll ? currentData.map((item) => item) : []);
  };

  const handleCheckRow = (row: T, checked: boolean) => {
    setSelectedBox((prev) =>
      checked ? [...prev, row] : prev.filter((item) => item !== row)
    );
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
      }}
    >
      <div
        ref={firstDivRef}
        className="flex bg-primary justify-between items-center px-5 py-3 mb-2"
      >
        <div className="left flex">
          <div className="mr-5">
            <Select
              value="Thực hiện hàng loạt"
              style={{ width: 180 }}
              onChange={handleSelectActionMany}
            >
              {batchExecution &&
                batchExecution.length > 0 &&
                selectedBox.length > 0 &&
                batchExecution.map((item, index) => (
                  <Option key={index} value={item.value}>
                    <span className="flex justify-between items-center">
                      {item?.icon}
                      {item.content}
                    </span>
                  </Option>
                ))}
            </Select>
          </div>
          {filterPrice && (
            <div className="filters mr-5">
              <Dropdown
                overlay={
                  <div
                    className="bg-white shadow-md p-4 rounded-md"
                    style={{ minWidth: "400px" }}
                  >
                    {Object.keys(filterPrice).length > 0 ? (
                      Object.keys(filterRanges).map((field) => {
                        const range = filterRanges[field];
                        const stepSize = (range.max - range.min) / 4;
                        const marks = {
                          [range.min]: `${range.min}`,
                          [Math.round(range.min + stepSize)]: `${Math.round(
                            range.min + stepSize
                          )}`,
                          [Math.round(range.min + stepSize * 2)]: `${Math.round(
                            range.min + stepSize * 2
                          )}`,
                          [Math.round(range.min + stepSize * 3)]: `${Math.round(
                            range.min + stepSize * 3
                          )}`,
                          [range.max]: `${range.max}`,
                        };

                        return (
                          <div
                            key={field}
                            style={{
                              padding: "0px 20px",
                              marginBottom: "20px",
                            }}
                          >
                            <p className="font-medium mb-2 uppercase text-color-secondary">{`Lọc theo ${field}`}</p>
                            <Slider
                              range
                              min={range.min}
                              max={range.max}
                              value={sliderValues[field]}
                              onChange={(value) =>
                                handleSliderChange(
                                  field,
                                  value as [number, number]
                                )
                              }
                              step={1}
                              tooltip={{ formatter: (value) => `${value}` }}
                              marks={marks} // Thêm mốc vào đây
                            />
                            <Space className="justify-between w-full">
                              <InputNumber
                                min={range.min}
                                max={range.max}
                                value={sliderValues[field][0]}
                                onChange={(value) =>
                                  handleSliderChange(field, [
                                    value!,
                                    sliderValues[field][1],
                                  ])
                                }
                              />
                              <InputNumber
                                min={range.min}
                                max={range.max}
                                value={sliderValues[field][1]}
                                onChange={(value) =>
                                  handleSliderChange(field, [
                                    sliderValues[field][0],
                                    value!,
                                  ])
                                }
                              />
                            </Space>
                          </div>
                        );
                      })
                    ) : (
                      <div>Chỉ có duy nhất một khoảng giá</div>
                    )}
                  </div>
                }
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button icon={<TbFilterDollar />}>Lọc theo khoảng giá</Button>
              </Dropdown>
            </div>
          )}
          {isAllowEpand && (
            <div className="expend">
              <Button
                icon={<IoSettingsOutline />}
                onClick={() => setShowWidthPopup(true)}
              >
                Tuỳ chỉnh chiều rộng
              </Button>
            </div>
          )}
        </div>
        <div className="flex right">
          <MSInput
            ref={refValue}
            placeholder="Tìm kiếm..."
            type="text"
            leftIcon={HiOutlineSearch}
            onChangeInput={handleSearch}
          />
        </div>
      </div>
      <div
        className="wrap-container-table bg-primary relative px-5 py-3 mb-2"
        style={{
          overflowX: "auto",
          height: `calc(100% - ${firstHeight}px - ${secondHeight}px - 16px)`,
          maxHeight: `calc(100% - ${firstHeight}px - ${secondHeight}px - 16px)`,
        }}
      >
        <div style={{ width: "100%", position: "relative" }}>
          <table
            style={{
              width: "100%",
              maxWidth: "1600px",
              tableLayout: "auto",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: "12px",
              border: "0.4px solid #d9d9d9",
            }}
            border={1}
          >
            <thead>
              <tr
                style={{
                  borderLeft: "0.4px solid #d9d9d9",
                  borderTop: "0.4px solid #d9d9d9",
                  color: "var(--color__secondary)",
                  background: "white",
                }}
              >
                <th
                  style={{
                    position: "sticky",
                    zIndex: 2,
                    left: 0,
                    width: "42px",
                    borderLeft: "0.4px solid #d9d9d9",
                    borderTop: "0.4px solid #d9d9d9",
                    padding: "8px",
                    textAlign: "center",
                    background: "white",
                  }}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    onChange={(e) => handleCheckAll(e.target.checked)}
                    checked={selectedBox.length === currentData.length}
                    style={{ transform: "scale(1.2)" }}
                  />
                </th>
                <th
                  style={{
                    position: "sticky",
                    left: "42px",
                    zIndex: 2,
                    width: "42px",
                    padding: "8px",
                    textAlign: "center",
                    borderLeft: "0.4px solid #d9d9d9",
                    borderTop: "0.4px solid #d9d9d9",
                    borderRight: "0.4px solid #d9d9d9",
                    color: "var(--color__secondary)",
                    background: "white",
                  }}
                >
                  ID
                </th>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{
                      minWidth: "100px",
                      padding: "8px",

                      textAlign: "center",
                      borderLeft: "0.4px solid #d9d9d9",
                      borderTop: "0.4px solid #d9d9d9",
                      width: columnWidths[col] || "auto",
                    }}
                    className="uppercase cursor-pointer hover:bg-[#f2f9ff]"
                    onClick={() => handleSort(col)}
                  >
                    <span className="flex justify-center items-center">
                      {formatColumnName(col)}
                      <div className="relative ml-1">
                        <IoCaretUpOutline
                          className="absolute top-[-10px] opacity-[0.4]"
                          style={{
                            opacity:
                              sortConfig.key === col &&
                              sortConfig.direction === "asc"
                                ? "1"
                                : "0.4",
                          }}
                        />
                        <IoCaretDownOutline
                          className="absolute top-[-2px] opacity-[0.4]"
                          style={{
                            opacity:
                              sortConfig.key === col &&
                              sortConfig.direction === "desc"
                                ? "1"
                                : "0.4",
                          }}
                        />
                      </div>
                    </span>
                  </th>
                ))}
                <th
                  style={{
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                    width: "42px",
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "0.4px solid #d9d9d9",
                    borderTop: "0.4px solid #d9d9d9",
                    borderLeft: "0.4px solid #d9d9d9",
                    color: "var(--color__secondary)",
                    background: "white",
                  }}
                >
                  <div className="relative w-[28px] group p-2 icon-dots z-10">
                    <IoSettingsOutline className="cursor-pointer" />
                  </div>
                </th>
              </tr>
            </thead>
            {currentData && currentData.length > 0 ? (
              <tbody style={{ backgroundColor: "white" }}>
                {currentData.map((row, rowIndex) => (
                  <tr
                    className="body-table"
                    key={rowIndex}
                    style={{
                      borderLeft: "0.4px solid #d9d9d9",
                      borderTop: "0.4px solid #d9d9d9",
                      color: "#1e2753",
                    }}
                  >
                    <td
                      style={{
                        position: "sticky",
                        zIndex: 2,
                        left: 0,
                        width: "42px",
                        borderLeft: "0.4px solid #d9d9d9",
                        borderTop: "0.4px solid #d9d9d9",
                        padding: "8px",
                        textAlign: "center",
                        background: "white",
                      }}
                    >
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        onChange={(e) => handleCheckRow(row, e.target.checked)}
                        checked={selectedBox.includes(row)}
                        style={{ transform: "scale(1.2)" }}
                      />
                    </td>
                    <td
                      style={{
                        position: "sticky",
                        zIndex: 2,
                        left: "42px",
                        width: "42px",
                        borderLeft: "0.4px solid #d9d9d9",
                        borderTop: "0.4px solid #d9d9d9",
                        borderRight: "0.4px solid #d9d9d9",
                        padding: "8px",
                        textAlign: "center",
                        background: "white",
                      }}
                    >
                      {startIndex + rowIndex + 1}
                    </td>
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderLeft: "0.4px solid #d9d9d9",
                          borderTop: "0.4px solid #d9d9d9",
                          fontWeight: !isNaN(Number(row[col]))
                            ? "bold"
                            : "normal",
                        }}
                      >
                        {col === "image" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={row[col]}
                              alt={row[col]}
                              style={{
                                width: "220px",
                                height: "42px",
                                marginRight: "8px",
                              }}
                            />
                          </div>
                        ) : col === "video" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <video
                              src={row[col]}
                              controls
                              style={{
                                width: "220px",
                                height: "42px",
                                marginRight: "8px",
                              }}
                            />
                          </div>
                        ) : (
                          row[col]
                        )}
                      </td>
                    ))}
                    <td
                      style={{
                        position: "sticky",
                        zIndex: 2,
                        right: 0,
                        width: "42px",
                        borderLeft: "0.4px solid #d9d9d9",
                        borderTop: "0.4px solid #d9d9d9",
                        padding: "8px",
                        textAlign: "center",
                        background: "white",
                      }}
                    >
                      <div className="relative w-[28px] group p-2 icon-dots z-10">
                        <HiDotsVertical className="cursor-pointer" />
                        <div
                          className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10"
                          style={{
                            top: `${topAcctions ? topAcctions : "-40"}px`,
                            right: "40px",
                          }}
                        >
                          {actions &&
                            actions.length > 0 &&
                            actions.map((action, id) => (
                              <div
                                key={id}
                                className="flex text-color-primary items-center py-1 hover:bg-gray-100 cursor-pointer rounded"
                                onClick={() => handleAction(action.action, row)}
                              >
                                <p
                                  key={id}
                                  className="hover-action"
                                  title={action.title}
                                  style={action.style}
                                >
                                  {action.icon}
                                </p>
                                <div
                                  className="text-start"
                                  style={{
                                    fontSize: "12px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {action.title}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr style={{ height: "45px" }}>
                  <th
                    style={{ border: "0.4px solid #d9d9d9" }}
                    colSpan={columns.length + 3}
                  >
                    No data
                  </th>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
      <div
        ref={secondDivRef}
        className="flex justify-between bg-primary items-center px-5 py-3"
      >
        <div className="">
          <Select
            onChange={handleRowsPerPageChange}
            defaultValue={maxRow.toString()}
            style={{ width: 84 }}
          >
            <Option value="5">5</Option>
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
            <Option value="all">All</Option>
          </Select>
        </div>
        <div className="flex justify-center items-center">
          {formatData.length > rowsPerPage && (
            <div>
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
                className="mr-2"
              >
                <FaAnglesLeft />
              </Button>
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FaAngleLeft />
              </Button>
              <span style={{ margin: "0 16px" }}>
                {currentPage} / {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FaAngleRight />
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="ml-2"
              >
                <FaAnglesRight />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        title="Tùy chỉnh chiều rộng cột"
        open={showWidthPopup}
        onCancel={() => setShowWidthPopup(false)}
        onOk={() => setShowWidthPopup(false)}
      >
        {columns.map((col) => (
          <div key={col} style={{ marginBottom: "8px" }}>
            <label>{formatColumnName(col)}</label>
            <input
              type="text"
              placeholder="Nhập chiều rộng (px, %, auto)"
              value={columnWidths[col] || ""}
              onChange={(e) =>
                setColumnWidths({ ...columnWidths, [col]: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Table;
