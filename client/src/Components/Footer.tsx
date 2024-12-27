import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react' // Import social media icons

const Footer = () => {
  return (
    <footer className='dark:bg-black bg-white text-black py-12 '>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Footer Top Section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12'>
          {/* Logo & Description */}
          <div className='flex flex-col space-y-4'>
            <div className='text-2xl font-bold text-red-500'>
              <Link to='/'>SparkUp</Link>
            </div>
            <p className='text-sm dark:text-slate-300 text-black'>
              We are a cutting-edge startup platform that connects like-minded
              individuals and accelerates innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col space-y-4'>
            <h3 className='text-lg font-semibold dark:text-white text-black'>
              Quick Links
            </h3>
            <ul className='space-y-2 dark:text-slate-300 text-black'>
              <li>
                <Link to='/' className='hover:text-blue-400'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/about' className='hover:text-blue-400'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/services' className='hover:text-blue-400'>
                  Services
                </Link>
              </li>
              <li>
                <Link to='/contact' className='hover:text-blue-400'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className='flex flex-col space-y-4'>
            <h3 className='text-lg font-semibold text-white'>Contact</h3>
            <p className='dark:text-slate-400 text-black'>
              Email:{' '}
              <a href='mailto:info@company.com' className='hover:text-blue-400'>
                sparkup@company.com
              </a>
            </p>
            <p className='dark:text-slate-400 text-black'>
              Phone:{' '}
              <a href='tel:+1234567890' className='hover:text-blue-400'>
                +1 234 567 890
              </a>
            </p>
          </div>

          {/* Social Media Links */}
          <div className='flex flex-col space-y-4'>
            <h3 className='text-lg font-semibold text-white'>Follow Us</h3>
            <div className='flex space-x-6'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Facebook className='w-6 h-6 text-slate-400 hover:text-blue-400' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Twitter className='w-6 h-6 text-slate-400 hover:text-blue-400' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Instagram className='w-6 h-6 text-slate-400 hover:text-blue-400' />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Linkedin className='w-6 h-6 text-slate-400 hover:text-blue-400' />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className='border-t border-slate-700 pt-8 mt-8'>
          <div className='flex space-x-6 text-slate-400 text-sm'>
            <Link to='/privacy-policy' className='hover:text-blue-400'>
              Privacy Policy
            </Link>
            <Link to='/terms-of-service' className='hover:text-blue-400'>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
