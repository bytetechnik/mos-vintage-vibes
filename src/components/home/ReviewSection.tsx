'use client';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const ReviewSection = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Sarah Müller",
      location: "Berlin",
      rating: 5,
      review: "Fantastische Qualität! Die Vintage Nike Jacke ist genau wie beschrieben. Schneller Versand und sehr freundlicher Kundenservice. Definitiv meine neue Lieblingsseite für Streetwear.",
      product: "Nike Vintage Jacket"
    },
    {
      id: 2,
      name: "Maximilian Weber",
      location: "München",
      rating: 5,
      review: "Endlich eine Seite, die echte Vintage-Stücke anbietet! Die Authentizität ist garantiert und die Preise sind fair. Meine Supreme Hoodie ist ein echter Hingucker.",
      product: "Supreme Hoodie"
    },
    {
      id: 3,
      name: "Lisa Schmidt",
      location: "Hamburg",
      rating: 5,
      review: "Perfekte Größe und Zustand wie beschrieben. Die Rücksendung war problemlos, als ich eine andere Größe brauchte. Sehr zuverlässiger Shop!",
      product: "Adidas Trackpants"
    },
    {
      id: 4,
      name: "Felix Bauer",
      location: "Köln",
      rating: 5,
      review: "Großartige Auswahl an authentischen Streetwear-Stücken. Die Stone Island Jacke ist ein Traum! Schnelle Lieferung und professioneller Service.",
      product: "Stone Island Jacket"
    },
    {
      id: 5,
      name: "Anna Wagner",
      location: "Frankfurt",
      rating: 5,
      review: "Die Qualität der Vintage-Jeans ist unglaublich. Jedes Detail stimmt und die Authentizität ist garantiert. Werde definitiv wieder bestellen!",
      product: "Vintage Levi's Jeans"
    },
    {
      id: 6,
      name: "Tom Fischer",
      location: "Düsseldorf",
      rating: 5,
      review: "Exzellenter Kundenservice und schnelle Lieferung. Die Off-White Shirt ist genau wie auf den Bildern. Sehr zufrieden mit dem Kauf!",
      product: "Off-White T-Shirt"
    }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-slide functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 md:w-5 md:h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Was unsere Kunden sagen
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Echte Bewertungen von zufriedenen Kunden aus ganz Deutschland
          </p>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="bg-gray-50 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="mb-3 md:mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{review.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{review.location}</p>
                    </div>

                    <div className="flex items-center mb-2 md:mb-3">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-xs md:text-sm text-gray-600">({review.rating}/5)</span>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed text-sm md:text-base">
                      &quot;{review.review}&quot;
                    </p>

                    <div className="text-xs md:text-sm text-vintage-orange font-medium">
                      Gekauft: {review.product}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 md:left-4" />
            <CarouselNext className="right-2 md:right-4" />
          </Carousel>

          {/* Dots navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === current ? 'bg-vintage-orange' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <div className="bg-vintage-orange text-white rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Werden Sie Teil unserer Community
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-6">
              Teilen Sie Ihre Erfahrungen und helfen Sie anderen Kunden bei ihrer Kaufentscheidung
            </p>
            <a
              href="https://whatsapp.com/channel/0029Vb5wz1ECBtxKmLmoUt3W"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-vintage-orange px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              Community beitreten
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection; 