import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageTitle } from "../components/PageTitle";
import { SubscribeEmailForm } from "./SubscribeEmailForm";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { env } from "~/env";
import { ExternalLinkIcon } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageTitle>Contact</PageTitle>
      <div className="m-auto grid max-w-md grid-cols-1 items-stretch justify-start gap-4 p-4 desktop:mt-4 desktop:max-w-4xl desktop:grid-cols-2">
        <SubscribeNewsletterCard />
        <FormLinkCard />
      </div>
    </>
  );
}

function FormLinkCard() {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="gap-2">
        <CardTitle>Message our volunteers</CardTitle>
        <CardDescription className="text-stone-700">
          Send us a message if you&apos;d like to discuss volunteering or would
          like to offer up a suggestion.
        </CardDescription>
        <CardDescription className="text-stone-700">
          The following button will open a form where you can easily send us an
          email. Our volunteers will respond as soon as they can!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={env.GOOGLE_CONTACT_FORM_URL} target="_blank">
          <Button className="w-full">
            Send a message&nbsp;&nbsp;&nbsp;
            <ExternalLinkIcon />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function SubscribeNewsletterCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get the newsletter</CardTitle>
        <CardDescription className="max-w-sm text-stone-700">
          Enter your email to subscribe to our monthly newsletter and hear about
          upcoming dances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubscribeEmailForm />
      </CardContent>
    </Card>
  );
}
