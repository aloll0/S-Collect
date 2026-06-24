import { Check, EyeOff, X } from 'lucide-react';
import {
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useState,
} from 'react';

import { cn, getPasswordStrength } from './utils';

export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {children}
    </div>
  );
}

const inputBase =
  'w-full h-10 px-3 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-md ' +
  'outline-none transition-colors placeholder:text-gray-400 ' +
  'focus:border-gray-400 focus:ring-1 focus:ring-gray-200 ' +
  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-default';

const inputErrorCls =
  'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100';

export function TextInput({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={cn(inputBase, error ? inputErrorCls : '', className)}
      {...props}
    />
  );
}

export function TextAreaInput({
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-md ' +
          'outline-none transition-colors placeholder:text-gray-400 resize-none ' +
          'focus:border-gray-400 focus:ring-1 focus:ring-gray-200',
        error ? inputErrorCls : '',
        className
      )}
      {...props}
    />
  );
}

export function FieldWrap({
  label,
  required,
  error,
  helperText,
  helperRight,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  helperRight?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      {children}
      {error ? (
        <p className="mt-1 text-[12px] text-red-500">{error}</p>
      ) : helperText ? (
        <div className="flex justify-between mt-1">
          <p className="text-[11px] text-gray-400">{helperText}</p>
          {helperRight && (
            <p className="text-[11px] text-gray-400">{helperRight}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function PasswordInput({
  label,
  value,
  error,
  helperText,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  helperText?: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <FieldWrap
      label={label}
      error={error}
      helperText={error ? undefined : helperText}
    >
      <div className="relative">
        <TextInput
          type={show ? 'text' : 'password'}
          value={value}
          error={error}
          className="pr-10"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          onClick={() => setShow((v) => !v)}
        >
          <EyeOff size={15} />
        </button>
      </div>
    </FieldWrap>
  );
}

export function PasswordStrengthBar({
  password,
  error,
}: {
  password: string;
  error?: string;
}) {
  const strength = getPasswordStrength(password);
  const isGood = strength >= 4;
  const isWeak = strength >= 2 && strength < 4;

  if (!password) return null;

  const barColor = isGood ? 'bg-green-500' : 'bg-red-500';
  const barWidth = isGood ? '100%' : `${Math.min(strength * 20, 60)}%`;
  const label = isGood ? 'Good' : isWeak ? 'Weak' : '';
  const labelColor = isGood ? 'text-green-600' : 'text-red-500';

  return (
    <div className="mt-2">
      <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            barColor
          )}
          style={{ width: barWidth }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <p
          className={cn(
            'text-[11px]',
            error ? 'text-red-500' : 'text-gray-400'
          )}
        >
          Must contain at least 8 characters, one uppercase letter, and one
          number.
        </p>
        {label && (
          <p
            className={cn('text-[11px] font-medium ml-2 shrink-0', labelColor)}
          >
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

export function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 w-[280px] bg-white border border-green-200 rounded-lg shadow-md p-3 flex items-start gap-2">
      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
        <Check size={11} className="text-green-600 stroke-[3]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-green-700 leading-tight">
          {message}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-4">
          Changes have been saved and will be reflected in the marketplace
          within 2 minutes.
        </p>
      </div>
      <button
        type="button"
        aria-label="Close"
        className="shrink-0 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        <X size={13} />
      </button>
    </div>
  );
}
