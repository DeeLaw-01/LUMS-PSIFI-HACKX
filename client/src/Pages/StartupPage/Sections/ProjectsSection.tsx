import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Startup, Project } from '@/types/startup'
import {
  Briefcase,
  Plus,
  Upload,
  Loader2,
  Link as LinkIcon,
  MoreVertical,
  Pencil,
  Trash,
  Calendar
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/Components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/Components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { Badge } from '@/Components/ui/badge'
import { addProject, updateProject, deleteProject } from '@/services/startupService'
import axios from 'axios'
import imageCompression from 'browser-image-compression'

interface ProjectsSectionProps {
  startup: Startup
  canManage: boolean
  onUpdate: () => void
}

const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const ProjectsSection = ({ startup, canManage, onUpdate }: ProjectsSectionProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    clientName: '',
    completionDate: '',
    testimonial: '',
    projectUrl: ''
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Image handling functions
  const validateImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File must be less than 10MB')
    }
  }

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('Error compressing image:', error)
      return file
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      validateImage(file)
      const compressedFile = await compressImage(file)
      
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData)
      
      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }))

      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  // CRUD operations
  const handleCreateProject = async () => {
    try {
      setLoading(true)
    //   @ts-ignore
      await addProject(startup._id, formData)
      setCreateDialogOpen(false)
      setFormData({
        name: '',
        description: '',
        image: '',
        clientName: '',
        completionDate: '',
        testimonial: '',
        projectUrl: ''
      })
      onUpdate()
      toast({
        title: 'Success',
        description: 'Project created successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProject = async () => {
    if (!editingProject) return

    try {
      setLoading(true)
    //   @ts-ignore
      await updateProject(startup._id, editingProject._id, formData)
      setEditingProject(null)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Project updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update project',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      setLoading(true)
      await deleteProject(startup._id, projectId)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Project deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderProjectForm = () => (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Project Name</label>
        <Input
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          placeholder='Enter project name'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Description</label>
        <Textarea
          name='description'
          value={formData.description}
          onChange={handleInputChange}
          placeholder='Describe your project...'
          rows={5}
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Project Image</label>
        <div className='flex items-center gap-4'>
          {formData.image ? (
            <div className='relative w-32 h-32'>
              <img
                src={formData.image}
                alt='Project'
                className='w-full h-full object-cover rounded-lg'
              />
              <button
                type='button'
                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                className='absolute top-1 right-1 p-1 bg-destructive rounded-full hover:bg-destructive/90'
              >
                <Trash className='w-4 h-4 text-white' />
              </button>
            </div>
          ) : (
            <label className='w-32 h-32 flex flex-col items-center justify-center border rounded-lg cursor-pointer hover:border-primary'>
              <input
                type='file'
                className='hidden'
                onChange={handleImageUpload}
                disabled={isUploading}
                accept='image/*'
              />
              {isUploading ? (
                <Loader2 className='w-6 h-6 animate-spin' />
              ) : (
                <>
                  <Upload className='w-6 h-6' />
                  <span className='text-xs mt-1'>Upload Image</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Client Name (Optional)</label>
        <Input
          name='clientName'
          value={formData.clientName}
          onChange={handleInputChange}
          placeholder='Enter client name'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Completion Date (Optional)</label>
        <Input
          name='completionDate'
          type='date'
          value={formData.completionDate}
          onChange={handleInputChange}
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Testimonial (Optional)</label>
        <Textarea
          name='testimonial'
          value={formData.testimonial}
          onChange={handleInputChange}
          placeholder='Add client testimonial...'
          rows={3}
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Project URL (Optional)</label>
        <Input
          name='projectUrl'
          value={formData.projectUrl}
          onChange={handleInputChange}
          placeholder='Enter project URL'
          type='url'
        />
      </div>
    </div>
  )

  return (
    <div className='space-y-6'>
      {/* Projects Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Projects</h2>
          <p className='text-muted-foreground'>
            Projects completed by {startup.displayName}
          </p>
        </div>
        {canManage && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <Plus className='w-4 h-4' />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your startup's portfolio
                </DialogDescription>
              </DialogHeader>
              {renderProjectForm()}
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={loading || !formData.name || !formData.description}
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    'Add Project'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Projects Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {startup.projects?.length === 0 ? (
          <Card className='col-span-full'>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No projects yet</p>
              {canManage && (
                <p className='text-sm text-muted-foreground mt-1'>
                  Add your first project to showcase your work
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          startup.projects?.map(project => (
            <Card key={project._id} className='flex flex-col'>
              {project.image && (
                <div className='relative aspect-video'>
                  <img
                    src={project.image}
                    // @ts-ignore
                    alt={project.name}
                    className='absolute inset-0 w-full h-full object-cover rounded-t-lg'
                  />
                </div>
              )}
              <CardHeader>
                <div className='flex items-center justify-between'>
                {/* @ts-ignore */}
                  <CardTitle className='text-xl'>{project.name}</CardTitle>
                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingProject(project)
                            setFormData({
                            // @ts-ignore
                              name: project.name,
                              description: project.description,
                              image: project.image || '',
                              clientName: project.clientName || '',
                              completionDate: project.completionDate
                                ? new Date(project.completionDate)
                                    .toISOString()
                                    .split('T')[0]
                                : '',
                              testimonial: project.testimonial || '',
                              projectUrl: project.projectUrl || ''
                            })
                          }}
                        >
                          <Pencil className='w-4 h-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          <Trash className='w-4 h-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <CardDescription className='line-clamp-2'>
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-1'>
                {project.clientName && (
                  <p className='text-sm text-muted-foreground mb-2'>
                    Client: {project.clientName}
                  </p>
                )}
                {project.completionDate && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                    <Calendar className='w-4 h-4' />
                    {new Date(project.completionDate).toLocaleDateString()}
                  </div>
                )}
                {project.testimonial && (
                  <blockquote className='border-l-2 pl-4 italic text-sm text-muted-foreground'>
                    "{project.testimonial}"
                  </blockquote>
                )}
              </CardContent>
              {project.projectUrl && (
                <CardFooter>
                  <Button
                    variant='outline'
                    className='w-full gap-2'
                    onClick={() => window.open(project.projectUrl, '_blank')}
                  >
                    <LinkIcon className='w-4 h-4' />
                    View Project
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project's information
            </DialogDescription>
          </DialogHeader>
          {renderProjectForm()}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingProject(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProject}
              disabled={loading || !formData.name || !formData.description}
            >
              {loading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectsSection 