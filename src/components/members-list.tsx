'use client';

import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface MembersListProps {
  members: Member[];
}

export function MembersList({ members }: MembersListProps) {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Organization Members</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <span className="rounded bg-muted px-2 py-1 text-sm">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
