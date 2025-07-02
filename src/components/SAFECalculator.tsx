'use client';

import { useState } from 'react';
import { calculateSAFEDilution } from '@/lib/calculations';
import { SAFEResult } from '@/lib/types';

export function SAFECalculator() {
  const [preMoneyValuation, setPreMoneyValuation] = useState<string>('');
  const [safeAmount, setSafeAmount] = useState<string>('');
  const [safeCap, setSafeCap] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('');
  const [results, setResults] = useState<SAFEResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    try {
      setError('');
      
      const preVal = parseFloat(preMoneyValuation);
      const amount = parseFloat(safeAmount);
      const cap = parseFloat(safeCap);
      const discount = discountRate ? parseFloat(discountRate) : 0;
      
      if (isNaN(preVal) || isNaN(amount) || isNaN(cap)) {
        throw new Error('Please enter valid numbers for all required fields');
      }

      const safeResults = calculateSAFEDilution(preVal, amount, cap, discount);
      setResults(safeResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">SAFE Notes Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="preMoneyValuation" className="block text-sm font-medium text-gray-700 mb-2">
              Pre-Money Valuation ($)
            </label>
            <input
              id="preMoneyValuation"
              type="number"
              value={preMoneyValuation}
              onChange={(e) => setPreMoneyValuation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 8000000"
            />
          </div>

          <div>
            <label htmlFor="safeAmount" className="block text-sm font-medium text-gray-700 mb-2">
              SAFE Investment Amount ($)
            </label>
            <input
              id="safeAmount"
              type="number"
              value={safeAmount}
              onChange={(e) => setSafeAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 500000"
            />
          </div>

          <div>
            <label htmlFor="safeCap" className="block text-sm font-medium text-gray-700 mb-2">
              SAFE Valuation Cap ($)
            </label>
            <input
              id="safeCap"
              type="number"
              value={safeCap}
              onChange={(e) => setSafeCap(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5000000"
            />
          </div>

          <div>
            <label htmlFor="discountRate" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Rate (%) - Optional
            </label>
            <input
              id="discountRate"
              type="number"
              step="0.1"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 20"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate SAFE Dilution
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {results && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">SAFE Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Valuation:</span>
                  <span className="font-medium">{formatCurrency(results.effectiveValuation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ownership Percentage:</span>
                  <span className="font-medium">{results.ownershipPercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Post-Money Valuation:</span>
                  <span className="font-medium">{formatCurrency(results.postMoneyValuation)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">How SAFE Notes Work</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• SAFE notes convert to equity in the next priced round</li>
              <li>• The conversion uses the lower of the cap or discounted valuation</li>
              <li>• Discount rate gives SAFE holders a price advantage</li>
              <li>• Cap protects SAFE holders if company value increases significantly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}