import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUserCourses } from "../../redux/slices/courseSlice";

// import banner from '../../assets/banner1.jpg';
import banner3 from "../../assets/banner3.jpg";
import Course from "../../components/features/Course/Course";
import Advisory from "../../components/features/Advisory/Advisory";

const UserCourse: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userCourses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchUserCourses({ page: 1, limit: 100 }));
  }, [dispatch]);

  return loading ? (
    "Waiting for Loading"
  ) : error ? (
    "Something have wrong"
  ) : (
    <div>
      <div className="w-full mt-14">
        <div className="max-w-[1228px] mx-auto">
          <img src={banner3} alt="alt" />
        </div>
      </div>

      <div className="max-w-[1228px] mx-auto mt-20 text-[#00095B] pb-20">
        <p className="text-4xl mb-2">Chương trình học online</p>
        <p className="text-base">
          Phần mềm và chương trình học online chất lượng cao của STUDY4 được
          thiết kế theo chương trình tiếng Anh chuẩn CEFR (A1 -C2) của đại học
          Cambridge và Oxford (Anh) với hệ thống bài giảng, bài tập phong phú đa
          dạng. Bạn có thể học thử miễn phí trước khi đặt mua sản phẩm.
        </p>

        <div className="pt-14">
          <p className="text-3xl font-bold pb-5">Lớp cơ bản:</p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {userCourses?.map((course) => (
              <div key={course._id}>
                <Course
                  id={course._id}
                  name={course.name}
                  image={course.image}
                  price={Number(course.price)}
                  discount={Number(course.discount)}
                  description={"7 chủ đề - 39 bài học - 67 bài tập"}
                  rating={5}
                />
              </div>
            ))}
          </div>
        </div>

        {/* <div className='pt-14'>
            <p className='text-3xl font-bold pb-5'>Lớp nâng cao:</p>
            <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>
              {courses.map(course => (
                <div key={course.id}>
                  <Course
                    id={course.id}
                    name={course.name}
                    image={course.image}
                    price={course.price}
                    description={course.description}
                    rating={course.rating}
                  />
                </div>
              ))}
            </div>
          </div> */}
      </div>

      <Advisory />
    </div>
  );
};

export default UserCourse;
