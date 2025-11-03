import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@gym/ui";
import { listBookingsApi } from "../services/api";

export const BookingsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: listBookingsApi });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900">Bookings</h2>
        <p className="text-sm text-gray-500">Monitor class occupancy, waitlists, and member attendance intents.</p>
      </header>
      <Card>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading bookings…</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <HeaderCell>Member</HeaderCell>
                  <HeaderCell>Class</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Booked at</HeaderCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <Cell>{booking.member?.name ?? "Member"}</Cell>
                    <Cell>{booking.classEvent?.template?.name ?? "Class"}</Cell>
                    <Cell>{booking.status}</Cell>
                    <Cell>{new Date(booking.createdAt).toLocaleString()}</Cell>
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
