"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2, Mail, Bell, MessageSquare } from "lucide-react";

import { 
  NotificationsSettings as NotificationsSettingsType,

} from "@/types/settings";
import type { SettingsSubComponentProps } from "@/types/settings";
import { notificationsSettingsSchema } from "@/lib/validation/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
} from "@/components/ui/form";

export function NotificationSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<NotificationsSettingsType>) {

  const form = useForm<NotificationsSettingsType>({
    resolver: zodResolver(notificationsSettingsSchema),
    values: {
      email: {
        systemAlerts: data.email?.systemAlerts ?? false,
        leaveApprovals: data.email?.leaveApprovals ?? false,
        payrollDisbursal: data.email?.payrollDisbursal ?? false,
        performanceReviews: data.email?.performanceReviews ?? false,
      },
      push: {
        attendanceReminders: data.push?.attendanceReminders ?? false,
        announcements: data.push?.announcements ?? false,
        chatMessages: data.push?.chatMessages ?? false,
      },
      sms: {
        criticalAlerts: data.sms?.criticalAlerts ?? false,
        otpVerification: data.sms?.otpVerification ?? false,
      },
    },
  });

  const onSubmit = (values: NotificationsSettingsType) => {
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
          <CardTitle className="text-xl font-semibold tracking-tight">Notification Settings</CardTitle>
          <CardDescription>
            Configure transactional communication, alerts, system reminders, and security channels.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Email Notifications Segment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <h4>Email Notifications</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email.systemAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">System Alerts</FormLabel>
                          <FormDescription className="text-[10px]">Critical host monitoring notifications</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email.leaveApprovals"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Leave Approvals</FormLabel>
                          <FormDescription className="text-[10px]">Updates on submitted leave requests</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email.payrollDisbursal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Payroll Disbursal</FormLabel>
                          <FormDescription className="text-[10px]">Salary disbursal and invoice releases</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email.performanceReviews"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Performance Reviews</FormLabel>
                          <FormDescription className="text-[10px]">Appraisal alerts and review reminders</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Push Notifications Segment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <h4>Push Notifications</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="push.attendanceReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Attendance Check-In</FormLabel>
                          <FormDescription className="text-[10px]">Shift check-in triggers</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push.announcements"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Announcements</FormLabel>
                          <FormDescription className="text-[10px]">Enterprise announcement updates</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push.chatMessages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Chat Messages</FormLabel>
                          <FormDescription className="text-[10px]">In-app workspace chat alerts</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* SMS Notifications Segment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <h4>SMS Notifications</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sms.criticalAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">Critical Alerts</FormLabel>
                          <FormDescription className="text-[10px]">High priority cellular warnings</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sms.otpVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs">OTP Verification</FormLabel>
                          <FormDescription className="text-[10px]">Cellular MFA verification keys</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
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