import React from 'react';

import './sales-page.styles.scss';

const SalesPage: React.FC = () => (
  <div className="sales-page">
    <h1>Sales & Analytics</h1>
    <h3>Transactions</h3>
    <ol>
      <li>Transaction 1: $100</li>
      <li>Transaction 2: $200</li>
      <li>Transaction 3: $150</li>
      <li>Transaction 4: $300</li>
      <li>Transaction 5: $250</li>
    </ol>

    <h3>Customers</h3>
    <ol>
      <li>Customer 1: John Doe</li>
      <li>Customer 2: Jane Smith</li>
      <li>Customer 3: Alice Johnson</li>
    </ol>

    <h3>Analytics</h3>
    <p>Total Sales: $1000</p>
    <p>Total Customers: 3</p>
    <p>Average Transaction Value: $200</p>
    <p>Sales Growth: 10% compared to last month</p>
    <p>Top Selling Product: Product A</p>
    <p>Customer Retention Rate: 85%</p>
    <p>Conversion Rate: 5%</p>
    <p>Revenue per Visitor: $50</p>
    <p>Churn Rate: 15%</p>
    <p>Customer Lifetime Value: $500</p>
    <p>Sales by Region: North America - 60%, Europe - 30%, Asia - 10%</p>
    <p>Sales by Channel: Online - 70%, In-Store - 20%, Wholesale - 10%</p>
    <p>
      Sales by Product Category: COURSE - 40%, DOWNLOAD - 30%, CONSULTATION -
      30%
    </p>
    <p>
      Sales by Payment Method: Credit Card - 50%, PayPal - 30%, Bank Transfer -
      20%
    </p>
    <p>
      Sales by Time Period: Last 30 Days - $500, Last 60 Days - $800, Last 90
      Days - $1000
    </p>

    <h3>Sales Trends</h3>
    <p>
      Sales have been steadily increasing over the past few months, with a
      significant spike in the last month due to a successful marketing
      campaign.
    </p>
    <p>
      The average transaction value has also increased, indicating that
      customers are purchasing more expensive products.
    </p>
    <p>
      Customer retention rate has improved, suggesting that our customer
      satisfaction initiatives are paying off.
    </p>
    {/* Add more content or components related to sales and analytics here */}
  </div>
);

export default SalesPage;
