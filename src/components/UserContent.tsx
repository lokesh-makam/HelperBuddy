import Link from "next/link";

export default async function Profile() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="flex max-w-5xl w-full p-6 lg:p-10 bg-white shadow-lg rounded-xl">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-gray-50 p-6 rounded-lg shadow-md">
          <ul className="space-y-4 text-gray-700">
            {[
              { name: "Account Information", path: "/profile/account-info" },
              { name: "My Orders", path: "/profile/orders" },
              { name: "Address Book", path: "/profile/address-book" },
              { name: "Newsletter Subscription", path: "/profile/newsletter" },
              { name: "Store Credit", path: "/profile/store-credit" },
              { name: "My Wishlist", path: "/profile/wishlist" },
              { name: "Change Password", path: "/profile/change-password" },
              { name: "Log Out", path: "/api/auth/signout" },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="font-semibold cursor-pointer hover:text-blue-500 block py-2"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </div>
  );
}
        {/* Main Content */}
        <main className="flex-1 bg-white p-8 rounded-lg shadow-md ml-0 lg:ml-6 mt-6 lg:mt-0">
          <h3 className="text-lg font-semibold text-gray-800">Welcome to Your Profile</h3>
          <p className="text-gray-600 mt-2">Select an option from the sidebar.</p>
        </main>
