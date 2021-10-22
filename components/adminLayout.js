import AdminHeader from '../components/adminHeader'
import Footer from '../components/footer'
import { doc } from 'prettier'
import React,{ useEffect} from 'react'

export default function AdminLayout ({children}) {

  const handleScroll = () => {
    if(document.body.scrollTop > 90 || document.documentElement.scrollTop > 90){
      document.getElementsByTagName('header')[0].className ='fixNav fixNavActive'
    }else{
      document.getElementsByTagName('header')[0].className ='fixNav'
    }
  }
  useEffect(() => {
    document.getElementsByTagName('body')[0].className ='' 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  });
  return (
    <>
      <AdminHeader/> 
      <main>
        {children}
      </main>
      <Footer/>
    </>
  )
}