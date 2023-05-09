"use client";

import React from "react";
import { useForm } from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { useUiStore } from "@/components/store/Store";
import Alert from "@/components/ui/Surfaces/Alert";

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

  // Access the showAlert and hideAlert functions from the store
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const onSubmit = async (data: FormData) => {
    hideAlert(); // Hide any existing alert
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/User/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const json = await response.json();
    if (json.error) {
      showAlert(json.error, "error"); // Show the error alert with the error message
    } else if (json.status === 200) {
      showAlert(json.message, "success"); // Show the success alert
    } else {
      showAlert("Unknown error", "error"); // Show the error alert
    }
  };

  return (
    <div>
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
              minLength: {
                value: 2,
                message: "Minimum length is 2 characters",
              },
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
              minLength: {
                value: 2,
                message: "Minimum length is 2 characters",
              },
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
              minLength: {
                value: 2,
                message: "Minimum length is 2 characters",
              },
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
              minLength: {
                value: 3,
                message: "Minimum length is 3 characters",
              },
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
      <Alert alwaysShow={true} />
    </div>
  );
};

export default RegistrationForm;
