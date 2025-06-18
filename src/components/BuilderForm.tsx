import { useState } from 'react'
import { User, Phone } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import type { Builder } from '../App'

interface BuilderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (builder: Omit<Builder, 'id'>) => void
}

export function BuilderForm({ open, onOpenChange, onSubmit }: BuilderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.contact.trim()) {
      // Basic validation, can be enhanced
      return
    }
    onSubmit(formData)
    // Reset form
    setFormData({ name: '', contact: '' })
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form when closing
    setFormData({ name: '', contact: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-slate-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white">
              <User className="w-4 h-4" />
            </div>
            Add New Builder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Builder Name */}
            <div className="space-y-2">
              <Label htmlFor="builderName" className="flex items-center gap-2 text-slate-700 font-medium">
                <User className="w-4 h-4" />
                Builder Name
              </Label>
              <Input
                id="builderName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., John Doe Construction"
                className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                required
              />
            </div>

            {/* Builder Contact */}
            <div className="space-y-2">
              <Label htmlFor="builderContact" className="flex items-center gap-2 text-slate-700 font-medium">
                <Phone className="w-4 h-4" />
                Builder Contact
              </Label>
              <Input
                id="builderContact"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="e.g., (555) 123-4567 or email@example.com"
                className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              Add Builder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}