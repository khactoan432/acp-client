import React, { useEffect, useState } from "react";
import Button from "../../common/Button";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import tiếng Việt

// Kích hoạt plugin và thiết lập ngôn ngữ
dayjs.extend(relativeTime);
dayjs.locale("vi");

// import useFetchData from "../../../hooks/useFetchData";
import { createRate, fetchUserRates } from "../../../redux/slices/rateSlice";
import Loading from "../../loading";

interface Rating {
  id?: number;
  id_ref_material: string;
  id_user: object;
  createdAt?: string;
  rate?: number;
  content: string;
  ref_type: any;
  type: any;
}
interface RatingPageProps {
  id_ref_material: string; // Định nghĩa kiểu của prop
  ref_type: string;
}

interface ReplyForm {
  [replyId: string]: {
    content: string;
  };
}

const RatingPage: React.FC<RatingPageProps> = ({
  id_ref_material,
  ref_type,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    userRates,
    totalRateUser,
    loading: ratesLoading,
    error: ratesError,
  } = useSelector((state: RootState) => state.rates);

  console.log(userRates);

  useEffect(() => {
    dispatch(fetchUserRates({ id_ref_material, ref_type }));
  }, [dispatch, id_ref_material, ref_type]);

  // console.log(userRates);

  const [form, setForm] = useState({
    rate: 0,
    content: "",
  });

  const [replyForm, setReplyForm] = useState<ReplyForm>({});

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (star: number) => {
    setForm((prev) => ({ ...prev, rate: star }));
  };

  const handleReplyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    replyId: string
  ) => {
    const { name, value } = e.target;
    setReplyForm((prev) => ({
      ...prev,
      [replyId]: {
        ...prev[replyId],
        [name]: value,
      },
    }));
  };

  // console.log(localStorage.getItem('user'),JSON.parse(localStorage.getItem('user'))?._id);
  // console.log(material_id);

  const handleRateSubmit = async (
    e: React.FormEvent,
    id_ref_material: string
  ) => {
    e.preventDefault();

    if (form.rate > 0 && form.content) {
      const newRating: Rating = {
        id_user: JSON.parse(localStorage.getItem("user"))?._id,
        id_ref_material: id_ref_material,
        ref_type: ref_type, // Nhận ref_type từ tham số
        type: "RATE", // Nhận type từ tham số
        rate: form.rate,
        content: form.content,
      };

      console.log(newRating);
      await dispatch(createRate(newRating)).unwrap();
      setForm({ rate: 0, content: "" });
      setShowForm(false);
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleReplySubmit = async (
    e: React.FormEvent,
    id_ref_material: string
  ) => {
    e.preventDefault();

    if (replyForm[id_ref_material] && replyForm[id_ref_material].content) {
      const newRating: Rating = {
        id_user: JSON.parse(localStorage.getItem("user"))?._id,
        id_ref_material: id_ref_material,
        ref_type: "INTERACTION", // Nhận ref_type từ tham số
        type: "COMMENT", // Nhận type từ tham số
        content: replyForm[id_ref_material].content,
      };

      console.log(newRating);
      await dispatch(createRate(newRating)).unwrap();
      setForm({ rate: 0, content: "" });
      setShowForm(false);
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const totalRatings = totalRateUser;
  const averageRating =
    userRates?.reduce((acc, cur) => acc + cur.rate, 0) / totalRatings || 0;
  const ratingDistribution = [0, 0, 0, 0, 0];
  userRates?.forEach((rating) => {
    ratingDistribution[5 - rating.rate]++;
  });

  const [openReplies, setOpenReplies] = useState({}); // State quản lý danh sách trả lời mở/đóng
  const [openReply, setOpenReply] = useState({});

  const toggleReplies = (ratingId: string) => {
    setOpenReplies((prev) => {
      const isCurrentlyOpen = prev[ratingId];
      const updatedReply = isCurrentlyOpen
        ? { ...openReplies, [ratingId]: false }
        : { ...openReplies };

      setOpenReply(updatedReply);
      return {
        ...prev,
        [ratingId]: !isCurrentlyOpen,
      };
    });
  };

  const toggleReply = (ratingId: string) => {
    setOpenReply((prev) => {
      const isCurrentlyOpen = prev[ratingId]; // Trạng thái hiện tại của openReply[ratingId]
      const updatedReplies = isCurrentlyOpen
        ? { ...openReplies } // Nếu đóng, không ảnh hưởng openReplies
        : { ...openReplies, [ratingId]: true }; // Nếu mở, mở luôn openReplies[ratingId]

      // Cập nhật openReplies đồng thời với openReply
      setOpenReplies(updatedReplies);

      // Trả về trạng thái mới cho openReply
      return {
        ...prev,
        [ratingId]: !isCurrentlyOpen,
      };
    });
  };

  // console.log(userRates[0]?.replies[0],typeof(userRates[0]?.replies[0]));

  return (
    <div className="max-w-[1228px] mx-auto">
      {/* Average Rating Section */}
      <div className="bg-white p-6 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)] mb-6">
        {/* <h2 className="text-2xl font-bold mb-4">Đánh giá của học viên</h2> */}
        <div className="flex items-center space-x-6">
          {/* Average Score */}
          <div className="text-center w-1/4">
            <p className="text-6xl font-bold text-yellow-500">
              {averageRating.toFixed(1)}
            </p>
            <div className="text-yellow-500 text-2xl">
              {"★".repeat(Math.round(averageRating))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 w-1/2">
            {ratingDistribution?.map((count, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm">{5 - index} ★</span>
                <div className="flex-1 bg-gray-300 h-2 rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-width duration-500"
                    style={{
                      width: `${(count / totalRatings) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm w-[36px] text-center">
                  {((count / totalRatings) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <Button
            className={`w-1/4 h-[50px] px-6 py-2 ${
              showForm ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hủy" : "Đánh giá"}
          </Button>
        </div>
      </div>

      {/* Review Form */}
      <div
        className={`bg-white rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)] overflow-hidden transition-all duration-500 ${
          showForm
            ? "max-h-[800px] opacity-100 p-6 mb-6"
            : "max-h-0 opacity-0 p-0"
        }`}
        style={{ visibility: showForm ? "visible" : "hidden" }}
      >
        <h3 className="text-xl font-bold mb-4">Gửi đánh giá của bạn</h3>
        <form onSubmit={(e) => handleRateSubmit(e, id_ref_material)}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              1. Đánh giá của bạn về khóa học
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= form.rate ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              2. Viết cảm nhận của bạn về khóa học
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Cảm nhận của bạn..."
            ></textarea>
          </div>

          {/* <div className="mb-4">
            <label className="block mb-2 font-medium">
              3. Thông tin cá nhân của bạn
            </label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
                placeholder="Họ và tên*"
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
                placeholder="Số điện thoại*"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
                placeholder="Email"
              />
            </div>
          </div> */}

          <button
            type="submit"
            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-all duration-300"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>

      {/* User contents */}
      {ratesLoading ? (
        <Loading message="Loading data..." size="large" />
      ) : ratesError ? (
        "error"
      ) : userRates.length === 0 ? (
        ""
      ) : (
        <div className="bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]">
          <p className="mb-2 text-gray-600">{userRates.length} đánh giá</p>
          <hr />
          <ul className="space-y-6 mt-4">
            {userRates?.map((rating) => (
              <li
                key={rating._id}
                className="flex flex-col space-y-4 border-b border-dashed border-gray-200 pb-4 mb-4 last:border-none last:pb-0 last:mb-0"
              >
                <div className="flex space-x-4 ">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                    {rating.user_name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")}
                    {/* {"HNT"} */}
                  </div>
                  <div>
                    <p className="font-bold h-[20px]">{rating.user_name}</p>
                    <div className="text-yellow-500">
                      {"★".repeat(rating.rate)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {dayjs(rating.createdAt).fromNow()}
                    </p>
                    <p className="mt-2 text-gray-700">{rating.content}</p>
                    <div className="flex space-x-2">
                      {rating?.replies?.length !== 0 ? (
                        <button
                          onClick={() => toggleReplies(rating._id)}
                          className="text-blue-500 text-sm mt-2 hover:underline"
                        >
                          {openReplies[rating._id]
                            ? "Ẩn trả lời"
                            : `${rating?.replies?.length} Trả lời`}
                        </button>
                      ) : (
                        <button className="text-blue-500 text-sm mt-2">
                          {" "}
                          0 Trả lời
                        </button>
                      )}
                      <button
                        onClick={() => toggleReply(rating._id)}
                        className="text-blue-500 text-sm mt-2 hover:underline"
                      >
                        {openReply[rating._id] ? "Ẩn phản hồi" : "Phản hồi"}
                      </button>
                    </div>
                  </div>
                </div>

                {openReplies[rating._id] && (
                  <div className="ml-16 mt-4 bg-gray-100 rounded-lg shadow-sm">
                    {rating?.replies?.map((reply, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 border-b border-gray-200 pb-4 m-4 mb-4 last:border-none last:pb-0 last:mb-0"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white flex items-center justify-center rounded-full text-sm font-bold">
                          {reply.user_name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex space-x-2">
                            <p className="font-bold text-sm ">
                              {reply.user_name}
                            </p>
                            {reply.user_role === "ADMIN" && (
                              <p className="text-xs bg-yellow-200 text-yellow-800 px-2 rounded pt-0.5">
                                {reply.user_role}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {dayjs(reply.createdAt).fromNow()}
                          </p>
                          <p className="text-gray-700 mt-1">{reply.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Form trả lời */}
                    {openReply[rating._id] && (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, rating._id)}
                        className="m-4"
                      >
                        <div className="mt-4">
                          <textarea
                            name="content"
                            value={replyForm[rating._id]?.content || ""}
                            onChange={(e) => handleReplyChange(e, rating._id)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhận xét của bạn về đánh giá này"
                          ></textarea>
                          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Gửi trả lời
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(RatingPage);
