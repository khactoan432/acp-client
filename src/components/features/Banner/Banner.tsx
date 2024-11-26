import React from 'react';
import { Link } from 'react-router-dom';
import banner from "../../../assets/banner1.jpg";

const Banner: React.FC = () => {
  return (
    <section 
      className="relative bg-cover bg-center h-[400px] sm:h-[500px] lg:h-[600px]"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay to darken the background */}
      <div className="container mx-auto text-center relative z-10 p-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          Welcome to Our Learning Platform
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white opacity-80">
          Enhance your skills with top-rated courses and instructors.
        </p>
        <Link to="/courses" className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300">
          Explore Courses
        </Link>
      </div>
    </section>
  );
};

export default Banner;