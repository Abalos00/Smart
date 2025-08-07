import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Mail } from 'lucide-react';
import { useData } from '../../context/DataContext';

const UserManagement = () => {
  const { users, setUsers } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'apicultor'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Editar usuario existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        nodes: []
      };
      setUsers([...users, newUser]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'apicultor' });
    setEditingUser(null);
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6 min-h-full flex flex-col">
      <div className="flex justify-between items-center text-left">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">Gestión de Usuarios</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 dark:bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 dark:hover:bg-emerald-700 transition-colors flex items-center space-x-2 text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 flex-1 min-h-[500px] flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 h-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nodos Asignados
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.filter(user => user.role !== 'admin').map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-yellow-600 dark:text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 dark:bg-emerald-100 text-yellow-800 dark:text-emerald-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.nodes?.length || 0} nodos
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-yellow-600 dark:text-emerald-600 hover:text-yellow-900 dark:hover:text-emerald-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="apicultor">Apicultor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 dark:bg-emerald-600 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-emerald-700 transition-colors"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;