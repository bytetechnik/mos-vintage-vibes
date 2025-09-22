"use client";
import { Toaster } from "@/components/ui/toaster";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster />

    </Provider>
  );
};

export default Providers;
