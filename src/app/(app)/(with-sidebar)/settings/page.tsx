import { requireAuth } from "@/lib/auth/guards";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { PLANS, type PlanId } from "@/lib/plans";
import { DeleteAccountCard } from "./_components/delete-account-card";

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SettingsPage() {
  const session = await requireAuth();
  const { user } = session;
  const planConfig = PLANS[user.plan as PlanId] ?? PLANS.free;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Your account information.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-lg border border-border">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-lg text-lg">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <ProfileField label="Plan">
            <Badge variant="outline">{planConfig.label}</Badge>
          </ProfileField>
          <ProfileField label="Credits">
            {user.credits}
          </ProfileField>
          <ProfileField label="Member since">
            {formatDate(user.createdAt)}
          </ProfileField>
        </div>
      </div>

      <DeleteAccountCard userEmail={user.email} />
    </div>
  );
}
