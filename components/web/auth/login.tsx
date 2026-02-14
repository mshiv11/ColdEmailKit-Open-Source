import { LoginForm } from "~/components/web/auth/login-form"

import { Stack } from "~/components/common/stack"

export const Login = () => {
  return (
    <Stack direction="column" className="items-stretch w-full">
      <LoginForm />
    </Stack>
  )
}

