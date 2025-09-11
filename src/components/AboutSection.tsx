import Image from 'next/image';
import { AboutSectionData } from '@/lib/about-data';

interface AboutSectionProps {
  section: AboutSectionData;
}

export default function AboutSection({ section }: AboutSectionProps) {
  const { title, subtitle, imageSrc, imageAlt, imagePosition = 'center', paragraphs, highlights, events } = section;

  const renderContent = () => {
    if (highlights) {
      return (
        <div className="space-y-4 mb-8">
          {highlights.map((highlight: string, index: number) => {
            const [boldText, ...restText] = highlight.split(' - ');
            return (
              <p key={index} className="text-lg md:text-xl text-blue-100">
                <span className="text-white font-semibold">{boldText}</span> - {restText.join(' - ')}
              </p>
            );
          })}
        </div>
      );
    }

    if (events) {
      return (
        <>
          {paragraphs?.map((paragraph: string, index: number) => (
            <p key={index} className="text-lg md:text-xl mb-6 text-blue-100">
              {paragraph}
            </p>
          ))}
          <div className="space-y-4 mb-8">
            {events.map((event: { title: string; items: string }, index: number) => (
              <div key={index}>
                <h4 className="text-lg md:text-xl font-semibold mb-2 text-white">{event.title}</h4>
                <p className="text-lg md:text-xl text-blue-100">{event.items}</p>
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        {paragraphs?.map((paragraph: string, index: number) => (
          <p key={index} className="text-lg md:text-xl mb-6 text-blue-100">
            {paragraph}
          </p>
        ))}
      </>
    );
  };

  return (
    <section className="mb-20">
      <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">{title}</h2>
      
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
        {/* Image */}
        <div className="relative aspect-[4/3] md:aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md max-w-md mx-auto md:max-w-none w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
            priority={false}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Content */}
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-white">
            {subtitle}
          </h3>
          {renderContent()}
        </div>
      </div>
    </section>
  );
}