"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Types
interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  experience: string;
  documentUrl: string;
  documentType: string;
  status: 'pending' | 'verified' | 'declined';
  registrationDate: string;
}

// Mock data - replace with actual API calls in production
const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    service: 'Plumbing',
    experience: '5 years',
    documentUrl: '/api/placeholder/400/300',
    documentType: 'Aadhar Card',
    status: 'pending',
    registrationDate: '2025-02-15',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 8765432109',
    service: 'Electrical Work',
    experience: '3 years',
    documentUrl: '/api/placeholder/400/300',
    documentType: 'Aadhar Card',
    status: 'pending',
    registrationDate: '2025-02-16',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 7654321098',
    service: 'Carpentry',
    experience: '7 years',
    documentUrl: '/api/placeholder/400/300',
    documentType: 'Aadhar Card',
    status: 'verified',
    registrationDate: '2025-02-10',
  },
];

const Invitation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'declined'>('pending');
  const [providers, setProviders] = useState<ServiceProvider[]>(mockProviders);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<'verify' | 'decline' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Filter providers based on active tab and search term
  const filteredProviders = providers.filter(provider => 
    provider.status === activeTab && 
    (provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
     provider.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle provider verification
  const handleVerify = (id: string) => {
    setProviders(prevProviders => 
      prevProviders.map(provider => 
        provider.id === id ? {...provider, status: 'verified'} : provider
      )
    );
    toast.success('Service provider verified successfully!');
    setShowConfirmation(false);
  };

  // Handle provider decline
  const handleDecline = (id: string) => {
    setProviders(prevProviders => 
      prevProviders.map(provider => 
        provider.id === id ? {...provider, status: 'declined'} : provider
      )
    );
    toast.error('Service provider registration declined.');
    setShowConfirmation(false);
  };

  // Handle viewing details
  const handleViewDetails = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
  };

  // Handle confirmation modal
  const showConfirmationModal = (providerID: string, actionType: 'verify' | 'decline') => {
    const provider = providers.find(p => p.id === providerID);
    if (provider) {
      setSelectedProvider(provider);
      setAction(actionType);
      setShowConfirmation(true);
    }
  };

  // Close confirmation modal
  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSelectedProvider(null);
    setAction(null);
  };

  // Confirmation action handler
  const confirmAction = () => {
    if (selectedProvider && action) {
      if (action === 'verify') {
        handleVerify(selectedProvider.id);
      } else {
        handleDecline(selectedProvider.id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Admin header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center flex-shrink-0">
                <h1 className="text-xl font-bold">Service Partner Management</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <Image 
                    className="w-8 h-8 rounded-full" 
                    src="/api/placeholder/32/32" 
                    alt="Admin profile"
                    width={32}
                    height={32}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab navigation */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex mb-4 space-x-4 sm:mb-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'pending'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Requests
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'verified'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Verified Partners
            </button>
            <button
              onClick={() => setActiveTab('declined')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'declined'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Declined Requests
            </button>
          </nav>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, service, or email"
              className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Conditional rendering based on tab */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {activeTab === 'pending' && 'Pending Service Provider Requests'}
              {activeTab === 'verified' && 'Verified Service Providers'}
              {activeTab === 'declined' && 'Declined Service Provider Requests'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'pending' && 'Review and verify service provider registration requests.'}
              {activeTab === 'verified' && 'List of all verified service providers.'}
              {activeTab === 'declined' && 'List of declined service provider requests.'}
            </p>
          </div>

          {/* Provider list */}
          <div className="border-t border-gray-200">
            {filteredProviders.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-gray-500">No service providers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Registration Date</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProviders.map((provider) => (
                      <tr key={provider.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                              <div className="text-sm text-gray-500">{provider.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            {provider.service}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{provider.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{provider.registrationDate}</td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(provider)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                          {activeTab === 'pending' && (
                            <>
                              <button
                                onClick={() => showConfirmationModal(provider.id, 'verify')}
                                className="ml-3 text-green-600 hover:text-green-900"
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => showConfirmationModal(provider.id, 'decline')}
                                className="ml-3 text-red-600 hover:text-red-900"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Service Provider Details</h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-base text-gray-900">{selectedProvider.name}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base text-gray-900">{selectedProvider.email}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-base text-gray-900">{selectedProvider.phone}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Service</p>
                        <p className="text-base text-gray-900">{selectedProvider.service}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Experience</p>
                        <p className="text-base text-gray-900">{selectedProvider.experience}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Document Type</p>
                        <p className="text-base text-gray-900">{selectedProvider.documentType}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">ID Document</p>
                        <div className="mt-2">
                          <Image
                            src={selectedProvider.documentUrl}
                            alt={`${selectedProvider.name}'s ID Document`}
                            width={400}
                            height={300}
                            className="object-cover w-full h-48 border border-gray-200 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
                {selectedProvider.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => showConfirmationModal(selectedProvider.id, 'verify')}
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => showConfirmationModal(selectedProvider.id, 'decline')}
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedProvider && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    action === 'verify' ? 'bg-green-100' : 'bg-red-100'
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    {action === 'verify' ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {action === 'verify' ? 'Verify Service Provider' : 'Decline Service Provider'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {action === 'verify'
                          ? `Are you sure you want to verify ${selectedProvider.name} as a service provider for ${selectedProvider.service}?`
                          : `Are you sure you want to decline ${selectedProvider.name}'s request to be a service provider for ${selectedProvider.service}?`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white ${
                    action === 'verify' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={confirmAction}
                >
                  {action === 'verify' ? 'Verify' : 'Decline'}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeConfirmation}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitation;