"use client"
import React, { useState, useEffect } from 'react';
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, HardHat, Tool, UserCheck, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

// Sample service provider data
const SERVICE_PROVIDERS_DATA = [
  { id: 'SP001', name: 'John Doe', email: 'john.doe@example.com', date: '2023-05-15', servicesRegistered: 12, servicesDone: 10, location: 'New York', address: '123 Broadway St, New York, NY 10001', phone: '+1 (212) 555-1234', totalEarnings: '$1,245.50', lastLogin: '2023-11-10', status: 'active', serviceCategories: ['Plumbing', 'Electrical'] },
  { id: 'SP002', name: 'Jane Smith', email: 'jane.smith@example.com', date: '2023-06-22', servicesRegistered: 5, servicesDone: 4, location: 'Los Angeles', address: '456 Hollywood Blvd, Los Angeles, CA 90028', phone: '+1 (310) 555-5678', totalEarnings: '$567.25', lastLogin: '2023-11-12', status: 'active', serviceCategories: ['Cleaning', 'Carpentry'] },
  // Add more service providers as needed
];

type ServiceProvider = typeof SERVICE_PROVIDERS_DATA[0];

const ServiceProvidersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof ServiceProvider>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(SERVICE_PROVIDERS_DATA);
  
  const providersPerPage = 10;
  
  useEffect(() => {
    // Filter providers based on search term
    const filtered = SERVICE_PROVIDERS_DATA.filter(provider => 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort filtered providers
    const sorted = [...filtered].sort((a, b) => {
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        const aValue = (a[sortField] as string).toLowerCase();
        const bValue = (b[sortField] as string).toLowerCase();
        
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
        return sortDirection === 'asc' 
          ? (a[sortField] as number) - (b[sortField] as number)
          : (b[sortField] as number) - (a[sortField] as number);
      }
      return 0;
    });
    
    setFilteredProviders(sorted);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);
  
  // Calculate pagination
  const totalProviders = filteredProviders.length;
  const totalPages = Math.ceil(totalProviders / providersPerPage);
  const startIndex = (currentPage - 1) * providersPerPage;
  const paginatedProviders = filteredProviders.slice(startIndex, startIndex + providersPerPage);
  
  // Handle sorting
  const handleSort = (field: keyof ServiceProvider) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <Button 
        key="prev" 
        variant="outline" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
    
    // Page numbers
    const totalPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button 
          key={i} 
          variant={currentPage === i ? "default" : "outline"} 
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i}
        </Button>
      );
    }
    
    // Next button
    pages.push(
      <Button 
        key="next" 
        variant="outline" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
    
    return pages;
  };

  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <HardHat className="w-8 h-8 text-purple-600" /> Service Providers
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total Providers: <span className="font-semibold text-purple-600">{totalProviders}</span>
        </p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search providers by name, email or ID..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
          <Select
            value={sortField}
            onValueChange={(value) => handleSort(value as keyof ServiceProvider)}
          >
            <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Registration Date</SelectItem>
              <SelectItem value="servicesRegistered">Services Registered</SelectItem>
              <SelectItem value="id">Provider ID</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="h-10 w-10 rounded-lg border border-gray-300 hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-all"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Service Providers Table */}
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg mb-6">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-purple-900 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Provider ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Email</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Registered On</th>
              <th scope="col" className="px-6 py-3">Services Registered</th>
              <th scope="col" className="px-6 py-3">Services Done</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProviders.map((provider) => (
              <tr 
                key={provider.id} 
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:bg-gradient-to-r dark:hover:from-blue-900 dark:hover:to-purple-900 transition-all"
              >
                <td className="px-6 py-4">{provider.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{provider.name}</td>
                <td className="px-6 py-4 hidden md:table-cell">{provider.email}</td>
                <td className="px-6 py-4 hidden md:table-cell">{new Date(provider.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{provider.servicesRegistered}</td>
                <td className="px-6 py-4">{provider.servicesDone}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    provider.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {provider.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => setSelectedProvider(provider)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all"
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                      {selectedProvider && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              <UserCheck className="w-6 h-6 text-purple-600" /> Provider Details - {selectedProvider.name}
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                selectedProvider.status === 'active' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {selectedProvider.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Information</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">ID:</span> {selectedProvider.id}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Email:</span> {selectedProvider.email}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Phone:</span> {selectedProvider.phone}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Registered On:</span> {new Date(selectedProvider.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Last Login:</span> {new Date(selectedProvider.lastLogin).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">City:</span> {selectedProvider.location}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Full Address:</span> {selectedProvider.address}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Information</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Services Registered:</span> {selectedProvider.servicesRegistered}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Services Done:</span> {selectedProvider.servicesDone}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Total Earnings:</span> {selectedProvider.totalEarnings}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Service Categories:</span> {selectedProvider.serviceCategories.join(', ')}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Actions</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all">Edit Provider</Button>
                                  <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all">View Services</Button>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all">
                                    Deactivate Account
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mt-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Activity</h3>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                              <p className="text-gray-600 dark:text-gray-300">
                                Last login was on {new Date(selectedProvider.lastLogin).toLocaleDateString()} at {new Date(selectedProvider.lastLogin).toLocaleTimeString()}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300 mt-1">
                                Last service was completed on {new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <DialogClose asChild>
                              <Button variant="secondary">Close</Button>
                            </DialogClose>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default ServiceProvidersPage;