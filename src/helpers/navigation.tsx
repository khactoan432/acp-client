// navigationHelper.ts
import { NavigateFunction } from "react-router-dom";

let navigate: NavigateFunction | null = null;

export const setNavigate = (navigateFn: NavigateFunction) => {
  navigate = navigateFn;
};

export const navigateTo = (path: string, state?: object) => {
  if (navigate) {
    navigate(path, state);
  } else {
    console.error("Navigate function is not initialized.");
  }
};
