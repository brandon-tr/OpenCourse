"use client";

import React from "react";
import { useForm } from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { TextInput } from "@/components/ui/inputs/TextInput";

type FormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
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

        <div className={"flex justify-center"}>
          <MaterialButton spacingTop={4} type="submit" size={"full"}>
            Login
          </MaterialButton>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
