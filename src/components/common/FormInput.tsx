import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, fullWidth = true, className = '', ...rest }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`mb-4 ${widthClass}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            px-3 py-2 bg-white border shadow-sm border-gray-300 
            placeholder-gray-400 focus:outline-none focus:border-blue-500 
            focus:ring-blue-500 block rounded-md sm:text-sm focus:ring-1
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${widthClass}
            ${className}
          `}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;