'use client';

import { useState } from 'react';
import { calculateExitProceeds, calculateLiquidationPreferenceImpact } from '@/lib/calculations';
import { ShareClass, ExitProceeds, LiquidationPreferenceResult } from '@/lib/types';
import { formatCurrencyInput, formatSharesInput, parseFormattedNumber } from '@/lib/formatters';

export function ExitAnalysis() {
  const [exitValue, setExitValue] = useState<string>('');
  const [commonShares, setCommonShares] = useState<string>('');

  // Formatted input states
  const [exitValueDisplay, setExitValueDisplay] = useState<string>('');
  const [commonSharesDisplay, setCommonSharesDisplay] = useState<string>('');
  const [sharesDisplay, setSharesDisplay] = useState<string>('');
  const [investmentDisplay, setInvestmentDisplay] = useState<string>('');
  const [shareClasses, setShareClasses] = useState<ShareClass[]>([]);
  const [results, setResults] = useState<ExitProceeds | null>(null);
  const [singleClassAnalysis, setSingleClassAnalysis] = useState<LiquidationPreferenceResult | null>(null);
  const [error, setError] = useState<string>('');

  const [newShareClass, setNewShareClass] = useState<Partial<ShareClass>>({
    name: '',
    shares: undefined,
    price: undefined,
    liquidationMultiple: 1,
    participating: false,
    seniority: 1
  });

  const [singleAnalysis, setSingleAnalysis] = useState({
    investment: '',
    ownershipPct: '',
    liquidationMultiple: '1',
    participating: false,
    participationCap: ''
  });

  const handleAddShareClass = () => {
    try {
      if (!newShareClass.name || !newShareClass.shares || !newShareClass.price) {
        throw new Error('Name, shares, and price are required');
      }

      const shareClassToAdd: ShareClass = {
        name: newShareClass.name,
        shares: newShareClass.shares,
        price: newShareClass.price,
        liquidationMultiple: newShareClass.liquidationMultiple || 1,
        participating: newShareClass.participating || false,
        seniority: newShareClass.seniority || 1
      };

      setShareClasses([...shareClasses, shareClassToAdd]);
      setNewShareClass({
        name: '',
        shares: undefined,
        price: undefined,
        liquidationMultiple: 1,
        participating: false,
        seniority: 1
      });
      setSharesDisplay('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCalculateExitProceeds = () => {
    try {
      setError('');
      
      const exit = parseFormattedNumber(exitValue);
      const common = parseFormattedNumber(commonShares);
      
      if (isNaN(exit) || isNaN(common)) {
        throw new Error('Please enter valid numbers for exit value and common shares');
      }

      if (shareClasses.length === 0) {
        throw new Error('Add at least one preferred share class');
      }

      const exitResults = calculateExitProceeds(exit, shareClasses, common);
      setResults(exitResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    }
  };

  const handleSingleClassAnalysis = () => {
    try {
      const exit = parseFormattedNumber(exitValue);
      const investment = parseFormattedNumber(singleAnalysis.investment);
      const ownership = parseFloat(singleAnalysis.ownershipPct) / 100;
      const liqMultiple = parseFloat(singleAnalysis.liquidationMultiple);
      const partCap = singleAnalysis.participationCap ? parseFloat(singleAnalysis.participationCap) : undefined;

      if (isNaN(exit) || isNaN(investment) || isNaN(ownership) || isNaN(liqMultiple)) {
        throw new Error('Please enter valid numbers for all fields');
      }

      const analysis = calculateLiquidationPreferenceImpact(
        exit,
        investment,
        ownership,
        liqMultiple,
        singleAnalysis.participating,
        partCap
      );
      
      setSingleClassAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSingleClassAnalysis(null);
    }
  };

  const handleRemoveShareClass = (index: number) => {
    setShareClasses(shareClasses.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Exit Analysis & Liquidation Preferences</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="exitValue" className="block text-sm font-medium text-gray-700 mb-2">
                Exit Value ($)
              </label>
              <input
                id="exitValue"
                type="text"
                value={exitValueDisplay}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  setExitValueDisplay(formatted);
                  setExitValue(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="e.g., 50,000,000"
              />
            </div>

            <div>
              <label htmlFor="commonShares" className="block text-sm font-medium text-gray-700 mb-2">
                Common Shares Outstanding
              </label>
              <input
                id="commonShares"
                type="text"
                value={commonSharesDisplay}
                onChange={(e) => {
                  const formatted = formatSharesInput(e.target.value);
                  setCommonSharesDisplay(formatted);
                  setCommonShares(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="e.g., 8,000,000"
              />
            </div>
          </div>

          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Preferred Share Class</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                  <input
                    type="text"
                    value={newShareClass.name || ''}
                    onChange={(e) => setNewShareClass({...newShareClass, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Series A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shares</label>
                  <input
                    type="text"
                    value={sharesDisplay}
                    onChange={(e) => {
                      const formatted = formatSharesInput(e.target.value);
                      const numeric = parseFormattedNumber(e.target.value);
                      setSharesDisplay(formatted);
                      setNewShareClass({...newShareClass, shares: numeric || undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 2,000,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Share ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newShareClass.price || ''}
                    onChange={(e) => setNewShareClass({...newShareClass, price: parseFloat(e.target.value) || undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 2.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Liquidation Multiple</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newShareClass.liquidationMultiple || ''}
                    onChange={(e) => setNewShareClass({...newShareClass, liquidationMultiple: parseFloat(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seniority</label>
                  <input
                    type="number"
                    value={newShareClass.seniority || ''}
                    onChange={(e) => setNewShareClass({...newShareClass, seniority: parseFloat(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="participating"
                    checked={newShareClass.participating || false}
                    onChange={(e) => setNewShareClass({...newShareClass, participating: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="participating" className="text-sm text-gray-700">Participating Preferred</label>
                </div>
              </div>

              <button
                onClick={handleAddShareClass}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Share Class
              </button>
            </div>
          </div>

          {shareClasses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Share Classes</h3>
              <div className="space-y-2">
                {shareClasses.map((shareClass, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                    <div>
                      <span className="font-medium">{shareClass.name}</span> - 
                      {formatNumber(shareClass.shares)} shares @ ${shareClass.price}
                      {shareClass.participating && ' (Participating)'}
                    </div>
                    <button
                      onClick={() => handleRemoveShareClass(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculateExitProceeds}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Calculate Exit Proceeds
              </button>
            </div>
          )}

          <div className="border p-4 rounded-lg bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Single Class Analysis</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Investment ($)</label>
                  <input
                    type="text"
                    value={investmentDisplay}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      setInvestmentDisplay(formatted);
                      setSingleAnalysis({...singleAnalysis, investment: e.target.value});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 5,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Ownership (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={singleAnalysis.ownershipPct}
                    onChange={(e) => setSingleAnalysis({...singleAnalysis, ownershipPct: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Liquidation Multiple</label>
                  <input
                    type="number"
                    step="0.1"
                    value={singleAnalysis.liquidationMultiple}
                    onChange={(e) => setSingleAnalysis({...singleAnalysis, liquidationMultiple: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Participation Cap</label>
                  <input
                    type="number"
                    step="0.1"
                    value={singleAnalysis.participationCap}
                    onChange={(e) => setSingleAnalysis({...singleAnalysis, participationCap: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 3 (optional)"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="singleParticipating"
                  checked={singleAnalysis.participating}
                  onChange={(e) => setSingleAnalysis({...singleAnalysis, participating: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="singleParticipating" className="text-sm text-blue-800">Participating Preferred</label>
              </div>

              <button
                onClick={handleSingleClassAnalysis}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Analyze Single Class
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Proceeds Distribution</h3>
              
              <div className="space-y-2">
                {Object.entries(results).map(([className, payout]) => (
                  <div key={className} className="flex justify-between items-center">
                    <span className="font-medium capitalize">{className}:</span>
                    <span className="font-bold">{formatCurrency(payout)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(Object.values(results).reduce((sum, val) => sum + val, 0))}</span>
                </div>
              </div>
            </div>
          )}

          {singleClassAnalysis && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Single Class Analysis</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Investor Payout:</span>
                  <span className="font-medium">{formatCurrency(singleClassAnalysis.investorPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Common Payout:</span>
                  <span className="font-medium">{formatCurrency(singleClassAnalysis.commonPayout)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Value:</span>
                  <span className="font-medium">{formatCurrency(singleClassAnalysis.conversionValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chose Conversion:</span>
                  <span className="font-medium">{singleClassAnalysis.choseConversion ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investor ROI:</span>
                  <span className="font-medium">{singleClassAnalysis.investorROI.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Investor Multiple:</span>
                  <span className="font-medium">{singleClassAnalysis.investorMultiple.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}