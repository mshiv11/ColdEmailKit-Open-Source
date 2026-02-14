import DodoPayments from "dodopayments"
import { env } from "~/env"

// Use live mode for production, test_mode for development
const isProduction = process.env.NODE_ENV === "production"

export const dodo = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: isProduction ? "live_mode" : "test_mode",
})
