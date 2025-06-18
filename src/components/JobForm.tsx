import { useState } from 'react'

import { Home, Hash, MapPin, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import type { Job, JobStatus } from '../App'

interface JobFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function JobForm({ open, onOpenChange, onSubmit }: JobFormProps) {
  const [formData, setFormData] = useState({
    jobNumber: '',
    address: '',
    status: 'pending' as JobStatus,
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.jobNumber.trim() || !formData.address.trim()) {
      return
    }

    onSubmit({
      jobNumber: formData.jobNumber.trim(),
      address: formData.address.trim(),
      status: formData.status,
      notes: formData.notes.trim() || undefined,
    })

    // Reset form
    setFormData({
      jobNumber: '',
      address: '',
      status: 'pending',
      notes: '',
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form when closing
    setFormData({
      jobNumber: '',
      address: '',
      status: 'pending',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-slate-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
              <Home className="w-4 h-4" />
            </div>
            Create New Job
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Job Number */}
            <div className="space-y-2">
              <Label htmlFor="jobNumber" className="flex items-center gap-2 text-slate-700 font-medium">
                <Hash className="w-4 h-4" />
                Job Number
              </Label>
              <Input
                id="jobNumber"
                value={formData.jobNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, jobNumber: e.target.value }))}
                placeholder="e.g., PJ-2024-001"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 text-slate-700 font-medium">
                <MapPin className="w-4 h-4" />
                Property Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="e.g., 123 Main St, Anytown, USA"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-700 font-medium">
                <FileText className="w-4 h-4" />
                Initial Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: JobStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2 text-slate-700 font-medium">
                <FileText className="w-4 h-4" />
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional details about this job..."
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
                rows={4}
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              Create Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}