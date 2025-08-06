import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import YearlyBudgetModal from '../components/YearlyBudgetModal';
import ExportModal, { ExportConfig } from '../components/ExportModal';
import ImportModal, { ImportConfig } from '../components/ImportModal';
import DistributionModal, { DistributionConfig } from '../components/DistributionModal';
import ScenariosModal, { ScenarioConfig } from '../components/ScenariosModal';
import AnalyticsPlanningModal from '../components/AnalyticsPlanningModal';
import BudgetFilters from '../components/BudgetFilters';
import BudgetSummary from '../components/BudgetSummary';
import DistributionSummary from '../components/DistributionSummary';
import ExcelLikeCustomerTable from '../components/ExcelLikeCustomerTable';
import { 
  Plus, 
  Download, 
  Upload, 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  Target,
  Calendar,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useBudget, YearlyBudgetData } from '../contexts/BudgetContext';
import { useWorkflow } from '../contexts/WorkflowContext';

interface SalesBudgetItem {
  id: number;
  selected: boolean;
  customer: string;
  item: string;
  category: string;
  brand: string;
  itemCombined: string;
  budget2025: number;
  actual2025: number;
  budget2026: number;
  rate: number;
  stock: number;
  git: number;
  budgetValue2026: number;
  discount: number;
  monthlyData: MonthlyBudget[];
}

interface MonthlyBudget {
  month: string;
  budgetValue: number;
  actualValue: number;
  rate: number;
  stock: number;
  git: number;
  discount: number;
}

