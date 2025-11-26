'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import { Download, Loader2, User, Store } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import QRCode from 'qrcode';

export default function AdminSettingsPage() {
  const [userId, setUserId] = useState('');
  const [stallName, setStallName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [stallDescription, setStallDescription] = useState('');
  const [enableDigitalMenu, setEnableDigitalMenu] = useState(true);
  const [enableDelivery, setEnableDelivery] = useState(true);
  const [enableDineIn, setEnableDineIn] = useState(true);
  const [acceptNewOrders, setAcceptNewOrders] = useState(true);
  const [enableDigitalPayment, setEnableDigitalPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      generateQRCode();
    }
  }, [userId]);

  async function loadUserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setStallName(profile.stall_name || '');
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
        setAddress(profile.address || '');
        setStallDescription(profile.stall_description || '');
        setEnableDigitalMenu(profile.enable_digital_menu ?? true);
        setEnableDelivery(profile.enable_delivery ?? true);
        setEnableDineIn(profile.enable_dine_in ?? true);
        setAcceptNewOrders(profile.accept_new_orders ?? true);
        setEnableDigitalPayment(profile.enable_digital_payment ?? false);
      }
    }
    setLoading(false);
  }

  async function generateQRCode() {
    const menuUrl = `${window.location.origin}/menu/${userId}`;
    try {
      const url = await QRCode.toDataURL(menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR Code generation error:', err);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        stall_name: stallName,
        phone,
        address,
        stall_description: stallDescription,
        enable_digital_menu: enableDigitalMenu,
        enable_delivery: enableDelivery,
        enable_dine_in: enableDineIn,
        accept_new_orders: acceptNewOrders,
        enable_digital_payment: enableDigitalPayment,
      })
      .eq('id', userId);

    if (!error) {
      alert('Profile updated successfully!');
    } else {
      alert('Error updating profile');
    }
    setSaving(false);
  }

  async function handleToggleSetting(field: string, value: boolean) {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('users')
      .update({ [field]: value })
      .eq('id', userId);

    if (error) {
      console.error('Error updating setting:', error);
      alert('Failed to update setting');
    }
  }

  function downloadQRCode() {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `${stallName.replace(/\s+/g, '-')}-menu-qr.png`;
    link.href = qrCodeUrl;
    link.click();
  }

  if (loading) {
    return (
      <AdminLayout stallName={stallName}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout stallName={stallName}>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Store className="w-4 h-4 inline mr-1" />
                Stall Name
              </label>
              <input
                type="text"
                value={stallName}
                onChange={(e) => setStallName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Your stall name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Your stall address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stall Description</label>
              <textarea
                value={stallDescription}
                onChange={(e) => setStallDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                placeholder="Tell customers about your stall..."
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Shop Settings Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shop Settings</h2>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            {/* Enable Digital Menu */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Enable Digital Menu</p>
                <p className="text-xs text-gray-500">Allow customers to access your menu via QR code/URL</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDigitalMenu}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setEnableDigitalMenu(newValue);
                    handleToggleSetting('enable_digital_menu', newValue);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Accept New Orders */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Accept New Orders</p>
                <p className="text-xs text-gray-500">Allow customers to place new orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptNewOrders}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setAcceptNewOrders(newValue);
                    handleToggleSetting('accept_new_orders', newValue);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Enable Delivery */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Enable Home Delivery</p>
                <p className="text-xs text-gray-500">Show delivery option in checkout</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDelivery}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setEnableDelivery(newValue);
                    handleToggleSetting('enable_delivery', newValue);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Enable Dine-in */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Enable Dine-in Delivery</p>
                <p className="text-xs text-gray-500">Show dine-in option in checkout</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDineIn}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setEnableDineIn(newValue);
                    handleToggleSetting('enable_dine_in', newValue);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Enable Digital Payment */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Enable Digital Payment</p>
                <p className="text-xs text-gray-500">Allow online payment methods</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDigitalPayment}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setEnableDigitalPayment(newValue);
                    handleToggleSetting('enable_digital_payment', newValue);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Menu QR Code</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            {qrCodeUrl ? (
              <>
                <div className="flex justify-center mb-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="Menu QR Code" 
                    className="w-64 h-64 border-4 border-gray-200 rounded-2xl"
                  />
                </div>
                <p className="text-xs text-gray-500 mb-4 font-mono break-all">
                  {window.location.origin}/menu/{userId}
                </p>
                <button
                  onClick={downloadQRCode}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
              </>
            ) : (
              <div className="py-8">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to use your QR Code:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Download and print the QR code</li>
            <li>Place it on your stall counter or menu board</li>
            <li>Customers scan it to see your digital menu</li>
            <li>They can browse and place orders directly</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
