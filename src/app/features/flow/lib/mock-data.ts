export const mockConfig = {
  nodes: [
    {
      id: 'apac_sales',
      position: { x: 100, y: 100 },
      data: {
        label: 'APAC_SALES',
        source: 'snowflake',
        status: 'error' as const,
        columns: [
          { name: 'product_id', type: 'string' },
          { name: 'sale_date', type: 'date' },
          { name: 'amount', type: 'number' },
          { name: 'region', type: 'string' },
          { name: 'customer_id', type: 'string' },
        ],
      },
    },
    {
      id: 'revenue_2024',
      position: { x: 100, y: 300 },
      data: {
        label: 'REVENUE_2024',
        source: 'snowflake',
        status: 'ok' as const,
        columns: [
          { name: 'quarter', type: 'string' },
          { name: 'total_revenue', type: 'number' },
          { name: 'growth_rate', type: 'number' },
          { name: 'product_category', type: 'string' },
        ],
      },
    },
    {
      id: 'orders_2023',
      position: { x: 400, y: 200 },
      data: {
        label: 'ORDERS_2023',
        source: 'postgres',
        status: 'ok' as const,
        columns: [
          { name: 'aisle', type: 'string' },
          { name: 'day_of_week', type: 'string' },
          { name: 'aisle_id', type: 'string' },
          { name: 'days_since_prior_order', type: 'number' },
        ],
      },
    },
    {
      id: 'apac_profits',
      position: { x: 700, y: 100 },
      data: {
        label: 'APAC_PROFITS',
        source: 'postgres',
        status: 'warning' as const,
        alert: {
          title: 'Monte Carlo alert',
          message: 'Data quality test failed',
        },
        columns: [
          { name: 'product_id', type: 'string' },
          { name: 'profit_margin', type: 'number' },
          { name: 'cost', type: 'number' },
          { name: 'revenue', type: 'number' },
        ],
      },
    },
    {
      id: 'financial_health',
      position: { x: 700, y: 300 },
      data: {
        label: 'FINANCIAL_HEALTH',
        source: 'postgres',
        status: 'error' as const,
        columns: [
          { name: 'metric_name', type: 'string' },
          { name: 'metric_value', type: 'number' },
          { name: 'threshold', type: 'number' },
          { name: 'status', type: 'string' },
        ],
      },
    },
    {
      id: 'regional_profits',
      position: { x: 700, y: 500 },
      data: {
        label: 'REGIONAL_PROFITS',
        source: 'postgres',
        status: 'error' as const,
        columns: [
          { name: 'region', type: 'string' },
          { name: 'year', type: 'number' },
          { name: 'quarter', type: 'string' },
          { name: 'profit', type: 'number' },
        ],
      },
    },
  ],
  edges: [
    {
      id: 'e1-3',
      source: 'apac_sales',
      target: 'orders_2023',
      animated: true,
    },
    {
      id: 'e2-3',
      source: 'revenue_2024',
      target: 'orders_2023',
      animated: false,
    },
    {
      id: 'e3-4',
      source: 'orders_2023',
      target: 'apac_profits',
      animated: true,
    },
    {
      id: 'e3-5',
      source: 'orders_2023',
      target: 'financial_health',
      animated: false,
    },
    {
      id: 'e3-6',
      source: 'orders_2023',
      target: 'regional_profits',
      animated: true,
    },
  ],
};
