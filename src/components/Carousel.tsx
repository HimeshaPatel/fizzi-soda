'use client'
import { useState, useEffect, useRef } from 'react';
import { Bounded } from '@/components/Bounded';

import { Center, Environment, View } from '@react-three/drei';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { SodaCan, type SodaCanProps } from '@/components/SodaCan';
import FloatingCan from './FloatingCan';
import { useGSAP } from '@gsap/react';
import { ArrowIcon } from './ArrowIcon';
import { WavyCircles } from './WavyCircles';
// import { Group } from 'three/examples/jsm/libs/tween.module.js';




const SPINS_ON_CHANGE = 8;


const FLAVORS: {
    flavor: SodaCanProps["flavor"];
    color: string;
    name: string;
  }[] = [
    { flavor: "blackCherry", color: "#710523", name: "Black Cherry" },
    { flavor: "grape", color: "#572981", name: "Grape Goodness" },
    { flavor: "lemonLime", color: "#164405", name: "Lemon Lime" },
    {
      flavor: "strawberryLemonade",
      color: "#690B3D",
      name: "Strawberry Lemonade",
    },
    { flavor: "watermelon", color: "#4B7002", name: "Watermelon Crush" },
  ];


const Carousel = () => {
    
   const[currentFlavorIndex, setCurrentFlavorIndex] = useState(0);

   const sodaCanRef = useRef<Group>(null)
   function changeFlavor(index: number){
    if(!sodaCanRef.current) return;
    const nextIndex = ( index + FLAVORS.length) % FLAVORS.length;
    const tl = gsap.timeline();
    tl.to(
      sodaCanRef.current.rotation,{
        y: index > currentFlavorIndex
        ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
        : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: 1
      }, 0
    )
    .to(".background, .wavy-circles-outer, .wavy-circles-inner",{
      backgroundColor: FLAVORS[nextIndex].color,
      fill: FLAVORS[nextIndex].color,
      ease:"power2.inOut",
      duration: 1
    },0
   )
   .to(".text-wrapper", {
    duration: .2, y:-10, opacity:0
   }, 0)
   .to(
    {},
    {onStart: ()=> setCurrentFlavorIndex(nextIndex)},
    0.5)
    .to(".text-wrapper", {duration:.2, y:0, opacity:1}, .7)
    setCurrentFlavorIndex(nextIndex);
   }     
        
  
    
    return (
        <section className="carousel bg-white relative h-screen text-white grid grid-rows-[auto,4fr,auto] overflow-hidden justify-center py-12">
            <div className="background pointer-events-none absolute inset-0 bg-[#715023] opacity-50" />
               <WavyCircles className='absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523]'/>
              <h2 className="relative text-center text-5xl font-bold">
                Choose your Flavors
              </h2>
              
              <div className='grid grid-cols-3 items-center'>
                {/* Left */}
                <ArrowButton
                onClick={() => changeFlavor(currentFlavorIndex + 1)}
                direction='left'
                label='Previous Flavor'               
                >
                  
                </ArrowButton>
                {/* Can */}
                <View className='aspect-square h-[70vmin] min-h-40'>
                  <Center position={[0,0,1.5]}>
                  <FloatingCan ref={sodaCanRef} floatIntensity={0.3} rotationIntensity={1}
                  flavor={FLAVORS[currentFlavorIndex].flavor}
                  />
                  </Center>

                  <Environment files="/hdr/lobby.hdr" environmentIntensity={0.6} environmentRotation={[0,3,0]} />
                  <directionalLight position={[0, 1, 1]} intensity={6} />
                </View>
                {/* Right */}
                <ArrowButton onClick={() => changeFlavor(currentFlavorIndex - 1)} direction='right' label="Next Flavor"></ArrowButton>
               
              </div>

              <div className='text-area relative mx-auto text-center'>
                <div className="text-wrapper text-4xl font-medium">
                  <p>{FLAVORS[currentFlavorIndex].name}</p>
                </div>
              </div>
            <div className="mt-2 text-2xl font-normal opacity-90">

            </div>
          
            
         
        </section>
    );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "right" | "left";
  label: string;
  onClick: ()=> void;
}

function ArrowButton({label, direction="right", onClick}:ArrowButtonProps){
  return(
    <button
                onClick={onClick}
                className='cursor-pointer size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20'
                >
                  <ArrowIcon className={clsx(direction === "right" && "-scale-x-100" )} />
                  <span className='sr-only'> {label}</span>
                
                </button>
  )
}
 