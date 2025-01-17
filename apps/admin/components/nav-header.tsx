import { SidebarTrigger } from "@/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";

interface IBread {
  href: string;
  text: string;
  last?: boolean;
}

const NavHeader = ({ bread }: { bread: IBread[] }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-primary-foreground border-b mb-4">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="mr-6 z-50" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {bread.map((item) => (
          <>
            <Breadcrumb key={item?.text}>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={item.href}>{item?.text}</BreadcrumbLink>
                </BreadcrumbItem>
                {!item?.last && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        ))}
      </div>
    </header>
  );
};

export default NavHeader;
