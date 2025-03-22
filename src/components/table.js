import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { Button, Select, Modal, Dropdown, Slider, InputNumber, Space, } from "antd";
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
const Table = ({ columns, fieldSearch, filterPrice = false, isAllowEpand = false, data, handleAction = () => { }, actions, topAcctions, batchExecution, maxRow = 8, }) => {
    // format data
    const [formatData, setFormatData] = useState(data);
    useEffect(() => {
        const updatedData = data.map((d) => {
            const updatedObj = {};
            Object.entries(d).forEach(([key, value]) => {
                if (typeof value === "string" && !isNaN(Number(value))) {
                    updatedObj[key] = Number(value);
                }
                else {
                    updatedObj[key] = value;
                }
            });
            return updatedObj;
        });
        setFormatData(updatedData);
    }, [data]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sliderValues, setSliderValues] = useState({});
    const [rowsPerPage, setRowsPerPage] = useState(maxRow);
    const [columnWidths, setColumnWidths] = useState({});
    const totalPages = Math.ceil(formatData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const [showWidthPopup, setShowWidthPopup] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    // state ref:
    const refValue = useRef(null);
    // dựa vào data đã format kiểm tra có bao nhiêu trường là number để tiến hành viết chức năng lọc khoảng giá,
    //  mỗi trường dạng number sẽ có riêng một cái lọc khoảng giá
    const [filterRanges, setFilterRanges] = useState({});
    useEffect(() => {
        const numericFields = formatData.reduce((fields, item) => {
            Object.entries(item).forEach(([key, value]) => {
                if (typeof value === "number" && !fields.includes(key)) {
                    fields.push(key);
                }
            });
            return fields;
        }, []);
        console.log("numeric: ", numericFields);
        const initialRanges = numericFields.reduce((acc, field) => {
            const values = formatData
                .map((item) => item[field])
                .filter((v) => typeof v === "number");
            const min = Math.min(...values);
            const max = Math.max(...values);
            if (min !== max) {
                acc[field] = { min, max };
            }
            return acc;
        }, {});
        setFilterRanges(initialRanges);
        const initialSliders = Object.keys(initialRanges).reduce((acc, field) => ({
            ...acc,
            [field]: [initialRanges[field].min, initialRanges[field].max],
        }), {});
        setSliderValues(initialSliders);
    }, [formatData]);
    console.log("fillter: ", filterRanges);
    const handleSliderChange = (field, value) => {
        setSliderValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    useEffect(() => {
        const filteredData = formatData.filter((item) => {
            return Object.entries(sliderValues).every(([key, range]) => {
                const value = item[key];
                return (typeof value !== "number" || (value >= range[0] && value <= range[1]));
            });
        });
        setCurrentData(filteredData.slice(startIndex, startIndex + rowsPerPage));
    }, [rowsPerPage, sliderValues, formatData, startIndex]);
    useEffect(() => {
        const filteredData = formatData.filter((item) => {
            return Object.entries(filterRanges).every(([key, range]) => {
                const value = item[key];
                return (typeof value !== "number" ||
                    (value >= range.min && value <= range.max));
            });
        });
        setCurrentData(filteredData.slice(startIndex, startIndex + rowsPerPage));
    }, [filterRanges, formatData, startIndex]);
    useEffect(() => {
        setCurrentData(formatData.slice(startIndex, startIndex + rowsPerPage));
    }, [startIndex]);
    const formatColumnName = (col) => {
        return col
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .trim();
    };
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const handleSort = (columnKey) => {
        let direction = "asc";
        if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: columnKey, direction });
        const sortedData = currentData &&
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
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    // hành động hàng loạt
    const handleSelectActionMany = (value) => {
        if (value === "DELETE") {
            console.log("check delete");
            handleAction(value, selectedBox);
        }
        else {
        }
    };
    const handleSearch = (e) => {
        const term = e.target.value;
        const dataSearch = formatData.slice(startIndex, startIndex + rowsPerPage);
        if (fieldSearch && fieldSearch.length > 0) {
            const results = SearchInput(dataSearch, term, fieldSearch);
            setCurrentData(results);
        }
        else {
            return;
        }
    };
    const handleRowsPerPageChange = (event) => {
        const selectedValue = event;
        setRowsPerPage(selectedValue === "all" ? formatData.length : parseInt(selectedValue));
    };
    // get height element
    const firstDivRef = useRef(null);
    const secondDivRef = useRef(null);
    const [firstHeight, setFirstHeight] = useState(0);
    const [secondHeight, setSecondHeight] = useState(0);
    useEffect(() => {
        if (firstDivRef.current) {
            setFirstHeight(firstDivRef.current.offsetHeight);
        }
        if (secondDivRef.current) {
            setSecondHeight(secondDivRef.current.offsetHeight);
        }
    }, []);
    const [selectedBox, setSelectedBox] = useState([]);
    const handleCheckAll = (checkedAll) => {
        setSelectedBox(checkedAll ? currentData.map((item) => item) : []);
    };
    const handleCheckRow = (row, checked) => {
        setSelectedBox((prev) => checked ? [...prev, row] : prev.filter((item) => item !== row));
    };
    return (_jsxs("div", { style: {
            width: "100%",
            height: "100%",
            background: "white",
        }, children: [_jsxs("div", { ref: firstDivRef, className: "flex bg-primary justify-between items-center px-5 py-3 mb-2", children: [_jsxs("div", { className: "left flex", children: [_jsx("div", { className: "mr-5", children: _jsx(Select, { value: "Th\u1EF1c hi\u1EC7n h\u00E0ng lo\u1EA1t", style: { width: 180 }, onChange: handleSelectActionMany, children: batchExecution &&
                                        batchExecution.length > 0 &&
                                        selectedBox.length > 0 &&
                                        batchExecution.map((item, index) => (_jsx(Option, { value: item.value, children: _jsxs("span", { className: "flex justify-between items-center", children: [item?.icon, item.content] }) }, index))) }) }), filterPrice && (_jsx("div", { className: "filters mr-5", children: _jsx(Dropdown, { overlay: _jsx("div", { className: "bg-white shadow-md p-4 rounded-md", style: { minWidth: "400px" }, children: Object.keys(filterPrice).length > 0 ? (Object.keys(filterRanges).map((field) => {
                                            const range = filterRanges[field];
                                            const stepSize = (range.max - range.min) / 4;
                                            const marks = {
                                                [range.min]: `${range.min}`,
                                                [Math.round(range.min + stepSize)]: `${Math.round(range.min + stepSize)}`,
                                                [Math.round(range.min + stepSize * 2)]: `${Math.round(range.min + stepSize * 2)}`,
                                                [Math.round(range.min + stepSize * 3)]: `${Math.round(range.min + stepSize * 3)}`,
                                                [range.max]: `${range.max}`,
                                            };
                                            return (_jsxs("div", { style: {
                                                    padding: "0px 20px",
                                                    marginBottom: "20px",
                                                }, children: [_jsx("p", { className: "font-medium mb-2 uppercase text-color-secondary", children: `Lọc theo ${field}` }), _jsx(Slider, { range: true, min: range.min, max: range.max, value: sliderValues[field], onChange: (value) => handleSliderChange(field, value), step: 1, tooltip: { formatter: (value) => `${value}` }, marks: marks }), _jsxs(Space, { className: "justify-between w-full", children: [_jsx(InputNumber, { min: range.min, max: range.max, value: sliderValues[field][0], onChange: (value) => handleSliderChange(field, [
                                                                    value,
                                                                    sliderValues[field][1],
                                                                ]) }), _jsx(InputNumber, { min: range.min, max: range.max, value: sliderValues[field][1], onChange: (value) => handleSliderChange(field, [
                                                                    sliderValues[field][0],
                                                                    value,
                                                                ]) })] })] }, field));
                                        })) : (_jsx("div", { children: "Ch\u1EC9 c\u00F3 duy nh\u1EA5t m\u1ED9t kho\u1EA3ng gi\u00E1" })) }), trigger: ["click"], placement: "bottomRight", children: _jsx(Button, { icon: _jsx(TbFilterDollar, {}), children: "L\u1ECDc theo kho\u1EA3ng gi\u00E1" }) }) })), isAllowEpand && (_jsx("div", { className: "expend", children: _jsx(Button, { icon: _jsx(IoSettingsOutline, {}), onClick: () => setShowWidthPopup(true), children: "Tu\u1EF3 ch\u1EC9nh chi\u1EC1u r\u1ED9ng" }) }))] }), _jsx("div", { className: "flex right", children: _jsx(MSInput, { ref: refValue, placeholder: "T\u00ECm ki\u1EBFm...", type: "text", leftIcon: HiOutlineSearch, onChangeInput: handleSearch }) })] }), _jsx("div", { className: "wrap-container-table bg-primary relative px-5 py-3 mb-2", style: {
                    overflowX: "auto",
                    height: `calc(100% - ${firstHeight}px - ${secondHeight}px - 16px)`,
                    maxHeight: `calc(100% - ${firstHeight}px - ${secondHeight}px - 16px)`,
                }, children: _jsx("div", { style: { width: "100%", position: "relative" }, children: _jsxs("table", { style: {
                            width: "100%",
                            maxWidth: "1600px",
                            tableLayout: "auto",
                            borderCollapse: "separate",
                            borderSpacing: 0,
                            fontSize: "12px",
                            border: "0.4px solid #d9d9d9",
                        }, border: 1, children: [_jsx("thead", { children: _jsxs("tr", { style: {
                                        borderLeft: "0.4px solid #d9d9d9",
                                        borderTop: "0.4px solid #d9d9d9",
                                        color: "var(--color__secondary)",
                                        background: "white",
                                    }, children: [_jsx("th", { style: {
                                                position: "sticky",
                                                zIndex: 2,
                                                left: 0,
                                                width: "42px",
                                                borderLeft: "0.4px solid #d9d9d9",
                                                borderTop: "0.4px solid #d9d9d9",
                                                padding: "8px",
                                                textAlign: "center",
                                                background: "white",
                                            }, children: _jsx("input", { className: "cursor-pointer", type: "checkbox", onChange: (e) => handleCheckAll(e.target.checked), checked: selectedBox.length === currentData.length, style: { transform: "scale(1.2)" } }) }), _jsx("th", { style: {
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
                                            }, children: "ID" }), columns.map((col, index) => (_jsx("th", { style: {
                                                minWidth: "100px",
                                                padding: "8px",
                                                textAlign: "center",
                                                borderLeft: "0.4px solid #d9d9d9",
                                                borderTop: "0.4px solid #d9d9d9",
                                                width: columnWidths[col] || "auto",
                                            }, className: "uppercase cursor-pointer hover:bg-[#f2f9ff]", onClick: () => handleSort(col), children: _jsxs("span", { className: "flex justify-center items-center", children: [formatColumnName(col), _jsxs("div", { className: "relative ml-1", children: [_jsx(IoCaretUpOutline, { className: "absolute top-[-10px] opacity-[0.4]", style: {
                                                                    opacity: sortConfig.key === col &&
                                                                        sortConfig.direction === "asc"
                                                                        ? "1"
                                                                        : "0.4",
                                                                } }), _jsx(IoCaretDownOutline, { className: "absolute top-[-2px] opacity-[0.4]", style: {
                                                                    opacity: sortConfig.key === col &&
                                                                        sortConfig.direction === "desc"
                                                                        ? "1"
                                                                        : "0.4",
                                                                } })] })] }) }, index))), _jsx("th", { style: {
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
                                            }, children: _jsx("div", { className: "relative w-[28px] group p-2 icon-dots z-10", children: _jsx(IoSettingsOutline, { className: "cursor-pointer" }) }) })] }) }), currentData && currentData.length > 0 ? (_jsx("tbody", { style: { backgroundColor: "white" }, children: currentData.map((row, rowIndex) => (_jsxs("tr", { className: "body-table", style: {
                                        borderLeft: "0.4px solid #d9d9d9",
                                        borderTop: "0.4px solid #d9d9d9",
                                        color: "#1e2753",
                                    }, children: [_jsx("td", { style: {
                                                position: "sticky",
                                                zIndex: 2,
                                                left: 0,
                                                width: "42px",
                                                borderLeft: "0.4px solid #d9d9d9",
                                                borderTop: "0.4px solid #d9d9d9",
                                                padding: "8px",
                                                textAlign: "center",
                                                background: "white",
                                            }, children: _jsx("input", { className: "cursor-pointer", type: "checkbox", onChange: (e) => handleCheckRow(row, e.target.checked), checked: selectedBox.includes(row), style: { transform: "scale(1.2)" } }) }), _jsx("td", { style: {
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
                                            }, children: startIndex + rowIndex + 1 }), columns.map((col, colIndex) => (_jsx("td", { style: {
                                                padding: "8px",
                                                textAlign: "center",
                                                borderLeft: "0.4px solid #d9d9d9",
                                                borderTop: "0.4px solid #d9d9d9",
                                                fontWeight: !isNaN(Number(row[col]))
                                                    ? "bold"
                                                    : "normal",
                                            }, children: col === "image" ? (_jsx("div", { style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx("img", { src: row[col], alt: row[col], style: {
                                                        width: "220px",
                                                        height: "42px",
                                                        marginRight: "8px",
                                                    } }) })) : col === "video" ? (_jsx("div", { style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx("video", { src: row[col], controls: true, style: {
                                                        width: "220px",
                                                        height: "42px",
                                                        marginRight: "8px",
                                                    } }) })) : (row[col]) }, colIndex))), _jsx("td", { style: {
                                                position: "sticky",
                                                zIndex: 2,
                                                right: 0,
                                                width: "42px",
                                                borderLeft: "0.4px solid #d9d9d9",
                                                borderTop: "0.4px solid #d9d9d9",
                                                padding: "8px",
                                                textAlign: "center",
                                                background: "white",
                                            }, children: _jsxs("div", { className: "relative w-[28px] group p-2 icon-dots z-10", children: [_jsx(HiDotsVertical, { className: "cursor-pointer" }), _jsx("div", { className: "absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10", style: {
                                                            top: `${topAcctions ? topAcctions : "-40"}px`,
                                                            right: "40px",
                                                        }, children: actions &&
                                                            actions.length > 0 &&
                                                            actions.map((action, id) => (_jsxs("div", { className: "flex text-color-primary items-center py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => handleAction(action.action, row), children: [_jsx("p", { className: "hover-action", title: action.title, style: action.style, children: action.icon }, id), _jsx("div", { className: "text-start", style: {
                                                                            fontSize: "12px",
                                                                            minWidth: "100px",
                                                                        }, children: action.title })] }, id))) })] }) })] }, rowIndex))) })) : (_jsx("tbody", { children: _jsx("tr", { style: { height: "45px" }, children: _jsx("th", { style: { border: "0.4px solid #d9d9d9" }, colSpan: columns.length + 3, children: "No data" }) }) }))] }) }) }), _jsxs("div", { ref: secondDivRef, className: "flex justify-between bg-primary items-center px-5 py-3", children: [_jsx("div", { className: "", children: _jsxs(Select, { onChange: handleRowsPerPageChange, defaultValue: maxRow.toString(), style: { width: 84 }, children: [_jsx(Option, { value: "5", children: "5" }), _jsx(Option, { value: "10", children: "10" }), _jsx(Option, { value: "20", children: "20" }), _jsx(Option, { value: "50", children: "50" }), _jsx(Option, { value: "all", children: "All" })] }) }), _jsx("div", { className: "flex justify-center items-center", children: formatData.length > rowsPerPage && (_jsxs("div", { children: [_jsx(Button, { disabled: currentPage === 1, onClick: () => handlePageChange(1), className: "mr-2", children: _jsx(FaAnglesLeft, {}) }), _jsx(Button, { disabled: currentPage === 1, onClick: () => handlePageChange(currentPage - 1), children: _jsx(FaAngleLeft, {}) }), _jsxs("span", { style: { margin: "0 16px" }, children: [currentPage, " / ", totalPages] }), _jsx(Button, { disabled: currentPage === totalPages, onClick: () => handlePageChange(currentPage + 1), children: _jsx(FaAngleRight, {}) }), _jsx(Button, { disabled: currentPage === totalPages, onClick: () => handlePageChange(totalPages), className: "ml-2", children: _jsx(FaAnglesRight, {}) })] })) })] }), _jsx(Modal, { title: "T\u00F9y ch\u1EC9nh chi\u1EC1u r\u1ED9ng c\u1ED9t", open: showWidthPopup, onCancel: () => setShowWidthPopup(false), onOk: () => setShowWidthPopup(false), children: columns.map((col) => (_jsxs("div", { style: { marginBottom: "8px" }, children: [_jsx("label", { children: formatColumnName(col) }), _jsx("input", { type: "text", placeholder: "Nh\u1EADp chi\u1EC1u r\u1ED9ng (px, %, auto)", value: columnWidths[col] || "", onChange: (e) => setColumnWidths({ ...columnWidths, [col]: e.target.value }), style: { width: "100%" } })] }, col))) })] }));
};
export default Table;
