"use client";

import React from "react";
import { useForm } from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { TextInputForms } from "@/components/ui/inputs/FormInputs/TextInputForms";
import { useUiStore } from "@/components/store/Store";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";

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
          <TextInputForms
            id="email"
            type="email"
            label="Email"
            register={register}
            required
            error={errors.email}
            validationOptions={{
              minLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_EMAIL_MIN_LENGTH)
                ),
                message: `Minimum length is ${process.env.NEXT_PUBLIC_EMAIL_MIN_LENGTH} characters`,
              },
              maxLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_EMAIL_MAX_LENGTH)
                ),
                message: `Maximum length is ${process.env.NEXT_PUBLIC_EMAIL_MAX_LENGTH} characters`,
              },
            }}
          />

          <TextInputForms
            id="firstName"
            type="text"
            label="First Name"
            register={register}
            required
            error={errors.firstName}
            validationOptions={{
              minLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_FIRST_NAME_MIN_LENGTH)
                ),
                message: `Minimum length is ${process.env.NEXT_PUBLIC_FIRST_NAME_MIN_LENGTH} characters`,
              },
              maxLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_FIRST_NAME_MAX_LENGTH)
                ),
                message: `Maximum length is ${process.env.NEXT_PUBLIC_FIRST_NAME_MAX_LENGTH} characters`,
              },
            }}
          />

          <TextInputForms
            id="lastName"
            type="text"
            label="Last Name"
            register={register}
            required
            error={errors.lastName}
            validationOptions={{
              minLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_LAST_NAME_MIN_LENGTH)
                ),
                message: `Minimum length is ${process.env.NEXT_PUBLIC_LAST_NAME_MIN_LENGTH} characters`,
              },
              maxLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_LAST_NAME_MAX_LENGTH)
                ),
                message: `Maximum length is ${process.env.NEXT_PUBLIC_LAST_NAME_MAX_LENGTH} characters`,
              },
            }}
          />

          <TextInputForms
            id="password"
            type="password"
            label="Password"
            register={register}
            required
            error={errors.password}
            validationOptions={{
              minLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH)
                ),
                message: `Minimum length is ${process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH} characters`,
              },
              maxLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_PASSWORD_MAX_LENGTH)
                ),
                message: `Maximum length is ${process.env.NEXT_PUBLIC_PASSWORD_MAX_LENGTH} characters`,
              },
            }}
          />

          <TextInputForms
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            required
            register={register}
            validationOptions={{
              minLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH)
                ),
                message: `Minimum length is ${process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH} characters`,
              },
              maxLength: {
                value: parseInt(
                  String(process.env.NEXT_PUBLIC_PASSWORD_MAX_LENGTH)
                ),
                message: `Maximum length is ${process.env.NEXT_PUBLIC_PASSWORD_MAX_LENGTH} characters`,
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
