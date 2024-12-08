import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { useNotifications } from "@/components/ui/notifications"
import { register } from "@/lib/api"
import { registerSchema } from "@/schema"
import { RegisterReqType } from "@/type"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CardWrapper from "../components/card-wrapper"
import FormSuccess from "../components/form-success"

export function RegisterRoute() {
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<boolean>(false)
  const navigate = useNavigate()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: register,
    mutationKey: ["login"],
    onError: (error) => console.log(error)
  })


  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: "",
      confirmPassword: ""
    },
  })

  const onSubmit = (data: RegisterReqType) => {
    console.log(data)
    mutateAsync(data, {
      onSuccess: ({ message }) => {
        setSuccess(true)
        useNotifications.getState().addNotification({
          type: "success",
          title: message
        },
        )
        navigate("/auth/login")
      },
      onError: ({ message }) => setError(message)
    })

  }

  return (
    <AuthLoyout>
      <CardWrapper
        cardTitle="Create Account"
        cardDescription="Enter your email below to create your account"
        backButtonLabel="Login"
        backButtonHref="/auth/login"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
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
              {success && <FormSuccess message="Email sent" />}
              <Button className="w-full" disabled={isPending}>
                Create account
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </AuthLoyout>
  )
}