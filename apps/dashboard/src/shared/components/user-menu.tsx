import { authClient } from "@/shared/lib/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@tedx-2026/ui/components/avatar";
import { Skeleton } from "@tedx-2026/ui/components/skeleton";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session?.user) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <Avatar>
      <AvatarImage src={session.user.image ?? undefined} />
      <AvatarFallback>
        {session.user.name?.[0]?.toUpperCase() ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
}
