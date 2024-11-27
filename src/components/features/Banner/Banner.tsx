import React, { useState, useEffect } from 'react';
import bannerImage1 from '../../../assets/banner1.jpg';
import bannerImage2 from '../../../assets/banner1.jpg';
import bannerImage3 from '../../../assets/banner1.jpg';

const BannerCarousel: React.FC = () => {
  const banners = [bannerImage1, bannerImage2, bannerImage3];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000); // Change banner every 3 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <section
      className="relative bg-cover bg-center h-[400px] sm:h-[500px] lg:h-[600px]"
      style={{ backgroundImage: `url(${banners[currentBanner]})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container mx-auto text-center relative z-10 p-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          Discover New Opportunities
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white opacity-80">
          Stay updated with the latest courses and resources.
        </p>
      </div>
    </section>
  );
};

export default BannerCarousel;