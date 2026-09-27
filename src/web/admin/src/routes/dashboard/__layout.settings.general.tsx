import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/__layout/settings/general')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/settings/general"!</div>
}
