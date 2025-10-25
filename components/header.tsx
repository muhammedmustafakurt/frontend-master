'use client';

import React, { useState } from 'react';
import MiniCart from './cart/MiniCart';

// SVG Icons as React components
const PhoneIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const DropletsIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const GiftIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

// Dummy data for dropdowns
const carBrands = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Opel', 'Renault', 'Peugeot'
];

const carModels = {
  'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X7'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
  'Ford': ['Focus', 'Mondeo', 'Kuga', 'Explorer'],
  'Opel': ['Astra', 'Insignia', 'Crossland', 'Grandland'],
  'Renault': ['Clio', 'Megane', 'Kadjar', 'Koleos'],
  'Peugeot': ['208', '308', '3008', '5008']
};

const years = Array.from({ length: 25 }, (_, i) => 2024 - i);

const categories = [
  {
    name: 'Motor & Mekanik',
    icon: SettingsIcon,
    subcategories: [
      'Motor Yağları', 'Hava Filtreleri', 'Yakıt Filtreleri', 'Motor Parçaları',
      'Egzoz Sistemi', 'Soğutma Sistemi', 'Klima Sistemi', 'Transmisyon'
    ]
  },
  {
    name: 'Fren Sistemi',
    icon: ZapIcon,
    subcategories: [
      'Fren Balata', 'Fren Diski', 'Fren Kaliperi', 'Fren Hortumu',
      'Fren Sıvısı', 'El Freni', 'ABS Sensörü', 'Fren Kampanası'
    ]
  },
  {
    name: 'Elektrik & Aydınlatma',
    icon: LightbulbIcon,
    subcategories: [
      'Far Ampulü', 'Sinyal Ampulü', 'Fren Ampulü', 'Plaka Ampulü',
      'Alternatör', 'Marş Motoru', 'Akü', 'Kablolar'
    ]
  },
  {
    name: 'Yağ & Filtre',
    icon: DropletsIcon,
    subcategories: [
      'Motor Yağı', 'Şanzıman Yağı', 'Fren Sıvısı', 'Soğutma Sıvısı',
      'Yağ Filtresi', 'Hava Filtresi', 'Yakıt Filtresi', 'Kabin Filtresi'
    ]
  },
  {
    name: 'Yedek Parça Kampanyaları',
    icon: GiftIcon,
    subcategories: [
      'İndirimli Ürünler', 'Toplu Alım Kampanyaları', 'Sezonluk İndirimler',
      'Marka Kampanyaları', 'Yeni Ürünler', 'Stoktan Satış'
    ]
  }
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [cartCount] = useState(3); // Dummy cart count
  const [favoritesCount] = useState(7); // Dummy favorites count
  const [compareCount] = useState(2); // Dummy compare count

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(''); // Reset model when brand changes
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search:', { selectedBrand, selectedModel, selectedYear, searchQuery });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8 text-xs">
            {/* Left side - Customer Service */}
            <div className="flex items-center space-x-2 text-gray-600">
              <PhoneIcon />
              <span>Müşteri Hizmetleri</span>
            </div>

            {/* Right side - Links */}
            <div className="flex items-center space-x-4 text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Mağaza Girişi</a>
              <a href="#" className="hover:text-black transition-colors">Kargo Takip</a>
              <a href="#" className="hover:text-black transition-colors">Yardım</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-black">
              AutoParts
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              {/* Brand Dropdown */}
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="px-3 py-2 border-r border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Araç Markası</option>
                {carBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {/* Model Dropdown */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
                className="px-3 py-2 border-r border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Model</option>
                {selectedBrand && carModels[selectedBrand as keyof typeof carModels]?.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border-r border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Yıl</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Parça, OEM, ürün adı ara..."
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            <button className="p-2 text-gray-600 hover:text-black transition-colors relative">
              <UserIcon />
            </button>

            {/* Compare List */}
            <button className="p-2 text-gray-600 hover:text-black transition-colors relative">
              <BarChartIcon />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Favorites */}
            <button className="p-2 text-gray-600 hover:text-black transition-colors relative">
              <HeartIcon />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart - Using MiniCart Component */}
            <MiniCart />

            {/* Language Selector */}
            <select className="p-2 text-gray-600 hover:text-black transition-colors bg-transparent border-none focus:outline-none">
              <option value="tr">TR</option>
              <option value="en">EN</option>
            </select>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-black transition-colors"
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden border-t border-gray-200 p-4">
          <div className="flex flex-col space-y-2">
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Araç Markası</option>
              {carBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Model</option>
              {selectedBrand && carModels[selectedBrand as keyof typeof carModels]?.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Yıl</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Parça, OEM, ürün adı ara..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Categories */}
      <div className="hidden lg:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button className="flex items-center space-x-1 py-4 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  <category.icon />
                  <span>{category.name}</span>
                  <ChevronDownIcon />
                </button>

                {/* Mega Menu Dropdown */}
                {hoveredCategory === category.name && (
                  <div className="absolute top-full left-0 w-96 bg-white border border-gray-200 shadow-lg rounded-lg p-6 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {category.subcategories.map((subcategory) => (
                        <a
                          key={subcategory}
                          href="#"
                          className="text-sm text-gray-600 hover:text-black transition-colors py-1"
                        >
                          {subcategory}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center space-x-2 w-full p-3 bg-gray-50 rounded-lg text-left"
            >
              <SearchIcon />
              <span className="text-gray-600">Arama</span>
            </button>

            {/* Mobile Categories */}
            {categories.map((category) => (
              <div key={category.name} className="border-b border-gray-100 pb-2">
                <button className="flex items-center space-x-2 w-full text-left py-2">
                  <category.icon />
                  <span className="font-medium">{category.name}</span>
                  <ChevronDownIcon />
                </button>
              </div>
            ))}

            {/* Mobile Links */}
            <div className="pt-4 space-y-2">
              <a href="#" className="block py-2 text-gray-600">Mağaza Girişi</a>
              <a href="#" className="block py-2 text-gray-600">Kargo Takip</a>
              <a href="#" className="block py-2 text-gray-600">Yardım</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}