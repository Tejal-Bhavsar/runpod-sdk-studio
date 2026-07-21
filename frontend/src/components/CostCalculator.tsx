import React, { useState, useEffect } from 'react';
import { DollarSign, Landmark, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { CostCalculatorResponse } from '../types';

export const CostCalculator: React.FC = () => {
  const [gpuType, setGpuType] = useState('NVIDIA RTX 4090');
  const [gpuCount, setGpuCount] = useState(1);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [durationDays, setDurationDays] = useState(30);
  const [calculation, setCalculation] = useState<CostCalculatorResponse | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    calculateSavings();
  }, [gpuType, gpuCount, hoursPerDay, durationDays]);

  const calculateSavings = async () => {
    try {
      const res = await fetch('/api/metrics/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpu_type_id: gpuType,
          gpu_count: gpuCount,
          hours_per_day: hoursPerDay,
          duration_days: durationDays
        })
      });
      if (res.ok) {
        setCalculation(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportReport = () => {
    if (!calculation) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(calculation, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `runpod_cost_report_${gpuType.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div style={{ padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Left: Input Configuration */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DollarSign color="var(--accent-green)" /> GPU Cost & Spot Savings Calculator
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Estimate monthly cloud compute costs and evaluate Spot Instance savings
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Select GPU Hardware */}
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Select GPU Model</label>
            <select value={gpuType} onChange={e => setGpuType(e.target.value)} style={{ width: '100%' }}>
              <option value="NVIDIA RTX 4090">NVIDIA RTX 4090 ($0.44/hr)</option>
              <option value="NVIDIA A100 80GB SXM">NVIDIA A100 80GB SXM ($1.89/hr)</option>
              <option value="NVIDIA H100 PCIe">NVIDIA H100 PCIe ($2.69/hr)</option>
              <option value="NVIDIA L40S">NVIDIA L40S ($0.99/hr)</option>
              <option value="NVIDIA RTX 3090">NVIDIA RTX 3090 ($0.29/hr)</option>
            </select>
          </div>

          {/* GPU Count Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>GPU Quantity</span>
              <strong style={{ color: '#fff' }}>{gpuCount} GPUs</strong>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              value={gpuCount}
              onChange={e => setGpuCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
            />
          </div>

          {/* Daily Workload Hours Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Daily Running Duration</span>
              <strong style={{ color: '#fff' }}>{hoursPerDay} Hours/Day</strong>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={e => setHoursPerDay(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
            />
          </div>

          {/* Workload Days Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Workload Duration</span>
              <strong style={{ color: '#fff' }}>{durationDays} Days</strong>
            </div>
            <input
              type="range"
              min="1"
              max="365"
              value={durationDays}
              onChange={e => setDurationDays(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
            />
          </div>
        </div>
      </div>

      {/* Right: Cost breakdown & Savings Report */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Landmark size={18} color="var(--accent-cyan)" /> Budget & Spend Forecast Report
        </h3>

        {calculation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {/* Savings Callout Banner */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px', padding: '1rem', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', fontWeight: 600 }}>SPOT INSTANCE SAVINGS FORECAST</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                Save ${calculation.savings_usd.toLocaleString()} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>({calculation.savings_pct}%)</span>
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Compared to On-Demand billing by switching to Spot Pod allocation.
              </p>
            </div>

            {/* Billing breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span>Workload Capacity:</span>
                <span style={{ color: '#fff' }}>{calculation.total_hours.toLocaleString()} total GPU Hours</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span>On-Demand Cost:</span>
                <strong style={{ color: '#fff' }}>${calculation.total_on_demand_usd.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span>Spot Cost Estimate:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>${calculation.total_spot_usd.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span>Estimated Saving:</span>
                <strong style={{ color: 'var(--accent-green)' }}>${calculation.savings_usd.toLocaleString()}</strong>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button className="btn-primary-glow" onClick={exportReport} style={{ flex: 1, justifyContent: 'center' }}>
                <FileText size={16} /> Export Cost Report
              </button>
            </div>
          </div>
        )}

        {showNotification && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <CheckCircle2 size={14} /> Cost report saved to downloads successfully!
          </div>
        )}
      </div>
    </div>
  );
};
