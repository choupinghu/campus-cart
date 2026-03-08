export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center flex-1 py-12 px-6 w-full max-w-[1400px] mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 w-full text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to your Dashboard!</h2>
                <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                    This is a dummy dashboard. Here you will eventually be able to manage your listings, view offers, and update your profile settings.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                    {/* Dummy Widget 1 */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
                        <span className="text-4xl mb-3">📦</span>
                        <h3 className="font-semibold text-gray-800">My Listings</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage items you are selling</p>
                    </div>

                    {/* Dummy Widget 2 */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
                        <span className="text-4xl mb-3">💬</span>
                        <h3 className="font-semibold text-gray-800">Active Offers</h3>
                        <p className="text-sm text-gray-500 mt-1">Review offers on your items</p>
                    </div>

                    {/* Dummy Widget 3 */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
                        <span className="text-4xl mb-3">⚙️</span>
                        <h3 className="font-semibold text-gray-800">Account Settings</h3>
                        <p className="text-sm text-gray-500 mt-1">Update your profile details</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
