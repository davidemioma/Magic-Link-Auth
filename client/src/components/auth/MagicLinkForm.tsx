import { ZodError } from "zod";
import { toast } from "sonner";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api, authUserQueryOptions } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  token: string | undefined;
};

const MagicLinkForm = ({ token }: Props) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-magic-link", token],
    mutationFn: async () => {
      if (!token) {
        toast.error("Invalid token!");

        return;
      }

      const res = await api.auth["verify-magic-link"].$patch({
        json: { token },
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.error);
      }

      return res;
    },
    onSuccess: (res) => {
      if (res?.ok) {
        toast.success(
          "Email has been verified. Redirecting to settings page...",
        );

        queryClient.invalidateQueries({
          queryKey: [authUserQueryOptions.queryKey],
        });

        navigate({ to: "/settings" });
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

  const verify = useCallback(() => {
    mutate();
  }, [token]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/sign-in"
    >
      <div className="flex w-full items-center justify-center">
        {isPending && <BeatLoader />}
      </div>
    </CardWrapper>
  );
};

export default MagicLinkForm;
