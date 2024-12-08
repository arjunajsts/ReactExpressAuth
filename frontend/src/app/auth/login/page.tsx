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

import { login } from "@/lib/api"
import { loginSchema } from "@/schema"
import { LoginReqType } from "@/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import CardWrapper from "../components/card-wrapper"
import FormError from "../components/form-error"
import AuthLoyout from "../layout"
import { useNotifications } from "@/components/ui/notifications"

export function LoginRoute() {

  const [error, setError] = useState<string>()
  const navigate = useNavigate()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    onError: (error) => console.log(error)
  })


  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'arjuna@gmail.com',
      password: "123456"
    },
  })

  const onSubmit = (data:LoginReqType) => {
    mutateAsync(data, {
      onSuccess: ({message}) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: message
        })
        navigate("/dashboard")
      },
      onError: (error) => setError(error.message)
    })
  }



  return (
    <AuthLoyout>
      <CardWrapper
        cardTitle="Welcome back"
        cardDescription="Enter email & password to continue"
        backButtonHref="/auth/register"
        backButtonLabel="Create account"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="space-y-6">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
              <FormError message={error} />
              <Button className="w-full" disabled={isPending}>
                Log in
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </AuthLoyout>
  )
}
