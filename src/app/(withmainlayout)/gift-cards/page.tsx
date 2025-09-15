import Image from 'next/image';
import React from 'react';

const giftCards = [
  { id: '10', value: 10, priceUSD: 13.18 },
  { id: '25', value: 25, priceUSD: 32.94 },
  { id: '50', value: 50, priceUSD: 65.88 },
  { id: '100', value: 100, priceUSD: 131.77 },
];

const GiftCards: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 mt-12">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          Gutscheinkarten
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Verschenke Freude mit unseren digitalen Gutscheinkarten. Sofort per E-Mail erhältlich!
        </p>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {giftCards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col items-center justify-center bg-black rounded-xl shadow-lg p-8 aspect-[16/9] min-h-[220px]"
          >
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={64}    // 16 * 4px = 64px
              height={64}   // 16 * 4px = 64px
              className="object-contain mb-4"
            />
            <div className="text-white text-lg font-semibold mb-2">{card.value}€ GIFT CARD</div>
            <div className="text-white text-sm">Gutscheinkarte | {card.value}€</div>
            <div className="text-gray-300 text-xs mt-2">${card.priceUSD}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftCards; 