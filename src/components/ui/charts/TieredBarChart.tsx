
import * as React from "react"
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from "recharts"

interface ChartData {
  name: string;
  value: number;
}

interface TierReferenceData {
  tier1?: number;
  tier2?: number;
  tier3?: number;
}

interface TierLabels {
  tier1?: string;
  tier2?: string;
  tier3?: string;
}

export const TieredBarChart = ({ 
  data, 
  tiers, 
  title,
  barColor = "#93c5fd",
  tierLabels = {
    tier1: "Tier 1",
    tier2: "Tier 2",
    tier3: "Tier 3"
  }
}: { 
  data: ChartData[]; 
  tiers: TierReferenceData; 
  title: string;
  barColor?: string;
  tierLabels?: TierLabels;
}) => {
  // Renommer les données pour supprimer "Moyenne globale"
  const renamedData = data.map(item => ({
    ...item,
    name: item.name === 'Moyenne globale' ? 'Moyenne' : item.name
  }));

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 text-sm justify-center mb-4">
        {tiers.tier1 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mx-1 border-dashed border-t-2 border-green-500"></div>
            <span>{tierLabels.tier1}</span>
          </div>
        )}
        {tiers.tier2 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mx-1 border-dashed border-t-2 border-blue-500"></div>
            <span>{tierLabels.tier2}</span>
          </div>
        )}
        {tiers.tier3 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-black mx-1 border-dashed border-t-2 border-black"></div>
            <span>{tierLabels.tier3}</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="w-4 h-3" style={{ backgroundColor: barColor, opacity: 0.7 }}></div>
          <span>Résultats</span>
        </div>
      </div>
      <div className="flex-grow w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={renamedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            {tiers.tier1 !== undefined && (
              <ReferenceLine y={tiers.tier1} stroke="#35DA56" strokeDasharray="3 3" />
            )}
            {tiers.tier2 !== undefined && (
              <ReferenceLine y={tiers.tier2} stroke="#27017F" strokeDasharray="3 3" />
            )}
            {tiers.tier3 !== undefined && (
              <ReferenceLine y={tiers.tier3} stroke="#000000" strokeDasharray="3 3" />
            )}
            <Bar dataKey="value" fill={barColor} fillOpacity={0.7} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
