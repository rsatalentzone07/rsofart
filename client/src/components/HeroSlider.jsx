import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import api from '../utils/api';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const FALLBACK_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&q=80',
    title: 'Welcome to Rabindra School of Art',
    subtitle: 'Nurturing creativity since 2002 — Art & Dance',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
    title: 'Affiliated with Pracheen Kala Kendra',
    subtitle: 'Recognized excellence in classical arts education — Regd. No. 5071',
  },
];

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    api.get('/banners')
      .then(res => setBanners(res.data.length > 0 ? res.data : FALLBACK_SLIDES))
      .catch(() => setBanners(FALLBACK_SLIDES));
  }, []);

  const slides = banners.length > 0 ? banners : FALLBACK_SLIDES;

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide._id || i}>
            <div className="relative w-full h-full">
              <img
                src={slide.imageUrl}
                alt={slide.title || 'Banner'}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-3xl">
                  <div className="ornate-divider mb-6">
                    <span className="font-accent text-secondary text-lg px-4">✦</span>
                  </div>
                  {slide.title && (
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="font-body text-base sm:text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/courses" className="btn-primary">
                      Explore Courses
                    </Link>
                    <Link to="/admission" className="btn-secondary">
                      Apply for Admission
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
