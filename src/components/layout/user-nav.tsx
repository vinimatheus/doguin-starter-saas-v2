'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function UserNav() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Obtém a URL atual

  if (status === 'loading') {
    return (
      <div className="flex h-10 items-center justify-center">Loading...</div>
    );
  }

  if (session) {
    const isAdmin = session.user?.role === 'ADMIN';

    // 🔹 Extrai o slug da URL `/dashboard/[slug]/...`
    const pathSegments = pathname.split('/');
    const slug = pathSegments.length > 2 ? pathSegments[2] : '';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session.user?.image ?? ''}
                alt={session.user?.name ?? 'Avatar'}
              />
              <AvatarFallback>{session.user?.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col items-start space-y-1">
              <p className="text-sm font-medium leading-none text-primary">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
              <div className="flex w-full justify-between">
                {isAdmin && (
                  <Badge variant="secondary" className="mt-2">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center justify-between gap-4"
              onClick={() => {
                if (slug) {
                  router.push(`/dashboard/${slug}/perfil`);
                } else {
                  router.push('/dashboard/perfil');
                }
              }}
            >
              Perfil
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between gap-4 text-destructive"
            onClick={() => signOut()}
          >
            Sair
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}
