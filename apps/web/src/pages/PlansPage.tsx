import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "@gym/ui";
import { listPlans } from "../services/api";

export const PlansPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["plans"], queryFn: listPlans });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Plans</h2>
          <p className="text-sm text-gray-500">
            Configure recurring memberships, punch cards, and drop-in options.
          </p>
        </div>
        <Button variant="primary">New plan</Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isLoading && <Card>Loading plans…</Card>}
        {data?.map((plan: any) => (
          <Card
            key={plan.id}
            title={plan.name}
            description={`${plan.billingPeriod.toLowerCase()} • ${plan.active ? "Active" : "Inactive"}`}
            actions={<Button variant="ghost">Edit</Button>}
          >
            <dl className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <Detail label="Price" value={`$${plan.price}`} />
              <Detail label="Credits" value={plan.creditsPerPeriod ?? "Unlimited"} />
              <Detail label="Contract" value={plan.contractMonths ? `${plan.contractMonths} months` : "Flexible"} />
              <Detail label="Tax Rate" value={plan.taxRate ? `${Number(plan.taxRate) * 100}%` : "N/A"} />
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Detail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
    <dd className="font-medium text-gray-900">{value}</dd>
  </div>
);
