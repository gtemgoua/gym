import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "@gym/ui";
import { listClassEvents } from "../services/api";

export const ClassesPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["classes"], queryFn: listClassEvents });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Classes</h2>
          <p className="text-sm text-gray-500">Schedule management across rooms, coaches, and waitlists.</p>
        </div>
        <Button variant="primary">Schedule class</Button>
      </header>

      <Card>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading class events…</p>
        ) : (
          <ul className="space-y-4">
            {data?.map((event: any) => (
              <li key={event.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{event.template?.name ?? "Custom class"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.startAt).toLocaleString()} • {event.location}
                    </p>
                  </div>
                  <span className="text-xs font-medium uppercase text-blue-600">{event.status}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <p>Coach: {event.coach?.name ?? "TBD"}</p>
                  <p>
                    {event.bookings.filter((b: any) => b.status === "BOOKED").length}/{event.capacity} booked
                  </p>
                </div>
              </li>
            ))}
            {data?.length === 0 && <p className="text-sm text-gray-500">No upcoming classes in the next 7 days.</p>}
          </ul>
        )}
      </Card>
    </div>
  );
};
