import { MonitorSmartphone } from "lucide-react"







const LoaderGutout = () => {

  return (
    <div className="min-h-screen hero-patterns flex flex-col items-center justify-center bg-background">

      <div className="relative flex flex-col items-center animate-in fade-in duration-500">
        <MonitorSmartphone size={48} className="dark:text-white text-black" />
        <div className="flex space-x-1 mt-4">
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  )
}

export default LoaderGutout