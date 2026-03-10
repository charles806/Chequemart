import React from 'react'

const Account = () => {
    return (
        <section className='py-10 w-full'>
            <div className="my-container flex gap-5">
                <div className="col1 w-[25%]">
                    <div className="card bg-white shadow-md rounded-md p-5 cursor-pointer">
                        <div className="w-full p-3 flex items-center justify-center flex-col">
                            <div className="w-27.5 h-27.5 rounded-full overflow-hidden mb-4 relative">
                                <img src='https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png' alt="avatar" className='w-full h-full rounded-full object-cover' />  
                                 <div className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,.5)] "></div>             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Account