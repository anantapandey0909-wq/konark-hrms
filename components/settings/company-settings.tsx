"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";

import { 
  CompanySettings as CompanySettingsType,
  SettingsSubComponentProps 
} from "@/types/settings";
import { companySettingsSchema } from "@/lib/validation/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function CompanySettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<CompanySettingsType>) {
  
  // React Hook Form declarative sync using values reactive parameter
  const form = useForm<CompanySettingsType>({
    resolver: zodResolver(companySettingsSchema),
    values: {
      legalName: data.legalName ?? "",
      tradeName: data.tradeName ?? "",
      taxIdentifier: data.taxIdentifier ?? "",
      registrationNumber: data.registrationNumber ?? "",
      industry: data.industry ?? "",
      website: data.website ?? "",
      contactEmail: data.contactEmail ?? "",
      contactPhone: data.contactPhone ?? "",
      address: {
        street: data.address?.street ?? "",
        city: data.address?.city ?? "",
        state: data.address?.state ?? "",
        postalCode: data.address?.postalCode ?? "",
        country: data.address?.country ?? "",
      },
    },
  });

  const onSubmit = (values: CompanySettingsType) => {
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
          <CardTitle className="text-xl font-semibold tracking-tight">Company Settings</CardTitle>
          <CardDescription>
            Manage your legal entity registration, tax parameters, contact coordinates, and registered office address.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Corporate Identity Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Acme Corporation Pvt Ltd" 
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
                  name="tradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Acme Corp" 
                          disabled={isPending} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Regulatory and Tax Identifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="taxIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Identifier (GSTIN / TIN / EIN)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 27AAAAA0000A1Z5" 
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
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number (CIN / CoID)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. U74900MH2025PTC123456" 
                          disabled={isPending} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business Classification & Digital Presence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Technology, Healthcare" 
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. https://www.acme.com" 
                          disabled={isPending} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Primary Communications Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. info@acme.com" 
                          type="email"
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
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. +1 555-0199" 
                          disabled={isPending} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Registered Address Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium tracking-tight">Registered Office Address</h3>
                  <p className="text-sm text-muted-foreground">
                    Specify the official physical location registered with regulatory systems.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 123 Business Parkway, Suite 500" 
                            disabled={isPending} 
                            {...field} 
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
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Mumbai" 
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
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Maharashtra" 
                            disabled={isPending} 
                            {...field} 
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
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal / ZIP Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 400001" 
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
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. India" 
                            disabled={isPending} 
                            {...field} 
                          />
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