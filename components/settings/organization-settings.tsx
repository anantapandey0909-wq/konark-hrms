"use client";

import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

import { 
  OrganizationSettings as OrganizationSettingsType,
  SettingsSubComponentProps,
  ORG_STRUCTURE_TYPES,
  DEPARTMENT_STATUSES
} from "@/types/settings";
import { organizationSettingsSchema } from "@/lib/validation/settings";
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

type OrganizationSettingsFormValues = Writable<OrganizationSettingsType>;

export function OrganizationSettings({
  data,
  onSave,
  isPending = false,
}: SettingsSubComponentProps<OrganizationSettingsType>) {

  const form = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(organizationSettingsSchema) as unknown as Resolver<OrganizationSettingsFormValues>,
    values: {
      departments: (data.departments ?? []).map((d) => ({
        id: d.id,
        name: d.name ?? "",
        code: d.code ?? "",
        headOfDepartmentId: d.headOfDepartmentId ?? "",
        status: d.status ?? "active",
      })),
      designations: (data.designations ?? []).map((d) => ({
        id: d.id,
        title: d.title ?? "",
        departmentId: d.departmentId ?? "",
        gradeLevel: d.gradeLevel ?? "",
      })),
      orgStructureType: data.orgStructureType ?? "flat",
      enableMatrixReporting: data.enableMatrixReporting ?? false,
    },
  });

  const { 
    fields: departmentFields, 
    append: appendDepartment, 
    remove: removeDepartment 
  } = useFieldArray({
    control: form.control,
    name: "departments",
  });

  const { 
    fields: designationFields, 
    append: appendDesignation, 
    remove: removeDesignation 
  } = useFieldArray({
    control: form.control,
    name: "designations",
  });

  const onSubmit = (values: OrganizationSettingsFormValues) => {
    onSave(values satisfies OrganizationSettingsType);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Organization Settings</CardTitle>
          <CardDescription>
            Configure structural organizational patterns, departments, matrix reporting guidelines, and designations.
          </CardDescription>
        </CardHeader>
        
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              
              {/* Structure Base Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <FormField
                  control={form.control}
                  name="orgStructureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Structure Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select structural style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ORG_STRUCTURE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} Structure
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
                  name="enableMatrixReporting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[58px]">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Matrix Reporting</FormLabel>
                        <FormDescription className="text-xs">
                          Enable multi-manager reporting lanes
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

              <Separator />

              {/* Departments Management Section */}
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">Departments</h3>
                    <p className="text-sm text-muted-foreground">
                      Define and configure active corporate departments.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => appendDepartment({
                      id: crypto.randomUUID(),
                      name: "",
                      code: "",
                      headOfDepartmentId: "",
                      status: "active"
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Department
                  </Button>
                </div>

                <div className="space-y-4">
                  {departmentFields.map((field, index) => (
                    <div 
                      key={field.id}
                      className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative"
                    >
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`departments.${index}.name`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Department Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Engineering" disabled={isPending} {...inputField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`departments.${index}.code`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. ENG" disabled={isPending} {...inputField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`departments.${index}.headOfDepartmentId`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Department Head ID (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. EMP-001" disabled={isPending} {...inputField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`departments.${index}.status`}
                          render={({ field: selectField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Status</FormLabel>
                              <Select 
                                onValueChange={selectField.onChange} 
                                value={selectField.value}
                                disabled={isPending}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {DEPARTMENT_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
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
                          onClick={() => removeDepartment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Department</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {departmentFields.length === 0 && (
                    <div className="text-center p-6 border border-dashed rounded-lg text-sm text-muted-foreground">
  No departments configured. Click &quot;Add Department&quot; to get started.
</div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Designations Management Section */}
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">Designations</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure corporate designations, linked operational nodes, and grade tiers.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => appendDesignation({
                      id: crypto.randomUUID(),
                      title: "",
                      departmentId: "",
                      gradeLevel: ""
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Designation
                  </Button>
                </div>

                <div className="space-y-4">
                  {designationFields.map((field, index) => (
                    <div 
                      key={field.id}
                      className="p-4 border rounded-lg bg-card/50 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative"
                    >
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`designations.${index}.title`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Designation Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Lead Engineer" disabled={isPending} {...inputField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`designations.${index}.departmentId`}
                          render={({ field: selectField }) => {
                            const currentDepartments = form.watch("departments") || [];
                            
                            return (
                              <FormItem>
                                <FormLabel className="text-xs">Department Alignment</FormLabel>
                                <Select 
                                  onValueChange={selectField.onChange} 
                                  value={selectField.value}
                                  disabled={isPending || currentDepartments.length === 0}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={currentDepartments.length === 0 ? "Create departments first" : "Select department"} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {currentDepartments.map((dept) => (
                                      <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name || `Unnamed Department (${dept.code || 'No Code'})`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`designations.${index}.gradeLevel`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Grade Level</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. L5, Director" disabled={isPending} {...inputField} />
                              </FormControl>
                              <FormMessage />
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
                          onClick={() => removeDesignation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Designation</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {designationFields.length === 0 && (
                    <div className="text-center p-6 border border-dashed rounded-lg text-sm text-muted-foreground">
  No designations configured. Click &quot;Add Designation&quot; to get started.
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