import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/__layout/verify-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/__layout/verify-email"!</div>
}
