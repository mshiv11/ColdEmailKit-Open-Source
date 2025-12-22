import { getUrlHostname } from "@primoui/utils"
import { Link, Text } from "@react-email/components"
import { config } from "~/config"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

type EmailProps = EmailWrapperProps & {
  name?: string
}

const EmailWelcome = ({ name = "there", ...props }: EmailProps) => {
  const preview = `Welcome to ${config.site.name} – Your guide to the best cold email tools for sales outreach!`

  return (
    <EmailWrapper preview={preview} signature {...props}>
      <Text>Hi {name},</Text>

      <Text>{preview}</Text>

      <Text>
        {config.site.name} is more than just a platform – it's a community. Connect with like-minded
        software enthusiasts, share your favorite projects, and be part of the movement.
      </Text>

      <Text>Here's what you can do in {config.site.name}:</Text>

      <ul>
        <li>
          <Text className="m-0">
            <Link href={`${config.site.url}/latest`} className="underline font-medium">
              Explore Cold Email Tools
            </Link>{" "}
            – Browse existing projects curated by the community. We publish new projects every week.
          </Text>
        </li>

        <li>
          <Text className="m-0">
            <Link href={`${config.site.url}/submit`} className="underline font-medium">
              Share Your Projects
            </Link>{" "}
            – Get your project in front of thousands of software enthusiasts. It’s 100% free to
            submit.
          </Text>
        </li>

        <li>
          <Text className="m-0">
            <Link href={`${config.site.url}/advertise`} className="underline font-medium">
              Advertise on {config.site.name}
            </Link>{" "}
            – Choose one of the available options and promote your business or software on our
            website.
          </Text>
        </li>
      </ul>

      <Text>
        Jump in and start exploring:{" "}
        <Link href={config.site.url} className="underline font-medium">
          {getUrlHostname(config.site.url)}
        </Link>
      </Text>
    </EmailWrapper>
  )
}

export default EmailWelcome
