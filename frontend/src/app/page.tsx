'use client';

import About from "./_components/landing/About";
import Features from "./_components/landing/Features";
import Header from "./_components/landing/Header";
import Hero from "./_components/landing/Hero";
import Stats from "./_components/landing/Stats";
import Testimonials from "./_components/landing/Testimonial";
import CallToAction from "./_components/landing/CallToAction";
import Footer from "./_components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <About />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
