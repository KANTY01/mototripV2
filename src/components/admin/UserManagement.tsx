import React, { useState } from 'react'
import { User } from '../../types/user/user'
import { useGetUsersQuery, useDeleteUsersMutation } from '../../api/admin'

const UserManagement = () => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const { data: users } = useGetUsersQuery()
  const [deleteUsers] = useDeleteUsersMutation()

  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId))
    } else {
      setSelectedUserIds([...selectedUserIds, userId])
    }
  }

  const handleDeleteUsers = async () => {
    await deleteUsers(selectedUserIds.map(Number))
  }

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: User) => (
            <tr key={user.id}>
              <td><input type="checkbox" aria-label={`Select user ${user.name}`} checked={selectedUserIds.includes(user.id)} onChange={() => handleSelectUser(user.id)} /></td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDeleteUsers} disabled={selectedUserIds.length === 0}>Delete Selected Users</button>
    </div>
  )
}

export default UserManagement
