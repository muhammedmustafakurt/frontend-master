import Header from "@/components/header";

export default function AppGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header/>
      {children}
    </div>
  );
}
