"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, KeyRound, Timer, Info } from "lucide-react";

import {
  SecuritySettings as SecuritySettingsType,
  SettingsSubComponentProps,
} from "@/types/settings";
import { securitySettingsSchema } from "@/lib/validation/settings";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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

/**
 * Security Settings is client-only mock configuration.
 * Values here do NOT control password hashing, session cookies,
 * MFA, lockout, or AUTH_SECRET. Save is disabled intentionally.
 */
export function SecuritySettings({
  data,
  onSave: _onSave,
  isPending = false,
}: SettingsSubComponentProps<SecuritySettingsType>) {
  const form = useForm<SecuritySettingsType>({
    resolver: zodResolver(securitySettingsSchema),
    values: {
      mfaRequired: data.mfaRequired ?? false,
      passwordMinLength: data.passwordMinLength ?? 8,
      passwordRequireSpecialChar: data.passwordRequireSpecialChar ?? false,
      passwordRequireNumbers: data.passwordRequireNumbers ?? false,
      sessionTimeoutMinutes: data.sessionTimeoutMinutes ?? 30,
      maxLoginAttempts: data.maxLoginAttempts ?? 5,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Security Settings
          </CardTitle>
          <CardDescription>
            Preview of authentication policy options. These controls are not
            currently enforced by the server.
          </CardDescription>
        </CardHeader>

        <Separator />

        <div className="mx-6 mt-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground">
          <Info
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <div className="space-y-1">
            <p className="font-medium">
              Preview — Security policies are not currently enforced.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              MFA, password complexity, session timeout, and login attempt limits
              shown here do not change real authentication, session cookies, or
              account lockout. Save is disabled until server-enforced security
              configuration is implemented.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6"
          >
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <h4>Authentication Security</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50">
                  <FormField
                    control={form.control}
                    name="mfaRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Require Multi-Factor Authentication (MFA)
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Preview only — not enforced on login
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <h4>Password Complexity Policy</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Password Length</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled
                              min={8}
                              max={128}
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="passwordRequireSpecialChar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">
                              Require Special Characters
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Preview only
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passwordRequireNumbers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">
                              Require Numbers
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Preview only
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <Timer className="h-5 w-5 text-muted-foreground" />
                  <h4>Session Management & Life-Cycles</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sessionTimeoutMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Session Inactivity Timeout (Minutes)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            min={1}
                            max={1440}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                          Preview only — does not change session cookie lifetime
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxLoginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Login Attempts</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            min={1}
                            max={20}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                          Preview only — lockout is not applied by the server
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex items-center justify-end gap-3 pt-6">
              <Button type="button" variant="outline" disabled>
                Reset
              </Button>
              <Button type="button" disabled>
                {isPending ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>Save disabled (not enforced)</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
