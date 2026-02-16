import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <section className="min-h-screen bg-surface-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-100 rounded-3xl border border-outline-variant shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all"
          >
            <h2 className="text-2xl font-bold text-primary-800 mb-2">Card {i}</h2>
            <p className="text-on-surface-variant mb-2">Material You inspired dashboard card.</p>
            <button className="mt-4 px-6 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium shadow transition-all">
              Action
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
