import { toast } from "react-toastify";

interface InputData {
  [key: string]: string | string[] | Record<string, any> | null | undefined;
}

const validateInput = (data: InputData): boolean => {
  const validateValue = (key: string, value: any): boolean => {
    if (typeof value === "string") {
      if (!value.trim()) {
        toast.warning(`${key} chưa hợp lệ`);
        return false;
      }
    } else if (Array.isArray(value)) {
      if (!value.length) {
        toast.warning(`${key} chưa hợp lệ`);
        return false;
      }
    } else if (typeof value === "object" && value !== null) {
      if (
        !Object.keys(value).length ||
        Object.values(value).some((item) => !item)
      ) {
        toast.warning(`${key} chưa hợp lệ`);
        return false;
      }
    } else if (value === null || value === undefined) {
      toast.warning(`${key} chưa hợp lệ`);
      return false;
    }
    return true;
  };

  for (const [key, value] of Object.entries(data)) {
    if (!validateValue(key, value)) {
      return false;
    }
  }

  return true;
};

export default validateInput;
