"use client";

import React from "react";
import { useForm } from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { TextInputForms } from "@/components/ui/inputs/FormInputs/TextInputForms";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";
import { useUiStore } from "@/components/store/Store";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/components/hooks/UseLocalStorage"; // Import the useUiStore hook

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
  const router = useRouter();

  // Access the showAlert and hideAlert functions from the store
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);
  const setUser = useUiStore((state) => state.setUser);
  const [storedValue, setStoredValue] = useLocalStorage("user", {
    level: "",
    loggedIn: false,
  });
  const onSubmit = async (data: FormData) => {
    hideAlert(); // Hide any existing alert
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/User/login`,
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
      setUser({ level: json.level, loggedIn: true });
      setStoredValue({ level: json.level, loggedIn: true });
      showAlert(json.message, "success"); // Show the success alert
      setTimeout(() => {
        router.push("/courses");
      }, 3000);
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
                value: 2,
                message: "Minimum length is 2 characters",
              },
              maxLength: {
                value: 120,
                message: "Maximum length is 120 characters",
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
                value: 3,
                message: "Minimum length is 3 characters",
              },
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
      <Alert alwaysShow={true} />
    </div>
  );
};

export default LoginForm;
