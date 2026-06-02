"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/app/actions/contact";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    setErrorMsg("");
    const result = await submitContactForm(data);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4 rounded-xl p-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} className="mt-1" />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} className="mt-1" />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="service">Service Interest</Label>
        <Input id="service" {...register("service")} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register("message")} className="mt-1" rows={5} />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
      {status === "success" && (
        <p className="text-center text-sm text-green-500">Thank you! We&apos;ll be in touch soon.</p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-500">{errorMsg}</p>
      )}
    </form>
  );
}
