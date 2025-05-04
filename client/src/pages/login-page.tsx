'use client';
import { useGoogleFont } from '@/hooks/use-google-font';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from 'react';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(3, "Имя пользователя должно содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string().min(3, "Имя пользователя должно содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  fullName: z.string().min(3, "Имя должно содержать минимум 3 символа"),
  email: z.string().email("Введите корректный email"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const fontFamily = useGoogleFont('Inter');
  const { t, language, setLanguage } = useLanguage();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    registerMutation.mutate({
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      email: data.email,
      role: "user",
    });
  }

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="relative flex min-h-screen w-full bg-gray-50 overflow-hidden" style={{ fontFamily }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://uxcanvas.ai/api/generated-images/8ad16188-f458-49ad-aeb6-a17593e5c468/34a1c136-5935-4ca5-a09a-81f555edf773" 
          alt="Logistics background pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 sm:px-6 py-8 z-10 min-h-screen">
        {/* Logo with burgundy background */}
        <div className="w-full bg-primary py-3 px-5 rounded-t-lg">
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white">БТГ</span>
              <span className="text-white ml-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white">
                  <path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-white text-xs tracking-wider uppercase">WORLDWIDE</p>
              <p className="text-white text-xs tracking-wider uppercase">LOGISTICS</p>
            </div>
          </div>
        </div>
        
        {/* Tabs for Login/Register */}
        <Tabs 
          defaultValue="login" 
          className="w-full" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full justify-start border-b border-border">
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground px-8" value="login">{t("login")}</TabsTrigger>
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground px-8" value="register">{t("register")}</TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login" className="w-full bg-white p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6 text-center">
              {t("loginTitle")}
            </h2>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("username")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="ivanov"
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel>{t("password")}</FormLabel>
                        <a href="#" className="text-xs text-primary hover:underline cursor-pointer">
                          {t("forgotPassword")}
                        </a>
                      </div>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••"
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          {t("rememberMe")}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 cursor-pointer"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("loginButton")}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register" className="w-full bg-white p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6 text-center">
              {t("registerTitle")}
            </h2>
            
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("username")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="ivanov"
                          disabled={registerMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fullName")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Иванов Иван Иванович"
                          disabled={registerMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="ivanov@example.com"
                          disabled={registerMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••"
                          disabled={registerMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("registerButton")}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        {/* User area with burgundy background */}
        <div className="w-full mt-5 bg-primary rounded-b-lg p-4 shadow-md">
          {/* Language Selector */}
          <div className="flex justify-center space-x-4 text-sm text-white">
            <button 
              className={`${language === "ru" ? "font-medium underline" : "hover:underline"} cursor-pointer`}
              onClick={() => setLanguage("ru")}
            >
              Русский
            </button>
            <button 
              className={`${language === "en" ? "font-medium underline" : "hover:underline"} cursor-pointer`}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button 
              className={`${language === "de" ? "font-medium underline" : "hover:underline"} cursor-pointer`}
              onClick={() => setLanguage("de")}
            >
              Deutsch
            </button>
          </div>
          
          {/* Footer */}
          <div className="mt-4 text-center text-xs text-white">
            <p>{t("copyrightText")}</p>
            <p className="mt-1">{t("companyDescription")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
