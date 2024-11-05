import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type CrumbItem = {
  name: string;
  href: string;
};

type CrumbsProps = {
  crumbs: CrumbItem[];
};

export default function Crumbs({ crumbs }: CrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <div className="flex items-center gap-1.5" key={index}>
            {index !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
