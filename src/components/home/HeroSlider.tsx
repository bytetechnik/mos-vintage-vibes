'use client';

import heroImage1 from '@/assets/heroimages/1.png';
import heroImage2 from '@/assets/heroimages/2.png';
import heroImage3 from '@/assets/heroimages/3.png';
import heroImage4 from '@/assets/heroimages/4.png';
import heroImage5 from '@/assets/heroimages/5.png';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    image: heroImage1,
    title: "Street Style Revolution",
    subtitle: "Discover Authentic Vintage Streetwear",
    description: "From rare hoodies to vintage jeans, find your perfect street style statement",
    cta: "Shop Collection",
    link: "/products"
  },
  {
    id: 2,
    image: heroImage2,
    title: "Urban Fashion Collective",
    subtitle: "New & Vintage Mix",
    description: "Quality-graded items from condition 7-10, authentic streetwear for every style",
    cta: "Explore Now",
    link: "/products?featured=true"
  },
  {
    id: 3,
    image: heroImage3,
    badge: "Premium Streetwear Kollektion",
    title: "MO'S VINTAGEWORLD",
    subtitle: "Wo Vintage auf Street trifft",
    description: "Entdecke Premium-Streetwear-Stücke, die Vintage-Ästhetik mit moderner urbaner Kultur verbinden. Kuratiert für alle, die sich trauen aufzufallen.",
    primaryBtn: "Kollektion shoppen",
    stats: [
      { number: "500+", label: "Premium Stücke" },
      { number: "10K+", label: "Zufriedene Kunden" },
      { number: "24/7", label: "Schneller Versand" }
    ],
    overlay: "from-background/95 via-background/70 to-transparent"
  },
  {
    id: 4,
    image: heroImage4,
    badge: "Neue Winter Kollektion 2024",
    title: "WINTER DROPS",
    subtitle: "Wärme trifft auf Style",
    description: "Unsere neuesten Winter-Essentials vereinen Komfort mit urbanem Flair. Perfekt für die kalte Jahreszeit ohne Kompromisse beim Style.",
    primaryBtn: "Winter Kollektion",
    stats: [
      { number: "50+", label: "Neue Designs" },
      { number: "Premium", label: "Materialien" },
      { number: "Limited", label: "Edition" }
    ],
    overlay: "from-background/90 via-background/60 to-background/20"
  },
  {
    id: 5,
    image: heroImage5,
    badge: "Exklusive Vintage Stücke",
    title: "VINTAGE FINDS",
    subtitle: "Einzigartig und authentisch",
    description: "Handverlesene Vintage-Pieces mit Geschichte. Jedes Stück erzählt seine eigene Story und macht dich zum Trendsetter.",
    primaryBtn: "Vintage entdecken",
    stats: [
      { number: "Unikat", label: "Pieces" },
      { number: "80s-90s", label: "Ära" },
      { number: "Authentisch", label: "Garantiert" }
    ],
    overlay: "from-background/85 via-background/50 to-transparent"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen min-h-screen overflow-hidden -mt-16">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide ? 'translate-x-0' :
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
        >
          <div className="relative w-full h-full min-h-screen">
            <Image
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              fill
            />
            <div className="absolute inset-0 bg-gradient-overlay" />
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-2 sm:px-4">
                {/* Badge */}
                {slide.badge && (
                  <div className="mb-2 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-widest bg-vintage-orange/80 text-white inline-block px-2 sm:px-4 py-1 rounded-full animate-fade-in">
                    {slide.badge}
                  </div>
                )}
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4 sm:mb-6 text-vintage-orange animate-fade-in delay-100">
                  {slide.subtitle}
                </h2>
                <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
                  {slide.description}
                </p>
                {/* Stats */}
                {slide.stats && (
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-4 sm:mb-8 animate-fade-in delay-300">
                    {slide.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-lg sm:text-2xl md:text-3xl font-bold">{stat.number}</div>
                        <div className="text-xs sm:text-sm md:text-base opacity-80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center animate-fade-in delay-400">
                  {slide.primaryBtn && (
                    <Button variant="street" size="xl">
                      {slide.primaryBtn}
                    </Button>
                  )}
                  {/* {slide.secondaryBtn && (
                    <Button variant="outline" size="xl" className="text-black">
                      {slide.secondaryBtn}
                    </Button>
                  )} */}
                  {/* Fallback for old slides */}
                  {!slide.primaryBtn && slide.cta && slide.link && (
                    <Link href={slide.link}>
                      <Button variant="street" size="xl">
                        {slide.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-vintage-orange transition-colors z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-vintage-orange transition-colors z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-vintage-orange' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;