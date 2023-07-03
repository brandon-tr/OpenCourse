"use client";

import React from "react";
import {useForm} from "react-hook-form";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import {TextInputForms} from "@/components/ui/inputs/FormInputs/TextInputForms";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";
import {useUiStore} from "@/components/store/Store";
import {useRouter} from "next/navigation";
import TextAreaFormInput from "@/components/ui/inputs/FormInputs/TextAreaFormInput";
import {FileInput} from "@/components/ui/inputs/FormInputs/FileInput";

type FormData = {
    title: string
    description: string
    image: FileList
};

const AddCourseForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<FormData>();
    const router = useRouter();
    // Access the showAlert and hideAlert functions from the store
    const showAlert = useUiStore((state) => state.showAlert);
    const hideAlert = useUiStore((state) => state.hideAlert);

    const onSubmit = async (data: FormData) => {
        hideAlert(); // Hide any existing alert
        console.log(data.image[0])
        const formData = new FormData();

        // Append the data
        formData.append('Title', data.title);
        formData.append('Description', data.description);
        formData.append('image', data.image[0]);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Course/Add`,
            {
                method: "POST",
                body: formData, // use formData as body instead of JSON
                credentials: "include",
            }
        );
        const json = await response.json();
        if (json.error) {
            showAlert(json.error, "error"); // Show the error alert with the error message
        } else if (json.status === 200 || json.status === 201) {
            console.log(json);
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
                        id="title"
                        type="text"
                        label="Course Title"
                        register={register}
                        required
                        error={errors.title}
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

                    <TextAreaFormInput
                        name="description"
                        label={"Course Description"}
                        id={"description"}
                        register={register}
                        validationOptions={{
                            required: "This field is required",
                            minLength: {
                                value: 2,
                                message: "Minimum length is 2 characters",
                            },
                            maxLength: {
                                value: 120,
                                message: "Maximum length is 120 characters",
                            },
                        }}
                        error={errors.description}
                    />

                    <FileInput error={errors.image} label={"Course Image"} id={'image'} register={register}
                               validationOptions={{
                                   required: "This field is required",
                               }} watch={watch}/>

                    <div className={"flex justify-center flex-col gap-2"}>
                        <MaterialButton spacingTop={4} type="submit" size={"full"} color={"secondary"}>
                            Add
                        </MaterialButton>
                    </div>
                </div>
            </form>

            <Alert alwaysShow={true}/>
        </div>
    );
};

export default AddCourseForm;
