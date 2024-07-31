import React from 'react'

const DisplayCards = ({ icon, title, metric }: { icon: any, title: string, metric: number }) => {
  return (
    <div className='w-full flex flex-col p-2 border border-gray-300 rounded-md'>
      <div className='w-fit p-2 m-4 border border-gray-300 rounded-md text-[#534FEB] text-2xl'>
        {icon}
      </div>
      <div className='px-2 m-2 flex flex-col gap-2'>
        <h2 className='text-sm'>{title}</h2>
        <p className='text-4xl'>{metric}</p>
      </div>
    </div>
  )
}

export default DisplayCards