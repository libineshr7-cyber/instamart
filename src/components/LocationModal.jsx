import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, X, Navigation, Plus, Check } from 'lucide-react';

export const LocationModal = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentLocation,
    setCurrentLocation,
    savedAddresses,
    setSavedAddresses,
    triggerToast
  } = useShop();

  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTag, setNewTag] = useState('HOME');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleSelect = (addr) => {
    setCurrentLocation(addr);
    setIsLocationModalOpen(false);
    triggerToast(`Location updated to ${addr.title}`, "info");
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newTitle || !newAddress) return;

    const created = {
      id: "loc-" + Date.now(),
      title: newTitle,
      address: newAddress,
      tag: newTag,
      sla: "⚡ 8-12 MINS"
    };

    setSavedAddresses(prev => [...prev, created]);
    setCurrentLocation(created);
    setShowAddForm(false);
    setNewTitle('');
    setNewAddress('');
    setIsLocationModalOpen(false);
    triggerToast(`New delivery address added & selected!`, "success");
  };

  const handleCurrentGPS = () => {
    const gpsLocation = {
      id: "loc-gps",
      title: "Current GPS Location",
      address: "Sector 4, Near Silk Board Flyover, Bengaluru, KA 560102",
      tag: "GPS",
      sla: "⚡ 7-9 MINS"
    };
    setCurrentLocation(gpsLocation);
    setIsLocationModalOpen(false);
    triggerToast("Location detected via GPS", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-gray-900">Select Delivery Location</h2>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* GPS Auto Detect Button */}
          <button
            onClick={handleCurrentGPS}
            className="w-full flex items-center gap-3.5 p-3.5 border border-red-200 bg-red-50/50 hover:bg-red-100/60 rounded-xl text-left transition-all group"
          >
            <div className="bg-red-600 text-white p-2.5 rounded-lg group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-red-700">Use Current GPS Location</div>
              <div className="text-xs text-red-500">Auto-detect using GPS for instant 8-min delivery</div>
            </div>
          </button>

          {/* Saved Addresses Section */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Saved Addresses
            </div>
            <div className="space-y-2.5">
              {savedAddresses.map((addr) => {
                const isSelected = currentLocation.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">{addr.title}</span>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                            {addr.tag}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                            {addr.sla}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{addr.address}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-red-600 text-white p-1 rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Custom Address Form Toggle */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-red-400 text-gray-600 hover:text-red-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Delivery Address
            </button>
          ) : (
            <form onSubmit={handleAddNewAddress} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900">Add New Address</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address Label/Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grandma's Flat, Office Annex"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Complete Address</label>
                <textarea
                  placeholder="Door No, Street name, Landmark, Pin code"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                  rows={2}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                {['HOME', 'WORK', 'OTHER'].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setNewTag(tag)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                      newTag === tag ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Save & Select
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
