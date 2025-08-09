import React from 'react'

function ProfileData({data}) {
  console.log(data);
  
  return (
    <div className='profile-data'>
        <div>
            <span>Name: </span>
            <p>{data.name}</p>
        </div>

        <div>
            <span>Last Name: </span>
            <p>{data.lastName}</p>
        </div>

        <div>
            <span>Email: </span>
            <p>{data.Email}</p>
        </div>
    </div>
  )
}

export default ProfileData