import Hero from "@/components/Hero";
import SwiperSlideshow from "@/components/SwiperSlideshow";
import EventsSection from "@/components/EventsSection";
import MembershipSection from "@/components/MembershipSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* White divider between Hero and SwiperSlideshow */}
      <div className="h-px bg-white/30 w-full"></div>
      
      <div className="mt-0"> {/* No margin needed since Hero is full screen */}
        <SwiperSlideshow />
        
        {/* White divider between SwiperSlideshow and EventsSection */}
        <div className="h-px bg-white/30 w-full"></div>
        
        <EventsSection />
        
        {/* White divider between EventsSection and MembershipSection */}
        <div className="h-px bg-white/30 w-full"></div>
        
        <MembershipSection />
      </div>
    </div>
  );
}
