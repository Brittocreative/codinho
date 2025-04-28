// src/app/auth/profile/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assumindo que estamos usando shadcn/ui

interface UserProfile {
  rank_kyu: number;
  honra: number;
  bio: string;
  github_username: string;
  website: string;
  location: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setProfile(data);
          setFormData(data);
        } else {
          console.error("Erro ao carregar perfil:", error);
        }
      }
    }

    if (!loading) {
      loadProfile();
    }
  }, [user, loading, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.id) {
      const { error } = await supabase
        .from("users")
        .update(formData)
        .eq("id", user.id);

      if (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao atualizar perfil. Tente novamente.");
      } else {
        setProfile({ ...profile, ...formData } as UserProfile);
        setIsEditing(false);
        alert("Perfil atualizado com sucesso!");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p>Você precisa estar logado para acessar esta página.</p>
        <Button href="/auth/signin" className="mt-4">
          Entrar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>
      
      {!isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            {user.image && (
              <img 
                src={user.image} 
                alt={user.name || "Avatar"} 
                className="w-20 h-20 rounded-full mr-4"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          {profile && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-1">
                  <h3 className="font-medium text-blue-800">Rank</h3>
                  <p className="text-lg">{profile.rank_kyu} kyu</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg flex-1">
                  <h3 className="font-medium text-yellow-800">Honra</h3>
                  <p className="text-lg">{profile.honra} pontos</p>
                </div>
              </div>
              
              {profile.bio && (
                <div className="mt-4">
                  <h3 className="font-medium">Sobre</h3>
                  <p>{profile.bio}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {profile.github_username && (
                  <div>
                    <h3 className="font-medium">GitHub</h3>
                    <p>{profile.github_username}</p>
                  </div>
                )}
                {profile.website && (
                  <div>
                    <h3 className="font-medium">Website</h3>
                    <p>{profile.website}</p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <h3 className="font-medium">Localização</h3>
                    <p>{profile.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button onClick={() => setIsEditing(true)} className="mt-6">
            Editar Perfil
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="bio" className="block font-medium mb-1">Sobre</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            
            <div>
              <label htmlFor="github_username" className="block font-medium mb-1">GitHub Username</label>
              <input
                type="text"
                id="github_username"
                name="github_username"
                value={formData.github_username || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block font-medium mb-1">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block font-medium mb-1">Localização</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <Button type="submit">Salvar</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setFormData(profile || {});
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
