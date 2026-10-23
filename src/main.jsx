import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import DarbyPassHome from './pages/DarbyPassHome.jsx';
import ExpressVisitor from './pages/ExpressVisitor.jsx';
import ShortTermGuests from './pages/ShortTermGuests.jsx';
import DeliveryDriver from './pages/DeliveryDriver.jsx';
import Family from './pages/Family.jsx';
import NfcTags from './pages/NfcTags.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8F9FA] flex justify-center">
        <div className="w-full max-w-[430px] min-h-screen bg-white relative shadow-xl">
          <Routes>
            <Route path="/" element={<DarbyPassHome />} />
            <Route path="/darby-pass/express-visitor" element={<ExpressVisitor />} />
            <Route path="/darby-pass/short-term-guests" element={<ShortTermGuests />} />
            <Route path="/darby-pass/delivery-driver" element={<DeliveryDriver />} />
            <Route path="/darby-pass/family" element={<Family />} />
            <Route path="/darby-pass/nfc-tags" element={<NfcTags />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>,
);
