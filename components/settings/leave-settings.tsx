"use client";

import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

import { 
  LeaveSettings as LeaveSettingsType,
  SettingsSubComponentProps,
  ACCRUAL_FREQUENCIES
} from "@/types/settings";
import { leaveSettingsSchema } from "@/lib/validation/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Deeply resolves readonly modifier constraints on array schemas for React Hook Form dynamic arrays
type Writable<T> = {
  -readonly [P in keyof T]: T[P] extends readonly (infer U)[]
    ? Writable<U>[]
    : T[P] extends object
    ? Writable<T[P]>
    : T[P];
};

type LeaveSettingsFormValues = Writable<LeaveSettingsType>;

export function LeaveSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<LeaveSettingsType>) {

  const form = useForm<LeaveSettingsFormValues>({
    resolver: zodResolver(leaveSettingsSchema) as unknown as Resolver<LeaveSettingsFormValues>,
    values: {
      allowNegativeBalance: data.allowNegativeBalance ?? false,
      sandwichRuleEnabled: data.sandwichRuleEnabled ?? false,
      policies: (data.policies ?? []).map((policy) => ({
        id: policy.id,
        leaveType: policy.leaveType ?? "",
        annualQuotaDays: policy.annualQuotaDays ?? 0,
        accrualFrequency: policy.accrualFrequency ?? "monthly",
        carryForwardMaxDays: policy.carryForwardMaxDays ?? 0,
        requiresApproval: policy.requiresApproval ?? false,
      })),
    },
  });

  const { 
    fields: policyFields, 
    append: appendPolicy, 
    remove: removePolicy 
  } = useFieldArray({
    control: form.control,
    name: "policies",
  });

  const onSubmit = (values: LeaveSettingsFormValues) => {
    onSave(values satisfies LeaveSettingsType);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Leave Settings</CardTitle>
          <CardDescription>
            Configure leave parameters, negative balance options, sandwich rules, and specific accrual allocations.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* General Policy Framework */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tight">Policy Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="allowNegativeBalance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[58px]">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Allow Negative Balance</FormLabel>
                          <FormDescription className="text-xs">
                            Allow employees to request advance leave days
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

                  <FormField
                    control={form.control}
                    name="sandwichRuleEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[58px]">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Enable Sandwich Rule</FormLabel>
                          <FormDescription className="text-xs">
                            Count intervening holidays as taken leave days
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
                </div>
              </div>

              <Separator />

              {/* Leave Policy Allocation Rules */}
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">Leave Policy Types</h3>
                    <p className="text-sm text-muted-foreground">
                      Define accrual limits and rollover boundaries for separate leave types.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => appendPolicy({
                      id: crypto.randomUUID(),
                      leaveType: "",
                      annualQuotaDays: 0,
                      accrualFrequency: "monthly",
                      carryForwardMaxDays: 0,
                      requiresApproval: true,
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Policy
                  </Button>
                </div>

                <div className="space-y-4">
                  {policyFields.map((field, index) => (
                    <div 
                      key={field.id}
                      className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative"
                    >
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`policies.${index}.leaveType`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Leave Type</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Sick Leave" disabled={isPending} {...inputField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`policies.${index}.annualQuotaDays`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Annual Quota (Days)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  disabled={isPending} 
                                  min={0}
                                  {...inputField}
                                  onChange={(e) => inputField.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`policies.${index}.accrualFrequency`}
                          render={({ field: selectField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Accrual Frequency</FormLabel>
                              <Select 
                                onValueChange={selectField.onChange} 
                                value={selectField.value}
                                disabled={isPending}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ACCRUAL_FREQUENCIES.map((freq) => (
                                    <SelectItem key={freq} value={freq}>
                                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`policies.${index}.carryForwardMaxDays`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Rollover Limit (Days)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  disabled={isPending} 
                                  min={0}
                                  {...inputField}
                                  onChange={(e) => inputField.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-col justify-end">
                        <FormField
                          control={form.control}
                          name={`policies.${index}.requiresApproval`}
                          render={({ field: switchField }) => (
                            <FormItem className="flex items-center gap-2 space-y-0 h-10 pb-1">
                              <FormControl>
                                <Switch
                                  checked={switchField.value}
                                  onCheckedChange={switchField.onChange}
                                  disabled={isPending}
                                />
                              </FormControl>
                              <FormLabel className="text-xs cursor-pointer">Requires Approval</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removePolicy(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Policy</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {policyFields.length === 0 && (
                   <div className="text-center p-6 border border-dashed rounded-lg text-sm text-muted-foreground">
  No leave policies defined. Click &quot;Add Policy&quot; to configure a leave type.
</div>
                  )}
                </div>
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