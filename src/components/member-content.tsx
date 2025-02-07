'use client'; // Indica que este é um Client Component

import { SettingsDialog } from '@/components/settings-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';

interface MemberContentProps {
  organization: {
    members: {
      id: string;
      role: string;
      createdAt: Date;
      user: {
        name: string;
        email: string;
      };
    }[];
  };
}

export function MemberContent({ organization }: MemberContentProps) {
  return (
    <SettingsDialog>
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de entrada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organization.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.user.name}</TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  {format(new Date(member.createdAt), 'dd/MM/yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SettingsDialog>
  );
}
