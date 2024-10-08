import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <header className='font-manrope border-b border-lightgray flex justify-between items-center px-[12px] md:px-[55px] py-[19px] md:py-[27px] lg:px-0 lg:pl-[71px]'>
      <Link to="/"
        className='text-[1.5rem] 930:hidden'>
        Galaxy<span className='text-blue font-medium'>Surfers</span>
      </Link>
      <Link to="/" className='text-[1.5rem] font-medium leading-[150%] hidden 930:block'>
        Galaxy<span className='text-second-blue'>Surfers</span> Inventory Management
      </Link>
    </header>
  )
}

export default Header