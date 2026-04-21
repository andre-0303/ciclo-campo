import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/cn";

type FieldShellProps = {
  label: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function FieldShell({
  label,
  helperText,
  error,
  children,
  className,
}: FieldShellProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-label">{label}</span>
      <div className="relative">{children}</div>
      {(helperText || error) && (
        <span
          className={cn(
            "text-sm transition-all animate-in fade-in slide-in-from-top-1",
            error ? "text-amber-800 font-medium" : "text-on-surface-variant",
          )}
        >
          {error ?? helperText}
        </span>
      )}
    </label>
  );
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  error?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, helperText, error, className, ...props }, ref) => {
    return (
      <FieldShell label={label} helperText={helperText} error={error}>
        <div className="field-shell">
          <input
            ref={ref}
            className={cn(
              "field-input border-none focus:outline-none focus:ring-0 p-0 m-0 placeholder:text-on-surface-variant/40",
              className
            )}
            {...props}
          />
        </div>
      </FieldShell>
    );
  },
);

InputField.displayName = "InputField";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  helperText?: string;
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      options,
      defaultValue,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(
      value || defaultValue || (options.length > 0 ? options[0].value : ""),
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    const selectedOption = options.find((opt) => opt.value === selected);

    useEffect(() => {
      if (value !== undefined) setSelected(value as string);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          if (onBlur && hiddenSelectRef.current) {
            onBlur({
              target: hiddenSelectRef.current,
              currentTarget: hiddenSelectRef.current,
            } as any);
          }
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur]);

    const handleSelect = (val: string) => {
      setSelected(val);
      setIsOpen(false);

      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = val;
        // Dispatch real event for react-hook-form
        const event = new Event("change", { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(event);

        if (onChange) {
          onChange({
            target: hiddenSelectRef.current,
            currentTarget: hiddenSelectRef.current,
          } as any);
        }
      }
    };

    return (
      <FieldShell
        label={label}
        helperText={helperText}
        error={error}
        className={className}
      >
        <div ref={containerRef} className="relative">
          {/* TRIGGER */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "field-shell flex cursor-pointer items-center justify-between transition-all outline-none",
              isOpen &&
                "bg-surface-container-lowest ring-4 ring-primary/8 -translate-y-px",
            )}
          >
            <span
              className={cn(
                "text-sm transition-colors",
                !selected && "text-on-surface-variant/60",
              )}
            >
              {selectedOption?.label || "Selecione..."}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-on-surface-variant/60 transition-transform duration-300 ease-out",
                isOpen && "rotate-180",
              )}
            />
          </div>

          {/* HIDDEN NATIVE SELECT FOR FORM COMPATIBILITY */}
          <select
            ref={(node) => {
              (hiddenSelectRef as any).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as any).current = node;
            }}
            className="sr-only"
            value={selected}
            onChange={(e) => handleSelect(e.target.value)}
            onBlur={onBlur}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* CUSTOM DROPDOWN */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-ambient-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-60 overflow-y-auto p-2 scrollbar-none">
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm transition-all",
                      option.value === selected
                        ? "bg-tertiary-container text-on-primary font-bold shadow-sm"
                        : "text-on-surface hover:bg-surface-container-low",
                    )}
                  >
                    {option.label}
                    {option.value === selected && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </FieldShell>
    );
  },
);

SelectField.displayName = "SelectField";
