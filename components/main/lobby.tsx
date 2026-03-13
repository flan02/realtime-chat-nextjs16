import { InstallPWA } from "../reutilizable/InstallPWA";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Hero from "./Hero";
import WrapperClient from "../reutilizable/WrapperClient";

export function Lobby() {


  return (
    <WrapperClient>
      <Navbar />
      <InstallPWA />
      <Hero />
      <Footer />
    </WrapperClient>
  );
}