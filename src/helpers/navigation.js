let navigate = null;
export const setNavigate = (navigateFn) => {
    navigate = navigateFn;
};
export const navigateTo = (path, state) => {
    if (navigate) {
        navigate(path, state);
    }
    else {
        console.error("Navigate function is not initialized.");
    }
};
