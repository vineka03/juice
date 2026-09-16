import React, { useState } from 'react';
import { 
  Droplet, 
  Sparkles, 
  Plus, 
  Check, 
  AlertCircle, 
  Clock, 
  Thermometer, 
  ShieldCheck, 
  Scale, 
  Tag, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { JuiceProduct } from '../types';

interface JuiceBatchesViewProps {
  juices: JuiceProduct[];
  onUpdateBottles: (juiceId: string, delta: number) => void;
  onUpdateBatchStatus: (juiceId: string, status: JuiceProduct['batchStatus']) => void;
  onOpenAiDrawer: () => void;
}

export const JuiceBatchesView: React.FC<JuiceBatchesViewProps> = ({
  juices,
  onUpdateBottles,
  onUpdateBatchStatus,
  onOpenAiDrawer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Green Cleansers', 'Citrus & Vitality', 'Roots & Energy', 'Wellness Elixirs', 'Nut Milks'];

  const filteredJuices = juices.filter(j => 
    selectedCategory === 'all' || j.category === selectedCategory
  );

  const totalBottled = juices.reduce((acc, j) => acc + j.bottlesToday, 0);
  const totalTarget = juices.reduce((acc, j) => acc + j.targetBottles, 0);
  const percent = Math.round((totalBottled / totalTarget) * 100);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
              Cold-Press Batch Schedule & Menu Formulations
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              {juices.length} Signature Blends
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Raw unpasteurized cold-pressed juices extracted at &lt;4°C with nitrogen flush sealing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="ai-recipe-advisor-btn"
            onClick={onOpenAiDrawer}
            className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Recipe & Batch Planner</span>
          </button>
        </div>
      </div>

      {/* Production Health Strip */}
      <div className="bg-stone-900 text-white rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Today's Press Quota</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-heading text-emerald-400">{totalBottled}</span>
            <span className="text-xs text-stone-300">/ {totalTarget} target bottles</span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-2 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(percent, 100)}%` }} />
          </div>
        </div>

        <div>
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Cold-Chain Temperature</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-heading text-white">3.4°C</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Optimal (&lt;4°C)
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Continuous digital walk-in monitoring</p>
        </div>

        <div>
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Refractometer Brix Testing</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-heading text-white">99.1%</span>
            <span className="text-xs text-stone-300">pH threshold compliant</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Zero heat pasteurization degradation</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2.5 rounded-xl border border-stone-200 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {cat === 'all' ? 'All Blends' : cat}
          </button>
        ))}
      </div>

      {/* Juice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJuices.map((juice) => {
          const juicePercent = Math.round((juice.bottlesToday / juice.targetBottles) * 100);

          return (
            <div
              key={juice.id}
              id={`juice-card-${juice.id}`}
              className="bg-white rounded-xl border border-stone-200 hover:border-emerald-300 p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-bold">
                    Batch: {juice.batchCode}
                  </span>
                  
                  {/* Status Dropdown */}
                  <select
                    value={juice.batchStatus}
                    onChange={(e) => onUpdateBatchStatus(juice.id, e.target.value as any)}
                    className="text-xs font-semibold rounded-md border border-stone-200 px-2 py-0.5 bg-stone-50 text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Pressing">Pressing</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Bottled & Chilled">Bottled & Chilled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Juice Name and Tagline */}
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: juice.accentColor }} 
                    />
                    <h3 className="font-heading font-bold text-lg text-stone-900">
                      {juice.name}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 italic">
                    "{juice.tagline}"
                  </p>
                </div>

                {/* Ingredients Pills */}
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Raw Organic Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {juice.ingredients.map((ing, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flavor & Shelf Life */}
                <div className="bg-stone-50/80 p-2.5 rounded-lg border border-stone-100 text-xs space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="text-stone-500">Flavor Profile:</span>
                    <span className="font-medium text-stone-800 text-right max-w-[65%]">{juice.flavorProfile}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500">Shelf Stability:</span>
                    <span className="font-semibold text-emerald-800">{juice.shelfLife}</span>
                  </div>
                </div>

                {/* Bottles Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-stone-500">Bottled Today</span>
                    <span className="font-bold text-stone-900">
                      {juice.bottlesToday} / {juice.targetBottles} ({juicePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(juicePercent, 100)}%`,
                        backgroundColor: juice.accentColor 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Counter Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="font-heading font-bold text-stone-900 text-sm">
                  ${juice.price.toFixed(2)} <span className="text-[11px] text-stone-400 font-normal">/ 16oz</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`decrement-bottles-${juice.id}`}
                    onClick={() => onUpdateBottles(juice.id, -10)}
                    className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors active:scale-95"
                    title="Remove 10 bottles"
                  >
                    -10
                  </button>
                  <button
                    id={`increment-bottles-10-${juice.id}`}
                    onClick={() => onUpdateBottles(juice.id, 10)}
                    className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors active:scale-95"
                    title="Log 10 bottles"
                  >
                    +10
                  </button>
                  <button
                    id={`increment-bottles-50-${juice.id}`}
                    onClick={() => onUpdateBottles(juice.id, 50)}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors active:scale-95"
                    title="Log full crate (50 bottles)"
                  >
                    +50 Crate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
