'use client'
import withRole from "../../middleware/withRole"
const AdminDashboard = () => {

  
  return (
    <div>
      <p className="m-4 text-center capitalize text-lg">welcome to admins dashboard, click on the links above  </p>
      <p className="m-4 text-center capitalize" >project by nmesoma ogbenna</p>
    </div>
  )
}

export default withRole(AdminDashboard, ["admin"])
