import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm gửi yêu cầu GET
export const getData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

// Hàm gửi yêu cầu POST
export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data', error);
    throw error;
  }
};
