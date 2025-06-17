import { SignInButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const NAVBAR_HEIGHT = 74; // px, adjust if your navbar is taller/shorter

const Home: React.FC = () => {
  return (
    <div
      className="relative w-screen flex flex-col justify-center items-center text-center font-sans bg-black overflow-hidden"
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      {/* Animated Background image */}
      <motion.img
        src="../home.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Animated Overlay for darkening the image */}
      <motion.div
        className="absolute inset-0  z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      {/* Animated Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
      >
        <motion.h1
          className="text-5xl text-white font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, type: "spring" }}
        >
          Welcome to Hackerator
        </motion.h1>
        <motion.p
          className="text-2xl text-white mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, type: "spring" }}
        >
          The ultimate platform for hackers and innovators.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, type: "spring" }}
        >
          <SignInButton mode='modal'>
            <button className="px-6 py-3 text-lg text-white bg-blue-600 rounded transition-colors hover:bg-blue-800 font-semibold">
              Get Started
            </button>
          </SignInButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;