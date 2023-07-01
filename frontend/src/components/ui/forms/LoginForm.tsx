"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import {TextInputForms} from "@/components/ui/inputs/FormInputs/TextInputForms";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";
import {useUiStore} from "@/components/store/Store";
import {useRouter, useSearchParams} from "next/navigation";
import {useLocalStorage} from "@/components/hooks/UseLocalStorage";

type FormData = {
    email: string;
    password: string;
};

export type UserLogin = {
    level: number,
    loggedIn: boolean,
    Email: string,
    FirstName: string,
    IsBanned: boolean,
    LastName: string
}


const LoginForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>();
    const router = useRouter();

    // Access the showAlert and hideAlert functions from the store
    const showAlert = useUiStore((state) => state.showAlert);
    const hideAlert = useUiStore((state) => state.hideAlert);
    const searchParams = useSearchParams();
    const [run, setRun] = useState(true);
    const searchParamsErrors = searchParams.get("errors");
    const [storedValue, setStoredValue] = useLocalStorage<UserLogin>("user", {
        level: 0,
        loggedIn: false, Email: "", FirstName: "", IsBanned: false, LastName: ""
    });
    const setUser = useUiStore((state) => state.setUser);

    useEffect(() => {
        if (searchParamsErrors && searchParamsErrors === process.env.NEXT_PUBLIC_ERRORS_NOT_LOGGED_IN && run) {
            setRun(false);
            setStoredValue({level: 0, loggedIn: false, Email: "", FirstName: "", IsBanned: false, LastName: ""});
        }
    }, [run, searchParamsErrors, setStoredValue, storedValue]);


    const onSubmit = async (data: FormData) => {
        hideAlert(); // Hide any existing alert
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/User/login`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            }
        );
        const json = await response.json();
        if (json.error) {
            showAlert(json.error, "error"); // Show the error alert with the error message
        } else if (json.status === 200) {
            console.log(json);
            setStoredValue(json.user);
            setUser(json.user);
            showAlert(json.message, "success"); // Show the success alert
            setTimeout(() => {
                router.push("/courses");
            }, 3000);
        } else {
            showAlert("Unknown error", "error"); // Show the error alert
        }
    };

    const LoginWithOAuth = async (auth: string) => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/ExternalAuth/google`
    }

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

                    <div className={"flex justify-center flex-col gap-2"}>
                        <MaterialButton spacingTop={4} type="submit" size={"full"} color={"secondary"}>
                            Login
                        </MaterialButton>
                    </div>
                </div>
            </form>
            <MaterialButton spacingTop={4} type="submit" size={"full"} color={"white"} onClick={() => {
                LoginWithOAuth("google")
            }}>
                Login with google
            </MaterialButton>
            <Alert alwaysShow={true}/>
        </div>
    );
};

export default LoginForm;
