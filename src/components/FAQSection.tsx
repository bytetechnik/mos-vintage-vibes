import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqData = [
    {
      question: "Wie schnell ist der Versand?",
      answer: "Wir versenden innerhalb von 24 Stunden nach Bestellung. Standardversand dauert 2-3 Werktage, Expressversand 1-2 Werktage. Internationaler Versand ist ebenfalls verfügbar."
    },
    {
      question: "Kann ich Artikel zurückgeben?",
      answer: "Ja, Sie haben 14 Tage Zeit, um Artikel in ungetragenem Zustand zurückzugeben. Wir übernehmen die Rücksendekosten für fehlerhafte Artikel."
    },
    {
      question: "Wie kann ich die richtige Größe finden?",
      answer: "Wir bieten detaillierte Größentabellen für jedes Produkt. Bei Fragen können Sie unseren Kundenservice kontaktieren oder die Größenguide verwenden."
    },
    {
      question: "Sind alle Artikel authentisch?",
      answer: "Ja, wir garantieren die Authentizität aller Artikel. Jedes Stück wird vor dem Versand von unserem Expertenteam überprüft."
    },
    {
      question: "Gibt es Rabatte für Studenten?",
      answer: "Ja, Studenten erhalten 10% Rabatt auf alle Artikel. Einfach Ihren Studentenausweis bei der Bestellung hochladen."
    },
    {
      question: "Wie kann ich den Status meiner Bestellung verfolgen?",
      answer: "Sie erhalten eine Bestellbestätigung per E-Mail mit Tracking-Nummer. Den aktuellen Status können Sie auch in Ihrem Konto einsehen."
    }
  ];

  // Split FAQ data into two columns
  const leftColumn = faqData.slice(0, 3);
  const rightColumn = faqData.slice(3);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finden Sie schnell Antworten auf die wichtigsten Fragen zu unseren Produkten und Services
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <Accordion type="single" collapsible className="w-full">
                {leftColumn.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-vintage-orange transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column */}
            <div>
              <Accordion type="single" collapsible className="w-full">
                {rightColumn.map((faq, index) => (
                  <AccordionItem key={index + 3} value={`item-${index + 3}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-vintage-orange transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Haben Sie weitere Fragen?
          </p>
          <button className="bg-vintage-orange text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors">
            Kontaktieren Sie uns
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 