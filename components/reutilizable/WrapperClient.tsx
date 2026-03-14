'use client'
import useMounted from "@/hooks/use-mounted"
import LoaderGutout from "./LoaderGutout"

interface WrapperClientProps {
  children: React.ReactNode
}

const WrapperClient = ({ children }: WrapperClientProps) => {
  const { mounted } = useMounted()


  if (!mounted) {
    return <LoaderGutout />
  }

  return <div className="hero-patterns">{children}</div>
}

export default WrapperClient