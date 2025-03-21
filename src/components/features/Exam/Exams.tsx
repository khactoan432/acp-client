// Exams.tsx
import React, { useEffect } from "react";
import Exam from "./Exam"; // Import the Exam component
import banner from "../../../assets/banner1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserExams } from "../../../redux/slices/examSlice";

const Exams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userExams, loading, error } = useSelector(
    (state: RootState) => state.exams
  );

  useEffect(() => {
    dispatch(fetchUserExams({ page: 1, limit: 4 , filters:[]}));
  }, [dispatch]);
  console.log(userExams);

  const exams = [
    {
      id: 1,
      name: "React for Beginners 1",
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 125,
      problems: 8,
      users: 232,
    },
    {
      id: 2,
      name: "Advanced JavaScript 1",
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 25,
      problems: 10,
      users: 202,
    },
    {
      id: 3,
      name: "React for Beginners 2",
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 74,
      problems: 8,
      users: 122,
    },
    {
      id: 4,
      name: "Advanced JavaScript 2",
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 185,
      problems: 10,
      users: 292,
    },
    {
      id: 5,
      name: "React for Beginners 2",
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 105,
      problems: 8,
      users: 222,
    },
    {
      id: 6,
      name: "Advanced JavaScript 2",
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 23,
      problems: 10,
      users: 79,
    },
    {
      id: 7,
      name: "Advanced JavaScript 2",
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 23,
      problems: 10,
      users: 79,
    },
    // Add more exams as needed
  ];

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 mt-12">
      <h2 className="text-4xl text-[#00095B] mb-14 text-center">
        Đề thi mới nhất
      </h2>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
        {userExams.map((exam) => (
          <div key={exam._id}>
            <Exam
              _id={exam._id}
              name={exam.name}
              image={exam.image}
              price={Number(exam.price)}
              discount={Number(exam.discount)}
              time={15}
              rating={4.8}
              rates={46}
              problems={12}
              users={122}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
