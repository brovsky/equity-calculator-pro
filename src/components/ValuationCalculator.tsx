'use client';

import { useState } from 'react';
import { calculateValuations, calculateShareDistribution } from '@/lib/calculations';
import { ValuationResult, ShareDistribution } from '@/lib/types';
import { formatCurrencyInput, formatSharesInput, parseFormattedNumber, formatCurrency } from '@/lib/formatters';

interface BasicCalcData {
  investment: number;
  ownership_pct: number;
  pre_money: number;
  post_money: number;
  shares?: {
    total: number;
    founder: number;
    investor: number;
    option_pool: number;
    price_per_share: number;
  };
}

interface ValuationCalculatorProps {
  onCalculationUpdate?: (data: BasicCalcData) => void;
}

export function ValuationCalculator({ onCalculationUpdate }: ValuationCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [ownershipPercentage, setOwnershipPercentage] = useState<string>('');
  const [totalShares, setTotalShares] = useState<string>('');
  const [optionPoolPercentage, setOptionPoolPercentage] = useState<string>('');
  const [results, setResults] = useState<ValuationResult | null>(null);
  const [shareResults, setShareResults] = useState<ShareDistribution | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    try {
      setError('');
      
      const investment = parseFormattedNumber(investmentAmount);
      const ownership = parseFloat(ownershipPercentage);
      
      if (isNaN(investment) || isNaN(ownership)) {
        throw new Error('Please enter valid numbers for investment amount and ownership percentage');
      }

      const valuationResults = calculateValuations(investment, ownership);
      setResults(valuationResults);

      let calcData: BasicCalcData = {
        investment,
        ownership_pct: ownership,
        pre_money: valuationResults.preMoneyValuation,
        post_money: valuationResults.postMoneyValuation
      };

      if (totalShares) {
        const shares = parseFormattedNumber(totalShares);
        const optionPool = optionPoolPercentage ? parseFloat(optionPoolPercentage) : 0;
        
        if (!isNaN(shares)) {
          const shareDistribution = calculateShareDistribution(
            valuationResults.preMoneyValuation,
            investment,
            shares,
            optionPool
          );
          setShareResults(shareDistribution);
          
          if (shareDistribution) {
            calcData = {
              ...calcData,
              shares: {
                total: shares,
                founder: shareDistribution.founderShares,
                investor: shareDistribution.investorShares,
                option_pool: shareDistribution.optionPoolShares,
                price_per_share: shareDistribution.pricePerShare
              }
            };
          }
        }
      }

      // Update parent component with calculation data
      if (onCalculationUpdate) {
        onCalculationUpdate(calcData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
      setShareResults(null);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Startup Valuation Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount ($)
            </label>
            <input
              id="investment"
              type="text"
              value={investmentAmount}
              onChange={(e) => {
                const formatted = formatCurrencyInput(e.target.value);
                setInvestmentAmount(formatted);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1,000,000"
            />
          </div>

          <div>
            <label htmlFor="ownership" className="block text-sm font-medium text-gray-700 mb-2">
              Ownership Percentage (%)
            </label>
            <input
              id="ownership"
              type="number"
              step="0.1"
              value={ownershipPercentage}
              onChange={(e) => setOwnershipPercentage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label htmlFor="totalShares" className="block text-sm font-medium text-gray-700 mb-2">
              Total Shares (Optional)
            </label>
            <input
              id="totalShares"
              type="text"
              value={totalShares}
              onChange={(e) => {
                const formatted = formatSharesInput(e.target.value);
                setTotalShares(formatted);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 10,000,000"
            />
          </div>

          <div>
            <label htmlFor="optionPool" className="block text-sm font-medium text-gray-700 mb-2">
              Option Pool (%)
            </label>
            <input
              id="optionPool"
              type="number"
              step="0.1"
              value={optionPoolPercentage}
              onChange={(e) => setOptionPoolPercentage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 15"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Valuations
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Valuation Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pre-Money Valuation:</span>
                  <span className="font-medium">{formatCurrency(results.preMoneyValuation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Post-Money Valuation:</span>
                  <span className="font-medium">{formatCurrency(results.postMoneyValuation)}</span>
                </div>
              </div>
            </div>
          )}

          {shareResults && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Share Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Founder Shares:</span>
                  <span className="font-medium">{formatNumber(shareResults.founderShares)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investor Shares:</span>
                  <span className="font-medium">{formatNumber(shareResults.investorShares)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Option Pool Shares:</span>
                  <span className="font-medium">{formatNumber(shareResults.optionPoolShares)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Price per Share:</span>
                  <span className="font-medium">${shareResults.pricePerShare.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}