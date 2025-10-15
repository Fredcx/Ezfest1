import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, User as UserIcon } from 'lucide-react';
import { User } from '@/entities/User';
import { format, parseISO } from 'date-fns';

export default function AccountModal({ isOpen, onClose, user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ full_name: '', cpf: '', birth_date: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({
        full_name: user.full_name || '',
        cpf: user.cpf || '',
        birth_date: user.birth_date || ''
      });
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(editedUser);
      const updatedUser = await User.me();
      onUserUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        full_name: user.full_name || '',
        cpf: user.cpf || '',
        birth_date: user.birth_date || ''
      });
    }
    setIsEditing(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Minha Conta</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10 text-[#7C9885]" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                {isEditing ? (
                  <Input
                    name="full_name"
                    value={editedUser.full_name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user?.full_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                {isEditing ? (
                  <Input
                    name="cpf"
                    value={editedUser.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user?.cpf || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de nascimento</label>
                {isEditing ? (
                  <Input
                    name="birth_date"
                    type="date"
                    value={editedUser.birth_date}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {user?.birth_date ? format(parseISO(user.birth_date), 'dd/MM/yyyy') : 'Não informado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{user?.email}</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              {isEditing ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={handleCancel} disabled={isSaving}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 btn-primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              ) : (
                <Button className="w-full btn-primary" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}