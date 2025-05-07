export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-login-pattern bg-cover bg-center bg-no-repeat flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="fade-in sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-effect py-8 px-4 sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}