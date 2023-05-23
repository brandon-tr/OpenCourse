"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/components/store/Store";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";
import { TextInputForms } from "@/components/ui/inputs/FormInputs/TextInputForms";
import TextAreaFormInput from "@/components/ui/inputs/FormInputs/TextAreaFormInput";
import MaterialCombo from "@/components/ui/inputs/FormInputs/MaterialSelect/MaterialCombo";
import HorizontalLine from "@/components/ui/Surfaces/HorizontalLine";
import MaterialSwitch from "../inputs/FormInputs/MaterialSwitch";
import MaterialButton from "@/components/ui/inputs/MaterialButton";

interface SiteInterface {
  site: {
    id: number;
    siteName: string;
    siteDescription?: string;
    siteKeywords?: string;
    siteAuthor?: string;
    siteEmail?: string | null;
    siteUrl: string;
    siteLogo?: string | null;
    siteFavicon?: string | null;
    siteFacebook?: string | null;
    siteTwitter?: string | null;
    siteInstagram?: string | null;
    siteYoutube?: string | null;
    isRegistrationEnabled: boolean;
    isEmailConfirmationRequired: boolean;
    isMaintenanceMode: boolean;
  };
}

interface FormInterface {
  id: number;
  siteName: string;
  siteDescription?: string;
  siteKeywords?:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  siteAuthor?: string;
  siteEmail?: string | null;
  siteUrl: string;
  siteLogo?: string | null;
  siteFavicon?: string | null;
  siteFacebook?: string | null;
  siteTwitter?: string | null;
  siteInstagram?: string | null;
  siteYoutube?: string | null;
  isRegistrationEnabled: boolean;
  isEmailConfirmationRequired: boolean;
  isMaintenanceMode: boolean;
}

export const SiteSettingsForm: React.FC<SiteInterface> = ({ site }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<FormInterface>();
  useEffect(() => {
    const keywords = site.siteKeywords
      ?.split(",")
      .map((keyword) => keyword.trim());
    const keywordsArray = keywords?.map((keyword) => {
      return {
        label: keyword,
        value: keyword,
      };
    });
    reset({
      id: site.id,
      siteName: site.siteName,
      siteDescription: site.siteDescription,
      siteKeywords: keywordsArray,
      siteAuthor: site.siteAuthor,
      siteEmail: site.siteEmail,
      siteUrl: site.siteUrl,
      siteLogo: site.siteLogo,
      siteFavicon: site.siteFavicon,
      siteFacebook: site.siteFacebook,
      siteTwitter: site.siteTwitter,
      siteInstagram: site.siteInstagram,
      siteYoutube: site.siteYoutube,
      isRegistrationEnabled: site.isRegistrationEnabled,
      isEmailConfirmationRequired: site.isEmailConfirmationRequired,
      isMaintenanceMode: site.isMaintenanceMode,
    });
  }, []);
  const router = useRouter();

  // Access the showAlert and hideAlert functions from the store
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);
  const onSubmit = async (site: FormInterface) => {
    hideAlert(); // Hide any existing alert
    const formattedKeywords = site.siteKeywords?.map(
      (keyword) => keyword.value
    );
    const formattedSite = {
      ...site,
      siteKeywords: formattedKeywords?.join(","),
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/1`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedSite),
      }
    );
    const json = await response.json();
    if (json.error) {
      showAlert(json.error, "error"); // Show the error alert with the error message
    } else if (json.status === 200) {
      showAlert(json.message, "success"); // Show the success alert
      router.refresh();
    } else {
      showAlert("Unknown error", "error"); // Show the error alert
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInputForms
          id="siteName"
          type="text"
          label="Site Name"
          register={register}
          required
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
          id="siteAuthor"
          type="text"
          label="Site Author"
          register={register}
          required
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
          id="siteUrl"
          type="text"
          label="Site Url"
          register={register}
          required
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
          id="siteEmail"
          type="text"
          label="Site Email"
          register={register}
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
          name="siteDescription"
          label={"Site Description"}
          id={"siteDescription"}
          register={register}
        />
        <MaterialCombo
          id={"siteKeywords"}
          control={control}
          label={"Site Keywords"}
          name={"siteKeywords"}
          options={[]}
          isMulti={true}
        />
        <div className={"mt-5"}>
          <p>Registration / Authentication</p>
          <HorizontalLine />
          <MaterialSwitch
            control={control}
            label="Registration Enabled"
            name={"isRegistrationEnabled"}
          />
          <MaterialSwitch
            control={control}
            label="Email Confirmation Enabled"
            name={"isEmailConfirmationRequired"}
          />
          <MaterialSwitch
            control={control}
            label="Maintenance Mode Enabled"
            name={"isMaintenanceMode"}
          />
        </div>
        <div className={"mt-5"}>
          <p>Social Media</p>
          <HorizontalLine />
          <TextInputForms
            id="siteFacebook"
            type="text"
            label="Facebook"
            register={register}
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
            id="siteTwitter"
            type="text"
            label="Twitter"
            register={register}
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
            id="siteInstagram"
            type="text"
            label="Instagram"
            register={register}
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
            id="siteYoutube"
            type="text"
            label="Youtube"
            register={register}
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
        </div>

        <MaterialButton
          spacingTop={4}
          type="submit"
          size={"full"}
          color={"secondary"}
        >
          Save
        </MaterialButton>
      </form>
      <Alert alwaysShow={true} />
    </div>
  );
};
