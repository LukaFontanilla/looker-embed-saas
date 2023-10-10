export const dashConfig = {
    "Sales": {
      "title": "Sales Analytics",
      "id": import.meta.env.VITE_SALES_DASHBOARD_ID
    },
    "Marketing": {
      "title": "Marketing Analytics",
      "id": import.meta.env.VITE_MARKETING_DASHBOARD_ID,
      "config": {
        "filters": {
          "Country": "United States",
          "Event Name": "purchase"
        }
      }
    },
    "Finance": {
      "title": "Finance Analytics",
      "id": import.meta.env.VITE_FINANCE_DASHBOARD_ID
    },
    "Explore": {
      "title": "Explore",
      "id": import.meta.env.VITE_EXPLORE_ID
    }
  }

export const initializeDashboard = (active) => {
    switch(active) {
      case 'Sales':
        return import.meta.env.VITE_SALES_DASHBOARD_ID
      case 'Marketing':
        return import.meta.env.VITE_MARKETING_DASHBOARD_ID
      case 'Finance':
        return import.meta.env.VITE_SALES_DASHBOARD_ID
  }}

export const homePageConfig = [
    {
      "section": "Your Analytics Insights",
      "sub-sections": [
        {
          "title": "Sales",
          "description": "Insights broken down overtime, by company, with period comparisons",
        },
        {
          "title": "Marketing",
          "description": "Insights including spend by channel & campaign, acquisition trends, and conversion rates.",
        },
        {
          "title": "Finance",
          "description": "Insights around revenue by region, product, and salesperson.",
        }
      ]
    },
    {
      "section": "Data Exploration Gallery",
      "sub-sections": [
        {
          "title": "Data Explore",
          "description": "Self Service environment for data exploration.",
        },
        // {
        //   "title": "Explore Assistant",
        //   "description": "A natural language assistant to help you explore your data.",
        // }
      ]
    }
]
