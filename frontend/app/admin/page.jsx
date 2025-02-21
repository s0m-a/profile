'use client'
import ProfileCard from "../components/profileCard"
import withRole from "../middleware/withRole"

const AdminProfile = () => {
  return (
    <div>
      <ProfileCard />
    </div>
  )
}
export default withRole(AdminProfile, ["admin"])

