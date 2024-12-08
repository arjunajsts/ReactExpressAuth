import { Spinner } from "@/components/ui/spinner"
import { sessions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import Session from "./components/session";

export const sessionsQueryKey = 'sessions'
export const SettingsRoute = () => {

    const { data, isLoading } = useQuery({
        queryKey: [sessionsQueryKey],
        queryFn: sessions,
    });

    if (isLoading) return <Spinner />
    return (
        <div>
            <div className="flex flex-col items-center py-12">
                <p className="text-xl font-bold py-2 mb-1">My Session :</p>
                {data?.map(session => (
                    <Session key={session._id} session={session} />
                ))}
            </div>
        </div>
    )
}

