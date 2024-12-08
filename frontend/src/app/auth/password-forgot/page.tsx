
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AuthLoyout from "../layout"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordForgotSchema } from "@/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation } from "@tanstack/react-query"
import { passwordForgot } from "@/lib/api"
import { PasswordForgotReqType } from "@/type"
import { useNotifications } from "@/components/ui/notifications"
import { CheckCircle2 } from "lucide-react"

export function PasswordForgot() {

    const { mutateAsync: passwordForgotFn, isPending, isSuccess } = useMutation({
        mutationKey: ["passwordreset"],
        mutationFn: passwordForgot
    })

    const form = useForm({
        resolver: zodResolver(passwordForgotSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = (values: PasswordForgotReqType) => {
        passwordForgotFn(values, {
            onSuccess: (data) => {
         console.log(data)
                useNotifications.getState().addNotification({
                    type: "success",
                    title: "message"
                })
            }

        })
    }
    return (
        <>
            {
                !isSuccess ?

                    <AuthLoyout>
                        <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 rounded-md w-96">
                            <div className="mx-auto max-w-md text-center">
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground pb-2">Reset Password</h1>
                                    <p className="text-muted-foreground text-sm">Enter your email address to reset your password and get started.</p>
                                </div>
                                <Form {...form} >
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="john.doe@example.com"
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full">
                                            Reset Password
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                        <div className="flex justify-center py-2 ">
                            <Button size={"sm"} variant={"outline"} asChild className="w-96">
                                <Link to={"/auth/login"}> Back to login </Link>
                            </Button>
                        </div>
                    </AuthLoyout>
                    : <div className="bg-emerald-200 flex px-2 items-center gap-2 rounded-md text-white w-96 h-16 my-12 mx-auto">
                        <div className="">
                            <CheckCircle2 className="text-emerald-500 size-12" />
                        </div>
                        <div className="flex flex-col gap3">
                            <p className="text-xl text-emerald-800">Email sent.! Successfully </p>
                            <p className="text-sm text-black">Check your inbox for further instruction</p>
                        </div>
                    </div>
            }

        </>

    )
}