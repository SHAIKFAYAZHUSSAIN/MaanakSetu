'use client';

import React from 'react';
import { SavedTenderProject } from '@/types/procurement';
import { BookmarkCheck, Trash2, FolderOpen, X, Clock, FileText } from 'lucide-react';

interface SavedProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedTenderProject[];
  onLoadProject: (project: SavedTenderProject) => void;
  onDeleteProject: (id: string) => void;
}

export default function SavedProjectsDrawer({
  isOpen,
  onClose,
  projects,
  onLoadProject,
  onDeleteProject,
}: SavedProjectsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Saved Procurement Tenders & Specifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No Saved Tenders Yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Analyze a procurement query and click &ldquo;Save Tender&rdquo; to store it in your library.
              </p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-400">
                      {proj.primaryStandardNumber}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(proj.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{proj.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {proj.extractedRequirement.rawQuery}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onLoadProject(proj);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm transition"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                    title="Delete saved tender"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center px-5">
          <span>{projects.length} Saved Tender Specifications</span>
          <button
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white font-medium underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
