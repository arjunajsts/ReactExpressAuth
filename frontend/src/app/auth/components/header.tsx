

type Props = {
    label:string;
} 

const Header = ({label}:Props) => {
  return (
    <div className='w-full flex flex-col gap-y-4 justify-center text-center'>
        <h1 className='text-xl font-semibold'>
           🔐Auth 
        </h1>
        <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}

export default Header