import { Outlet, createRootRoute } from '@tanstack/react-router';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import '@repo/web-ui/globals.css';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
