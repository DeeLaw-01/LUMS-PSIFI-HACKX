import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import UserPosts from './Components/UserPosts.tsx';
import UserSettings from './Components/UserSettings.tsx';
import StartupManagement from './Components/StartupManagement.tsx';

const UserDashboard = () => {
  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold text-slate-200 mb-6">Dashboard</h1>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <UserPosts />
        </TabsContent>
        
        <TabsContent value="startups">
          <StartupManagement />
        </TabsContent>
        
        <TabsContent value="settings">
          <UserSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserDashboard 