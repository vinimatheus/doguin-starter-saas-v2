'use client';

import * as React from 'react';
import { useState, useTransition, useEffect } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from 'slugify';
import { cn } from '@/lib/utils';
import { CreateOrganizationSchema } from '@/schemas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { ChevronsUpDown, Plus, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/auth/form-error';
import { FormSucess } from '@/components/auth/form-sucess';
import * as LucideIcons from 'lucide-react';
import { createOrganization } from '@/actions/organization';
import { IconSelector } from './IconSelector';
import Link from 'next/link';

// Definição do tipo para os times/organizações
type Team = {
  name: string;
  slug: string;
  icon?: string;
};

export function TeamSwitcher({ teams: initialTeams }: { teams: Team[] }) {
  // Componente auxiliar para renderizar o ícone
  const IconComponent = ({ icon }: { icon?: string }) => {
    if (!icon || !(icon in LucideIcons)) {
      return null;
    }
    const LucideIcon = LucideIcons[
      icon as keyof typeof LucideIcons
    ] as React.ElementType;
    return <LucideIcon size={24} />;
  };

  const [teams, setTeams] = useState(initialTeams);
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const slugFromPath = pathname.split('/')[2];
  const [activeTeam, setActiveTeam] = useState<Team>(
    () => teams.find((team) => team.slug === slugFromPath) || teams[0]
  );

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateOrganizationSchema>>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: '',
      slug: ''
    }
  });

  useEffect(() => {
    let lastKey = '';
    let timer: NodeJS.Timeout;
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= '1' && key <= `${teams.length}`) {
        if (key === lastKey) {
          const teamIndex = parseInt(key, 10) - 1;
          const selectedTeam = teams[teamIndex];
          if (selectedTeam) {
            setActiveTeam(selectedTeam);
            window.location.href = `/dashboard/${selectedTeam.slug}/overview`;
          }
          lastKey = '';
          clearTimeout(timer);
        } else {
          lastKey = key;
          timer = setTimeout(() => {
            lastKey = '';
          }, 500);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [teams]);

  // Atualiza o slug automaticamente conforme o nome é digitado
  useEffect(() => {
    const subscription = form.watch((values) => {
      const currentSlug = form.getValues('slug');
      const newSlug = slugify(values.name || '', { lower: true, strict: true });
      if (values.name && currentSlug !== newSlug) {
        form.setValue('slug', newSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof CreateOrganizationSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      createOrganization(values).then(
        (data: { error?: string; success?: string; newTeam?: Team }) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success && data.newTeam) {
            const newTeam = data.newTeam;
            form.reset();
            setSuccess(data.success);
            setTeams((prevTeams) => [...prevTeams, newTeam]);
            setActiveTeam(newTeam);
            setIsDialogOpen(false);
            window.location.href = `/dashboard/${newTeam.slug}/overview`;
          }
        }
      );
    });
  };

  useEffect(() => {
    const slugFromPath = pathname.split('/')[3];
    const teamFromSlug = teams.find((team) => team.slug === slugFromPath);
    if (teamFromSlug) {
      setActiveTeam(teamFromSlug);
    }
  }, [pathname, teams]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <IconComponent icon={activeTeam.icon} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[299px] min-w-96 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizações
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.slug}
                  onClick={() => {
                    setActiveTeam(team);
                    window.location.href = `/dashboard/${team.slug}/overview`;
                  }}
                  className={cn(
                    'mb-1 gap-2 p-2',
                    activeTeam.slug === team.slug && 'bg-accent'
                  )}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <IconComponent icon={team.icon} />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={{
                    pathname: `organizacao`,
                    query: { from: pathname }
                  }}
                  onClick={() => {
                    // Garantir sincronia entre armazenamento e estado
                    sessionStorage.setItem('lastNonDialogRoute', pathname);
                    setIsDialogOpen(false); // Fechar outros diálogos
                  }}
                >
                  <span>
                    <Settings />
                  </span>
                  Configuração Organização
                </Link>
              </DropdownMenuItem>
              {/* Ao usar onClick (sem preventDefault), o DropdownMenu fecha automaticamente */}
              <DropdownMenuItem
                onClick={() => setIsDialogOpen(true)}
                className="w-full gap-2 p-2"
              >
                <Plus /> Criar nova organização
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar nova organização</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar sua organização.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {/* Campo para o nome da organização */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Organização</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Ex.: Minha Organização"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          placeholder="exemplo-minha-organizacao"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo para selecionar o ícone */}
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone da Organização</FormLabel>
                      <IconSelector
                        selectedIcon={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSucess message={success} />
              <div className="mt-4">
                <Button disabled={isPending} type="submit" className="w-full">
                  Criar Organização
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
