"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useProduct, useUpdateProduct, useDeleteProduct } from "@/app/(app)/hooks/useVendorProducts";
import { UpdateProductData } from "@/app/(app)/actions/products";
import { uploadImage } from "@/app/(app)/actions/upload";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = Number(params.id);
    
    const { data: product, isLoading, error } = useProduct(productId);
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();
    
    const [formData, setFormData] = useState<UpdateProductData>({});
    const [compatibleVehicle, setCompatibleVehicle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Initialize form data when product is loaded
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                brand: product.brand,
                sku: product.sku,
                oemNumber: product.oemNumber,
                compatibleVehicles: product.compatibleVehicles || [],
                price: product.price,
                stock: product.stock,
                status: product.status,
                description: product.description || '',
                images: product.images || [],
            });
        }
    }, [product]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    const handleAddCompatibleVehicle = () => {
        if (compatibleVehicle.trim()) {
            setFormData(prev => ({
                ...prev,
                compatibleVehicles: [...(prev.compatibleVehicles || []), compatibleVehicle.trim()]
            }));
            setCompatibleVehicle('');
        }
    };

    const handleRemoveCompatibleVehicle = (index: number) => {
        setFormData(prev => ({
            ...prev,
            compatibleVehicles: prev.compatibleVehicles?.filter((_, i) => i !== index) || []
        }));
    };

    const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadError(null);
        setUploading(true);
        try {
            const uploadedUrls: string[] = [];
            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append('file', file);
                const result = await uploadImage(fd);
                if (!result.success || !result.data) {
                    throw new Error(result.error || 'Upload failed');
                }
                uploadedUrls.push(result.data.url);
            }
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...uploadedUrls],
            }));
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Bilinmeyen hata');
        } finally {
            setUploading(false);
            e.currentTarget.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index) || []
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await updateProductMutation.mutateAsync({ id: productId, data: formData });
            alert('Ürün başarıyla güncellendi!');
            router.push('/vendor/panel/product');
        } catch (error) {
            alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`"${product?.name}" ürününü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            return;
        }

        try {
            await deleteProductMutation.mutateAsync(productId);
            alert('Ürün başarıyla silindi!');
            router.push('/vendor/panel/product');
        } catch (error) {
            alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-red-800 mb-2">Hata</h2>
                        <p className="text-red-600">{error?.message || 'Ürün bulunamadı'}</p>
                        <Link
                            href="/vendor/panel/product"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Ürün Listesine Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/vendor/panel/product"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Ürün Listesi
                        </Link>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Ürün Düzenle</h1>
                            <p className="text-gray-600 mt-2">{product.name}</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={deleteProductMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        >
                            {deleteProductMutation.isPending ? 'Siliniyor...' : 'Ürünü Sil'}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün Adı *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ürün adını girin"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori *
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kategori girin"
                                />
                            </div>

                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                                    Marka *
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Marka girin"
                                />
                            </div>

                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU *
                                </label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    value={formData.sku || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="SKU girin"
                                />
                            </div>

                            <div>
                                <label htmlFor="oemNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    OEM Numarası *
                                </label>
                                <input
                                    type="text"
                                    id="oemNumber"
                                    name="oemNumber"
                                    value={formData.oemNumber || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="OEM numarasını girin"
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Durum
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status || 'draft'}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="draft">Taslak</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fiyat (₺) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price || 0}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                    Stok *
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock || 0}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Compatible Vehicles */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Uyumlu Araçlar
                            </label>
                            <div className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={compatibleVehicle}
                                    onChange={(e) => setCompatibleVehicle(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Araç modeli girin"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompatibleVehicle())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCompatibleVehicle}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Ekle
                                </button>
                            </div>
                            {formData.compatibleVehicles && formData.compatibleVehicles.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.compatibleVehicles.map((vehicle, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                        >
                                            {vehicle}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCompatibleVehicle(index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Açıklama
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ürün açıklamasını girin"
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ürün Görselleri
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFilesSelected}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploading && (
                                <p className="mt-2 text-sm text-gray-500">Yükleniyor...</p>
                            )}
                            {uploadError && (
                                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                            )}
                            {formData.images && formData.images.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {formData.images.map((url, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden border group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`image-${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link
                                href="/vendor/panel/product"
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                İptal
                            </Link>
                            <button
                                type="submit"
                                disabled={updateProductMutation.isPending || uploading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {updateProductMutation.isPending ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
