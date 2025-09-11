import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import MembershipSection from "@/components/MembershipSection";
import { getAboutSections } from "@/lib/about-data";

export default function Home() {
  const aboutSections = getAboutSections();
  
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* White divider between Hero and AboutSection */}
      <div className="h-px bg-white/30 w-full"></div>
      
      <div className="mt-0"> {/* No margin needed since Hero is full screen */}
        {aboutSections.map((section, index) => (
          <AboutSection key={index} section={section} />
        ))}
        
        {/* White divider between AboutSection and EventsSection */}
        <div className="h-px bg-white/30 w-full"></div>
        
        <EventsSection />
        
        {/* White divider between EventsSection and MembershipSection */}
        <div className="h-px bg-white/30 w-full"></div>
        
        <MembershipSection />
      </div>
    </div>
  );
}
