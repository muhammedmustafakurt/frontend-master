'use client';

import React, { useState } from 'react';
import { Search, Car } from 'lucide-react';

// Dummy data for vehicle selection
const carBrands = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda', 
  'Ford', 'Opel', 'Renault', 'Peugeot', 'Fiat', 'Hyundai', 'Kia', 'Nissan'
];

const carModels = {
  'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'TT', 'R8'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i8'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class', 'CLA', 'G-Class'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'Jetta', 'Arteon', 'ID.4'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius', 'Yaris', 'C-HR', 'Land Cruiser'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Passport', 'Ridgeline'],
  'Ford': ['Focus', 'Mondeo', 'Kuga', 'Explorer', 'Fiesta', 'Mustang', 'Ranger', 'Transit'],
  'Opel': ['Astra', 'Insignia', 'Crossland', 'Grandland', 'Corsa', 'Mokka', 'Combo', 'Vivaro'],
  'Renault': ['Clio', 'Megane', 'Kadjar', 'Koleos', 'Captur', 'Talisman', 'Master', 'Trafic'],
  'Peugeot': ['208', '308', '3008', '5008', '2008', '508', 'Partner', 'Expert'],
  'Fiat': ['500', 'Panda', 'Tipo', 'Doblo', 'Ducato', '500X', '500L', 'Talento'],
  'Hyundai': ['i20', 'i30', 'Elantra', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq', 'Palisade'],
  'Kia': ['Rio', 'Ceed', 'Optima', 'Sportage', 'Sorento', 'Stonic', 'Niro', 'Telluride'],
  'Nissan': ['Micra', 'Sentra', 'Altima', 'Qashqai', 'X-Trail', 'Juke', 'Navara', 'Leaf']
};

const years = Array.from({ length: 25 }, (_, i) => 2024 - i);

export default function VehicleSelector() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(''); // Reset model when brand changes
  };

  const handleSearch = () => {
    const searchResult = {
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      timestamp: new Date().toISOString()
    };
    
    console.log('Vehicle Search Result:', searchResult);
    
    // You can add additional logic here like navigation or API calls
    if (selectedBrand && selectedModel && selectedYear) {
      alert(`Arama yapıldı: ${selectedBrand} ${selectedModel} ${selectedYear}`);
    } else {
      alert('Lütfen tüm alanları doldurun');
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Car className="h-12 w-12 text-gray-800" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Aracını Seç, Parçanı Bul
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aracınızın marka, model ve yıl bilgilerini seçerek size uygun parçaları kolayca bulun
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Brand Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Markası
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Marka Seçin</option>
                  {carBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Model Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Model Seçin</option>
                  {selectedBrand && carModels[selectedBrand as keyof typeof carModels]?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Yıl Seçin</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center font-semibold"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
