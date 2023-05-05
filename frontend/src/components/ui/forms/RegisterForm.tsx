"use client";

import React from "react";
import { useForm } from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { TextInput } from "@/components/ui/inputs/TextInput";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextInput
          id="email"
          type="email"
          label="Email"
          register={register}
          required
          error={errors.email}
          validationOptions={{
            minLength: { value: 2, message: "Minimum length is 2 characters" },
            maxLength: {
              value: 120,
              message: "Maximum length is 120 characters",
            },
          }}
        />

        <TextInput
          id="firstName"
          type="text"
          label="First Name"
          register={register}
          required
          error={errors.firstName}
          validationOptions={{
            minLength: { value: 2, message: "Minimum length is 2 characters" },
            maxLength: {
              value: 52,
              message: "Maximum length is 52 characters",
            },
          }}
        />

        <TextInput
          id="lastName"
          type="text"
          label="Last Name"
          register={register}
          required
          error={errors.lastName}
          validationOptions={{
            minLength: { value: 2, message: "Minimum length is 2 characters" },
            maxLength: {
              value: 52,
              message: "Maximum length is 52 characters",
            },
          }}
        />

        <TextInput
          id="password"
          type="password"
          label="Password"
          register={register}
          required
          error={errors.password}
          validationOptions={{
            minLength: { value: 3, message: "Minimum length is 3 characters" },
            maxLength: {
              value: 100,
              message: "Maximum length is 100 characters",
            },
          }}
        />

        <TextInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          required
          register={register}
          validationOptions={{
            minLength: {
              value: 3,
              message: "Minimum length is 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Maximum length is 100 characters",
            },
            validate: (value: string) =>
              value === watch("password") || "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        <div className={"flex justify-center"}>
          <MaterialButton spacingTop={4} type="submit" size={"full"}>
            Register
          </MaterialButton>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
