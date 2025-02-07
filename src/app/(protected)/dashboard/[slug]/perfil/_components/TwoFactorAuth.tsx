import {
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const TwoFactorAuth = ({
  value,
  onChange,
  isPending
}: {
  value: boolean;
  onChange: (checked: boolean) => void;
  isPending: boolean;
}) => (
  <FormItem className="flex items-center justify-between border p-3">
    <div>
      <FormLabel>Autenticação de Dois Fatores</FormLabel>
      <FormDescription>Ative para maior segurança</FormDescription>
    </div>
    <FormControl>
      <Switch disabled={isPending} checked={value} onCheckedChange={onChange} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

export default TwoFactorAuth;
