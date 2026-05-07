# AIOps Frontend Application

This is the frontend application for the AIOps platform. Built with React (TypeScript), Vite, Tailwind CSS, Recharts, and React Router.

## Overview

The AIOps platform is designed to provide high-density, action-oriented observability, allowing operators to monitor systems, handle alerts, investigate root causes (RCA), and analyze logs.

## Module & Page Details

The application consists of the following core modules accessible via the main sidebar:

- **Dashboard (`/`)**: High-level overview of system health, active alerts, and recent anomalies.
- **Alerts (`/alerts`)**: Centralized view for managing, filtering, and acknowledging system alerts.
- **Analytics (`/analytics`)**: Detailed metrics and performance charts using `recharts`.
- **Anomalies (`/anomalies`)**: AI-driven anomaly detection stream showing deviations in expected system behavior.
- **RCA Investigations (`/rca`)**: Workflows for root cause analysis to diagnose underlying infrastructure issues.
- **Topology (`/topology`)**: Visual representation of the network and microservices architecture.
- **Projects & Servers (`/projects`)**: Management page for different organizational projects and their associated server resources.
- **Users (`/users`)**: User management, registration, and directory.
- **Roles & Permissions (`/roles`)**: RBAC (Role-Based Access Control) settings to manage access levels.
- **Log Explorer (`/log-explorer`)**: Advanced interface for querying and filtering system logs in real-time.
- **Audit Logs (`/logs`)**: Historical track of user actions and platform modifications.
- **Settings (`/settings`)**: Global configuration for the AIOps platform.

---

## How to Get Data from the Backend System

Currently, the application relies on mock data located in `src/services/dummyData.ts` for rapid prototyping and UI development. To connect the frontend to a live backend system (e.g., FastAPI, Node.js), follow the steps below:

### 1. Set Up Environment Variables

Create a `.env` file in the root of the project to store your backend API URL. Vite requires custom environment variables to be prefixed with `VITE_`.

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Install HTTP Client (Optional but Recommended)

While you can use the native `fetch` API, `axios` is recommended for better request interception, interceptors, and error handling.

```bash
npm install axios
```

### 3. Create an API Client Setup

Create a new file `src/services/apiClient.ts` to configure your HTTP client and include authentication tokens automatically.

```typescript
// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to inject the auth token (e.g., from localStorage)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### 4. Create Service Modules

Instead of pulling from `dummyData.ts`, create specific service files for each domain (e.g., `src/services/alertService.ts`).

```typescript
// src/services/alertService.ts
import apiClient from './apiClient';

export interface Alert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
}

export const getAlerts = async (): Promise<Alert[]> => {
  const response = await apiClient.get('/alerts');
  return response.data;
};
```

### 5. Fetch Data in React Components

Use React's `useEffect` and `useState` (or a data-fetching library like `react-query` / `SWR`) to consume these services inside your components.

```tsx
import React, { useEffect, useState } from 'react';
import { getAlerts, Alert } from '../services/alertService';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.id}>{alert.message}</div>
      ))}
    </div>
  );
};
```

### Next Steps for Backend Integration
1. Replace all usages of `import ... from '../services/dummyData'` with your actual API service calls.
2. Handle loading and error states in your UI components.
3. Implement standard login/logout flows to obtain and clear the `auth_token`.

---

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Build for production
npm run build
```
