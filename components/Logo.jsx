import Link from 'next/link';
import Image from 'next/image';
const Logo = () => {
  return (
    <div><Link href='/'>
        <Image src="/logo.png" width={54} height={54} priority alt='we dev'/>
        </Link></div>
  )
}

export default Logo;    