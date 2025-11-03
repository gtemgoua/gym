import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "@gym/ui";
import { listMembers } from "../services/api";

export const MembersPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["members"], queryFn: listMembers });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Members</h2>
          <p className="text-sm text-gray-500">
            Manage member profiles, waivers, and subscription status at a glance.
          </p>
        </div>
        <Button variant="primary">Add member</Button>
      </header>

      <Card>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading members…</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell>Email</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Phone</HeaderCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.items?.map((member: any) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <Cell>{member.name}</Cell>
                    <Cell>{member.email}</Cell>
                    <Cell>
                      <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {member.memberProfile?.status}
                      </span>
                    </Cell>
                    <Cell>{member.phone ?? "—"}</Cell>
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
  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
    {children}
  </th>
);

const Cell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{children}</td>
);
