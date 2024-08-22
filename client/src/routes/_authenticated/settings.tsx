import { ZodError } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Display from "@/components/Display";
import { BeatLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, authUserQueryOptions } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { userRole } from "../../../../server/db/schema";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SettingsValidator, SettingsSchema } from "../../../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  component: () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useQuery(authUserQueryOptions);

    if (isLoading) {
      return (
        <div className="flex w-40 items-center justify-center p-4">
          <BeatLoader />
        </div>
      );
    }

    if (error) {
      return <Display />;
    }

    const form = useForm<SettingsValidator>({
      resolver: zodResolver(SettingsSchema),
      defaultValues: {
        name: user?.name || undefined,
        email: user?.email || undefined,
        role: user?.role || undefined,
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["save-settings"],
      mutationFn: async (values: SettingsValidator) => {
        const res = await api.user["update-settings"].$patch({ json: values });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        return res;
      },
      onSuccess: (res) => {
        if (res.ok) {
          if (res.status === 202) {
            toast.success("Confirmation link has been sent to your new email");
          } else {
            toast.success("Settings updated");
          }

          form.reset();

          queryClient.invalidateQueries({
            queryKey: [authUserQueryOptions.queryKey],
          });
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

    const onSubmit = (values: SettingsValidator) => {
      mutate(values);
    };

    return (
      <ProtectedLayout>
        <Card className="mb-10 w-full max-w-[600px]">
          <CardHeader>
            <p className="text-center text-2xl font-semibold">⚙️ Settings</p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
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

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>

                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {userRole.enumValues.map((role) => (
                              <SelectItem value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button disabled={isPending} type="submit">
                  Save
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </ProtectedLayout>
    );
  },
});
