'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { memberSchema, type FormDataInterface } from '@/models/memberSchema';
import { createMember } from '@/models/members';
import { useActionState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';
import { areaUnits, premiseTypes, premiseUnitType } from '@/lib/constants';
import { Tables } from '@/utils/supabase/database.types';

export default function CreateMemberForm({
  memberTypes,
  society,
}: {
  memberTypes: Tables<'member_types'>[];
  society: Tables<'societies'>;
}) {
  const form = useForm<FormDataInterface>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      code: '',
      salutation: 'mr',
      full_name: '',
      assoc_name: '',
      id_member_type: 1,
      mobile: '',
      assoc_mobile: '',
      aadhaar_no: '',
      pan_no: '',
      flat_no: '',
      build_name: '',
      premise_type: 'residential',
      premise_unit_type: 'flat',
      add_premise: '',
      area: 0,
      area_unit: 'sq_ft',
      email: '',
    },
  });

  const [formState, action, isPending] = useActionState(
    createMember,
    null
    // `/members/${society.id}/step2`
  );

  useEffect(() => {
    form.reset(form.getValues());
  }, [form]);

  return (
    <Form {...form}>
      <form action={action} className="space-y-6">
        <input type="hidden" name="id_society" value={society?.id || 0} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter member code"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage>{formState?.error?.code}</FormMessage>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem className="flex-[0_0_60px]">
                  <FormLabel>Salutation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || 'mr'}
                    name="salutation"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{formState?.error?.salutation}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage>{formState?.error?.full_name}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="assoc_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter associate name" {...field} />
                </FormControl>
                <FormMessage>{formState?.error?.assoc_name}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_member_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                  name="id_member_type"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{formState?.error?.id_member_type}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage>{formState?.error?.mobile}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assoc_mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associate Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Enter associate mobile" {...field} />
                </FormControl>
                <FormMessage>{formState?.error?.assoc_mobile}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage>{formState?.error?.email}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aadhaar_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhaar Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter aadhaar number" {...field} />
                </FormControl>
                <FormMessage>{formState?.error?.aadhaar_no}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pan_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PAN number" {...field} />
                </FormControl>
                <FormMessage>{formState?.error?.pan_no}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Premise Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 ">
              <FormField
                control={form.control}
                name="premise_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Premise Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name="premise_type"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select premise type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {premiseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{formState?.error?.premise_type}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="premise_unit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Premise Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name="premise_unit_type"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select premise unit type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {premiseUnitType.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {formState?.error?.premise_unit_type}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="flat_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flat/Shop Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter flat/shop number" {...field} />
                  </FormControl>
                  <FormMessage>{formState?.error?.flat_no}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="build_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter building name" {...field} />
                  </FormControl>
                  <FormMessage>{formState?.error?.build_name}</FormMessage>
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter area"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage>{formState?.error?.area}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area_unit"
                render={({ field }) => (
                  <FormItem className="flex-[0_0_140px]">
                    <FormLabel>Area Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name="area_unit"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areaUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{formState?.error?.area_unit}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="add_premise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Premise</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter additional premise" {...field} />
                  </FormControl>
                  <FormMessage>{formState?.error?.add_premise}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormMessage>{formState?.error_message}</FormMessage>
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create & Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
