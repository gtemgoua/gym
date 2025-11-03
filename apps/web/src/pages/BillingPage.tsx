import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "@gym/ui";
import { listInvoicesApi } from "../services/api";

export const BillingPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["invoices"], queryFn: listInvoicesApi });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Billing & Payments</h2>
          <p className="text-sm text-gray-500">
            Manage invoices, retries, and exports. Stripe handles PCI-sensitive data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">Export CSV</Button>
          <Button variant="primary">Create invoice</Button>
        </div>
      </header>

      <Card>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading invoices…</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <HeaderCell>Invoice</HeaderCell>
                  <HeaderCell>Member</HeaderCell>
                  <HeaderCell>Amount</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Due</HeaderCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <Cell>{invoice.id.slice(0, 8)}</Cell>
                    <Cell>{invoice.member?.email ?? "Member"}</Cell>
                    <Cell>${Number(invoice.amount).toFixed(2)}</Cell>
                    <Cell>{invoice.status}</Cell>
                    <Cell>{new Date(invoice.dueAt).toLocaleDateString()}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

const HeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{children}</th>
);

const Cell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{children}</td>
);
