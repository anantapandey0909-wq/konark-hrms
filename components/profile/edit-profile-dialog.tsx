'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserProfile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';

const editProfileSchema = z.object({
  firstName: z.string().min(2, 'First name is required and must exceed 1 character.'),
  lastName: z.string().min(1, 'Last name is required.'),
  phone: z.string().min(10, 'Contact number is required and must follow phone formats.'),
  address: z.string().min(10, 'Please write a complete address details.'),
  emergencyName: z.string().min(2, 'Emergency contact identity is required.'),
  emergencyRelationship: z.string().min(2, 'Define relationship parameters.'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone number is required.')
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedFields: Partial<UserProfile>) => void;
}

export default function EditProfileDialog({
  isOpen,
  onClose,
  profile,
  onSave
}: EditProfileDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      address: profile.address,
      emergencyName: profile.emergencyContact.name,
      emergencyRelationship: profile.emergencyContact.relationship,
      emergencyPhone: profile.emergencyContact.phone
    }
  });

  const onSubmit = async (values: EditProfileFormValues) => {
    // Simulated processing latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    onSave({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      address: values.address,
      emergencyContact: {
        name: values.emergencyName,
        relationship: values.emergencyRelationship,
        phone: values.emergencyPhone
      }
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 select-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-zinc-150 dark:border-zinc-800/80">
          <DialogTitle className="text-sm font-extrabold uppercase tracking-wide text-zinc-800 dark:text-zinc-300">
            Edit Information Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">First Name</label>
              <input
                {...register('firstName')}
                type="text"
                className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              {errors.firstName && <p className="text-[10px] text-rose-600 font-semibold">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Last Name</label>
              <input
                {...register('lastName')}
                type="text"
                className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              {errors.lastName && <p className="text-[10px] text-rose-600 font-semibold">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Primary Phone</label>
            <input
              {...register('phone')}
              type="text"
              className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            {errors.phone && <p className="text-[10px] text-rose-600 font-semibold">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Current Address</label>
            <textarea
              {...register('address')}
              rows={2}
              className="w-full rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-2 focus:ring-1 focus:ring-indigo-500 outline-none font-sans"
            />
            {errors.address && <p className="text-[10px] text-rose-600 font-semibold">{errors.address.message}</p>}
          </div>

          <div className="pt-3.5 border-t border-dashed border-zinc-150 dark:border-zinc-800 space-y-4">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">Emergency Contact Reference</span>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Contact Person Name</label>
              <input
                {...register('emergencyName')}
                type="text"
                className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              {errors.emergencyName && <p className="text-[10px] text-rose-600 font-semibold">{errors.emergencyName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Relationship</label>
                <input
                  {...register('emergencyRelationship')}
                  type="text"
                  className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                {errors.emergencyRelationship && <p className="text-[10px] text-rose-600 font-semibold">{errors.emergencyRelationship.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Emergency Phone</label>
                <input
                  {...register('emergencyPhone')}
                  type="text"
                  className="w-full h-9 rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                {errors.emergencyPhone && <p className="text-[10px] text-rose-600 font-semibold">{errors.emergencyPhone.message}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-150 dark:border-zinc-800/80 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs border-zinc-250 dark:border-zinc-750 bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 text-xs bg-indigo-600 dark:bg-indigo-500 text-white font-bold"
            >
              {isSubmitting ? 'Saving changes...' : 'Save Account Settings'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}