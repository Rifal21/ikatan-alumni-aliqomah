import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronCircleDown } from "react-icons/fa";

// Optional Swiper modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Dummy flyer images (replace with your URLs)
const flyers = [
  { 
    img: "./image/banner/1.jpg", 
    title: "Rappeling", 
    description: "Kegiatan outdoor rappeling di jembatan cisinga." 
  },
  { 
    img: "./image/banner/2.JPG", 
    title: "Albadr Fun Camp 2024", 
    description: "Kegiatan camping ceria dan tadabut alam." 
  },
  { 
    img: "./image/banner/3.JPG", 
    title: "Albadr Fun Camp 2024", 
    description: "Kegiatan camping ceria dan tadabut alam." 
  },
];

const Home = () => {
  const scrollToJumbotron = () => {
    const jumbotron = document.getElementById("jumbotron");
    if (jumbotron) {
      jumbotron.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Swiper Slider Section */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="shadow-lg"
        >
          {flyers.map((flyer, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={flyer.img}
                alt={`Flyer ${index + 1}`}
                className="w-full lg:h-screen md:h-[350px] h-[250px] object-cover"
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/50 text-white flex flex-col lg:justify-center justify-end pb-12 md:pb-20 lg:pt-48 items-start md:px-20 px-5 text-start">
                <h2 className="text-lg lg:text-4xl font-bold mb-2 uppercase">
                  {flyer.title}
                </h2>
                <p className="text-xs lg:text-xl capitalize">
                  {flyer.description.length > 60
                    ? flyer.description.slice(0, 57) + "..."
                    : flyer.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Circle Button */}
        <div className="absolute inset-0 flex justify-center items-end mb-24 animate-pulse z-10">
          <button
            onClick={scrollToJumbotron}
            className="bg-transparent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-quaternary/90 hover:text-primary"
          >
            <FaChevronCircleDown className="md:w-12 md:h-12 hidden lg:flex" />
          </button>
        </div>
      </section>

      {/* Jumbotron Section */}
      {/* <section
        id="jumbotron"
        className="bg-primary/50 text-quaternary p-8 rounded-lg shadow-lg text-center min-h-screen flex flex-col justify-center"
      >
        <h2 className="text-3xl font-bold mb-4">Bersama, Kita Lebih Kuat!</h2>
        <p className="text-lg mb-6">
          Bergabunglah dengan ribuan alumni lainnya untuk membangun jaringan yang
          lebih luas, berbagi pengalaman, dan menciptakan masa depan yang lebih baik.
        </p>
        <button className="px-6 py-3 bg-tertiary text-primary font-semibold rounded-lg shadow hover:bg-tertiary/90">
          Bergabung Sekarang
        </button>
      </section> */}
    </div>
  );
};

export default Home;
