"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";

import { 
  PayrollSettings as PayrollSettingsType,
  SettingsSubComponentProps,
  PAY_CYCLE_FREQUENCIES,
  TAX_REGIMES
} from "@/types/settings";
import { payrollSettingsSchema } from "@/lib/validation/settings";
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

export function PayrollSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<PayrollSettingsType>) {

  const form = useForm<PayrollSettingsType>({
    resolver: zodResolver(payrollSettingsSchema),
    values: {
      currency: data.currency ?? "USD",
      payCycleFrequency: data.payCycleFrequency ?? "monthly",
      payDayOfMonth: data.payDayOfMonth ?? 28,
      providentFundContributionPercent: data.providentFundContributionPercent ?? 12,
      taxRegimeDefault: data.taxRegimeDefault ?? "new",
      enablePayslipGeneration: data.enablePayslipGeneration ?? false,
    },
  });

  const onSubmit = (values: PayrollSettingsType) => {
    onSave(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Payroll Settings</CardTitle>
          <CardDescription>
            Configure transactional currencies, payment cycles, calendar milestones, statutory contributions, and default tax parameters.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Core Scheduling Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tight">Scheduling & Base Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency (ISO Code)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. INR, USD, EUR" 
                            maxLength={3} 
                            disabled={isPending} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payCycleFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay Cycle Frequency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAY_CYCLE_FREQUENCIES.map((freq) => (
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

                  <FormField
                    control={form.control}
                    name="payDayOfMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay Day of Month</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={isPending} 
                            min={1}
                            max={31}
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

              {/* Statutory Contributions & Taxes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tight">Compliance & Tax Regulations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="providentFundContributionPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provident Fund Contribution (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={isPending} 
                            min={0}
                            max={100}
                            step={0.01}
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
                    name="taxRegimeDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Tax Regime</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default regime" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TAX_REGIMES.map((regime) => (
                              <SelectItem key={regime} value={regime}>
                                {regime.charAt(0).toUpperCase() + regime.slice(1)} Regime
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Automation Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tight">Automation Systems</h3>
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="enablePayslipGeneration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[58px]">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Enable Automated Payslip Generation</FormLabel>
                          <FormDescription className="text-xs">
                            Automatically compile and issue digital payslips to employee mailboxes
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