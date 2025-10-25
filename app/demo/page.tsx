import Header from '../../components/header';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Demo Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Car Parts Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop shop for automotive parts and accessories
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Motor & Mekanik</h3>
              <p className="text-gray-600">High-quality engine and mechanical parts for all vehicle types.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Fren Sistemi</h3>
              <p className="text-gray-600">Complete brake system components for safety and performance.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Elektrik & Aydınlatma</h3>
              <p className="text-gray-600">Electrical components and lighting solutions for your vehicle.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
