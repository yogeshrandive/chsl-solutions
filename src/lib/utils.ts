import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';
import { format, parse } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFinancialYearEndDate() {
  const today = moment();
  const currentYear = today.year();
  const financialYearEnd =
    today.month() >= 3 // If current month is April (3) or later
      ? moment({ year: currentYear + 1, month: 2, day: 31 }) // March 31 of the next year
      : moment({ year: currentYear, month: 2, day: 31 }); // March 31 of the current year

  return financialYearEnd;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatDbDate(dateString: any): string {
  let formatedDate = '';

  if (dateString && typeof dateString === 'string') {
    // Assuming the input date is in the format 'MM/dd/yyyy'
    // If your input format is different, adjust the parse format string accordingly
    const parsedDate = parse(dateString, 'mm-dd-yyyy', new Date());
    formatedDate = format(parsedDate, 'yyyy-MM-dd');
  }

  return formatedDate;
}

export function formatDate(dateString: string) {
  return moment(dateString).format('DD MMM YY');
}
export function formatDateRange(from: string, to: string) {
  const fromDate = formatDate(from);
  const toDate = formatDate(to);
  return `${fromDate} - ${toDate}`;
}

export function formatDateForInput(date: Date): string {
  return moment(date).format('DD-MM-YYYY');
}

export function parseDateFromInput(dateString: string): Date | null {
  const parsed = moment(dateString, 'DD-MM-YYYY', true);
  return parsed.isValid() ? parsed.toDate() : null;
}

export function isValidDate(dateString: string): boolean {
  return moment(dateString, 'DD-MM-YYYY', true).isValid();
}
