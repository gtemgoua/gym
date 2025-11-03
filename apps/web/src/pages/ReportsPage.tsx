import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@gym/ui";
import { getKpiMetrics } from "../services/api";

export const ReportsPage: React.FC = () => {
  const { data } = useQuery({ queryKey: ["reports", "metrics"], queryFn: getKpiMetrics });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
        <p className="text-sm text-gray-500">Export-ready KPIs for revenue, churn, and member engagement.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Revenue Overview" description="Key billing metrics">
          <ul className="space-y-3 text-sm text-gray-700">
            <ReportRow label="MRR" value={`$${data?.mrr ?? "—"}`} />
            <ReportRow label="LTV" value={`$${data?.ltv ?? "—"}`} />
            <ReportRow label="Active subscriptions" value={data?.activeSubscriptions ?? "—"} />
            <ReportRow label="Churn rate" value={`${data?.churnRate ?? "—"}%`} />
          </ul>
        </Card>

        <Card title="Member Growth" description="Manual export via CSV">
          <p className="text-sm text-gray-600">
            Schedule weekly email reports to keep leadership aligned. Integrate with Google Sheets, Looker Studio, or
            Notion.
          </p>
        </Card>
      </div>
    </div>
  );
};

const ReportRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <li className="flex items-center justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </li>
);
