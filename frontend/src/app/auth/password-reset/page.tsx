import FormError from "@/app/auth/components/form-error"
import AuthLoyout from "@/app/auth/layout"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { passwordReset } from "@/lib/api"
import { passwordResetSchema } from "@/schema"
import { PasswordResetReqType } from "@/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle2, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useSearchParams } from "react-router-dom"
import CardWrapper from "../components/card-wrapper"
export const PasswordResetRoute = () => {

    const [searchParams] = useSearchParams()
    const verificationCode = searchParams.get("code") as string
    const expireDate = Number(searchParams.get("exp"))
    const now = Date.now()
    const isLinkValid = verificationCode && expireDate && expireDate > now
    console.log(isLinkValid)

    const [error, setError] = useState<string>()
    const {
        isPending,
        mutateAsync: passwordResetFn,
        isError,
        isSuccess
    } = useMutation({
        mutationKey: ["passwordReset", verificationCode, expireDate],
        mutationFn: passwordReset
    })

    const form = useForm({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: {
            verificationCode,
            password: ""
        }
    })

    const onSubmit = (data: PasswordResetReqType) => {
        passwordResetFn(data, {
            onError: ({ message }) => setError(message)
        })
    }

    return (
        <>
            {
                !isLinkValid || isError ?
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="flex items-center gap-3">
                            <TriangleAlert className="text-red-500 size-12" />
                            <p> The link either invalid or expaired.</p>
                        </div>
                        <Button variant={"link"} asChild >
                            <Link to={"/auth/password/forgot"}> Get a new link </Link>
                        </Button>
                    </div>
                    : isSuccess ?
                    <div className="flex flex-col">
                    <div className="bg-emerald-200 flex px-2 items-center gap-2 rounded-md text-white w-96 h-16 my-12 mx-auto">
                        <div className="">
                            <CheckCircle2 className="text-emerald-500 size-12" />
                        </div>
                        <div className="flex flex-col gap3">
                            <p className="text-xl text-emerald-800">Password change! Successfully </p>
                            <p className="text-sm text-black">login with the new password</p>
                        </div>
                    </div>
                        <Button size={"sm"} variant={"outline"} asChild className="w-96 mx-auto">
                                <Link to={"/auth/login"}> Login </Link>
                            </Button>
                    </div>
                    :
                    <AuthLoyout>
                        <CardWrapper
                            cardTitle="Change Password"
                            cardDescription="Enter your new password"
                            backButtonLabel="Home"
                            backButtonHref="/"
                        >
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} >
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="********"
                                                            disabled={isPending}
                                                            type="password"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {error && <FormError message={error} />}
                                        <Button className="w-full" disabled={isPending}>
                                            Reset Password
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardWrapper>
                    </AuthLoyout>
                  
            }
        </>
    )
}

