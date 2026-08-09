import { useState } from "react";
import { Button, Field, Input, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { PatientService } from "../../services/Patient";
import { toaster } from "../../components/ui/toaster";

export default function RegisterBaby() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !submitting && firstname.trim() && lastname.trim() && gender && dateOfBirth;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await PatientService.registerBaby({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        gender,
        dateOfBirth,
      });

      toaster.create({ type: "success", title: "Baby registered", description: "A new patient record was created." });

      setFirstname("");
      setLastname("");
      setGender("");
      setDateOfBirth("");
    } catch (error: any) {
      toaster.create({ type: "error", title: "Failed to register baby", description: error?.message ?? "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack gap="4" data-testid="register-baby-page" maxW="md">
      <Text data-testid="register-baby-page-heading" fontSize="xl" fontWeight="bold">
        Register Baby
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <Field.Root required>
            <Field.Label>
              First name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              data-testid="register-baby-field-firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Last name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              data-testid="register-baby-field-lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Gender
              <Field.RequiredIndicator />
            </Field.Label>
            <NativeSelect.Root size="sm" width="full">
              <NativeSelect.Field
                data-testid="register-baby-field-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "")}
              >
                <option value="" disabled>
                  Select gender…
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Date of birth
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              data-testid="register-baby-field-date-of-birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </Field.Root>

          <Button
            type="submit"
            colorPalette="blue"
            alignSelf="start"
            data-testid="register-baby-submit-button"
            loading={submitting}
            disabled={!canSubmit}
          >
            Register Baby
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
