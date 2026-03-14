

const LoaderGutout = () => {

  return (
    <div className="min-h-screen hero-patterns flex items-center justify-center">
      <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center text-center">
        <div className="loader-logo animate-levitate ml-14 lg:ml-0" aria-label="loader logo" />
        <div className="flex justify-center space-x-1 mt-6 ml-3 lg:-ml-12">
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"></span>
        </div>

      </div>
    </div>
  )
}

export default LoaderGutout