const SalesBudget: React.FC = () => {
  const { yearlyBudgets, addYearlyBudget, updateYearlyBudget, deleteYearlyBudget } = useBudget();
  const { submitForApproval } = useWorkflow();
  
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isYearlyBudgetModalOpen, setIsYearlyBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDistributionModalOpen, setIsDistributionModalOpen] = useState(false);
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Enhanced budget data with monthly breakdown
  const [budgetData, setBudgetData] = useState<SalesBudgetItem[]>([
    {
      id: 1,
      selected: false,
      customer: 'Action Aid International (Tz)',
      item: 'BF Goodrich All-Terrain T/A KO2 275/70R16',
      category: 'Tyres',
      brand: 'BF Goodrich',
      itemCombined: 'BF Goodrich All-Terrain T/A KO2 275/70R16',
      budget2025: 185000,
      actual2025: 175000,
      budget2026: 220000,
      rate: 285.50,
      stock: 150,
      git: 25,
      budgetValue2026: 770,
      discount: 5000,
      monthlyData: [
        { month: 'Jan', budgetValue: 60, actualValue: 55, rate: 285.50, stock: 150, git: 25, discount: 500 },
        { month: 'Feb', budgetValue: 65, actualValue: 62, rate: 285.50, stock: 140, git: 30, discount: 400 },
        { month: 'Mar', budgetValue: 70, actualValue: 68, rate: 285.50, stock: 130, git: 20, discount: 600 },
        { month: 'Apr', budgetValue: 75, actualValue: 0, rate: 285.50, stock: 120, git: 35, discount: 500 },
        { month: 'May', budgetValue: 80, actualValue: 0, rate: 285.50, stock: 110, git: 40, discount: 700 },
        { month: 'Jun', budgetValue: 85, actualValue: 0, rate: 285.50, stock: 100, git: 45, discount: 600 },
        { month: 'Jul', budgetValue: 90, actualValue: 0, rate: 285.50, stock: 90, git: 50, discount: 800 },
        { month: 'Aug', budgetValue: 85, actualValue: 0, rate: 285.50, stock: 80, git: 45, discount: 700 },
        { month: 'Sep', budgetValue: 80, actualValue: 0, rate: 285.50, stock: 70, git: 40, discount: 600 },
        { month: 'Oct', budgetValue: 75, actualValue: 0, rate: 285.50, stock: 60, git: 35, discount: 500 },
        { month: 'Nov', budgetValue: 70, actualValue: 0, rate: 285.50, stock: 50, git: 30, discount: 400 },
        { month: 'Dec', budgetValue: 65, actualValue: 0, rate: 285.50, stock: 40, git: 25, discount: 300 }
      ]
    },
    {
      id: 2,
      selected: false,
      customer: 'UNICEF Tanzania',
      item: 'Michelin Pilot Sport 4 225/45R17',
      category: 'Tyres',
      brand: 'Michelin',
      itemCombined: 'Michelin Pilot Sport 4 225/45R17',
      budget2025: 245000,
      actual2025: 235000,
      budget2026: 285000,
      rate: 320.75,
      stock: 200,
      git: 40,
      budgetValue2026: 888,
      discount: 8000,
      monthlyData: [
        { month: 'Jan', budgetValue: 70, actualValue: 68, rate: 320.75, stock: 200, git: 40, discount: 700 },
        { month: 'Feb', budgetValue: 75, actualValue: 72, rate: 320.75, stock: 190, git: 45, discount: 600 },
        { month: 'Mar', budgetValue: 80, actualValue: 78, rate: 320.75, stock: 180, git: 35, discount: 800 },
        { month: 'Apr', budgetValue: 85, actualValue: 0, rate: 320.75, stock: 170, git: 50, discount: 700 },
        { month: 'May', budgetValue: 90, actualValue: 0, rate: 320.75, stock: 160, git: 55, discount: 900 },
        { month: 'Jun', budgetValue: 95, actualValue: 0, rate: 320.75, stock: 150, git: 60, discount: 800 },
        { month: 'Jul', budgetValue: 100, actualValue: 0, rate: 320.75, stock: 140, git: 65, discount: 1000 },
        { month: 'Aug', budgetValue: 95, actualValue: 0, rate: 320.75, stock: 130, git: 60, discount: 900 },
        { month: 'Sep', budgetValue: 90, actualValue: 0, rate: 320.75, stock: 120, git: 55, discount: 800 },
        { month: 'Oct', budgetValue: 85, actualValue: 0, rate: 320.75, stock: 110, git: 50, discount: 700 },
        { month: 'Nov', budgetValue: 80, actualValue: 0, rate: 320.75, stock: 100, git: 45, discount: 600 },
        { month: 'Dec', budgetValue: 75, actualValue: 0, rate: 320.75, stock: 90, git: 40, discount: 500 }
      ]
    },
    {
      id: 3,
      selected: false,
      customer: 'WHO Tanzania',
      item: 'VARTA Blue Dynamic B24 60Ah Battery',
      category: 'Batteries',
      brand: 'VARTA',
      itemCombined: 'VARTA Blue Dynamic B24 60Ah Battery',
      budget2025: 95000,
      actual2025: 88000,
      budget2026: 115000,
      rate: 85.50,
      stock: 300,
      git: 50,
      budgetValue2026: 1345,
      discount: 3000,
      monthlyData: [
        { month: 'Jan', budgetValue: 110, actualValue: 105, rate: 85.50, stock: 300, git: 50, discount: 250 },
        { month: 'Feb', budgetValue: 115, actualValue: 110, rate: 85.50, stock: 290, git: 55, discount: 200 },
        { month: 'Mar', budgetValue: 120, actualValue: 115, rate: 85.50, stock: 280, git: 45, discount: 300 },
        { month: 'Apr', budgetValue: 125, actualValue: 0, rate: 85.50, stock: 270, git: 60, discount: 250 },
        { month: 'May', budgetValue: 130, actualValue: 0, rate: 85.50, stock: 260, git: 65, discount: 350 },
        { month: 'Jun', budgetValue: 135, actualValue: 0, rate: 85.50, stock: 250, git: 70, discount: 300 },
        { month: 'Jul', budgetValue: 140, actualValue: 0, rate: 85.50, stock: 240, git: 75, discount: 400 },
        { month: 'Aug', budgetValue: 135, actualValue: 0, rate: 85.50, stock: 230, git: 70, discount: 350 },
        { month: 'Sep', budgetValue: 130, actualValue: 0, rate: 85.50, stock: 220, git: 65, discount: 300 },
        { month: 'Oct', budgetValue: 125, actualValue: 0, rate: 85.50, stock: 210, git: 60, discount: 250 },
        { month: 'Nov', budgetValue: 120, actualValue: 0, rate: 85.50, stock: 200, git: 55, discount: 200 },
        { month: 'Dec', budgetValue: 115, actualValue: 0, rate: 85.50, stock: 190, git: 50, discount: 150 }
      ]
    },
    {
      id: 4,
      selected: false,
      customer: 'Government of Tanzania - Ministry of Health',
      item: 'Continental WinterContact TS 860 195/65R15',
      category: 'Tyres',
      brand: 'Continental',
      itemCombined: 'Continental WinterContact TS 860 195/65R15',
      budget2025: 165000,
      actual2025: 158000,
      budget2026: 195000,
      rate: 195.25,
      stock: 180,
      git: 30,
      budgetValue2026: 999,
      discount: 4500,
      monthlyData: [
        { month: 'Jan', budgetValue: 85, actualValue: 82, rate: 195.25, stock: 180, git: 30, discount: 400 },
        { month: 'Feb', budgetValue: 90, actualValue: 87, rate: 195.25, stock: 170, git: 35, discount: 350 },
        { month: 'Mar', budgetValue: 95, actualValue: 92, rate: 195.25, stock: 160, git: 25, discount: 450 },
        { month: 'Apr', budgetValue: 100, actualValue: 0, rate: 195.25, stock: 150, git: 40, discount: 400 },
        { month: 'May', budgetValue: 105, actualValue: 0, rate: 195.25, stock: 140, git: 45, discount: 500 },
        { month: 'Jun', budgetValue: 110, actualValue: 0, rate: 195.25, stock: 130, git: 50, discount: 450 },
        { month: 'Jul', budgetValue: 115, actualValue: 0, rate: 195.25, stock: 120, git: 55, discount: 550 },
        { month: 'Aug', budgetValue: 110, actualValue: 0, rate: 195.25, stock: 110, git: 50, discount: 500 },
        { month: 'Sep', budgetValue: 105, actualValue: 0, rate: 195.25, stock: 100, git: 45, discount: 450 },
        { month: 'Oct', budgetValue: 100, actualValue: 0, rate: 195.25, stock: 90, git: 40, discount: 400 },
        { month: 'Nov', budgetValue: 95, actualValue: 0, rate: 195.25, stock: 80, git: 35, discount: 350 },
        { month: 'Dec', budgetValue: 90, actualValue: 0, rate: 195.25, stock: 70, git: 30, discount: 300 }
      ]
    },
    {
      id: 5,
      selected: false,
      customer: 'Oxfam Tanzania',
      item: 'Shell Helix Ultra 5W-30 4L',
      category: 'Oils & Lubricants',
      brand: 'Shell',
      itemCombined: 'Shell Helix Ultra 5W-30 4L',
      budget2025: 75000,
      actual2025: 72000,
      budget2026: 85000,
      rate: 45.75,
      stock: 500,
      git: 80,
      budgetValue2026: 1858,
      discount: 2000,
      monthlyData: [
        { month: 'Jan', budgetValue: 150, actualValue: 145, rate: 45.75, stock: 500, git: 80, discount: 150 },
        { month: 'Feb', budgetValue: 155, actualValue: 150, rate: 45.75, stock: 490, git: 85, discount: 120 },
        { month: 'Mar', budgetValue: 160, actualValue: 155, rate: 45.75, stock: 480, git: 75, discount: 180 },
        { month: 'Apr', budgetValue: 165, actualValue: 0, rate: 45.75, stock: 470, git: 90, discount: 150 },
        { month: 'May', budgetValue: 170, actualValue: 0, rate: 45.75, stock: 460, git: 95, discount: 200 },
        { month: 'Jun', budgetValue: 175, actualValue: 0, rate: 45.75, stock: 450, git: 100, discount: 180 },
        { month: 'Jul', budgetValue: 180, actualValue: 0, rate: 45.75, stock: 440, git: 105, discount: 220 },
        { month: 'Aug', budgetValue: 175, actualValue: 0, rate: 45.75, stock: 430, git: 100, discount: 200 },
        { month: 'Sep', budgetValue: 170, actualValue: 0, rate: 45.75, stock: 420, git: 95, discount: 180 },
        { month: 'Oct', budgetValue: 165, actualValue: 0, rate: 45.75, stock: 410, git: 90, discount: 150 },
        { month: 'Nov', budgetValue: 160, actualValue: 0, rate: 45.75, stock: 400, git: 85, discount: 120 },
        { month: 'Dec', budgetValue: 155, actualValue: 0, rate: 45.75, stock: 390, git: 80, discount: 100 }
      ]
    }
  ]);

  const [distributions, setDistributions] = useState<any[]>([]);

  // Save budget data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('salesBudgetData', JSON.stringify(budgetData));
  }, [budgetData]);

  // Load budget data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('salesBudgetData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setBudgetData(parsedData);
      } catch (error) {
        console.warn('Failed to load saved budget data:', error);
      }
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate totals for the selected year
  const calculateTotals = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const year = parseInt(selectedYear);

    // Budget totals
    const totalBudget = budgetData.reduce((sum, item) => sum + (year === 2025 ? item.budget2025 : item.budget2026), 0);
    const totalBudgetUnits = budgetData.reduce((sum, item) => {
      if (year === 2025) {
        return sum + item.monthlyData.reduce((monthSum, m) => monthSum + m.budgetValue, 0);
      } else {
        return sum + item.budgetValue2026;
      }
    }, 0);

    // Actual sales (only for completed months)
    const totalActual = budgetData.reduce((sum, item) => {
      if (year === 2025) {
        return sum + item.monthlyData
          .filter(m => {
            const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month);
            return year < currentYear || (year === currentYear && monthIndex < currentMonth);
          })
          .reduce((monthSum, m) => monthSum + (m.actualValue * m.rate), 0);
      }
      return sum + item.actual2025;
    }, 0);

    const totalActualUnits = budgetData.reduce((sum, item) => {
      if (year === 2025) {
        return sum + item.monthlyData
          .filter(m => {
            const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month);
            return year < currentYear || (year === currentYear && monthIndex < currentMonth);
          })
          .reduce((monthSum, m) => monthSum + m.actualValue, 0);
      }
      return sum + Math.round(item.actual2025 / item.rate);
    }, 0);

    // Forecast totals (from yearly budgets context)
    const forecastBudgets = yearlyBudgets.filter(b => parseInt(b.year) === year);
    const totalForecast = forecastBudgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const totalForecastUnits = forecastBudgets.reduce((sum, b) => 
      sum + b.monthlyData.reduce((monthSum, m) => monthSum + m.budgetValue, 0), 0
    );

    return {
      budget: { value: totalBudget, units: totalBudgetUnits },
      actual: { value: totalActual, units: totalActualUnits },
      forecast: { value: totalForecast, units: totalForecastUnits }
    };
  };

  const totals = calculateTotals();

  // Get unique customers for filtering
  const uniqueCustomers = [...new Set(budgetData.map(item => item.customer))];

  // Filter budget data
  const filteredBudgetData = budgetData.filter(item => {
    const matchesCustomer = !selectedCustomer || item.customer === selectedCustomer;
    const matchesSearch = !searchTerm || 
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCustomer && matchesSearch;
  });

  const handleYearlyBudgetSave = (data: any) => {
    addYearlyBudget(data);
    showNotification(`Budget for ${data.customer} - ${data.item} saved successfully`, 'success');
  };

  const handleExport = (config: ExportConfig) => {
    const fileName = `sales_budget_${config.year}.${config.format === 'excel' ? 'xlsx' : config.format}`;
    showNotification(`Exporting sales budget as ${fileName}...`, 'success');
    
    setTimeout(() => {
      showNotification(`Export completed: ${fileName}`, 'success');
    }, 2000);
  };

  const handleImport = (file: File, config: ImportConfig) => {
    showNotification(`Importing ${file.name} with ${config.mergeStrategy} strategy...`, 'success');
    
    setTimeout(() => {
      showNotification(`Import completed: ${file.name}`, 'success');
    }, 3000);
  };

  const handleApplyDistribution = (distribution: DistributionConfig) => {
    const newDistribution = {
      type: distribution.type,
      name: `${distribution.type.charAt(0).toUpperCase() + distribution.type.slice(1)} Distribution`,
      appliedAt: new Date(),
      segments: Object.keys(distribution.distributions).length,
      totalAmount: distribution.totalBudget,
      totalUnits: distribution.totalUnits
    };
    
    setDistributions(prev => [...prev, newDistribution]);
    showNotification(`${distribution.type} distribution applied successfully`, 'success');
  };

  const handleApplyScenario = (scenario: ScenarioConfig) => {
    showNotification(`Applied ${scenario.name} scenario with ${scenario.adjustments.salesGrowth}% sales growth`, 'success');
  };

  const handleSubmitForApproval = () => {
    const selectedItems = budgetData.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      showNotification('Please select at least one budget item to submit', 'error');
      return;
    }

    // Convert to yearly budget format
    const budgetDataForSubmission = selectedItems.map(item => ({
      id: `budget_${item.id}_${Date.now()}`,
      customer: item.customer,
      item: item.item,
      category: item.category,
      brand: item.brand,
      year: selectedYear,
      totalBudget: parseInt(selectedYear) === 2025 ? item.budget2025 : item.budget2026,
      monthlyData: item.monthlyData,
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    }));

    const workflowId = submitForApproval(budgetDataForSubmission);
    showNotification(`${selectedItems.length} budget items submitted for approval (ID: ${workflowId})`, 'success');
  };

  const handleSelectAll = () => {
    const allSelected = filteredBudgetData.every(item => item.selected);
    setBudgetData(prev => prev.map(item => ({
      ...item,
      selected: filteredBudgetData.includes(item) ? !allSelected : item.selected
    })));
  };

  const handleSelectItem = (id: number) => {
    setBudgetData(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const selectedCount = budgetData.filter(item => item.selected).length;

  // Summary data for cards
  const summaryData = [
    {
      title: 'Total Budget Value',
      value: `${formatCurrency(totals.budget.value)}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'primary' as const
    },
    {
      title: 'Budget Achievement',
      value: totals.budget.value > 0 ? `${Math.round((totals.actual.value / totals.budget.value) * 100)}%` : '0%',
      change: '+5.3%',
      isPositive: true,
      icon: Target,
      color: 'success' as const
    },
    {
      title: 'Active Customers',
      value: uniqueCustomers.length.toString(),
      change: '+2',
      isPositive: true,
      icon: Users,
      color: 'info' as const
    },
    {
      title: 'Budget Items',
      value: budgetData.length.toString(),
      change: '+8',
      isPositive: true,
      icon: Package,
      color: 'warning' as const
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header with Enhanced Totals Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                <span className="text-gray-500 font-light">Budget /</span> Sales Budget {selectedYear}
              </h4>
              <p className="text-gray-600">
                Manage sales budgets with monthly breakdown and customer-specific forecasting
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
              <button
                onClick={() => setIsYearlyBudgetModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Budget</span>
              </button>
            </div>
          </div>

          {/* Enhanced Summary Cards with Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Card */}
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
                  Target budget for {selectedYear}
                </div>
              </div>
            </div>

            {/* Sales Card (Actual) */}
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

            {/* Forecast Card */}
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
                  Rolling forecast projections
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <BudgetSummary data={summaryData} />

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers, items, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Customers</option>
                {uniqueCustomers.map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {selectedCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                  <span className="text-sm text-blue-800">{selectedCount} selected</span>
                  <button
                    onClick={handleSubmitForApproval}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Submit for Approval
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
              
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={() => setIsDistributionModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
              >
                <PieChart className="w-4 h-4" />
                <span>Set Distribution</span>
              </button>
              
              <button
                onClick={() => setIsScenariosModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Scenarios</span>
              </button>
              
              <button
                onClick={() => setIsAnalyticsModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Distribution Summary */}
        <DistributionSummary distributions={distributions} />

        {/* Enhanced Budget Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Sales Budget Table</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {filteredBudgetData.every(item => item.selected) ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                  {filteredBudgetData.length} items
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse sales-budget-table">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="table-header-row">
                  <th className="sticky left-0 bg-gray-100 z-20 w-12 p-3 border-r border-gray-300">
                    <input
                      type="checkbox"
                      checked={filteredBudgetData.length > 0 && filteredBudgetData.every(item => item.selected)}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-blue-600"
                    />
                  </th>
                  <th className="sticky left-12 bg-gray-100 z-20 min-w-[200px] p-3 text-left border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Customer</span>
                  </th>
                  <th className="sticky left-[252px] bg-gray-100 z-20 min-w-[250px] p-3 text-left border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Item</span>
                  </th>
                  <th className="min-w-[100px] p-3 text-left border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Category</span>
                  </th>
                  <th className="min-w-[100px] p-3 text-left border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Brand</span>
                  </th>
                  <th className="min-w-[120px] p-3 text-center border-r border-gray-300 bg-blue-50">
                    <div className="font-semibold text-blue-700">BUD {selectedYear}</div>
                    <div className="text-xs text-blue-600">
                      {formatCurrency(totals.budget.value)} | {totals.budget.units.toLocaleString()} Units
                    </div>
                  </th>
                  <th className="min-w-[120px] p-3 text-center border-r border-gray-300 bg-green-50">
                    <div className="font-semibold text-green-700">ACT {selectedYear}</div>
                    <div className="text-xs text-green-600">
                      {formatCurrency(totals.actual.value)} | {totals.actual.units.toLocaleString()} Units
                    </div>
                  </th>
                  <th className="min-w-[120px] p-3 text-center border-r border-gray-300 bg-purple-50">
                    <div className="font-semibold text-purple-700">FOR {selectedYear}</div>
                    <div className="text-xs text-purple-600">
                      {formatCurrency(totals.forecast.value)} | {totals.forecast.units.toLocaleString()} Units
                    </div>
                  </th>
                  <th className="min-w-[100px] p-3 text-center border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Rate ($)</span>
                  </th>
                  <th className="min-w-[80px] p-3 text-center border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Stock</span>
                  </th>
                  <th className="min-w-[80px] p-3 text-center border-r border-gray-300">
                    <span className="font-semibold text-gray-700">GIT</span>
                  </th>
                  <th className="min-w-[100px] p-3 text-center border-r border-gray-300">
                    <span className="font-semibold text-gray-700">Discount</span>
                  </th>
                  <th className="sticky right-0 bg-gray-100 z-20 min-w-[100px] p-3 text-center border-l border-gray-300">
                    <span className="font-semibold text-gray-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgetData.map((item, index) => (
                  <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-50 ${
                    item.selected ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="sticky left-0 bg-inherit z-10 p-3 border-r border-gray-300">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </td>
                    <td className="sticky left-12 bg-inherit z-10 p-3 border-r border-gray-300">
                      <div className="font-medium text-gray-900">{item.customer}</div>
                    </td>
                    <td className="sticky left-[252px] bg-inherit z-10 p-3 border-r border-gray-300">
                      <div className="font-medium text-gray-900">{item.item}</div>
                    </td>
                    <td className="p-3 border-r border-gray-300">{item.category}</td>
                    <td className="p-3 border-r border-gray-300">{item.brand}</td>
                    <td className="p-3 text-center border-r border-gray-300 bg-blue-50">
                      <div className="font-semibold text-blue-800">
                        {formatCurrency(parseInt(selectedYear) === 2025 ? item.budget2025 : item.budget2026)}
                      </div>
                      <div className="text-xs text-blue-600">
                        {parseInt(selectedYear) === 2025 
                          ? item.monthlyData.reduce((sum, m) => sum + m.budgetValue, 0).toLocaleString()
                          : item.budgetValue2026.toLocaleString()
                        } units
                      </div>
                    </td>
                    <td className="p-3 text-center border-r border-gray-300 bg-green-50">
                      <div className="font-semibold text-green-800">
                        {formatCurrency(parseInt(selectedYear) === 2025 ? item.actual2025 : 0)}
                      </div>
                      <div className="text-xs text-green-600">
                        {parseInt(selectedYear) === 2025 
                          ? item.monthlyData
                              .filter(m => {
                                const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month);
                                return monthIndex < new Date().getMonth();
                              })
                              .reduce((sum, m) => sum + m.actualValue, 0).toLocaleString()
                          : '0'
                        } units
                      </div>
                    </td>
                    <td className="p-3 text-center border-r border-gray-300 bg-purple-50">
                      <div className="font-semibold text-purple-800">
                        {formatCurrency(0)} {/* This will be updated when forecasts are created */}
                      </div>
                      <div className="text-xs text-purple-600">0 units</div>
                    </td>
                    <td className="p-3 text-center border-r border-gray-300">${item.rate}</td>
                    <td className="p-3 text-center border-r border-gray-300">{item.stock}</td>
                    <td className="p-3 text-center border-r border-gray-300">{item.git}</td>
                    <td className="p-3 text-center border-r border-gray-300">${item.discount.toLocaleString()}</td>
                    <td className="sticky right-0 bg-inherit z-10 p-3 border-l border-gray-300">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => showNotification(`Viewing details for ${item.customer}`, 'success')}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showNotification(`Editing ${item.item}`, 'success')}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setBudgetData(prev => prev.filter(i => i.id !== item.id));
                            showNotification(`Deleted ${item.item}`, 'success');
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              
              {/* Summary Footer */}
              <tfoot className="bg-gray-100 sticky bottom-0">
                <tr className="border-t-2 border-gray-300">
                  <td colSpan={5} className="p-3 font-bold text-gray-900">TOTALS:</td>
                  <td className="p-3 text-center font-bold border-r border-gray-300 bg-blue-50">
                    <div className="text-blue-800">{formatCurrency(totals.budget.value)}</div>
                    <div className="text-xs text-blue-600">{totals.budget.units.toLocaleString()} units</div>
                  </td>
                  <td className="p-3 text-center font-bold border-r border-gray-300 bg-green-50">
                    <div className="text-green-800">{formatCurrency(totals.actual.value)}</div>
                    <div className="text-xs text-green-600">{totals.actual.units.toLocaleString()} units</div>
                  </td>
                  <td className="p-3 text-center font-bold border-r border-gray-300 bg-purple-50">
                    <div className="text-purple-800">{formatCurrency(totals.forecast.value)}</div>
                    <div className="text-xs text-purple-600">{totals.forecast.units.toLocaleString()} units</div>
                  </td>
                  <td colSpan={5} className="p-3"></td>
                </tr>
              </tfoot>
            </table>
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
        <YearlyBudgetModal
          isOpen={isYearlyBudgetModalOpen}
          onClose={() => setIsYearlyBudgetModalOpen(false)}
          onSave={handleYearlyBudgetSave}
          selectedCustomer={selectedCustomer}
          year={selectedYear}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          title="Export Sales Budget"
        />

        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />

        <DistributionModal
          isOpen={isDistributionModalOpen}
          onClose={() => setIsDistributionModalOpen(false)}
          onApplyDistribution={handleApplyDistribution}
        />

        <ScenariosModal
          isOpen={isScenariosModalOpen}
          onClose={() => setIsScenariosModalOpen(false)}
          onApplyScenario={handleApplyScenario}
        />

        <AnalyticsPlanningModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default SalesBudget;