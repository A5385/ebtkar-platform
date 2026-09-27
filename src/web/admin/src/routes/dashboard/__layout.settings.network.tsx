import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/__layout/settings/network')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/__layout/settings/network"!</div>
}
