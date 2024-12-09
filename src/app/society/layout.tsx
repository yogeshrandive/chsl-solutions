export default function SocietyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-10 flex flex-col flex-1  w-full">{children}</div>;
}
