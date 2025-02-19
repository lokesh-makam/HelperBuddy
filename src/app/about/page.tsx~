'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutUs = () => {
  return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center space-y-10 px-5 md:px-20 py-20">

        {/* Section 1 - Introduction */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg border border-white/20"
        >
          <h2 className="text-4xl font-bold text-center">About Us</h2>
          <p className="text-gray-300 mt-4 text-center">
            Helper Buddy connects you with trusted professionals for home services. From plumbing to electrical work, we ensure top-quality assistance at your doorstep.
          </p>
        </motion.div>

        {/* Section 2 - Our Services */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-5xl bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg border border-white/20"
        >
          <h3 className="text-3xl font-semibold text-center">Our Services</h3>
          <p className="text-gray-300 mt-4 text-center">
            We provide professional services like cleaning, plumbing, carpentry, electrical repairs, and more. Reliable, efficient, and affordable.
          </p>
        </motion.div>

        {/* Section 3 - Our Gallery */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-5xl bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg border border-white/20"
        >
          <h3 className="text-3xl font-semibold text-center">Our Gallery</h3>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Sample Images */}
            <Image
                src="https://source.unsplash.com/400x250/?cleaning"
                alt="Cleaning Service"
                width={400}
                height={250}
                className="rounded-lg"
            />
            <Image
                src="https://source.unsplash.com/400x250/?plumbing"
                alt="Plumbing Service"
                width={400}
                height={250}
                className="rounded-lg"
            />
            <Image
                src="https://source.unsplash.com/400x250/?electrician"
                alt="Electrical Work"
                width={400}
                height={250}
                className="rounded-lg"
            />
            <Image
                src="https://source.unsplash.com/400x250/?carpenter"
                alt="Carpentry Work"
                width={400}
                height={250}
                className="rounded-lg"
            />
            <Image
                src="https://source.unsplash.com/400x250/?home-repair"
                alt="Home Repair"
                width={400}
                height={250}
                className="rounded-lg"
            />
            <Image
                src="https://source.unsplash.com/400x250/?construction"
                alt="Construction Work"
                width={400}
                height={250}
                className="rounded-lg"
            />
          </div>
        </motion.div>

      </div>
  );
};

export default AboutUs;
