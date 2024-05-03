import { useForm, SubmitHandler, useWatch } from "react-hook-form";

import "@amsterdam/design-system-tokens/dist/index.css";
import "@amsterdam/design-system-assets/font/index.css";
import "@amsterdam/design-system-css/dist/index.css";
import {
  Alert,
  AlertProps,
  Button,
  Checkbox,
  Fieldset,
  FormFieldCharacterCounter,
  Grid,
  Label,
  Link,
  Paragraph,
  Radio,
  TextArea,
  UnorderedList,
} from "@amsterdam/design-system-react";
import { PropsWithChildren, HTMLAttributes, useEffect, useMemo } from "react";

type Inputs = {
  example1: string;
  example2: string;
  radio: string;
  checkbox: string;
};

type ErrorSummaryProps = {
  errors: { id: string; message: string }[];
};

const ErrorSummary = ({
  className,
  errors,
}: AlertProps & ErrorSummaryProps) => {
  return (
    <Alert
      className={className}
      title="Verbeter de fouten voor u verder gaat"
      severity="error"
      role="alert"
      headingLevel={2}
    >
      <UnorderedList>
        {errors.map(({ id, message }) => (
          <UnorderedList.Item key={id}>
            <Link href={id}>{message}</Link>
          </UnorderedList.Item>
        ))}
      </UnorderedList>
    </Alert>
  );
};

const FormField = ({
  children,
  hasError = false,
}: { hasError?: boolean } & PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
>) => (
  <div className={hasError ? "form-field__has-error" : undefined}>
    {children}
  </div>
);

const CustomFieldset = ({
  children,
  legend,
  hasError = false,
  ...restProps
}: { legend: string; hasError?: boolean } & PropsWithChildren<
  HTMLAttributes<HTMLFieldSetElement>
>) => (
  <Fieldset
    {...restProps}
    legend={legend}
    className={hasError ? "fieldset__has-error" : undefined}
  >
    {children}
  </Fieldset>
);

