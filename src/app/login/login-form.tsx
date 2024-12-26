"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "./actions";
import { LoginFormSchema } from "./definitions";
// import { useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";

type FormValues = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
  const [formState, formAction, isFormLoading] = useActionState(
    login,
    undefined,
  );
  // const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const onSubmit = async (data: FormData) => {
  //   setIsLoading(true);
  //   await formAction(data);
  //   setIsLoading(false);
  // };

  return (
    <Card className="w-full h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm flex flex-col justify-center">
      <CardHeader className="space-y-1 pb-8">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-base text-gray-500">
            Enter your credentials to access the dashboard
          </CardDescription>
        </div>
        {formState?.message && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="flex flex-col justify-center">
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-700 block mb-1">
                    Email Address
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="user@company.com"
                          {...field}
                          disabled={isFormLoading}
                          className="pl-10 h-12 text-base bg-white border-gray-200 focus:border-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-1">
                      {formState?.errors?.email?.[0]}
                    </FormMessage>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-700 block mb-1">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          disabled={isFormLoading}
                          className="pl-10 h-12 text-base bg-white border-gray-200 focus:border-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-1">
                      {formState?.errors?.password?.[0]}
                    </FormMessage>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all"
              disabled={isFormLoading}
            >
              {isFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble signing in?{" "}
            <button className="text-primary hover:underline font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
