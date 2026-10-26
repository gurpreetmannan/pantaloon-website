import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { STORE } from "@/lib/store";
import { saveNewEnquiry } from "@/lib/analytics";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  contact: z
    .string()
    .trim()
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^[+\d][\d\s-]{8,15}$/.test(v), "Enter a valid phone number or email"),
  category: z.string().min(1, "Choose a category"),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000),
});

type Values = z.infer<typeof schema>;

export function EnquiryForm() {
  const [sent, setSent] = useState<Values | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Values) => {
    saveNewEnquiry({
      name: data.name,
      contact: data.contact,
      category: data.category,
      message: data.message,
    });
    setSent(data);
  };

  if (sent) {
    return (
      <div className="border border-border bg-background p-8 rounded-2xl shadow-sm" role="status">
        <h3 className="font-display text-2xl sm:text-3xl text-foreground">Thank you, {sent.name}.</h3>
        <p className="mt-3 text-sm text-stone-600 leading-relaxed">
          Your enquiry has been received and registered at the Amritsar branch store desk. For immediate assistance, feel free to call our store directly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={STORE.tel} className="btn-primary text-xs">Call {STORE.phoneDisplay}</a>
          <button className="btn-outline text-xs" onClick={() => { setSent(null); reset(); }}>Submit Another Enquiry</button>
        </div>
      </div>
    );
  }

  const field = "w-full border-b border-foreground/30 bg-transparent py-3 outline-none focus:border-foreground";
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6 border border-border bg-background p-8 rounded-2xl shadow-sm">
      <div>
        <label htmlFor="name" className="text-xs uppercase tracking-[0.2em]">Name</label>
        <input id="name" className={field} aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="contact" className="text-xs uppercase tracking-[0.2em]">Phone or email</label>
        <input id="contact" className={field} aria-invalid={!!errors.contact} {...register("contact")} />
        {errors.contact && <p className="mt-1 text-sm text-destructive">{errors.contact.message}</p>}
      </div>
      <div>
        <label htmlFor="category" className="text-xs uppercase tracking-[0.2em]">Enquiry category</label>
        <select id="category" className={field} defaultValue="" aria-invalid={!!errors.category} {...register("category")}>
          <option value="" disabled>Select…</option>
          <option>General enquiry</option>
          <option>Collections & styles</option>
          <option>Store visit & timings</option>
          <option>Feedback</option>
        </select>
        {errors.category && <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="text-xs uppercase tracking-[0.2em]">Message</label>
        <textarea id="message" rows={4} className={field} aria-invalid={!!errors.message} {...register("message")} />
        {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
      </div>
      <p className="text-xs text-muted-foreground">Privacy: your details are used only to respond to this enquiry and are not shared or stored for marketing.</p>
      <button type="submit" className="btn-primary">Send Enquiry</button>
    </form>
  );
}
