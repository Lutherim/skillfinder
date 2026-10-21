import { formatPrice } from "@/lib/utils";
import type { Service } from "@/lib/types";

// children = optional extra content (e.g. a Delete button)
export const ServiceCard = ({ service, children }: { service: Service; children?: React.ReactNode }) => (
  <div className="card">
    <div className="flex items-start justify-between gap-3">
      <h3 className="text-lg font-bold">{service.title}</h3>
      <span className="font-medium">{formatPrice(service.price)}</span>
    </div>
    {service.profiles && (
      <p className="text-sm text-[#7A6B69]">
        {[service.profiles.full_name, service.profiles.trade, service.profiles.city].filter(Boolean).join(" · ")}
      </p>
    )}
    {service.description && <p className="mt-1 text-sm">{service.description}</p>}
    {children && <div className="mt-2">{children}</div>}
  </div>
);
