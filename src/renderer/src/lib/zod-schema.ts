import z from 'zod';

function sanitizeCustomerName(value: string) {
  // Remove or replace illegal characters for file systems
  return value.replace(/[\.<>:"/\\|?*]/g, '');
}

export const projectFormSchema = z.object({
  customerName: z
    .string()
    .transform(sanitizeCustomerName)
    .refine((value) => {
      return value.length > 0;
    }),
  contractNo: z.string().regex(/\d{6,}/),
  poNo: z.string().nonempty(),
  price: z.number().min(0),
  currency: z.string().nonempty(),
});
