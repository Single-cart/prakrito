import NavHeader from "@/components/nav-header";

const bread = [
  {
    href: "/",
    text: "Dashboard",
    last: true,
  },
];

export default function Page() {
  return (
    <div className="">
      <NavHeader bread={bread} />
    </div>
  );
}
