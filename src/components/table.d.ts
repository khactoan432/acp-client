import React from "react";
import "../styles/table.scss";
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
declare const Table: <T extends Record<string, any>>({ columns, fieldSearch, filterPrice, isAllowEpand, data, handleAction, actions, topAcctions, batchExecution, maxRow, }: TableProps<T>) => import("react/jsx-runtime").JSX.Element;
export default Table;
