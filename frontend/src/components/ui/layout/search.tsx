import { Input } from "@/components/ui/input"

type Props = {
  className:string
}

export function Search({className}:Props) {
  return (
    <div className={className}>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
