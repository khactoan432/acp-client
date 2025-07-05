import { postData, getData, deleteData, putData } from "../axios";

//get upload url
export const getSignedUrlAndUpload = async (file: File, folder: string) => {
  const header = localStorage.getItem("access_token");
  // 1. Xin signed URL từ backend
  const query = new URLSearchParams({
    folder,
    filename: file.name,
    mimetype: file.type,
  });

  const res = await getData(`/api/upload/upload-url?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${header}`,
    },
  });

  const data = res;
  const signedUrl = data.url;
  const filePath = data.filePath;

  // console.log(folder, file.name, file.type, data)

  // 2. Upload trực tiếp lên GCS
  await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    mode: "cors",
    body: file,
  });

  // 3. Trả về public URL
  return `https://storage.googleapis.com/acp_website/${filePath}`;
};
