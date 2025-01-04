"use client";

import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/auth/form-error";
import { FormSucess } from "@/components/auth/form-sucess";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NewVerificationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token ausente!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Algo deu errado!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Confirmação de Verificação</CardTitle>
          <CardDescription>
            Estamos verificando sua solicitação. Por favor, aguarde enquanto processamos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {!success && !error && <BeatLoader />}
            {success && <FormSucess message={success} />}
            {error && <FormError message={error} />}
          </div>
        </CardContent>
      </Card>
      <div className="text-center">
        <Link href="/auth/login">
          <Button variant="link">Voltar para o login</Button>
        </Link>
      </div>
    </div>
  );
};

export default NewVerificationForm;
