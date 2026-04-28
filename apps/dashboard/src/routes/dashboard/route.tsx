import AppLogo from "@/shared/components/app-logo";
import UserMenu from "@/shared/components/user-menu";
import { authClient } from "@/shared/lib/auth";
import { canAccess, RESOURCES } from "@/shared/lib/permissions";
import {
  IconDatabase,
  IconHome,
  IconLogout,
  IconPackage,
  IconQrcode,
  IconShoppingBag,
} from "@tabler/icons-react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tedx-2026/ui/components/select";
import { Separator } from "@tedx-2026/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@tedx-2026/ui/components/sidebar";
import { useTheme } from "@tedx-2026/ui/components/theme-provider";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/auth/login",
      });
    }

    return { user: session.data.user };
  },
  loader: ({ location }) => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      redirect({
        to: "/dashboard/home",
        throw: true,
      });
    }
  },
});

const selectThemeItems = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

function RouteComponent() {
  const {
    location: { pathname },
  } = useRouterState();
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const { user } = Route.useRouteContext();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-16 justify-center">
          <Link className="flex items-center gap-2 font-bold text-xl" to="/">
            <AppLogo />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {[
                {
                  label: "Home",
                  to: "/dashboard/home",
                  icon: IconHome,
                },
                {
                  label: "Attendance",
                  to: "/dashboard/attendance",
                  icon: IconQrcode,
                  requiredResource: RESOURCES.ATTENDANCE,
                },
                {
                  label: "Orders",
                  to: "/dashboard/orders",
                  icon: IconShoppingBag,
                  requiredResource: RESOURCES.ORDER,
                },
                {
                  label: "Products",
                  to: "/dashboard/products",
                  icon: IconPackage,
                  requiredResource: RESOURCES.PRODUCT,
                },
                {
                  label: "Storage",
                  to: "/dashboard/storage",
                  icon: IconDatabase,
                  requiredResource: RESOURCES.STORAGE,
                },
              ]
                .filter((item) =>
                  item.requiredResource
                    ? canAccess(user.role, item.requiredResource)
                    : true
                )
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(item.to)}
                        render={<Link preload="render" to={item.to} />}
                        size="default"
                      >
                        <Icon /> {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        navigate({
                          to: "/",
                        });
                      },
                    },
                  });
                }}
                size="default"
              >
                <IconLogout /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="[--header-height:4rem]">
        <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center justify-between gap-2 bg-background px-4">
          <div className="flex flex-1 flex-row items-center gap-2">
            <SidebarTrigger className="size-9" />
            <Separator
              className="mr-2 data-[orientation=vertical]:h-8"
              orientation="vertical"
            />
          </div>
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-row items-center gap-2">
              <span className="font-medium text-muted-foreground text-sm">
                Theme
              </span>
              <Select
                items={selectThemeItems}
                onValueChange={(value) => {
                  if (value === null) {
                    return;
                  }

                  setTheme(value);
                }}
                value={theme}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectThemeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <UserMenu />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
