'use client';

import { SettingsDialog } from '@/components/settings-dialog';

interface OrganizationContentProps {
  organization: {
    name: string;
    slug: string;
  };
}

export function OrganizationContent({
  organization
}: OrganizationContentProps) {
  return (
    <SettingsDialog>
      <div className="space-y-4">
        <h2 className="text-lg font-medium">
          Organization: {organization.name}
        </h2>
        <p>Slug: {organization.slug}</p>
      </div>
    </SettingsDialog>
  );
}
