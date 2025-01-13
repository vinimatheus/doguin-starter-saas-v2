import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Check, X, Pencil } from 'lucide-react';

const FormFieldWrapper = ({
  field,
  label,
  placeholder,
  isEditing,
  onEdit,
  onSave,
  onCancel
}: any) => (
  <FormItem>
    <FormLabel>{label}</FormLabel>
    <FormControl>
      <div className="flex items-center gap-2">
        <Input {...field} placeholder={placeholder} disabled={!isEditing} />
        {isEditing ? (
          <>
            <Check className="cursor-pointer text-green-500" onClick={onSave} />
            <X className="cursor-pointer text-red-500" onClick={onCancel} />
          </>
        ) : (
          <Pencil className="cursor-pointer" onClick={onEdit} />
        )}
      </div>
    </FormControl>
    <FormMessage />
  </FormItem>
);

export default FormFieldWrapper;
