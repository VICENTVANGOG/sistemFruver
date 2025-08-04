import React from 'react'


export default function PrivateLayout(
    { children }: { children: React.ReactNode }
) {
    
    return (
        <div className="flex min-h-screen bg-gray-100">
          
                {children}
       
        </div>
    )
}