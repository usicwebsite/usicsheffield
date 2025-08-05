"use client";

import { createPost } from "@/lib/firebase-utils";

export default function SeedButton() {
  const handleSeed = async () => {
    try {
      const samplePosts = [
        {
          title: "Welcome to USIC Forum!",
          content: "Assalamu alaikum everyone! Welcome to our new community forum. This is a place where we can discuss faith, academic life, social events, and everything related to being a Muslim student at the University of Sheffield. Feel free to introduce yourself and start meaningful discussions!",
          author: "USIC Admin",
          authorId: "admin123",
          category: "ANNOUNCEMENTS",
          tags: ["welcome", "community", "introduction"],
        },
        {
          title: "Best Halal Restaurants Near Campus",
          content: "Hey everyone! I'm looking for recommendations for halal restaurants near the university. I've tried a few places but would love to discover more options. What are your favorite spots for lunch or dinner?",
          author: "Ahmed",
          authorId: "user456",
          category: "SOCIAL",
          tags: ["food", "halal", "restaurants", "campus"],
        },
        {
          title: "Balancing Studies and Prayer Times",
          content: "As a Muslim student, I sometimes find it challenging to balance my academic schedule with prayer times, especially during exam periods. How do you all manage this? Any tips for finding quiet spaces on campus for prayer?",
          author: "Fatima",
          authorId: "user789",
          category: "FAITH",
          tags: ["prayer", "academic", "balance", "faith"],
        },
        {
          title: "Upcoming Jummah Prayer Schedule",
          content: "Just a reminder that Jummah prayers will be held in the Students' Union building every Friday at 1:30 PM. Please arrive 10 minutes early to find a spot. We also have prayer mats available if needed.",
          author: "USIC Admin",
          authorId: "admin123",
          category: "EVENTS",
          tags: ["jummah", "prayer", "schedule", "friday"],
        },
        {
          title: "Study Group for Islamic History Module",
          content: "Is anyone taking the Islamic History module this semester? I'm looking to form a study group to help each other with assignments and exam preparation. We could meet in the library or SU building.",
          author: "Omar",
          authorId: "user101",
          category: "ACADEMIC",
          tags: ["study", "group", "islamic", "history", "academic"],
        },
      ];

      for (const post of samplePosts) {
        await createPost(post);
      }

      alert("Sample posts have been added to the forum!");
    } catch (error) {
      console.error("Error seeding posts:", error);
      alert("Failed to seed posts. Please try again.");
    }
  };

  return (
    <button
      onClick={handleSeed}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
    >
      Add Sample Posts
    </button>
  );
} 