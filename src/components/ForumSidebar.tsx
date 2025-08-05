"use client";

interface ForumSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onShowNewPostForm: () => void;
}

export default function ForumSidebar({
  selectedCategory,
  onCategorySelect,
  onShowNewPostForm,
}: ForumSidebarProps) {
  const categories = [
    { id: "ALL", name: "All Posts" },
    { id: "GENERAL", name: "General" },
    { id: "FAITH", name: "Faith & Spirituality" },
    { id: "ACADEMIC", name: "Academic" },
    { id: "SOCIAL", name: "Social" },
    { id: "EVENTS", name: "Events" },
    { id: "ANNOUNCEMENTS", name: "Announcements" },
    { id: "QUESTIONS", name: "Questions" },
    { id: "DISCUSSION", name: "Discussion" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="mb-6">
        <button
          onClick={onShowNewPostForm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
        >
          New Post
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id === "ALL" ? null : category.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                selectedCategory === category.id || 
                (category.id === "ALL" && selectedCategory === null)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Total Posts:</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex justify-between">
            <span>Total Comments:</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex justify-between">
            <span>Active Users:</span>
            <span className="font-bold">0</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 mt-6">
        <h3 className="text-lg font-bold text-white mb-4">Forum Rules</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p>• Be respectful and kind to others</p>
          <p>• Keep discussions relevant to USIC</p>
          <p>• No spam or inappropriate content</p>
          <p>• Follow Islamic values and principles</p>
        </div>
      </div>
    </div>
  );
} 