'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import { Upload, Download, Trash2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [shopName, setShopName] = useState('');
  const [digitalMenu, setDigitalMenu] = useState(true);
  const [homeDelivery, setHomeDelivery] = useState(true);
  const [dineInDelivery, setDineInDelivery] = useState(true);
  const [acceptNewOrders, setAcceptNewOrders] = useState(false);
  const [digitalPayment, setDigitalPayment] = useState(true);

  return (
    <AdminLayout>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Shop Details */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Shop Details</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Shop Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Shop Settings</h2>
          <div className="space-y-3">
            <SettingToggle
              label="Enable Digital Menu"
              checked={digitalMenu}
              onChange={setDigitalMenu}
            />
            <SettingToggle
              label="Enable Home Delivery"
              checked={homeDelivery}
              onChange={setHomeDelivery}
            />
            <SettingToggle
              label="Enable Dine In delivery"
              checked={dineInDelivery}
              onChange={setDineInDelivery}
            />
            <SettingToggle
              label="Accept New Orders"
              checked={acceptNewOrders}
              onChange={setAcceptNewOrders}
              variant="gray"
            />
            <SettingToggle
              label="Enable Digital Payment"
              checked={digitalPayment}
              onChange={setDigitalPayment}
            />
          </div>
        </div>

        {/* Menu Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Menu Settings</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage QR codes</h3>
                </div>
              </div>
              <button className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <button className="w-full px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          
          <button className="w-full mt-3 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
            Add +
          </button>
        </div>

        {/* Billing & Plan */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Billing & Plan</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Plan:</p>
                <p className="text-xl font-bold text-gray-900">Free</p>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all">
                Upgrade
              </button>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">Next Invoice: BDT 999 on 2024-03-15</p>
            </div>
            
            <button className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-between">
              <span>View Purchase History</span>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function SettingToggle({ 
  label, 
  checked, 
  onChange,
  variant = 'yellow'
}: { 
  label: string; 
  checked: boolean; 
  onChange: (value: boolean) => void;
  variant?: 'yellow' | 'gray';
}) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          checked 
            ? variant === 'yellow' 
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
              : 'bg-gray-400'
            : 'bg-gray-300'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
