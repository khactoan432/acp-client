import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store'; // Đường dẫn tới store của bạn

const useFetchData = (action: () => any, dependencies: any[] = []) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(action());
  }, [dispatch, ...dependencies]);
};

export default useFetchData;
