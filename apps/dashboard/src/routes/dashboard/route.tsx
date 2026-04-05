import AppLogo from "@/shared/components/app-logo";
import UserMenu from "@/shared/components/user-menu";
import { authClient } from "@/shared/lib/auth";
import { IconHome, IconLogout } from "@tabler/icons-react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
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

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/auth/login",
        throw: true,
      });
    }

    return { session };
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

function RouteComponent() {
  const {
    location: { pathname },
  } = useRouterState();
  const navigate = useNavigate();

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
              ].map((item) => {
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
        <header className="sticky top-0 flex h-(--header-height) shrink-0 items-center justify-between gap-2 bg-background px-4">
          <div className="flex flex-1 flex-row items-center gap-2">
            <SidebarTrigger className="size-9" />
            <Separator
              className="mr-2 data-[orientation=vertical]:h-8"
              orientation="vertical"
            />
          </div>
          <UserMenu />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
