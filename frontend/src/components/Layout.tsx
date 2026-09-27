import type { ComponentChildren } from "preact";

import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: ComponentChildren;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
