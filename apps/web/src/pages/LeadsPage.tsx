import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "@gym/ui";
import { listLeadsApi } from "../services/api";

export const LeadsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["leads"], queryFn: listLeadsApi });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500">Pipeline from initial inquiry through trial and membership.</p>
        </div>
        <Button variant="primary">Add lead</Button>
      </header>
      <Card>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading leads…</p>
        ) : (
          <ul className="space-y-4">
            {data?.map((lead: any) => (
              <li key={lead.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email ?? lead.phone ?? "No contact info"}</p>
                  </div>
                  <span className="text-xs font-medium uppercase text-purple-600">{lead.stage}</span>
                </div>
                {lead.notes && <p className="mt-2 text-sm text-gray-600">{lead.notes}</p>}
              </li>
            ))}
            {data?.length === 0 && <p className="text-sm text-gray-500">No leads captured yet.</p>}
          </ul>
        )}
      </Card>
    </div>
  );
};
