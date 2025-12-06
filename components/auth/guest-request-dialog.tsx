"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  CalendarIcon,
  Loader2,
  Mail,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { clientService } from "@/lib/services/client-service";
import { guestService } from "@/lib/services/guests-service";

// ... (Schema stays the same) ...
const guestRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name required"),
  last_name: z.string().min(2, "Last name required"),
  phone: z.string().min(5, "Phone number required"),
  reason: z.string().min(5, "Please describe the items needed (min 10 chars)"),
  due_date: z.date(),
});

type GuestRequestFormValues = z.infer<typeof guestRequestSchema>;

function getEmailProviderLink(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();

  if (!domain) return null;

  if (domain.includes("gmail.com")) return "https://mail.google.com";
  if (
    domain.includes("outlook") ||
    domain.includes("hotmail") ||
    domain.includes("live")
  )
    return "https://outlook.live.com";
  if (domain.includes("yahoo")) return "https://mail.yahoo.com";
  if (domain.includes("proton") || domain.includes("pm.me"))
    return "https://mail.proton.me";
  if (domain.includes("icloud")) return "https://www.icloud.com/mail";

  return null;
}

export function GuestRequestDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<GuestRequestFormValues>({
    resolver: zodResolver(guestRequestSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: GuestRequestFormValues) => {
      setSubmittedEmail(values.email); // Save for display
      await guestService.submitGuestRequest(
        values.due_date,
        values.email,
        values.phone,
        values.first_name,
        values.last_name,
        values.reason
      );
    },
    onSuccess: () => {
      setStep("success");
      form.reset();
    },
    onError: (err) => {
      toast.error("Submission Failed", { description: err.message });
    },
  });

  function onSubmit(data: GuestRequestFormValues) {
    mutation.mutate(data);
  }

  // Reset state when closing dialog
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setStep("form"), 300); // Reset after animation
    }
  };

  const emailLink = getEmailProviderLink(submittedEmail);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 cursor-pointer">
          Make a Guest Request
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {/* --- STEP 1: THE FORM --- */}
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Guest Equipment Request</DialogTitle>
              <DialogDescription>
                Need gear but don't have an account? Fill out this form.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+123..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                "cursor-pointer",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            autoFocus={true}
                            required={true}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I need a Sony A7III kit..."
                          className="resize-none h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Request
                </Button>
              </form>
            </Form>
          </>
        )}

        {/* --- STEP 2: THE SUCCESS POPUP --- */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <Mail className="h-8 w-8" />
            </div>

            <DialogHeader className="space-y-2 flex items-center">
              <DialogTitle className="text-2xl">One Last Step!</DialogTitle>
              <DialogDescription className="text-base max-w-xs mx-auto">
                We've sent a verification email to <br />
                <span className="font-medium text-foreground">
                  {submittedEmail}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground w-full">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p>
                  Your request has been saved, but it will <strong>not</strong>{" "}
                  be visible to admins until you verify your email address. <br /> <strong>Ignore</strong> this if you have already verified your emai.
                </p>
              </div>
            </div>

            <DialogFooter className="w-full pt-4 grid grid-cols-2 gap-3">
              {emailLink ? (
                <>
                  <Button
                    onClick={() => window.open(emailLink, "_blank")}
                    className="w-full cursor-pointer"
                  >
                    Open{" "}
                    {submittedEmail.split("@")[1] === "gmail.com"
                      ? "Gmail"
                      : "Inbox"}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="w-full gap-2 cursor-pointer"
                  >
                    Close
                  </Button>
                </>
              ) : (
                /* OPTION B: Fallback (If corporate/unknown) */
                <Button onClick={() => setOpen(false)} className="w-full cursor-pointer">
                  Okay, I'll check my inbox
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
