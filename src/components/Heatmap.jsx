import React from 'react'

const HeatCell = ({ level = 0, tip }) => {
  const shades = [
    "bg-gray-200 dark:bg-white/10",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-500",
  ];
  return <div className={`w-3 h-3 rounded-[4px] ${shades[level] || shades[0]} tooltip`} data-tip={tip} />;
};

const Heatmap = ({ data, startLabel = "", endLabel = "" }) => (
  <div className="w-full">
    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
      <span>{startLabel}</span>
      <span>{endLabel}</span>
    </div>
    <div className="flex justify-center gap-1">
      {data.map((col, x) => (
        <div key={x} className="flex flex-col gap-1">
          {col.map((lvl, y) => (
            <HeatCell key={`${x}-${y}`} level={lvl} tip={`${lvl} solved`} />
          ))}
        </div>
      ))}
    </div>
    <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500 justify-center">
      <span>Less</span>
      <div className="flex items-center gap-1">
        {[0,1,2,3,4].map(i => <div key={i} className={`w-3 h-3 rounded-[4px] ${i===0? 'bg-gray-200 dark:bg-white/10':''} ${i===1? 'bg-emerald-200':''} ${i===2? 'bg-emerald-300':''} ${i===3? 'bg-emerald-400':''} ${i===4? 'bg-emerald-500':''}`} />)}
      </div>
      <span>More</span>
    </div>
  </div>
);

export default Heatmap
