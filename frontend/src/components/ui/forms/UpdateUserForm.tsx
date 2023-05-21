"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { TextInputForms } from "@/components/ui/inputs/FormInputs/TextInputForms";
import { useUiStore } from "@/components/store/Store";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";
import {
  GetAllUsersResponseDto,
  UserRoleResponseDto,
} from "@/app/dashboard/view/users/(list)/page";
import { useRouter } from "next/navigation";
import Select from "react-select";
import MaterialSelect from "@/components/ui/inputs/FormInputs/MaterialSelect/MaterialSelect";
import { arraysOfObjectsAreEqual } from "@/components/utility/CompareObjects";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  isBanned: {
    id: number;
    name: string;
  };
  userRoles: UserRoleResponseDto[];
};

interface UpdateUserFormProps {
  user: GetAllUsersResponseDto;
  role: UserRoleResponseDto[];
}

type SelectKeys = "role";

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, role }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [unchanged, setUnchanged] = React.useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: "",
    confirmPassword: "",
    userRoles: user.userRoles,
    isBanned: user.isBanned,
  });
  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: "",
        confirmPassword: "",
        userRoles: user.userRoles,
        isBanned: user.isBanned
          ? { id: 0, name: "Banned" }
          : { id: 1, name: "Not Banned" },
      });
    } else {
      router.push("/dashboard?errors=unknown");
    }
  }, []);
  // Access the showAlert and hideAlert functions from the store
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const onSubmit = async (data: FormData) => {
    hideAlert();
    const isBannedId = data.isBanned.id;
    const isBanned: boolean = isBannedId === 0;

    //format data into proper format
    const temp = {
      id: user.id,
      ...data,
      isBanned: isBanned,
    };

    //Remove unchanged data
    for (const key in temp) {
      if (
        temp[key as keyof typeof temp] ===
        unchanged[key as keyof typeof unchanged]
      ) {
        delete temp[key as keyof typeof temp];
      }
    }

    let equal = arraysOfObjectsAreEqual(data.userRoles, unchanged.userRoles);
    if (!equal) {
      temp.userRoles = data.userRoles;
    }

    const formattedData = {
      id: temp.id,
      email: temp.email,
      firstName: temp.firstName,
      lastName: temp.lastName,
      password: temp.password,
      isBanned: temp.isBanned,
      userRoles: !equal ? temp.userRoles : undefined,
    };

    if (Object.keys(JSON.parse(JSON.stringify(formattedData))).length <= 1) {
      showAlert("No changes made", "error");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/User/UpdateUser`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
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
          <div className={"mt-2"}>
            <MaterialSelect
              options={role}
              isMulti={true}
              label={"Role"}
              id={"role"}
              control={control}
              name={"userRoles"}
            />
          </div>
          <div className={"mt-2"}>
            <MaterialSelect
              options={[
                { id: 0, name: "Banned" },
                { id: 1, name: "Unbanned" },
              ]}
              label={"Banned"}
              id={"banned"}
              control={control}
              name={"isBanned"}
            />
          </div>
          <div className={"flex justify-center"}>
            <MaterialButton
              spacingTop={4}
              type="submit"
              size={"full"}
              color={"secondary"}
            >
              Update
            </MaterialButton>
          </div>
        </div>
      </form>
      <Alert alwaysShow={true} />
    </div>
  );
};

export default UpdateUserForm;
