

type Props = {
    children:React.ReactNode
}

const AuthLoyout = ({children}:Props) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
        <main>{children}</main>
    </div>
  )
}

export default AuthLoyout