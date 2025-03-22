import React from "react";
type StructData = {
    name: string;
    placeholder?: string;
    label?: string;
    options?: {
        option: string;
        value?: string[];
    }[];
    value?: any;
    type: "IMAGE" | "VIDEO" | "OPTION" | "INPUT" | "ARRAY";
    typeText?: "text" | "email" | "number" | "tel";
};
type AdminModalProps = {
    action: "CREATE" | "UPDATE";
    isOpen: boolean;
    onClose: () => void;
    structData: StructData[];
    onSave: (data: Record<string, any>) => void;
    title: string;
};
declare const AdminModalV2: React.FC<AdminModalProps>;
export default AdminModalV2;
