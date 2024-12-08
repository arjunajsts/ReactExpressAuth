import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { verifyEmail } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2Icon, TriangleAlert } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export const VerifyEmailRoute = () => {

  const { code } = useParams()

  const {
    isPending, isSuccess, isError
  } = useQuery({
    queryKey: ["emailverification", code],
    queryFn: () => verifyEmail(code)
  })

  if (isPending) return <div className="h-screen w-screen  flex items-center justify-center">
    <Spinner size="xl" />
  </div>

  return (
    <div className="">
      {isPending ?
        <div className="h-screen w-screen  flex items-center justify-center">
          <Spinner size="xl" />
        </div>
        : <>
          {
            isError &&
            <div className="flex flex-col items-center justify-center py-24">
              <div className="flex items-center gap-3">
                <TriangleAlert className="text-red-500 size-12" />
                <p> The link either invalid or expaired.</p>
              </div>
              <Button variant={"link"} asChild >
               <Link to={"/auth/register"}> Get a new link </Link>
              </Button>
            </div>
          }
          {
            isSuccess &&
            <div className="flex flex-col items-center justify-center py-24">
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-green-500 size-12" />
                <p>Email verified Successfully</p>
              </div>
              <Button variant={"link"} asChild >
                <Link to={"/auth/login"}> Login </Link>
              </Button>
            </div>
          }
        </>
      }
      <div className="flex justify-center">
      <Button variant={"outline"} asChild >
        <Link to={"/"}> Back to home </Link>
      </Button>
       </div>
    </div>

  )
}

