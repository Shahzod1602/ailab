import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "sm";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-text text-bg hover:bg-white border border-text",
  secondary:
    "bg-surface text-text border border-border-2 hover:bg-surface-2 hover:border-text-mute",
  ghost:
    "bg-transparent text-text-dim border border-transparent hover:text-text hover:bg-surface",
  danger:
    "bg-transparent text-red border border-red/40 hover:bg-red/10 hover:border-red",
};

const buttonSizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>(function Button(
  { variant = "primary", size = "default", className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim()}
      {...props}
    />
  );
});

const fieldClass =
  "w-full rounded-md bg-bg-2 border border-border text-text placeholder:text-text-mute focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${fieldClass} h-11 px-3.5 text-sm ${className}`.trim()}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${fieldClass} px-3.5 py-3 text-sm leading-relaxed min-h-28 resize-y ${className}`.trim()}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`${fieldClass} h-11 px-3.5 text-sm appearance-none bg-no-repeat ${className}`.trim()}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3e%3cpath stroke='%23B7B1B1' stroke-width='1.5' fill='none' d='M3 4.5L6 7.5L9 4.5'/%3e%3c/svg%3e\")",
          backgroundPosition: "right 0.85rem center",
          paddingRight: "2.4rem",
        }}
        {...props}
      >
        {children}
      </select>
    );
  },
);

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block mb-1.5 text-sm font-medium text-text">
      {children}
      {hint && <span className="ml-2 text-xs font-normal text-text-mute">{hint}</span>}
    </label>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-bg-2 ${className}`.trim()}>
      {children}
    </div>
  );
}

const STATUS_META: Record<string, { label: string; dot: string; text: string }> = {
  PENDING: { label: "Pending", dot: "bg-amber", text: "text-amber" },
  APPROVED: { label: "Approved", dot: "bg-green", text: "text-green" },
  REJECTED: { label: "Rejected", dot: "bg-red", text: "text-red" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    dot: "bg-text-mute",
    text: "text-text-mute",
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-0.5 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <span className={meta.text}>{meta.label}</span>
    </span>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-text-dim">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-12 text-center">
      <h3 className="text-base font-medium">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-text-dim max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6 inline-block">{action}</div>}
    </Card>
  );
}

// Backwards-compat: legacy components that no longer exist with style; kept as no-ops or simple aliases.
export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <Card className={className}>{children}</Card>;
}

export function HexId({ value }: { prefix?: string; value: string; className?: string }) {
  return (
    <span className="font-mono text-xs text-text-mute">
      {value.slice(-8)}
    </span>
  );
}

export function Bracket({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-text-mute uppercase tracking-wide">{children}</span>;
}

export function SectionTitle({
  title,
  meta,
}: {
  prefix?: string;
  title: string;
  meta?: string;
  glitchKey?: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {meta && <p className="text-xs text-text-mute mt-1">{meta}</p>}
    </div>
  );
}
