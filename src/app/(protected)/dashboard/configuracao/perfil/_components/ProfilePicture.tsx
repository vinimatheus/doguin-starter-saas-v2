'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/actions/saveImage';
import { removeImage } from '@/actions/removeImage';

const ProfilePicture = ({
  user,
  update
}: {
  user: any;
  update: () => void;
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadImage(formData);

    if (response.error) {
      toast({
        title: 'Erro',
        description: response.error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Imagem atualizada com sucesso!',
        variant: 'default'
      });
      update();
    }

    setUploading(false);
  };

  const handleRemove = async () => {
    try {
      await removeImage(user?.image || '');
      toast({
        title: 'Sucesso',
        description: 'Imagem removida com sucesso!',
        variant: 'default'
      });
      update();
    } catch {
      toast({
        title: 'Erro',
        description: 'Erro ao remover a imagem!',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative h-32 w-32 cursor-pointer rounded-full border">
          {user?.image ? (
            <Image
              src={user.image}
              alt="Profile"
              width={128}
              height={128}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full text-gray-500">
              Sem imagem
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
            <span className="text-white">Alterar</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Imagem de Perfil</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {user?.image && (
            <Image
              src={user.image}
              alt="Profile Picture"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full border object-cover"
            />
          )}
          <div className="flex space-x-2">
            {user?.image && (
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={uploading}
              >
                Remover
              </Button>
            )}
            <Button asChild disabled={uploading}>
              <label className="cursor-pointer">
                Alterar
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files![0])}
                />
              </label>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicture;
