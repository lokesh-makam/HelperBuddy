export function Navbar() {
  return (
    <div className="bg-gray-200 p-4 flex justify-between items-center">
      
      <div className="flex items-center">
        
        <span className="mr-4 font-semibold">John Smith</span>
        <img
          src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
}
