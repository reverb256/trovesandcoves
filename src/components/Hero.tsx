import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-primary-300 to-primary-500">
      <div className="bg-surface-100/80 shadow-2xl rounded-3xl border border-outline-variant p-10 max-w-xl w-full flex flex-col items-center gap-6">
        <h1 className="text-5xl font-display font-extrabold text-primary-900 mb-2 tracking-tight">Material You Hero</h1>
        <p className="text-lg text-on-surface-variant mb-4 text-center">
          Beautiful, adaptive, and accessible UI inspired by Material 3. Customize your experience with vibrant color palettes and modern surfaces.
        </p>
        <button className="mt-2 px-8 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg transition-all duration-200">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