const FormFieldError = ({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div {...restProps} className="ams-error">
    <span className="ams-visually-hidden">Invoerfout: </span>
    {children}
  </div>
);

export default function App() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const exampleTextArea = useWatch({
    control,
    name: "example1",
    defaultValue: "",
  });

  const formattedErrors =
    errors &&
    Object.keys(errors).map((key) => ({
      // @ts-expect-error: not an issue
      id: `#${errors[key].ref.id}`,
      // @ts-expect-error: not an issue
      message: errors[key].message,
    }));

  const initialDocTitle = useMemo(() => document.title, []);

  useEffect(() => {
    if (formattedErrors.length > 0) {
      document.title = `(${formattedErrors.length} invoerfout${
        formattedErrors.length === 1 ? "" : "en"
      }) ${initialDocTitle}`;
    } else {
      document.title = initialDocTitle;
    }
  }, [formattedErrors, initialDocTitle]);

  return (
    <Grid>
      <Grid.Cell start={2} span={7}>
        {formattedErrors.length > 0 && (
          <ErrorSummary errors={formattedErrors} className="ams-mb--md" />
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="ams-column ams-column--medium"
        >
          <FormField hasError={Boolean(errors.example1)}>
            <Label htmlFor="input1">Waar gaat het om?</Label>
            <Paragraph id="description1" size="small">
              Typ geen persoonsgegevens in deze omschrijving. We vragen dit
              later in dit formulier aan u.
            </Paragraph>
            {errors.example1 && (
              <FormFieldError id="error1">
                <Paragraph size="small">{errors.example1.message}</Paragraph>
              </FormFieldError>
            )}
            <TextArea
              id="input1"
              aria-describedby={`description1${
                errors.example1 ? " error1" : ""
              }`}
              aria-invalid={Boolean(errors.example1)}
              aria-required="true"
              {...register("example1", {
                required: "Dit is een verplicht veld",
                maxLength: {
                  value: 20,
                  message: "U heeft te veel tekens gebruikt",
                },
              })}
              dir="auto" // TODO: dit in component zelf verwerken
            />
            <FormFieldCharacterCounter
              length={exampleTextArea.length}
              maxLength={20}
            />
          </FormField>

          <FormField hasError={Boolean(errors.example2)}>
            <Label htmlFor="input2">Waar gaat het om nummer 2?</Label>
            <div id="description2">
              <Paragraph size="small">
                Typ geen persoonsgegevens in deze omschrijving. We vragen dit
                later in dit formulier aan u.
              </Paragraph>
              <Paragraph size="small">Hier mag ook een lijst in.</Paragraph>
              <UnorderedList>
                <UnorderedList.Item>Item 1</UnorderedList.Item>
                <UnorderedList.Item>Item 2</UnorderedList.Item>
              </UnorderedList>
            </div>
            {errors.example2 && (
              <FormFieldError id="error2">
                <Paragraph size="small">{errors.example2.message}</Paragraph>
              </FormFieldError>
            )}
            <TextArea
              id="input2"
              aria-describedby={`description2${
                errors.example2 ? "error2" : ""
              }`}
              aria-invalid={errors.example2 ? "true" : "false"}
              aria-required="true"
              {...register("example2", {
                required: "Dit is een verplicht veld",
                maxLength: {
                  value: 20,
                  message: "U heeft te veel tekens gebruikt",
                },
              })}
              dir="auto" // TODO: dit in component zelf verwerken
            />
          </FormField>

          <CustomFieldset
            legend="Waar gaat uw melding over?"
            aria-describedby={`description3${errors.radio ? "error3" : ""}`}
            role="radiogroup"
            aria-required="true"
            hasError={Boolean(errors.radio)}
          >
            <Paragraph id="description3" size="small">
              Omschrijving van de radio.
            </Paragraph>
            {errors.radio && (
              <FormFieldError id="error3">
                <Paragraph size="small">{errors.radio.message}</Paragraph>
              </FormFieldError>
            )}
            <Radio
              value="vraag"
              invalid={errors.radio ? true : false}
              aria-required="true"
              {...register("radio", { required: "Dit is een verplicht veld" })}
            >
              Vraag
            </Radio>
            <Radio
              value="klacht"
              invalid={errors.radio ? true : false}
              aria-required="true"
              {...register("radio", { required: "Dit is een verplicht veld" })}
            >
              Klacht
            </Radio>
            <Radio
              value="meldingen"
              invalid={errors.radio ? true : false}
              aria-required="true"
              {...register("radio", { required: "Dit is een verplicht veld" })}
            >
              Meldingen openbare ruimte en overlast
            </Radio>
            <Radio
              value="idee"
              invalid={errors.radio ? true : false}
              aria-required="true"
              {...register("radio", { required: "Dit is een verplicht veld" })}
            >
              Idee of suggestie
            </Radio>
          </CustomFieldset>

          <CustomFieldset
            legend="Waar gaat uw melding over 2?"
            aria-describedby={`description4${errors.checkbox ? "error4" : ""}`}
            hasError={Boolean(errors.checkbox)}
          >
            <Paragraph id="description4" size="small">
              Omschrijving van de checkbox.
            </Paragraph>
            {errors.checkbox && (
              <FormFieldError id="error4">
                <Paragraph size="small">{errors.checkbox.message}</Paragraph>
              </FormFieldError>
            )}
            <Checkbox
              value="vraag"
              invalid={errors.checkbox ? true : false}
              aria-required="true"
              {...register("checkbox", {
                required: "Dit is een verplicht veld",
              })}
            >
              Vraag
            </Checkbox>
            <Checkbox
              value="klacht"
              invalid={errors.checkbox ? true : false}
              aria-required="true"
              {...register("checkbox", {
                required: "Dit is een verplicht veld",
              })}
            >
              Klacht
            </Checkbox>
            <Checkbox
              value="meldingen"
              invalid={errors.checkbox ? true : false}
              aria-required="true"
              {...register("checkbox", {
                required: "Dit is een verplicht veld",
              })}
            >
              Meldingen openbare ruimte en overlast
            </Checkbox>
            <Checkbox
              value="idee"
              invalid={errors.checkbox ? true : false}
              aria-required="true"
              {...register("checkbox", {
                required: "Dit is een verplicht veld",
              })}
            >
              Idee of suggestie
            </Checkbox>
          </CustomFieldset>

          <div>
            <Button type="submit">Verzenden</Button>
          </div>
        </form>
      </Grid.Cell>
    </Grid>
  );
}
