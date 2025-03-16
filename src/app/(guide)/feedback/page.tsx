"use client";

import { useState } from "react";
import TipBox from "@/components/guide/TipBox";

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<string>("general");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this feedback to your backend
    console.log("Feedback submitted:", { feedbackType, feedbackText, email });
    setSubmitted(true);
    setFeedbackText("");
    setEmail("");
  };
  
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this question to your backend
    console.log("Question submitted:", { question, email });
    alert("Your question has been submitted. We'll get back to you soon!");
    setQuestion("");
  };
  
  // Sample FAQ data
  const faqs = [
    {
      question: "How do I install Cursor on Linux?",
      answer: "You can install Cursor on Linux using the .deb package or .AppImage file. Check the Installation page in the Getting Started section for detailed instructions."
    },
    {
      question: "Does Cursor work offline?",
      answer: "Cursor's basic editing features work offline, but its AI-powered features require an internet connection to function properly."
    },
    {
      question: "Is Cursor free to use?",
      answer: "Cursor offers both free and paid plans. The free plan includes basic AI features, while the paid plans offer more advanced capabilities and higher usage limits."
    },
    {
      question: "How do I update Cursor to the latest version?",
      answer: "Cursor typically checks for updates automatically. You can also check for updates manually by going to Help > Check for Updates in the menu."
    },
    {
      question: "Can I use Cursor with my existing VS Code extensions?",
      answer: "Yes, Cursor is compatible with most VS Code extensions. You can install them through the Extensions view in Cursor."
    },
    {
      question: "How do I report a bug in Cursor?",
      answer: "You can report bugs through the Help > Report Issue menu option in Cursor, or by visiting the Cursor GitHub repository."
    },
    {
      question: "Can I use Cursor for languages other than JavaScript/TypeScript?",
      answer: "Yes, Cursor supports a wide range of programming languages, including Python, Java, C++, Go, and many others."
    },
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Q&A</h1>
        <p className="text-lg text-gray-600">
          Share your feedback about this guide or ask questions about using Cursor for web development.
        </p>
      </div>
      
      {/* Feedback Form */}
      <div className="mb-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Share Your Feedback</h2>
        
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-medium mb-1">Thank you for your feedback!</h3>
            <p className="text-green-700">
              Your feedback helps us improve this guide for everyone. We appreciate your input!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 text-sm text-green-700 hover:text-green-900 underline"
            >
              Submit another feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Type
              </label>
              <select
                id="feedbackType"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="general">General Feedback</option>
                <option value="suggestion">Suggestion</option>
                <option value="error">Error or Issue</option>
                <option value="praise">Praise</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="feedbackText" className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                id="feedbackText"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                We'll only use this to follow up on your feedback if necessary.
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        
        <div className="mb-6">
          <label htmlFor="searchFaq" className="block text-sm font-medium text-gray-700 mb-1">
            Search FAQs
          </label>
          <input
            type="text"
            id="searchFaq"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search for questions or keywords..."
          />
        </div>
        
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                </div>
                <div className="px-4 py-3">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No FAQs match your search. Try a different query or ask your question below.</p>
          )}
        </div>
      </div>
      
      {/* Ask a Question */}
      <div className="mb-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
        
        <TipBox type="note">
          <p>
            Can&apos;t find an answer to your question? Ask us directly and we&apos;ll get back to you as soon as possible.
          </p>
        </TipBox>
        
        <form onSubmit={handleQuestionSubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Your Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What would you like to know about Cursor or web development?"
              required
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="questionEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="questionEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll send the answer to your question to this email address.
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
      
      {/* Community Resources */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Community Resources</h2>
        
        <p className="mb-4">
          Connect with the Cursor community and find additional resources:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://discord.gg/cursor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Discord Community</h3>
              <p className="text-sm text-gray-600">Join the Cursor Discord server to chat with other users and get help</p>
            </div>
          </a>
          
          <a
            href="https://github.com/getcursor/cursor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">GitHub Repository</h3>
              <p className="text-sm text-gray-600">Check out the Cursor GitHub repo for issues, updates, and contributions</p>
            </div>
          </a>
          
          <a
            href="https://cursor.sh/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Cursor Blog</h3>
              <p className="text-sm text-gray-600">Read the latest news, tutorials, and updates from the Cursor team</p>
            </div>
          </a>
          
          <a
            href="https://twitter.com/cursor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Twitter</h3>
              <p className="text-sm text-gray-600">Follow Cursor on Twitter for the latest updates and announcements</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 