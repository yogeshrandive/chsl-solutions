export const formatDateForDisplay = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

export const formatDateForSupabase = (dateString: string): string => {
  const [day, month, year] = dateString.split('/').map(Number)
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}