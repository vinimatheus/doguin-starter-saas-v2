'use client';

import * as React from 'react';
import { Users, Building } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const data = {
  nav: [
    { name: 'Organização', icon: Building },
    { name: 'Membros', icon: Users }
  ]
};

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMembers = pathname.includes('membros');

  // ✅ Correção: Estado atualizado dinamicamente quando `pathname` muda
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const fromRoute = searchParams.get('from');

    if (fromRoute) {
      sessionStorage.setItem('lastNonDialogRoute', fromRoute);
    }

    // ✅ Agora `isOpen` é atualizado corretamente na montagem e mudança de rota
    setIsOpen(pathname.includes('organizacao') || pathname.includes('membros'));
  }, [pathname, searchParams]);

  const handleNavigation = (itemName: string) => {
    const fromRoute = searchParams.get('from');

    if (itemName === 'Membros') {
      router.push(`membros${fromRoute ? `?from=${fromRoute}` : ''}`);
    } else {
      router.push(`organizacao${fromRoute ? `?from=${fromRoute}` : ''}`);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const previousRoute =
        sessionStorage.getItem('lastNonDialogRoute') || '/dashboard';

      sessionStorage.removeItem('lastNonDialogRoute');
      setIsOpen(false);

      // ✅ Correção: `replace` para não duplicar histórico
      router.replace(previousRoute);

      // ✅ Correção: Aguarda a navegação antes de atualizar
      setTimeout(() => {
        router.refresh(); // 🚀 Garante que o contexto da página seja atualizado
      }, 100);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      key={pathname} // ✅ Força re-render do diálogo ao mudar a rota
    >
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Configurações</DialogTitle>
        <DialogDescription className="sr-only">
          Gerencie as configurações da organização e dos membros.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            isMembers
                              ? item.name === 'Membros'
                              : item.name === 'Organização'
                          }
                          onClick={() => handleNavigation(item.name)}
                        >
                          <a>
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Configurações</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isMembers ? 'Membros' : 'Organização'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            {children}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
