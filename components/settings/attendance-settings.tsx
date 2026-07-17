"use client";

import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, Trash2, ShieldAlert } from "lucide-react";

import { 
  AttendanceSettings as AttendanceSettingsType,
  SettingsSubComponentProps 
} from "@/types/settings";
import { attendanceSettingsSchema } from "@/lib/validation/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Bridges flat readonly string[] array into mutable objects for React Hook Form array indexing
type AttendanceSettingsFormValues = {
  standardWorkHours: number;
  enableAutoClockOut: boolean;
  autoClockOutTime: string;
  gracePeriodMinutes: number;
  overtimeCalculationThresholdHours: number;
  ipRestrictedClockIn: boolean;
  allowedIpAddresses: { value: string }[];
};

export function AttendanceSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<AttendanceSettingsType>) {

  const form = useForm<AttendanceSettingsFormValues>({
    resolver: zodResolver(attendanceSettingsSchema) as unknown as Resolver<AttendanceSettingsFormValues>,
    values: {
      standardWorkHours: data.standardWorkHours ?? 8,
      enableAutoClockOut: data.enableAutoClockOut ?? false,
      autoClockOutTime: data.autoClockOutTime ?? "18:00",
      gracePeriodMinutes: data.gracePeriodMinutes ?? 15,
      overtimeCalculationThresholdHours: data.overtimeCalculationThresholdHours ?? 40,
      ipRestrictedClockIn: data.ipRestrictedClockIn ?? false,
      allowedIpAddresses: (data.allowedIpAddresses ?? []).map((ip) => ({ value: ip })),
    },
  });

  const { 
    fields: ipFields, 
    append: appendIp, 
    remove: removeIp 
  } = useFieldArray({
    control: form.control,
    name: "allowedIpAddresses",
  });

  const onSubmit = (values: AttendanceSettingsFormValues) => {
    // Normalizes form values back to schema domain parameters
    onSave({
      ...values,
      allowedIpAddresses: values.allowedIpAddresses.map((ip) => ip.value),
    } satisfies AttendanceSettingsType);
  };

  const isIpRestricted = form.watch("ipRestrictedClockIn");
  const isAutoClockOutEnabled = form.watch("enableAutoClockOut");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Attendance Settings</CardTitle>
          <CardDescription>
            Configure standard shift rules, automated clock operations, and IP-based security boundaries.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Shift and Threshold Configurations */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tight">Attendance & Shift Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="standardWorkHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Standard Work Hours / Day</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={isPending} 
                            min={1}
                            max={24}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gracePeriodMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace Period (Minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={isPending} 
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overtimeCalculationThresholdHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Threshold / Week</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={isPending} 
                            min={0}
                            max={168}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Automation Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tight">Automated Processing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <FormField
                    control={form.control}
                    name="enableAutoClockOut"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[58px]">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Enable Auto Clock-Out</FormLabel>
                          <FormDescription className="text-xs">
                            Automatically log out active employee shifts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {isAutoClockOutEnabled && (
                    <FormField
                      control={form.control}
                      name="autoClockOutTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auto Clock-Out Time (24h)</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              disabled={isPending} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Separator />

              {/* IP Whitelisting Configurations */}
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">Access Whitelisting</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable IP-restricted logins to confirm employee locations.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="ipRestrictedClockIn"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormLabel className="text-sm cursor-pointer">Restrict Clock-In by IP</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {isIpRestricted && (
                  <div className="p-4 border rounded-lg bg-card/50 space-y-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 font-medium">
                        <ShieldAlert className="h-4 w-4" />
                        Only Whitelisted IP Networks Can Perform Actions
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => appendIp({ value: "" })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add IP Address
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {ipFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`allowedIpAddresses.${index}.value`}
                              render={({ field: inputField }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. 192.168.1.1" 
                                      disabled={isPending} 
                                      {...inputField} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            className="text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => removeIp(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove IP Address</span>
                          </Button>
                        </div>
                      ))}

                      {ipFields.length === 0 && (
                        <div className="text-center p-6 border border-dashed rounded-lg text-sm text-muted-foreground">
                          No IP restrictions registered. Add an IP to lock login locations.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </CardContent>

            <Separator />

            <CardFooter className="flex items-center justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}