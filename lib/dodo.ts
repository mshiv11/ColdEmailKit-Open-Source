import DodoPayments from "dodopayments"
import { env } from "~/env"

export const dodo = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.NODE_ENV === "production" ? "live" : "test_mode",
})
