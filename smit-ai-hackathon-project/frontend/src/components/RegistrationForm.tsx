"use client"

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/hooks/use-toast";
import { insertRegistrationSchema, type InsertRegistration } from "@/lib/shared/schema";
import { 
  User, 
  IdCard, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Clock
} from "lucide-react";

export default function RegistrationForm() {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: "",
      cnic: "",
      email: "",
      phone: "",
      address: "",
      program: "",
    },
    mode: "onChange",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      setShowError(false);
      form.reset();
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      toast({
        title: "Registration Successful!",
        description: "Check WhatsApp or Email for your Digital ID Card.",
      });
    },
    onError: (error: any) => {
      setShowError(true);
      setShowSuccess(false);
      
      setTimeout(() => {
        setShowError(false);
      }, 5000);

      toast({
        title: "Registration Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registerMutation.mutate(data);
  };

  const isFormValid = form.formState.isValid;
  const isSubmitting = registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-16 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Saylani Mass IT Training
          </h1>
          <p className="text-xl text-blue-100 mb-2">Student Registration Portal</p>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Join Pakistan's largest IT training program and transform your career with cutting-edge skills
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-8 max-w-2xl mx-auto px-4 pb-12">
        {/* Registration Form Card */}
        <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Registration
              </CardTitle>
              <p className="text-gray-600">
                Fill in your details to join our comprehensive IT training programs
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h3>
                    <p className="text-sm text-gray-600">Please provide your basic details</p>
                  </div>

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your complete name"
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* CNIC */}
                  <FormField
                    control={form.control}
                    name="cnic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <IdCard className="w-4 h-4" />
                          CNIC Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1234567890123 (13 digits)"
                            maxLength={13}
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h3>
                    <p className="text-sm text-gray-600">How can we reach you?</p>
                  </div>

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@gmail.com"
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="03123456789 (11 digits)"
                            maxLength={11}
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Complete Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Enter your complete address including city and area"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Program Selection Section */}
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Program Selection</h3>
                    <p className="text-sm text-gray-600">Choose your preferred training program</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Training Program <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                              <SelectValue placeholder="Select your desired program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web-development">🌐 Web Development</SelectItem>
                            <SelectItem value="mobile-app-development">📱 Mobile App Development</SelectItem>
                            <SelectItem value="artificial-intelligence">🤖 Artificial Intelligence</SelectItem>
                            <SelectItem value="graphic-design">🎨 Graphic Design</SelectItem>
                            <SelectItem value="digital-marketing">📈 Digital Marketing</SelectItem>
                            <SelectItem value="data-science">📊 Data Science</SelectItem>
                            <SelectItem value="cybersecurity">🔒 Cybersecurity</SelectItem>
                            <SelectItem value="cloud-computing">☁️ Cloud Computing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      isFormValid && !isSubmitting
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Processing Registration...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 h-5 w-5" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Registration Successful!</h3>
                    <p className="text-green-700">
                      ✅ Your registration has been completed successfully! You will receive your Digital ID Card via WhatsApp and Email within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {showError && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Registration Failed</h3>
                    <p className="text-red-700">
                      ❌ Something went wrong during registration. Please check your information and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Secure Registration</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your data is encrypted and secure</li>
                    <li>• All information is kept confidential</li>
                    <li>• Used only for training purposes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-green-50 border-green-200 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Receive confirmation within 24 hours</li>
                    <li>• Get your Digital ID Card</li>
                    <li>• Join orientation session</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}