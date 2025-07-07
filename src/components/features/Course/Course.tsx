import React from "react";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../axios";

interface CourseProps {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  rating: number;
}

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? "★" : "☆";
  }).join(" ");

  return <div className="text-yellow-500 text-2xl">{stars}</div>;
};

const Course: React.FC<CourseProps> = ({
  id,
  name,
  image,
  price,
  discount,
  description,
  rating,
}) => {
  const navigate = useNavigate();
  const payment = async (id_material: string, amount: number) => {
    try {
      // console.log("Payment initiated for:", id_material);

      // Gửi request thanh toán
      const pm = await postData(
        "/api/payment/momo",
        {
          id_user: "6756abc20424abb76abb1eb0", // ID người dùng
          id_material: id_material, // ID khóa học
          type: "COURSE", // Loại thanh toán
          amount: amount
        },
        {}
      );

      // console.log("Payment response:", pm);

      // Điều hướng đến URL thanh toán
      if (pm.data?.payUrl) {
        window.location.href = pm.data.payUrl;
      } else {
        console.error("Payment URL not found in response.");
        alert("Không thể thực hiện thanh toán, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Đã xảy ra lỗi khi thực hiện thanh toán.");
    }
  };

  return (
    <div
      className="bg-white max-w-[400px] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      id={id.toString()}
    >
      <div className="relative" onClick={() => navigate("/course/" + id)}>
        <img src={image} alt={name} className="w-full h-56 object-cover" />
      </div>

      <div className="p-4">
        <h2 className="text-lg text-gray-800 truncate">{name}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Rating rating={rating} />
            <span>(241 Đánh giá)</span>
          </div>

          <span>4279 Học viên</span>
        </div>

        <div className="flex justify-between items-center my-3">
          <div className="flex items-center gap-4">
            <span className="text-xl text-gray-900">
              {new Intl.NumberFormat("vi-VN").format(price - discount)}đ
            </span>
            <span className="text-xl font-medium text-gray-900 line-through">
              ${new Intl.NumberFormat("vi-VN").format(price)}đ
            </span>
          </div>
        </div>
        <div className="flex gap-[10%] mt-3">
          <Button onClick={() => navigate("/course/" + id)} className="w-[45%]">
            Chi tiết
          </Button>
          <Button onClick={() => payment(id, price - discount)} className="w-[45%]">
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Course;
