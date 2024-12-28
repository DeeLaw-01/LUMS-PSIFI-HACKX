import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Startup, Product } from '@/types/startup'
import {
  Package,
  Plus,
  Upload,
  Loader2,
  Link as LinkIcon,
  MoreVertical,
  Pencil,
  Trash,
  
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
import { addProduct, updateProduct, deleteProduct } from '@/services/startupService'
import axios from 'axios'
import imageCompression from 'browser-image-compression'
import {Badge} from "../../../Components/ui/badge.tsx"

interface ProductsSectionProps {
  startup: Startup
  canManage: boolean
  onUpdate: () => void
}

const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const ProductsSection = ({ startup, canManage, onUpdate }: ProductsSectionProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    purchaseLink: ''
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

  const handleCreateProduct = async () => {
    try {
      setLoading(true)
      await addProduct(startup._id, {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined
      })
      setCreateDialogOpen(false)
      setFormData({
        name: '',
        description: '',
        image: '',
        price: '',
        purchaseLink: ''
      })
      onUpdate()
      toast({
        title: 'Success',
        description: 'Product created successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      setLoading(true)
      await updateProduct(startup._id, editingProduct._id, {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined
      })
      setEditingProduct(null)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Product updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      setLoading(true)
      await deleteProduct(startup._id, productId)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Product deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderProductForm = () => (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Name</label>
        <Input
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          placeholder='Enter product name'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Description</label>
        <Textarea
          name='description'
          value={formData.description}
          onChange={handleInputChange}
          placeholder='Describe your product...'
          rows={5}
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Product Image</label>
        <div className='flex items-center gap-4'>
          {formData.image ? (
            <div className='relative w-32 h-32'>
              <img
                src={formData.image}
                alt='Product'
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
        <label className='text-sm font-medium'>Price (Optional)</label>
        <Input
          name='price'
          type='number'
          value={formData.price}
          onChange={handleInputChange}
          placeholder='Enter price'
          min='0'
          step='0.01'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Purchase Link (Optional)</label>
        <Input
          name='purchaseLink'
          value={formData.purchaseLink}
          onChange={handleInputChange}
          placeholder='Enter purchase link'
          type='url'
        />
      </div>
    </div>
  )

  return (
    <div className='space-y-6'>
      {/* Products Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Products</h2>
          <p className='text-muted-foreground'>
            Products offered by {startup.displayName}
          </p>
        </div>
        {canManage && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <Plus className='w-4 h-4' />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your startup's showcase
                </DialogDescription>
              </DialogHeader>
              {renderProductForm()}
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  disabled={loading || !formData.name || !formData.description}
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    'Add Product'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {startup.products?.length === 0 ? (
          <Card className='col-span-full'>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No products yet</p>
              {canManage && (
                <p className='text-sm text-muted-foreground mt-1'>
                  Add your first product to showcase what you offer
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          startup.products?.map(product => (
            <Card key={product._id} className='overflow-hidden'>
              {product.image && (
                <div className='aspect-video w-full'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover'
                  />
                </div>
              )}
              <CardHeader className='relative'>
                {canManage && (
                  <div className='absolute right-4 top-4'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingProduct(product)
                            setFormData({
                              name: product.name,
                              description: product.description,
                              image: product.image || '',
                              price: product.price?.toString() || '',
                              purchaseLink: product.purchaseLink || ''
                            })
                          }}
                        >
                          <Pencil className='w-4 h-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash className='w-4 h-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  {product.price && (
                    <Badge variant='secondary'>
                      ${Number(product.price).toFixed(2)}
                    </Badge>
                  )}
                  {product.purchaseLink && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='gap-2'
                      onClick={() => window.open(product.purchaseLink, '_blank')}
                    >
                      <LinkIcon className='w-4 h-4' />
                      Purchase
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update your product's information
            </DialogDescription>
          </DialogHeader>
          {renderProductForm()}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingProduct(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProduct}
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

export default ProductsSection 