"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2, Palette, Layout, SunMoon } from "lucide-react";

import { 
  AppearanceSettings as AppearanceSettingsType,
  SettingsSubComponentProps,
  THEMES,
  SIDEBAR_VARIANTS,
  DENSITIES
} from "@/types/settings";
import { appearanceSettingsSchema } from "@/lib/validation/settings";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function AppearanceSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<AppearanceSettingsType>) {

  const form = useForm<AppearanceSettingsType>({
    resolver: zodResolver(appearanceSettingsSchema),
    values: {
      theme: data.theme ?? "system",
      sidebarVariant: data.sidebarVariant ?? "expanded",
      primaryColor: data.primaryColor ?? "#4f46e5",
      density: data.density ?? "comfortable",
    },
  });

  const onSubmit = (values: AppearanceSettingsType) => {
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
          <CardTitle className="text-xl font-semibold tracking-tight">Appearance Settings</CardTitle>
          <CardDescription>
            Personalize visual layouts, core interface themes, navigation formats, and spatial densities across the portal.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Theme Segment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <SunMoon className="h-5 w-5 text-muted-foreground" />
                  <h4>Display Theme</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Theme</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select display theme" />
                            </SelectTrigger>
                            <SelectContent>
                              {THEMES.map((theme) => (
                                <SelectItem key={theme} value={theme}>
                                  {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Navigation Segment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <Layout className="h-5 w-5 text-muted-foreground" />
                  <h4>Navigation Layout</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sidebarVariant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sidebar Navigation Style</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sidebar format" />
                            </SelectTrigger>
                            <SelectContent>
                              {SIDEBAR_VARIANTS.map((variant) => (
                                <SelectItem key={variant} value={variant}>
                                  {variant.charAt(0).toUpperCase() + variant.slice(1)} Layout
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Aesthetic Brand Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-md font-medium tracking-tight">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <h4>Branding & Density</h4>
                </div>
                <div className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Brand Color</FormLabel>
                        <div className="flex gap-3">
                          <FormControl>
                            <div className="relative flex items-center">
                              <input 
                                type="color" 
                                disabled={isPending} 
                                className="h-10 w-12 border rounded cursor-pointer p-0 bg-transparent shrink-0"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormControl>
                            <Input 
                              type="text" 
                              placeholder="#4f46e5" 
                              maxLength={7}
                              disabled={isPending} 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="density"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interface Density</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select density level" />
                            </SelectTrigger>
                            <SelectContent>
                              {DENSITIES.map((density) => (
                                <SelectItem key={density} value={density}>
                                  {density.charAt(0).toUpperCase() + density.slice(1)} Density
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
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