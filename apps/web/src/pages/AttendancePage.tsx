import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@gym/ui";
import { listAttendanceApi } from "../services/api";

export const AttendancePage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["attendance"], queryFn: listAttendanceApi });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900">Attendance</h2>
        <p className="text-sm text-gray-500">Live kiosk and staff check-ins with eligibility status.</p>
      </header>

      <Card>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading attendance…</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <HeaderCell>Member</HeaderCell>
                  <HeaderCell>Class</HeaderCell>
                  <HeaderCell>Checked in</HeaderCell>
                  <HeaderCell>Method</HeaderCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <Cell>{record.member?.name ?? "Member"}</Cell>
                    <Cell>{record.classEvent?.template?.name ?? "Open gym"}</Cell>
                    <Cell>{new Date(record.checkinAt).toLocaleString()}</Cell>
                    <Cell>{record.method}</Cell>
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
