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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  step1MemberSchema,
  type step1FormDataInterface,
} from '@/models/memberSchema';
import { updateMember } from '@/models/members';
import { Tables } from '@/utils/supabase/database.types';
import { useActionState } from 'react';
import { premiseTypes, areaUnits, premiseUnitType } from '@/lib/constants';
export default function UpdateMemberStep1Form({
  member,
  memberTypes,
  societyCode,
}: {
  member: Tables<'members'>;
  memberTypes: Tables<'member_types'>[];
  societyCode: string;
}) {
  const form = useForm<step1FormDataInterface>({
    resolver: zodResolver(step1MemberSchema),
    defaultValues: {
      salutation: member.salutation as 'mr' | 'mrs' | 'ms',
      full_name: member.full_name,
      assoc_name: member.assoc_name || '',
      id_member_type: member.id_member_type,
      mobile: member.mobile,
      assoc_mobile: member.assoc_mobile || '',
      email: member.email || '',
      aadhaar_no: member.aadhaar_no || '',
      pan_no: member.pan_no || '',
      premise_type: (member.premise_type || 'residential') as
        | 'commercial'
        | 'residential',
      premise_unit_type: (member.premise_unit_type || 'flat') as
        | 'flat'
        | 'shop'
        | 'office'
        | 'warehouse'
        | 'gala',

      flat_no: member.flat_no || '',
      build_name: member.build_name || '',
      area: member.area || 0,
      area_unit: (member.area_unit || 'sq_ft') as 'sq_ft' | 'sq_m',
      add_premise: member.add_premise || '',
    },
  });

  const [formState, updatememberAction, isPending] = useActionState(
    updateMember,
    null
  );

  return (
    <Form {...form}>
      <form action={updatememberAction} className="space-y-6">
        <input type="hidden" name="id" value={member.id} />
        <input type="hidden" name="society_code" value={societyCode} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormItem>
            <FormLabel>Member Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter member code"
                value={member.code}
                disabled
              />
            </FormControl>
          </FormItem>
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
                <FormItem className="flex-1">
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
                  <Input placeholder="Enter Aadhaar number" {...field} />
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
        <div>
          <h3 className="text-lg font-semibold">Premise Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
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
                    <FormLabel>Premise Unit Type</FormLabel>
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
                  <FormItem>
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
            {isPending ? 'Saving...' : 'Save & Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
