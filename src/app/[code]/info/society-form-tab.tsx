'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SOCIETY_FORM_STEPS } from '@/lib/constants';

export function SocietyFormTabs(props: {
  currentStep: number;
  formStep: number;
}) {
  const params = useParams();
  const societyCode = params.code as string;
  const pathName = usePathname();

  return (
    <div className="mb-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {SOCIETY_FORM_STEPS.map((step, index) => {
            const isActive = props.formStep == index + 1;
            const isDisabled = props.currentStep < index + 1;
            return (
              <Link
                key={step.action}
                href={
                  isDisabled
                    ? '#'
                    : pathName == '/society/create'
                      ? '/society/create'
                      : `/${societyCode}/info/${step.action}`
                }
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                  }
                }}
              >
                {step.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
