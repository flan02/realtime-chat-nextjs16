"use client"
import { Download } from "lucide-react";
import { useState, useEffect } from "react";

export function InstallPWA() {
  // const test = process.env.NEXT_PUBLIC_PWA == "true" ? true : false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // const [isInstallable, setIsInstallable] = useState<boolean>(test); // * false = production
  const [isInstallable, setIsInstallable] = useState(false); // * false = production

  useEffect(() => {
    const handler = (e: Event) => {
      console.log("✅ PWA Install Prompt detectado");
      e.preventDefault(); // ? Evita que el navegador tire su propio aviso
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    // Detectar si es iPhone/iPad
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // Detectar si ya está instalada (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      function IphoneMode() {

        setIsInstallable(true); // Forzamos mostrar el mensaje para iPhone
      }
      IphoneMode();
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // ? Muestra el cartel de instalación
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="text-xs flex gap-2 md:text-base fixed bottom-4 right-4 bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg font-bold animate-bounce hover:bg-red-700 transition-colors z-50">
      <Download size={16} className="mt-0 lg:mt-1" />
      Install App 📱
    </button>
  );
}