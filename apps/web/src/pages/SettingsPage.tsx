import React from "react";
import { Card, Button } from "@gym/ui";

export const SettingsPage: React.FC = () => (
  <div className="space-y-6">
    <header>
      <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
      <p className="text-sm text-gray-500">
        Configure business profile, booking rules, dunning policy, and access control integrations.
      </p>
    </header>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title="Business Profile" description="Branding, timezone, currency, taxes" actions={<Button variant="ghost">Edit</Button>}>
        <p className="text-sm text-gray-600">
          Upload your logo, update billing entity details, and manage VAT or GST configuration per locale.
        </p>
      </Card>

      <Card title="Booking Rules" description="Cancellation, waitlist, and credit consumption">
        <p className="text-sm text-gray-600">
          Enforce cancellation cutoffs, auto-promote waitlists, and define punch card credit usage.
        </p>
      </Card>

      <Card title="Dunning Policy" description="Retry cadence and messaging templates">
        <p className="text-sm text-gray-600">
          Configure retry windows, suspend access thresholds, and map message templates for failed payments.
        </p>
      </Card>

      <Card title="Access Control" description="Door sync & webhooks">
        <p className="text-sm text-gray-600">
          Manage door controller API secrets and sync windows. Supports manual overrides for members and staff.
        </p>
      </Card>
    </div>
  </div>
);
