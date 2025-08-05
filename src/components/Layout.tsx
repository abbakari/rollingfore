import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings, 
  Database, 
  Package, 
  Truck, 
  LogOut,
  Menu,
  X,
  User,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth, hasPermission, canAccessDashboard, getUserRoleName } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <div>Please log in to access the application.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        roles: ['admin', 'salesman', 'manager', 'supply_chain']
      }
    ];

    const roleSpecificItems = {
      salesman: [
        {
          name: 'Sales Budget',
          href: '/sales-budget',
          icon: BarChart3,
          roles: ['salesman']
        },
        {
          name: 'Rolling Forecast',
          href: '/rolling-forecast',
          icon: TrendingUp,
          roles: ['salesman']
        }
      ],
      manager: [
        {
          name: 'Sales Budget',
          href: '/sales-budget',
          icon: BarChart3,
          roles: ['manager']
        },
        {
          name: 'Rolling Forecast',
          href: '/rolling-forecast',
          icon: TrendingUp,
          roles: ['manager']
        },
        {
          name: 'Approval Center',
          href: '/approval-center',
          icon: CheckCircle,
          roles: ['manager']
        }
      ],
      supply_chain: [
        {
          name: 'Inventory Management',
          href: '/inventory-management',
          icon: Package,
          roles: ['supply_chain']
        },
        {
          name: 'Distribution Management',
          href: '/distribution-management',
          icon: Truck,
          roles: ['supply_chain']
        }
      ],
      admin: [
        {
          name: 'Sales Budget',
          href: '/sales-budget',
          icon: BarChart3,
          roles: ['admin']
        },
        {
          name: 'Rolling Forecast',
          href: '/rolling-forecast',
          icon: TrendingUp,
          roles: ['admin']
        },
        {
          name: 'User Management',
          href: '/user-management',
          icon: Users,
          roles: ['admin']
        },
        {
          name: 'Data Sources',
          href: '/data-sources',
          icon: Database,
          roles: ['admin']
        },
        {
          name: 'Inventory Management',
          href: '/inventory-management',
          icon: Package,
          roles: ['admin']
        },
        {
          name: 'Distribution Management',
          href: '/distribution-management',
          icon: Truck,
          roles: ['admin']
        },
        {
          name: 'BI Dashboard',
          href: '/bi-dashboard',
          icon: BarChart3,
          roles: ['admin']
        }
      ]
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[user.role] || [])
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-gray-900">STMBudget</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold text-gray-900">STMBudget</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User info */}
              <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {getUserRoleName(user.role)}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
