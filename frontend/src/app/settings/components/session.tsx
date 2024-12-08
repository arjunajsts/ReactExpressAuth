import { useNotifications } from "@/components/ui/notifications"
 import { sessionDelete } from "@/lib/api"
import { cn } from "@/lib/utils"
import { session } from "@/type"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sessionsQueryKey } from "../page"

type Props = {
    session: session
}
const Session = ({ session }: Props) => {
   const queryClient = useQueryClient()
 const {addNotification}  = useNotifications()
  const {mutateAsync:sessionDeleteFn} =  useMutation({
        mutationKey:["mutation",session._id],
        mutationFn:sessionDelete,
        onSuccess:({message})=>{
            addNotification({
                type:"success",
                title:message
            })
            queryClient.invalidateQueries({queryKey:[sessionsQueryKey]})
        }
    })

    return (
        <div className={cn("flex flex-col border p-2 rounded-md mb-2 w-1/2",session.isCurrent && "bg-emerald-50")} >
            <span className="w-5/6">
                {new Date(session.createdAt).toLocaleString("us-en")}
                {session.isCurrent && "(current session)"}
            </span>
            <div className="flex justify-between">
            <p className="text-muted-foreground text-sm">{session.userAgent}</p>
             {
              !session.isCurrent && <Cross2Icon className="text-red-500 font-bold size-5 cursor-pointer" onClick={()=>sessionDeleteFn(session._id)}/> 
             }
            </div>
        </div>
    )
}

export default Session