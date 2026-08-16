import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/__layout")({
  //   beforeLoad: () => {
  //     if (!authenticate) {
  //       throw redirect({ to: "/auth/login" });
  //     }
  //   },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Outlet />
    </main>
  );
}
