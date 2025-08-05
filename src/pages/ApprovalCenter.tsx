import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Eye, 
  Send,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WorkflowItem, WorkflowState, WorkflowComment } from '../types/auth';

const ApprovalCenter: React.FC = () => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<WorkflowState | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock workflow data
  const [workflowItems] = useState<WorkflowItem[]>([
    {
      id: '1',
      type: 'sales_budget',
      title: 'Q1 2025 Sales Budget - John Salesman',
      createdBy: 'John Salesman',
      createdByRole: 'salesman',
      currentState: 'submitted',
      submittedAt: '2024-12-15T10:30:00Z',
      comments: [
        {
          id: '1',
          author: 'John Salesman',
          authorRole: 'salesman',
          message: 'Please review the Q1 2025 sales budget for Action Aid International',
          timestamp: '2024-12-15T10:30:00Z',
          type: 'comment'
        }
      ],
      data: {
        totalBudget: 150000,
        customerCount: 5,
        items: 12
      }
    },
    {
      id: '2',
      type: 'forecast',
      title: 'December 2025 Forecast - Sarah Johnson',
      createdBy: 'Sarah Johnson',
      createdByRole: 'salesman',
      currentState: 'submitted',
      submittedAt: '2024-12-14T14:20:00Z',
      comments: [
        {
          id: '2',
          author: 'Sarah Johnson',
          authorRole: 'salesman',
          message: 'Updated forecast based on recent customer feedback',
          timestamp: '2024-12-14T14:20:00Z',
          type: 'comment'
        }
      ],
      data: {
        totalForecast: 85000,
        customerCount: 3,
        items: 8
      }
    },
    {
      id: '3',
      type: 'sales_budget',
      title: 'Q2 2025 Sales Budget - Mike Wilson',
      createdBy: 'Mike Wilson',
      createdByRole: 'salesman',
      currentState: 'approved',
      submittedAt: '2024-12-13T09:15:00Z',
      approvedBy: 'Jane Manager',
      approvedAt: '2024-12-14T11:30:00Z',
      comments: [
        {
          id: '3',
          author: 'Mike Wilson',
          authorRole: 'salesman',
          message: 'Q2 budget prepared with conservative estimates',
          timestamp: '2024-12-13T09:15:00Z',
          type: 'comment'
        },
        {
          id: '4',
          author: 'Jane Manager',
          authorRole: 'manager',
          message: 'Approved. Good conservative approach for Q2.',
          timestamp: '2024-12-14T11:30:00Z',
          type: 'approval'
        }
      ],
      data: {
        totalBudget: 120000,
        customerCount: 4,
        items: 10
      }
    }
  ]);

  const filteredItems = workflowItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.currentState === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStateColor = (state: WorkflowState) => {
    switch (state) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateIcon = (state: WorkflowState) => {
    switch (state) {
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = (itemId: string) => {
    console.log('Approving item:', itemId);
    // In real app, this would update the workflow state
  };

  const handleReject = (itemId: string) => {
    console.log('Rejecting item:', itemId);
    // In real app, this would update the workflow state
  };

  const handleSendToSupplyChain = (itemId: string) => {
    console.log('Sending to supply chain:', itemId);
    // In real app, this would forward to supply chain
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Center</h1>
            <p className="text-gray-600">Review and approve sales budgets and forecasts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">
                {workflowItems.filter(item => item.currentState === 'submitted').length} pending
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as WorkflowState | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Items</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workflow Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStateColor(item.currentState)}`}>
                      {getStateIcon(item.currentState)}
                      {item.currentState.charAt(0).toUpperCase() + item.currentState.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Created by:</span>
                      <p className="text-sm font-medium text-gray-900">{item.createdBy}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type:</span>
                      <p className="text-sm font-medium text-gray-900 capitalize">{item.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Submitted:</span>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(item.submittedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Data Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500 uppercase">Total Value</span>
                      <p className="text-lg font-semibold text-gray-900">
                        ${item.data.totalBudget || item.data.totalForecast}K
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500 uppercase">Customers</span>
                      <p className="text-lg font-semibold text-gray-900">{item.data.customerCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500 uppercase">Items</span>
                      <p className="text-lg font-semibold text-gray-900">{item.data.items}</p>
                    </div>
                  </div>

                  {/* Comments */}
                  {item.comments.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                      <div className="space-y-2">
                        {item.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => console.log('View details:', item.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  {item.currentState === 'submitted' && (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {item.currentState === 'approved' && (
                    <button
                      onClick={() => handleSendToSupplyChain(item.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                      Send to Supply Chain
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No items found</div>
            <div className="text-gray-400 text-sm">Try adjusting your search criteria or filters</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApprovalCenter; 