import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development", // Solo funciona en producción
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA({
  // Aquí podés agregar otras configs de Next si las necesitás en el futuro
  // Ejemplo: images: { domains: [...] }
});
