import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@repo/web-ui/components/system-component/fom-inputs/FormInput";
import UiForm from "@repo/web-ui/components/system-component/form/ui-form";
import UiFormContent from "@repo/web-ui/components/system-component/form/ui-form-content";
import UiFormFooter from "@repo/web-ui/components/system-component/form/ui-form-footer";
import UiFormHeader from "@repo/web-ui/components/system-component/form/ui-form-header";
import UiLink from "@repo/web-ui/components/system-component/ui-link";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/auth/__layout/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const schema = z.object({
    email: z.email(),
    password: z.string(),
  });
  type FormType = z.infer<typeof schema>;

  const form = useForm<FormType>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const submit: SubmitHandler<FormType> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  const formId = "login-form";
  return (
    <UiForm>
      <UiFormHeader
        title="Login"
        description="Provide your credentials data to login"
      >
        <UiLink href="auth/register">Register now?</UiLink>
      </UiFormHeader>
      <UiFormContent form={form} submit={submit} id={formId}>
        <FormInput form={form} name="email" type="email" />
        <FormInput form={form} name="password" type="password" />
      </UiFormContent>
      <UiFormFooter
        submitTitle="Login"
        resetFn={() => form.reset()}
        id={formId}
      />
    </UiForm>
  );
}
