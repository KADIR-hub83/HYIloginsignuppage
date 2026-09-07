// // // React Imports
// // import React from 'react'
// // import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

// // // Component Imports
// // import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// // import { PhoneInput } from '@/components/ui/input-phone'

// // // lucide-react Imports
// // import { Asterisk } from 'lucide-react'

// // interface UserPhoneInputProps<FormType extends FieldValues> {
// //   form: UseFormReturn<FormType>
// //   name: Path<FormType>
// //   label: string
// //   placeholder: string
// //   mandatory?: boolean
// // }

// // export default function UserPhoneInput<FormType extends FieldValues>({
// //   form,
// //   name,
// //   label,
// //   placeholder,
// //   mandatory = false,
// // }: UserPhoneInputProps<FormType>) {
// //   return (
// //     <FormField
// //       control={form.control}
// //       name={name}
// //       render={({ field }) => (
// //         <FormItem className="w-full space-y-1.5">
// //           <FormLabel className="flex gap-0.5">
// //             {label}
// //             {mandatory && (
// //               <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
// //             )}
// //           </FormLabel>
// //           <FormControl>
// //             <PhoneInput {...field} placeholder={placeholder} defaultCountry="IN" />
// //           </FormControl>
// //           <FormMessage className="text-xs" isErrorPresent />
// //         </FormItem>
// //       )}
// //     />
// //   )
// // }


// // React Imports
// import React from 'react'
// import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

// // Component Imports
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { PhoneInput } from '@/components/ui/input-phone'

// // lucide-react Imports
// import { Asterisk } from 'lucide-react'

// interface UserPhoneInputProps<FormType extends FieldValues> {
//   form: UseFormReturn<FormType>
//   name: Path<FormType>
//   label: string
//   placeholder: string
//   mandatory?: boolean
// }

// const normalizePhoneNumber = (value: any): string => {
//   if (value === null || value === undefined || value === '') {
//     return ''
//   }

//   let phone = String(value).trim()

//   // Remove spaces, brackets, hyphens etc.
//   phone = phone.replace(/[^\d+]/g, '')

//   // Already valid international-style value
//   if (phone.startsWith('+')) {
//     return phone
//   }

//   // Example:
//   // 917760172353 -> +917760172353
//   if (phone.startsWith('91') && phone.length >= 12) {
//     return `+${phone}`
//   }

//   // 10 digit Indian mobile number
//   if (/^\d{10}$/.test(phone)) {
//     return `+91${phone}`
//   }

//   return phone
// }

// export default function UserPhoneInput<FormType extends FieldValues>({
//   form,
//   name,
//   label,
//   placeholder,
//   mandatory = false,
// }: UserPhoneInputProps<FormType>) {
//   return (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => {
//         const phoneValue = normalizePhoneNumber(field.value)

//         return (
//           <FormItem className="w-full space-y-1.5">
//             <FormLabel className="flex gap-0.5">
//               {label}

//               {mandatory && (
//                 <Asterisk
//                   strokeWidth={1.75}
//                   className="w-3.5 h-3.5 block -m-[3px] text-primary"
//                 />
//               )}
//             </FormLabel>

//             <FormControl>
//               <PhoneInput
//                 name={field.name}
//                 ref={field.ref}
//                 onBlur={field.onBlur}
//                 value={phoneValue}
//                 onChange={value => {
//                   field.onChange(value || '')
//                 }}
//                 placeholder={placeholder}
//                 defaultCountry="IN"
//               />
//             </FormControl>

//             <FormMessage className="text-xs" isErrorPresent />
//           </FormItem>
//         )
//       }}
//     />
//   )
// }







// React Imports
import React from 'react'
import {
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form'

// Component Imports
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { PhoneInput } from '@/components/ui/input-phone'

// lucide-react Imports
import { Asterisk } from 'lucide-react'

interface UserPhoneInputProps<
  FormType extends FieldValues,
> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  mandatory?: boolean
}

/**
 * Normalize phone values coming from API/database/form state.
 *
 * Examples:
 * 917760172353 -> +917760172353
 * 7760172353   -> +917760172353
 */
const normalizePhoneNumber = (
  value: unknown,
): string => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return ''
  }

  let phone = String(value).trim()

  // Remove spaces, brackets, hyphens, etc.
  phone = phone.replace(/[^\d+]/g, '')

  // Already international format
  if (phone.startsWith('+')) {
    return phone
  }

  // Indian number already containing country code
  if (
    phone.startsWith('91') &&
    phone.length >= 12
  ) {
    return `+${phone}`
  }

  // Standard 10-digit Indian mobile number
  if (/^\d{10}$/.test(phone)) {
    return `+91${phone}`
  }

  return phone
}

export default function UserPhoneInput<
  FormType extends FieldValues,
>({
  form,
  name,
  label,
  placeholder,
  mandatory = false,
}: UserPhoneInputProps<FormType>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const phoneValue =
          normalizePhoneNumber(field.value)

        return (
          <FormItem className="w-full space-y-1.5">
            <FormLabel className="flex gap-0.5">
              {label}

              {mandatory && (
                <Asterisk
                  strokeWidth={1.75}
                  className="block h-3.5 w-3.5 -m-[3px] text-primary"
                />
              )}
            </FormLabel>

            <FormControl>
              <PhoneInput
                name={field.name}
                value={phoneValue}
                onBlur={field.onBlur}
                onChange={value => {
                  field.onChange(value ?? '')
                }}
                placeholder={placeholder}
                defaultCountry="IN"
              />
            </FormControl>

            <FormMessage
              className="text-xs"
              isErrorPresent
            />
          </FormItem>
        )
      }}
    />
  )
}