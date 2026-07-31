import React, { useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal, Car, Bike, Truck } from 'lucide-react';

interface OmiiAutoFilterBarProps {
  onFilterChange: (filters: {
    vehicleType: string;
    marca: string;
    model: string;
    pretMax: string;
    anMin: string;
    rulajMax: string;
    transmisie: string;
    tara: string;
    soloElectrice: boolean;
  }) => void;
  resultCount: number;
}

export default function OmiiAutoFilterBar({ onFilterChange, resultCount }: OmiiAutoFilterBarProps) {
  const [vehicleType, setVehicleType] = useState('car');
  const [marca, setMarca] = useState('');
  const [model, setModel] = useState('');
  const [pretMax, setPretMax] = useState('');
  const [anMin, setAnMin] = useState('');
  const [rulajMax, setRulajMax] = useState('');
  const [transmisie, setTransmisie] = useState('');
  const [tara, setTara] = useState('');
  const [soloElectrice, setSoloElectrice] = useState(false);

  const handleApply = () => {
    onFilterChange({
      vehicleType,
      marca,
      model,
      pretMax,
      anMin,
      rulajMax,
      transmisie,
      tara,
      soloElectrice
    });
  };

  const handleReset = () => {
    setVehicleType('car');
    setMarca('');
    setModel('');
    setPretMax('');
    setAnMin('');
    setRulajMax('');
    setTransmisie('');
    setTara('');
    setSoloElectrice(false);
    onFilterChange({
      vehicleType: 'car',
      marca: '',
      model: '',
      pretMax: '',
      anMin: '',
      rulajMax: '',
      transmisie: '',
      tara: '',
      soloElectrice: false
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row">
        
        {/* Left Vertical Type Tabs */}
        <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-2 gap-1.5 shrink-0 justify-around md:justify-start">
          <button 
            onClick={() => setVehicleType('car')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              vehicleType === 'car' 
                ? 'bg-white text-[#ff3b30] shadow-sm border border-gray-200/80 border-l-4 border-l-[#ff3b30]' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-white/50'
            }`}
            title="Autoturisme"
          >
            <Car size={22} strokeWidth={2.2} />
          </button>

          <button 
            onClick={() => setVehicleType('moto')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              vehicleType === 'moto' 
                ? 'bg-white text-[#ff3b30] shadow-sm border border-gray-200/80 border-l-4 border-l-[#ff3b30]' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-white/50'
            }`}
            title="Motociclete"
          >
            <Bike size={22} strokeWidth={2.2} />
          </button>

          <button 
            onClick={() => setVehicleType('van')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              vehicleType === 'van' 
                ? 'bg-white text-[#ff3b30] shadow-sm border border-gray-200/80 border-l-4 border-l-[#ff3b30]' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-white/50'
            }`}
            title="Autoutilitare"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </button>

          <button 
            onClick={() => setVehicleType('truck')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              vehicleType === 'truck' 
                ? 'bg-white text-[#ff3b30] shadow-sm border border-gray-200/80 border-l-4 border-l-[#ff3b30]' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-white/50'
            }`}
            title="Camioane"
          >
            <Truck size={22} strokeWidth={2.2} />
          </button>
        </div>

        {/* Right Form Fields Area */}
        <div className="flex-1 p-5 space-y-4">
          
          {/* Top Row Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* MARCĂ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">MARCĂ</label>
              <select 
                value={marca} 
                onChange={(e) => setMarca(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="Toyota">Toyota</option>
                <option value="Kia">Kia</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Honda">Honda</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Nissan">Nissan</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Porsche">Porsche</option>
                <option value="Audi">Audi</option>
              </select>
            </div>

            {/* MODEL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">MODEL</label>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="Yaris">Yaris</option>
                <option value="Sportage">Sportage</option>
                <option value="Tucson">Tucson</option>
                <option value="Golf">Golf</option>
                <option value="Navara">Navara</option>
                <option value="CBR 500R">CBR 500R</option>
              </select>
            </div>

            {/* PREȚ MAXIM */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">PREȚ MAXIM</label>
              <select 
                value={pretMax} 
                onChange={(e) => setPretMax(e.target.value)}
                className="w-full h-11 bg-white border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="10000">10.000 €</option>
                <option value="20000">20.000 €</option>
                <option value="30000">30.000 €</option>
                <option value="50000">50.000 €</option>
                <option value="100000">100.000 €</option>
              </select>
            </div>

            {/* AN (DE LA) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">AN (DE LA)</label>
              <select 
                value={anMin} 
                onChange={(e) => setAnMin(e.target.value)}
                className="w-full h-11 bg-white border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2018">2018</option>
                <option value="2015">2015</option>
              </select>
            </div>

          </div>

          {/* Bottom Row Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* RULAJ MAX */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">RULAJ MAX</label>
              <select 
                value={rulajMax} 
                onChange={(e) => setRulajMax(e.target.value)}
                className="w-full h-11 bg-white border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="30000">30.000 km</option>
                <option value="50000">50.000 km</option>
                <option value="100000">100.000 km</option>
                <option value="150000">150.000 km</option>
              </select>
            </div>

            {/* TRANSMISIE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">TRANSMISIE</label>
              <select 
                value={transmisie} 
                onChange={(e) => setTransmisie(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="Automată">Automată</option>
                <option value="Manuală">Manuală</option>
              </select>
            </div>

            {/* ȚARĂ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">ȚARĂ</label>
              <select 
                value={tara} 
                onChange={(e) => setTara(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat pr-10"
              >
                <option value="">Toate</option>
                <option value="România">România</option>
                <option value="Germania">Germania</option>
              </select>
            </div>

            {/* Red Search Button */}
            <button 
              onClick={handleApply}
              className="w-full h-11 bg-[#ff3b30] hover:bg-[#e03126] text-white font-extrabold text-sm rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Search size={16} strokeWidth={2.5} />
              <span>Arată {resultCount} oferte</span>
            </button>

          </div>

          {/* Footer Bar: Reset only */}
          <div className="pt-3 border-t border-gray-100 flex justify-end text-xs font-bold">
            <button 
              onClick={handleReset}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Resetează</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
