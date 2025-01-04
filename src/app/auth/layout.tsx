import { Dog } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium justify-center">
            <Dog className="size-7" />
          Dogin Inc.
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
