"use client";

import { useEffect } from "react";
import { actionFunction } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
  redirectTo: undefined,
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
    if (state.redirectTo) {
      router.push(state.redirectTo); // ✅ Only redirect if it's not undefined
    }
  }, [state, toast, router]);

  return <form action={formAction}>{children}</form>;
}
export default FormContainer;
