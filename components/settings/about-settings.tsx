"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2, Cpu, KeyRound } from "lucide-react";

import { 
  AboutSettings as AboutSettingsType,
  LICENSE_TYPES
} from "@/types/settings";
import type { SettingsSubComponentProps } from "@/types/settings";
import { aboutSettingsSchema } from "@/lib/validation/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

export function AboutSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<AboutSettingsType>) {

  const form = useForm<AboutSettingsType>({
    resolver: zodResolver(aboutSettingsSchema),
    values: {
      version: data.version ?? "1.0.0",
      buildNumber: data.buildNumber ?? "20250101.01",
      releaseDate: data.releaseDate ?? "2025-01-01",
      licenseKey: data.licenseKey ?? "",
      licenseType: data.licenseType ?? "trial",
      licenseExpiry: data.licenseExpiry ?? "",
    },
  });

  const onSubmit = (values: AboutSettingsType) => {
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
          <CardTitle className="text-xl font-semibold tracking-tight">About & System Settings</CardTitle>
          <CardDescription>
            Review deployed system version markers, core environment metadata, and manage enterprise activation licenses.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Core Environment Build Parameters (Read-Only fields to preserve system status) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <Cpu className="h-5 w-5 text-muted-foreground" />
                  <h4>System Build Information</h4>
                </div>
                <div className="p-4 border rounded-lg bg-muted/30 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Version</FormLabel>
                        <FormControl>
                          <Input disabled readOnly {...field} className="bg-background cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Build ID</FormLabel>
                        <FormControl>
                          <Input disabled readOnly {...field} className="bg-background cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deployment Date</FormLabel>
                        <FormControl>
                          <Input disabled readOnly {...field} className="bg-background cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Enterprise Licensing Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <h4>License Registration</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="licenseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscription License Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isPending}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select license standard" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LICENSE_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)} License
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
                      name="licenseExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Calendar Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              disabled={isPending} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="licenseKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activation Product Key</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. XXXX-XXXX-XXXX-XXXX-XXXX" 
                              disabled={isPending} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-[10px]">
                            Required to authenticate enterprise service lanes and cloud-hosted deployments.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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