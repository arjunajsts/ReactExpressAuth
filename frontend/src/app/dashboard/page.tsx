import { useAuth } from "@/hooks/useAuth"

export const DashboardRoute = () => {
  const { user } = useAuth()
  const date = new Date(user?.createdAt ?? Date.now()).toLocaleString()
  return (
    <div className="flex justify-center p-3">
      <div className="">
        <h1 className="font-bold">My Account</h1>
        <p>Create on : {date}</p>
      </div>
    </div>
  )
}

