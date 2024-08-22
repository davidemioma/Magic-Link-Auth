import { ZodError } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginValidator } from "../../../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const LoginForm = () => {
  const form = useForm<LoginValidator>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (values: LoginValidator) => {
      const res = await api.auth.login.$post({ json: values });

      if (!res.ok) {
        const data = await res.json();

        toast.error(data.error);

        return;
      }

      return res;
    },
    onSuccess: async (res) => {
      if (res?.ok) {
        const data = await res.json();

        toast.success(data.message);
      }
    },
    onError: (err) => {
      if (err instanceof ZodError) {
        toast.error(err.issues.map((issues) => issues.message).join(" ,"));
      } else {
        toast.error(err.message);
      }
    },
  });

  const onSubmit = (values: LoginValidator) => {
    mutate(values);
  };

  return (
    <CardWrapper headerLabel="Welcome back" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.doe@example.com"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="flex w-full items-center justify-center"
            type="submit"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
