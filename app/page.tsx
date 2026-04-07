"use client";
import { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyvlZ6wemKUHhpnAnkE6bAp3P7aTOrBAlYCNeXB6VkJj97PrBxrKqbCwt9ZTu0TeAgR/exec";

export default function FinanceDashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState("2026-04");
  const [loading, setLoading] = useState(false);

  const fetchData = (month: string) => {
    setLoading(true);
    fetch(`${API_URL}?month=${month}&v=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  if (!data && loading)
    return (
      <div className="bg-[#020617] min-h-screen flex items-center justify-center text-emerald-500 font-mono italic">
        CONNECTING TO THE DATABASE...
      </div>
    );

  return (
    <main className="bg-[#020617] min-h-screen text-slate-300 p-4 md:p-8 font-sans">
      {/* HEADER & FILTER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Vault.log
          </h1>
          <h4 className="text-sm text-slate-500 italic -mt-1">
            Jubu's Fiscal Intel.
          </h4>
          {/* SECONDARY ALERT (A2) - Subtitle Style */}
          {data?.secondaryAlert && (
            <p className="text-sm text-amber-500/80 italic mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {data.secondaryAlert}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 bg-slate-900 p-2 pr-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-400">
            Filter Month
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-emerald-400 font-bold outline-none cursor-pointer [color-scheme:dark]"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>

      {data && (
        <div
          className={`max-w-7xl mx-auto space-y-6 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {/* PRIMARY ALERT (H1) - Dynamic Color Banner */}
          {data?.primaryAlert && data.primaryAlert !== "" && (
            <div className="max-w-7xl mx-auto mb-6 px-6">
              <div
                className={`
      border rounded-3xl p-5 flex items-center gap-4 shadow-xl transition-colors duration-500
      ${
        data.primaryAlert.includes("CRITICAL")
          ? "bg-rose-500/10 border-rose-500/20"
          : data.primaryAlert.includes("EXCELLENT")
            ? "bg-cyan-500/10 border-cyan-500/20"
            : "bg-emerald-500/10 border-emerald-500/20"
      }
    `}
              >
                <div
                  className={`
        w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0
        ${
          data.primaryAlert.includes("CRITICAL")
            ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
            : data.primaryAlert.includes("EXCELLENT")
              ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
        }
      `}
                >
                  <span className="font-black text-lg">
                    {data.primaryAlert.includes("⚠️")
                      ? "!"
                      : data.primaryAlert.includes("💎")
                        ? "✦"
                        : "✓"}
                  </span>
                </div>
                <div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mb-0.5
          ${
            data.primaryAlert.includes("CRITICAL")
              ? "text-rose-500/60"
              : data.primaryAlert.includes("EXCELLENT")
                ? "text-cyan-500/60"
                : "text-emerald-500/60"
          }
        `}
                  >
                    Financial Intelligence
                  </p>
                  <p className="text-white font-bold leading-tight text-lg">
                    {data.primaryAlert}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOP METRICS (Summary Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Income"
              val={data.metrics.income}
              color="text-emerald-400"
            />
            <SummaryCard
              title="Total Expense"
              val={data.metrics.expense}
              color="text-rose-400"
            />
            <SummaryCard
              title="Savings"
              val={data.metrics.savings}
              color="text-sky-400"
            />
            <SummaryCard
              title="Net Worth"
              val={data.metrics.netWorth}
              color="text-white"
              highlight
            />
          </div>

          {/* SUB METRICS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SubMetric title="Liquid Cash" val={data.subMetrics.liquid} />
            <SubMetric title="Total Savings" val={data.subMetrics.savings} />
            <SubMetric title="Fixed Deposits" val={data.subMetrics.fixed} />
            <SubMetric title="DPS" val={data.subMetrics.dps} />
          </div>

          {/* TRACKER & ACCOUNTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">
                Weekly Tracker
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {data.weeklyTracker.flat().map((val: any, i: number) => (
                  <div
                    key={i}
                    className={`h-12 rounded-lg border flex items-center justify-center text-[10px] font-bold ${val > 0 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-900 text-slate-700 border-slate-800"}`}
                  >
                    {val || ""}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">
                Account Balances
              </h3>
              <div className="space-y-3">
                {data.accounts.map((acc: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between pb-2 border-b border-slate-800/50 last:border-0"
                  >
                    <span className="text-sm text-slate-400">{acc[0]}</span>
                    <span className="text-sm font-bold text-white">
                      {acc[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TRANSACTION TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
            <TableList
              title="Income"
              rows={data.incomeTable}
              color="text-emerald-400"
            />
            <TableList
              title="Expenses"
              rows={data.expenseTable}
              color="text-rose-400"
              isExp
            />
            <TableList
              title="Transfers"
              rows={data.transferTable}
              color="text-slate-400"
              isTrans
            />
          </div>
        </div>
      )}
    </main>
  );
}

// --- SHARED COMPONENTS ---

function SummaryCard({ title, val, color, highlight }: any) {
  return (
    <div
      className={`p-6 rounded-3xl border ${highlight ? "bg-slate-800 border-slate-700 shadow-xl" : "bg-slate-900/50 border-slate-800"}`}
    >
      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
        {title}
      </p>
      <p className={`text-2xl font-black ${color}`}>{val || "৳0"}</p>
    </div>
  );
}

function SubMetric({ title, val }: any) {
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl">
      <p className="text-[9px] uppercase font-bold text-slate-500">{title}</p>
      <p className="text-lg font-bold text-slate-200">{val || "৳0"}</p>
    </div>
  );
}

function TableList({ title, rows, color, isExp, isTrans }: any) {
  return (
    <div className="bg-[#0F172A] rounded-3xl border border-slate-800 overflow-hidden shadow-xl min-h-[150px]">
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/30">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {title} History
        </h3>
      </div>
      <div className="divide-y divide-slate-800 max-h-[350px] overflow-y-auto">
        {rows && rows.length > 0 ? (
          rows.map((r: any, i: number) => (
            <div
              key={i}
              className="px-5 py-3 flex justify-between items-center hover:bg-white/5 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {isTrans ? `${r[1]} → ${r[2]}` : r[1]}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">{r[0]}</p>
              </div>
              <p className={`text-sm font-bold ${color}`}>
                ৳{isExp ? r[4] : r[3]}
              </p>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
              No Records Found
            </p>
            <p className="text-[9px] text-slate-700 mt-1 italic">
              Check sheet names are 'Income', 'Expense', and 'Transfer'
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
