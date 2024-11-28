import React from "react";

import user from "../../../assets/user.png"

interface Testimonial {
  id: number;
  name: string;
  course: string;
  feedback: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    course: "Frontend Development",
    feedback: "Với chương trình học chú trọng thực tiễn, ACP trở thành bệ phóng giúp chúng em thỏa mãn đam mê, rèn kỹ năng, tạo nên sự tự tin trong các giải thi quốc gia và thế giới. Cảm ơn sự đồng hành của ACP trong suốt cuộc hành trình chinh phục code của em.",
    avatar: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Trần Thị B",
    course: "Fullstack Development",
    feedback: "Giáo viên nhiệt tình, tài liệu đầy đủ. Tôi rất hài lòng với khóa học.",
    avatar: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "Lê Văn C",
    course: "Data Science",
    feedback: "Một trải nghiệm học tập rất thú vị và bổ ích. Tôi sẽ giới thiệu bạn bè tham gia.",
    avatar: "https://via.placeholder.com/100",
  },
];

const Testimonials: React.FC = () => {
  return (
    <div className="pt-14 pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-[1228px]">
        <h2 className="text-4xl font-bold text-center text-[#00095B] mb-12">
          Cảm nhận học viên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#DBF5FF] rounded-lg shadow-md p-6 flex flex-col"
            >
              {/* Header: Avatar + Info */}
              <div className="flex items-center mb-4">
                <img
                  src={user}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 bg-slate-100 "
                />
                <div className="text-left">
                  <h3 className="text-lg font-bold text-blue-600 mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Khóa học:</strong> {testimonial.course}
                  </p>
                </div>
              </div>
              {/* Feedback */}
              <p className="text-gray-700 italic">{testimonial.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
