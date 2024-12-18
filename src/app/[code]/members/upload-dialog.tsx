/* eslint-disable no-unused-vars */
'use client';

import { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import { uploadCreateMember, createMemberHeadings } from '@/models/members';
import { Tables } from '@/utils/supabase/database.types';

interface UploadResults {
  success: number;
  error: number;
  errors: string[];
}

interface UploadDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSuccessAction: () => void;
  societyHeadings: {
    id: number;
    amount: number;
    society_account_master?: {
      code: string;
      name: string;
    };
  }[];
  societyData: Tables<'societies'>;
  memberCodes: string[];
}

export function UploadDialog({
  open,
  onOpenChangeAction,
  onSuccessAction,
  societyHeadings,
  societyData,
  memberCodes,
}: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadResults, setUploadResults] = useState<UploadResults>({
    success: 0,
    error: 0,
    errors: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateMember = (
    member: Record<string, string>,
    existingCodes: Set<string>
  ): string[] => {
    const errors: string[] = [];

    if (existingCodes.has(member.code)) {
      errors.push(`Duplicate member code: ${member.code}`);
    }
    existingCodes.add(member.code);

    if (
      !['commercial', 'residential'].includes(member.premise_type.toLowerCase())
    ) {
      errors.push(
        `Invalid premise type for ${member.code}: ${member.premise_type}. Must be commercial or residential.`
      );
    }
    if (
      !['flat', 'shop', 'office', 'warehouse', 'gala'].includes(
        member.premise_unit_type.toLowerCase()
      )
    ) {
      errors.push(
        `Invalid premise unit type for ${member.code}: ${member.premise_unit_type}. Must be flat, shop, office, warehouse or gala.`
      );
    }

    if (!['sq_m', 'sq_ft'].includes(member.area_unit.toLowerCase())) {
      errors.push(
        `Invalid area unit for ${member.code}: ${member.area_unit}. Must be sq_m or sq_ft.`
      );
    }

    return errors;
  };

  const handleUpload = async () => {
    if (!selectedFile || !societyData) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      const csvMembers = lines
        .slice(1)
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const values = line.split(',');
          const member = headers.reduce(
            (obj, header, index) => {
              obj[header.trim()] = values[index];
              return obj;
            },
            {} as Record<string, string>
          );
          return member;
        })
        .filter((member) => member.code && member.code.trim() !== '');

      const confirmUpload = confirm(
        `Are you sure you want to upload ${csvMembers.length} members?`
      );
      if (!confirmUpload) return;

      setIsUploading(true);
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      const existingCodes = new Set<string>(memberCodes);

      for (const csvMember of csvMembers) {
        try {
          const validationErrors = validateMember(csvMember, existingCodes);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }

          // Create member data object
          const memberData = {
            code: csvMember.code,
            salutation: csvMember.salutation,
            full_name: csvMember.full_name,
            assoc_name: csvMember.assoc_name,
            id_member_type: Number(csvMember.id_member_type),
            mobile: csvMember.mobile,
            assoc_mobile: csvMember.assoc_mobile,
            email: csvMember.email,
            aadhaar_no: csvMember.aadhaar_no,
            pan_no: csvMember.pan_no,
            premise_type: csvMember.premise_type.toLowerCase(),
            premise_unit_type: csvMember.premise_unit_type.toLowerCase(),
            flat_no: csvMember.flat_no,
            build_name: csvMember.build_name,
            area: parseFloat(csvMember.area),
            area_unit: csvMember.area_unit.toLowerCase(),
            add_premise: csvMember.add_premise,
            principle_op_balance: parseFloat(csvMember.principle_op_balance),
            interest_op_balance: parseFloat(csvMember.interest_op_balance),
            interest_free_arrears: parseFloat(csvMember.interest_free_arrears),
            id_society: societyData.id,
            id_tenant: societyData.id_tenant,
            status: 'active',
            step: 4,
            created_at: new Date().toISOString(),
          };

          // Create member and get ID
          const memberId = await uploadCreateMember(memberData);

          // Create member headings with default amounts from society headings
          const memberHeadingsData = societyHeadings.map((heading) => ({
            id_member: memberId,
            id_society_heading: heading.id,
            curr_amount:
              parseFloat(
                csvMember[heading.society_account_master?.code || '']
              ) || heading.amount,
            next_amount:
              parseFloat(
                csvMember[heading.society_account_master?.code || '']
              ) || heading.amount,
            created_at: new Date().toISOString(),
          }));

          // Insert member headings
          await createMemberHeadings(memberHeadingsData);

          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(
            `Error uploading ${csvMember.full_name}: ${(error as Error).message}`
          );
        }
      }

      setUploadResults({ success: successCount, error: errorCount, errors });
      setIsUploading(false);
      if (successCount > 0) {
        onSuccessAction();
      }
    };

    reader.readAsText(selectedFile);
  };

  // sample csv content to download sample csv
  const sampleCsvContent = useMemo(() => {
    const headers = [
      'code',
      'salutation',
      'full_name',
      'assoc_name',
      'id_member_type',
      'mobile',
      'assoc_mobile',
      'email',
      'aadhaar_no',
      'pan_no',
      'premise_type',
      'premise_unit_type',
      'flat_no',
      'build_name',
      'area',
      'area_unit',
      'add_premise',
      'principle_op_balance',
      'interest_op_balance',
      'interest_free_arrears',
    ]
      .concat(societyHeadings.map((h) => h.society_account_master?.code || ''))
      .join(',');

    const sampleRow = [
      'M001',
      'mr',
      'John Doe',
      'Mr. Doe',
      '1',
      '1234567890',
      '9876543210',
      'john.doe@example.com',
      '123456789012',
      'ABCDE1234F',
      'commercial',
      'flat',
      'A-101',
      'Building A',
      '1000',
      'sq_ft',
      '0',
      '5000',
      '1000',
      '500',
    ]
      .concat(societyHeadings.map((h) => h.amount.toString()))
      .join(',');

    return `${headers}\n${sampleRow}`;
  }, [societyHeadings]);

  // download sample csv
  const sampleCsvUrl = useMemo(() => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv' });
    return URL.createObjectURL(blob);
  }, [sampleCsvContent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Members</DialogTitle>
          <DialogDescription>
            Select a CSV file to upload members. Download the sample file for
            the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file-upload">CSV File</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          <div className="text-sm text-gray-500 mt-2">
            <a
              href={sampleCsvUrl}
              download="sample_members.csv"
              className="flex items-center text-blue-500 hover:underline"
            >
              <Download className="mr-1 h-4 w-4" />
              Download Sample CSV
            </a>
          </div>
        </div>

        {uploadResults.success > 0 || uploadResults.error > 0 ? (
          <div className="mt-4">
            <p>Upload Results:</p>
            <p>Successfully uploaded: {uploadResults.success}</p>
            <p>Errors: {uploadResults.error}</p>
            {uploadResults.errors.length > 0 && (
              <div className="mt-2">
                <p>Error Details:</p>
                <ul className="list-disc list-inside">
                  {uploadResults.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-500">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
