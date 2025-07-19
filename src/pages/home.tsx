import { SignInButton } from '@clerk/clerk-react';

const NAVBAR_HEIGHT = 80; // px, adjust if needed

const Home: React.FC = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-black overflow-x-hidden"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif',
              maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
       }}
    >

      {/* Hero Section */}
      <main className="px-4 md:px-40 flex flex-1 justify-center py-5 items-center">
        <div className="flex flex-col max-w-[960px] flex-1 aniamte-bounce">
          <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 rounded-lg shadow-lg"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYtgHjFFPbB4PdP-rNln1vaIHiMWIfsxBbAL0In5cyEGG7JiyupSHFKmYdO5QNipQ48BayoJCcmKMv65qwJ5Bx8m1e-dZW_QYCO8O1qR6TrN6VobjRroiPOxioiMBAOEiKTh3wid38SQPy56ffw1v3OxnZ2oHSZhPBYX9qpobJdSoXViwQxQVxuI_3wXQFhEMjuAe-LHYG8JvsUo0xpnDk1obAgHINf_yANkGQkqaFS1G0eStIsiXv1spPCzXs9RNeicQj-IgSGknp")'
            }}
          >
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                Unlock Your Next Big Idea
              </h1>
              <h2 className="text-white text-sm md:text-base font-normal">
                Hackerator generates innovative project ideas and detailed reports, helping you bring your vision to life.
              </h2>
            </div>
            <SignInButton mode="modal">
              <button className="flex min-w-[84px] h-10 md:h-12 px-4 md:px-5 items-center justify-center rounded-lg bg-[#ea2832] text-white text-sm md:text-base font-bold tracking-[0.015em] mt-4 cursor-pointer hover:bg-[#d71f26] transition-colors duration-200">
                <span className="truncate">Get Started</span>
              </button>
            </SignInButton>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center">
        <div className="flex max-w-[960px] flex-1 flex-col">
          <div className="flex flex-col gap-6 px-5 py-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a className="text-[#c89295] text-base font-normal min-w-40" href="#">Terms of Service</a>
              <a className="text-[#c89295] text-base font-normal min-w-40" href="#">Privacy Policy</a>
              <a className="text-[#c89295] text-base font-normal min-w-40" href="#">Contact Us</a>
            </div>
            <p className="text-[#c89295] text-base font-normal">© 2025 Hackerator.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;