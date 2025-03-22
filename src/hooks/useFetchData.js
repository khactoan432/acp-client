import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
const useFetchData = (action, dependencies = []) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(action());
    }, [dispatch, ...dependencies]);
};
export default useFetchData;
