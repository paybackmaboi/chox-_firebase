import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './AdminReports.css';

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
    productSales: [] // For pie chart
  });

  useEffect(() => {
    fetchSalesData();
  }, [period]); // Refetch when period changes

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
        if (period === 'weekly' && diffDays > 7) include = false;
        if (period === 'monthly' && diffDays > 30) include = false;
        if (period === 'yearly' && diffDays > 365) include = false;

        if (include) {
            const amount = parseFloat(data.totalAmount || 0);
            totalRevenue += amount;

            // Add to list
            orders.push({
                id: doc.id,
                customerName: data.customerName || 'Guest',
                createdAt: dateObj,
                totalAmount: amount,
                status: data.status || 'pending'
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
        total: dailyMap[date]
      })).reverse(); // Reverse so oldest is left on chart

      const productSalesArr = Object.keys(productMap).map(name => ({
        productName: name,
        totalQuantity: productMap[name]
      }));

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

  // Helper: Get Chart Data
  const getChartData = () => {
    if (!stats.dailySales.length) return { labels: [], values: [] };
    
    // Take last 7 entries for cleaner chart if "all" is selected
    const dataSlice = stats.dailySales.slice(-10); 
    
    return {
      labels: dataSlice.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      values: dataSlice.map((d) => d.total),
    };
  };

  // Helper: Get Pie Data
  const getPieData = () => {
    // Top 5 selling products
    return [...stats.productSales]
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);
  };

  // Pagination Logic (Client Side)
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(stats.salesList.length / ITEMS_PER_PAGE);
  const currentTableData = stats.salesList.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const chartData = getChartData();
  const pieData = getPieData();

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h1>Sales Reports</h1>
        <div className="period-selector">
          <button
            className={period === 'weekly' ? 'active' : ''}
            onClick={() => { setPeriod('weekly'); setPage(1); }}
          >
            Weekly
          </button>
          <button
            className={period === 'monthly' ? 'active' : ''}
            onClick={() => { setPeriod('monthly'); setPage(1); }}
          >
            Monthly
          </button>
          <button
            className={period === 'yearly' ? 'active' : ''}
            onClick={() => { setPeriod('yearly'); setPage(1); }}
          >
            Yearly
          </button>
          <button
            className={period === 'all' ? 'active' : ''}
            onClick={() => { setPeriod('all'); setPage(1); }}
          >
            All Time
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading Firebase Data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="stats-grid-modern">
            <div className="stat-card-modern stat-card-purple">
              <div className="stat-icon-modern">💰</div>
              <div className="stat-content-modern">
                <h3 className="stat-label-modern">Total Sales</h3>
                <p className="stat-value-modern">₱{stats.totalSales.toLocaleString()}</p>
                <div className="stat-change positive">Based on {period} data</div>
              </div>
            </div>
            
            <div className="stat-card-modern stat-card-blue">
              <div className="stat-icon-modern">📦</div>
              <div className="stat-content-modern">
                <h3 className="stat-label-modern">Total Orders</h3>
                <p className="stat-value-modern">{stats.totalOrders}</p>
                <div className="stat-change positive">Completed & Active</div>
              </div>
            </div>
            
            <div className="stat-card-modern stat-card-green">
              <div className="stat-icon-modern">📊</div>
              <div className="stat-content-modern">
                <h3 className="stat-label-modern">Avg Order Value</h3>
                <p className="stat-value-modern">
                  ₱{stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders).toFixed(2) : '0.00'}
                </p>
                <div className="stat-change positive">Per customer</div>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card chart-card-enhanced">
              <div className="chart-header-modern">
                <h3>Sales Over Time</h3>
                <span className="chart-subtitle">Revenue trend</span>
              </div>
              {chartData && chartData.values.length > 0 ? (
                <div className="line-chart-container">
                  <svg viewBox="0 0 600 300" className="chart-svg-enhanced">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="50%" stopColor="#764ba2" />
                        <stop offset="100%" stopColor="#f093fb" />
                      </linearGradient>
                      <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(102, 126, 234, 0.3)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={50 + i * 50}
                        x2="580"
                        y2={50 + i * 50}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                    ))}
                    
                    {/* Y-axis labels */}
                    {Math.max(...chartData.values) > 0 && (
                      <>
                        <text x="30" y="55" fontSize="10" fill="#6b7280" textAnchor="middle">
                          ₱{Math.max(...chartData.values).toFixed(0)}
                        </text>
                        <text x="30" y="245" fontSize="10" fill="#6b7280" textAnchor="middle">
                          ₱0
                        </text>
                      </>
                    )}
                    
                    {/* Area under the curve */}
                    <path
                      d={`M 40,250 ${chartData.values
                        .map((val, i) => {
                          const maxVal = Math.max(...chartData.values) || 1;
                          const x = 40 + (i / (Math.max(1, chartData.values.length - 1))) * 540;
                          const y = 250 - (val / maxVal) * 200;
                          return `L ${x},${y}`;
                        })
                        .join(' ')} L ${40 + (540 * (Math.max(0, chartData.values.length - 1)) / Math.max(1, chartData.values.length))},250 Z`}
                      fill="url(#fillGradient)"
                    />
                    
                    {/* Main line */}
                    <polyline
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={chartData.values
                        .map((val, i) => {
                          const maxVal = Math.max(...chartData.values) || 1;
                          const x = 40 + (i / (Math.max(1, chartData.values.length - 1))) * 540;
                          const y = 250 - (val / maxVal) * 200;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                    
                    {/* X-axis labels */}
                    {chartData.labels.map((label, i) => {
                      const x = 40 + (i / (Math.max(1, chartData.values.length - 1))) * 540;
                      // Only show some labels to avoid crowding
                      if (chartData.labels.length > 5 && i % 2 !== 0) return null;
                      
                      return (
                        <text
                          key={i}
                          x={x}
                          y="280"
                          fontSize="11"
                          fill="#6b7280"
                          textAnchor="middle"
                        >
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="no-data-container">
                  <div className="no-data-icon">📈</div>
                  <p className="no-data">No sales data available yet</p>
                </div>
              )}
            </div>

            <div className="chart-card chart-card-enhanced">
              <div className="chart-header-modern">
                <h3>Top Selling Products</h3>
                <span className="chart-subtitle">Best performers</span>
              </div>
              {pieData.length > 0 ? (
                <div className="pie-chart">
                  {pieData.map((item, i) => (
                    <div key={i} className="pie-item">
                      <div
                        className="pie-bar"
                        style={{ width: `${(item.totalQuantity / pieData[0].totalQuantity) * 100}%` }}
                      />
                      <span className="pie-label">
                        {item.productName} - {item.totalQuantity} sold
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No data available</p>
              )}
            </div>
          </div>

          <div className="table-section-modern">
            <div className="table-header-modern">
              <h3>Recent Sales</h3>
              <span className="table-subtitle">Latest completed orders</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((sale) => (
                  <tr key={sale.id}>
                    <td>#{sale.id.slice(0, 8)}</td>
                    <td>{sale.customerName}</td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td>₱{sale.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${sale.status}`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.max(1, totalPages)}
              </span>
              <button
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