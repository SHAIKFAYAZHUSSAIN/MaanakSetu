'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Minus,
  Send,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  FileCheck2,
  AlertTriangle,
  ChevronDown,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react';
import { RecommendationResult } from '@/types/procurement';
import { OFFICIAL_PORTALS } from '@/lib/officialSources';

interface Message {
  id: string;
  sender: 'user' | 'maanak';
  text: string;
  timestamp: string;
  link?: { label: string; url: string };
  actionChips?: string[];
}

interface MaanakChatbotProps {
  result: RecommendationResult | null;
  activeView: string;
  onNavigateToView?: (view: string) => void;
}

export default function MaanakChatbot({
  result,
  activeView,
  onNavigateToView,
}: MaanakChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'maanak',
      text: "Hello. I'm Maanak, your BIS procurement copilot. I can help you understand tender requirements, standards, compliance checks, specification gaps, and procurement specifications.",
      timestamp: 'Just now',
      actionChips: [
        'Explain this analysis',
        'Why was this standard recommended?',
        'Check compliance',
        'Explain specification gaps',
        'Help generate specification',
        'Find official BIS source',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');

    // Generate response based on current context
    setTimeout(() => {
      const response = generateAssistantResponse(query, result, activeView);
      setMessages((prev) => [...prev, response]);
    }, 300);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'maanak',
        text: "Hello. I'm Maanak, your BIS procurement copilot. I can help you understand tender requirements, standards, compliance checks, specification gaps, and procurement specifications.",
        timestamp: 'Just now',
        actionChips: [
          'Explain this analysis',
          'Why was this standard recommended?',
          'Check compliance',
          'Explain specification gaps',
          'Help generate specification',
          'Find official BIS source',
        ],
      },
    ]);
  };

  function generateAssistantResponse(
    query: string,
    currentResult: RecommendationResult | null,
    view: string
  ): Message {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Explain this analysis
    if (q.includes('explain this analysis') || q.includes('summary of analysis') || q.includes('what did you find')) {
      if (currentResult) {
        const product = currentResult.extractedRequirement.product || 'the procurement item';
        const primary = currentResult.primaryStandard?.isNumber || 'IS Benchmark';
        const title = currentResult.primaryStandard?.title || '';
        const conf = currentResult.matchConfidence || 95;
        const gaps = currentResult.specificationGaps.length;
        const allied = currentResult.relatedStandards.length;

        return {
          id: `res-${Date.now()}`,
          sender: 'maanak',
          text: `In the current analysis for **${product}**, the system identified tender parameters matching **${primary}** (${title}) with **${conf}% confidence**. We mapped **${allied} allied standards** covering subsystem safety, testing, and environmental endurance, along with **${gaps} specification gaps** to address before tender issuance.`,
          timestamp,
          link: {
            label: 'BIS Standards Portal — Verify Standard ↗',
            url: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url,
          },
        };
      }
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'No tender analysis is currently active. You can select a benchmark scenario (like LED Street Lighting or Water Pumps) from the Workspace tab or upload a tender schedule in the Analyzer.',
        timestamp,
      };
    }

    // 2. Why was this standard recommended?
    if (q.includes('why was this standard recommended') || q.includes('why recommended') || q.includes('justification')) {
      if (currentResult?.primaryStandard) {
        const primary = currentResult.primaryStandard;
        const why = currentResult.evidence?.whyApplies || primary.scope;
        return {
          id: `res-${Date.now()}`,
          sender: 'maanak',
          text: `**${primary.isNumber}** is recommended because it is the governing Indian Standard for ${primary.title}. It directly aligns with your tender requirements for constructional safety, thermal stability, photometric performance, and weather endurance.`,
          timestamp,
          link: {
            label: `Verify ${primary.isNumber} on BIS ↗`,
            url: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url,
          },
        };
      }
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'Recommendations are formulated by matching your tender technical requirements with the gazetted sectional scope of Indian Standards in the demonstration knowledge base.',
        timestamp,
      };
    }

    // 3. Check compliance / QCO
    if (q.includes('check compliance') || q.includes('qco') || q.includes('mandatory') || q.includes('certification')) {
      if (currentResult?.primaryStandard?.qco) {
        const qco = currentResult.primaryStandard.qco;
        return {
          id: `res-${Date.now()}`,
          sender: 'maanak',
          text: `**Statutory Compliance Alert:** Under ${qco.orderName} (${qco.gazetteNotification}), this product category falls under **${qco.scheme}**. Central Public Procurement Portal (CPPP) and GeM rules mandate that all bidders must furnish valid BIS licensing / test reports at bid submission.`,
          timestamp,
          link: {
            label: 'BIS Products Under Compulsory Certification ↗',
            url: OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url,
          },
        };
      }
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'Under Section 29 of the Bureau of Indian Standards Act, 2016, products covered by gazetted Quality Control Orders (QCOs) cannot be manufactured, imported, or procured without valid certification.',
        timestamp,
        link: {
          label: 'BIS Compulsory Certification / QCO Information ↗',
          url: OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url,
        },
      };
    }

    // 4. Explain specification gaps
    if (q.includes('gap') || q.includes('deficiencies') || q.includes('missing')) {
      if (currentResult && currentResult.specificationGaps.length > 0) {
        const gapsList = currentResult.specificationGaps
          .slice(0, 3)
          .map((g) => `• **${g.title}**: ${g.recommendation}`)
          .join('\n');
        return {
          id: `res-${Date.now()}`,
          sender: 'maanak',
          text: `The tender schedule contains **${currentResult.specificationGaps.length} potential specification gaps**:\n\n${gapsList}\n\nResolving these gaps prevents vendor disputes and aligns the bid with GFR 2017 Rule 144(i).`,
          timestamp,
        };
      }
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'Specification gaps highlight omitted parameters—such as missing surge immunity levels, ingress ratings, or harmonic distortion limits—that could lead to inferior product delivery.',
        timestamp,
      };
    }

    // 5. Help generate specification
    if (q.includes('generate specification') || q.includes('export') || q.includes('pdf') || q.includes('clause')) {
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'You can use the **Spec Generator** tab in the top navigation to formulate an official 9-clause Technical Procurement Schedule. It includes mandatory BIS standards, QCO orders, inspection criteria, and GeM golden parameters ready for PDF download.',
        timestamp,
      };
    }

    // 6. Find official BIS source
    if (q.includes('official bis source') || q.includes('portal') || q.includes('website') || q.includes('source')) {
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'Official Indian Standards, gazette QCO notifications, and manufacturer licence directories can be verified on official government portals:\n\n1. **BIS Standards Portal** (Search & verify standards)\n2. **BIS Compulsory Certification** (Mandatory QCO directory)\n3. **BIS e-BIS / Manakonline** (Stakeholder services)\n4. **GeM Portal** (Procurement context)',
        timestamp,
        link: {
          label: 'BIS Standards Portal — Verify Standard ↗',
          url: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url,
        },
      };
    }

    // 7. General standards inquiries
    if (q.includes('is 10322') || q.includes('luminaire') || q.includes('street light')) {
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: '**IS 10322 (Part 5/Sec 3): 2012** specifies safety and construction requirements for road and street lighting luminaires, including insulation resistance, creepage distances, ingress protection, and thermal endurance.',
        timestamp,
        link: {
          label: 'Verify IS 10322 on BIS Standards Portal ↗',
          url: 'https://standards.bis.gov.in/item/is-10322-part-5-sec-3-2012',
        },
      };
    }

    if (q.includes('gem') || q.includes('procurement') || q.includes('gfr')) {
      return {
        id: `res-${Date.now()}`,
        sender: 'maanak',
        text: 'Under **General Financial Rules (GFR 2017) Rule 144(i)**, procurement descriptions must be clear, competitive, and state technical standards without favoring specific trade names. GeM bids should cite applicable Indian Standards.',
        timestamp,
        link: {
          label: 'Government e-Marketplace (GeM) ↗',
          url: OFFICIAL_PORTALS.GEM_PORTAL.url,
        },
      };
    }

    // Default Fallback
    return {
      id: `res-${Date.now()}`,
      sender: 'maanak',
      text: "I don't have verified information for that in the current demo knowledge base. Please verify the requirement against the official BIS source before procurement issuance.",
      timestamp,
      link: {
        label: 'BIS Official Portal ↗',
        url: OFFICIAL_PORTALS.BIS_MAIN.url,
      },
    };
  }

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-gov-hover hover:scale-105 active:scale-95 transition-all print-hide group border border-teal-400/40"
          aria-label="Open Maanak BIS Procurement Copilot Chat"
          title="Open Maanak BIS Procurement Copilot"
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-accent">
            ✦
          </span>
          <span>Maanak</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-4 sm:right-6 z-40 w-[380px] sm:w-[420px] max-w-[94vw] bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov shadow-2xl flex flex-col overflow-hidden transition-all duration-200 print-hide ${
            isMinimized ? 'h-14' : 'h-[560px] max-h-[82vh]'
          }`}
          role="region"
          aria-label="Maanak Procurement Copilot Chat Window"
        >
          {/* Header */}
          <div className="p-3.5 bg-brand dark:bg-[#104843] text-white flex items-center justify-between gap-3 select-none flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center font-bold text-sm text-accent">
                ✦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xs tracking-wide">MAANAK</h3>
                  <span className="flex items-center gap-1 text-[10px] bg-white/15 px-1.5 py-0.2 rounded font-medium text-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="text-[10px] text-teal-100 font-medium">BIS Procurement Copilot</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-md hover:bg-white/15 text-teal-100 hover:text-white transition-colors"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-md hover:bg-white/15 text-teal-100 hover:text-white transition-colors"
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                aria-label="Minimize chat"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/15 text-teal-100 hover:text-white transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subtitle Description */}
          {!isMinimized && (
            <div className="px-3.5 py-1.5 bg-brand-50 dark:bg-[#1A2C27] border-b border-brand-100 dark:border-[#263833] text-[11px] text-brand dark:text-brand-300 font-medium flex items-center justify-between">
              <span>Your procurement standards assistant</span>
              <span className="text-[10px] text-govmuted dark:text-[#94A39D]">Demo Engine</span>
            </div>
          )}

          {/* Chat Messages Body */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-ivory-50/50 dark:bg-[#111A18] text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-gov p-3 text-xs leading-relaxed shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-brand text-white rounded-br-xs'
                        : 'bg-white dark:bg-[#192723] text-charcoal dark:text-gray-100 border border-govborder dark:border-[#283C36] rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Optional Official Source Link */}
                    {m.link && (
                      <div className="mt-2.5 pt-2 border-t border-govborder/60 dark:border-[#283C36]">
                        <a
                          href={m.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-brand dark:text-teal-300 hover:underline text-[11px]"
                        >
                          <span>{m.link.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-govmuted dark:text-[#94A39D] mt-1 px-1">
                    {m.sender === 'user' ? 'You' : 'Maanak'} • {m.timestamp}
                  </span>

                  {/* Suggested Quick Action Chips (rendered on initial message) */}
                  {m.actionChips && m.actionChips.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                      {m.actionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="px-2.5 py-1 rounded-full bg-white dark:bg-[#192723] hover:bg-brand-50 dark:hover:bg-brand-900/40 text-brand dark:text-brand-300 border border-brand-200 dark:border-brand-700/50 text-[11px] font-semibold transition-all hover:scale-[1.02] text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat Input Bar */}
          {!isMinimized && (
            <div className="p-3 bg-white dark:bg-[#16221F] border-t border-govborder dark:border-[#263833] flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Maanak about standards, compliance, or gaps..."
                  className="flex-1 text-xs rounded-lg border border-govborder dark:border-[#283C36] bg-ivory-50 dark:bg-[#1C2C28] px-3 py-2 text-charcoal dark:text-white placeholder:text-govmuted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-lg bg-brand hover:bg-brand-700 text-white disabled:opacity-40 transition-colors shadow-gov-sm"
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-[10px] text-govmuted dark:text-[#94A39D] text-center pt-1.5 flex items-center justify-center gap-1">
                <span>Demo Assistant • Verify with official BIS portal before issuance</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
