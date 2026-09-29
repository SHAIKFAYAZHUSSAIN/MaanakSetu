'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Layers,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { BIS_STANDARDS_DATABASE } from '@/data/standardsKnowledgeBase';
import { IndianStandard } from '@/types/standards';
import { resolveOfficialStandardUrl, OFFICIAL_PORTALS } from '@/lib/officialSources';

interface StandardsExplorerViewProps {
  onSelectStandardForAnalysis: (standard: IndianStandard) => void;
  onViewStandardDetails: (standard: IndianStandard) => void;
}

export default function StandardsExplorerView({
  onSelectStandardForAnalysis,
  onViewStandardDetails,
}: StandardsExplorerViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [certFilter, setCertFilter] = useState<string>('all');
  const [relFilter, setRelFilter] = useState<string>('all');

  // Extract unique sectors / departments
  const sectors = useMemo(() => {
    const s = new Set<string>();
    BIS_STANDARDS_DATABASE.forEach((item) => {
      const shortDep = item.department.split('(')[0].trim();
      s.add(shortDep);
    });
    return Array.from(s);
  }, []);

  // Extract unique product categories
  const products = useMemo(() => {
    const p = new Set<string>();
    BIS_STANDARDS_DATABASE.forEach((item) => {
      if (item.productCategory) {
        p.add(item.productCategory);
      }
    });
    return Array.from(p);
  }, []);

  // Filtered standards list
  const filteredStandards = useMemo(() => {
    return BIS_STANDARDS_DATABASE.filter((standard) => {
      const matchSearch =
        searchTerm === '' ||
        standard.isNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        standard.scope.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSector =
        sectorFilter === 'all' ||
        standard.department.toLowerCase().includes(sectorFilter.toLowerCase());

      const matchProduct =
        productFilter === 'all' ||
        standard.productCategory.toLowerCase() === productFilter.toLowerCase();

      const matchStatus =
        statusFilter === 'all' || standard.status.toLowerCase() === statusFilter.toLowerCase();

      const matchCert =
        certFilter === 'all' ||
        (certFilter === 'compulsory' && standard.qco.isCompulsory) ||
        (certFilter === 'voluntary' && !standard.qco.isCompulsory);

      const isTestMethod =
        standard.title.toLowerCase().includes('test') ||
        standard.title.toLowerCase().includes('method') ||
        standard.productCategory.toLowerCase().includes('test');
      const isSafety =
        standard.title.toLowerCase().includes('safety') ||
        standard.productCategory.toLowerCase().includes('safety');
      const isInstallation =
        standard.title.toLowerCase().includes('code of practice') ||
        standard.title.toLowerCase().includes('installation') ||
        standard.title.toLowerCase().includes('earthing');

      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'testing' && isTestMethod) ||
        (typeFilter === 'safety' && isSafety) ||
        (typeFilter === 'installation' && isInstallation) ||
        (typeFilter === 'product' && !isTestMethod && !isSafety && !isInstallation);

      const matchRel =
        relFilter === 'all' ||
        (relFilter === 'primary' && !isTestMethod && !isInstallation) ||
        (relFilter === 'normative' && (isTestMethod || isSafety)) ||
        (relFilter === 'auxiliary' && isInstallation);

      return (
        matchSearch &&
        matchSector &&
        matchProduct &&
        matchStatus &&
        matchCert &&
        matchType &&
        matchRel
      );
    });
  }, [
    searchTerm,
    sectorFilter,
    productFilter,
    typeFilter,
    statusFilter,
    certFilter,
    relFilter,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSectorFilter('all');
    setProductFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setCertFilter('all');
    setRelFilter('all');
  };

  return (
    <div className="gov-workspace-container space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-govborder">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>BIS Catalogue Explorer</span>
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Standards Explorer</h2>
          <p className="text-xs text-govmuted mt-0.5">
            Search active Indian Standards, filter by sector, product, currency status, and Quality Control Orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="text-xs text-govmuted hover:text-brand font-medium underline"
          >
            Reset Filters
          </button>
          <div className="text-xs font-semibold text-charcoal bg-ivory-100 px-3 py-1.5 rounded-lg border border-govborder">
            Showing <strong>{filteredStandards.length}</strong> of {BIS_STANDARDS_DATABASE.length} standards
          </div>
        </div>
      </div>

      {/* Search and 6 Filters Bar */}
      <div className="gov-card p-5 bg-white border border-govborder shadow-gov-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-govmuted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search standards, products, requirements (e.g., IS 10322, LED street light, cement, cable)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ivory-50 border border-govborder text-xs text-charcoal placeholder:text-govmuted/70 focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
          />
        </div>

        {/* 6 Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* 1. Sector */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-govmuted block mb-1">
              Sector
            </label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand text-xs"
            >
              <option value="all">All Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Product */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-govmuted block mb-1">
              Product
            </label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand text-xs"
            >
              <option value="all">All Products</option>
              {products.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Standard Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-govmuted block mb-1">
              Standard Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand text-xs"
            >
              <option value="all">All Types</option>
              <option value="product">Product Specification</option>
              <option value="testing">Test Method</option>
              <option value="safety">Safety Code</option>
              <option value="installation">Code of Practice</option>
            </select>
          </div>

          {/* 4. Status */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-govmuted block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="current">Current / Active</option>
              <option value="superseded">Superseded</option>
            </select>
          </div>

          {/* 5. Certification */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-govmuted block mb-1">
              Certification
            </label>
            <select
              value={certFilter}
              onChange={(e) => setCertFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand text-xs"
            >
              <option value="all">All Schemes</option>
              <option value="compulsory">Compulsory QCO</option>
              <option value="voluntary">Voluntary Scheme</option>
            </select>
          </div>

          {/* 6. Relationship */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-govmuted block mb-1">
              Relationship
            </label>
            <select
              value={relFilter}
              onChange={(e) => setRelFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand text-xs"
            >
              <option value="all">All Relations</option>
              <option value="primary">Primary Standard</option>
              <option value="normative">Normative Ref</option>
              <option value="auxiliary">Auxiliary Code</option>
            </select>
          </div>
        </div>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStandards.map((std) => (
          <div
            key={std.id || std.isNumber}
            className="gov-card p-5 bg-white border border-govborder hover:border-brand/60 transition-all flex flex-col justify-between space-y-4 shadow-gov-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand border border-brand-200">
                  {std.productCategory}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    std.status === 'Current'
                      ? 'bg-emerald-50 text-secgreen border border-emerald-200'
                      : 'bg-red-50 text-govdanger border border-red-200'
                  }`}
                >
                  {std.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-charcoal">{std.isNumber}</h4>
                <p className="text-xs text-brand font-semibold line-clamp-1">{std.title}</p>
              </div>

              <p className="text-xs text-govmuted line-clamp-2 leading-relaxed font-normal">
                {std.scope}
              </p>

              {std.qco.isCompulsory && (
                <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-accent font-medium">
                  <strong>Compulsory QCO:</strong> {std.qco.orderName} ({std.qco.scheme})
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-govborder flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onViewStandardDetails(std)}
                  className="font-bold text-govmuted hover:text-charcoal transition-colors"
                >
                  View Details
                </button>
                <a
                  href={resolveOfficialStandardUrl(std.isNumber, std.officialSourceUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-secgreen hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Verify on BIS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => onSelectStandardForAnalysis(std)}
                className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
              >
                <span>Analyze this item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
