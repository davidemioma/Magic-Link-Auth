import { createFileRoute } from "@tanstack/react-router";
import MagicLinkForm from "@/components/auth/MagicLinkForm";

export const Route = createFileRoute("/auth/magic-link")({
  component: () => {
    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const token = params.get("token") || undefined;

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <MagicLinkForm token={token} />
      </div>
    );
  },
});
