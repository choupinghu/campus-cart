import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ui/ImageUploader';

export default function CreateListingPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: 'New',
        category: 'Electronics',
        imageUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadComplete = (url) => {
        setFormData((prev) => ({ ...prev, imageUrl: url || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log('Listing created with data:', formData);
            alert(`Listing created successfully!\n\nUploaded Image URL: ${formData.imageUrl}`);
            navigate('/home');
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Error creating listing.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sell an Item</h2>
                <p className="text-gray-500 mt-2">Upload a photo to get started.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8 border-b border-gray-100 pb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">1. Photos</h3>
                    <ImageUploader onUploadComplete={handleUploadComplete} />

                    {/* Debug Display just to confirm the URL is captured correctly during testing */}
                    {formData.imageUrl && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 break-all">
                            <strong>Uploaded Successfully! URL:</strong> <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">{formData.imageUrl}</a>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">2. Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border outline-none font-medium"
                                    placeholder="e.g. iPhone 13 Pro - 128GB"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border outline-none font-medium"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border outline-none bg-white font-medium font-sans"
                                    >
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border outline-none bg-white font-medium font-sans"
                                >
                                    <option value="Electronics">Electronics</option>
                                    <option value="Textbooks">Textbooks</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border outline-none font-medium"
                                    placeholder="Describe the item, any defaults, why you're selling..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="py-2.5 px-6 rounded-xl font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.imageUrl || !formData.title || !formData.price}
                            className="py-2.5 px-8 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'List Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
