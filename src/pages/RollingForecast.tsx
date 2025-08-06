import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CustomerForecastModal from '../components/CustomerForecastModal';
import CustomerAnalyticsModal from '../components/CustomerAnalyticsModal';
import AdvancedCustomerTable from '../components/AdvancedCustomerTable';
import AdvancedForecastChart from '../components/AdvancedForecastChart';
import ForecastFilters from '../components/ForecastFilters';
import ForecastSummary from '../components/ForecastSummary';
import ExportModal, { ExportConfig } from '../components/ExportModal';
import FiltersModal, { FilterState } from '../components/FiltersModal';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Package, 
  DollarSign, 
  BarChart3, 
  Download, 
  Filter, 
  RefreshCw, 
  Plus,
  Eye,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Customer, Item, CustomerItemForecast, ForecastFormData } from '../types/forecast';
import { formatCurrency, getRemainingMonths, isMonthInFuture } from '../utils/budgetCalculations';
import { useWorkflow } from '../contexts/WorkflowContext';
import { useBudget } from '../contexts/BudgetContext';

const RollingForecast: React.FC = () => {
  const { submitForApproval } = useWorkflow();
  const { yearlyBudgets } = useBudget();
  
  // State management
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomerForAnalytics, setSelectedCustomerForAnalytics] = useState<Customer | null>(null);
  const [isCustomerForecastModalOpen, setIsCustomerForecastModalOpen] = useState(false);
  const [isCustomerAnalyticsModalOpen, setIsCustomerAnalyticsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Sample customers data with enhanced information
  const [customers] = useState<Customer[]>([
    {
      id: 'cust_001',
      name: 'Action Aid International (Tz)',
      code: 'AAI-TZ-001',
      email: 'procurement@actionaid.tz',
      phone: '+255-22-2123456',
      region: 'Dar es Salaam',
      segment: 'NGO',
      creditLimit: 500000,
      currency: 'USD',
      active: true,
      createdAt: '2023-01-15',
      lastActivity: '2024-12-10',
      channels: ['Direct Sales', 'Tender'],
      seasonality: 'medium',
      tier: 'gold',
      manager: 'John Salesman'
    },
    {
      id: 'cust_002',
      name: 'UNICEF Tanzania',
      code: 'UNICEF-TZ-002',
      email: 'supply@unicef.tz',
      phone: '+255-22-2234567',
      region: 'Arusha',
      segment: 'International NGO',
      creditLimit: 750000,
      currency: 'USD',
      active: true,
      createdAt: '2023-02-20',
      lastActivity: '2024-12-08',
      channels: ['Direct Sales', 'Framework Agreement'],
      seasonality: 'high',
      tier: 'platinum',
      manager: 'Sarah Johnson'
    },
    {
      id: 'cust_003',
      name: 'WHO Tanzania',
      code: 'WHO-TZ-003',
      email: 'logistics@who.tz',
      phone: '+255-22-2345678',
      region: 'Dodoma',
      segment: 'International Organization',
      creditLimit: 600000,
      currency: 'USD',
      active: true,
      createdAt: '2023-03-10',
      lastActivity: '2024-12-12',
      channels: ['Direct Sales', 'Long-term Contract'],
      seasonality: 'low',
      tier: 'platinum',
      manager: 'Mike Thompson'
    },
    {
      id: 'cust_004',
      name: 'Government of Tanzania - Ministry of Health',
      code: 'GOT-MOH-004',
      email: 'procurement@moh.go.tz',
      phone: '+255-22-2456789',
      region: 'Dodoma',
      segment: 'Government',
      creditLimit: 1000000,
      currency: 'USD',
      active: true,
      createdAt: '2023-04-05',
      lastActivity: '2024-12-11',
      channels: ['Government Tender', 'Direct Procurement'],
      seasonality: 'high',
      tier: 'platinum',
      manager: 'David Wilson'
    },
    {
      id: 'cust_005',
      name: 'Oxfam Tanzania',
      code: 'OXFAM-TZ-005',
      email: 'operations@oxfam.tz',
      phone: '+255-22-2567890',
      region: 'Mwanza',
      segment: 'NGO',
      creditLimit: 400000,
      currency: 'USD',
      active: true,
      createdAt: '2023-05-12',
      lastActivity: '2024-12-09',
      channels: ['Direct Sales', 'Partnership'],
      seasonality: 'medium',
      tier: 'gold',
      manager: 'Lisa Anderson'
    }
  ]);

  // Sample items data with enhanced information
  const [items] = useState<Item[]>([
    {
      id: 'item_001',
      sku: 'BFG-AT-275-70R16',
      name: 'BF Goodrich All-Terrain T/A KO2 275/70R16',
      category: 'Tyres',
      brand: 'BF Goodrich',
      unitPrice: 285.50,
      costPrice: 220.00,
      currency: 'USD',
      unit: 'piece',
      active: true,
      description: 'All-terrain tire for SUVs and light trucks',
      seasonal: false,
      minOrderQuantity: 4,
      leadTime: 14,
      supplier: 'Michelin Group'
    },
    {
      id: 'item_002',
      sku: 'MICH-PS4-225-45R17',
      name: 'Michelin Pilot Sport 4 225/45R17',
      category: 'Tyres',
      brand: 'Michelin',
      unitPrice: 320.75,
      costPrice: 250.00,
      currency: 'USD',
      unit: 'piece',
      active: true,
      description: 'High-performance summer tire',
      seasonal: true,
      seasonalMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      minOrderQuantity: 4,
      leadTime: 10,
      supplier: 'Michelin Group'
    },
    {
      id: 'item_003',
      sku: 'CONT-WC-195-65R15',
      name: 'Continental WinterContact TS 860 195/65R15',
      category: 'Tyres',
      brand: 'Continental',
      unitPrice: 195.25,
      costPrice: 155.00,
      currency: 'USD',
      unit: 'piece',
      active: true,
      description: 'Winter tire for passenger cars',
      seasonal: true,
      seasonalMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      minOrderQuantity: 4,
      leadTime: 21,
      supplier: 'Continental AG'
    },
    {
      id: 'item_004',
      sku: 'BRID-EP422-185-60R14',
      name: 'Bridgestone Ecopia EP422 Plus 185/60R14',
      category: 'Tyres',
      brand: 'Bridgestone',
      unitPrice: 165.00,
      costPrice: 130.00,
      currency: 'USD',
      unit: 'piece',
      active: true,
      description: 'Fuel-efficient tire for compact cars',
      seasonal: false,
      minOrderQuantity: 4,
      leadTime: 12,
      supplier: 'Bridgestone Corporation'
    },
    {
      id: 'item_005',
      sku: 'VARTA-B24-60AH',
      name: 'VARTA Blue Dynamic B24 60Ah Battery',
      category: 'Batteries',
      brand: 'VARTA',
      unitPrice: 85.50,
      costPrice: 65.00,
      currency: 'USD',
      unit: 'piece',
      active: true,
      description: 'Car battery for mid-size vehicles',
      seasonal: false,
      minOrderQuantity: 1,
      leadTime: 7,
      supplier: 'VARTA AG'
    },
    {
      id: 'item_006',
      sku: 'SHELL-HELIX-5W30-4L',
      name: 'Shell Helix Ultra 5W-30 4L',
      category: 'Oils & Lubricants',
      brand: 'Shell',
      unitPrice: 45.75,
      costPrice: 35.00,
      currency: 'USD',
      unit: 'bottle',
      active: true,
      description: 'Fully synthetic motor oil',
      seasonal: false,
      minOrderQuantity: 12,
      leadTime: 5,
      supplier: 'Shell International'
    }
  ]);

  // Customer forecasts state with enhanced data
  const [customerForecasts, setCustomerForecasts] = useState<CustomerItemForecast[]>([
    {
      id: 'forecast_001',
      customerId: 'cust_001',
      itemId: 'item_001',
      customer: customers[0],
      item: items[0],
      monthlyForecasts: [
        { month: 'Jan', year: 2025, monthIndex: 0, quantity: 120, unitPrice: 285.50, totalValue: 34260, notes: 'Q1 procurement cycle' },
        { month: 'Feb', year: 2025, monthIndex: 1, quantity: 100, unitPrice: 285.50, totalValue: 28550, notes: 'Regular maintenance' },
        { month: 'Mar', year: 2025, monthIndex: 2, quantity: 150, unitPrice: 285.50, totalValue: 42825, notes: 'End of Q1 stock up' },
        { month: 'Apr', year: 2025, monthIndex: 3, quantity: 80, unitPrice: 285.50, totalValue: 22840, notes: 'Reduced demand' },
        { month: 'May', year: 2025, monthIndex: 4, quantity: 110, unitPrice: 285.50, totalValue: 31405, notes: 'Regular orders' },
        { month: 'Jun', year: 2025, monthIndex: 5, quantity: 130, unitPrice: 285.50, totalValue: 37115, notes: 'Mid-year procurement' }
      ],
      yearlyTotal: 197000,
      yearlyBudgetImpact: 197000,
      monthlyBudgetImpact: {
        'Jan': 34260, 'Feb': 28550, 'Mar': 42825, 'Apr': 22840, 'May': 31405, 'Jun': 37115
      },
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-12T15:30:00Z',
      createdBy: 'John Salesman',
      status: 'approved',
      confidence: 'high',
      notes: 'Based on historical data and confirmed requirements'
    },
    {
      id: 'forecast_002',
      customerId: 'cust_002',
      itemId: 'item_002',
      customer: customers[1],
      item: items[1],
      monthlyForecasts: [
        { month: 'Jan', year: 2025, monthIndex: 0, quantity: 200, unitPrice: 320.75, totalValue: 64150, notes: 'Large fleet renewal' },
        { month: 'Feb', year: 2025, monthIndex: 1, quantity: 150, unitPrice: 320.75, totalValue: 48112.50, notes: 'Continued procurement' },
        { month: 'Mar', year: 2025, monthIndex: 2, quantity: 180, unitPrice: 320.75, totalValue: 57735, notes: 'Q1 completion' },
        { month: 'Apr', year: 2025, monthIndex: 3, quantity: 220, unitPrice: 320.75, totalValue: 70565, notes: 'Peak season start' },
        { month: 'May', year: 2025, monthIndex: 4, quantity: 250, unitPrice: 320.75, totalValue: 80187.50, notes: 'High demand period' },
        { month: 'Jun', year: 2025, monthIndex: 5, quantity: 200, unitPrice: 320.75, totalValue: 64150, notes: 'Summer maintenance' }
      ],
      yearlyTotal: 384900,
      yearlyBudgetImpact: 384900,
      monthlyBudgetImpact: {
        'Jan': 64150, 'Feb': 48112.50, 'Mar': 57735, 'Apr': 70565, 'May': 80187.50, 'Jun': 64150
      },
      createdAt: '2024-12-02T11:00:00Z',
      updatedAt: '2024-12-12T16:45:00Z',
      createdBy: 'Sarah Johnson',
      status: 'submitted',
      confidence: 'high',
      notes: 'UNICEF fleet expansion program'
    },
    {
      id: 'forecast_003',
      customerId: 'cust_003',
      itemId: 'item_005',
      customer: customers[2],
      item: items[4],
      monthlyForecasts: [
        { month: 'Jan', year: 2025, monthIndex: 0, quantity: 50, unitPrice: 85.50, totalValue: 4275, notes: 'Medical vehicle batteries' },
        { month: 'Feb', year: 2025, monthIndex: 1, quantity: 40, unitPrice: 85.50, totalValue: 3420, notes: 'Replacement cycle' },
        { month: 'Mar', year: 2025, monthIndex: 2, quantity: 60, unitPrice: 85.50, totalValue: 5130, notes: 'Q1 maintenance' },
        { month: 'Apr', year: 2025, monthIndex: 3, quantity: 45, unitPrice: 85.50, totalValue: 3847.50, notes: 'Regular orders' },
        { month: 'May', year: 2025, monthIndex: 4, quantity: 55, unitPrice: 85.50, totalValue: 4702.50, notes: 'Fleet expansion' },
        { month: 'Jun', year: 2025, monthIndex: 5, quantity: 50, unitPrice: 85.50, totalValue: 4275, notes: 'Mid-year procurement' }
      ],
      yearlyTotal: 25650,
      yearlyBudgetImpact: 25650,
      monthlyBudgetImpact: {
        'Jan': 4275, 'Feb': 3420, 'Mar': 5130, 'Apr': 3847.50, 'May': 4702.50, 'Jun': 4275
      },
      createdAt: '2024-12-03T09:00:00Z',
      updatedAt: '2024-12-12T14:20:00Z',
      createdBy: 'Mike Thompson',
      status: 'approved',
      confidence: 'medium',
      notes: 'WHO medical vehicle battery requirements'
    }
  ]);

  // Calculate totals and statistics
  const calculateTotals = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get budget data from yearly budgets
    const budgetData = yearlyBudgets.filter(b => parseInt(b.year) === selectedYear);
    const totalBudget2025 = budgetData.reduce((sum, b) => sum + b.totalBudget, 0);
    const totalBudgetUnits = budgetData.reduce((sum, b) => 
      sum + b.monthlyData.reduce((monthSum, m) => monthSum + m.budgetValue, 0), 0
    );

    // Calculate actual sales (from completed months)
    const actualSales2025 = budgetData.reduce((sum, b) => {
      return sum + b.monthlyData
        .filter(m => {
          const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month);
          return selectedYear < currentYear || (selectedYear === currentYear && monthIndex < currentMonth);
        })
        .reduce((monthSum, m) => monthSum + (m.actualValue || m.budgetValue * 0.9), 0);
    }, 0);

    const actualUnits2025 = budgetData.reduce((sum, b) => {
      return sum + b.monthlyData
        .filter(m => {
          const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month);
          return selectedYear < currentYear || (selectedYear === currentYear && monthIndex < currentMonth);
        })
        .reduce((monthSum, m) => monthSum + Math.round((m.actualValue || m.budgetValue * 0.9) / (m.rate || 100)), 0);
    }, 0);

    // Calculate forecast totals
    const forecastData = customerForecasts.filter(f => 
      f.monthlyForecasts.some(mf => mf.year === selectedYear)
    );
    
    const totalForecast2025 = forecastData.reduce((sum, f) => sum + f.yearlyTotal, 0);
    const totalForecastUnits = forecastData.reduce((sum, f) => 
      sum + f.monthlyForecasts.reduce((monthSum, mf) => monthSum + mf.quantity, 0), 0
    );

    return {
      budget: { value: totalBudget2025, units: totalBudgetUnits },
      actual: { value: actualSales2025, units: actualUnits2025 },
      forecast: { value: totalForecast2025, units: totalForecastUnits }
    };
  };

  const totals = calculateTotals();

  // Get remaining months for current year
  const remainingMonths = getRemainingMonths();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateForecast = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerForecastModalOpen(true);
  };

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomerForAnalytics(customer);
    setIsCustomerAnalyticsModalOpen(true);
  };

  const handleSaveForecast = (forecastData: ForecastFormData) => {
    const customer = customers.find(c => c.id === forecastData.customerId);
    const item = items.find(i => i.id === forecastData.itemId);
    
    if (!customer || !item) {
      showNotification('Invalid customer or item selected', 'error');
      return;
    }

    // Convert forecast data to monthly forecasts
    const monthlyForecasts = Object.entries(forecastData.forecasts).map(([month, data]) => {
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
      return {
        month,
        year: selectedYear,
        monthIndex,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalValue: data.quantity * data.unitPrice,
        notes: data.notes || ''
      };
    });

    const yearlyTotal = monthlyForecasts.reduce((sum, mf) => sum + mf.totalValue, 0);
    const monthlyBudgetImpact = monthlyForecasts.reduce((acc, mf) => {
      acc[mf.month] = mf.totalValue;
      return acc;
    }, {} as { [month: string]: number });

    const newForecast: CustomerItemForecast = {
      id: `forecast_${Date.now()}`,
      customerId: forecastData.customerId,
      itemId: forecastData.itemId,
      customer,
      item,
      monthlyForecasts,
      yearlyTotal,
      yearlyBudgetImpact: yearlyTotal,
      monthlyBudgetImpact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      status: 'draft',
      confidence: forecastData.confidence,
      notes: forecastData.notes
    };

    setCustomerForecasts(prev => [...prev, newForecast]);
    showNotification(`Forecast created for ${customer.name} - ${item.name}`, 'success');
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    // In a real app, this would update the customer in the database
    showNotification(`Customer ${updatedCustomer.name} updated successfully`, 'success');
  };

  const handleExport = (config: ExportConfig) => {
    const fileName = `rolling_forecast_${config.year}.${config.format === 'excel' ? 'xlsx' : config.format}`;
    showNotification(`Exporting rolling forecast as ${fileName}...`, 'success');
    
    setTimeout(() => {
      showNotification(`Export completed: ${fileName}`, 'success');
    }, 2000);
  };

  const handleApplyFilters = (filters: FilterState) => {
    showNotification('Filters applied successfully', 'success');
  };

  const handleSubmitForApproval = () => {
    const draftForecasts = customerForecasts.filter(f => f.status === 'draft');
    
    if (draftForecasts.length === 0) {
      showNotification('No draft forecasts to submit', 'error');
      return;
    }

    // Convert forecasts to budget format for workflow
    const budgetData = draftForecasts.map(forecast => ({
      id: forecast.id,
      customer: forecast.customer.name,
      item: forecast.item.name,
      category: forecast.item.category,
      brand: forecast.item.brand,
      year: selectedYear.toString(),
      totalBudget: forecast.yearlyTotal,
      monthlyData: forecast.monthlyForecasts.map(mf => ({
        month: mf.month,
        budgetValue: mf.quantity,
        actualValue: 0,
        rate: mf.unitPrice,
        stock: 0,
        git: 0,
        discount: 0
      })),
      createdBy: forecast.createdBy,
      createdAt: forecast.createdAt
    }));

    const workflowId = submitForApproval(budgetData, draftForecasts.map(f => ({
      id: f.id,
      customer: f.customer.name,
      item: f.item.name,
      category: f.item.category,
      brand: f.item.brand,
      year: selectedYear.toString(),
      forecastUnits: f.monthlyForecasts.reduce((sum, mf) => sum + mf.quantity, 0),
      forecastValue: f.yearlyTotal,
      createdBy: f.createdBy,
      createdAt: f.createdAt
    })));

    // Update forecast status
    setCustomerForecasts(prev => prev.map(f => 
      f.status === 'draft' ? { ...f, status: 'submitted' } : f
    ));

    showNotification(`${draftForecasts.length} forecasts submitted for approval (ID: ${workflowId})`, 'success');
  };

  // Summary data for cards
  const summaryData = [
    {
      title: 'Total Forecast Value',
      value: formatCurrency(totals.forecast.value),
      change: '+15.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'primary' as const
    },
    {
      title: 'Forecast Accuracy',
      value: '94.2%',
      change: '+2.1%',
      isPositive: true,
      icon: Target,
      color: 'success' as const
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.active).length.toString(),
      change: '+3',
      isPositive: true,
      icon: Users,
      color: 'info' as const
    },
    {
      title: 'Forecast Items',
      value: customerForecasts.length.toString(),
      change: '+8',
      isPositive: true,
      icon: Package,
      color: 'warning' as const
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header with Enhanced Totals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                <span className="text-gray-500 font-light">Forecast /</span> Rolling Forecast {selectedYear}
              </h4>
              <p className="text-gray-600">
                Create and manage rolling forecasts for customers with dynamic monthly breakdown
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
              <button
                onClick={() => setIsFiltersModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleSubmitForApproval}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit for Approval</span>
              </button>
            </div>
          </div>

          {/* Enhanced Summary Cards with Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget 2025 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-900">Budget {selectedYear}</h3>
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Total Value:</span>
                  <span className="text-xl font-bold text-blue-800">{formatCurrency(totals.budget.value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Total Units:</span>
                  <span className="text-lg font-semibold text-blue-800">{totals.budget.units.toLocaleString()}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  From {yearlyBudgets.filter(b => parseInt(b.year) === selectedYear).length} budget entries
                </div>
              </div>
            </div>

            {/* Sales 2025 (Actual) */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-green-900">Sales {selectedYear}</h3>
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Total Value:</span>
                  <span className="text-xl font-bold text-green-800">{formatCurrency(totals.actual.value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Total Units:</span>
                  <span className="text-lg font-semibold text-green-800">{totals.actual.units.toLocaleString()}</span>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  Actual sales for completed months
                </div>
              </div>
            </div>

            {/* Forecast 2025 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-purple-900">Forecast {selectedYear}</h3>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Total Value:</span>
                  <span className="text-xl font-bold text-purple-800">{formatCurrency(totals.forecast.value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Total Units:</span>
                  <span className="text-lg font-semibold text-purple-800">{totals.forecast.units.toLocaleString()}</span>
                </div>
                <div className="text-xs text-purple-600 mt-2">
                  From {customerForecasts.length} customer forecasts
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Months Alert */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                Remaining Months for {selectedYear}: 
              </span>
              <div className="flex gap-2 ml-2">
                {remainingMonths.map(month => (
                  <span key={month} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    {month}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              Forecasts can only be created for remaining months. Past months show actual sales data.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <ForecastSummary data={summaryData} />

        {/* Advanced Forecast Chart */}
        <AdvancedForecastChart />

        {/* Customer Management Table */}
        <AdvancedCustomerTable
          customers={customers}
          items={items}
          customerForecasts={customerForecasts}
          onUpdateCustomer={handleUpdateCustomer}
          onCreateForecast={handleCreateForecast}
          onViewCustomerDetails={handleViewCustomerDetails}
          selectedYear={selectedYear}
        />

        {/* Forecast Status Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Draft</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">
                {customerForecasts.filter(f => f.status === 'draft').length}
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(customerForecasts.filter(f => f.status === 'draft').reduce((sum, f) => sum + f.yearlyTotal, 0))}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Submitted</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {customerForecasts.filter(f => f.status === 'submitted').length}
              </p>
              <p className="text-sm text-blue-500">
                {formatCurrency(customerForecasts.filter(f => f.status === 'submitted').reduce((sum, f) => sum + f.yearlyTotal, 0))}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {customerForecasts.filter(f => f.status === 'approved').length}
              </p>
              <p className="text-sm text-green-500">
                {formatCurrency(customerForecasts.filter(f => f.status === 'approved').reduce((sum, f) => sum + f.yearlyTotal, 0))}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">Revised</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {customerForecasts.filter(f => f.status === 'revised').length}
              </p>
              <p className="text-sm text-orange-500">
                {formatCurrency(customerForecasts.filter(f => f.status === 'revised').reduce((sum, f) => sum + f.yearlyTotal, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Modals */}
        <CustomerForecastModal
          isOpen={isCustomerForecastModalOpen}
          onClose={() => {
            setIsCustomerForecastModalOpen(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          items={items}
          onSaveForecast={handleSaveForecast}
        />

        <CustomerAnalyticsModal
          isOpen={isCustomerAnalyticsModalOpen}
          onClose={() => {
            setIsCustomerAnalyticsModalOpen(false);
            setSelectedCustomerForAnalytics(null);
          }}
          customer={selectedCustomerForAnalytics}
          customerForecasts={customerForecasts}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          title="Export Rolling Forecast"
        />

        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          onApply={handleApplyFilters}
        />
      </div>
    </Layout>
  );
};

export default RollingForecast;