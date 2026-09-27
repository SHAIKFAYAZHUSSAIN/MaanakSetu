'use client';

import React from 'react';
import { Layers, Scan, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TenderProductItem } from '@/types/procurement';

interface TenderLineItemsCardProps {
  items: TenderProductItem[];
  selectedItemIndex: number;
  onSelectItem: (index: number) => void;
  ocrApplied?: boolean;
}

export default function TenderLineItemsCard({
  items,
  selectedItemIndex,
  onSelectItem,
  ocrApplied,
}: TenderLineItemsCardProps) {
  if (!items || items.length <= 1) return null;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md relative overflow-hidden transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-indigo-200 dark:border-indigo-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100">
                Multi-Product Tender Document
              </span>
              {ocrApplied && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                  <Scan className="w-3 h-3" />
                  OCR Preprocessed
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              Schedule of Requirements: {items.length} Distinct Products Detected
            </h3>
          </div>
        </div>

        <span className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
          Select an item to analyze its dedicated BIS standards
        </span>
      </div>

      {/* Item Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {items.map((item, idx) => {
          const isSelected = idx === selectedItemIndex;

          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(idx)}
              className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Item {item.itemNumber}
                  </span>
                  {isSelected && (
                    <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.productName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.rawSnippet}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  {item.estimatedCategory}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
