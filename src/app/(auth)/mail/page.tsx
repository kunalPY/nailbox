

const MailPage = dynamic(() => import("@/app/mail/index"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})
import dynamic from "next/dynamic"
import Header from "@/app/mail/components/header"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-14">
        <MailPage />
      </div>
    </div>
  )
}
