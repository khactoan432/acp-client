import React from "react";
import Banner from "../../components/features/Banner/Banner";
import Courses from "../../components/features/Course/Courses";
import Exams from "../../components/features/Exam/Exams";
import Advisory from "../../components/features/Advisory/Advisory";
import Teachers from "../../components/features/Teacher/Teachers";
import Achievements from "../../components/features/Achievement/Achievements";
import Testimonials from "../../components/features/Testimonial/Testimonial";

import banner2 from "../../assets/banner2.png";
import benifit from "../../assets/benefit.png";

const UserHome: React.FC = () => {
  return (
    <div>
      <Banner />

      <Courses />

      <div className="w-full mt-20">
        <div className="max-w-[1228px] mx-auto">
          <img src={banner2} alt="alt" />
        </div>
      </div>

      <Exams />

      <div className="max-w-[1228px] mx-auto mt-20 text-[#00095B]">
        <p className="text-3xl mb-2 text-center">
          Tham gia cùng ACP - Học tập không giới hạn
        </p>
        <p className="text-lg font-normal mb-10 text-center">
          Với hơn 500 học viên tham gia mỗi tháng
        </p>
        <div className="gap-10 px-4 md:flex lg:flex">
          <img src={benifit} alt="alt" className="md:w-[50%]" />
          <div className="md:w-[50%] flex flex-col gap-4">
            <div>
              <p className="text-lg">Ngân hàng đề thi chất lượng cao</p>
              <p className="text-base">
                Nội dung đề thi được biên soạn bởi đội ngũ chuyên gia , cố vấn
                giàu kinh nghiệm giảng dạy đến từ Tập đoàn giáo dục Đại Trường
                Phát – đơn vị cung cấp Sách giáo khoa , Sách bổ trợ, Giáo trình
                Tiếng Anh.
              </p>
            </div>
            <div>
              <p className="text-lg">
                Tính năng thông minh với giao diện dễ sử dụng
              </p>
              <p className="text-base">
                Hệ thống tự động chấm điểm, đánh giá chi tiết ngay sau khi làm
                bài kèm giao diện đầy màu sắc , thao tác đơn giản giúp học sinh
                dễ dàng rèn luyện và cá nhân hóa lộ trình học tập.
              </p>
            </div>
            <div>
              <p className="text-lg">
                Kết nối Học sinh – Phụ huynh với Nhà trường – Giáo viên
              </p>
              <p className="text-base">
                Học sinh nhận và làm bài mọi lúc, mọi nơi trên mọi thiết bị từ
                Nhà trường – Giáo viên . Phụ huynh dễ dàng theo dõi kết quả học
                tập của con.
              </p>
            </div>
            <div>
              <p className="text-lg">Cộng đồng học tập sôi nổi</p>
              <p className="text-base">
                Học sinh kết nối với cộng đồng học tin học và luyện thi sôi nổi
                với hơn 500 học viên mỗi tháng , đặt câu hỏi cho đội ngũ giảng
                viên cũng như các học viên khác để được giải đáp trong 30 phút.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Teachers />

      <Achievements />

      <Testimonials />

      <Advisory />
    </div>
  );
};

export default UserHome;
