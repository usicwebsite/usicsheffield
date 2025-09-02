"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Clock, User, Eye, X } from 'lucide-react';

interface QuestionData {
  id: string;
  question: string;
  contactType?: string;
  whatsappNumber?: string;
  email?: string;
  isPublic: boolean;
  status: string;
  priority?: string;
  createdAt: Date | { toDate(): Date };
  genre?: string;
}



interface PublicSubmission {
  id: string;
  type: 'question';
  title: string;
  content: string;
  author: string;
  contactInfo: string;
  status: string;
  priority: string;
  createdAt: Date | { toDate(): Date };
  isRead?: boolean;
  adminNotes?: string;
  response?: string;
}

interface PublicSubmissionsViewProps {
  darkMode: boolean;
}

export default function PublicSubmissionsView({ darkMode }: PublicSubmissionsViewProps) {
  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  // const [activeTab, setActiveTab] = useState<'questions'>('questions');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<PublicSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/admin/questions?status=${filterStatus}&limit=50`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const formattedQuestions = data.data.questions.map((q: QuestionData) => ({
          id: q.id,
          type: 'question' as const,
          title: `Question: ${q.question.substring(0, 100)}...`,
          content: q.question,
          author: q.isPublic ? 'Anonymous' : (q.email || q.whatsappNumber || 'No contact info'),
          contactInfo: q.isPublic ? 'Public question' : `${q.contactType === 'email' ? q.email : q.whatsappNumber}`,
          status: q.status,
          priority: q.priority || 'medium',
          createdAt: q.createdAt,
          genre: q.genre,
          isPublic: q.isPublic
        }));
        setSubmissions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const formatDate = (timestamp: Date | { toDate(): Date }) => {
    if (!timestamp) return "Unknown date";
    
    const date = 'toDate' in timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-yellow-900';
      case 'in_progress':
        return 'bg-blue-500 text-blue-900';
      case 'completed':
      case 'resolved':
        return 'bg-green-500 text-green-900';
      case 'reviewed':
        return 'bg-purple-500 text-purple-900';
      default:
        return 'bg-gray-500 text-gray-900';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-green-500 text-green-900';
      default:
        return 'bg-gray-500 text-gray-900';
    }
  };

  const openSubmissionModal = (submission: PublicSubmission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.adminNotes || '');
    setResponse(submission.response || '');
    setShowModal(true);
  };

  const handleUpdateSubmission = async () => {
    if (!selectedSubmission) return;

    try {
      const endpoint = `/api/admin/questions/${selectedSubmission.id}`;

      const fetchResponse: Response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          adminNotes,
          response,
          status: selectedSubmission.status === 'pending' ? 'reviewed' : selectedSubmission.status
        })
      });

      if (fetchResponse.ok) {
        setShowModal(false);
        loadSubmissions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${darkMode ? 'text-white' : 'text-gray-600'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Public Questions</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Review and manage public questions
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'reviewed' | 'resolved')}
          className={`px-3 py-2 rounded-lg border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No questions found with the selected filters.
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className={`p-4 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              } transition-colors cursor-pointer`}
              onClick={() => openSubmissionModal(submission)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{submission.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(submission.priority)}`}>
                      {submission.priority}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {submission.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="mr-1 w-3 h-3" />
                      {submission.author}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 w-3 h-3" />
                      {submission.contactInfo}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 w-3 h-3" />
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openSubmissionModal(submission);
                    }}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submission Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedSubmission.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Submission Details */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className="font-semibold mb-2">Submission Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Author:</span> {selectedSubmission.author}
                  </div>
                  <div>
                    <span className="font-medium">Contact:</span> {selectedSubmission.contactInfo}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedSubmission.priority)}`}>
                      {selectedSubmission.priority}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {formatDate(selectedSubmission.createdAt)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className="whitespace-pre-wrap">{selectedSubmission.content}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="font-semibold mb-2">Admin Notes</h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Add admin notes..."
                />
              </div>

              {/* Response */}
              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Add a response to the user..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmission}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Update Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
