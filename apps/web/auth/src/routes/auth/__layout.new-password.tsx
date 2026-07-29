import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/__layout/new-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/__layout/new-password"!</div>
}
