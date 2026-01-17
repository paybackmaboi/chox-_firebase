import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const SalesReports = () => {
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  // State for the processed data
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    salesList: [],
    dailySales: [], // For line chart
    productSales: [] // For pie/bar chart
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch all orders from Firestore
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const orders = [];
        let totalRevenue = 0;
        const dailyMap = {};
        const productMap = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamp to JS Date
          const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          const dateKey = dateObj.toLocaleDateString('en-US'); // "12/23/2025"

          // Filter logic (Basic client-side filtering)
          const now = new Date();
          const diffTime = Math.abs(now - dateObj);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let include = true;
          // Period Filter
          if (period === 'weekly' && diffDays > 7) include = false;
          if (period === 'monthly' && diffDays > 30) include = false;
          if (period === 'yearly' && diffDays > 365) include = false;

          // Status Filter: Only show completed orders
          const status = data.status || 'pending';
          if (status !== 'completed') include = false;

          if (include) {
            const amount = parseFloat(data.totalAmount || 0);
            totalRevenue += amount;

            // Add to list
            orders.push({
              id: doc.id,
              customerName: data.customerName || 'Guest',
              createdAt: dateObj,
              totalAmount: amount,
              status: status
            });

            // Aggregate Daily Sales
            if (!dailyMap[dateKey]) dailyMap[dateKey] = 0;
            dailyMap[dateKey] += amount;

            // Aggregate Product Sales (if items exist)
            if (data.items && Array.isArray(data.items)) {
              data.items.forEach(item => {
                if (!productMap[item.name]) {
                  productMap[item.name] = 0;
                }
                productMap[item.name] += (item.quantity || 1);
              });
            }
          }
        });

        // Format Data for Charts
        const dailySalesArr = Object.keys(dailyMap).map(date => ({
          date,
          total: dailyMap[date],
          formattedDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })).reverse(); // Reverse so oldest is left on chart

        const productSalesArr = Object.keys(productMap).map(name => ({
          name: name,
          value: productMap[name]
        })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

        setStats({
          totalSales: totalRevenue,
          totalOrders: orders.length,
          salesList: orders,
          dailySales: dailySalesArr,
          productSales: productSalesArr
        });

      } catch (err) {
        console.error(err);
        setError('Failed to load data from Firebase.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [period]);

  // Pagination Logic (Client Side)
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(stats.salesList.length / ITEMS_PER_PAGE);
  const currentTableData = stats.salesList.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Custom Toolkit for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1612] border border-[#ffd700] p-3 rounded-lg shadow-xl">
          <p className="text-[#ffd700] font-bold text-sm mb-1">{label}</p>
          <p className="text-[#e8dcc6] text-xs">
            Sales: <span className="font-bold">₱{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1612] p-6 rounded-2xl border border-[#393528] shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd700] opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity duration-700"></div>

        <div>
          <h1 className="text-3xl font-bold text-[#e8dcc6] tracking-tight">
            Sales Analytics
            <span className="text-[#ffd700] ml-2">.</span>
          </h1>
          <p className="text-[#8b7a63] text-sm mt-1">Real-time performance metrics</p>
        </div>

        <div className="flex gap-2 bg-[#12110e] p-1 rounded-xl border border-[#393528]">
          {['weekly', 'monthly', 'yearly', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${period === p
                ? 'bg-[#ffd700] text-[#1a1612] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                : 'text-[#8b7a63] hover:text-[#e8dcc6] hover:bg-[#2a2214]'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd700]"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-900/20 border border-red-800 rounded-2xl text-red-400">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Sales Card */}
            <div className="bg-[#1a1612] p-6 rounded-2xl border border-[#393528] shadow-lg relative overflow-hidden group hover:border-[#ffd700]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#8b7a63] text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-[#e8dcc6] mt-1 group-hover:text-[#ffd700] transition-colors">
                    ₱{stats.totalSales.toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-[#ffd700]/10 rounded-xl text-[#ffd700]">
                  💰
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  📈 +12.5%
                </span>
                <span className="text-[#8b7a63]">vs last period</span>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-[#1a1612] p-6 rounded-2xl border border-[#393528] shadow-lg relative overflow-hidden group hover:border-[#3b82f6]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#8b7a63] text-xs font-bold uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-3xl font-bold text-[#e8dcc6] mt-1 group-hover:text-[#3b82f6] transition-colors">
                    {stats.totalOrders}
                  </h3>
                </div>
                <div className="p-3 bg-[#3b82f6]/10 rounded-xl text-[#3b82f6]">
                  📦
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  📈 +5.2%
                </span>
                <span className="text-[#8b7a63]">New orders</span>
              </div>
            </div>

            {/* Avg Order Value Card */}
            <div className="bg-[#1a1612] p-6 rounded-2xl border border-[#393528] shadow-lg relative overflow-hidden group hover:border-[#10b981]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#8b7a63] text-xs font-bold uppercase tracking-wider">Avg. Order Value</p>
                  <h3 className="text-3xl font-bold text-[#e8dcc6] mt-1 group-hover:text-[#10b981] transition-colors">
                    ₱{stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders).toFixed(2) : '0.00'}
                  </h3>
                </div>
                <div className="p-3 bg-[#10b981]/10 rounded-xl text-[#10b981]">
                  📊
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8b7a63]/50 px-2 py-1 rounded-md font-medium">
                  — Stable
                </span>
                <span className="text-[#8b7a63]">Per customer</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <div className="bg-[#1a1612] p-6 rounded-2xl border border-[#393528] shadow-lg">
              <h3 className="text-[#e8dcc6] font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#ffd700] rounded-full"></span>
                Revenue Trend
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.dailySales}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#393528" vertical={false} />
                    <XAxis
                      dataKey="formattedDate"
                      stroke="#8b7a63"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#8b7a63"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₱${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#ffd700"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products Chart */}
            <div className="bg-[#1a1612] p-6 rounded-2xl border border-[#393528] shadow-lg">
              <h3 className="text-[#e8dcc6] font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#3b82f6] rounded-full"></span>
                Top Performers
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.productSales} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#393528" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#e8dcc6"
                      tick={{ fontSize: 12, fill: '#e8dcc6' }}
                      width={100}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#2a2214' }}
                      contentStyle={{ backgroundColor: '#1a1612', border: '1px solid #3b82f6', borderRadius: '8px' }}
                      itemStyle={{ color: '#e8dcc6' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                      {stats.productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[
                          '#ffd700', '#fbbf24', '#f59e0b', '#d97706', '#b45309'
                        ][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-[#1a1612] rounded-2xl border border-[#393528] shadow-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#393528] flex justify-between items-center bg-[#12110e]/50 backdrop-blur-sm">
              <h3 className="text-[#e8dcc6] font-bold text-lg">Recent Transactions</h3>
              <span className="text-[#8b7a63] text-sm bg-[#2a2214] px-3 py-1 rounded-full border border-[#393528]">
                {stats.totalOrders} total orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#2a2214] text-[#8b7a63] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393528]">
                  {currentTableData.map((sale) => (
                    <tr key={sale.id} className="hover:bg-[#2a2214]/50 transition-colors group">
                      <td className="p-4 text-[#e8dcc6] font-mono text-sm group-hover:text-[#ffd700] transition-colors">
                        #{sale.id.slice(0, 8)}
                      </td>
                      <td className="p-4 text-[#e8dcc6] font-medium">
                        {sale.customerName}
                      </td>
                      <td className="p-4 text-[#8b7a63] text-sm">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-[#e8dcc6] font-bold">
                        ₱{sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sale.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          sale.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            sale.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                          {sale.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#393528] flex justify-center items-center gap-4 bg-[#12110e]/30">
              <button
                className="px-4 py-2 bg-[#2a2214] border border-[#393528] rounded-lg text-[#8b7a63] text-sm hover:text-[#e8dcc6] hover:border-[#ffd700] disabled:opacity-50 disabled:hover:border-[#393528] disabled:hover:text-[#8b7a63] transition-all"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-[#8b7a63] text-sm font-medium">
                Page <span className="text-[#ffd700]">{page}</span> of {Math.max(1, totalPages)}
              </span>
              <button
                className="px-4 py-2 bg-[#2a2214] border border-[#393528] rounded-lg text-[#8b7a63] text-sm hover:text-[#e8dcc6] hover:border-[#ffd700] disabled:opacity-50 disabled:hover:border-[#393528] disabled:hover:text-[#8b7a63] transition-all"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesReports;