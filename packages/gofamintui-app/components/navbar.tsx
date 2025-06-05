"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Users,
  Calendar,
  BookOpen,
  Heart,
  Phone,
  User,
  Camera,
  Radio,
  MessageCircle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  image: string;
  role: "member" | "leader" | "admin";
  membershipStatus: "active" | "inactive";
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  dropdown?: DropdownItem[];
}

interface DropdownItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  // Mock user data - in real app this would come from NextAuth session
  const [user, setUser] = useState<User | null>({
    name: "John Smith",
    email: "john.smith@fellowship.org",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    role: "member",
    membershipStatus: "active",
  });

  // Set to null to show logged-out state
  // const [user, setUser] = useState<User | null>(null);

  const navigationItems: NavigationItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Users },
    {
      name: "Connect",
      icon: Heart,
      dropdown: [
        { name: "Events Calendar", href: "/events", icon: Calendar },
        { name: "Contact Us", href: "/contact", icon: Phone },
        { name: "Live Streaming", href: "/live", icon: Radio },
        { name: "Blog & News", href: "/blog", icon: MessageCircle },
      ],
    },
    {
      name: "Resources",
      icon: BookOpen,
      dropdown: [
        { name: "Sermons/Teachings", href: "/sermons", icon: BookOpen },
        { name: "Media Gallery", href: "/gallery", icon: Camera },
      ],
    },
    { name: "Give", href: "/giving", icon: Heart },
  ];

  // Member-only navigation items
  const memberNavigationItems: NavigationItem[] = user
    ? [
        { name: "Dashboard", href: "/dashboard", icon: User },
        { name: "My Events", href: "/my-events", icon: Calendar },
        { name: "Prayer Requests", href: "/prayers", icon: Heart },
      ]
    : [];

  const toggleDropdown = (index: number): void => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleSignOut = (): void => {
    // In real app: signOut({ callbackUrl: '/' })
    setUser(null);
    setUserDropdownOpen(false);
  };

  interface UserAvatarProps {
    size?: string;
  }

  const UserAvatar: React.FC<UserAvatarProps> = ({ size = "w-8 h-8" }) => (
    <div
      className={`${size} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <User className="w-4 h-4 text-gray-500" />
      )}
    </div>
  );

  return (
    <div className="bg-white">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600">
                Fellowship
              </div>
            </div>

            {/* Main Navigation */}
            <div className="flex items-center space-x-8">
              {/* Public Navigation */}
              {navigationItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div>
                      <button
                        className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                        onMouseEnter={() => setActiveDropdown(index)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      <div
                        className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border py-2 z-50 transition-all duration-200 ${
                          activeDropdown === index
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                        }`}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                          >
                            <dropdownItem.icon className="w-4 h-4" />
                            <span>{dropdownItem.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  )}
                </div>
              ))}

              {/* Member Navigation */}
              {user &&
                memberNavigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <UserAvatar />
                    <div className="text-left">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center space-x-3">
                          <UserAvatar size="w-10 h-10" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  user.membershipStatus === "active"
                                    ? "bg-green-400"
                                    : "bg-yellow-400"
                                }`}
                              />
                              <span className="text-xs text-gray-500 capitalize">
                                {user.membershipStatus} Member
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <a
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </a>
                        {user.role === "leader" || user.role === "admin" ? (
                          <a
                            href="/admin"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </a>
                        ) : null}
                      </div>

                      <div className="border-t pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <a
                    href="/auth/signin"
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth/signup"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Join Fellowship
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-indigo-600">Fellowship</div>

            <div className="flex items-center space-x-3">
              {user && <UserAvatar />}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${isMobileMenuOpen ? "block" : "hidden"} border-t bg-white`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User Info on Mobile */}
            {user && (
              <div className="px-3 py-4 border-b mb-4">
                <div className="flex items-center space-x-3">
                  <UserAvatar size="w-12 h-12" />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.membershipStatus === "active"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500 capitalize">
                        {user.membershipStatus} {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Public Navigation */}
            {navigationItems.map((item, index) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="flex items-center justify-between w-full text-left px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === index && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                          >
                            <dropdownItem.icon className="w-4 h-4" />
                            <span>{dropdownItem.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )}
              </div>
            ))}

            {/* Member Navigation on Mobile */}
            {user && (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Member Area
                  </div>
                  {memberNavigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  ))}

                  <a
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Profile</span>
                  </a>

                  <a
                    href="/settings"
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </a>

                  {(user.role === "leader" || user.role === "admin") && (
                    <a
                      href="/admin"
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150"
                    >
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin Panel</span>
                    </a>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}

            {/* Auth buttons for non-logged in users */}
            {!user && (
              <div className="pt-4 border-t space-y-2">
                <a
                  href="/auth/signin"
                  className="block text-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="block bg-indigo-600 text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Join Our Fellowship
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;