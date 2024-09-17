import React from "react";

const LoginPage = () => {
  return (
    <section className="container mx-auto min-h-screen flex justify-center">
      <div className="border border-red-500 overflow-hidden flex w-4/5 mt-24 rounded-xl">
        <div className="w-1/2 h-full border border-red-500"></div>

        <div className="w-1/2 h-full">
          <h2 className="text-3xl font-semibold text-red-500 flex flex-col items-center p-6">
            LOGIN
          </h2>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
