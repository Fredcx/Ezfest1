import React from 'react';
import Layout from './layout';

export default function App() {
  return (
    <Layout currentPageName="Home">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-[#7C9885]">EzFest Frontend 🎉</h1>
        <p>Seu site está funcionando!</p>
      </div>
    </Layout>
  );
}
