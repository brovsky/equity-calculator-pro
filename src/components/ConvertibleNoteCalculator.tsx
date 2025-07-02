'use client';

import { useState } from 'react';
import { calculateConvertibleNoteDilution } from '@/lib/calculations';
import { ConvertibleNoteResult } from '@/lib/types';

export function ConvertibleNoteCalculator() {
  const [preMoneyValuation, setPreMoneyValuation] = useState<string>('');
  const [noteAmount, setNoteAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('');
  const [cap, setCap] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('1');
  const [results, setResults] = useState<ConvertibleNoteResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    try {
      setError('');
      
      const preVal = parseFloat(preMoneyValuation);
      const amount = parseFloat(noteAmount);
      const interest = parseFloat(interestRate);
      const discount = parseFloat(discountRate);
      const time = parseFloat(timePeriod);
      const capVal = cap ? parseFloat(cap) : undefined;
      
      if (isNaN(preVal) || isNaN(amount) || isNaN(interest) || isNaN(discount) || isNaN(time)) {
        throw new Error('Please enter valid numbers for all required fields');
      }

      const convertibleResults = calculateConvertibleNoteDilution(
        preVal, amount, interest, discount, capVal, time
      );
      setResults(convertibleResults);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Convertible Notes Calculator</h2>
      
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
            <label htmlFor="noteAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Note Principal Amount ($)
            </label>
            <input
              id="noteAmount"
              type="number"
              value={noteAmount}
              onChange={(e) => setNoteAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 500000"
            />
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 8"
            />
          </div>

          <div>
            <label htmlFor="discountRate" className="block text-sm font-medium text-gray-700 mb-2">
              Conversion Discount Rate (%)
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

          <div>
            <label htmlFor="cap" className="block text-sm font-medium text-gray-700 mb-2">
              Valuation Cap ($) - Optional
            </label>
            <input
              id="cap"
              type="number"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5000000"
            />
          </div>

          <div>
            <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-2">
              Time Period (Years)
            </label>
            <input
              id="timePeriod"
              type="number"
              step="0.1"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1.5"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Conversion
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Conversion Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Amount:</span>
                  <span className="font-medium">{formatCurrency(results.conversionAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Valuation:</span>
                  <span className="font-medium">{formatCurrency(results.effectiveValuation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ownership Percentage:</span>
                  <span className="font-medium">{results.ownershipPercentage.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-green-900 mb-2">Convertible Note Features</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Interest:</strong> Accrues over time, increasing conversion amount</li>
              <li>• <strong>Discount:</strong> Reduces the conversion price vs. new investors</li>
              <li>• <strong>Cap:</strong> Limits maximum valuation for conversion pricing</li>
              <li>• <strong>Conversion:</strong> Typically occurs at next qualified financing</li>
            </ul>
          </div>

          {results && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Calculation Details</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Principal + Accrued Interest = {formatCurrency(results.conversionAmount)}</div>
                <div>Conversion uses {cap ? 'lower of cap or discounted valuation' : 'discounted valuation'}</div>
                <div>Effective conversion price per dollar: ${(results.conversionAmount / results.effectiveValuation).toFixed(4)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}