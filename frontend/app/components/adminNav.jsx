import Link from "next/link";

const AdminNav = () => {
  return (
    <div>
<nav>
  <ul className="flex justify-evenly bg-gray-100 py-4 items-center">
    <li className="relative text-lg cursor-pointer group antialiased font-bold">
      <Link href="/admin/dashboard/allusers">users</Link>
      <span className="absolute left-0 bottom-0 w-0 h-1 bg-customGreen transition-all duration-300 group-hover:w-full"></span>
    </li>

    <li className="relative text-lg cursor-pointer group antialiased font-bold">
    <Link href="/admin/dashboard/assignedUser">assignedUsers</Link>
      <span className="absolute left-0 bottom-0 w-0 h-1 bg-customGreen transition-all duration-300 group-hover:w-full"></span>
    </li>

    <li className="relative text-lg cursor-pointer group antialiased font-bold">
      <Link href="/admin/dashboard/assignManager">assignedManagers</Link>
      <span className="absolute left-0 bottom-0 w-0 h-1 bg-customGreen transition-all duration-300 group-hover:w-full"></span>
    </li>
  </ul>
</nav>
    </div>
  )
}

export default AdminNav
