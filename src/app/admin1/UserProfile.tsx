'use client';

import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { Pencil, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export default function UserProfile({ profileImage, setProfileImage }: { profileImage: string, setProfileImage: React.Dispatch<React.SetStateAction<string>> }) {
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Musharof Chowdhury',
    position: 'Team Manager',
    location: 'Arizona, United States',
    email: 'musharof@example.com',
    phone: '+1 234 567 890',
    about:
      'Experienced team manager with a demonstrated history of working in project management and operations. Passionate about driving team success and innovation.',
    socialLinks: {
      facebook: 'https://facebook.com/musharof',
      twitter: 'https://twitter.com/musharof',
      linkedin: 'https://linkedin.com/in/musharof',
      instagram: 'https://instagram.com/musharof',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in userData.socialLinks) {
      setUserData({
        ...userData,
        socialLinks: { ...userData.socialLinks, [name]: value },
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Update profile image state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white rounded-lg shadow-md animate-fade-in">
      {/* Profile & Personal Info */}
      <div className="col-span-1 bg-gray-50 rounded-lg p-6 flex flex-col items-center space-y-4 shadow-sm transition-transform transform hover:scale-105 duration-300">
        <img
          src={profileImage ? profileImage : "https://randomuser.me/api/portraits/men/75.jpg"}
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        {isEditing && (
          <>
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => setProfileImage('')} // Optional: Reset image
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-500 transition duration-300"
            >
              Save Image
            </button>
          </>
        )}
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="text-center text-xl font-semibold border rounded-md p-1"
            />
            <input
              type="text"
              name="position"
              value={userData.position}
              onChange={handleChange}
              className="text-center text-gray-600 border rounded-md p-1"
            />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600 flex items-center gap-1"><Briefcase size={16} /> {userData.position}</p>
          </>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500 transition duration-300"
        >
          <Pencil size={16} /> {isEditing ? 'Save Info' : 'Edit Info'}
        </button>
      </div>

      {/* About Section */}
      <div className="col-span-2 bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">About</h3>
        {isEditing ? (
          <textarea
            name="about"
            value={userData.about}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border rounded-md"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">{userData.about}</p>
        )}
      </div>

      {/* Contact Info */}
      <div className="col-span-1 bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
        {isEditing ? (
          <>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </>
        ) : (
          <div className="space-y-3 text-gray-700">
            <p className="flex items-center gap-2"><Mail size={18} /> {userData.email}</p>
            <p className="flex items-center gap-2"><Phone size={18} /> {userData.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={18} /> {userData.location}</p>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="col-span-2 bg-gray-50 rounded-lg p-6 shadow-sm flex items-center space-x-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-semibold">Social Links</h3>
        {isEditing ? (
          <>
            <input
              type="text"
              name="facebook"
              value={userData.socialLinks.facebook}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded-md"
              placeholder="Facebook URL"
            />
            <input
              type="text"
              name="twitter"
              value={userData.socialLinks.twitter}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded-md"
              placeholder="Twitter URL"
            />
            <input
              type="text"
              name="linkedin"
              value={userData.socialLinks.linkedin}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded-md"
              placeholder="LinkedIn URL"
            />
            <input
              type="text"
              name="instagram"
              value={userData.socialLinks.instagram}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded-md"
              placeholder="Instagram URL"
            />
          </>
        ) : (
          <div className="flex space-x-4">
            <a href={userData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="w-8 h-8 text-gray-600 hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            </a>
            <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-8 h-8 text-gray-600 hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" />
            </a>
            <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="w-8 h-8 text-gray-600 hover:text-blue-700 cursor-pointer transition-transform transform hover:scale-110" />
            </a>
            <a href={userData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-8 h-8 text-gray-600 hover:text-pink-500 cursor-pointer transition-transform transform hover:scale-110" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
