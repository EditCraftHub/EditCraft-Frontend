// pages/page.jsx (or app/page.jsx)
'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contact from './Components/Contact/Contact';
import Footer from './Components/Footer/Footer';
import Hero from './Components/Hero/Hero';
import Review from './Components/Review/Review';
import Section from './Components/Section/Section';
import Service from './Components/Service/Service';
import Webflow from './Components/Webflow/Webflow';


const Page = () => {
  // ✅ Call it HERE inside the component


  return (
    <div className="overflow-x-hidden bg-black text-white">
      
      {/* Toastify Container - Shows all notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Main Sections */}
     
      <Hero />
      <Section />
      
      <Webflow />
      <Service />
      <Review />
      <Contact />
      <Footer />
    </div>
  );
};

export default Page;