// Exams.tsx
import React from 'react';
import Exam from './Exam'; // Import the Exam component
import banner from "../../../assets/banner1.jpg";

const Exams: React.FC = () => {
  const exams = [
    {
      id: 1,
      name: 'React for Beginners 1',
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 125,
      problems: 8,
      users: 232
    },
    {
      id: 2,
      name: 'Advanced JavaScript 1',
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 25,
      problems: 10,
      users: 202
    },
    {
      id: 3,
      name: 'React for Beginners 2',
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 74,
      problems: 8,
      users: 122
    },
    {
      id: 4,
      name: 'Advanced JavaScript 2',
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 185,
      problems: 10,
      users: 292
    },
    {
      id: 5,
      name: 'React for Beginners 2',
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 105,
      problems: 8,
      users: 222
    },
    {
      id: 6,
      name: 'Advanced JavaScript 2',
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 23,
      problems: 10,
      users: 79
    },
    {
      id: 7,
      name: 'Advanced JavaScript 2',
      time: 30,
      image: banner,
      price: 99000,
      rating: 5.0,
      rates: 23,
      problems: 10,
      users: 79
    },
    // Add more exams as needed
  ];

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 ">
      <h2 className="text-2xl font-semibold text-[#00095B] mb-6 text-center">ĐỀ THI MỚI NHẤT</h2>
      <div className='grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-4'>
        {exams.map(exam => (
          <div key={exam.id}>
            <Exam
              id={exam.id}
              name={exam.name}
              image={exam.image}
              price={exam.price}
              time={exam.time}
              rating={exam.rating}
              rates={exam.rates}
              problems={exam.problems}
              users={exam.users}

            />
          </div>
        ))}
      </div>
        
    </div>
  );
};

export default Exams;
