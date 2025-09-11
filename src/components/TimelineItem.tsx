import Image from 'next/image';
import { TimelineItem as TimelineItemType } from '@/lib/membership-data';

interface TimelineItemProps {
  item: TimelineItemType;
  index: number;
  isActive: boolean;
  ref: (el: HTMLDivElement | null) => void;
}

export default function TimelineItem({ item, index, isActive, ref }: TimelineItemProps) {
  return (
    <div 
      ref={ref}
      className={`relative mb-16 last:mb-0 transition-all duration-500 ${
        isActive ? 'opacity-100' : 'opacity-25'
      }`}
    >
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Step Number and Progress Dot */}
        <div className="flex flex-col items-center md:items-start md:w-32 flex-shrink-0">
          <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
              : 'bg-[#2c5a7a] text-blue-200'
          }`}>
            {item.step}
          </div>
        </div>

        {/* Content Card */}
        <div className={`flex-1 rounded-xl overflow-hidden shadow-lg border border-[#2c5a7a] hover:border-blue-400 transition-all duration-300 ${
          item.isCTA ? 'bg-gradient-to-br from-[#0F1E2C] to-[#1a2d3a]' : 'bg-[#0F1E2C]'
        }`}>
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="relative h-64 lg:h-80 lg:w-1/2 overflow-hidden">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E2C] via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
              <h3 className="font-heading text-2xl font-bold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-blue-100 leading-relaxed mb-4">
                {item.description}
              </p>
              {item.isCTA && (
                <a 
                  href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Become a Member Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
